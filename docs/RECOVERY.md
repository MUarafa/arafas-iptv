ARAFA'S IPTV — RECOVERY NOTE (2026-09-09)
=========================================
App on the TV : com.muara.iptv  "Arafa's IPTV"  v1.0.0  (vendor: Muara)
Device        : roufys tv = 192.168.1.55 (LG 55UM7340PVA, webOS 4.10)
Status        : app is INSTALLED and WORKING on the TV. Nothing was broken.

WHAT WAS RECOVERED (pulled off the TV over CDP, read-only):
  app/index.html    280 B     full source
  app/styles.css    36,362 B  full source, 1617 readable lines
  app/bundle.js     104,512 B BUILT + MINIFIED (no source map on device)
  app/appinfo.json  358 B     full source
  analysis/pretty.js       beautified bundle (readable, ~2000 lines)
  analysis/bundle.split.js  statement-split bundle

NOT recovered: the ORIGINAL pre-build source (the folder on the other laptop).
Searched: D:\IPTV, D:\Laptop Restore, C:\Users\Arafa. Only Claude transcripts
and dev configs are backed up there — no project folder for this app.

FINDINGS FOR THE THREE REPORTED ISSUES
--------------------------------------
1) APP SHOWS IN ARABIC
   Not a bug. The app ships 6 languages (en, ar, es, fr, tr, de) and picks one
   from navigator.language on first run; the TV reports Arabic, so it chose 'ar'
   and set <html dir="rtl" lang="ar">.
   Stored in localStorage key "iptv:language".
   FIX WITHOUT REBUILD: Settings -> Language -> English.

2) CHANNEL ZAPS AWAY WHEN THE STREAM HANGS   <-- the real bug
   pretty.js ~line 1723, the player's "exhausted" handler:
     on("exhausted") -> picks previous/last channel and calls
     P("player", { channel: <other channel> })
     with a toast: '"<name>" is not available - back to <other>'
   So when every source for the channel fails, the app LEAVES the channel.
   Second suspect: on("ended") -> next-or-back. This matters because the
   provider ENDS the live TS every 25-80 s (measured 2026-09-06), so a healthy
   channel legitimately fires 'ended' during a match.
   The player engine itself only fails over between SOURCES of the same channel
   (nextSource/rank); the channel change is added by the UI layer above it.

3) REMOTE NAVIGATION DELAY
   Not yet analysed.

RELATED WORK ALREADY PROVEN ON THE OTHER APP (com.lennylxx.iptv)
   Same class of bug was fixed there on 2026-09-06: one bounded same-channel
   recovery state machine, never changes channel, holds "press OK to retry"
   when the budget is spent. Constants: 3 attempts, 2000 ms per attempt,
   300 ms between, budget refilled after 5 s of clean playback.
   That design transfers directly to this app.
