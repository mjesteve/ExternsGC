¡vamos a crear un **royale-typedefs-inspiretree-dom** minimal y seguro!
La idea: un SWC de **typedefs** para el renderer DOM, con nombres estables y sin “inventarnos” API no confirmada. Mantendremos:

* un **constructor global** `InspireTreeDOM(tree, options)`
* un alias **namespaced** `inspiretree.dom.InspireTreeDOM` para que en AS se importe bonito
* un `record` de opciones con `target` (requerido) y resto laxo

Debajo te dejo todo lo necesario: el **externs JS** (CommonJS-friendly), los **configs** de `externc` y `compc`, el **build.xml** y cómo **usarlo** en tu app.

---

# 1) Externs JS (CommonJS-friendly)

Guárdalo como:

```
royale-typedefs/inspiretree-dom/target/downloads/inspire-tree-dom.externs.js
```

```js
/** @externs */
/** @suppress {duplicate,checkTypes,externsValidation,uselessCode} */

/** Namespace lógico para AS (no afecta al runtime). */
/** @const */ var inspiretree = inspiretree || {};
/** @const */ inspiretree.dom = inspiretree.dom || {};

/**
 * Opciones del renderer DOM.
 * target: selector CSS del contenedor (requerido).
 * El resto se deja laxo para no bloquear opciones nuevas.
 * @record @struct
 */
function InspireTreeDomOptions() {}
/** @type {string} */ InspireTreeDomOptions.prototype.target;
/** @type {*} */ InspireTreeDomOptions.prototype.checkbox;
/** @type {*} */ InspireTreeDomOptions.prototype.renderer;
/** @type {*} */ InspireTreeDomOptions.prototype.dragAndDrop;
/** @type {*} */ InspireTreeDomOptions.prototype.theme;
/** @type {*} */ InspireTreeDomOptions.prototype.tabindex;

/**
 * Constructor global expuesto por inspire-tree-dom (UMD):
 *   new InspireTreeDOM(tree, { target: '#tree' })
 * @constructor
 * @param {*} tree  // usa el typedef real de InspireTree en tu app; aquí lo dejamos laxo
 * @param {!InspireTreeDomOptions} options
 */
function InspireTreeDOM(tree, options) {}

/**
 * Métodos comunes (los dejamos como opcionales y laxos para no romper si no existen).
 * @return {void}
 */
InspireTreeDOM.prototype.remove = function() {};
/** @return {void} */
InspireTreeDOM.prototype.refresh = function() {};
/** @return {void} */
InspireTreeDOM.prototype.attach = function() {};
/** @return {void} */
InspireTreeDOM.prototype.detach = function() {};

/**
 * Alias namespaced solo para tipar bonito en AS:
 * inspiretree.dom.InspireTreeDOM === window.InspireTreeDOM
 * @constructor
 * @param {*} tree
 * @param {!InspireTreeDomOptions} options
 */
inspiretree.dom.InspireTreeDOM = InspireTreeDOM;

/** Declaraciones CommonJS (solo símbolos, sin asignaciones). */
/** @const {!Object} */ var module;
/** @type {*} */ module.exports;
/** @const {!Object} */ var exports;
/** @const */ var module$exports$inspiretree$dom;
```

> Por qué así:
> – El **global real** en runtime es `InspireTreeDOM`.
> – Creamos un **alias** `inspiretree.dom.InspireTreeDOM` para que `externc` genere `package inspiretree.dom { class InspireTreeDOM ... }` y puedas `import inspiretree.dom.InspireTreeDOM;` en AS.
> – Declaramos `module/exports` sin asignaciones: **externs no deben ejecutar código**.

---

# 2) `externc-config.xml`

`royale-typedefs/inspiretree-dom/src/main/config/externc-config.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<royale-config>
  <compiler>
    <accessible>true</accessible>
    <locale/>
    <warn-no-constructor>false</warn-no-constructor>
  </compiler>

  <typedefs>
    <path-element>../../../target/downloads/inspire-tree-dom.externs.js</path-element>
  </typedefs>

  <as-root>../../../target/generated-sources/externc</as-root>
</royale-config>
```

---

# 3) `compile-as-config.xml`

`royale-typedefs/inspiretree-dom/src/main/config/compile-as-config.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<royale-config>
  <compiler>
    <accessible>true</accessible>

    <source-path>
      <path-element>generated-sources/externc/classes</path-element>
      <path-element>generated-sources/externc/interfaces</path-element>
    </source-path>

    <warn-no-constructor>false</warn-no-constructor>
  </compiler>

  <include-sources>
    <path-element>generated-sources/externc/classes</path-element>
    <path-element>generated-sources/externc/interfaces</path-element>
  </include-sources>

  <!-- (Opcional) empaqueta el extern original para referencia -->
  <include-file>
    <name>externs/inspire-tree-dom.externs.js</name>
    <path>downloads/inspire-tree-dom.externs.js</path>
  </include-file>
</royale-config>
```

---

# 4) `build.xml`

`royale-typedefs/inspiretree-dom/build.xml`

```xml
<?xml version="1.0"?>
<project name="inspiretree-dom" default="main" basedir=".">

  <!-- Ajusta si ya detectas vía entorno -->
  <property name="ROYALE_HOME" value="${basedir}/.."/>

  <!-- Autodetección similar a otros módulos typedefs -->
  <condition property="ROYALE_COMPILER_HOME" value="${env.ROYALE_COMPILER_HOME}">
    <and>
      <not><isset property="ROYALE_COMPILER_HOME"/></not>
      <available file="${env.ROYALE_COMPILER_HOME}/lib/compiler-mxmlc.jar" type="file"/>
    </and>
  </condition>
  <condition property="ROYALE_COMPILER_HOME" value="${ROYALE_HOME}">
    <and>
      <not><isset property="ROYALE_COMPILER_HOME"/></not>
      <available file="${ROYALE_HOME}/lib/compiler-mxmlc.jar" type="file"/>
    </and>
  </condition>

  <condition property="ROYALE_TRANSPILER_HOME" value="${env.ROYALE_TRANSPILER_HOME}">
    <and>
      <not><isset property="ROYALE_TRANSPILER_HOME"/></not>
      <available file="${env.ROYALE_TRANSPILER_HOME}/lib/jsc.jar" type="file"/>
    </and>
  </condition>
  <condition property="ROYALE_TRANSPILER_HOME" value="${ROYALE_HOME}/js">
    <and>
      <not><isset property="ROYALE_TRANSPILER_HOME"/></not>
      <available file="${ROYALE_HOME}/js/lib/jsc.jar" type="file"/>
    </and>
  </condition>

  <target name="main" depends="externc, compc"/>

  <target name="externc">
    <mkdir dir="${basedir}/target/generated-sources/externc"/>
    <java jar="${ROYALE_TRANSPILER_HOME}/lib/externc.jar" fork="true" failonerror="true">
      <arg value="+royalelib=externs"/>
      <arg value="-debug"/>
      <arg value="-load-config=${basedir}/src/main/config/externc-config.xml"/>
    </java>

    <!-- Red de seguridad: por si se cuela algo global indeseado -->
    <delete failonerror="false">
      <fileset dir="${basedir}/target/generated-sources/externc/classes">
        <include name="Intl.as"/>
        <include name="CSS.as"/>
        <include name="Reflect.as"/>
        <include name="WebAssembly.as"/>
      </fileset>
      <fileset dir="${basedir}/target/generated-sources/externc/interfaces">
        <include name="Intl.as"/>
        <include name="CSS.as"/>
        <include name="Reflect.as"/>
        <include name="WebAssembly.as"/>
      </fileset>
    </delete>
  </target>

  <target name="compc">
    <copy file="${basedir}/src/main/config/compile-as-config.xml" todir="${basedir}/target"/>
    <java jar="${ROYALE_COMPILER_HOME}/lib/compiler-compc.jar" fork="true" failonerror="true">
      <arg value="+royalelib=${ROYALE_HOME}/frameworks"/>
      <arg value="-debug"/>
      <!-- usar js.swc del SDK -->
      <arg value="-external-library-path+=${ROYALE_HOME}/js/target/js.swc"/>
      <arg value="-load-config=${basedir}/target/compile-as-config.xml"/>
      <arg value="-output=${basedir}/target/inspiretree-dom.swc"/>
    </java>
  </target>

  <target name="clean">
    <delete failonerror="false" includeEmptyDirs="true">
      <fileset dir="${basedir}/target">
        <include name="**/**"/>
        <exclude name="downloads/**"/>
      </fileset>
    </delete>
  </target>
</project>
```

---

# 5) Compilar el typedef DOM

```powershell
cd royale-typedefs/inspiretree-dom
ant clean
ant main
```

Tendrás: `target/inspiretree-dom.swc`.

---

# 6) Usarlo en tu app Royale

En tu `js-compile-config.xml` añade:

```xml
<external-library-path>
  <path-element>libs/inspiretree.swc</path-element>
  <path-element>libs/inspiretree-dom.swc</path-element>
</external-library-path>
```

Copia ambos `.swc` a `libs/`.

En tu `MainApp.as`, ahora puedes tipar el renderer:

```as3
import inspiretree.dom.InspireTreeDOM;

// ...
COMPILE::JS
{
    var DomCtor:* = js.Browser.window["InspireTreeDOM"];
    var dom:* = new DomCtor(tree, { target: "#tree" });

    // si quieres tipado del alias en puntos concretos:
    var typed:InspireTreeDOM = dom as InspireTreeDOM;
}
```

> El **runtime** sigue viniendo del global `InspireTreeDOM` que cargas en `index.html`; el **typedef** solo aporta **tipado y preservación de nombres** en compile-time.

---

# 7) (Opcional) Generar este extern de forma automática

Si más adelante consigues un `.d.ts` de `inspire-tree-dom`, puedes pasarlo por **el mismo script `genera-externs.js`** que ya tienes (con `noLib:true`, CommonJS, header limpio) y te evitas mantenerlo a mano.

---

¿quieres que te deje también un pequeño **smoke test** en AS que pruebe `remove()`/`refresh()` tipados (aunque sean no-op en typedef) y verifiques que el build completa bien con ambos SWC?
---
---
perfecto — a partir de ese `.d.ts`, aquí tienes el **externs JS** listo para `externc`, compatible con CommonJS, sin dependencias DOM, y enlazando el tipo `TreeNode` al que ya definiste en `inspiretree` (tu otro SWC de typedefs).

Guárdalo como:

```
royale-typedefs/inspiretree-dom/target/downloads/inspire-tree-dom.externs.js
```

```js
/** @externs */
/** @suppress {duplicate,checkTypes,externsValidation,uselessCode} */

/**
 * Namespace lógico para generar paquetes AS bonitos:
 *   package inspiretree.dom { class InspireTreeDOM { ... } }
 * (No afecta al runtime; el runtime global real es `InspireTreeDOM`.)
 */
/** @const */ var inspiretree = inspiretree || {};
/** @const */ inspiretree.dom = inspiretree.dom || {};

/**
 * Closure typedef del callback de validación de drop:
 * (dragNode, targetNode) -> boolean
 *
 * Enlazamos `TreeNode` al namespace del typedef principal:
 *   inspiretree.TreeNode
 *
 * @typedef {function(!inspiretree.TreeNode, !inspiretree.TreeNode): boolean}
 */
var DropTargetValidator;

/**
 * Configuración del renderer DOM.
 * Tipos laxos para no depender de DOM libs (HTMLElement) ni romper compatibilidad.
 * `target` lo marcamos como {!Object} para evitar referenciar `HTMLElement`.
 *
 * @record @struct
 */
function InspireTreeDomConfig() {}
/** @type {boolean|undefined} */ InspireTreeDomConfig.prototype.autoLoadMore;
/** @type {boolean|undefined} */ InspireTreeDomConfig.prototype.deferredRendering;
/** @type {{enabled:(boolean|undefined), validateOn:(string|undefined), validate:(!DropTargetValidator)}|undefined} */ InspireTreeDomConfig.prototype.dragAndDrop;
/** @type {(number|undefined)} */ InspireTreeDomConfig.prototype.nodeHeight;
/** @type {(boolean|undefined)} */ InspireTreeDomConfig.prototype.showCheckboxes;
/** @type {(Array<string>|undefined)} */ InspireTreeDomConfig.prototype.dragTargets;
/** @type {(number|undefined)} */ InspireTreeDomConfig.prototype.tabindex;
/** @type {!Object} */ InspireTreeDomConfig.prototype.target;

/**
 * Constructor global UMD:
 *   new InspireTreeDOM(tree: any, opts: Config)
 *
 * `tree` se deja como {*} para no forzar dependencia cruzada dura.
 *
 * @constructor
 * @param {*} tree
 * @param {!InspireTreeDomConfig} opts
 */
function InspireTreeDOM(tree, opts) {}

/**
 * Métodos comunes del renderer (opcionales, lazos para futuras versiones).
 * @return {void}
 */
InspireTreeDOM.prototype.remove = function() {};
/** @return {void} */
InspireTreeDOM.prototype.refresh = function() {};
/** @return {void} */
InspireTreeDOM.prototype.attach = function() {};
/** @return {void} */
InspireTreeDOM.prototype.detach = function() {};

/**
 * Alias namespaced solo para typedefs (AS):
 *   inspiretree.dom.InspireTreeDOM === window.InspireTreeDOM
 *
 * @constructor
 * @param {*} tree
 * @param {!InspireTreeDomConfig} opts
 */
inspiretree.dom.InspireTreeDOM = InspireTreeDOM;

/** -------- Declaraciones CommonJS (solo símbolos, sin asignaciones) -------- */
/** @const {!Object} */ var module;
/** @type {*} */ module.exports;
/** @const {!Object} */ var exports;
/** @const */ var module$exports$inspiretree$dom;
```

### Notas rápidas

* Evitamos `HTMLElement` y cualquier DOM global → usamos `!Object` para `target`.
* El `TreeNode` viene del typedef principal: `inspiretree.TreeNode`.
* Nada de asignaciones a `exports`/`module.exports` dentro de externs (solo declaraciones) → así no salen warnings.
* El alias `inspiretree.dom.InspireTreeDOM` hace que `externc` genere `package inspiretree.dom { ... }`, de modo que en AS importas `inspiretree.dom.InspireTreeDOM`.

Con este archivo:

1. `ant clean && ant main` dentro de `royale-typedefs/inspiretree-dom/`.
2. Copia `target/inspiretree-dom.swc` a tu app en `libs/` y añádelo al `external-library-path`.
3. En tu `MainApp.as`, ya puedes tipar el renderer:

```as3
import inspiretree.dom.InspireTreeDOM;

COMPILE::JS {
  var DomCtor:* = js.Browser.window["InspireTreeDOM"];
  var dom:* = new DomCtor(tree, { target: Browser.document.querySelector("#tree") });
  var typed:InspireTreeDOM = dom as InspireTreeDOM; // tipado disponible
}
```

¿quieres que te lo integre en el `build.xml` del módulo `inspiretree-dom` que te pasé antes y te deje una tarea Ant “padre” que construya ambos typedefs (inspiretree + inspiretree-dom) en cadena?
---
---
¡va! Aquí tienes **el `genera-externs.js` completo** para el módulo **DOM**, usando
`pathToModuleName: () => "inspiretree"` y creando el alias
`inspiretree.dom.InspireTreeDOM = InspireTreeDOM;` dentro del extern. Mantiene
CommonJS “solo declaraciones” (sin asignaciones a `exports`/`module.exports`)
y desactiva por completo las libs TS (`noLib: true`) para que no se cuele `Intl`,
`CSS`, etc.

```js
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
```

**Notas:**

* `pathToModuleName: () => "inspiretree"` → todo cuelga de `inspiretree`.
* El **alias** `inspiretree.dom.InspireTreeDOM = InspireTreeDOM;` se añade al final (estilo habitual en externs).
* CommonJS: solo **declaraciones** (`var module; var exports; module.exports;`), sin asignaciones, para evitar los warnings de Closure.
* `noLib: true` evita que se “infiltren” tipos de las libs TS (como `Intl`).
* Si quisieras tipar `tree` como `!inspiretree.InspireTree`, cambia la línea de reemplazo `@param {*} tree` por `@param {!inspiretree.InspireTree} tree`.

Con este script deberías obtener un extern con:

* `inspiretree.dom.Config` (record),
* `inspiretree.dom.InspireTreeDOM` (constructor),
* y sin restos de `Intl`/`CSS`/etc.
