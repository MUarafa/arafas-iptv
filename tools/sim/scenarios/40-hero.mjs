// The home spotlight ("recommended") and its teaser previews, on a subscription that
// allows ONE connection - the case where a background stream can cost the viewer the
// title they actually press Play on.

import { signedIn } from "../lib.mjs";

const ONE = { maxConnections: 1, releaseDelayMs: 2000 };

async function heroVideo(app) {
  return (await app.media()).find((m) => m.cls.indexOf("hero-video") >= 0) || null;
}

async function waitFor(app, what, fn, limitMs = 20000, step = 250) {
  for (let waited = 0; waited <= limitMs; waited += step) {
    let v = await fn();
    if (v) return v;
    await app.tick(step);
  }
  throw new Error("timed out waiting for " + what);
}

async function opens(app) {
  return (await app.sim("sim.log")).filter((e) => e[0] === "open");
}

export default [
  {
    name: "on a slow portal the teaser starts with the first title, not after the whole list",
    config: { faults: { get_vod_info: { latencyMs: 1500 } } },
    async run({ open, expect, note }) {
      let app = await open({ ...ONE, settle: 0 });
      let started = null;
      for (let waited = 0; waited <= 20000; waited += 500) {
        let v = await heroVideo(app);
        if (v && v.src && v.t > 0) {
          started = waited;
          break;
        }
        await app.tick(500);
      }
      let titles = await app.eval("document.querySelectorAll('.hero-dot').length");
      note.push(`teaser playing ${started} ms (virtual) after boot, with ${titles} title(s) loaded so far`);
      expect(started !== null, "teaser never started while the list was still loading");
      expect(titles < 8, "the teaser should not have waited for all eight titles");
    },
  },
  {
    name: "teaser plays on a single-connection account and moves on after about 30 s",
    async run({ open, expect, note }) {
      let app = await open(ONE);
      let s = await app.state();
      expect(/hero-button/.test(s.focusClass || ""), "Home should start on the spotlight, focus is " + s.focusClass);
      let first = await waitFor(app, "teaser to play", async () => {
        let v = await heroVideo(app);
        return v && v.src && v.t > 0 ? v : null;
      });
      await app.tick(22000);
      expect.eq((await heroVideo(app)).src, first.src, "still the same title 22 s in");
      let next = await waitFor(app, "next teaser", async () => {
        let v = await heroVideo(app);
        return v && v.src && v.src !== first.src && v.t > 0 ? v : null;
      }, 20000);
      note.push("next teaser: " + next.src.split("/").pop());
      // The first "playing" seeks 30% in; the class arrives with the playing after that.
      await app.tick(1000);
      expect.eq(await app.sim("sim.restricted"), 0, "teasers must never hit the connection limit");
      expect(await app.eval("document.querySelector('.hero').classList.contains('hero-playing')"), "hero-playing class while a teaser runs");
    },
  },
  {
    name: "Play while a teaser runs waits for the connection to be handed back",
    async run({ open, expect, note }) {
      let app = await open(ONE);
      await waitFor(app, "teaser", async () => ((await heroVideo(app)) || {}).t > 0);
      await app.key("ok", 200);
      expect.eq((await app.state()).route, "player", "route after Play");
      await app.tick(8000);
      let player = (await app.media()).find((m) => m.cls.indexOf("player-video") >= 0);
      expect(player && player.t > 0, "the film plays: " + JSON.stringify(player));
      expect.eq(await app.sim("sim.restricted"), 0, "the film must not get the provider's restricted clip");
      let log = await app.sim("sim.log");
      let close = log.filter((e) => e[0] === "close").pop();
      let last = log.filter((e) => e[0] === "open").pop();
      note.push(`teaser released at ${close[2]}, film opened at ${last[2]} (+${last[2] - close[2]} ms)`);
    },
  },
  {
    name: "Back from the player to Home does not start a teaser on a busy slot",
    async run({ open, expect }) {
      let app = await open(ONE);
      await waitFor(app, "teaser", async () => ((await heroVideo(app)) || {}).t > 0);
      await app.key("ok", 200);
      await app.tick(8000);
      await app.key("back", 100);
      expect.eq((await app.state()).route, "home", "route after Back");
      await app.tick(15000);
      expect.eq(await app.sim("sim.restricted"), 0, "teaser after Back must wait for the player's stream to close");
    },
  },
  {
    name: "leaving the spotlight for the rows stops the teaser, frees the slot and rotates artwork slowly",
    async run({ open, expect, note }) {
      let app = await open(ONE);
      await waitFor(app, "teaser", async () => ((await heroVideo(app)) || {}).t > 0);
      // (Opening the menu keeps the billboard playing, as it always has on the TV; Right
      // from a rail item would navigate away, so this goes straight down into the rows.)
      await app.key("down", 100);
      expect(!/hero-button/.test((await app.state()).focusClass || ""), "focus moved down into the rows");
      const TITLE = ".hero-body > :nth-child(2)";
      let title = await app.text(TITLE);
      await app.tick(3000);
      let v = await heroVideo(app);
      expect(v && !v.src, "teaser video released: " + JSON.stringify(v));
      expect.eq(await app.sim("sim.connectionCount()"), 0, "connections once the spotlight lost focus");
      await app.tick(3500);
      expect.eq(await app.text(TITLE), title, "artwork must not flip within 6.5 s");
      await app.tick(2500);
      expect(await app.text(TITLE) !== title, "artwork rotates after ~8 s");
    },
  },
  {
    name: "a TV left alone on Home stops teasers, and a key press brings them back",
    async run({ open, expect }) {
      let app = await open(ONE);
      await waitFor(app, "teaser", async () => ((await heroVideo(app)) || {}).t > 0);
      await app.tick(12 * 60e3, 250);
      expect.eq(await app.sim("sim.connectionCount()"), 0, "no stream held after 12 idle minutes");
      let before = (await opens(app)).length;
      await app.tick(3 * 60e3, 250);
      expect.eq((await opens(app)).length, before, "no new teaser opens while idle");
      await app.key("right", 100);
      await app.key("left", 100);
      await waitFor(app, "teaser after input", async () => ((await heroVideo(app)) || {}).t > 0, 15000);
    },
  },
  {
    name: "a teaser that errors does not hammer the provider",
    async run({ open, expect, note }) {
      let app = await open({ ...ONE, media: [{ match: "/movie/", fail: "error" }] });
      await app.tick(60000);
      let n = (await opens(app)).length;
      note.push(n + " teaser opens in 60 s with every stream failing");
      expect(n <= 12, "too many stream opens in a minute: " + n);
      expect.eq((await app.state()).focusCount, 1, "focus intact");
    },
  },
  {
    name: "a teaser that never starts gives up and moves on",
    async run({ open, expect, note }) {
      let app = await open({ ...ONE, media: [{ match: "/movie/", fail: "never" }] });
      await app.tick(60000);
      let n = (await opens(app)).length;
      note.push(n + " teaser opens in 60 s with streams that never start");
      expect(n >= 3 && n <= 12, "expected a few attempts, got " + n);
      expect(await app.sim("sim.connectionCount()") <= 1, "never more than one stream");
    },
  },
  {
    name: "teaser setting off never opens a stream",
    async run({ open, server, expect }) {
      let app = await open({ ...ONE, storage: signedIn(server, { "iptv:settings": { heroTeaser: false } }) });
      await app.tick(60000);
      expect.eq((await opens(app)).length, 0, "stream opens with teasers off");
    },
  },
  {
    name: "navigating away while a teaser is still loading leaves nothing open",
    async run({ open, expect }) {
      let app = await open({ ...ONE, media: [{ match: "/movie/", startDelay: 3000 }] });
      await waitFor(app, "teaser loading", async () => ((await heroVideo(app)) || {}).src);
      await app.eval("__router.go('movies', {})");
      await app.tick(8000);
      expect.eq(await heroVideo(app), null, "hero video gone");
      expect.eq(await app.sim("sim.connectionCount()"), 0, "connections after leaving Home");
    },
  },
  {
    name: "flicking focus in and out of the spotlight never needs two streams",
    async run({ open, expect, note }) {
      let app = await open(ONE);
      await waitFor(app, "teaser", async () => ((await heroVideo(app)) || {}).t > 0);
      for (let i = 0; i < 20; i++) {
        await app.key("left", 150);
        await app.key("right", 150);
      }
      await app.tick(10000);
      note.push("peak connections " + (await app.sim("sim.peakConnections")) + ", opens " + (await opens(app)).length);
      expect.eq(await app.sim("sim.restricted"), 0, "restricted clips while flicking focus");
      await app.key("ok", 200);
      await app.tick(8000);
      expect.eq(await app.sim("sim.restricted"), 0, "the film after flicking still plays");
    },
  },
];
