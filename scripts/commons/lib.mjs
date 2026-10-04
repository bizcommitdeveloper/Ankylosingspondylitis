// Shared helpers for the Wikimedia Commons media research scripts.
// Commons rate-limits this kind of traffic hard (often only a few requests per
// minute from shared cloud IPs), so every call is sequential, throttled and
// honours Retry-After.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, "../..");
export const DATA = path.join(HERE, "data");
// Identify the client with a contact URL (Wikimedia policy). Don't put personal
// emails here.
const UA = "PhysiosolutionExercises/1.0 (https://github.com/bizcommitdeveloper/Ankylosingspondylitis)";

export const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
export const readJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback);
export const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 1) + "\n");
export const exercises = () => readJson(path.join(REPO, "src/data/exercises.json")).exercises;

// GET the Commons Action API. Uses curl so the environment's HTTPS proxy is
// respected. Returns parsed JSON, or null after repeated failures.
export function api(params) {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", maxlag: "5", ...params });
  const url = "https://commons.wikimedia.org/w/api.php?" + qs;
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const raw = execFileSync("curl", ["-sS", "--max-time", "60", "-D", "-", "-A", UA, url], {
        encoding: "utf8",
        maxBuffer: 64 << 20,
      });
      const sep = raw.lastIndexOf("\r\n\r\n");
      const head = raw.slice(0, sep);
      const body = raw.slice(sep + 4);
      const status = Number((head.match(/HTTP\/[\d.]+ (\d{3})(?![\s\S]*HTTP\/)/) || [])[1]);
      if (status === 429 || status >= 500) {
        const retryAfter = Number((head.match(/retry-after:\s*(\d+)/i) || [])[1]) || 30;
        throw Object.assign(new Error(`HTTP ${status}`), { wait: (retryAfter + 2) * 1000 });
      }
      const json = JSON.parse(body);
      if (json.error?.code === "maxlag") throw Object.assign(new Error("maxlag"), { wait: 10000 });
      if (json.error) {
        console.log("  API error:", JSON.stringify(json.error).slice(0, 200));
        return null;
      }
      return json;
    } catch (e) {
      const wait = e.wait || 15000;
      console.log(`  ${e.message}; waiting ${wait / 1000}s`);
      sleep(wait);
    }
  }
  return null;
}
