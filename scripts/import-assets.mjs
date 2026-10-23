import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { slugs, photoPath, logoPath } from "./asset-manifest.mjs";

// Uso: npm run assets:import -- /caminho/manifesto.json
// Cada unidade aponta explicitamente para { photo, logo }. Não há inferência visual.
const manifestPath = process.argv[2];
if (!manifestPath) throw new Error("Informe um manifesto JSON. Consulte docs/ASSETS.md.");
const base = path.dirname(path.resolve(manifestPath));
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const operations = [];
const records = [];
const digest = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

for (const slug of slugs) {
  for (const kind of ["photo", "logo"]) {
    const filename = manifest[slug]?.[kind];
    if (typeof filename !== "string" || !filename.trim()) throw new Error(`Arquivo obrigatório ausente: ${slug}.${kind}`);
    const input = path.resolve(base, filename);
    const extension = path.extname(input).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"].includes(extension) || (kind === "photo" && extension === ".svg")) {
      throw new Error(`Formato não suportado: ${slug}.${kind}`);
    }
    const original = await fs.readFile(input);
    const metadata = await sharp(original).metadata();
    if (!metadata.width || !metadata.height) throw new Error(`Imagem inválida: ${slug}.${kind}`);
    const pipeline = sharp(original);
    const optimized = kind === "photo"
      ? await pipeline.rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toBuffer()
      : await pipeline.webp({ lossless: true, effort: 6 }).toBuffer();
    const originalPath = `public/images/originals/${slug}/${kind}${extension}`;
    const outputPath = kind === "photo" ? photoPath(slug) : logoPath(slug);
    for (const [target, buffer] of [[originalPath, original], [outputPath, optimized]]) {
      try {
        const existing = await fs.readFile(target);
        if (!existing.equals(buffer)) throw new Error(`Arquivo existente diferente: ${target}. Preserve-o antes de reimportar.`);
      } catch (error) { if (error.code !== "ENOENT") throw error; }
      operations.push({ target, buffer });
    }
    records.push({ unit: slug, kind, original: originalPath, optimized: outputPath, sha256: digest(original), width: metadata.width, height: metadata.height });
  }
}
// Todos os seis arquivos foram lidos e validados antes da primeira gravação.
for (const { target, buffer } of operations) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, buffer, { flag: "w" });
}
await fs.writeFile("public/images/asset-records.json", JSON.stringify(records, null, 2) + "\n");
console.log("Seis arquivos importados. Originais preservados byte a byte; fotos otimizadas sem alterar os cenários.");
