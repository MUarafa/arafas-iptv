// Move a set of module-level bindings out of src/app.js into their own ES module.
//
// Refuses to move anything that still depends on code left behind, so a split can
// never quietly create a cycle back into the entry point. Run it once per module:
//   node tools/split-module.mjs keys KEY_LEFT KEY_UP ...
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

const [moduleName, ...wanted] = process.argv.slice(2);
if (!moduleName || !wanted.length) {
  console.error('usage: split-module.mjs <name> <binding> [binding...]');
  process.exit(2);
}
const appUrl = new URL('../src/app.js', import.meta.url);
const outUrl = new URL(`../src/${moduleName}.js`, import.meta.url);
if (existsSync(outUrl)) { console.error(`src/${moduleName}.js already exists`); process.exit(1); }

const src = readFileSync(appUrl, 'utf8');
const ast = parse(src, { sourceType: 'module' });

let scope = null, bodyPath = null;
traverse(ast, {
  'ArrowFunctionExpression|FunctionExpression'(path) {
    if (scope) return;
    if (path.parentPath.isCallExpression() && path.parent.callee === path.node) {
      scope = path.scope; bodyPath = path.get('body');
    }
  },
});
if (!scope) { console.error('module IIFE not found'); process.exit(1); }

// Statements that declare any wanted binding (a statement may declare several).
const stmts = new Set();
const moving = new Set();
for (const name of wanted) {
  const b = scope.bindings[name];
  if (!b) { console.error(`  no module binding: ${name}`); process.exit(1); }
  let p = b.path;
  while (p && p.parentPath !== bodyPath) p = p.parentPath;
  if (!p) { console.error(`  ${name} is not a top-level statement`); process.exit(1); }
  stmts.add(p);
}
for (const p of stmts) Object.keys(p.getOuterBindingIdentifiers()).forEach((n) => moving.add(n));

// Anything these statements reference that stays behind would be a cycle: refuse.
const needsFromOutside = new Set();
for (const p of stmts) {
  p.traverse({
    Identifier(id) {
      if (!id.isReferencedIdentifier()) return;
      const n = id.node.name;
      if (moving.has(n)) return;
      if (!scope.bindings[n]) return; // a global, or declared elsewhere in an inner scope
      const owner = id.scope.getBinding(n);
      if (owner && owner.scope === scope) needsFromOutside.add(n);
    },
  });
}
// References to modules already split out must be re-imported by the new module.
const fromModules = new Map();
for (const p of stmts) {
  p.traverse({
    Identifier(id) {
      if (!id.isReferencedIdentifier()) return;
      const n = id.node.name;
      if (moving.has(n)) return;
      const owner = id.scope.getBinding(n);
      if (!owner || owner.kind !== 'module') return;
      const decl = owner.path.parentPath;
      if (!decl.isImportDeclaration()) return;
      const from = decl.node.source.value;
      if (!fromModules.has(from)) fromModules.set(from, new Set());
      fromModules.get(from).add(n);
    },
  });
}

if (needsFromOutside.size) {
  console.error(`refusing: ${moduleName} would still depend on ${[...needsFromOutside].join(', ')}`);
  console.error('move those too, or pick a different grouping.');
  process.exit(1);
}

// Build the new module, in the order the statements appeared.
const ordered = [...stmts].sort((a, b) => a.node.start - b.node.start);
const pieces = ordered.map((p) => {
  const code = src.slice(p.node.start, p.node.end);
  return /^(function|var|let|const|class)\b/.test(code) ? `export ${code}` : code;
});
const header = `// ${moduleName}: extracted from the recovered bundle. See docs/RECOVERY.md.\n\n`;
writeFileSync(outUrl, header + pieces.join('\n\n') + '\n', 'utf8');

// Remove them from app.js and import instead.
for (const p of ordered) p.remove();
const names = [...moving].sort();
const importLine = `import {\n  ${names.join(',\n  ')},\n} from './${moduleName}.js';\n`;
const out = generate(ast, { comments: true, jsescOption: { minimal: true } }, src);
writeFileSync(appUrl, importLine + out.code, 'utf8');

console.log(`src/${moduleName}.js  <-  ${ordered.length} statements, ${names.length} exports`);
console.log('  ' + names.join(', '));
