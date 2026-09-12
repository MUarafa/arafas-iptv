# Changelog

All versions are what actually ran on real LG TVs; every fix below was verified on the
device, not only in theory.

## 1.0.8

- **Say when the provider's video host has blocked a title.** When a provider streams
  its films and series through a CDN that forbids video on the plan it is using, the
  CDN answers with its own short "this video has been restricted" clip in place of the
  content. The player dutifully played it, which looks like the app is broken.

  A film or episode that reports well under two minutes is that notice, not the title,
  so the player now stops and says what happened. Live TV is usually served straight
  from the provider's own origin and keeps working, which is the confusing part — so
  the message says that too.

## 1.0.7

- **The home screen no longer spends your subscription on nobody.** The hero teaser
  auto-plays a stream in the background while you are just looking at Home. On a
  subscription that allows a single device, that one slot goes to a TV nobody is
  watching, and the next device to press play is refused by the provider — usually with
  its own "this video has been restricted" clip, which looks like a broken app.

  The app now remembers the device limit reported at sign-in and only lets the teaser
  run when the subscription has room for it. Playlists have no such limit and are
  unaffected. When the limit is not known yet, the teaser stays quiet and the app finds
  it out for next time.

## 1.0.6

- **Say what is actually wrong when the network is intercepted.** An ISP that has
  something to tell you answers *every* plain-HTTP request with its own page, at
  HTTP 200. The app read that as malformed data and gave up with "Could not load
  details" — blaming itself for something outside it, and never trying again. It now
  detects an intercepted response, says so, and retries until the line is back.

## 1.0.5

- **Films and episodes never exit on their own.** A cut mid-playback fires `ended`,
  which the player read as "finished", so it left. It now tells a real ending from a
  cut — by the playhead against the longest duration the file ever reported, because a
  truncated stream shrinks its own duration to the cut point — and a cut **resumes at
  the same second**.
- Running out of sources recovers in place instead of leaving after 2.2 s, and no
  longer jumps to an unrelated channel.
- A stall the engine cannot clear now recovers instead of freezing.
- Finishing the last episode lands on the title's page, not a bare `back()`.

## 1.0.3

- **The menu no longer navigates on its own.** Focus merely landing on an item used to
  switch section 260 ms later, with no OK pressed. Because the player has no menu
  button, a Back press fell through to Home — which is how playback "went Home by
  itself" mid-match. The section now changes on OK or Right only, and Right hands focus
  to the content.
- Menu movement: a whole section used to load on every d-pad step. Now ~27 ms a press.
- Changing the language relabels the menu immediately instead of at next launch.

## 1.0.2

- **Live playback never changes channel on a failure.** The provider ends its live
  streams every 25–80 s; the app read that as "the channel finished" and moved on. It
  now reconnects to the same channel (3 attempts, budget refilled after 5 s of clean
  playback) and, when it truly cannot recover, stays put with a message.
- Category lists no longer clear and reload on every d-pad step: 74 ms → 40 ms a press.

## 1.0.0

- Recovered from the TV over the Chrome DevTools Protocol after the original sources
  were lost. See `docs/RECOVERY.md`.
