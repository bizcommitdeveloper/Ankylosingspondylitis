// Step 1: build a pool of exercise-related file titles from Wikimedia Commons
// with a few bulk searches (500 titles per request). Resumable: completed
// queries are cached in data/pool.json and skipped on the next run.
//
//   node scripts/commons/pool.mjs
import path from "node:path";
import { api, DATA, readJson, sleep, writeJson } from "./lib.mjs";

const OUT = path.join(DATA, "pool.json");

// [search, max results]. File namespace; CirrusSearch syntax.
const FILE_QUERIES = [
  ["everkinetic", 1500], // Everkinetic exercise drawings (CC BY-SA 3.0)
  ['"strength training for older adults"', 500], // CDC animations (public domain)
  ["filemime:image/gif exercise", 1500],
  ["filemime:image/gif stretch", 500],
  ["filemime:image/gif stretching", 500],
  ["filemime:image/gif physiotherapy", 500],
  ['filemime:image/gif "physical therapy"', 500],
  ["filemime:image/gif workout", 500],
  ["filemime:image/gif yoga", 500],
  ["filetype:video exercise", 1000],
  ["filetype:video physiotherapy", 500],
  ["filetype:video stretching", 500],
  ["filetype:drawing exercise", 1000],
  ["filetype:drawing stretch", 500],
  ["filetype:drawing physiotherapy", 500],
  ["filetype:drawing yoga", 500],
  ['"physical readiness training"', 1000],
  ["Go4Life", 500],
  ['"National Institute on Aging" exercise', 500],
  ["physiotherapy exercise -filetype:office", 1000],
  ['"physical therapy" exercise -filetype:office', 1000],
  ["rehabilitation exercise -filetype:office", 500],
  ["pilates -filetype:office", 500],
  ['kegel OR "pelvic floor" -filetype:office', 500],
  ['"breathing exercise" -filetype:office', 500],
  // Cancer Research UK diagrams (CC BY-SA 4.0) include rehab exercises.
  ['CRUK "Diagram showing" exercise', 1000],
  ["CRUK stretch", 500],
  ["CRUK breathing", 500],
  ['CRUK "pelvic floor"', 500],
  ["CRUK leg exercise", 500],
  ["CRUK arm exercise", 500],
  // Hatha-yoga warm-up drawing series and asana names matching our exercises.
  ["hatayoga", 500],
  ["Balasana -filetype:office", 200],
  ["Marjaryasana OR Bitilasana -filetype:office", 200],
  ["Bhujangasana -filetype:office", 200],
  ["Apanasana OR Pavanamuktasana -filetype:office", 200],
  ['"Supta Matsyendrasana" OR "supine twist" -filetype:office', 200],
  ['"Setu Bandha" -filetype:office', 200],
];

const pool = readJson(OUT, { queries: {} });
for (const [q, cap] of FILE_QUERIES) {
  if (pool.queries[q]?.complete) continue;
  const titles = [];
  let offset = 0;
  let total = 0;
  while (offset < cap) {
    const j = api({
      action: "query", list: "search", srnamespace: "6", srlimit: "500",
      sroffset: String(offset), srprop: "", srinfo: "totalhits", srsearch: q,
    });
    if (!j) break;
    total = j.query.searchinfo?.totalhits ?? total;
    titles.push(...j.query.search.map((s) => s.title));
    if (!j.continue) break;
    offset = j.continue.sroffset;
    sleep(4000);
  }
  pool.queries[q] = { total, titles, complete: true };
  writeJson(OUT, pool);
  console.log(`${q} -> ${titles.length} of ${total}`);
  sleep(4000);
}
const unique = new Set(Object.values(pool.queries).flatMap((v) => v.titles));
console.log(`pool: ${unique.size} unique file titles`);
