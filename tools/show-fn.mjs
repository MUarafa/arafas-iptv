// Print the full body of named module-level functions, to name them from evidence.
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;
const src = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const ast = parse(src, { sourceType: 'script' });
const want = new Set(process.argv.slice(2));
traverse(ast, {
  FunctionDeclaration(path) {
    const n = path.node.id && path.node.id.name;
    if (!n || !want.has(n)) return;
    console.log(`--- ${n} ---`);
    console.log(src.slice(path.node.start, path.node.end).replace(/\n\s*/g, ' ').slice(0, 260));
    console.log();
  },
});
