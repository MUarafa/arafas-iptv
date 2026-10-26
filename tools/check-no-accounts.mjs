// Store builds: refuse to package if any server, username or password from secrets/ is
// anywhere in the app folder about to be packaged.
//   node tools/check-no-accounts.mjs <app folder>
import fs from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error("usage: node tools/check-no-accounts.mjs <app folder>");
  process.exit(2);
}
const vals = new Set();
for (const f of ["secrets/accounts.json", "secrets/account.json"]) {
  if (!fs.existsSync(f)) continue;
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const a of [].concat(j))
    for (const k of ["url", "username", "password"])
      if (a && a[k] && String(a[k]).length >= 4)
        vals.add(String(a[k]).replace(/^https?:\/\//, "").replace(/\/+$/, ""));
}
const walk = (d) =>
  fs.readdirSync(d).flatMap((n) => {
    const p = path.join(d, n);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });
for (const p of walk(dir)) {
  const s = fs.readFileSync(p, "latin1");
  for (const v of vals)
    if (s.includes(v)) {
      console.error("account data found in " + p);
      process.exit(1);
    }
}
console.log("store build: no account data inside (" + vals.size + " values checked)");
