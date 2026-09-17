export const INDEXNOW_KEY = "def212d6b0d3407cb3a51212813102f4";
const HOST = "www.aiexamresult.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; count: number; error?: string }> {
  if (!urls || urls.length === 0) {
    return { success: false, count: 0, error: "No URLs provided" };
  }

  // Ensure all URLs are absolute
  const normalizedUrls = urls.map((u) => {
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return `https://${HOST}${u.startsWith("/") ? "" : "/"}${u}`;
  });

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: normalizedUrls.slice(0, 10000), // IndexNow allows up to 10k per batch
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      return { success: true, count: normalizedUrls.length };
    } else {
      const text = await res.text().catch(() => "");
      return { success: false, count: 0, error: `IndexNow API status ${res.status}: ${text}` };
    }
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || "Network error" };
  }
}
