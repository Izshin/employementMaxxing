#!/usr/bin/env node
// Exporta una plantilla de CV (HTML) a PDF usando Microsoft Edge en modo headless.
// Uso: node tools/export-cv.mjs <ruta-a-template.html> [nombre-salida]

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = path.join(ROOT, "curriculum_mod_pdf");

const EDGE_CANDIDATES = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "msedge",
];

function findEdge() {
  for (const candidate of EDGE_CANDIDATES) {
    if (candidate === "msedge" || existsSync(candidate)) return candidate;
  }
  throw new Error("No se encontró msedge.exe. Instala Microsoft Edge o ajusta EDGE_CANDIDATES.");
}

function countPdfPages(pdfPath) {
  const data = readFileSync(pdfPath);
  const match = data.toString("latin1").match(/\/Count\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

const [, , templateArg, outputNameArg] = process.argv;

if (!templateArg) {
  console.error("Uso: node tools/export-cv.mjs <ruta-a-template.html> [nombre-salida]");
  process.exit(1);
}

const templatePath = path.resolve(ROOT, templateArg);
if (!existsSync(templatePath)) {
  console.error(`No existe la plantilla: ${templatePath}`);
  process.exit(1);
}

const outputName = outputNameArg
  ? outputNameArg.replace(/\.pdf$/i, "")
  : path.basename(templatePath, path.extname(templatePath));

mkdirSync(OUTPUT_DIR, { recursive: true });
const outputPath = path.join(OUTPUT_DIR, `${outputName}.pdf`);

const edge = findEdge();
const fileUrl = `file:///${templatePath.replace(/\\/g, "/")}`;

execFileSync(edge, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${outputPath}`,
  fileUrl,
]);

const pages = countPdfPages(outputPath);
console.log(`PDF generado: ${outputPath}`);
console.log(pages ? `Páginas: ${pages}` : "No se pudo determinar el número de páginas.");
if (pages && pages > 1) {
  console.warn("Aviso: el CV ocupa más de una página, revisa el contenido/CSS.");
}
