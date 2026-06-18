package com.aiexamresult.app;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        prefs = getSharedPreferences("aiexam", MODE_PRIVATE);

        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("https://www.aiexamresult.com");
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_sync) {
            String token = prefs.getString("github_token", "");
            if (token.isEmpty()) {
                showTokenDialog();
            } else {
                new SyncTask(MainActivity.this, token).execute();
            }
            return true;
        }
        if (id == R.id.action_settings) {
            showTokenDialog();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void showTokenDialog() {
        String currentToken = prefs.getString("github_token", "");
        EditText input = new EditText(this);
        input.setText(currentToken);
        input.setHint("Enter GitHub PAT (repo scope)");
        input.setSelection(input.getText().length());

        new AlertDialog.Builder(this)
                .setTitle("GitHub Token")
                .setMessage("Create at github.com/settings/tokens (classic, repo scope)")
                .setView(input)
                .setPositiveButton("Save", (d, w) -> {
                    String token = input.getText().toString().trim();
                    prefs.edit().putString("github_token", token).apply();
                    if (!token.isEmpty()) {
                        Toast.makeText(this, "Token saved", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    // ── Sync Engine ────────────────────────────────────────────────

    private static class SyncTask extends AsyncTask<Void, String, String> {
        private final Context ctx;
        private final String token;
        private AlertDialog progressDialog;
        private TextView progressText;
        private boolean cancelled;

        SyncTask(Context ctx, String token) {
            this.ctx = ctx;
            this.token = token;
        }

        @Override
        protected void onPreExecute() {
            LinearLayout layout = new LinearLayout(ctx);
            layout.setOrientation(LinearLayout.VERTICAL);
            layout.setPadding(50, 30, 50, 30);

            progressText = new TextView(ctx);
            progressText.setText("Starting sync...");
            progressText.setTextSize(14);
            layout.addView(progressText);

            ScrollView sv = new ScrollView(ctx);
            sv.addView(layout);
            sv.setLayoutParams(new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, 400));

            progressDialog = new AlertDialog.Builder(ctx)
                    .setTitle("Syncing SarkariResult")
                    .setView(sv)
                    .setCancelable(true)
                    .setNegativeButton("Cancel", (d, w) -> {
                        cancelled = true;
                        cancel(true);
                    })
                    .show();

            // Also reload webview to show latest
            // (will be refreshed after sync)
        }

        @Override
        protected String doInBackground(Void... voids) {
            try {
                return runSync();
            } catch (Exception e) {
                return "ERROR: " + e.getMessage();
            }
        }

        private String runSync() throws Exception {
            publishProgress("Fetching sarkariresult.com listings...");

            Document homeDoc = Jsoup.connect("https://www.sarkariresult.com/")
                    .userAgent("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36")
                    .timeout(15000)
                    .get();

            // Get "View More" button paths for category mapping
            List<String> viewMorePaths = new ArrayList<>();
            for (Element a : homeDoc.select("a.gb-button")) {
                if (a.text().trim().toLowerCase().equals("view more")) {
                    String href = a.attr("href");
                    if (href != null && !href.isEmpty()) {
                        String path = href.replaceAll("https?://[^/]+/", "").replaceAll("/$", "");
                        viewMorePaths.add(path);
                    }
                }
            }

            Map<String, String> CATEGORY_MAP = new HashMap<>();
            CATEGORY_MAP.put("result", "results");
            CATEGORY_MAP.put("admitcard", "admitCards");
            CATEGORY_MAP.put("latestjob", "latestJobs");
            CATEGORY_MAP.put("answerkey", "answerKeys");
            CATEGORY_MAP.put("admission", "admissions");

            // Parse items from each container
            Map<String, List<Map<String, String>>> freshItems = new HashMap<>();
            freshItems.put("results", new ArrayList<>());
            freshItems.put("admitCards", new ArrayList<>());
            freshItems.put("latestJobs", new ArrayList<>());
            freshItems.put("answerKeys", new ArrayList<>());
            freshItems.put("documents", new ArrayList<>());
            freshItems.put("admissions", new ArrayList<>());

            Elements containers = homeDoc.select("div[class*=gb-container]");
            int containerIdx = 0;
            Set<String> seen = new HashSet<>();

            for (Element container : containers) {
                Elements postLinks = container.select("a[href]");
                List<Element> filtered = new ArrayList<>();
                for (Element a : postLinks) {
                    if (a.text().trim().length() > 15) filtered.add(a);
                }
                if (filtered.size() < 3) continue;

                String vmPath = containerIdx < viewMorePaths.size() ? viewMorePaths.get(containerIdx) : "";
                String category = CATEGORY_MAP.getOrDefault(vmPath, "");
                containerIdx++;

                if (category.isEmpty()) continue;

                for (Element a : filtered) {
                    String url = a.attr("abs:href");
                    if (url == null || url.isEmpty() || seen.contains(url)) continue;
                    seen.add(url);
                    String title = a.text().trim();
                    String slug = url.replaceAll("/$", "");
                    slug = slug.substring(slug.lastIndexOf('/') + 1);
                    if (slug.isEmpty()) {
                        slug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
                    }
                    Map<String, String> item = new HashMap<>();
                    item.put("title", title);
                    item.put("url", url);
                    item.put("category", category);
                    item.put("slug", slug);
                    freshItems.get(category).add(item);
                }
            }

            publishProgress("Loading existing data from GitHub...");

            // Fetch existing data
            String existingRaw = fetchUrl("https://raw.githubusercontent.com/rt-bt/AIexamresult/main/data/scraped-data.ts");
            JSONObject existing = parseScrapedData(existingRaw);

            // Build set of existing URLs
            Set<String> existingUrls = new HashSet<>();
            String[] cats = {"results", "admitCards", "latestJobs", "answerKeys", "documents", "admissions"};
            for (String cat : cats) {
                if (existing.has(cat)) {
                    JSONArray arr = existing.getJSONArray(cat);
                    for (int i = 0; i < arr.length(); i++) {
                        JSONObject item = arr.getJSONObject(i);
                        String u = item.optString("url", "").replaceAll("/$", "");
                        if (!u.isEmpty()) existingUrls.add(u);
                    }
                }
            }

            // Find new items
            int newCount = 0;
            for (String cat : cats) {
                JSONArray existingArr = existing.optJSONArray(cat);
                if (existingArr == null) {
                    existingArr = new JSONArray();
                    existing.put(cat, existingArr);
                }
                for (Map<String, String> item : freshItems.get(cat)) {
                    String url = item.get("url").replaceAll("/$", "");
                    if (!existingUrls.contains(url)) {
                        JSONObject jItem = new JSONObject();
                        jItem.put("title", item.get("title"));
                        jItem.put("url", item.get("url"));
                        jItem.put("category", item.get("category"));
                        jItem.put("slug", item.get("slug"));
                        existingArr.put(jItem);
                        existingUrls.add(url); // mark to avoid duplicates
                        newCount++;
                    }
                }
            }

            if (newCount == 0) {
                return "Data is already up to date.";
            }

            // Ensure posts object exists
            JSONObject posts = existing.optJSONObject("posts");
            if (posts == null) {
                posts = new JSONObject();
                existing.put("posts", posts);
            }

            // Scrape details for new items
            int detailCount = 0;
            for (String cat : cats) {
                JSONArray arr = existing.getJSONArray(cat);
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject item = arr.getJSONObject(i);
                    if (item.has("_processed")) continue;
                    String url = item.optString("url", "").replaceAll("/$", "");
                    if (!existingUrls.contains(url)) continue; // not new
                    existingUrls.remove(url);
                    item.put("_processed", true);

                    String title = item.optString("title", "Post");
                    publishProgress("Scraping: " + (title.length() > 50 ? title.substring(0, 50) + "..." : title));

                    Map<String, Object> detail = scrapePostDetail(item.optString("url", ""));
                    if (detail != null) {
                        String slug = sanitizeSlug((String) detail.get("slug"));
                        detail.put("slug", slug);
                        item.put("publishedDate", detail.get("publishedDate"));
                        item.put("slug", slug);

                        JSONObject postJson = new JSONObject();
                        postJson.put("title", detail.get("title"));
                        postJson.put("slug", slug);
                        postJson.put("url", detail.get("url"));
                        postJson.put("category", item.optString("category", ""));
                        postJson.put("publishedDate", detail.get("publishedDate"));
                        postJson.put("intro", detail.get("intro"));
                        postJson.put("importantDates", detail.get("importantDates"));
                        postJson.put("applicationFee", detail.get("applicationFee"));
                        postJson.put("importantLinks", detail.get("importantLinks"));
                        postJson.put("fullContentHtml", detail.get("fullContentHtml"));

                        posts.put(slug, postJson);
                        detailCount++;
                    }

                    if (cancelled) return "Cancelled after scraping " + detailCount + " items.";
                }
            }

            // Update fetchedAt
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            existing.put("fetchedAt", sdf.format(new Date()));

            // Remove _processed marker
            for (String cat : cats) {
                JSONArray arr = existing.getJSONArray(cat);
                for (int i = 0; i < arr.length(); i++) {
                    arr.getJSONObject(i).remove("_processed");
                }
            }

            publishProgress("Pushing " + detailCount + " new items to GitHub...");

            int pushed = pushToGitHub(existing, posts);
            if (pushed > 0) {
                return "Sync complete! Added " + newCount + " new items, scraped " + detailCount + " details, pushed " + pushed + " files.";
            } else {
                return "Failed to push to GitHub. Check your token.";
            }
        }

        private Map<String, Object> scrapePostDetail(String url) {
            Map<String, Object> result = new HashMap<>();
            try {
                Document doc = Jsoup.connect(url)
                        .userAgent("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36")
                        .timeout(15000)
                        .get();

                String title = doc.select("h1").first() != null ?
                        doc.select("h1").first().text().trim() :
                        doc.title().trim();

                String[] parts = url.replaceAll("/$", "").split("/");
                String slugVal = parts.length > 0 ? parts[parts.length - 1].replaceAll("\\.html?$", "") : "post";
                if (slugVal.isEmpty()) slugVal = "post";

                String publishedDate = "";
                Element metaDate = doc.select("meta[property='article:published_time']").first();
                if (metaDate != null) {
                    String dateStr = metaDate.attr("content");
                    if (!dateStr.isEmpty()) {
                        try {
                            SimpleDateFormat isoIn = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US);
                            Date d = isoIn.parse(dateStr);
                            if (d == null) {
                                // try without timezone
                                isoIn = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
                                d = isoIn.parse(dateStr);
                            }
                            if (d != null) {
                                SimpleDateFormat out = new SimpleDateFormat("dd MMMM yyyy", Locale.US);
                                publishedDate = out.format(d);
                            }
                        } catch (Exception ignored) {}
                    }
                }

                // Find intro from "Short Information" table
                String intro = "";
                Elements headings = doc.select("h3, strong, b");
                for (Element el : headings) {
                    String text = el.text().trim().toLowerCase();
                    if (text.contains("short information") || text.contains("brief information")) {
                        Element parent = el.parent();
                        Element next = parent != null ? parent.nextElementSibling() : null;
                        if (next != null && next.is("p")) {
                            intro = next.text().trim();
                        }
                        if (intro.isEmpty()) {
                            Element closestDiv = el.closest("div");
                            if (closestDiv != null) {
                                Element firstP = closestDiv.select("p").first();
                                if (firstP != null) intro = firstP.text().trim();
                            }
                        }
                        break;
                    }
                }
                if (intro.isEmpty()) {
                    Element firstContentP = doc.select(".entry-content p").first();
                    if (firstContentP != null) {
                        String t = firstContentP.text().trim();
                        intro = t.length() > 300 ? t.substring(0, 300) : t;
                    }
                }

                // Important dates from tables
                JSONArray importantDates = new JSONArray();
                Elements tables = doc.select("table");
                for (Element table : tables) {
                    for (Element row : table.select("tr")) {
                        Elements cells = row.select("td, th");
                        if (cells.size() >= 2) {
                            String first = cells.get(0).text().trim().toLowerCase();
                            String second = cells.get(1).text().trim();
                            if (!first.isEmpty() && !second.isEmpty() &&
                                    (first.contains("date") || first.contains("fee") ||
                                     first.contains("age") || first.contains("exam"))) {
                                importantDates.put(cells.get(0).text().trim() + " : " + second);
                            }
                        }
                    }
                }

                // Important links
                JSONArray importantLinks = new JSONArray();
                Elements links = doc.select("table a, .entry-content a");
                for (Element link : links) {
                    String label = link.text().trim();
                    String href = link.attr("href");
                    if (!label.isEmpty() && !href.isEmpty() && !href.equals("#") && !href.startsWith("javascript")) {
                        JSONObject l = new JSONObject();
                        l.put("label", label);
                        l.put("url", href);
                        importantLinks.put(l);
                    }
                }

                // Full content HTML
                String fullContentHtml = "";
                Element entryContent = doc.selectFirst(".entry-content");
                if (entryContent != null) {
                    fullContentHtml = entryContent.html();
                }

                result.put("title", title);
                result.put("slug", slugVal);
                result.put("url", url);
                result.put("publishedDate", publishedDate);
                result.put("intro", intro);
                result.put("importantDates", importantDates);
                result.put("applicationFee", new JSONArray());
                result.put("importantLinks", importantLinks);
                result.put("fullContentHtml", fullContentHtml);

            } catch (Exception e) {
                return null;
            }
            return result;
        }

        private String sanitizeSlug(String s) {
            return s.replaceAll("[<>:\"/\\\\|?*]+", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
        }

        private JSONObject parseScrapedData(String raw) throws Exception {
            String json = raw
                    .replaceFirst("^//.*[\r\n]+", "")
                    .replaceFirst("^export const scrapedData = ", "")
                    .replaceFirst("\\s*as const\\s*;\\s*$", "")
                    .replaceFirst(";\\s*$", "")
                    .trim();
            return new JSONObject(json);
        }

        private String fetchUrl(String urlStr) throws Exception {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            reader.close();
            return sb.toString();
        }

        private int pushToGitHub(JSONObject scrapedData, JSONObject posts) throws Exception {
            int pushed = 0;

            // Update scraped-data.ts
            String tsContent = "// Auto-generated by mobile sync - DO NOT EDIT\nexport const scrapedData = " +
                    scrapedData.toString(2) + ";\n";

            // Get SHA of current file
            String sha = getGitSha("data/scraped-data.ts");
            if (sha != null) {
                boolean ok = putGitFile("data/scraped-data.ts", tsContent, sha,
                        "Mobile sync: updated scraped-data.ts");
                if (ok) pushed++;
            }

            // Push each new post JSON
            java.util.Iterator<String> keys = posts.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                if (cancelled) break;
                JSONObject post = posts.getJSONObject(key);
                String postContent = post.toString(2);
                String path = "data/posts/" + key + ".json";

                // Check if file exists
                String postSha = getGitSha(path);
                boolean ok = putGitFile(path, postContent, postSha,
                        "Mobile sync: added post " + key);
                if (ok) pushed++;
            }

            return pushed;
        }

        private String getGitSha(String path) throws Exception {
            String urlStr = "https://api.github.com/repos/rt-bt/AIexamresult/contents/" + path;
            HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("User-Agent", "aiexamresult-app");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            int code = conn.getResponseCode();
            if (code == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
                reader.close();
                JSONObject json = new JSONObject(sb.toString());
                return json.optString("sha", null);
            } else if (code == 404) {
                return null; // file doesn't exist yet
            } else {
                publishProgress("GitHub API error " + code + " for " + path);
                return null;
            }
        }

        private boolean putGitFile(String path, String content, String sha, String message) throws Exception {
            String urlStr = "https://api.github.com/repos/rt-bt/AIexamresult/contents/" + path;
            JSONObject body = new JSONObject();
            body.put("message", message);
            body.put("content", android.util.Base64.encodeToString(content.getBytes("UTF-8"), android.util.Base64.NO_WRAP));
            if (sha != null) {
                body.put("sha", sha);
            }

            HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
            conn.setRequestMethod("PUT");
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("User-Agent", "aiexamresult-app");
            conn.setDoOutput(true);
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);

            OutputStream os = conn.getOutputStream();
            os.write(body.toString().getBytes("UTF-8"));
            os.close();

            int code = conn.getResponseCode();
            if (code == 200 || code == 201) {
                return true;
            } else {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
                reader.close();
                publishProgress("PUT failed (" + code + ") for " + path + ": " + sb.toString());
                return false;
            }
        }

        @Override
        protected void onProgressUpdate(String... values) {
            if (progressText != null) {
                progressText.setText(values[0]);
            }
        }

        @Override
        protected void onPostExecute(String result) {
            if (progressDialog != null && progressDialog.isShowing()) {
                progressDialog.dismiss();
            }
            Toast.makeText(ctx, result, Toast.LENGTH_LONG).show();

            // If successful, refresh the WebView
            if (result.startsWith("Sync complete")) {
                // Trigger a message to the parent activity to refresh
                if (ctx instanceof MainActivity) {
                    ((MainActivity) ctx).refreshWebView();
                }
            }
        }
    }

    private void refreshWebView() {
        webView.loadUrl("https://www.aiexamresult.com");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
