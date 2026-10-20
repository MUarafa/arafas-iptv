#!/usr/bin/env bash
# Package Arafa's IPTV into an installable .ipk.
#
#   ./build.sh                 -> just build
#   ./build.sh install         -> build, then install + launch on every TV set up in ares
#
# On the machine whose toolchain lives on D: (no Node on C:, no nvm) that toolchain is
# used; anywhere else the Node, ares CLI and device list already on PATH/HOME are used.
set -uo pipefail
cd "$(dirname "$0")"

# POSIX-style paths: Git Bash does not resolve "D:/..." entries on PATH.
if [ -d /d/IPTV/node22/node-v22.22.2-win-x64 ]; then
  export PATH="/d/IPTV/node22/node-v22.22.2-win-x64:/d/IPTV/npm-global:$PATH"
fi
if [ -d /d/IPTV/webos-home ]; then
  export HOME="/d/IPTV/webos-home"
fi

# Which TVs to install on. Override without editing this file:
#   TV_DEVICES="living room,bedroom" ./build.sh install
IFS="," read -r -a TVS <<< "${TV_DEVICES:-$(ares-setup-device -F -j 2>/dev/null | node -e "
  let d=\"\";process.stdin.on(\"data\",c=>d+=c);process.stdin.on(\"end\",()=>{
    try{const a=JSON.parse(d).filter(x=>x.name!==\"emulator\");console.log(a.map(x=>x.name).join(\",\"))}catch{console.log(\"\")}
  })")}"
PLACEHOLDER='{url:"",username:"",password:""}'

command -v node >/dev/null || { echo "node not found on PATH" >&2; exit 1; }
command -v ares-package >/dev/null || { echo "ares-package not found on PATH" >&2; exit 1; }

# Rebuild the bundle from src/ when the dev tooling is installed. A plain clone
# without `npm install` still packages the committed bundle, so this stays optional.
if [ -d node_modules/esbuild ]; then
  npm run --silent build || { echo "bundle build failed" >&2; exit 1; }
  echo "bundle rebuilt from src/"
  # A refactor can leave a call pointing at nothing: the build stays happy and the
  # app breaks only on the screen that uses it. Refuse to package that.
  node tools/check-globals.mjs || { echo "unresolved identifiers - refusing to package" >&2; exit 1; }
fi

node --check app/bundle.js || exit 1
echo "syntax ok"

# Accounts are injected into a staged copy of app/ that is packaged and then thrown
# away, so the working tree never holds credentials - even when the build fails.
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT
cp -r app "$STAGE/app"

# secrets/accounts.json (the account list, seeded once on a TV with no saved accounts).
if [ -f secrets/accounts.json ]; then
  node -e '
    const fs = require("fs");
    const list = JSON.parse(fs.readFileSync("secrets/accounts.json", "utf8"));
    const p = process.argv[1];
    let s = fs.readFileSync(p, "utf8");
    const slot = "{json:\"\"}";
    const n = s.split(slot).length - 1;
    if (n !== 1) { console.error("preset slot found " + n + " times, expected 1"); process.exit(1); }
    fs.writeFileSync(p, s.replace(slot, "{json:" + JSON.stringify(JSON.stringify(list)) + "}"), "utf8");
    console.log("preset accounts injected: " + list.length);
  ' "$STAGE/app/bundle.js" || exit 1
fi

# secrets/account.json (older single-account defaults), still honoured if present.
if [ -f secrets/account.json ]; then
  node -e '
    const fs=require("fs");
    const a=JSON.parse(fs.readFileSync("secrets/account.json","utf8"));
    const p=process.argv[1]; let s=fs.readFileSync(p,"utf8");
    const real=`{url:${JSON.stringify(a.url)},username:${JSON.stringify(a.username)},password:${JSON.stringify(a.password)}}`;
    if(s.indexOf(process.argv[2])>=0){
      fs.writeFileSync(p,s.replace(process.argv[2],real),"utf8");
      console.log("account defaults injected (local build only)"); }
  ' "$STAGE/app/bundle.js" "$PLACEHOLDER" || exit 1
fi

node --check "$STAGE/app/bundle.js" || exit 1

rm -f ./*.ipk
ares-package "$STAGE/app" -o . || exit 1
IPK=$(ls -t ./*.ipk 2>/dev/null | head -1)
[ -n "$IPK" ] || { echo "no ipk produced" >&2; exit 1; }
echo "built: $IPK"

if [ "${1:-}" = "install" ]; then
  for tv in "${TVS[@]}"; do
    printf "%-14s " "$tv"
    ares-install --device "$tv" "$IPK" 2>&1 | tail -1
    ares-launch --device "$tv" com.muara.iptv >/dev/null 2>&1 || true
  done
fi
