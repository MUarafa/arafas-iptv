# Changelog

All versions are what actually ran on real LG TVs; every fix below was verified on the
device, not only in theory.

## 1.1.1

- **Back to Home is instant.** Coming back from a series, a film or any page opened from
  Home rebuilt the whole page: every category row was written out again one after
  another and fetched from the provider again. Home is now kept while you are away and
  Back returns to it as it was, on the card you left.
- **A refused account is not hammered.** When the provider refuses the account (an
  expired or blocked line answers HTTP 4xx, e.g. 469), the series/film page no longer
  retries 20 times in a row - which only makes a flood-protected provider block it for
  longer. It says why ("Could not load details. (HTTP 469)"); other failures are retried
  a few times, further apart.
- **`./build.sh install` works on any PC.** The D: toolchain is used only where it
  exists, and the accounts in `secrets/accounts.json` are injected into a throwaway copy
  of the app that is packaged, so the working tree never holds credentials.

## 1.1.0

- **Previous and next episode, across seasons.** The player has Previous episode, Next
  episode and an Episodes list (every episode of every season, the playing one marked).
  Channel +/- on the remote also go to the next/previous episode. The end of a season no
  longer stops there: Next goes on to the next season's first episode. Episodes opened
  from Continue Watching, History or Home get the full list too. A previous episode
  resumes where it was left. The series page opens on the season being watched and its
  button says which episode resumes ("Resume · S2E5").
- **Menus without fades.** The menu and the category lists had fades and gradients laid
  over text (the left edge of every screen faded the first letters of category names).
  They are gone: the menu is solid black, labels are bigger, bold and appear whole, the
  focused item is a solid card with a white frame, and nothing animates in or out.
  Category names get two lines and the focused one shows in full; channel names get two
  whole lines instead of being cut with "…".
- **Search everything from the menu.** One box for channels, films and series: keys on
  the left, results on the right. Predictions appear above the keys as you type, best
  first - titles that start with what you typed, then trendier ones (recently added,
  highly rated, or already watched on this TV). Before you type, the trending titles on
  your provider are offered. Every result says what it is (Movie / Series / Channel) and
  which copy it is, with a 4K / FHD / HD / SD badge (from the title or its category), and
  shows the provider's full name and category underneath; copies of the same title sit
  together, best quality first, and identical copies are listed once.
- **History.** A new menu item lists everything that played - films, episodes and
  channels, finished or not - newest first under Today / Yesterday / the date, like
  YouTube's history. Separate from Continue Watching, which forgets a finished title. OK
  plays it again, Yellow removes one, Red twice clears it. Kept per account.
- **Netflix-style seeking.** A tap moves 10 s; holding speeds up the longer you hold
  (10 → 30 → 60 → 120 s steps, one level per second held), and the jump lands 0.8 s after the last press. While
  scrubbing, the target time shows over the bar, with a picture of that moment when the
  account allows two connections (Settings → "Pictures while seeking"; a single-connection
  plan would be cut off by opening the file twice).
- **Spotlight previews start again.** After jumping to 30 % of the film, some TVs never
  fire a second "playing", so the preview played hidden behind the artwork; it now shows
  as soon as the jump lands. Films get 15 s to start instead of 7 (IPTV files often take
  8-12 s, so every title was skipped before it began), and a TV that refuses to autoplay
  with sound gets the preview muted instead of none.

## 1.0.9

- **Continue Watching no longer loses a title when resuming fails.** Leaving the player
  (or its 10-second autosave) recorded the playhead even when nothing had played yet.
  That position is 0, and anything under a minute counts as "not really watched", so a
  resume that failed to start deleted the very entry it was resuming. Progress is now
  saved only once playback has actually started and the resume seek has landed; a short
  position never overwrites a longer one; and the automatic retry resumes from the saved
  place instead of from zero. Files that report their length only after starting now
  still get their resume seek instead of silently playing from the beginning.
- **The menu shows where you are.** The focused item sits on a red-framed card, not just a
  faint tint, and the card frames the icon even while the rail is collapsed.
- **Runs on Samsung TVs (Tizen).** The same app, packaged as a signed `.wgt`
  (`platforms/tizen/build.sh install <TV IP>`, Samsung certificate profile `arafas`). The
  remote's Samsung key codes are translated where keys come in (Back 10009, Play/Pause
  10252, channel 427/428) and its media, colour and number keys are registered with the
  TV. Live channels ask for HLS on Tizen, whose video element does not play raw MPEG-TS -
  those channels loaded and never started; the "Live stream format" setting is hidden there.
  First installed on a 2024 UA55DU7000 (Tizen 8.0).
- **Accounts.** A menu item below Free TV and the first Settings row open a list of saved
  accounts: OK switches (the app restarts on it), Yellow removes one, "Add account" opens an
  empty sign-in. Every account that signs in is saved, and each keeps its own Continue
  Watching, favourites and what was learned about its provider. A local build can ship
  accounts from `secrets/accounts.json` (never committed); they are seeded once, on a TV
  with none saved.
- **The player's controls can be reached again.** Every Left/Right in a film was taken as a
  seek, so Skip intro, Next episode, Fit and Quality could not be reached, and the bar hid
  after 4.5 s even while you were pressing keys. Left/Right still seek by default - also in
  the first seconds when the controls show by themselves - but once you press Down, Up or OK
  to use the controls, Left/Right move between the buttons until the controls hide; Up
  reaches the progress bar (where Left/Right seek), and any key keeps the controls up.
- **The remote's Pause and Play buttons work.** webOS can pause the video on its own media
  key, and the app then toggled it straight back, so the press looked ignored. The app now
  checks what the video did a moment later: Pause only pauses, Play only plays, Play/Pause
  toggles.
- **The open menu no longer covers the screen beside it.** Opening the menu widens it from
  96 to 300 px over the current screen, hiding the start of titles and the first cards;
  the screen now slides aside by the difference while the menu is open and back after (a
  transform, so the TV does not re-lay out the page).
- **Menu icons drawn for the app.** The icons were font symbols and emoji, and the TV's
  fonts had no glyph for several of them, so they showed as empty boxes. They are now
  SVG, in the logo's red gradient with a white detail, the logo's own play triangle where
  it fits.
- **Steadier d-pad movement.** Up and Down inside the menu were already exact; the
  "missed" and "double" presses came from everything around it, found by 40 navigation
  scenarios in the simulator:
  - Left from a screen opens the menu on that screen's own item. It used to land on
    whichever item sat level with the focused button - usually Free TV, the last one, so
    the next Down did nothing - and was ignored while the menu was still animating shut.
  - Up from the spotlight no longer jumps sideways into the menu.
  - A key the remote echoes within 50 ms acts once, for arrows, OK and Back alike - an
    echoed Right from the menu no longer steps twice, an echoed OK no longer opens the
    player straight past the details page.
  - Home rows load before focus reaches them, so Down onto a row still loading is no
    longer swallowed.
  - Focus is kept when Settings toggles, the search keyboard's language buttons or a
    channel list refresh rebuild the rows under it; when focus is lost anyway, the next
    press moves from where it was instead of jumping to the top of the menu.
  - Back lands on the current screen's menu item.
- **Magic Remote pointer.** Focus follows the pointer and a click acts as OK. Content
  sliding under a resting pointer, or a hand jittering a few pixels just after a key press,
  does not move focus.
- **Spotlight previews are back on single-connection subscriptions.** 1.0.7 turned the
  home teaser off for any account that allows one connection, which left the spotlight
  flipping through still artwork every 5 s. Teasers run again - 30 s of each title - and
  the connection risk that motivated 1.0.7 is handled directly instead: the player waits
  for a released teaser stream to close (2.5 s) before opening the title, a teaser never
  starts on a slot the player has only just handed back, two failed previews in a row
  fall back to artwork instead of opening stream after stream, and a TV left untouched
  for 10 minutes stops opening teasers until someone presses a key. Without a teaser the
  artwork now rotates every 8 s.
- **Resuming on a single-connection subscription no longer loses the title.** Found in
  the simulator with a provider that keeps a closed stream counted for a moment - which
  is how the original "didn't play, then vanished from Continue Watching" happened. A
  retry reopened too soon, got the provider's 12-second "restricted" clip, sought the saved
  place into its end, took that for the film finishing, deleted the entry and jumped to the
  details page. Now films and episodes wait for a stream the app just closed to be released
  before opening (retries, next episode, Back then Play), a seconds-long "title" is never
  taken for an ending or saved as progress, a resume place beyond the file's length or a
  file that ignores the seek keeps the saved place, the retry budget refills only after real
  playback (a dead line stops retrying and says so), and a frozen stall now reaches the
  reload step instead of nudging forever. Live channels still switch instantly: they wait
  only after a teaser has just stopped, or once the app has seen this provider serve its
  notice clip on a channel switch (remembered on the TV), and a live stream the provider
  ended itself always reconnects at once. Switching to another copy of the same channel
  or title (a failover, a stall, a quality promotion) always waits for the stream it cut
  off, a channel fails over between its best 6 copies rather than every duplicate in every
  category, and only sustained playback - not the jump back to the resume point after a
  reload - resets the stall-recovery steps, so a stream that stays frozen ends in a message.
- Play/Pause while a title is still waiting for its connection no longer throws.
- A film or episode that cannot be played says so in those words, not "This channel is not
  available".
- **Episodes opened from Home's Continue Watching row keep their series**, so their progress
  still groups by series and finishing one no longer opens a "series" page named after the
  episode. A damaged entry in the list no longer blanks Home.
- **Sign-in says what went wrong** ("the server did not answer", "that address is not an IPTV
  portal", "this account is not active") instead of internal text, and a failed sign-in no
  longer leaves the TV signed in to the bad account after a restart.
- **A bad answer from the provider is never cached as an empty catalogue.** A `null`, an error
  object or a damaged cache entry used to leave Live TV or Movies empty for a day, or a
  film's details blank for a week. Empty lists are kept five minutes only.
- **Screens recover by themselves when the line comes back:** Home rows and the spotlight,
  Live TV categories (and OK on a failed category), search, the channel-quality index, Free
  TV and M3U playlists all retry instead of staying failed for the session. Playlist
  downloads time out instead of leaving sign-in on "Connecting…" forever, and a captive
  portal page that starts with whitespace or `<head>` is recognised as one.
- **A simulator for the whole app** (`npm run sim`, `tools/sim/`): a stand-in Xtream
  provider with injectable faults, a scriptable video element (streams that never start,
  get cut, stall, cannot seek, report no duration, or hit the connection limit) and a
  virtual clock, driving the real bundle in headless Chrome. Scenarios run in seconds and
  never touch a TV.
- The bundled fonts are now in the repository (they were only on the TVs).

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
