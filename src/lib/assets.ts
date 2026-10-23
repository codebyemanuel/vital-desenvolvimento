import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

// Evita requisições quebradas enquanto os arquivos oficiais aguardam importação.
export function hasAsset(src: string): boolean {
  if (!src.startsWith("/") || src.includes("..")) return false;
  return existsSync(path.join(process.cwd(), "public", src));
}
