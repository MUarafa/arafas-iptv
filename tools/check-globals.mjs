// Catch identifiers the bundle uses but never declares.
//
// A refactor can leave a call pointing at nothing — the build stays happy and the app
// breaks only when that screen is opened. This finds those before the TV does.
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

// __globalThis__ is the bundle's own globalThis polyfill: it defines the property on
// Object.prototype, reads it, then deletes it, so it resolves at run time by design.
const KNOWN = new Set(`
window document navigator localStorage sessionStorage location history screen console
setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame
XMLHttpRequest fetch Headers Request Response AbortController FormData URL URLSearchParams
Promise Symbol Proxy Reflect Math JSON Object Array String Number Boolean Date RegExp Error
TypeError RangeError SyntaxError Map Set WeakMap WeakSet Function globalThis self top parent
Image Audio Video Event CustomEvent KeyboardEvent MouseEvent MessageEvent ErrorEvent
HTMLElement HTMLImageElement HTMLVideoElement Element Node NodeList DocumentFragment DOMParser
encodeURIComponent decodeURIComponent encodeURI decodeURI escape unescape
isNaN isFinite parseInt parseFloat NaN Infinity undefined
Intl TextDecoder TextEncoder performance atob btoa indexedDB IDBKeyRange
Blob File FileReader WebSocket MutationObserver IntersectionObserver ResizeObserver
getComputedStyle matchMedia devicePixelRatio requestIdleCallback queueMicrotask structuredClone
webOS webOSDev PalmSystem arguments
__globalThis__
`.trim().split(/\s+/));

const file = process.argv[2] || new URL('../app/bundle.js', import.meta.url).pathname.replace(/^\//, '');
const code = readFileSync(process.argv[2] ? file : new URL('../app/bundle.js', import.meta.url), 'utf8');
const ast = parse(code, { sourceType: 'script', allowReturnOutsideFunction: true });

const unresolved = new Map();
traverse(ast, {
  Identifier(path) {
    if (!path.isReferencedIdentifier()) return;
    const name = path.node.name;
    if (KNOWN.has(name)) return;
    if (path.scope.hasBinding(name, true)) return;
    unresolved.set(name, (unresolved.get(name) || 0) + 1);
  },
});

if (!unresolved.size) {
  console.log('no unresolved identifiers: every name the bundle uses is declared or a known browser global.');
  process.exit(0);
}
console.log('UNRESOLVED identifiers (these will throw at runtime):');
for (const [name, n] of [...unresolved].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${name}  used ${n}x`);
}
process.exit(1);
