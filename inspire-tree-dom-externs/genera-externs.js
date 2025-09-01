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

let externs = tsickle.getGeneratedExterns(emitResult.externs, process.cwd());

// --- Sanitización ligera (defensiva) ---
externs = externs
  // Generator.prototype[Symbol.iterator] = function() {};
  .replace(/\n\s*Generator\.prototype\[Symbol\.iterator\]\s*=\s*function\(\)\s*{\s*};?/g, "")
  // Symbol.iterator = ...
  .replace(/\n\s*Symbol\.iterator\s*=\s*[^;]+;?/g, "");

// --- Cabecera: declara namespace global y símbolos CommonJS (sin asignaciones) ---
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

// --- Postproceso específico para DOM ---
// 1) Si tsickle nombró el módulo con sufijos internos tipo inspiretree$dom, normalizamos.
// 2) Afinamos tipos lazos a algo más útil para externc/AS3.
externs = externs
  // Elimina posibles creaciones "var inspiretree$dom = {};" de tsickle
  .replace(/^\s*\/\*\*\s*@const\s*\*\/\s*var\s+inspiretree\$dom\s*=\s*\{\s*\};\s*$/m, "")
  // Sustituye prefix "inspiretree$dom." por "inspiretree.dom."
  .replace(/inspiretree\$dom\./g, "inspiretree.dom.")
  // Relaja parámetros y tipos "?" a "*" donde corresponda
  .replace(/@param\s+\{\?\}\s+tree/g, "@param {*} tree")
  .replace(/@type\s+\{\?\}/g, "@type {*}");

// --- Alias namespaced explícito para el constructor DOM ---
// Queremos: inspiretree.dom.InspireTreeDOM = InspireTreeDOM;
// - Si el d.ts define la clase como global "InspireTreeDOM", este alias la publica bajo inspiretree.dom
// - Es común en externs hacer asignaciones de alias/namespace
const aliasBlock = `
/**
 * @suppress {duplicate}
 * Publica el constructor DOM bajo el namespace lógico inspiretree.dom.
 */
if (typeof inspiretree !== "undefined") {
  /** @type {function(*, !Object)} */
  inspiretree.dom.InspireTreeDOM = /** @type {?} */ (typeof InspireTreeDOM !== "undefined" ? InspireTreeDOM : undefined);
}
`;

// --- Ensamblado final ---
const finalExterns = `${umdHeader}\n${externs}\n${aliasBlock}\n`;
fs.writeFileSync(outputFile, finalExterns, "utf8");

console.log("✅ Externs CommonJS escritos en:", outputFile);
