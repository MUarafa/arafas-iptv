#!/usr/bin/env bash
# Package Arafa's IPTV for Samsung Tizen TVs, and optionally install it.
#
#   platforms/tizen/build.sh                   -> dist/tizen/ArafasIPTV.wgt
#   platforms/tizen/build.sh install 192.168.1.5
#                                              -> build, connect, install and launch on that TV
#   platforms/tizen/build.sh store             -> the Samsung Seller Office build: no accounts
#                                                 from secrets/, signed with $TIZEN_PROFILE
#                                                 (use the distributor profile for the store)
#
# Needs Tizen Studio (the CLI is enough) with the Samsung TV extensions, and a Samsung
# certificate profile created in its Certificate Manager (default profile name: "arafas").
# The TV must be in Developer Mode with this PC's IP as the Host PC IP.
set -euo pipefail
cd "$(dirname "$0")/../.."

TIZEN_HOME="${TIZEN_HOME:-/c/tizen-studio}"
TIZEN="$TIZEN_HOME/tools/ide/bin/tizen.bat"
SDB="$TIZEN_HOME/tools/sdb.exe"
PROFILE="${TIZEN_PROFILE:-arafas}"
APP_ID="MuaraIPTV0.ArafasIPTV"
OUT="dist/tizen"

[ -x "$SDB" ] || { echo "Tizen Studio not found at $TIZEN_HOME (set TIZEN_HOME)" >&2; exit 1; }

# The app is app/ as built for webOS; Tizen only needs its own config.xml beside it.
rm -rf "$OUT"
mkdir -p "$OUT/app"
cp -r app/. "$OUT/app/"
rm -f "$OUT/app/appinfo.json"
cp platforms/tizen/config.xml "$OUT/app/config.xml"

# Accounts to ship with this local build (secrets/accounts.json, never committed): injected
# into the packaged copy only, so the working tree never holds them.
if [ "${1:-}" != "store" ] && [ -f secrets/accounts.json ]; then
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
  ' "$OUT/app/bundle.js"
fi

if [ "${1:-}" = "store" ]; then
  node tools/check-no-accounts.mjs "$OUT/app"
fi

win() { cygpath -w "$1"; }
cmd //c "$(win "$TIZEN")" package -t wgt -s "$PROFILE" -- "$(win "$OUT/app")"
WGT=$(ls -t "$OUT"/app/*.wgt 2>/dev/null | head -1)
[ -n "$WGT" ] || { echo "no .wgt produced" >&2; exit 1; }
mv "$WGT" "$OUT/ArafasIPTV.wgt"
echo "built: $OUT/ArafasIPTV.wgt"

if [ "${1:-}" = "store" ]; then
  VERSION=$(sed -n 's/^ *id="[^"]*" version="\([^"]*\)".*/\1/p' platforms/tizen/config.xml | head -1)
  mkdir -p dist/store
  cp "$OUT/ArafasIPTV.wgt" "dist/store/ArafasIPTV_${VERSION}.wgt"
  echo "store package: dist/store/ArafasIPTV_${VERSION}.wgt"
fi

if [ "${1:-}" = "install" ]; then
  TV="${2:?TV IP address required}"
  "$SDB" connect "$TV:26101"
  SERIAL="$TV:26101"
  cmd //c "$(win "$TIZEN")" install -s "$SERIAL" -n ArafasIPTV.wgt -- "$(win "$OUT")"
  cmd //c "$(win "$TIZEN")" run -s "$SERIAL" -p "$APP_ID"
fi
