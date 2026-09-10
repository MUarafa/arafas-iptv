# Arafa's IPTV — webOS TV app

`com.muara.iptv` — the IPTV player that runs on the two LG TVs.

> **Where this came from.** The original pre-build source was lost with a laptop.
> This repository was rebuilt by pulling the running app **off the TV itself** over
> the Chrome DevTools Protocol on 2026-09-09. `app/bundle.js` is therefore the
> built (minified) bundle rather than pre-build sources — it runs exactly as
> shipped, and it is edited by targeted, verified patches.
> `docs/analysis/pretty.js` is a readable, reformatted copy of the same bundle:
> **read that one** when you need to find code.

## Install

Toolchain lives on `D:` only — no Node on `C:`, no nvm.

```bash
./build.sh            # package -> com.muara.iptv_<version>_all.ipk
./build.sh install    # package, then install + launch on both TVs
```

Manually:

```bash
export PATH="D:/IPTV/node22/node-v22.22.2-win-x64:D:/IPTV/npm-global:$PATH"
export HOME="D:/IPTV/webos-home"
ares-package app -o .
ares-install --device "roufys tv"   com.muara.iptv_1.0.5_all.ipk
ares-launch  --device "roufys tv"   com.muara.iptv
```

A cold restart is required after an upgrade — `ares-install` already closes the app,
so a plain `ares-launch` afterwards is enough.

## The TVs

| name | model | webOS | IP |
|---|---|---|---|
| `roufys tv`   | 55UM7340PVA | 4.10.0 | 192.168.1.55 |
| `roufys tv 2` | 65UP7760PVB | 6.5.3  | 192.168.1.58 |

Both TVs have changed IP at least once. If one looks dead, do **not** assume it is
asleep — find it by MAC first (`arp -a`, TV 2 is `a8-a2-37-08-61-5c`), then repoint:

```bash
ares-setup-device --modify "roufys tv 2" --info "host=<new ip>"
```

TV 2 sleeps with SSH and CDP closed; a Wake-on-LAN magic packet (UDP 9, broadcast)
brings it back.

## Your provider account is NOT in this repository

The bundle used to carry the portal URL, username and password in plain text as the
sign-in defaults. They are replaced here with empty strings.

The real values live in `secrets/account.json`, which is git-ignored. `build.sh`
injects them into a local build and strips them again straight afterwards, so a
build you make yourself still pre-fills the login while the repository stays clean.

Without that file you simply sign in once on the TV; the app stores the account in
its own local storage from then on.

`original-as-pulled/` (also git-ignored) keeps the untouched copy taken off the TV,
credentials and all, purely as a recovery reference.

## What has been fixed

**1.0.2** — live playback no longer changes channel when a stream fails.
The provider ends the live stream every 25–80 s; the app read that as "the channel
finished" and moved on. Now it reconnects to the *same* channel (3 attempts, budget
refilled after 5 s of clean playback) and, if it truly cannot recover, stays put with
a message instead of zapping. Also: category lists no longer reload on every d-pad
step (74 ms → 40 ms per press).

**1.0.3** — the left menu no longer navigates on its own. Focus merely landing on an
item used to switch section 260 ms later with no OK pressed; because the player route
has no menu button, a Back press fell through to the Home button and the app "went
Home by itself" mid-match. The section now changes on OK or Right only, and Right
hands focus to the content. Changing the language also relabels the menu immediately.

**1.0.5** — films and episodes got the same protection as live. A cut mid-episode
fired `ended`, which the player read as "finished" and left playback. It now tells a
real ending (playhead reached the end) from a cut, and a cut resumes at the same
second. Running out of sources recovers in place instead of leaving after 2.2 s, an
unrecoverable stall recovers instead of freezing, and finishing the last episode
lands on the title's page rather than a bare `back()`.

## Layout

```
app/                 what gets packaged into the .ipk
docs/RECOVERY.md     how the app was recovered off the TV
docs/analysis/       readable (reformatted) copy of the bundle — read this
build.sh             package, and optionally install on both TVs
secrets/             git-ignored: the real provider account
original-as-pulled/  git-ignored: untouched copy taken off the TV
```

## Editing the bundle

`app/bundle.js` is minified. Patch it with a small Node script that does exact string
replacement and **asserts the anchor matches exactly once**, then `node --check` it.
Find the code in `docs/analysis/pretty.js` first.

Note that `ares-package` minifies again on the way out, so injected *function* names
are renamed. To confirm a patch survived, look for the `__`-prefixed **property**
names (`a.__rt`, `a.__ok`, `a.__pos`) — minifiers keep those.
