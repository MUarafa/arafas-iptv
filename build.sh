#!/usr/bin/env bash
# Package Arafa's IPTV into an installable .ipk.
#
#   ./build.sh                 -> just build
#   ./build.sh install         -> build, then install + launch on both TVs
#
# The toolchain lives on D: only (no Node on C:, no nvm).
set -uo pipefail
cd "$(dirname "$0")"

# POSIX-style paths: Git Bash does not resolve "D:/..." entries on PATH.
export PATH="/d/IPTV/node22/node-v22.22.2-win-x64:/d/IPTV/npm-global:$PATH"
export HOME="/d/IPTV/webos-home"

# Which TVs to install on. Override without editing this file:
#   TV_DEVICES="living room,bedroom" ./build.sh install
IFS="," read -r -a TVS <<< "${TV_DEVICES:-$(ares-setup-device -F -j 2>/dev/null | node -e "
  let d=\"\";process.stdin.on(\"data\",c=>d+=c);process.stdin.on(\"end\",()=>{
    try{const a=JSON.parse(d).filter(x=>x.name!==\"emulator\");console.log(a.map(x=>x.name).join(\",\"))}catch{console.log(\"\")}
  })")}"
PLACEHOLDER='{url:"",username:"",password:""}'

command -v node >/dev/null || { echo "node not found on PATH" >&2; exit 1; }
command -v ares-package >/dev/null || { echo "ares-package not found on PATH" >&2; exit 1; }

node --check app/bundle.js || exit 1
echo "syntax ok"

# The account is injected only for the local build and MUST come back out, whatever
# happens next - a failed build must never leave credentials in the working tree.
restore() {
  if [ -f secrets/account.json ]; then
    node -e '
      const fs=require("fs");
      const a=JSON.parse(fs.readFileSync("secrets/account.json","utf8"));
      const p="app/bundle.js"; let s=fs.readFileSync(p,"utf8");
      const real=`{url:${JSON.stringify(a.url)},username:${JSON.stringify(a.username)},password:${JSON.stringify(a.password)}}`;
      if(s.indexOf(real)>=0){ fs.writeFileSync(p,s.replace(real,`{url:"",username:"",password:""}`),"utf8");
        console.log("account defaults removed from the working tree"); }
    '
  fi
}
trap restore EXIT

if [ -f secrets/account.json ]; then
  node -e '
    const fs=require("fs");
    const a=JSON.parse(fs.readFileSync("secrets/account.json","utf8"));
    const p="app/bundle.js"; let s=fs.readFileSync(p,"utf8");
    const real=`{url:${JSON.stringify(a.url)},username:${JSON.stringify(a.username)},password:${JSON.stringify(a.password)}}`;
    if(s.indexOf(`{url:"",username:"",password:""}`)>=0){
      fs.writeFileSync(p,s.replace(`{url:"",username:"",password:""}`,real),"utf8");
      console.log("account defaults injected (local build only)"); }
  ' || exit 1
fi

rm -f ./*.ipk
ares-package app -o . || exit 1
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
