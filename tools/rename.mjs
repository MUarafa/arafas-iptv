// Give the recovered bundle real names, safely.
//
// The bundle reuses short names (T, L, b, w...) in many scopes, so a text replace
// would corrupt it. This renames only the MODULE-level binding and its references,
// using Babel's scope analysis. Verify afterwards by rebuilding: the minified output
// should stay the same size and behaviour, because only spellings changed.
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

const srcPath = new URL('../src/app.js', import.meta.url);
const map = JSON.parse(readFileSync(new URL('./rename-map.json', import.meta.url), 'utf8'));
const src = readFileSync(srcPath, 'utf8');
const ast = parse(src, { sourceType: 'script' });

let moduleScope = null;
traverse(ast, {
  'ArrowFunctionExpression|FunctionExpression'(path) {
    if (moduleScope) return;
    if (path.parentPath.isCallExpression() && path.parent.callee === path.node) moduleScope = path.scope;
  },
});
if (!moduleScope) { console.error('module scope not found'); process.exit(1); }

const taken = new Set(Object.keys(moduleScope.bindings));
let done = 0, skipped = [];
for (const [from, to] of Object.entries(map)) {
  if (!moduleScope.bindings[from]) { skipped.push(`${from} (no such module binding)`); continue; }
  if (taken.has(to)) { skipped.push(`${from} -> ${to} (name already used)`); continue; }
  const refs = moduleScope.bindings[from].references;
  moduleScope.rename(from, to);
  taken.delete(from); taken.add(to);
  console.log(`  ${from.padEnd(4)} -> ${to.padEnd(24)} (${refs} references)`);
  done++;
}
if (skipped.length) console.log('\nskipped:\n  ' + skipped.join('\n  '));

const out = generate(ast, { retainLines: false, compact: false, comments: true, jsescOption: { minimal: true } }, src);
writeFileSync(srcPath, out.code, 'utf8');
console.log(`\nrenamed ${done} module bindings`);
