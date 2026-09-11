// Check that a refactor changed nothing that can affect behaviour.
//
// Renaming identifiers, and moving declarations into modules, cannot invent, drop or
// alter a single literal. So both builds must contain exactly the same literals.
// Renames preserve their order too; a module split legitimately reorders them, so the
// multiset is the bar there.
//   node tools/verify-equivalence.mjs <git-ref>
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

function literals(code) {
  const ast = parse(code, { sourceType: 'script' });
  const strings = [];
  const numbers = [];
  traverse(ast, {
    StringLiteral(p) { strings.push(p.node.value); },
    NumericLiteral(p) { numbers.push(p.node.value); },
    TemplateElement(p) { strings.push(p.node.value.cooked ?? p.node.value.raw); },
  });
  return { strings, numbers };
}

const tally = (list) => {
  const m = new Map();
  for (const v of list) m.set(v, (m.get(v) || 0) + 1);
  return m;
};

function compare(label, a, b) {
  let ordered = a.length === b.length;
  if (ordered) for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) { ordered = false; break; }
  const ta = tally(a), tb = tally(b);
  const missing = [], extra = [];
  for (const [v, n] of ta) if ((tb.get(v) || 0) !== n) missing.push(`${JSON.stringify(v).slice(0, 60)} x${n} -> x${tb.get(v) || 0}`);
  for (const [v, n] of tb) if (!ta.has(v)) extra.push(`${JSON.stringify(v).slice(0, 60)} x${n}`);
  const same = missing.length === 0 && extra.length === 0;
  console.log(`  ${label.padEnd(16)}${String(a.length).padStart(6)} -> ${String(b.length).padStart(6)}   same content: ${same}${same && !ordered ? '  (reordered)' : ''}`);
  for (const m of missing.slice(0, 5)) console.log(`      changed/lost: ${m}`);
  for (const e of extra.slice(0, 5)) console.log(`      new:          ${e}`);
  return same;
}

const ref = process.argv[2] || 'HEAD';
const now = readFileSync(new URL('../app/bundle.js', import.meta.url), 'utf8');
const was = execSync('git show ' + ref + ':app/bundle.js', { maxBuffer: 1e8 }).toString('utf8');
const A = literals(was), B = literals(now);

console.log('comparing app/bundle.js against ' + ref);
console.log(`  size            ${String(was.length).padStart(6)} -> ${String(now.length).padStart(6)}`);
const ok = compare('string literals', A.strings, B.strings) & compare('number literals', A.numbers, B.numbers);
console.log(ok ? '\nEQUIVALENT: every literal survived unchanged.' : '\nDIFFERENT: inspect before shipping.');
process.exit(ok ? 0 : 1);
