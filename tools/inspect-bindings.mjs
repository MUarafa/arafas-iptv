// List the module-level bindings of src/app.js with how often each is used, so the
// recovered bundle can be given real names from evidence rather than guesswork.
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

const src = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const ast = parse(src, { sourceType: 'script' });

let moduleScope = null;
traverse(ast, {
  ArrowFunctionExpression(path) {
    if (moduleScope) return;
    if (path.parentPath.isCallExpression() && path.parent.callee === path.node) moduleScope = path.scope;
  },
  FunctionExpression(path) {
    if (moduleScope) return;
    if (path.parentPath.isCallExpression() && path.parent.callee === path.node) moduleScope = path.scope;
  },
});
if (!moduleScope) { console.error('module IIFE scope not found'); process.exit(1); }

const rows = [];
for (const [name, binding] of Object.entries(moduleScope.bindings)) {
  const node = binding.path.node;
  let kind = node.type;
  let preview = '';
  const start = binding.path.node.start;
  preview = src.slice(start, start + 90).replace(/\s+/g, ' ');
  rows.push({ name, kind, refs: binding.references, preview });
}
rows.sort((a, b) => b.refs - a.refs);
console.log(`module-level bindings: ${rows.length}\n`);
const only = process.argv[2];
for (const r of rows) {
  if (only && !new RegExp(only).test(r.name)) continue;
  console.log(`${r.name.padEnd(5)} refs=${String(r.refs).padStart(4)}  ${r.preview.slice(0, 96)}`);
}
