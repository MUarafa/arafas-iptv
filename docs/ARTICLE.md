# I lost the source code. The app was still running on my TV, so I took it back from there.

A few days ago I opened my IPTV player on the living-room LG and went to watch a
series. The app was there. The favourites were there. The source code was not — it had
been on a laptop that was no longer with me, and there was no copy anywhere.

What follows is how I got it back, what I found when I could finally read it, and the
one trick that made a large refactor of unfamiliar code safe.

## A TV app is a web page with the lights off

webOS apps are HTML, CSS and JavaScript. Put an LG TV into Developer Mode and it opens
a Chrome DevTools Protocol endpoint on port 9998 — the same protocol Chrome's own
developer tools speak. Anything DevTools can do to a page, a script can do over a
socket.

So the app was not gone. It was installed, running, and *inspectable*.

```js
const { wsUrl } = await resolveCdpTarget({ host, port: '9998', target: 'com.muara.iptv' });
const client = await CdpClient.connect(wsUrl);
await client.call('Runtime.evaluate', { expression: 'location.href', returnByValue: true });
// file:///media/developer/apps/usr/palm/applications/com.muara.iptv/index.html
```

From inside that page, its own files are same-origin. An `XMLHttpRequest` to
`bundle.js` returns the source of the running application.

Two details cost me time. First, webOS 4 runs Chromium 53, where `Runtime.evaluate`
ignores `awaitPromise` — so everything asynchronous has to be fire-and-poll: assign the
result to a global, then poll that global. Second, the icons are binary, and
`responseText` mangles bytes unless you ask for them as a binary string:

```js
x.overrideMimeType('text/plain; charset=x-user-defined');
// then read charCodeAt(i) & 255 and base64 it yourself
```

Ten minutes later I had `index.html`, `styles.css`, `appinfo.json`, both icons, and a
106 KB `bundle.js`. The CSS came back as 1,617 readable lines. The JavaScript came back
as a single line.

## A backup is not a project

That single line is the whole problem. It runs, so in one sense nothing was lost. But
nobody can read it, nobody can contribute to it, and every change is a careful edit to
minified code.

Rebuilding it went in three steps.

**Make the bundle generated, not sacred.** Reformat it into `src/app.js` and have
esbuild produce `app/bundle.js` from it, targeting Chromium 53 for the oldest TV I
support. Now there is a source file and a build, even if the source still reads like a
minifier wrote it.

**Give the names back.** The bundle reuses short identifiers aggressively — `T`, `L`,
`b` and `w` each mean something different in half a dozen screens. A find-and-replace
would have quietly corrupted it. Babel's scope analysis will not:

```js
moduleScope.rename('sn', 'translate'); // only the module binding and its references
```

Working from evidence rather than memory helped: a small script listed every
module-level binding with how many times it was referenced, so I could name the
53-reference one first and read its body before deciding what to call it. A hundred
names in, `sn` is `translate`, `me` is `playerApi`, `Cn` is `KEY_BACK`, and the file
started to make sense.

**Split it up.** `keys`, `dom`, `i18n`, `focus` and `router` moved into their own
modules, each extraction refusing to proceed if the code being moved still depended on
code left behind.

## The trick: literals do not lie

Here is the part I would use again on any inherited codebase.

Renaming an identifier cannot change a string. Moving a declaration into another module
cannot invent a number. So if you build before and after a refactor and the two bundles
contain exactly the same literals, the refactor did only what it claimed.

```
comparing app/bundle.js against HEAD
  size            106358 -> 106358
  string literals   2333 ->   2333   same content: true
  number literals    666 ->    666   same content: true

EQUIVALENT: only identifier spellings differ.
```

2,333 strings and 666 numbers, unchanged, in the same order. That is a far stronger
statement than "it still seemed fine when I clicked around", and it takes a second to
run. For module splits the order legitimately changes, so the bar becomes the multiset
instead — same contents, any order.

It has one blind spot, and it bit me immediately. Literal comparison cannot see a *name*
that no longer resolves. When `router` moved out, it kept calling `clearChildren` and
`ensureFocus` without importing them. esbuild does not complain — an unknown identifier
is simply assumed to be a global. The build succeeds, the bundle ships, and the app
breaks the first time someone opens that screen.

So the second check parses the built bundle and reports every identifier that is
referenced but never declared and is not a known browser global:

```
UNRESOLVED identifiers (these will throw at runtime):
  clearChildren  used 1x
  ensureFocus    used 1x
```

That one now runs as part of packaging. Nothing ships with a dangling name.

## What the code turned out to be hiding

Being able to read it mattered, because the app had a family of bugs that looked
different from the sofa and were the same mistake underneath: **treating a problem as a
reason to leave.**

- A live stream is cut, so the player moves you to another channel. The provider I use
  ends its live streams **every 25 to 80 seconds** — this fired constantly.
- A film or episode is cut mid-way. The browser reports `ended`, the player reads that
  as *finished*, and drops you out of playback.
- The left menu navigated when the highlight merely *landed* on an item, 260 ms later,
  with nobody pressing OK. The player screen has no menu entry, so a Back press fell
  through to the Home button — and the app "went home by itself" in the middle of a
  match.

None of these were visible in the minified bundle. All three were obvious once the code
had names.

The fixes share one rule: recover in place. Live reconnects to the *same* channel,
bounded, with the retry budget refilled after five seconds of clean playback. A cut is
told apart from a real ending by comparing the playhead against the longest duration the
file ever reported — because a truncated stream shrinks its own `duration` down to the
cut point, and would otherwise look like a tidy finish. The menu commits on OK or Right,
never on focus.

Each one was verified by causing it on purpose. Dispatching a real `ended` event 12.4
seconds into an episode and watching the player reconnect and resume at 10.8 seconds is
worth more than any amount of reasoning about whether it should.

## And then it was the ISP

Near the end, details screens started failing. The message said "Could not load
details", so I went looking for what the app had broken.

It had broken nothing. Every API call was returning **HTTP 200 with an HTML page**. The
page was from the ISP: an unpaid landline bill, and every plain-HTTP request on the line
was being answered with their notice instead. HTTPS was untouched, which is why the rest
of the internet looked fine. Cached screens still rendered, so only fresh calls failed —
which is exactly why it looked like one broken title.

The app was wrong too, though, in a way worth fixing: it blamed itself, and it gave up.
It now recognises an intercepted response, says so, and keeps retrying, so the screen
fills itself in the moment the line returns.

## What I would tell myself

- **Your running app is a copy of your app.** If it is a web platform — webOS, Tizen,
  Electron — the artefact is recoverable from the device. Losing the repository is not
  the same as losing the work.
- **Refactor with an invariant, not with courage.** Literal-for-literal equality turns
  "I think this was safe" into something you can check in a second.
- **Then check what the invariant cannot see.** Mine could not see an unresolved name.
  Every invariant has a blind spot; find it before production does.
- **Reproduce the failure deliberately.** Firing the event yourself beats waiting to see
  whether it happens again.

The app is open source now, GPL-3.0: <https://github.com/MUarafa/arafas-iptv>. It still
has one oversized file and plenty of names to give back. The tools that got it this far
live in `tools/`, and they are the interesting part.
