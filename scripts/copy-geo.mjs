// Copies the self-hosted US states TopoJSON from the us-atlas package into
// /public so the routes map can load it without any external network calls.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const src = resolve(root, "node_modules/us-atlas/states-10m.json");
const dest = resolve(root, "public/geo/us-states-10m.json");

try {
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log(`[copy-geo] ${src} -> ${dest}`);
} catch (err) {
  console.error("[copy-geo] failed:", err.message);
  process.exit(1);
}
