import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
import { slugs, photoPath, logoPath } from "./asset-manifest.mjs";

let failed = false;
let records = [];
try { records = JSON.parse(await fs.readFile("public/images/asset-records.json", "utf8")); }
catch { console.error("PENDENTE: registro dos seis arquivos oficiais não encontrado."); failed = true; }
for (const slug of slugs) {
  for (const [kind, target] of [["photo", photoPath(slug)], ["logo", logoPath(slug)]]) {
    try {
      const record = records.find((r) => r.unit === slug && r.kind === kind);
      if (!record) throw new Error("registro de origem ausente");
      const original = await fs.readFile(record.original);
      if (crypto.createHash("sha256").update(original).digest("hex") !== record.sha256) throw new Error("original alterado");
      const meta = await sharp(target).metadata();
      if (!meta.width || !meta.height) throw new Error("imagem otimizada inválida");
      if (Math.abs(meta.width / meta.height - record.width / record.height) > .02 && kind === "logo") throw new Error("proporção do logo alterada");
      console.log(`OK: ${slug}.${kind}; original íntegro; cópia web válida.`);
    } catch (error) { console.error(`PENDENTE: ${slug}.${kind}: ${error.message}`); failed = true; }
  }
}
if (failed) process.exitCode = 1;
