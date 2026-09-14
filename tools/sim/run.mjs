// Runs the simulator scenarios against app/ (build it first: npm run build).
//
//   node tools/sim/run.mjs              every scenario
//   node tools/sim/run.mjs resume rail  only scenarios whose name contains a word
//
// Never touches a TV: the provider, the streams and the clock are all simulated.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./server.mjs";
import { launchBrowser, openApp } from "./lib.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");
const filters = process.argv.slice(2).map((s) => s.toLowerCase());

export class Failure extends Error {}

function makeExpect(name) {
  let fn = (cond, message) => {
    if (!cond) throw new Failure(message);
  };
  fn.eq = (actual, expected, message) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected))
      throw new Failure(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  };
  return fn;
}

const files = fs
  .readdirSync(path.join(HERE, "scenarios"))
  .filter((f) => f.endsWith(".mjs"))
  .sort();
let scenarios = [];
for (let f of files) {
  let mod = await import("./scenarios/" + f);
  for (let s of mod.default) scenarios.push({ ...s, file: f });
}
if (filters.length)
  scenarios = scenarios.filter((s) => filters.some((w) => (s.file + " " + s.name).toLowerCase().includes(w)));

fs.mkdirSync(OUT, { recursive: true });
const server = await startServer();
const browser = await launchBrowser();
const results = [];

for (let s of scenarios) {
  server.setConfig(s.config || {});
  let apps = [];
  let started = Date.now();
  let ctx = {
    server,
    expect: makeExpect(s.name),
    async open(opts) {
      let app = await openApp(browser, server, opts);
      apps.push(app);
      return app;
    },
    note: [],
  };
  let result = { file: s.file, name: s.name, ok: true };
  try {
    await Promise.race([
      s.run(ctx),
      new Promise((_, rej) => setTimeout(() => rej(new Failure("scenario timed out (180 s)")), 180e3)),
    ]);
    // Any uncaught error anywhere fails the scenario, whatever it was checking.
    for (let app of apps) {
      let errs = (await app.eval("__sim.errors").catch(() => [])).concat(app.errors);
      let allowed = s.allowErrors ? errs.filter((e) => !s.allowErrors.test(e.message)) : errs;
      if (allowed.length) throw new Failure("uncaught errors: " + allowed.map((e) => e.type + ": " + e.message).join(" | "));
    }
  } catch (e) {
    result.ok = false;
    result.error = e instanceof Failure ? e.message : String(e && e.stack);
    let slug = (s.file + "-" + s.name).replace(/[^a-z0-9]+/gi, "-").slice(0, 80);
    for (let [i, app] of apps.entries()) await app.screenshot(path.join(OUT, `${slug}-${i}.png`)).catch(() => {});
  }
  result.ms = Date.now() - started;
  result.note = ctx.note;
  for (let app of apps) await app.close();
  results.push(result);
  console.log(`${result.ok ? "PASS" : "FAIL"}  ${s.file} :: ${s.name}  (${result.ms} ms)${result.ok ? "" : "\n      " + result.error}`);
  for (let n of ctx.note) console.log("      note: " + n);
}

await browser.close();
await server.close();
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
let failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
