Gracias por el detalle del entorno — eso ayuda mucho.

---

## ✅ Basado en tu entorno actual:

| Herramienta                    | Estado | Acción recomendada                                                              |
| ------------------------------ | ------ | ------------------------------------------------------------------------------- |
| Node.js 20.10.0                | ✔️     | Perfecto                                                                        |
| `tsickle` global               | ⚠️     | No se usa globalmente, necesita instalarse local para usar su **API en script** |
| `typescript`                   | ❌      | Necesario para que funcione `tsickle`                                           |
| Haxe Toolkit, `as3hx`, `hxcpp` | ✅      | No interfieren, están bien                                                      |

---

## ✅ Lo que debes hacer ahora

Te guío paso a paso para dejar todo listo:

---

### 1. Crea una carpeta de trabajo

```bash
mkdir inspiretree-externs
cd inspiretree-externs
```

---

### 2. Inicializa un proyecto Node

```bash
npm init -y
```

---

### 3. Instala `tsickle` y `typescript` como dependencias

```bash
npm install tsickle typescript
```

Esto los instala **localmente en tu proyecto**, y estarán disponibles para ser usados en un script JS personalizado (como el que vamos a escribir).

---

### 4. Copia el archivo `.d.ts`

Coloca tu archivo `inspire-tree-royale.d.ts` dentro de esta carpeta.

---

### 5. Crea un script `genera-externs.js`

Aquí está un ejemplo **funcional completo** para este entorno (adaptado para evitar errores comunes con el API de `tsickle`):

```js
// genera-externs.js
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
const outputFile = fileName.replace(/\.d\.ts$/, '.externs.js');

const tsOptions = {
  declaration: true,
  emitDeclarationOnly: true,
  allowJs: false,
  rootDir: process.cwd(),
  outDir: "./out"
};

const program = ts.createProgram([input], tsOptions);
const tsHost = ts.createCompilerHost(tsOptions);

// tsickle Host configuration
const tsickleHost = {
  shouldSkipTsickleProcessing: () => false,
  shouldIgnoreWarningsForPath: () => false,
  pathToModuleName: (_context, file) => file,
  fileNameToModuleId: file => file,
  transformDecorators: false,
  transformTypesToClosure: true,
  googmodule: false,
  untyped: false
};

// Realizar la emisión con tsickle
const emitResult = tsickle.emitWithTsickle(
  program,
  tsickleHost,
  tsHost,
  tsOptions,
  undefined,
  undefined,
  undefined,
  true  // emitOnlyDtsFiles
);

// `emitResult.externs` es un object con archivos externs parciales
const externsCombined = tsickle.getGeneratedExterns(emitResult.externs, process.cwd());

// Guardar el resultado completo
fs.writeFileSync(outputFile, externsCombined, "utf8");
console.log(`✅ Externs escritos en: ${outputFile}`);

```

---

### 6. Ejecuta el script

```bash
node genera-externs.js inspire-tree-royale.d.ts
```

Obtendrás un archivo `inspire-tree-royale.externs.js` con anotaciones Closure.

---

## ✅ Luego puedes...

* Usar el archivo externs como `--externs=...` en el Closure Compiler.
* O como archivo de entrada para `externc` de Royale.
* O como externs de ClojureScript.

---

¡genial! vamos a clavar la **conversión a .as** siguiendo la **misma estructura que `google_maps`** en `royale-typedefs`.

Abajo te dejo un “kit” mínimo (directorios + ficheros) para un módulo `inspiretree` análogo a `google_maps`, usando `externc` → AS stubs → `compc` → `.swc`. Me baso en el `build.xml` y configuraciones reales de `google_maps` del repo oficial para que te funcione a la primera. ([apache.googlesource.com][1], [GitHub][2])

---

# Estructura propuesta

```
royale-typedefs/
└─ inspiretree/
   ├─ build.xml
   └─ src/
      └─ main/
         ├─ config/
         │  ├─ externc-config.xml
         │  └─ compile-as-config.xml
         └─ patch/
```

> Nota: la carpeta `patch/` queda vacía por ahora (no necesitamos “preprocess” como en `google_maps`, que parchea el extern original). ([apache.googlesource.com][1])

---

# 1) Coloca tu externs JS

Copia tu `inspire-tree-royale.externs.js` generado (y ya corregido con un **namespace limpio**; p.ej. `var inspiretree = {}; inspiretree.InspireTree = function() {}`…) en:

```
inspiretree/target/downloads/inspire-tree-royale.externs.js
```

> Igual que `google_maps`, trabajaremos con `target/downloads/...` y luego `externc` emitirá AS a `target/generated-sources/externc`. ([apache.googlesource.com][3])

---

# 2) `src/main/config/externc-config.xml`

Calcado del de `google_maps` pero apuntando a tu externs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<royale-config>
  <compiler>
    <accessible>true</accessible>
    <locale/>
    <warn-no-constructor>false</warn-no-constructor>
  </compiler>

  <!-- Externs JS de Closure que externc convertirá a stubs AS -->
  <typedefs>
    <path-element>../../../target/downloads/inspire-tree-royale.externs.js</path-element>
  </typedefs>

  <!-- Carpeta de salida de los .as generados -->
  <as-root>../../../target/generated-sources/externc</as-root>
</royale-config>
```

(Comparar con `google_maps/src/main/config/externc-config.xml`). ([apache.googlesource.com][3])

---

# 3) `src/main/config/compile-as-config.xml`

También espejo del de `google_maps`: incluye en el SWC los `.as` generados y (opcionalmente) guarda el extern JS dentro del SWC para referencia.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<royale-config>
  <compiler>
    <accessible>true</accessible>
    <external-library-path>
      <!-- vacío: típicamente el build padre setea libs externas -->
    </external-library-path>

    <!-- Donde externc dejó clases e interfaces -->
    <source-path>
      <path-element>generated-sources/externc/classes</path-element>
      <path-element>generated-sources/externc/interfaces</path-element>
    </source-path>

    <warn-no-constructor>false</warn-no-constructor>
  </compiler>

  <!-- Incluir las fuentes AS generadas en el SWC -->
  <include-sources>
    <path-element>generated-sources/externc/classes</path-element>
    <path-element>generated-sources/externc/interfaces</path-element>
  </include-sources>

  <!-- (Opcional pero útil) Empaqueta el extern original dentro del SWC -->
  <include-file>
    <name>externs/inspire-tree-royale.externs.js</name>
    <path>downloads/inspire-tree-royale.externs.js</path>
  </include-file>
</royale-config>
```

(Base real: `google_maps/src/main/config/compile-as-config.xml`). ([apache.googlesource.com][4])

---

# 4) `build.xml`

Plantilla Ant minimalista, inspirada en `google_maps/build.xml` pero sin “preprocess”:

```xml
<?xml version="1.0"?>
<project name="inspiretree" default="main" basedir=".">

  <!-- ROYALE_HOME/ROYALE_COMPILER_HOME/ROYALE_TRANSPILER_HOME autodetect,
       igual que en google_maps/build.xml -->
  <property name="ROYALE_HOME" value="${basedir}/.." />

  <condition property="ROYALE_COMPILER_HOME" value="${env.ROYALE_COMPILER_HOME}">
    <and>
      <not><isset property="ROYALE_COMPILER_HOME"/></not>
      <available file="${env.ROYALE_COMPILER_HOME}/lib/compiler-mxmlc.jar" type="file"/>
    </and>
  </condition>
  <condition property="ROYALE_COMPILER_HOME" value="${ROYALE_HOME}/../royale-compiler/compiler">
    <and>
      <not><isset property="ROYALE_COMPILER_HOME"/></not>
      <available file="${ROYALE_HOME}/../royale-compiler/compiler/lib/compiler-mxmlc.jar" type="file"/>
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
  <condition property="ROYALE_TRANSPILER_HOME" value="${ROYALE_HOME}/../royale-compiler/compiler-jx">
    <and>
      <not><isset property="ROYALE_TRANSPILER_HOME"/></not>
      <available file="${ROYALE_HOME}/../royale-compiler/compiler-jx/lib/jsc.jar" type="file"/>
    </and>
  </condition>

  <target name="main" depends="externc, compc" />

  <target name="externc">
    <mkdir dir="${basedir}/target/generated-sources/externc"/>
    <java jar="${ROYALE_TRANSPILER_HOME}/lib/externc.jar" fork="true" failonerror="true">
      <arg value="+royalelib=externs"/>
      <arg value="-debug"/>
      <arg value="-load-config=${basedir}/src/main/config/externc-config.xml"/>
    </java>
  </target>

  <target name="compc">
    <copy file="${basedir}/src/main/config/compile-as-config.xml" todir="${basedir}/target"/>
    <java jar="${ROYALE_COMPILER_HOME}/lib/compiler-compc.jar" fork="true" failonerror="true">
      <arg value="+royalelib=externs/frameworks"/>
      <arg value="-debug"/>
      <!-- Ajusta external libs si lo necesitas -->
      <arg value="-load-config=${basedir}/target/compile-as-config.xml"/>
      <arg value="-output=${basedir}/target/inspiretree.swc"/>
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

  <target name="wipe">
    <delete failonerror="false" includeEmptyDirs="true">
      <fileset dir="${basedir}/target">
        <include name="**/**"/>
      </fileset>
    </delete>
  </target>
</project>
```

(Estructura y llamadas replican el modulo `google_maps` real). ([apache.googlesource.com][1])

---

# 5) Recomendación crucial sobre **namespace** del externs

Para que `externc` genere paquetes AS “bonitos” (como `google.maps.*`), asegúrate de que tu extern tenga un **namespace JS estable**. Un patrón típico:

```js
/** @const */ var inspiretree = {};

/** @constructor */
inspiretree.InspireTree = function(opts) {};

/** @constructor */
inspiretree.TreeNode = function() {};

/** @constructor @extends {Array<!inspiretree.TreeNode>} */
inspiretree.TreeNodes = function() {};
```

Así, `externc` producirá algo como:

```
package inspiretree {
  public class InspireTree { ... }
}
package inspiretree {
  public class TreeNode { ... }
}
package inspiretree {
  public class TreeNodes { ... }
}
```

Tal cual ocurre con `google.maps` → `package google.maps { ... }`. ([apache.googlesource.com][3])

---

# 6) Build

Desde `royale-typedefs/inspiretree`:

```bash
ant main
```

Esto ejecuta `externc` y luego `compc`, dejando **`target/inspiretree.swc`** listo para usarse como **typedef library** (externs) en proyectos Royale (se añade a `external-library-path` o vía la config `js-compile-config.xml`, como documenta la guía de librerías). ([Apache GitHub][5])

---

## ¿Qué sigue?

Si quieres, te doy el **snippet de `js-compile-config.xml`** para añadir el SWC como typedef en tu app Royale, o revisamos juntos una muestra de **AS generado** (por ejemplo, la clase `inspiretree.InspireTree`) para validar nullabilidad, `Vector.<T>` vs `Array`, y ajustes típicos que `externc` a veces requiere.

[1]: https://apache.googlesource.com/royale-typedefs/%2B/refs/tags/org.apache.royale.typedefs-0.9.3-rc1/google_maps/build.xml "google_maps/build.xml - royale-typedefs - Git at Google"
[2]: https://github.com/apache/royale-typedefs?utm_source=chatgpt.com "Apache Royale TypeDefs"
[3]: https://apache.googlesource.com/royale-typedefs/%2B/refs/tags/org.apache.royale.typedefs-0.9.3-rc1/google_maps/src/main/config/externc-config.xml "google_maps/src/main/config/externc-config.xml - royale-typedefs - Git at Google"
[4]: https://apache.googlesource.com/royale-typedefs/%2B/refs/tags/org.apache.royale.typedefs-0.9.3-rc1/google_maps/src/main/config/compile-as-config.xml "google_maps/src/main/config/compile-as-config.xml - royale-typedefs - Git at Google"
[5]: https://apache.github.io/royale-docs/libraries/library-basics?utm_source=chatgpt.com "Library Basics - The Apache Software Foundation"

---
¡Bien visto! Esos `.as` de **CSS** e **Intl** vienen de que nuestro `genera-externs.js` está creando el *program* de TypeScript con las **libs DOM** por defecto. Al incluir `lib.dom.d.ts`, aparecen tipos globales (CSS, Intl, WebAssembly, VarDate…) que `tsickle` mete en el externs y luego `externc` intenta convertir a `.as`, reventando en `compc`.

La solución limpia: **generar los externs SIN las libs DOM**.

---

# Arreglo en `genera-externs.js`

Modifica las **opciones de TS** para excluir DOM y dejar solo ES (por ejemplo, ES2019). Así evitamos que entren `CSS`, `Intl`, etc.

```js
// genera-externs.js  (cambios clave marcados)
const ts = require("typescript");
const tsickle = require("tsickle");
const fs = require("fs");
const path = require("path");

const input = path.resolve(process.argv[2]); // ya lo tenías así
if (!input || !fs.existsSync(input)) {
  console.error("❌ Debes pasar un archivo .d.ts como argumento");
  process.exit(1);
}

const fileName = path.basename(input);
const outputFile = fileName.replace(/\.d\.ts$/, '.externs.js');

// ⚠️ EXCLUIMOS DOM; especificamos solo libs ES:
const tsOptions = {
  declaration: true,
  emitDeclarationOnly: true,
  allowJs: false,
  rootDir: process.cwd(),
  outDir: "./out",
  target: ts.ScriptTarget.ES2019,
  module: ts.ModuleKind.ESNext,
  // <- lo importante: NO DOM
  lib: ["lib.es2019.d.ts"],   // evita lib.dom.d.ts
  types: []                   // no cargar tipos @types
};

const program = ts.createProgram([input], tsOptions);
const tsHost = ts.createCompilerHost(tsOptions);

// Asegura un namespace limpio (ya lo hiciste), mantenlo:
const tsickleHost = {
  shouldSkipTsickleProcessing: () => false,
  shouldIgnoreWarningsForPath: () => false,
  pathToModuleName: (_context, _file) => "inspiretree", // <- clave
  fileNameToModuleId: file => file,
  transformDecorators: false,
  transformTypesToClosure: true,
  googmodule: false,
  untyped: false
};

const emitResult = tsickle.emitWithTsickle(
  program,
  tsickleHost,
  tsHost,
  tsOptions,
  undefined, undefined, undefined,
  true // emitOnlyDtsFiles
);

// Concatena los externs generados
const externsCombined = tsickle.getGeneratedExterns(emitResult.externs, process.cwd());

// (Opcional) sanea residuos muy raros (VarDate/IE):
const sanitized = externsCombined
  .replace(/\/\*\* @type {!VarDate} \*\/[\s\S]*?getVarDate;?/g, "");

// Escribe el resultado final
fs.writeFileSync(outputFile, sanitized, "utf8");
console.log(`✅ Externs escritos en: ${outputFile}`);
```

### Por qué funciona

* Al **no** incluir `lib.dom.d.ts`, el compilador **no introduce** tipos globales como `CSS` o `Intl`.
* `externc` ya no generará `CSS.as`/`Intl.as`, por lo que **desaparece** el `NullPointerException` de `compc`.

---

# Pasos a seguir

1. Actualiza `genera-externs.js` como arriba.
2. Regenera el externs:

   ```powershell
   node genera-externs.js inspire-tree-royale.d.ts
   ```

   Comprueba que el `.externs.js` ya **no** contiene `VarDate`, `CSS`, `Intl`, `WebAssembly`, etc.
3. Limpia y compila:

   ```powershell
   ant wipe
   ant main
   ```

   Deberías obtener `target/inspiretree.swc` sin errores.

---

# Plan B (si aún apareciera algo raro)

Si por cualquier motivo queda algún resto global indeseado en el externs:

* Añade un **paso de “preprocess”** antes de `externc` (igual que hace `google_maps`) que copie un externs **filtrado** a `target/downloads/…` (p.ej., con un script Node que elimine bloques específicos).
* Como urgencia, puedes borrar manualmente `CSS.as` / `Intl.as` de `target/generated-sources/externc/classes` y volver a lanzar solo `compc`, pero se regenerarán en el próximo `externc`. Lo correcto es **evitar su generación** con el ajuste de `lib`.

---

Si te compila, seguimos con el **uso del SWC** en tu app Royale (añadirlo como `external-library-path`) y, si quieres, te preparo un `js-compile-config.xml` de ejemplo para integrarlo al build de tu proyecto.

---
---
¡vale! si tus externs deben ser **compatibles con CommonJS**, no basta con “module: ESNext”. Haz dos cambios:

1. **Compila el .d.ts asumiendo CommonJS** (para que ts/tsickle resuelvan `export`/`import` como CJS).
2. **Envuelve el extern generado con un “UMD-bridge” mínimamente tipado** para Closure: define `exports`/`module.exports` apuntando al mismo namespace global (`inspiretree`). Así sirve tanto si la lib se consume como global (window) como si se hace `require('inspiretree')`.

Abajo te dejo el **script completo** (sustituye tu `genera-externs.js`). Cambios clave marcados en comentarios.

```js
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
  module: ts.ModuleKind.CommonJS,     // <-- CommonJS
  lib: ["lib.es2019.d.ts"],           // <-- sin DOM
  types: []
};

// Programa TS + hosts
const program = ts.createProgram([input], tsOptions);
const tsHost = ts.createCompilerHost(tsOptions);
const tsickleHost = {
  shouldSkipTsickleProcessing: () => false,
  shouldIgnoreWarningsForPath: () => false,
  pathToModuleName: () => "inspiretree", // nombre lógico estable
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

let externs = tsickle.getGeneratedExterns(emitResult.externs, process.cwd());

// --- SANITIZACIÓN mínima (quitamos restos problemáticos: Intl / Symbol.iterator) ---
externs = externs
  .replace(/\n\s*Generator\.prototype\[Symbol\.iterator\]\s*=\s*function\(\)\s*{\s*};?/g, "")
  .replace(/\n\s*Symbol\.iterator\s*=\s*[^;]+;?/g, "");

// “mata” cualquiera de las líneas que empiecen por Intl. (p.ej. Intl.CollatorOptions...)
externs = externs
  .split(/\r?\n/)
  .filter(l => !/^\s*Intl\./.test(l) && !/@type\s*{[^}]*\bIntl\b/.test(l))
  .join("\n");

// --- CABECERA UMD para CommonJS + global (sin romper Closure) ---
const umdHeader = `/** @externs */
/** @suppress {duplicate,checkTypes} */

/**
 * Nombre global del paquete (cuando se usa sin bundler).
 * @const
 */
var inspiretree = inspiretree || {};

/**
 * Compatibilidad CommonJS: exports y module.exports apuntan al mismo objeto.
 * Closure entiende estos símbolos cuando reescribe CommonJS.
 * @const
 */
var exports = exports || {};
/** @const */
var module = module || {};

/** @type {*} */
module.exports = module.exports || exports;

/** @type {*} */
var require; // declaración vacía para evitar warnings si aparece en externs

// Alinea globals y exports al mismo objeto:
exports = inspiretree;
module.exports = inspiretree;
`;

// --- PIE por si alguna herramienta reordena (opcional) ---
const umdFooter = `
/** @suppress {duplicate} */
var module$exports$inspiretree = inspiretree; // alias Closure-friendly
`;

// Resultado final
const finalExterns = `${umdHeader}\n${externs}\n${umdFooter}`;
fs.writeFileSync(outputFile, finalExterns, "utf8");
console.log(`✅ Externs CommonJS escritos en: ${outputFile}`);
```

### Por qué esto funciona

* `module: ts.ModuleKind.CommonJS` hace que TypeScript/tsickle interpreten el archivo con semántica CJS (aunque solo emitimos externs).
* El **UMD-bridge**:

  * Declara `inspiretree` global (para uso “script”/UMD).
  * Declara `exports` y `module.exports` y los **hace apuntar al mismo objeto** (`inspiretree`).
  * Añade un alias `module$exports$inspiretree` que Closure usa cuando reescribe CommonJS; así, si más adelante en tu pipeline hay reescritura CJS, todo sigue atado al mismo objeto.
* `googmodule:false` evita que tsickle cree `goog.module` (no lo necesitamos para externs puros).

### Dónde encaja con `externc` (Royale)

`externc` **solo** mira las **declaraciones Closure** (JSDoc) y los símbolos que “cuelgan” de un objeto. Aquí colgamos todo de `inspiretree` **y** le decimos a CommonJS que `module.exports === inspiretree`. Resultado:

* En el SWC, tendrás paquetes AS como `package inspiretree { ... }` (igual que con el global).
* Si más tarde integras JS empaquetado CommonJS, `module.exports` seguirá siendo el mismo objeto que tus stubs AS representan (`inspiretree`), evitando renombres.

### Siguientes pasos

1. Regenera externs con este script.
2. `ant wipe && ant main`.
3. Si apareciera algún warning de `Symbol` de nuevo, mantén el **shim** ES6-slim que te pasé antes (añadido en `<typedefs>`), o añade el mini-bloque `Symbol` al header UMD (también vale).

¿Te preparo ahora el `js-compile-config.xml` de tu app Royale para usar `target/inspiretree.swc` como `external-library-path` y un smoke test en AS3 (clase que referencia `inspiretree.InspireTree`, `TreeNode`, etc.)?
---
---
¡hecho! aquí tienes un `js-compile-config.xml` mínimo para **tu aplicación Royale** que añade el `inspiretree.swc` como **typedef library** (no mete JS, solo tipos) vía `external-library-path`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<royale-config>
  <compiler>
    <!-- clase principal de tu app -->
    <main-class>com.example.app.MainApp</main-class>

    <!-- dónde están tus fuentes -->
    <source-path>
      <path-element>src/main/royale</path-element>
    </source-path>

    <!-- ⬇️ añade el SWC de typedefs aquí -->
    <external-library-path>
      <!-- otras libs externas que ya uses -->
      <!-- <path-element>libs/alguna-lib.swc</path-element> -->

      <!-- tu typedef de InspireTree -->
      <path-element>libs/inspiretree.swc</path-element>
    </external-library-path>

    <!-- típicos ajustes (opcionales) -->
    <define>
      <name>CONFIG::debug</name>
      <value>true</value>
    </define>
    <remove-circulars>true</remove-circulars>
    <warn-no-constructor>false</warn-no-constructor>
  </compiler>

  <!-- salida JS -->
  <js-output-type>FLEXJS</js-output-type>
  <targets>
    <target>JSRoyale</target>
  </targets>

  <!-- carpeta de salida -->
  <output>bin/js-debug</output>
</royale-config>
```

### Dónde colocar las cosas

* Copia `inspiretree.swc` (el que generaste en `royale-typedefs/inspiretree/target/inspiretree.swc`) a tu proyecto, por ejemplo en `libs/inspiretree.swc`.
* Guarda el XML anterior como `js-compile-config.xml` (o el nombre que ya uses en tu build).

### Cómo compilar (ejemplo con `mxmlc/js`)

```bash
# asumiendo que tienes ROYALE_HOME en el entorno
"%ROYALE_HOME%/js/bin/mxmlc" -load-config=js-compile-config.xml
```

> Si compilas con Ant/Gradle/Maven, basta con que el task que invoca al compilador **cargue este config**. El punto clave es que el `external-library-path` apunte al SWC.

---

### Smoke test rápido (ActionScript)

Para verificar que el typedef está enlazado, crea una clase de prueba que “toque” los símbolos:

```as3
package com.example.app
{
  import inspiretree.InspireTree;
  import inspiretree.TreeNode;

  public class MainApp
  {
    public function MainApp()
    {
      // No ejecuta JS (solo tipos), pero el compilador debe conocerlos:
      var t:InspireTree = null; // usar como tipo
      var n:TreeNode = null;

      // Si quieres comprobar miembros, solo como tipos:
      var maybeId:String = (n != null) ? n.id : null; // n.id existe en el typedef
    }
  }
}
```

Si esto compila sin errores de tipo, tu `inspiretree.swc` está correctamente en el `external-library-path`.

¿quieres que te deje también un `build.xml` de app que invoque `mxmlc` con este `js-compile-config.xml`?
---
---
perfecto 🚀 aquí tienes un `build.xml` de ejemplo para **tu app Royale** que usa el `js-compile-config.xml` que vimos antes e incluye tu `inspiretree.swc` en el `external-library-path`.

lo planteo con la misma filosofía de los módulos `royale-typedefs` (ant + royale compiler).

---

## 📄 `build.xml`

```xml
<?xml version="1.0"?>
<project name="MyRoyaleApp" default="main" basedir=".">

  <!-- ajusta esta ruta a tu SDK Royale -->
  <property name="ROYALE_HOME" value="D:/Develop_Royale/SDKs/apache-royale-0.9.12"/>

  <!-- rutas internas -->
  <property name="SRC_DIR" value="src/main/royale"/>
  <property name="BIN_DIR" value="bin/js-debug"/>
  <property name="CONFIG_FILE" value="js-compile-config.xml"/>

  <target name="main" depends="compile"/>

  <target name="compile">
    <mkdir dir="${BIN_DIR}"/>

    <java jar="${ROYALE_HOME}/js/lib/mxmlc.jar"
          fork="true"
          failonerror="true">
      <!-- +royalelib apunta al framework JS de Royale -->
      <arg value="+royalelib=${ROYALE_HOME}/frameworks"/>
      <!-- tu config personalizado -->
      <arg value="-load-config=${CONFIG_FILE}"/>
    </java>
  </target>

  <target name="clean">
    <delete dir="${BIN_DIR}"/>
  </target>
</project>
```

---

## 📄 `js-compile-config.xml` (recordatorio)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<royale-config>
  <compiler>
    <main-class>com.example.app.MainApp</main-class>
    <source-path>
      <path-element>src/main/royale</path-element>
    </source-path>

    <external-library-path>
      <!-- tu typedef de InspireTree -->
      <path-element>libs/inspiretree.swc</path-element>
    </external-library-path>

    <define>
      <name>CONFIG::debug</name>
      <value>true</value>
    </define>
    <remove-circulars>true</remove-circulars>
    <warn-no-constructor>false</warn-no-constructor>
  </compiler>

  <js-output-type>FLEXJS</js-output-type>
  <targets>
    <target>JSRoyale</target>
  </targets>
  <output>bin/js-debug</output>
</royale-config>
```

---

## 🔧 estructura típica de proyecto

```
MyRoyaleApp/
 ├─ build.xml
 ├─ js-compile-config.xml
 ├─ src/
 │   └─ main/
 │       └─ royale/
 │           └─ com/example/app/MainApp.as
 ├─ libs/
 │   └─ inspiretree.swc
 └─ bin/
     └─ js-debug/   (aquí saldrá el .js compilado)
```

---

## ▶️ cómo compilar

```powershell
cd MyRoyaleApp
ant
```

o explícitamente:

```powershell
ant compile
```

---

¡genial! 🎉 aquí tienes un `MainApp.as` muy sencillo que sirve como **smoke test** para verificar que tu `inspiretree.swc` está bien conectado en Royale.

---

## 📄 `src/main/royale/com/example/app/MainApp.as`

```as3
package com.example.app
{
    import inspiretree.InspireTree;
    import inspiretree.TreeNode;
    import inspiretree.TreeNodes;

    /**
     * Clase principal de prueba para comprobar el typedef de InspireTree.
     */
    public class MainApp
    {
        public function MainApp()
        {
            // 👇 esto no ejecuta nada, solo valida que los tipos existen
            var tree:InspireTree = null;
            var node:TreeNode = null;
            var nodes:TreeNodes = null;

            // Uso de miembros tipados del typedef:
            // (el compilador Royale debe reconocerlos)
            var id:String = (node != null) ? node.id : null;
            var text:String = (node != null) ? node.text : null;

            // Llamada tipada (solo para validar firma, no ejecuta):
            if (tree != null)
            {
                var found:TreeNode = tree.node("abc");
                var list:TreeNodes = tree.checked();
            }

            trace("MainApp compilado correctamente con InspireTree typedefs.");
        }
    }
}
```

---

## ✅ qué esperar al compilar

1. Lanzas:

```powershell
ant
```

2. Si todo está bien:

   * El compilador **no se quejará de tipos desconocidos** (`InspireTree`, `TreeNode`, `TreeNodes`).
   * Verás el `.js` generado en `bin/js-debug`.
   * Al ejecutar ese `.js` en navegador, el `trace` se transformará en un `console.log`.

---

## 📌 notas

* Como este es un **typedef SWC**, no trae la implementación real de InspireTree. O sea, el `tree.node("abc")` **no se ejecutará de verdad** en runtime; solo es válido para el compilador Royale (te da autocompletado, chequeo de tipos, etc.).
* Si quieres enlazarlo con la librería JS real, tendrás que incluir `inspire-tree.js` en tu `index.html` y dejar que el runtime la resuelva (el typedef solo preserva nombres para Closure).

---

¿quieres que te prepare también un ejemplo de `index.html` para que el runtime cargue tanto tu `MainApp.js` como la librería real `inspire-tree.js`?
¡perfecto! aquí tienes un `index.html` básico que carga:

1. el runtime de Royale,
2. tu `MainApp.js` generado en `bin/js-debug`,
3. la librería real `inspire-tree` desde un CDN (o desde un path local si prefieres).

---

## 📄 `bin/js-debug/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Royale + InspireTree Test</title>
</head>
<body>
  <h1>Royale + InspireTree typedefs</h1>

  <!-- 1) Royale runtime (ajusta el path a tu SDK Royale si es necesario) -->
  <script src="../../../../frameworks/js/Royale/generated/Royale.js"></script>

  <!-- 2) Librería real InspireTree (desde CDN unpkg, o cámbialo a tu copia local) -->
  <script src="https://unpkg.com/inspire-tree/dist/inspire-tree.js"></script>

  <!-- 3) Tu app Royale compilada -->
  <script src="MainApp.js"></script>

  <script>
    // 🔍 comprobación rápida: que InspireTree exista en runtime
    if (window.InspireTree) {
      console.log("InspireTree está cargado en runtime ✅");
      // incluso puedes instanciarlo para verificar
      var tree = new InspireTree({ data: [] });
      console.log("Instancia de InspireTree creada:", tree);
    } else {
      console.warn("⚠️ InspireTree NO se cargó correctamente.");
    }
  </script>
</body>
</html>
```

---

## 🔧 notas

* Ajusta la ruta de `Royale.js` según dónde tengas tu SDK Royale instalado.
  En los proyectos típicos de Royale compilados a JS, `Royale.js` se copia a `bin/js-debug` automáticamente; si ya lo ves ahí, basta con:

  ```html
  <script src="Royale.js"></script>
  ```

* `inspire-tree.js` lo cargo desde unpkg CDN para simplificar. Si prefieres una copia local:

  ```
  libs/js/inspire-tree.js
  ```

  entonces cámbialo a:

  ```html
  <script src="libs/js/inspire-tree.js"></script>
  ```

* Tu `MainApp.js` lo genera el compilador Royale en `bin/js-debug`.

---

¿quieres que te deje también un ejemplo de **crear un InspireTree real desde AS3**, usando los typedefs para tipado pero ejecutando la lib real en runtime?
buenísimo — aquí tienes un ejemplo **AS3/Royale** que usa tus *typedefs* (`inspiretree.swc`) para el tipado y, en **runtime**, instancia la librería JS real expuesta como **global** `InspireTree` (la cargas en tu `index.html`, como en el paso anterior).

### 1) Crear e instanciar InspireTree desde AS3 (con tipado)

`src/main/royale/com/example/app/MainApp.as`

```as3
package com.example.app
{
    import inspiretree.InspireTree;
    import inspiretree.TreeNode;
    import inspiretree.TreeNodes;

    // Para acceder a window en JS:
    COMPILE::JS
    {
        import js.Browser;
    }

    public class MainApp
    {
        public function MainApp()
        {
            // Config básica con datos embebidos (coincide con tu typedef NodeConfig)
            var opts:Object =
            {
                data: [
                    {
                        id: "root",
                        text: "Root node",
                        children: [
                            { id: "a", text: "Child A" },
                            { id: "b", text: "Child B" }
                        ],
                        itree: {
                            state: { expanded: true }
                        }
                    }
                ],
                selection: { multiple: true }
            };

            // Instanciación en runtime (JS) con tipado por typedefs:
            var tree:InspireTree = createInspireTree(opts);

            // Ejemplos de uso tipado (no ejecuta en SWF, sí en JS)
            if (tree)
            {
                // añadir un nodo
                var added:TreeNode = tree.addNode({ id: "c", text: "Child C" });

                // obtener nodo por id y leer propiedades tipadas
                var n:TreeNode = tree.node("a");
                var txt:String = n ? n.text : null;

                // recorrer seleccionados (tipo TreeNodes)
                var selected:TreeNodes = tree.selected(true);
                trace("Seleccionados:", selected ? selected.length : 0);
            }
        }

        /**
         * Crea una instancia de InspireTree usando la librería JS global cargada en index.html.
         * Devuelve un objeto tipado gracias al SWC de typedefs.
         */
        private function createInspireTree(opts:Object):InspireTree
        {
            COMPILE::JS
            {
                // window.InspireTree (o el global que exponga tu bundle)
                var Ctor:* = js.Browser.window["InspireTree"];
                if (Ctor == null)
                {
                    js.Browser.window.console.error(
                        "InspireTree no está disponible. ¿Incluiste el script en index.html?"
                    );
                    return null;
                }

                // instancia real JS, casteada al tipo AS por el typedef
                var inst:* = new Ctor(opts);
                return inst as InspireTree;
            }

            // En SWF no hay runtime JS:
            COMPILE::SWF
            {
                return null;
            }
        }
    }
}
```

### 2) `index.html` (recordatorio mínimo)

Asegúrate de tener en `bin/js-debug/index.html`:

```html
<script src="Royale.js"></script>
<script src="https://unpkg.com/inspire-tree/dist/inspire-tree.js"></script>
<script src="MainApp.js"></script>
```

> Si usas otro bundle (CommonJS/UMD) que exponga otro nombre global, cambia `js.Browser.window["InspireTree"]` por el que corresponda.

### 3) Puntos finos y buenas prácticas

* El **typedef** (tu `inspiretree.swc`) te da **autocompletado + chequeo de tipos** en Royale y mantiene nombres frente a `ADVANCED` de Closure.
* La **instanciación** se hace en bloque `COMPILE::JS`, tocando el global `window.InspireTree`.
* El objeto devuelto se **castea** a `InspireTree` para que el compilador conozca métodos como `addNode`, `node`, `selected`, etc.
* Si más adelante empaquetas InspireTree con un bundler (CJS/ESM), asegúrate de **exponer un global** (o adapta el lookup) para que el runtime lo encuentre.

si quieres, te preparo también un ejemplo de **escucha de eventos** (`'node.selected'`, etc.) con el tipado de tu typedef (`TreeEvents`) y cómo mapear callbacks AS → JS sin perder nombres con Closure.
---
---
¡vamos a enganchar eventos de InspireTree desde Royale con tipado y sin pelearnos con Closure! 👇

# 1) Helper de interop para `on`, `once`, `off`

Crea una clase utilitaria que haga las llamadas JS en bloque `COMPILE::JS` y acepte handlers tipeados. Usa **notación por corchetes** para evitar minificación de nombres de métodos (`on`, `once`, `off`) y de los nombres de eventos (que son strings y no se renombran de todas formas).

`src/main/royale/com/example/app/InspireTreeInterop.as`

```as3
package com.example.app
{
    import inspiretree.InspireTree;
    import inspiretree.TreeNode;
    import inspiretree.TreeNodes;

    COMPILE::JS { import js.Browser; }

    public final class InspireTreeInterop
    {
        /**
         * Añade un listener estándar.
         *
         * @param tree    instancia real de InspireTree (JS)
         * @param event   nombre exacto del evento (p.ej. "node.selected")
         * @param handler función ActionScript (tipada) que será invocada desde JS
         */
        public static function on(tree:InspireTree, event:String, handler:Function):void
        {
            COMPILE::JS
            {
                var obj:* = tree as *;
                var onFn:* = (obj != null) ? obj["on"] : null;
                if (onFn == null)
                {
                    Browser.window.console.warn("InspireTree.on no disponible");
                    return;
                }
                // Llama a on(event, handler) con this=tree
                onFn.call(obj, event, handler);
            }
        }

        /** Igual que on(), pero para once(). */
        public static function once(tree:InspireTree, event:String, handler:Function):void
        {
            COMPILE::JS
            {
                var obj:* = tree as *;
                var fn:* = (obj != null) ? obj["once"] : null;
                if (fn == null)
                {
                    Browser.window.console.warn("InspireTree.once no disponible");
                    return;
                }
                fn.call(obj, event, handler);
            }
        }

        /**
         * Elimina un listener previamente añadido con on/once.
         * Debes pasar la MISMA referencia de handler que registraste.
         */
        public static function off(tree:InspireTree, event:String, handler:Function):void
        {
            COMPILE::JS
            {
                var obj:* = tree as *;
                var fn:* = (obj != null) ? obj["off"] : null;
                if (fn == null)
                {
                    Browser.window.console.warn("InspireTree.off no disponible");
                    return;
                }
                fn.call(obj, event, handler);
            }
        }

        /** onAny(listener) — recibe (eventName, ...values). */
        public static function onAny(tree:InspireTree, handler:Function):void
        {
            COMPILE::JS
            {
                var obj:* = tree as *;
                var fn:* = (obj != null) ? obj["onAny"] : null;
                if (fn == null) return;
                fn.call(obj, handler);
            }
        }

        /** removeListener()/removeAny/offAny según corresponda. */
        public static function offAny(tree:InspireTree, handler:Function):void
        {
            COMPILE::JS
            {
                var obj:* = tree as *;
                var fn:* = (obj != null) ? obj["offAny"] : null;
                if (fn == null) return;
                fn.call(obj, handler);
            }
        }

        /** Emitir eventos manualmente si lo necesitas. */
        public static function emit(tree:InspireTree, event:String, ...values):void
        {
            COMPILE::JS
            {
                var obj:* = tree as *;
                var fn:* = (obj != null) ? obj["emit"] : null;
                if (fn == null) return;
                fn.apply(obj, [event].concat(values));
            }
        }
    }
}
```

> Nota: al usar `obj["on"]` en vez de `obj.on` evitamos que Closure/ADVANCED pueda renombrar el acceso (aunque en externs ya preserva, es buena práctica para interop directo).

# 2) Usarlo desde tu `MainApp` con handlers tipados

Aquí enganchamos varios eventos típicos: `node.selected`, `children.loaded`, `data.loaded`, `node.state.changed`.
Las firmas de handlers se basan en tu `.d.ts`: por ejemplo, `node.selected?: (node: TreeNode, isLoadEvent: boolean) => void`.

`src/main/royale/com/example/app/MainApp.as`

```as3
package com.example.app
{
    import inspiretree.InspireTree;
    import inspiretree.TreeNode;
    import inspiretree.TreeNodes;

    COMPILE::JS { import js.Browser; }

    public class MainApp
    {
        // mantenemos referencias a los handlers para poder hacer off()
        private var _onSelected:Function;
        private var _onChildrenLoaded:Function;
        private var _onDataLoaded:Function;
        private var _onStateChanged:Function;

        public function MainApp()
        {
            // instanciar InspireTree real (ver ejemplo anterior)
            var tree:InspireTree = createInspireTree({
                data: [
                    { id: "root", text: "Root", children: [
                        { id: "a", text: "Child A" }, { id: "b", text: "Child B" }
                    ]}
                ],
                selection: { multiple: true }
            });

            if (tree)
            {
                // 1) node.selected (node: TreeNode, isLoadEvent: boolean)
                _onSelected = function(node:TreeNode, isLoadEvent:Boolean):void
                {
                    trace("[node.selected]", node ? node.id : "?", "load?", isLoadEvent);
                };
                InspireTreeInterop.on(tree, "node.selected", _onSelected);

                // 2) children.loaded (node: TreeNode)
                _onChildrenLoaded = function(node:TreeNode):void
                {
                    trace("[children.loaded] for", node ? node.id : "?");
                };
                InspireTreeInterop.on(tree, "children.loaded", _onChildrenLoaded);

                // 3) data.loaded (nodes: any[])  → tipamos como Array en AS
                _onDataLoaded = function(nodes:Array):void
                {
                    trace("[data.loaded] nodes:", nodes ? nodes.length : 0);
                };
                InspireTreeInterop.on(tree, "data.loaded", _onDataLoaded);

                // 4) node.state.changed (node: TreeNode)
                _onStateChanged = function(node:TreeNode):void
                {
                    trace("[node.state.changed]", node ? node.id : "?");
                };
                InspireTreeInterop.on(tree, "node.state.changed", _onStateChanged);

                // Ejemplo de once(): primera expansión
                InspireTreeInterop.once(tree, "node.expanded", function(node:TreeNode, isLoadEvent:Boolean):void {
                    trace("[node.expanded:once]", node ? node.id : "?");
                });
            }
        }

        /** Llamar esto al “cerrar” la app para evitar fugas de listeners. */
        public function dispose(tree:InspireTree):void
        {
            if (!tree) return;
            if (_onSelected)        InspireTreeInterop.off(tree, "node.selected", _onSelected);
            if (_onChildrenLoaded)  InspireTreeInterop.off(tree, "children.loaded", _onChildrenLoaded);
            if (_onDataLoaded)      InspireTreeInterop.off(tree, "data.loaded", _onDataLoaded);
            if (_onStateChanged)    InspireTreeInterop.off(tree, "node.state.changed", _onStateChanged);

            _onSelected = _onChildrenLoaded = _onDataLoaded = _onStateChanged = null;
        }

        private function createInspireTree(opts:Object):InspireTree
        {
            COMPILE::JS
            {
                var Ctor:* = js.Browser.window["InspireTree"];
                if (!Ctor)
                {
                    js.Browser.window.console.error("InspireTree no disponible (no está cargado en index.html).");
                    return null;
                }
                return (new Ctor(opts)) as InspireTree;
            }
            COMPILE::SWF { return null; }
        }
    }
}
```

# 3) Consejos para Closure/ADVANCED (nombres a salvo)

* Al tener **externs** para `InspireTree` y su API, Closure **no renombra** esos símbolos públicos.
* Usar **strings literales** para eventos (`"node.selected"`, etc.) ya es seguro: las cadenas no se renombran.
* Evitar `obj.on(...)` y preferir `obj["on"](...)` reduce el riesgo en interop directo si hubiera reescrituras (aunque con externs bien hechos, `on`/`off` están protegidos de todos modos).

# 4) Probar rápido

* Asegúrate que tu `index.html` carga **la lib real** de InspireTree **antes** de `MainApp.js`.
* Compila tu app (`ant`) y abre `bin/js-debug/index.html` en el navegador.
* Deberías ver los `trace(...)` como `console.log(...)` cuando interactúes con el árbol (si tienes UI), o puedes forzar eventos con:

```as3
// ejemplo para disparar un evento:
InspireTreeInterop.emit(tree, "node.selected", someNode, false);
```

¿quieres que hagamos también un micro-ejemplo de “crear un árbol DOM” con el renderer oficial de InspireTree para que puedas hacer clics y ver los eventos dispararse en la consola?
---
---
perfecto — montamos un micro-ejemplo con **UI real** usando el renderer oficial **`inspire-tree-dom`** para que puedas clicar nodos y ver cómo saltan los eventos que ya enganchaste desde AS3.

# 1) `index.html` con CSS/JS de InspireTree + DOM renderer

Pon esto en `bin/js-debug/index.html` (ajusta la ruta de `Royale.js` si ya te lo copia el build ahí):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Royale + InspireTree DOM Demo</title>

  <!-- CSS del renderer DOM (estilos del árbol) -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/inspire-tree-dom/dist/inspire-tree.css"
  />

  <style>
    body { font-family: sans-serif; margin: 20px; }
    #tree { border: 1px solid #ddd; padding: 8px; width: 320px; min-height: 240px; }
    .controls { margin-top: 12px; }
    .controls button { margin-right: 8px; }
  </style>
</head>
<body>
  <h1>Royale + InspireTree typedefs + DOM renderer</h1>

  <!-- contenedor del árbol -->
  <div id="tree"></div>

  <div class="controls">
    <button id="btn-expand">Expand all</button>
    <button id="btn-collapse">Collapse all</button>
    <button id="btn-add">Add node under Root</button>
  </div>

  <!-- 1) Runtime Royale -->
  <script src="Royale.js"></script>

  <!-- 2) Librería InspireTree y su DOM renderer -->
  <script src="https://unpkg.com/inspire-tree/dist/inspire-tree.js"></script>
  <script src="https://unpkg.com/inspire-tree-dom/dist/inspire-tree-dom.js"></script>

  <!-- 3) Tu app compilada -->
  <script src="MainApp.js"></script>

  <script>
    // Hooks de demo para los botones (opcional),
    // los rellenaremos desde AS3 llamando a window handlers:
    document.getElementById('btn-expand').addEventListener('click', function() {
      if (window.demo && window.demo.expandAll) window.demo.expandAll();
    });
    document.getElementById('btn-collapse').addEventListener('click', function() {
      if (window.demo && window.demo.collapseAll) window.demo.collapseAll();
    });
    document.getElementById('btn-add').addEventListener('click', function() {
      if (window.demo && window.demo.addChild) window.demo.addChild();
    });
  </script>
</body>
</html>
```

> Nota: `inspire-tree-dom` expone un global `InspireTreeDOM` cuando se carga por `<script>`. El CSS lo trae `inspire-tree.css`.

---

# 2) `MainApp.as`: crear árbol, enganchar eventos y **adjuntar renderer**

Añadimos una función para **adjuntar el renderer** y opcionalmente **exponer unos handlers** para los botones de la demo.

```as3
package com.example.app
{
    import inspiretree.InspireTree;
    import inspiretree.TreeNode;
    import inspiretree.TreeNodes;

    COMPILE::JS { import js.Browser; }

    public class MainApp
    {
        private var _tree:InspireTree;

        // Handlers guardados (por si quieres desuscribir en dispose)
        private var _onSelected:Function;
        private var _onChildrenLoaded:Function;

        public function MainApp()
        {
            // 1) instancia InspireTree (runtime real) con datos simples
            _tree = createInspireTree({
                data: [
                    { id: "root", text: "Root", children: [
                        { id: "a", text: "Child A" },
                        { id: "b", text: "Child B" }
                    ], itree: { state: { expanded: true } } }
                ],
                selection: { multiple: true }
            });

            if (_tree)
            {
                // 2) adjunta el renderer DOM al #tree
                attachDomRenderer(_tree, "#tree");

                // 3) engancha algunos eventos (ejemplos)
                _onSelected = function(node:TreeNode, isLoadEvent:Boolean):void
                {
                    trace("[node.selected]", node ? node.id : "?", "load?", isLoadEvent);
                };
                InspireTreeInterop.on(_tree, "node.selected", _onSelected);

                _onChildrenLoaded = function(node:TreeNode):void
                {
                    trace("[children.loaded] for", node ? node.id : "?");
                };
                InspireTreeInterop.on(_tree, "children.loaded", _onChildrenLoaded);

                // 4) expone helpers a window para botones de la demo
                exposeDemoControls();
            }
        }

        private function createInspireTree(opts:Object):InspireTree
        {
            COMPILE::JS
            {
                var Ctor:* = Browser.window["InspireTree"];
                if (!Ctor)
                {
                    Browser.window.console.error("InspireTree no está cargado.");
                    return null;
                }
                return (new Ctor(opts)) as InspireTree;
            }
            COMPILE::SWF { return null; }
        }

        private function attachDomRenderer(tree:InspireTree, targetSelector:String):void
        {
            COMPILE::JS
            {
                var DomCtor:* = Browser.window["InspireTreeDOM"];
                if (!DomCtor)
                {
                    Browser.window.console.error("InspireTreeDOM no está cargado.");
                    return;
                }
                // new InspireTreeDOM(tree, { target: '#tree' })
                new DomCtor(tree, { target: targetSelector });
            }
        }

        private function exposeDemoControls():void
        {
            COMPILE::JS
            {
                // expone un pequeño API para los botones definidos en index.html
                Browser.window["demo"] = {
                    expandAll: function():void {
                        if (_tree) _tree.expand(); // devuelve Promise; expand hijos ya renderizados
                    },
                    collapseAll: function():void {
                        if (_tree) _tree.collapse();
                    },
                    addChild: function():void {
                        if (!_tree) return;
                        var root:* = _tree.node("root");
                        if (!root) return;
                        var nid:String = "n" + Math.floor(Math.random() * 10000);
                        root.addChild({ id: nid, text: "New " + nid });
                        // asegúrate de que se vea:
                        root.expand();
                    }
                };
            }
        }

        public function dispose():void
        {
            if (!_tree) return;
            if (_onSelected)        InspireTreeInterop.off(_tree, "node.selected", _onSelected);
            if (_onChildrenLoaded)  InspireTreeInterop.off(_tree, "children.loaded", _onChildrenLoaded);
            _onSelected = _onChildrenLoaded = null;
            _tree = null;
        }
    }
}
```

> El DOM renderer ya se encarga de escuchar tu `tree` y pintar/actualizar el `<div id="tree">`. La selección, expand/collapse, etc., se gestionan clicando en el UI.

---

# 3) Notas y variaciones

* Si usas un **bundle CommonJS/ESM** en vez de globals, asegura que el bundle **exponga** `window.InspireTree` y `window.InspireTreeDOM` (o adapta el acceso en AS3).
* Puedes pasar **más opciones** al DOM renderer (por ejemplo, plantillas/custom renderers). La forma típica es:

  ```js
  new InspireTreeDOM(tree, {
    target: '#tree',
    // ejemplo: usar checkbox true/false
    checkbox: true
  });
  ```
* Los métodos de `TreeNode` y `InspireTree` que invocas desde AS3 (p. ej., `addChild`, `expand`, `collapse`) **ejecutan la librería real** en runtime JS. El SWC de typedefs solo te da tipado/completado y preserva nombres para Closure.

---

¿quieres que montemos también un **typedef** sencillo para `InspireTreeDOM` (igual que hicimos con InspireTree) para que tengas tipado al llamar a `new InspireTreeDOM(...)` desde AS3? Si vas a usarlo bastante, compensa crear un `royale-typedefs-inspiretree-dom` pequeñito.
