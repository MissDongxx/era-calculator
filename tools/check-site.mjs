import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const htmlFiles = [];

async function walk(dir) {
  for (const entry of await readdir(dir)) {
    if (entry.startsWith(".") || entry === "node_modules") continue;
    const path = join(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    if (info.isFile() && entry.endsWith(".html")) htmlFiles.push(path);
  }
}

await walk(root);

const required = ["<title>", 'rel="canonical"', 'application/ld+json'];
const failures = [];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const token of required) {
    if (!html.toLowerCase().includes(token.toLowerCase())) failures.push(`${file} missing ${token}`);
  }
}

if (htmlFiles.length < 7) failures.push(`Expected at least 7 HTML pages, found ${htmlFiles.length}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML pages.`);
