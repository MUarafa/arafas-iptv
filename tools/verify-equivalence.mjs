// Prove a rename changed only identifier spellings.
//
// Renaming identifiers cannot alter a single string or number literal, so if both
// builds yield the same ordered literals, they behave the same.
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

const ref = process.argv[2] || 'HEAD';
const now = readFileSync(new URL('../app/bundle.js', import.meta.url), 'utf8');
const was = execSync('git show ' + ref + ':app/bundle.js', { maxBuffer: 1e8 }).toString('utf8');
const A = literals(was);
const B = literals(now);

function compare(label, a, b) {
  let first = -1;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) { first = i; break; }
  }
  console.log('  ' + label.padEnd(16) + String(a.length).padStart(6) + ' -> ' + String(b.length).padStart(6) + '   identical: ' + (first === -1));
  if (first !== -1) {
    console.log('    first difference at #' + first);
    console.log('      was: ' + JSON.stringify(a[first]).slice(0, 90));
    console.log('      now: ' + JSON.stringify(b[first]).slice(0, 90));
  }
  return first === -1;
}

console.log('comparing app/bundle.js against ' + ref);
console.log('  size            ' + String(was.length).padStart(6) + ' -> ' + String(now.length).padStart(6) + '   same: ' + (was.length === now.length));
const ok = compare('string literals', A.strings, B.strings) & compare('number literals', A.numbers, B.numbers);
console.log(ok ? '\nEQUIVALENT: only identifier spellings differ.' : '\nDIFFERENT: inspect before shipping.');
process.exit(ok ? 0 : 1);
