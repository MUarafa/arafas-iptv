# Platforms, models, and stores

## Which LG TVs this runs on

**webOS 4.0 and newer** — 2018 models onward.

That floor is not a guess. The app calls `fetch`, which arrives in Chromium 42, and
the bundle is compiled for Chromium 53:

| webOS | Chromium | Models | Status |
|---|---|---|---|
| 3.x and older | 38 | 2016–2017 | **Not supported** — no `fetch` |
| 4.x | 53 | 2018 | **Verified on hardware** (webOS 4.10) |
| 5.x | 68 | 2019–2020 | Expected to work |
| 6.x | 79 | 2020–2021 | **Verified on hardware** (webOS 6.5.3) |
| 22 / 23 / 24 | 87+ | 2022+ | Expected to work |

Checked on both verified sets: `fetch`, `Promise`, `Map`, `localStorage`,
`requestAnimationFrame`, and native playback of MPEG-TS, HLS and MP4 — all present.
Screen and viewport are 1920×1080 on both, which is what the layout targets.

Supporting webOS 3 would mean shipping a `fetch` polyfill and compiling for Chromium
38. Doable, but it cannot be claimed without a 2016–2017 set to test on.

## Getting it onto the LG Content Store

This is a real route, but it is **yours to walk** — the account and the legal
declarations have to be in your name.

1. **Register** at [LG Seller Lounge](http://seller.lgappstv.com) — individual or
   company. Paid apps need tax and bank details.
2. **Package** exactly as here: `./build.sh` produces the `.ipk`.
3. **Submit** with title, description, screenshots (there are six in
   `docs/screenshots/`), an age rating, and a **content-rights declaration**.
4. **QA review.** Expect weeks, and expect questions.

Two things worth knowing before you spend the effort:

- **IPTV players get extra scrutiny.** LG has removed players from the store over
  access to unlicensed content. What protects this app is that it ships no content and
  no service: the viewer supplies their own portal. Keep it that way in the listing.
- **The built-in free playlist is the one thing to check.** It points at the public
  [iptv-org](https://github.com/iptv-org/iptv) index. That index is community
  maintained and not every entry is necessarily licensed for redistribution. Before
  submitting, consider making that list opt-in, or dropping it from the store build.

## Other brands

Honest scope, so you can decide what is worth paying for:

| Platform | What it would take |
|---|---|
| **Samsung (Tizen)** | A real port, not a repackage. The screens and layout are reusable, but video goes through Samsung's `AVPlay` rather than `<video>` for most live streams, the remote key codes differ (Back is 10009), packaging is `.wgt` via Tizen Studio, and it is a separate store and review. Realistically the player layer and the key handling are rewritten; the rest largely survives. |
| **Android TV** | A different application. The UI could be a WebView wrapper, but anything competitive there uses ExoPlayer natively — and that market already has TiviMate and IBO. |
| **Roku** | A full rewrite in BrightScript/SceneGraph. Nothing carries over. |
| **Vidaa / Hisense, Foxxum, Zeasn** | Web-app platforms, closer to LG than to Roku. A port is plausible once the Tizen work has separated the player layer from the screens. |

The sensible order is: get it right on LG, split the player layer out cleanly, then
Tizen becomes a much smaller job than it looks today.
