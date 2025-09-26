#!/usr/bin/env node
// genera-externs.js — externs de Closure (CommonJS-friendly) para inspiretree-dom
// - Namespace raíz: inspiretree
// - Alias AS agradable: inspiretree.dom.InspireTreeDOM = InspireTreeDOM;
// - Sin libs TS (noLib:true) para evitar Intl/CSS/WebAssembly en el extern
// - Sin asignaciones a exports/module.exports (solo declaraciones), para evitar warnings

const ts = require("typescript");
const tsickle = require("tsickle");
const fs = require("fs");
const path = require("path");

const input = path.resolve(process.argv[2]);
if (!input || !fs.existsSync(input)) {
  console.error("❌ Debes pasar un archivo .d.ts como argumento");
  process.exit(1);
}

const fileName = path.basename(input);
const outputFile = fileName.replace(/\.d\.ts$/, ".externs.js");

// TypeScript: CommonJS, sin libs estándar
const tsOptions = {
  declaration: true,
  emitDeclarationOnly: true,
  allowJs: false,
  rootDir: process.cwd(),
  outDir: "./out",
  target: ts.ScriptTarget.ES2019,
  module: ts.ModuleKind.CommonJS,
  noLib: true,
  types: []
};

const program = ts.createProgram([input], tsOptions);
const tsHost = ts.createCompilerHost(tsOptions);

// Namespace lógico raíz: "inspiretree"
const tsickleHost = {
  shouldSkipTsickleProcessing: () => false,
  shouldIgnoreWarningsForPath: () => false,
  pathToModuleName: () => "inspiretree",
  fileNameToModuleId: f => f,
  transformDecorators: false,
  transformTypesToClosure: true,
  googmodule: false,
  untyped: false
};

// Emit (solo .d.ts) + recoger externs generados
const emitResult = tsickle.emitWithTsickle(
  program, tsickleHost, tsHost, tsOptions,
  undefined, undefined, undefined,
  true // emitOnlyDtsFiles
);

// --- CABECERA UMD / CommonJS solo con DECLARACIONES ---
const umdHeader = `/** @externs */
/** @suppress {duplicate,checkTypes,externsValidation,uselessCode} */

/** Namespace global cuando se usa como script. */
/** @const */ var inspiretree = inspiretree || {};
/** @const */ inspiretree.dom = inspiretree.dom || {};

/** Declaraciones CommonJS (sin asignaciones en externs). */
/** @const {!Object} */ var module;
/** @type {*} */ module.exports;
/** @const {!Object} */ var exports;

/** Alias que Closure puede usar tras reescritura CJS (declaración). */
/** @const */ var module$exports$inspiretree;
/** @const */ var module$exports$inspiretree$dom;
`;

// --- Sanitización ligera (defensiva) ---
let externs = tsickle.getGeneratedExterns(emitResult.externs, process.cwd());
externs = externs
  .replace(/\n\s*Generator\.prototype\[Symbol\.iterator\]\s*=\s*function\(\)\s*{\s*};?/g, "")
  .replace(/\n\s*Symbol\.iterator\s*=\s*[^;]+;?/g, "");

// Normaliza posibles nombres internos (si aparecieran)
externs = externs
  .replace(/^\s*\/\*\*\s*@const\s*\*\/\s*var\s+inspiretree\$dom\s*=\s*\{\s*\};\s*$/m, "")
  .replace(/inspiretree\$dom\./g, "inspiretree.dom.")
  .replace(/@param\s+\{\?\}\s+tree/g, "@param {*} tree")
  .replace(/@type\s+\{\?\}/g, "@type {*}");

// --- Declaración explícita del constructor bajo inspiretree.dom (SIN asignaciones) ---
// Si tsickle ya generó `inspiretree.dom.InspireTreeDOM`, este bloque es un duplicado compatible.
// Si solo generó el global `InspireTreeDOM`, con esto también lo exponemos namespaced.
const domCtorDecl = `
/**
 * @constructor
 * @param {*} tree
 * @param {!inspiretree.dom.Config|!Object} opts
 */
inspiretree.dom.InspireTreeDOM = function(tree, opts) {};
`;

// --- Ensamblado final (solo declaraciones, sin lógica) ---
const finalExterns = `${umdHeader}\n${externs}\n${domCtorDecl}\n`;
fs.writeFileSync(outputFile, finalExterns, "utf8");

console.log("✅ Externs CommonJS escritos en:", outputFile);
