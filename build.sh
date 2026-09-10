#!/usr/bin/env bash
# Package Arafa's IPTV into an installable .ipk.
#
#   ./build.sh                 -> just build
#   ./build.sh install         -> build, then install on every TV below
#
# Toolchain lives on D: only (no Node on C:, no nvm).
set -euo pipefail
cd "$(dirname "$0")"

export PATH="D:/IPTV/node22/node-v22.22.2-win-x64:D:/IPTV/npm-global:$PATH"
export HOME="D:/IPTV/webos-home"

TVS=("roufys tv" "roufys tv 2")

node --check app/bundle.js
echo "syntax ok"

# Optional: put the saved account back as the sign-in defaults for a fresh install.
if [ -f secrets/account.json ]; then
  node -e '
    const fs=require("fs");
    const a=JSON.parse(fs.readFileSync("secrets/account.json","utf8"));
    const p="app/bundle.js"; let s=fs.readFileSync(p,"utf8");
    const before=s;
    s=s.replace(/\{url:"",username:"",password:""\}/,
      `{url:${JSON.stringify(a.url)},username:${JSON.stringify(a.username)},password:${JSON.stringify(a.password)}}`);
    if(s!==before){ fs.writeFileSync(p,s,"utf8"); console.log("account defaults injected (local build only)"); }
  '
fi

rm -f ./*.ipk
ares-package app -o .
IPK=$(ls -t ./*.ipk | head -1)
echo "built: $IPK"

# Put the placeholder back so the account never lands in git.
if [ -f secrets/account.json ]; then
  node -e '
    const fs=require("fs");
    const a=JSON.parse(fs.readFileSync("secrets/account.json","utf8"));
    const p="app/bundle.js"; let s=fs.readFileSync(p,"utf8");
    s=s.replace(`{url:${JSON.stringify(a.url)},username:${JSON.stringify(a.username)},password:${JSON.stringify(a.password)}}`,
      `{url:"",username:"",password:""}`);
    fs.writeFileSync(p,s,"utf8"); console.log("account defaults removed from the working tree again");
  '
fi

if [ "${1:-}" = "install" ]; then
  for tv in "${TVS[@]}"; do
    printf "%-14s " "$tv"
    ares-install --device "$tv" "$IPK" | tail -1
    ares-launch --device "$tv" com.muara.iptv >/dev/null 2>&1 || true
  done
fi
