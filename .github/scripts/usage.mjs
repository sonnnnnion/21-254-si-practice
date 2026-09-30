// Usage snapshot for the Walkthroughs page. Reads GoatCounter's public count feed (the same numbers the page
// would fetch itself) and writes one JSON file. A scheduled GitHub Action publishes it to the `usage-data`
// branch, and the page loads it from raw.githubusercontent.com, which ad and tracker blockers leave alone
// (they block goatcounter.com, so the page's own live requests fail in e.g. Brave).
//   node .github/scripts/usage.mjs <site folder> <output file>
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
const SITE = "https://mbocksta.goatcounter.com", root = process.argv[2] || ".", out = process.argv[3] || "usage.json";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ids = readdirSync(root + "/data").filter(f => f.endsWith(".json")).sort()
  .flatMap(f => JSON.parse(readFileSync(root + "/data/" + f, "utf8")).problems.map(p => p.id));
const html = readFileSync(root + "/index.html", "utf8");
const vz = [...html.matchAll(/vzAdd\(\{\n  id: "([a-z]+)"/g)].map(m => m[1]);
const kinds = [...(html.match(/const REPORT_KINDS = \{([\s\S]*?)\};/) || [, ""])[1].matchAll(/^\s*(\w+):/gm)].map(m => m[1]);

async function count(path, query = "") {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(SITE + "/counter/" + encodeURIComponent(path) + ".json" + query, { headers: { "User-Agent": "21-254 Practice Lab usage snapshot" } });
    if (r.status === 404) return 0;                                   // never visited (in that range)
    if (r.ok) { const j = await r.json(); return +String(j.count ?? 0).replace(/[^\d]/g, "") || 0; }
    await sleep(800 * (attempt + 1));
  }
  throw new Error("GoatCounter did not answer for " + path);
}
async function pool(items, fn, n = 6) {                              // a few requests at a time
  const res = new Array(items.length); let k = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (k < items.length) { const i = k++; res[i] = await fn(items[i]); } }));
  return res;
}
const sum = async paths => (await pool(paths, p => count(p))).reduce((a, b) => a + b, 0);

// the last eight weeks, Monday to Sunday, by the date in Pittsburgh
const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date()).split("-").map(Number);
const today = Date.UTC(y, m - 1, d, 12), dow = (new Date(today).getUTCDay() + 6) % 7, monday = today - dow * 864e5;
const ymd = t => new Date(t).toISOString().slice(0, 10);
const weeks = Array.from({ length: 8 }, (_, i) => monday - (7 - i) * 7 * 864e5);

const home = await count("/home");
const weekly = await pool(weeks, a => count("/home", "?start=" + ymd(a) + "&end=" + ymd(a + 6 * 864e5)));
const qr = await count("/si-qr");
const perList = await pool(ids, id => count("/problem/" + id));
const per = Object.fromEntries(ids.map((id, i) => [id, perList[i]]));
const areas = [
  await count("/topics"),
  await sum(Array.from({ length: 10 }, (_, i) => "/section/" + (i + 1))),
  await count("/exam"), await count("/exam/run/1"), await count("/review"),
  await sum(["/visualize"].concat(vz.map(v => "/visualize/" + v))),
  await sum(["/walkthroughs"].concat(Array.from({ length: 22 }, (_, i) => "/walkthroughs/si-" + String(i + 1).padStart(2, "0")))),
];
const repTotals = await pool(ids, id => count("report/" + id));
const reports = [];
for (let i = 0; i < ids.length; i++) if (repTotals[i] > 0) {
  const k = await pool(kinds, kd => count("report/" + ids[i] + "/" + kd));
  reports.push({ id: ids[i], n: repTotals[i], kinds: Object.fromEntries(kinds.map((kd, j) => [kd, k[j]]).filter(([, c]) => c > 0)) });
}
const data = { updated: new Date().toISOString(), home, qr, per, weekly, weeks, areas, reports };
writeFileSync(out, JSON.stringify(data));
console.log(`home ${home}, problem views ${perList.reduce((a, b) => a + b, 0)}, reports ${reports.length}, weekly ${weekly.join(" ")}`);
