import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");

/**
 * Turbopack resolves `.tsx` / `.ts` in source; `tsc` may emit the same in `.d.ts`.
 * Node-style typings expect `.js` specifiers next to `.d.ts` files.
 */
function rewriteFile(filePath) {
  let text = fs.readFileSync(filePath, "utf8");
  const next = text.replaceAll(
    /from "((?:\.\/|\.\.\/)[^"]+?)\.(?:tsx|ts)"/g,
    'from "$1.js"',
  );
  if (next !== text) fs.writeFileSync(filePath, next);
}

function walkDir(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walkDir(p);
    else if (name.name.endsWith(".d.ts")) rewriteFile(p);
  }
}

walkDir(distDir);
