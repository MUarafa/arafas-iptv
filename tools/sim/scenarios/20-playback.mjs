// Playback, resume and Continue Watching under hostile conditions.
//
// The user's incident: a paused film sat in Continue Watching, pressing it did not play,
// and the entry vanished. Everything here checks that a failed or odd start never costs
// the viewer their place, and hunts for other ways playback or resume goes wrong.
//
// Stream URLs: /movie/sim/sim/<id>.<ext>, /series/sim/sim/<id>.<ext>, /live/sim/sim/<id>.ts
// The simulated provider allows ONE connection (server default) and keeps a released
// connection counted for 1.5 s, like real Xtream panels.

import { signedIn } from "../lib.mjs";

const MOVIE = { kind: "movie", id: "20001", name: "Seduced by His Lies (2026)", ext: "mkv" };
const MOVIE2 = { kind: "movie", id: "20002", name: "الممر", ext: "mkv" };
const MOVIE_URL = "/movie/sim/sim/20001.";
const MOVIE2_URL = "/movie/sim/sim/20002.";
// Series 30001 ("The Crown"), season 1: episode ids 40110..40115 (E1..E6).
const SERIES_ID = "30001";
const ep = (e, s = 1) => String(40000 + 1 * 100 + s * 10 + (e - 1));
const EP_URL = (e, s = 1) => "/series/sim/sim/" + ep(e, s) + ".";

function entry(item, position, duration, extra = {}) {
  return {
    kind: item.kind,
    id: item.id,
    name: item.name,
    poster: null,
    ext: item.ext || "mkv",
    seriesId: null,
    seriesName: null,
    season: null,
    episodeNumber: null,
    position,
    duration,
    updatedAt: Date.now(),
    ...extra,
  };
}
function episodeEntry(e, position, duration = 2400, updatedAgo = 0) {
  return entry({ kind: "episode", id: ep(e), name: "The Crown · S1E" + e, ext: "mkv" }, position, duration, {
    seriesId: SERIES_ID,
    seriesName: "The Crown",
    season: 1,
    episodeNumber: e,
    updatedAt: Date.now() - updatedAgo,
  });
}

function seeded(server, entries, extra = {}) {
  let resume = {};
  for (let e of entries) resume[e.kind + ":" + e.id] = e;
  return signedIn(server, { "iptv:resume": resume, ...extra });
}

const J = JSON.stringify;

async function playerVideo(app) {
  let all = await app.media();
  return all.find((v) => v.cls.indexOf("player-video") >= 0) || null;
}
async function message(app) {
  return app.eval(
    "(function(){var m=document.querySelector('.player-message');return m&&m.classList.contains('visible')?m.textContent:''})()",
  );
}
async function opens(app, match) {
  return app.sim(`sim.log.filter(function(l){return l[0]==='open'&&l[1].indexOf(${J(match)})>=0}).length`);
}
async function openLog(app, match) {
  return app.sim(
    `sim.log.filter(function(l){return l[0]==='open'&&l[1].indexOf(${J(match)})>=0}).map(function(l){return [l[1].split('/').pop(), l[2], l[4]]})`,
  );
}
async function allResume(app) {
  let r = await app.storage("iptv:resume");
  return r && typeof r === "object" ? r : {};
}
async function resumeOf(app, kind, id) {
  return (await allResume(app))[kind + ":" + id] || null;
}
async function route(app) {
  return (await app.state()).route;
}
async function routeParams(app) {
  return app.eval("(function(){var v=__router.view&&__router.view();return null})()");
}
// Long virtual waits in coarse steps (every due timer still runs, in order).
function wait(app, ms) {
  return app.eval(`__sim.clock.tick(${Number(ms)}, 250)`);
}
// Press OK on an element: the same event the keydown handler sends to the focused element.
async function activate(app, selector, after = 200) {
  let ok = await app.eval(
    `(function(){var n=document.querySelector(${J(selector)});if(!n)return false;n.dispatchEvent(new CustomEvent('focus-activate',{bubbles:true}));return true})()`,
  );
  if (!ok) throw new Error("nothing to activate: " + selector);
  await app.tick(after);
}
async function pushPlayer(app, params, after = 200) {
  await app.eval(`__router.push('player', ${J(params)})`);
  await app.tick(after);
}
async function fromContinue(app, id, after = 200) {
  await app.eval("__router.push('continue', {})");
  await app.tick(300);
  await activate(app, `.card[data-id="${id}"]`, after);
}
async function fromHomeRow(app, id, after = 200) {
  await app.tick(500);
  await activate(app, `.row .card[data-id="${id}"]`, after);
}
// Tick until cond() is true (checked every `step` ms) or `max` ms pass. Returns elapsed or -1.
async function until(app, cond, max = 60e3, step = 100) {
  for (let t = 0; t <= max; t += step) {
    if (await cond()) return t;
    await app.tick(step);
  }
  return -1;
}
// Leave the player: first Back may only hide the OSD.
async function leavePlayer(app) {
  for (let i = 0; i < 3 && (await route(app)) === "player"; i++) await app.key("back", 150);
}
function near(a, b, tol = 2) {
  return typeof a === "number" && Math.abs(a - b) <= tol;
}
// Hold the provider's single connection from somewhere else (another device / a stuck tab).
async function holdConnection(app) {
  await app.eval(
    "(function(){var v=document.createElement('video');v.className='held';v.src='http://127.0.0.1/live/sim/sim/19999.ts';v.play();window.__held=v})()",
  );
}

export default [
  // ================================================================== 1. the incident
  {
    name: "incident: stream never starts -> entry kept (back, autosave, reload)",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, fail: "never" }] });
      await fromContinue(app, MOVIE.id);
      expect.eq(await route(app), "player", "route");
      await wait(app, 90e3);
      note.push(`opens in 90 s: ${await opens(app, MOVIE_URL)}, message: ${J(await message(app))}`);
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "position while failing");
      await leavePlayer(app);
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "position after Back");
      await app.reload();
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "position after reload");
      expect(await app.eval(`!!document.querySelector('.row .card[data-id="${MOVIE.id}"]')`), "still in Continue Watching row");
    },
  },
  {
    name: "incident: stream errors every time -> bounded retries, message, entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, fail: "error" }] });
      await fromContinue(app, MOVIE.id);
      await wait(app, 30e3);
      let n30 = await opens(app, MOVIE_URL);
      await wait(app, 270e3);
      let n300 = await opens(app, MOVIE_URL);
      let msg = await message(app);
      note.push(`opens after 30 s: ${n30}, after 5 min: ${n300}; message ${J(msg)}`);
      expect(n300 <= 6, "retries must be bounded, got " + n300 + " opens in 5 min");
      expect(msg.length > 0, "a message is shown");
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "position while failing");
      await leavePlayer(app);
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "position after Back");
    },
  },
  {
    name: "incident: errors on first 2 opens -> third plays at the saved second",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, fail: "error", failTimes: 2, duration: 5400 }],
      });
      await fromContinue(app, MOVIE.id);
      let startedAt = await until(app, async () => {
        let v = await playerVideo(app);
        return v && !v.paused && v.t > 1000;
      }, 30e3, 250);
      let v = await playerVideo(app);
      note.push(`landed after ${startedAt} ms at t=${v && v.t}; opens ${J(await openLog(app, MOVIE_URL))}`);
      expect(startedAt >= 0, "never resumed");
      expect(v.t >= 1473 && v.t <= 1480, "landed at " + v.t);
      await wait(app, 15e3);
      await leavePlayer(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      expect(r && r.position >= 1485 && r.position <= 1495, "saved " + J(r && r.position));
    },
  },
  {
    name: "incident: pause, TV off (reload), Continue Watching row -> resumes where paused",
    async run({ open, expect, server }) {
      let app = await open({ media: [{ match: MOVIE_URL, duration: 5400 }] });
      await pushPlayer(app, { item: MOVIE, resumeAt: 0 });
      await wait(app, 1474e3 / 4); // 368 s of playback
      await app.key("pause", 300);
      let v = await playerVideo(app);
      let paused = Math.floor(v.t);
      expect(v.paused, "paused");
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, paused, "pause saved the position");
      await app.reload();
      await fromHomeRow(app, MOVIE.id);
      await app.tick(5000);
      v = await playerVideo(app);
      expect(v && v.t >= paused && v.t <= paused + 6, `resumed at ${v && v.t}, paused at ${paused}`);
    },
  },

  // ================================================================== 2. resume lands
  {
    name: "resume: from details Resume button lands at saved second",
    async run({ open, expect, server }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await app.eval(`__router.push('details', {kind:'movie', id:'${MOVIE.id}'})`);
      await app.tick(1500);
      let label = await app.text(".details-play");
      expect(/Resume/.test(label) && /24 min in/.test(label), "button label " + J(label));
      await activate(app, ".details-play", 5000);
      let v = await playerVideo(app);
      expect(v && v.t >= 1474 && v.t <= 1480, "landed at " + (v && v.t));
    },
  },
  {
    name: "resume: duration known only after 3 s -> seek waits, no save of the early position",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, durationAfter: 3000 }],
      });
      await fromContinue(app, MOVIE.id);
      await until(app, async () => {
        let v = await playerVideo(app);
        return v && v.t >= 1;
      }, 10e3, 100);
      // pause (which saves) while the seek is still pending
      await app.key("pause", 200);
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "saved while seek pending");
      await app.key("play", 200);
      await app.tick(6000);
      let v = await playerVideo(app);
      note.push("t after duration arrived: " + v.t);
      expect(v.t >= 1474 && v.t <= 1482, "landed at " + v.t);
    },
  },
  {
    name: "resume: non-seekable file must not overwrite the saved place with a start-of-file position",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, seekable: false }],
      });
      await fromContinue(app, MOVIE.id);
      await wait(app, 90e3);
      let v = await playerVideo(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`plays at t=${v.t}; saved entry position=${r && r.position}; message=${J(await message(app))}`);
      expect(r && r.position >= 1474, "saved place overwritten: " + (r && r.position));
    },
  },
  {
    name: "resume: boundaries 0/59/60/61/2/3 land where asked",
    async run({ open, expect, server, note }) {
      let out = [];
      for (let at of [0, 2, 3, 59, 60, 61]) {
        let app = await open({ storage: seeded(server, [entry(MOVIE, at, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
        await pushPlayer(app, { item: MOVIE, resumeAt: at });
        await app.tick(4000);
        let v = await playerVideo(app);
        out.push(at + "->" + (v && v.t));
        expect(v && v.t >= at && v.t <= at + 4, `resumeAt ${at} landed at ${v && v.t}`);
        await app.close();
      }
      note.push(out.join(", "));
    },
  },
  {
    name: "resume: saved position beyond the file's real duration -> must not silently drop the entry",
    async run({ open, expect, server, note }) {
      // Saved 5000 of a 5400 s listing, but the provider now serves a 3600 s file.
      let app = await open({ storage: seeded(server, [entry(MOVIE, 5000, 5400)]), media: [{ match: MOVIE_URL, duration: 3600 }] });
      await fromContinue(app, MOVIE.id);
      await app.tick(8000);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`route=${await route(app)} entry=${J(r && r.position)} message=${J(await message(app))}`);
      expect(r !== null, "entry deleted after a seek past the end (same symptom as the incident)");
    },
  },
  {
    name: "resume: VOD whose duration never becomes known (NaN) -> progress still saved",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, durationAfter: 1e12 }],
      });
      await fromContinue(app, MOVIE.id);
      await wait(app, 120e3);
      let v = await playerVideo(app);
      await leavePlayer(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`played to t=${v.t} (from 0, no seek possible); saved position=${r && r.position}`);
      expect(r && r.position >= 1474, "entry lost: " + J(r));
    },
  },
  {
    name: "resume: VOD misreported as live (Infinity) -> no crash, entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, live: true }] });
      await fromContinue(app, MOVIE.id);
      await wait(app, 60e3);
      let v = await playerVideo(app);
      let osd = await app.text(".osd-time-total");
      await leavePlayer(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`t=${v.t} osd total=${J(osd)} saved=${r && r.position}`);
      expect(r && r.position === 1474, "entry changed/lost: " + J(r));
    },
  },

  // ================================================================== 3. cuts and ends
  {
    name: "cut mid-film -> reconnects at the same second, stays in player",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, endAt: 1500 }],
      });
      await fromContinue(app, MOVIE.id, 3000);
      await app.eval("__sim.media.length = 0"); // only this open is cut
      await app.tick(35e3);
      let v = await playerVideo(app);
      note.push(`route=${await route(app)} t=${v && v.t} opens=${J(await openLog(app, MOVIE_URL))}`);
      expect.eq(await route(app), "player", "route");
      expect(v && v.t >= 1500 && v.t <= 1530, "resumed at " + (v && v.t));
    },
  },
  {
    name: "cut mid-film then Back during 'Connecting' -> entry keeps ~1500",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, endAt: 1500 }],
      });
      await fromContinue(app, MOVIE.id, 3000);
      let t = await until(app, async () => /Connecting/.test(await message(app)), 40e3, 100);
      expect(t >= 0, "cut never noticed");
      for (let i = 0; i < 2 && (await route(app)) === "player"; i++) await app.key("back", 60);
      expect.eq(await route(app), "continue", "left the player");
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`route=${await route(app)} entry=${J(r)}`);
      expect(r && r.position >= 1474, "entry lost after Back in the reconnect window: " + J(r));
    },
  },
  {
    name: "cut mid-film then pause key during 'Connecting' -> entry keeps ~1500",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, endAt: 1500 }],
      });
      await fromContinue(app, MOVIE.id, 3000);
      await app.eval("__sim.media.length = 0");
      let t = await until(app, async () => /Connecting/.test(await message(app)), 40e3, 100);
      expect(t >= 0, "cut never noticed");
      await app.key("playpause", 60);
      let r = await resumeOf(app, "movie", MOVIE.id);
      await app.tick(5000);
      let v = await playerVideo(app);
      note.push(`entry right after pause=${J(r && r.position)} later t=${v && v.t} paused=${v && v.paused}`);
      expect(r && r.position >= 1474, "entry lost after pause in the reconnect window: " + J(r));
    },
  },
  {
    name: "cut at the same second on every open -> bounded, message, entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, endAt: 1500 }],
      });
      await fromContinue(app, MOVIE.id);
      await wait(app, 300e3);
      let n = await opens(app, MOVIE_URL);
      let msg = await message(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`opens in 5 min: ${n}; message ${J(msg)}; entry ${J(r && r.position)}; route ${await route(app)}`);
      expect(n <= 8, "reopen loop: " + n + " opens");
      expect(r && r.position >= 1474, "entry lost: " + J(r));
      await leavePlayer(app);
      r = await resumeOf(app, "movie", MOVIE.id);
      expect(r && r.position >= 1474, "entry lost after Back: " + J(r));
    },
  },
  {
    name: "real end -> entry removed, lands on details showing Play",
    async run({ open, expect, server }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 5390, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await fromContinue(app, MOVIE.id);
      await app.tick(20e3);
      expect.eq(await route(app), "details", "route after the end");
      expect.eq(await resumeOf(app, "movie", MOVIE.id), null, "entry after the end");
      await app.tick(1500);
      let label = await app.text(".details-play");
      expect(/Play/.test(label) && !/Resume/.test(label), "details button " + J(label));
    },
  },
  {
    name: "cut within the last 3 s is treated as the end (by design)",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 5380, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, endAt: 5398 }],
      });
      await fromContinue(app, MOVIE.id);
      await app.tick(25e3);
      note.push(`route=${await route(app)} entry=${J(await resumeOf(app, "movie", MOVIE.id))}`);
      expect.eq(await route(app), "details", "route");
    },
  },
  {
    name: "93% rule: leaving at 92.9% keeps, at 93.1% removes",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 5000, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await pushPlayer(app, { item: MOVIE, resumeAt: 5000 }, 3000); // ~2.6 s played
      await until(app, async () => (await playerVideo(app)).t >= 5018, 30e3, 250);
      await leavePlayer(app);
      let kept = await resumeOf(app, "movie", MOVIE.id);
      await app.tick(4000); // let the provider release the first connection (see handoff scenario)
      await pushPlayer(app, { item: MOVIE, resumeAt: 5020 }, 3000);
      await until(app, async () => (await playerVideo(app)).t >= 5028, 30e3, 250);
      await leavePlayer(app);
      let removed = await resumeOf(app, "movie", MOVIE.id);
      note.push(`kept=${J(kept && kept.position)} removed=${J(removed)}`);
      expect(kept && kept.position >= 5018, "kept at 92.9%");
      expect.eq(removed, null, "removed at 93%+");
    },
  },

  // ================================================================== 4. stalls and network death
  {
    name: "stall forever -> recovery steps -> message, retries bounded, entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, stallAt: 1480, stallFor: 0 }],
      });
      await fromContinue(app, MOVIE.id);
      await wait(app, 60e3);
      let n60 = await opens(app, MOVIE_URL);
      await wait(app, 240e3);
      let n300 = await opens(app, MOVIE_URL);
      let msg = await message(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`opens after 1 min: ${n60}, after 5 min: ${n300}; message ${J(msg)}; entry ${J(r && r.position)}`);
      // Bounded recovery (a half-second nudge, a reload at the current position) may move
      // the saved place a few seconds past where playback froze; that is fine.
      expect(r && r.position >= 1474 && r.position <= 1490, "entry " + J(r));
      expect(n300 <= 10, "endless reopen loop: " + n300 + " opens in 5 min");
      expect(/not available/.test(msg), "gives up with a message, got " + J(msg));
    },
  },
  {
    name: "network dies 60 s into playback -> retries bounded, message, entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await fromContinue(app, MOVIE.id);
      await wait(app, 60e3);
      await app.eval(`__sim.media.push({match:${J(MOVIE_URL)}, fail:'error'})`);
      await app.eval(`(function(){var v=document.querySelector('.player-video');v.dispatchEvent(new Event('error'))})()`);
      let before = await opens(app, MOVIE_URL);
      await wait(app, 300e3);
      let n = (await opens(app, MOVIE_URL)) - before;
      let msg = await message(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`opens in the 5 min after the network died: ${n}; message ${J(msg)}; entry ${J(r && r.position)}`);
      expect(r && r.position >= 1520, "entry " + J(r));
      expect(n <= 6, "endless reopen loop: " + n + " opens in 5 min");
      expect(/not available/.test(msg), "gives up with a message, got " + J(msg));
    },
  },
  {
    name: "Back during loading -> entry kept, no connection, no player timers",
    async run({ open, expect, server }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, startDelay: 5000 }],
      });
      await app.eval("__router.push('continue', {})");
      await app.tick(4000);
      let base = await app.sim("sim.clock.pending()");
      await activate(app, `.card[data-id="${MOVIE.id}"]`, 1000);
      await app.key("back", 100);
      await app.key("back", 100);
      expect.eq(await route(app), "continue", "route");
      await app.tick(8000);
      expect.eq((await resumeOf(app, "movie", MOVIE.id)).position, 1474, "entry");
      expect.eq(await app.sim("sim.connectionCount()"), 0, "connections");
      let pend = await app.sim("sim.clock.pending()");
      expect(pend.intervals <= base.intervals, `intervals before ${base.intervals}, after ${pend.intervals}`);
      expect.eq(await playerVideo(app), null, "player video gone");
    },
  },
  {
    name: "Back during stall recovery -> entry at the stall point",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400)]),
        media: [{ match: MOVIE_URL, duration: 5400, stallAt: 1480, stallFor: 0 }],
      });
      await fromContinue(app, MOVIE.id);
      await app.tick(14e3);
      await leavePlayer(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push("entry " + J(r && r.position));
      // Bounded recovery (a half-second nudge, a reload at the current position) may move
      // the saved place a few seconds past where playback froze; that is fine.
      expect(r && r.position >= 1474 && r.position <= 1490, "entry " + J(r));
    },
  },

  // ================================================================== 5. remote abuse
  {
    name: "Back during a seek preview -> no seek after leaving, entry = real position",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await fromContinue(app, MOVIE.id, 5000);
      await app.keys(["right", "right", "right"], 150);
      // 60 ms apart: presses closer than 50 ms are treated as the remote echoing one press.
      for (let i = 0; i < 2 && (await route(app)) === "player"; i++) await app.key("back", 60);
      await app.tick(1500);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`route=${await route(app)} entry=${J(r && r.position)}`);
      expect.eq(await route(app), "continue", "route");
      expect(r && r.position >= 1474 && r.position < 1500, "entry " + J(r));
      expect.eq(await playerVideo(app), null, "player video gone");
    },
  },
  {
    name: "pause 30 min then resume -> continues without a reload, Back saves",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await fromContinue(app, MOVIE.id, 5000);
      await app.key("pause", 200);
      let at = (await playerVideo(app)).t;
      await wait(app, 30 * 60e3);
      let n = await opens(app, MOVIE_URL);
      await app.key("play", 200);
      await app.tick(10e3);
      let v = await playerVideo(app);
      let n2 = await opens(app, MOVIE_URL);
      note.push(`paused at ${at}, 10 s after play t=${v.t}, opens ${n}->${n2}, message ${J(await message(app))}`);
      expect(v.t >= at + 8, "not playing after unpause");
      await leavePlayer(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      expect(r && near(r.position, v.t, 2), "entry " + J(r));
    },
  },
  {
    name: "play/pause spam x31 -> consistent paused state and button",
    async run({ open, expect, server }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await fromContinue(app, MOVIE.id, 5000);
      // 60 ms apart - as fast as a thumb goes; closer than 50 ms counts as a remote echo.
      for (let i = 0; i < 31; i++) await app.key("playpause", 60);
      await app.tick(500);
      let v = await playerVideo(app);
      let btn = await app.eval("document.querySelector('.osd-controls .osd-button').textContent");
      expect(v.paused, "odd number of toggles should leave it paused");
      expect.eq(btn, "▶", "button");
      expect(v.t >= 1474, "position " + v.t);
      expect(near((await resumeOf(app, "movie", MOVIE.id)).position, v.t, 1), "saved");
    },
  },
  {
    name: "seek spam: right past the end / left past 0 -> clamps, no crash",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await fromContinue(app, MOVIE.id, 5000);
      for (let i = 0; i < 40; i++) await app.key("left", 100);
      await app.tick(1000);
      let v = await playerVideo(app);
      expect(v.t >= 0 && v.t < 3, "left spam to 0, t=" + v.t);
      await app.tick(15e3);
      await leavePlayer(app);
      let afterRewind = await resumeOf(app, "movie", MOVIE.id);
      note.push("entry after rewinding to 0 and leaving at ~15 s: " + J(afterRewind && afterRewind.position));
      await app.tick(4000); // provider release of the previous connection
      await pushPlayer(app, { item: MOVIE, resumeAt: 1474 }, 5000);
      for (let i = 0; i < 40; i++) await app.key("right", 100);
      await app.tick(600);
      v = await playerVideo(app);
      note.push(`right spam -> t=${v && v.t} route=${await route(app)}`);
      expect(!v || v.t <= 5400, "clamped");
      await app.tick(5000);
      note.push(`then route=${await route(app)} entry=${J(await resumeOf(app, "movie", MOVIE.id))}`);
    },
  },

  // ================================================================== 6. restricted clip
  {
    name: "restricted clip (connection held elsewhere) on resume -> message, entry kept, no loop",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await app.eval("__router.push('continue', {})");
      await app.tick(4000);
      await holdConnection(app);
      await app.tick(500);
      await activate(app, `.card[data-id="${MOVIE.id}"]`, 10e3);
      let r1 = await resumeOf(app, "movie", MOVIE.id);
      let msg = await message(app);
      let rt = await route(app);
      await wait(app, 300e3);
      let n = await opens(app, MOVIE_URL);
      note.push(`route=${rt} message=${J(msg)} entry=${J(r1 && r1.position)} restricted=${await app.sim("sim.restricted")} opens(5 min)=${n}`);
      expect(r1 && r1.position === 1474, "entry lost to the restricted clip: " + J(r1));
      expect.eq(rt, "player", "stays on the player with the message");
      expect(n <= 4, "reopen loop " + n);
    },
  },
  {
    name: "restricted clip on resume, slow start (700 ms) -> entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: "", startDelay: 700 }, { match: MOVIE_URL, duration: 5400 }] });
      await app.eval("__router.push('continue', {})");
      await app.tick(4000);
      await holdConnection(app);
      await app.tick(1000);
      await activate(app, `.card[data-id="${MOVIE.id}"]`, 10e3);
      let r1 = await resumeOf(app, "movie", MOVIE.id);
      note.push(`route=${await route(app)} message=${J(await message(app))} entry=${J(r1 && r1.position)}`);
      expect(r1 && r1.position === 1474, "entry lost to the restricted clip: " + J(r1));
    },
  },
  {
    name: "host serves a 45 s notice instead of the film on resume -> entry kept",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 45, startDelay: 600 }] });
      await fromContinue(app, MOVIE.id, 10e3);
      let r = await resumeOf(app, "movie", MOVIE.id);
      note.push(`route=${await route(app)} message=${J(await message(app))} entry=${J(r && r.position)}`);
      expect(r && r.position === 1474, "entry lost: " + J(r));
    },
  },

  // ================================================================== 7. episodes
  {
    name: "episode progress on S1E4 replaces S1E2 of the same series",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [episodeEntry(2, 900, 2400, 60e3)]), media: [{ match: "/series/", duration: 2400 }] });
      await app.eval(`__router.push('details', {kind:'series', id:'${SERIES_ID}'})`);
      await app.tick(2000);
      await activate(app, ".episode-list .episode-row:nth-child(4)", 3000);
      let v = await playerVideo(app);
      expect(v && v.src.indexOf(EP_URL(4)) >= 0, "playing " + (v && v.src));
      await wait(app, 70e3);
      await leavePlayer(app);
      let all = await allResume(app);
      note.push("keys " + J(Object.keys(all)));
      expect(all["episode:" + ep(4)], "S1E4 saved");
      expect(!all["episode:" + ep(2)], "S1E2 removed");
      expect.eq(all["episode:" + ep(4)].seriesId, SERIES_ID, "seriesId");
    },
  },
  {
    name: "episode from Home Continue Watching row keeps its series info",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [episodeEntry(4, 600)]), media: [{ match: "/series/", duration: 2400 }] });
      await fromHomeRow(app, ep(4), 5000);
      let v = await playerVideo(app);
      expect(v && v.t >= 600, "resumed at " + (v && v.t));
      await wait(app, 15e3);
      await leavePlayer(app);
      let r = await resumeOf(app, "episode", ep(4));
      note.push("entry " + J(r));
      expect.eq(r && r.seriesId, SERIES_ID, "seriesId after playing from the Home row");
      expect.eq(r && r.episodeNumber, 4, "episodeNumber");
    },
  },
  {
    name: "episode from Home row played to the end -> series details (not an episode id as series)",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [episodeEntry(4, 2390)]), media: [{ match: "/series/", duration: 2400 }] });
      await fromHomeRow(app, ep(4), 20e3);
      let p = await app.eval("JSON.stringify(__router.current()) + ' ' + JSON.stringify((document.querySelector('.details-title')||{}).textContent)");
      note.push("after end: " + p);
      expect.eq(await route(app), "details", "route");
      let title = await app.text(".details-title");
      expect(title && /Series 30001|The Crown/.test(title), "details of the series, got title " + J(title));
    },
  },
  {
    name: "next episode: prompt near the end, then plays S1E6 (single-connection handoff)",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [episodeEntry(5, 2300)]), media: [{ match: "/series/", duration: 2400 }] });
      await app.eval(`__router.push('details', {kind:'series', id:'${SERIES_ID}'})`);
      await app.tick(2000);
      await activate(app, ".episode-list .episode-row:nth-child(5)", 4000);
      let v = await playerVideo(app);
      expect(v && v.t >= 2300, "resumed at " + (v && v.t));
      let shown = await until(app, async () => app.eval("!!document.querySelector('.credits-prompt:not([hidden])')"), 60e3, 500);
      expect(shown >= 0, "up-next prompt never shown");
      await until(app, async () => {
        let v2 = await playerVideo(app);
        return v2 && v2.src.indexOf(EP_URL(6)) >= 0;
      }, 60e3, 500);
      await app.tick(8000);
      let v2 = await playerVideo(app);
      let msg = await message(app);
      note.push(`next src=${v2 && v2.src.split("/").pop()} t=${v2 && v2.t} dur=${v2 && v2.dur} message=${J(msg)} restricted=${await app.sim("sim.restricted")}`);
      expect(v2 && v2.src.indexOf(EP_URL(6)) >= 0, "next episode not playing");
      expect(!(await resumeOf(app, "episode", ep(5))), "finished S1E5 removed");
      expect(v2.dur === 2400 && !v2.paused, "S1E6 plays (not the restricted clip): dur=" + v2.dur + " msg=" + J(msg));
    },
  },
  {
    name: "last episode of season 1 ends -> series details",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [episodeEntry(6, 2380)]), media: [{ match: "/series/", duration: 2400 }] });
      await app.eval(`__router.push('details', {kind:'series', id:'${SERIES_ID}'})`);
      await app.tick(2000);
      await activate(app, ".episode-list .episode-row:nth-child(6)", 30e3);
      note.push(`route=${await route(app)} entry=${J(await resumeOf(app, "episode", ep(6)))}`);
      expect.eq(await route(app), "details", "route");
    },
  },

  // ================================================================== 8. live
  {
    name: "live: stream ends every 30 s for 10 min -> same channel, never 'unavailable'",
    async run({ open, expect, server, note }) {
      let app = await open({ media: [{ match: "/live/", live: true, endAt: 30 }] });
      await app.tick(3000);
      await pushPlayer(app, { channel: { kind: "live", id: "10006", name: "Al Jazeera" }, siblings: [], index: 0 }, 3000);
      let msgs = new Set();
      for (let i = 0; i < 20; i++) {
        await wait(app, 30e3);
        msgs.add(await message(app));
      }
      let log = await openLog(app, "/live/");
      let ids = [...new Set(log.map((l) => l[0]))];
      note.push(`opens=${log.length} ids=${J(ids)} messages seen=${J([...msgs])}`);
      expect.eq(ids, ["10006.ts"], "channel ids opened");
      expect(![...msgs].some((m) => /not available/.test(m)), "showed unavailable");
      expect.eq(await route(app), "player", "route");
      expect(log.length >= 15, "reconnected " + log.length + " times");
    },
  },
  {
    name: "live: every source fails -> message on the same channel, no zap, bounded",
    async run({ open, expect, server, note }) {
      let app = await open({ media: [{ match: "/live/", live: true, fail: "error" }] });
      await app.tick(3000);
      let siblings = [
        { kind: "live", id: "10000", name: "MBC 1 HD" },
        { kind: "live", id: "10006", name: "Al Jazeera" },
      ];
      await pushPlayer(app, { channel: siblings[0], siblings, index: 0 }, 1000);
      await wait(app, 300e3);
      let log = await openLog(app, "/live/");
      let ids = [...new Set(log.map((l) => l[0]))];
      let msg = await message(app);
      note.push(`opens=${log.length} ids=${J(ids)} message=${J(msg)} title=${J(await app.text(".osd-title"))}`);
      // Every "MBC 1 <quality>" stream in any category is the same channel; Al Jazeera (10006) is the sibling.
      let names = await app.eval(`(function(){return null})()`);
      expect(!ids.some((i) => /^10006\./.test(i)), "zapped to the sibling channel: " + J(ids));
      expect.eq(await app.text(".osd-title"), "MBC 1 HD", "osd title");
      expect(/not available/.test(msg), "message " + J(msg));
      expect(log.length <= 20, "bounded " + log.length);
    },
  },
  {
    name: "live: first-choice MBC 1 source hangs -> fails over to another MBC 1 quality (not the restricted clip)",
    async run({ open, expect, server, note }) {
      // The app's first choice for "MBC 1 HD" is 10001 (FHD); make it never start.
      let app = await open({ media: [{ match: "/live/", live: true }, { match: "/live/sim/sim/10001.", fail: "never" }] });
      await app.tick(4000);
      await pushPlayer(app, { channel: { kind: "live", id: "10000", name: "MBC 1 HD" }, siblings: [], index: 0 }, 20e3);
      let v = await playerVideo(app);
      let log = await openLog(app, "/live/");
      note.push(`opens ${J(log)} now ${v && v.src.split("/").pop()} dur=${v && v.dur} paused=${v && v.paused} message=${J(await message(app))}`);
      expect(v && !/\/10001\./.test(v.src) && !v.paused, "not playing an alternative MBC 1 source");
      expect.eq(await app.sim("sim.restricted"), 0, "restricted clips served during failover");
    },
  },
  {
    // Live channels switch instantly by default; the app only waits for the hand-back once
    // it has learned that this provider keeps closed streams counted.
    name: "live: channel up (zap) on a provider known to hold closed streams -> new channel plays, not the restricted clip",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: signedIn(server, { "iptv:providerLingers": "1" }),
        media: [{ match: "/live/", live: true }],
      });
      await app.tick(3000);
      let siblings = [
        { kind: "live", id: "10006", name: "Al Jazeera" },
        { kind: "live", id: "10007", name: "CBC" },
      ];
      await pushPlayer(app, { channel: siblings[0], siblings, index: 0 }, 5000);
      await app.key("chdown", 5000);
      let v = await playerVideo(app);
      note.push(`src=${v && v.src.split("/").pop()} dur=${v && v.dur} restricted=${await app.sim("sim.restricted")} log=${J(await openLog(app, "/live/"))}`);
      expect(v && v.src.indexOf("10007") >= 0 && v.t > 0, "zapped and playing");
      expect.eq(await app.sim("sim.restricted"), 0, "restricted clips served");
    },
  },
  {
    name: "live: first zap on an unknown provider that holds closed streams -> recovers, learns, next zap is clean",
    async run({ open, expect, server, note }) {
      let app = await open({ media: [{ match: "/live/", live: true }] });
      await app.tick(3000);
      let siblings = [
        { kind: "live", id: "10006", name: "Al Jazeera" },
        { kind: "live", id: "10007", name: "CBC" },
      ];
      await pushPlayer(app, { channel: siblings[0], siblings, index: 0 }, 5000);
      await app.key("chdown", 8000);
      let v = await playerVideo(app);
      let first = await app.sim("sim.restricted");
      note.push(`after first zap: src=${v && v.src.split("/").pop()} t=${v && v.t} restricted=${first} learned=${await app.storage("iptv:providerLingers")}`);
      expect(v && v.src.indexOf("10007") >= 0 && v.t > 0, "the new channel plays after recovering");
      expect(first <= 1, "at most one notice clip while learning, got " + first);
      await app.key("chup", 8000);
      v = await playerVideo(app);
      expect(v && v.src.indexOf("10006") >= 0 && v.t > 0, "zapped back and playing");
      expect.eq(await app.sim("sim.restricted"), first, "no new notice clip once learned");
    },
  },

  // ================================================================== 9. storage abuse
  {
    name: "storage: corrupted iptv:resume JSON -> boots, plays, saves",
    async run({ open, expect, server }) {
      let app = await open({ storage: signedIn(server, { "iptv:resume": "{not json" }), media: [{ match: MOVIE_URL, duration: 5400 }] });
      expect.eq(await route(app), "home", "boot");
      await pushPlayer(app, { item: MOVIE, resumeAt: 0 }, 3000);
      await wait(app, 75e3);
      await leavePlayer(app);
      let r = await resumeOf(app, "movie", MOVIE.id);
      expect(r && r.position >= 70, "saved " + J(r));
    },
  },
  {
    name: "storage: entries with missing/garbage fields -> Home and Continue render",
    async run({ open, expect, server, note }) {
      let resume = {
        "movie:1": null,
        "movie:2": { id: "2" },
        "episode:3": { kind: "episode", id: "3", seriesId: "9", position: "abc", updatedAt: "x" },
        "movie:20001": entry(MOVIE, 1474, 5400),
      };
      let app = await open({ storage: signedIn(server, { "iptv:resume": resume }), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await app.tick(2000);
      let home = await route(app);
      let errs = await app.sim("sim.errors.map(function(e){return e.message})");
      note.push(`route=${home} errors=${J(errs)} console=${J(app.errors.map((e) => e.message))}`);
      expect.eq(home, "home", "boot");
      expect(await app.eval(`!!document.querySelector('.row .card[data-id="20001"]')`), "valid entry shown");
      await fromContinue(app, MOVIE.id, 5000);
      let v = await playerVideo(app);
      expect(v && v.t >= 1474, "plays from continue");
    },
  },
  {
    name: "storage: 150 entries -> capped at 100, newest kept",
    async run({ open, expect, server }) {
      let entries = [];
      for (let i = 0; i < 150; i++)
        entries.push({ ...entry({ kind: "movie", id: String(21000 + i), name: "M" + i, ext: "mkv" }, 600, 5400), updatedAt: Date.now() - (i + 1) * 60e3 });
      let app = await open({ storage: seeded(server, entries), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await pushPlayer(app, { item: MOVIE, resumeAt: 1474 }, 3000);
      await wait(app, 12e3);
      let all = await allResume(app);
      expect(Object.keys(all).length <= 100, "size " + Object.keys(all).length);
      expect(all["movie:20001"], "current title kept");
      expect(all["movie:21000"] && !all["movie:21149"], "newest kept, oldest dropped");
    },
  },
  {
    name: "storage: setItem throws QuotaExceededError -> playback and pause still work",
    async run({ open, expect, server }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400 }] });
      await app.eval(
        "(function(){var o=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).indexOf('iptv:')===0){throw new DOMException('full','QuotaExceededError')}return o.apply(this,arguments)}})()",
      );
      await fromContinue(app, MOVIE.id, 5000);
      await wait(app, 25e3);
      await app.key("pause", 200);
      await app.key("play", 2000);
      let v = await playerVideo(app);
      expect(v && !v.paused && v.t > 1490, "playing " + J(v));
      await leavePlayer(app);
      expect.eq(await route(app), "continue", "route");
    },
  },

  // ================================================================== 10/11. leaks and quick opens
  {
    name: "leaving the player leaves no intervals, videos or connections behind",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: seeded(server, [entry(MOVIE, 1474, 5400)]), media: [{ match: MOVIE_URL, duration: 5400, endAt: 1490 }] });
      await app.eval("__router.push('continue', {})");
      await app.tick(4000);
      let base = await app.sim("sim.clock.pending()");
      await activate(app, `.card[data-id="${MOVIE.id}"]`, 1000);
      await until(app, async () => /Connecting/.test(await message(app)), 40e3, 100); // mid-retry
      await leavePlayer(app);
      await app.tick(5000);
      let pend = await app.sim("sim.clock.pending()");
      let conns = await app.sim("sim.connectionCount()");
      let vids = await app.media();
      note.push(`pending before ${J(base)} after ${J(pend)}; connections ${conns}; videos ${J(vids)}; opens ${await opens(app, MOVIE_URL)}`);
      expect(pend.intervals <= base.intervals, "intervals leaked");
      expect.eq(conns, 0, "connections");
      expect(vids.every((v) => !v.src), "a video still has a src");
      await app.tick(5000);
      expect.eq(await opens(app, MOVIE_URL), 1, "a retry fired after leaving");
    },
  },
  {
    name: "Play, Back within 100 ms, Play another title -> no cross-title writes, no restricted clip",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400), { ...entry(MOVIE2, 3000, 6000), updatedAt: Date.now() - 1000 }]),
        media: [{ match: "/movie/", duration: 5400 }, { match: MOVIE2_URL, duration: 6000 }],
      });
      await app.eval("__router.push('continue', {})");
      await app.tick(4000);
      await activate(app, `.card[data-id="${MOVIE.id}"]`, 50);
      // 60 ms apart (closer than 50 ms counts as a remote echo of one press).
      await app.key("back", 60); // hides the OSD
      await app.key("back", 60); // leaves
      expect.eq(await route(app), "continue", "left within ~150 ms");
      await app.tick(300);
      await activate(app, `.card[data-id="${MOVIE2.id}"]`, 6000);
      let v = await playerVideo(app);
      await wait(app, 20e3);
      await leavePlayer(app);
      let a = await resumeOf(app, "movie", MOVIE.id);
      let b = await resumeOf(app, "movie", MOVIE2.id);
      note.push(`first=${J(a && a.position)} second=${J(b && b.position)} src=${v && v.src.split("/").pop()} t=${v && v.t} restricted=${await app.sim("sim.restricted")} log=${J(await openLog(app, "/movie/"))}`);
      expect.eq(a && a.position, 1474, "first title untouched");
      expect(b && b.position >= 3015, "second title saved " + J(b));
      expect(v && v.src.indexOf(MOVIE2_URL) >= 0 && v.t >= 3000, "second title resumed");
    },
  },
  {
    name: "Play a title for 20 s, Back, immediately Play another -> second is not the restricted clip",
    async run({ open, expect, server, note }) {
      let app = await open({
        storage: seeded(server, [entry(MOVIE, 1474, 5400), { ...entry(MOVIE2, 3000, 6000), updatedAt: Date.now() - 1000 }]),
        media: [{ match: MOVIE_URL, duration: 5400 }, { match: MOVIE2_URL, duration: 6000 }],
      });
      await fromContinue(app, MOVIE.id, 20e3);
      await leavePlayer(app);
      await app.tick(200);
      await activate(app, `.card[data-id="${MOVIE2.id}"]`, 8000);
      let v = await playerVideo(app);
      let b = await resumeOf(app, "movie", MOVIE2.id);
      note.push(`src=${v && v.src.split("/").pop()} t=${v && v.t} dur=${v && v.dur} message=${J(await message(app))} restricted=${await app.sim("sim.restricted")} entry2=${J(b && b.position)}`);
      expect.eq(await app.sim("sim.restricted"), 0, "restricted clips served");
      expect(v && v.t >= 3000, "second title resumed");
    },
  },
];
