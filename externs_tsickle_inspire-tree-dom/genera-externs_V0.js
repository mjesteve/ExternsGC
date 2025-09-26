// genera-externs.js - externs Closure compatibles con CommonJS
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

// ⚠️ CommonJS + SIN DOM para evitar CSS/Intl/WebAssembly en el externs
const tsOptions = {
  declaration: true,
  emitDeclarationOnly: true,
  allowJs: false,
  rootDir: process.cwd(),
  outDir: "./out",
  target: ts.ScriptTarget.ES2019,
  module: ts.ModuleKind.CommonJS,
  noLib: true,        // ⬅️ CLAVE: no cargar ninguna lib estándar
  types: []           // ⬅️ sin @types
};

// Programa TS + hosts
const program = ts.createProgram([input], tsOptions);
const tsHost = ts.createCompilerHost(tsOptions);
const tsickleHost = {
  shouldSkipTsickleProcessing: () => false,
  shouldIgnoreWarningsForPath: () => false,
  pathToModuleName: () => "inspiretree.dom", // nombre lógico estable
  fileNameToModuleId: f => f,
  transformDecorators: false,
  transformTypesToClosure: true,
  googmodule: false,                   // <-- no convertir a goog.module
  untyped: false
};

// Emit (solo .d.ts) y recoger externs
const emitResult = tsickle.emitWithTsickle(
  program, tsickleHost, tsHost, tsOptions,
  undefined, undefined, undefined,
  true // emitOnlyDtsFiles
);

// --- CABECERA UMD / CommonJS solo con DECLARACIONES ---
const umdHeader = `/** @externs */
/** @suppress {duplicate,checkTypes,externsValidation,uselessCode} */

/** Namespace global cuando se usa como script. */
/** @const */
var inspiretree = inspiretree || {};
/** @const */
inspiretree.dom = inspiretree.dom || {};

/** Formas CommonJS (declaraciones, sin asignaciones). */
/** @const {!Object} */ var module;
/** @type {*} */ module.exports;
/** @const {!Object} */ var exports;

/** Alias que Closure usa tras reescritura CJS (declaración únicamente). */
/** @const */ var module$exports$inspiretree;
`;

// --- PIE opcional para reforzar el alias Closure ---
const umdFooter = `
/** @suppress {duplicate} */
var module$exports$inspiretree = inspiretree;
`;

// --- SANITIZACIÓN / NORMALIZACIÓN DEL EXTERNS GENERADO POR TSICKLE ---
let externs = tsickle.getGeneratedExterns(emitResult.externs, process.cwd());

// 1) Limpieza de patrones problemáticos que a veces cuela tsickle
externs = externs
  // Generator.prototype[Symbol.iterator] = function() {};
  .replace(/\n\s*Generator\.prototype\[Symbol\.iterator\]\s*=\s*function\(\)\s*{\s*};?/g, '')
  // Symbol.iterator = ...
  .replace(/\n\s*Symbol\.iterator\s*=\s*[^;]+;?/g, '');

// 2) Normaliza el namespace de tsickle (inspiretree$dom -> inspiretree.dom)
//    y asegura la creación del objeto namespaced (ya lo hicimos en el header).
externs = externs
  .replace(/^\s*\/\*\* @const \*\/\s*var\s+inspiretree\$dom\s*=\s*\{\s*\};\s*$/m, '')
  .replace(/inspiretree\$dom\./g, 'inspiretree.dom.');

// 3) Afinar tipos lazos que tsickle deja como '?'
//    - @param {?} tree  -> @param {*} tree
//    - @type {?}        -> @type {*}
externs = externs
  .replace(/@param\s+\{\?\}\s+tree/g, '@param {*} tree')
  .replace(/@type\s+\{\?\}/g, '@type {*}');

// 4) Ajustes específicos para Config:
//    - dragTargets: Array<string>|undefined (en vez de '?')
//    - target: !Object (evitamos depender de HTMLElement/lib.dom)
externs = externs
  .replace(
    /\/\*\*\s*\*\/\s*inspiretree\.dom\.Config\.prototype\.dragTargets;/g,
    '/** @type {(Array<string>|undefined)} */ inspiretree.dom.Config.prototype.dragTargets;'
  )
  .replace(
    /\/\*\*\s*\*\/\s*inspiretree\.dom\.Config\.prototype\.target;/g,
    '/** @type {!Object} */ inspiretree.dom.Config.prototype.target;'
  );

// --- CONSTRUCCIÓN DEL FICHERO FINAL ---
const finalExterns = `${umdHeader}\n${externs}\n${umdFooter}`;
fs.writeFileSync(outputFile, finalExterns, "utf8");
console.log("✅ Externs CommonJS escritos en:", outputFile);
