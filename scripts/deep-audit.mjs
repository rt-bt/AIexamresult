import fs from 'fs';
import https from 'https';
import http from 'http';

const stations = JSON.parse(fs.readFileSync('./data/radio-stations.json', 'utf8'));

async function testStationStrict(station) {
  return new Promise((resolve) => {
    let currentUrl = station.streamUrl;
    let redirectCount = 0;
    const maxRedirects = 3;

    function doRequest(urlToFetch) {
      if (redirectCount > maxRedirects) {
        return resolve({ slug: station.slug, name: station.name, ok: false, reason: 'Too many redirects' });
      }

      let parsed;
      try {
        parsed = new URL(urlToFetch);
      } catch (e) {
        return resolve({ slug: station.slug, name: station.name, ok: false, reason: 'Invalid URL' });
      }

      // Check protocol: HTTP cannot be loaded on HTTPS
      if (parsed.protocol === 'http:') {
        return resolve({ slug: station.slug, name: station.name, ok: false, reason: 'Mixed Content (HTTP on HTTPS)' });
      }

      const client = https;
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        req.destroy();
        resolve({ slug: station.slug, name: station.name, ok: false, reason: 'Timeout (7s)' });
      }, 7000);

      const req = client.get(urlToFetch, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Origin': 'https://www.aiexamresult.com',
          'Referer': 'https://www.aiexamresult.com/radio'
        }
      }, (res) => {
        clearTimeout(timer);

        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          redirectCount++;
          const nextUrl = new URL(res.headers.location, urlToFetch).toString();
          res.destroy();
          return doRequest(nextUrl);
        }

        const ct = res.headers['content-type'] || '';
        const status = res.statusCode;

        if (status >= 200 && status < 300) {
          // Check if content-type is audio or playlist or binary stream
          const isAudioType = ct.includes('audio') || 
                              ct.includes('mpegurl') || 
                              ct.includes('octet-stream') || 
                              ct.includes('video/mp2t') ||
                              ct.includes('aac') ||
                              ct.includes('mp3') ||
                              ct.includes('ogg') ||
                              ct === '';
          if (isAudioType || status === 200 || status === 206) {
            res.destroy();
            return resolve({
              slug: station.slug,
              name: station.name,
              ok: true,
              status,
              finalUrl: urlToFetch,
              contentType: ct,
              cors: res.headers['access-control-allow-origin'] || 'none'
            });
          }
        }

        res.destroy();
        resolve({
          slug: station.slug,
          name: station.name,
          ok: false,
          status,
          reason: `HTTP ${status} (ContentType: ${ct})`
        });
      });

      req.on('error', (err) => {
        clearTimeout(timer);
        resolve({
          slug: station.slug,
          name: station.name,
          ok: false,
          reason: err.message
        });
      });
    }

    doRequest(currentUrl);
  });
}

async function run() {
  console.log(`Running deep strict audit for ${stations.length} stations...`);
  const results = [];
  for (let i = 0; i < stations.length; i += 10) {
    const chunk = stations.slice(i, i + 10);
    const chunkRes = await Promise.all(chunk.map(testStationStrict));
    results.push(...chunkRes);
    process.stdout.write(`Done ${results.length}/${stations.length}\n`);
  }

  const working = results.filter(r => r.ok);
  const broken = results.filter(r => !r.ok);

  console.log('\n=======================================');
  console.log(`TOTAL: ${stations.length}`);
  console.log(`WORKING: ${working.length}`);
  console.log(`BROKEN: ${broken.length}`);
  console.log('=======================================\n');

  console.log('BROKEN STATIONS LIST:');
  broken.forEach((b, idx) => {
    console.log(`${idx + 1}. [${b.slug}] "${b.name}": ${b.reason}`);
  });

  fs.writeFileSync('./scripts/deep-audit-results.json', JSON.stringify({ working, broken }, null, 2));
}

run();
