// Step 3 (optional): fetch licence + media details for the matched files
// (50 titles per request) into data/info.json, so the list can show licences
// and tell animated GIFs from still ones. Re-run match.mjs afterwards.
//
//   node scripts/commons/info.mjs
import path from "node:path";
import { api, DATA, readJson, sleep, writeJson } from "./lib.mjs";

const OUT = path.join(DATA, "info.json");
const info = readJson(OUT, {});
const matches = readJson(path.join(DATA, "matches.json"), {});
const MAX_PER_EXERCISE = 12;

const wanted = [...new Set(Object.values(matches).flatMap((m) => m.slice(0, MAX_PER_EXERCISE).map((h) => h.title)))]
  .filter((t) => !info[t]);
console.log(`${wanted.length} titles to look up`);

const strip = (v) => (v ? String(v.value).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "");
for (let i = 0; i < wanted.length; i += 50) {
  const j = api({
    action: "query", prop: "imageinfo", titles: wanted.slice(i, i + 50).join("|"),
    iiprop: "url|mime|size|extmetadata", iiextmetadatafilter: "LicenseShortName|Artist",
  });
  if (!j) continue;
  for (const p of j.query.pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    info[p.title] = {
      mime: ii.mime, width: ii.width, height: ii.height, duration: ii.duration || 0,
      license: strip(ii.extmetadata?.LicenseShortName),
      artist: strip(ii.extmetadata?.Artist).slice(0, 120),
      url: ii.url.split("?")[0],
    };
  }
  writeJson(OUT, info);
  console.log(`  ${Math.min(i + 50, wanted.length)}/${wanted.length}`);
  sleep(4000);
}
