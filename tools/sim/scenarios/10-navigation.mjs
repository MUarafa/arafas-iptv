// Remote-control navigation and focus stability.
//
// The complaint: in the main menu a Down press is sometimes not registered, or one press
// moves two steps. These scenarios check that every press moves exactly one step, at
// human speeds and at key auto-repeat speeds, while routes render and data is still
// loading, in every language (RTL included), with the Magic Remote pointer, and under
// thousands of random presses. Every key is followed by the focus invariants:
// exactly one focused node, attached, visible, on a known route.
//
//   node tools/sim/run.mjs 10-navigation          all of them
//   node tools/sim/run.mjs "10-navigation :: N17" one of them

import { sleep } from "../lib.mjs";

const RAIL = ["continue", "favorites", "search", "home", "live", "movies", "series", "settings", "freetv"];
const KNOWN_ROUTES = new Set(["welcome", "home", "player", "details", "live", "movies", "series", "favorites", "continue", "search", "settings", "freetv"]);

let MESSAGES = null;
try {
  MESSAGES = (await import("../../../src/i18n.js")).MESSAGES;
} catch {}

// ------------------------------------------------------------------------------ helpers

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ST = `(function(){
  var f = document.querySelectorAll('.focused'), n = f[0] || null;
  var r = n && n.getBoundingClientRect();
  var rail = document.querySelector('nav.rail');
  var items = rail ? Array.prototype.filter.call(rail.querySelectorAll('.rail-item'), function(x){ return !x.hidden; }) : [];
  var inRail = !!(n && rail && rail.contains(n));
  var vis = !!n && r.width > 0 && r.height > 0 && (n.offsetParent !== null || getComputedStyle(n).position === 'fixed');
  return {
    route: window.__router ? window.__router.current() : null,
    focusCount: f.length,
    dataFocused: document.querySelectorAll('[data-focused]').length,
    inDoc: !!n && document.contains(n),
    visible: vis,
    onScreen: !!r && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight,
    rect: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null,
    inRail: inRail,
    railRoute: inRail ? n.getAttribute('data-route') : null,
    railIndex: inRail ? items.indexOf(n) : -1,
    railVisible: items.map(function(x){ return x.getAttribute('data-route'); }),
    idx: n && n.getAttribute('data-index') != null ? Number(n.getAttribute('data-index')) : null,
    cls: n ? String(n.className).replace(/\\s*focused\\s*/, ' ').trim() : null,
    label: n ? (n.textContent || '').trim().slice(0, 30) : null,
    key: n ? (n.__key || null) : null,
    trap: !!document.querySelector('[data-focus-trap]'),
    dir: document.documentElement.getAttribute('dir'),
    lang: document.documentElement.getAttribute('lang'),
  };
})()`;

const st = (app) => app.eval(ST);

function problems(s) {
  let p = [];
  if (s.focusCount !== 1) p.push("focusCount=" + s.focusCount);
  if (s.dataFocused !== 1) p.push("[data-focused] count=" + s.dataFocused);
  if (s.focusCount && !s.inDoc) p.push("focus detached");
  if (s.focusCount && !s.visible) p.push("focus invisible");
  if (!KNOWN_ROUTES.has(s.route)) p.push("unknown route " + s.route);
  return p;
}

function valid(expect, s, where) {
  let p = problems(s);
  expect(!p.length, `${where}: ${p.join(", ")} (route=${s.route} focus=${s.cls} "${s.label}")`);
}

async function press(app, expect, name, after = 150, where = name) {
  await app.key(name, after);
  let s = await st(app);
  valid(expect, s, where);
  return s;
}

// Get focus into the rail, whatever screen we are on.
async function toRail(app, expect) {
  for (let i = 0; i < 8; i++) {
    let s = await st(app);
    if (s.inRail) return s;
    await app.key(s.route === "player" || s.route === "details" ? "back" : i % 2 ? "left" : "back", 400);
  }
  let s = await st(app);
  expect(s.inRail, "could not get focus into the rail, focus=" + s.cls + " route=" + s.route);
  return s;
}

async function railTo(app, expect, route, gap = 150) {
  let s = await toRail(app, expect);
  let target = s.railVisible.indexOf(route);
  expect(target >= 0, "rail item not visible: " + route);
  for (let i = 0; i < 12 && s.railIndex !== target; i++) s = await press(app, expect, s.railIndex < target ? "down" : "up", gap);
  expect.eq(s.railRoute, route, "rail focus");
  return s;
}

// Tick in small steps until pred(state) holds; returns { s, ms } or { s, ms: null }.
async function waitFor(app, pred, maxMs = 3000, step = 50) {
  let ms = 0;
  let s = await st(app);
  while (!pred(s) && ms < maxMs) {
    await app.tick(step);
    ms += step;
    s = await st(app);
  }
  return { s, ms: pred(s) ? ms : null };
}

async function mouse(app, type, x, y) {
  return app.eval(`(function(){
    var t = document.elementFromPoint(${x}, ${y}) || document.body;
    t.dispatchEvent(new MouseEvent(${JSON.stringify(type)}, { bubbles: true, cancelable: true, view: window, clientX: ${x}, clientY: ${y} }));
    return t.className;
  })()`);
}

async function center(app, selector) {
  return app.eval(`(function(){
    var n = document.querySelector(${JSON.stringify(selector)}); if (!n) return null;
    var r = n.getBoundingClientRect(); return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  })()`);
}

const contentFocusables = (app) =>
  app.eval(`Array.prototype.filter.call(document.querySelectorAll('.content .focusable:not(.disabled):not([hidden])'), function(n){ var r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && n.offsetParent !== null; }).length`);

// One pass through the rail: Up to the top, Down to the bottom (plus 2 extra presses),
// Up to the top (plus 2 extra). Every press must move exactly one visible item.
async function railWalk(app, expect, gap, label, realGapMs = 0) {
  let s = await toRail(app, expect);
  let n = s.railVisible.length;
  let startRoute = s.route;
  for (let i = 0; i < n && s.railIndex > 0; i++) s = await press(app, expect, "up", gap);
  expect.eq(s.railIndex, 0, label + " reach top");
  let moves = [];
  for (let dir of ["down", "up"]) {
    for (let i = 0; i < n + 1; i++) {
      let before = s.railIndex;
      await app.key(dir, gap);
      if (realGapMs) await sleep(realGapMs);
      s = await st(app);
      valid(expect, s, `${label} ${dir} #${i}`);
      expect(s.inRail, `${label} ${dir} #${i}: focus left the rail (${s.cls})`);
      let want = dir === "down" ? Math.min(n - 1, before + 1) : Math.max(0, before - 1);
      moves.push(s.railIndex - before);
      expect(s.railIndex === want, `${label} ${dir} #${i}: index ${before} -> ${s.railIndex}, expected ${want} (gap ${gap} ms)`);
      expect(s.route === startRoute,`${label}: moving in the rail changed the route to ${s.route}`);
    }
  }
  return moves;
}

// ------------------------------------------------------------------------------ monkey

const WEIGHTS = [
  ["down", 18], ["up", 16], ["left", 14], ["right", 16], ["ok", 13], ["back", 12],
  ["yellow", 2], ["blue", 1], ["red", 1], ["green", 1], ["playpause", 2], ["chup", 1], ["chdown", 1], ["stop", 1],
];
const GAPS = [30, 45, 60, 90, 120, 200, 400, 900];

function monkey(seed, count, config) {
  return {
    name: `N17 monkey seed ${seed}: ${count} random keys, invariants after every key`,
    config,
    async run({ open, expect, note }) {
      let app = await open({ media: [{ match: "", startDelay: 300 }] });
      await app.tick(2500);
      let rand = rng(seed);
      let total = WEIGHTS.reduce((a, w) => a + w[1], 0);
      let last = [];
      let routes = {};
      let offscreen = 0;
      let firstOffscreen = null;
      let failures = new Map();
      for (let i = 0; i < count; i++) {
        let r = rand() * total, k = WEIGHTS[0][0];
        for (let [name, w] of WEIGHTS) if ((r -= w) < 0) { k = name; break; }
        let gap = GAPS[Math.floor(rand() * GAPS.length)];
        if (rand() < 0.03) gap = 2500; // let loads land now and then
        let before = await st(app);
        // Keep the account signed in and the caches warm.
        if (k === "ok" && (before.key === "signOut" || before.key === "clearCache")) k = "down";
        // OK on a keyboard language button drops focus (covered by N33); step over it so
        // the monkey can look for other bugs.
        if (k === "ok" && /kb-lang/.test(before.cls || "")) k = "down";
        await app.key(k, gap);
        last.push(`${k}+${gap}`);
        if (last.length > 30) last.shift();
        let s = await st(app);
        routes[s.route] = (routes[s.route] || 0) + 1;
        if (s.focusCount === 1 && !s.onScreen) {
          offscreen++;
          if (!firstOffscreen) firstOffscreen = `#${i} route=${s.route} ${s.cls} rect=${s.rect}`;
        }
        let p = problems(s);
        if (!p.length && s.route === "welcome") p.push("signed out / welcome");
        if (p.length) {
          // One settle: a transient that heals within a frame is noted, not failed.
          await app.tick(300);
          let s2 = await st(app);
          let p2 = problems(s2);
          let msg = `seed ${seed} step ${i}: ${p.join(", ")} after ${k} on route ${s.route} (before: ${before.route} ${before.cls})` +
            `; after 300 ms: ${p2.length ? p2.join(", ") : "healed"}; last 30 keys: ${last.join(" ")}`;
          if (!p2.length) note.push("transient: " + msg);
          else {
            // Record the distinct failure, recover the way a viewer would (press a key),
            // and keep exploring so one bug does not hide the next.
            let sig = `${p2.join(",")} after ${k} on ${before.route} (${(before.cls || "").split(" ")[0]})`;
            if (!failures.has(sig)) failures.set(sig, msg);
            if (failures.size >= 6) break;
            await app.key("down", 200);
          }
        }
      }
      if (failures.size) expect(false, `${failures.size} distinct focus failures:\n        ` + [...failures.values()].join("\n        "));
      note.push(`routes visited (per-key samples): ${JSON.stringify(routes)}`);
      if (offscreen) note.push(`focus off-screen after ${offscreen} of ${count} keys; first: ${firstOffscreen}`);
    },
  };
}

// ------------------------------------------------------------------------------ scenarios

export default [
  {
    name: "N01 rail: every Down/Up press moves exactly one item, ends stop (300 ms gap)",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2000);
      let s = await press(app, expect, "left", 300);
      expect(s.inRail, "Left from Home content should reach the rail, focus=" + s.cls);
      expect.eq(s.railVisible, RAIL, "visible rail items");
      await railWalk(app, expect, 300, "300ms");
      s = await st(app);
      expect.eq(s.route, "home", "walking the rail must not navigate");
    },
  },
  {
    name: "N02 rail: single-step at human speeds (80/120/200 ms virtual, and with real 60 ms pauses for CSS transitions)",
    async run({ open, expect }) {
      let app = await open();
      await app.tick(2000);
      await press(app, expect, "left", 200);
      for (let gap of [200, 120, 80, 55]) await railWalk(app, expect, gap, gap + "ms");
      await railWalk(app, expect, 90, "90ms+real60ms", 60);
    },
  },
  {
    name: "N03 rail: a duplicate keydown in the same instant is one step; Down then Up in the same instant are both applied",
    async run({ open, expect }) {
      let app = await open();
      await app.tick(2000);
      let s = await railTo(app, expect, "home");
      await app.key("down", 0);
      await app.key("down", 150);
      s = await st(app);
      expect.eq(s.railRoute, "live", "Down x2 within 0 ms (echo) must move one item");
      await app.key("down", 30);
      await app.key("down", 150);
      s = await st(app);
      expect.eq(s.railRoute, "movies", "Down x2 within 30 ms (echo) must move one item");
      await app.key("down", 0);
      await app.key("up", 150);
      s = await st(app);
      expect.eq(s.railRoute, "movies", "Down+Up in the same instant must cancel out");
      await app.key("down", 60);
      await app.key("down", 150);
      s = await st(app);
      expect.eq(s.railRoute, "settings", "Down x2 60 ms apart are two presses");
    },
  },
  {
    name: "N04 rail: held Down/Up (auto-repeat 35 keydowns at 50-100 ms) stops at the ends and never overshoots",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2000);
      let rand = rng(4);
      let s = await railTo(app, expect, "home");
      for (let dir of ["down", "up", "down"]) {
        let moves = 0;
        let prev = s.railIndex;
        for (let i = 0; i < 35; i++) {
          await app.key(dir, 50 + Math.floor(rand() * 51));
          s = await st(app);
          valid(expect, s, `held ${dir} #${i}`);
          expect(s.inRail, `held ${dir} #${i}: left the rail`);
          let d = Math.abs(s.railIndex - prev);
          expect(d <= 1, `held ${dir} #${i}: moved ${d} items in one keydown (${prev} -> ${s.railIndex})`);
          moves += d;
          prev = s.railIndex;
        }
        expect.eq(s.railIndex, dir === "down" ? s.railVisible.length - 1 : 0, `held ${dir} end index`);
        await app.tick(500);
        expect.eq((await st(app)).railIndex, s.railIndex, `focus drifted after releasing held ${dir}`);
      }
      expect.eq(s.route, "home", "route after holding keys in the rail");
    },
  },
  {
    name: "N05 rail: auto-repeat faster than the 50 ms echo guard (30/40/49 ms) - how many presses are dropped",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2000);
      for (let rate of [30, 40, 49, 50]) {
        let s = await railTo(app, expect, "continue");
        let moved = 0;
        for (let i = 0; i < 8; i++) {
          let b = s.railIndex;
          await app.key("down", rate);
          s = await st(app);
          valid(expect, s, `repeat ${rate}ms #${i}`);
          moved += s.railIndex - b;
        }
        note.push(`auto-repeat every ${rate} ms: 8 keydowns moved ${moved} items`);
        expect(moved >= 4, `repeat ${rate} ms: only ${moved}/8 presses applied`);
      }
    },
  },
  {
    name: "N06 rail: Right from every item opens that route with focus in its content; Left returns to the same item",
    allowErrors: /iptv-org|Failed to fetch|ERR_|net::/i,
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      let timing = [];
      for (let route of RAIL) {
        await railTo(app, expect, route);
        await app.key("right", 0);
        let { s, ms } = await waitFor(app, (s) => s.route === route && !s.inRail, 2500);
        let hasContent = await contentFocusables(app);
        valid(expect, s, `Right on ${route}`);
        expect.eq(s.route, route, "route after Right on " + route);
        if (hasContent) {
          expect(ms !== null, `Right on ${route}: focus still in the rail after 2.5 s although content has ${hasContent} focusables`);
          timing.push(`${route}:${ms}ms`);
          await app.tick(400);
          s = await press(app, expect, "left", 300, "Left back from " + route);
          for (let i = 0; i < 6 && !s.inRail; i++) s = await press(app, expect, "left", 300, "Left back from " + route);
          expect(s.inRail, `Left from ${route} content never reached the rail`);
          expect.eq(s.railRoute, route, `Left from ${route} content should return to its rail item`);
        } else {
          timing.push(`${route}:no-content`);
          expect(s.inRail && s.railRoute === route, `Right on ${route} with no content: focus should stay on ${route}, got ${s.cls}`);
        }
      }
      note.push("virtual ms from Right to focus-in-content: " + timing.join(" "));
    },
  },
  {
    name: "N07 rail: OK then Back on every item",
    allowErrors: /iptv-org|Failed to fetch|ERR_|net::/i,
    async run({ open, expect }) {
      let app = await open();
      await app.tick(2500);
      for (let route of RAIL) {
        let s = await railTo(app, expect, route);
        s = await press(app, expect, "ok", 800, "OK on " + route);
        expect.eq(s.route, route, "route after OK on " + route);
        s = await press(app, expect, "back", 300, "Back on " + route);
        expect(s.inRail, `Back on ${route}: focus should be in the rail, got ${s.cls}`);
        expect.eq(s.railRoute, route, "Back at a root route focuses its rail item");
        s = await press(app, expect, "back", 150);
        s = await press(app, expect, "back", 150);
        expect.eq(s.railRoute, route, "repeated Back at a root route stays put");
      }
    },
  },
  {
    name: "N08 rail: a Right echo (two keydowns within 50 ms) enters content exactly one step",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(3000);
      let s = await railTo(app, expect, "home");
      await app.key("right", 300);
      let single = await st(app);
      expect(!single.inRail, "single Right from Home rail item should reach content");
      await railTo(app, expect, "home");
      await app.key("right", 20);
      await app.key("right", 300);
      let echo = await st(app);
      note.push(`single Right -> ${single.cls} "${single.label}" rect=${single.rect}; echoed Right -> ${echo.cls} "${echo.label}" rect=${echo.rect}`);
      // Same element: class and label match and the box is within a few pixels (the focus
      // scale animation runs in real time, so a 1 px difference is not a second step).
      let nums = (r) => String(r).split(",").map(Number);
      let near = (a, b) => {
        let x = nums(a),
          y = nums(b);
        return x.length === y.length && x.every((v, k) => isFinite(v) && Math.abs(v - y[k]) <= 3);
      };
      // (Position is not compared: the screen slides back as the menu closes, in real time,
      // so the same button can be measured mid-slide. Same class and label = same button.)
      expect(
        echo.cls === single.cls && echo.label === single.label,
        `echoed Right moved two steps: single press lands on "${single.label}" (${single.rect}), echo lands on "${echo.label}" (${echo.rect})`,
      );
    },
  },
  {
    name: "N09 OK echo: two OK keydowns within 50 ms on a movie card open Details once (not the player)",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await railTo(app, expect, "movies");
      await app.key("right", 1500);
      let { s } = await waitFor(app, (s) => s.cls && /category-button/.test(s.cls), 2000);
      s = await press(app, expect, "right", 400);
      expect(/card/.test(s.cls), "focus should be on a movie card, got " + s.cls);
      await app.key("ok", 20);
      await app.key("ok", 1200);
      s = await st(app);
      valid(expect, s, "after OK echo");
      expect.eq(s.route, "details", "route after an echoed OK on a movie card");
    },
  },
  {
    name: "N10 Back from Home content focuses the Home rail item (not the item remembered from boot)",
    config: { latencyMs: 300 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 0 });
      let seen = [];
      for (let t = 0; t < 3000; t += 100) {
        await app.tick(100);
        let s = await st(app);
        let tag = s.inRail ? "rail:" + s.railRoute : s.cls;
        if (seen[seen.length - 1] !== tag) seen.push(tag);
      }
      note.push("focus during boot: " + seen.join(" -> "));
      let s = await st(app);
      expect(!s.inRail, "after boot focus should be in Home content, got " + s.cls);
      s = await press(app, expect, "back", 300);
      expect(s.inRail, "Back from Home content should focus the rail");
      expect.eq(s.railRoute, "home", "rail item focused by Back on Home");
    },
  },
  {
    name: "N11 slow provider: after Right, the user moves back into the rail; the late content load must not steal focus",
    config: { latencyMs: 1000 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 6000 });
      let s = await railTo(app, expect, "live");
      await app.key("right", 200); // route renders, categories still loading
      s = await st(app);
      valid(expect, s, "right while loading");
      note.push(`200 ms after Right on Live: route=${s.route} focus=${s.inRail ? "rail:" + s.railRoute : s.cls}`);
      await sleep(400); // let the rail finish collapsing (see N31 for what happens if not)
      if (!s.inRail) await app.key("left", 200);
      s = await press(app, expect, "down", 200);
      s = await press(app, expect, "down", 200);
      let chosen = s.railRoute;
      expect.eq(chosen, "series", "user's rail position after Down Down");
      let path = [];
      for (let t = 0; t < 4000; t += 100) {
        await app.tick(100);
        let x = await st(app);
        valid(expect, x, "waiting t=" + t);
        let tag = x.inRail ? "rail:" + x.railRoute : x.cls;
        if (path[path.length - 1] !== tag) path.push(`${t}ms ${tag}`);
      }
      note.push("focus while the user rests on the rail: " + path.join(" -> "));
      s = await st(app);
      expect(s.inRail && s.railRoute === chosen, `late load stole focus from rail:${chosen} to ${s.cls} "${s.label}"`);
    },
  },
  {
    name: "N12 slow provider at boot: Down pressed before Home data arrives",
    config: { latencyMs: 1500 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 400 });
      let s0 = await st(app);
      note.push(`400 ms after load: focus=${s0.inRail ? "rail:" + s0.railRoute : s0.cls} railExpanded=${await app.eval("!!document.querySelector('.rail.expanded')")}`);
      let s = await press(app, expect, "down", 200);
      note.push(`after Down: focus=${s.inRail ? "rail:" + s.railRoute : s.cls}`);
      await app.tick(6000);
      s = await st(app);
      valid(expect, s, "after data arrives");
      note.push(`after data: route=${s.route} focus=${s.inRail ? "rail:" + s.railRoute : s.cls}`);
      expect.eq(s.route, "home", "route");
      expect(!s0.inRail, `before any data, Home put focus in the rail (${s0.railRoute}) - Down then walks the menu instead of the page`);
    },
  },
  {
    name: "N13 slow provider: rapid Right/Left/Down across sections while each is loading",
    config: { latencyMs: 800 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 5000 });
      let rand = rng(13);
      await toRail(app, expect);
      let lastRight = null;
      let seq = [];
      for (let i = 0; i < 60; i++) {
        let s = await st(app);
        let k = s.inRail ? (rand() < 0.45 ? "right" : rand() < 0.5 ? "down" : "up") : rand() < 0.6 ? "left" : ["down", "right", "up"][Math.floor(rand() * 3)];
        if (k === "right" && s.inRail) lastRight = s.railRoute;
        let gap = [60, 120, 250][Math.floor(rand() * 3)];
        seq.push(k + "+" + gap);
        s = await press(app, expect, k, gap, `step ${i} (${seq.slice(-12).join(" ")})`);
        expect(KNOWN_ROUTES.has(s.route), "route");
      }
      // Let everything land, then the screen must be a coherent one.
      await app.tick(5000);
      let s = await st(app);
      valid(expect, s, "after settle");
      let railCurrent = await app.eval("(document.querySelector('.rail-item.current')||{}).getAttribute ? document.querySelector('.rail-item.current').getAttribute('data-route') : null");
      expect.eq(railCurrent, s.route, "rail .current marker matches the route");
      note.push(`final route=${s.route} focus=${s.inRail ? "rail:" + s.railRoute : s.cls} lastRight=${lastRight}`);
    },
  },
  {
    name: "N14 Home content: Down/Up move one row per press; held Down reaches the bottom with focus on screen",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(4000);
      let s = await st(app);
      expect(!s.inRail, "boot focus in Home content");
      let rowOf = () => app.eval(`(function(){var n=document.querySelector('.focused');var r=n&&n.closest('.row, .hero');if(!r)return -1;return Array.prototype.indexOf.call(r.parentNode.children, r)})()`);
      let path = [await rowOf()];
      for (let i = 0; i < 40; i++) {
        let before = path[path.length - 1];
        s = await press(app, expect, "down", 90, "held down " + i);
        expect(!s.inRail, "Down in Home content went to the rail");
        let row = await rowOf();
        expect(row - before <= 1 || before === -1, `Down #${i} skipped rows: ${before} -> ${row}`);
        path.push(row);
      }
      await app.tick(1000);
      s = await st(app);
      expect(s.onScreen, "focus off-screen at bottom of Home: rect=" + s.rect);
      let bottom = path[path.length - 1];
      for (let i = 0; i < 40; i++) {
        let before = path[path.length - 1];
        s = await press(app, expect, "up", 90, "held up " + i);
        let row = await rowOf();
        expect(before - row <= 1 || row === -1, `Up #${i} skipped rows: ${before} -> ${row}`);
        path.push(row);
      }
      await app.tick(1000);
      s = await st(app);
      expect(s.onScreen, "focus off-screen at top of Home: rect=" + s.rect);
      note.push(`row index path: ${path.join(",")}; bottom row ${bottom}`);
    },
  },
  {
    name: "N15 Live list: held Down through 120 channels steps exactly +1 each keydown, focus stays on screen",
    config: { channelsPerCategory: 120 },
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await railTo(app, expect, "live");
      await app.key("right", 1500);
      let s = await st(app);
      expect(/category-button/.test(s.cls), "Right on Live focuses a category, got " + s.cls);
      s = await press(app, expect, "right", 300);
      expect(/channel-row/.test(s.cls), "Right from category focuses a channel row, got " + s.cls);
      expect.eq(s.idx, 0, "first channel");
      let rand = rng(15);
      for (let i = 0; i < 130; i++) {
        let b = s.idx;
        s = await press(app, expect, "down", 50 + Math.floor(rand() * 40), "channel down " + i);
        expect(/channel-row/.test(s.cls), `channel down #${i} left the list: ${s.cls}`);
        expect.eq(s.idx, Math.min(119, b + 1), `channel down #${i} index`);
        if (i % 10 === 9) {
          await sleep(350); // the list scrolls with a real-time CSS transition
          s = await st(app);
          expect(s.onScreen, `channel ${s.idx} off-screen after the scroll settled, rect=${s.rect}`);
        }
      }
      for (let i = 0; i < 20; i++) {
        let b = s.idx;
        s = await press(app, expect, "up", 60, "channel up " + i);
        expect.eq(s.idx, b - 1, `channel up #${i} index`);
      }
    },
  },
  {
    name: "N16 Movies grid: Down is one row (+5), Right is +1, categories Down is +1 with the list refreshing",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await railTo(app, expect, "movies");
      await app.key("right", 1500);
      let s = await st(app);
      expect(/category-button/.test(s.cls), "Right on Movies focuses a category, got " + s.cls);
      if (s.idx === null) s = await press(app, expect, "down", 150, "from Search Movies to first category"); // category-search button
      expect.eq(s.idx, 0, "first real category");
      for (let i = 0; i < 4; i++) {
        let b = s.idx;
        s = await press(app, expect, "down", 120, "category down " + i);
        expect.eq(s.idx, b + 1, "category index");
      }
      await app.tick(1000);
      s = await press(app, expect, "right", 400);
      expect(/card/.test(s.cls), "Right from category into grid, got " + s.cls);
      note.push(`Right from category ${await app.eval("(function(){var n=document.querySelector('.category-button.active');return n&&n.getAttribute('data-index')})()")} lands on grid card ${s.idx} (geometric: the card beside it)`);
      for (let i = 0; i < 4; i++) {
        let b = s.idx;
        s = await press(app, expect, "down", 120, "grid down " + i);
        expect.eq(s.idx, b + 5, "grid down index");
      }
      for (let i = 0; i < 4; i++) {
        let b = s.idx;
        s = await press(app, expect, "right", 120, "grid right " + i);
        expect.eq(s.idx, b + 1, "grid right index");
      }
    },
  },
  monkey(101, 900),
  monkey(202, 900),
  monkey(303, 900, { latencyMs: 400 }),
  monkey(404, 900, { names: "weird", images: "fail" }),
  {
    name: "N18 language: cycle all 6 languages from Settings; labels, dir, focus and single-step rail; persists after reload",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await railTo(app, expect, "settings");
      await app.key("right", 800);
      let s = await st(app);
      expect.eq(s.key, "language", "Right on Settings focuses the language row");
      let order = ["ar", "es", "fr", "tr", "de", "en"];
      for (let code of order) {
        s = await st(app);
        if (s.key !== "language") {
          await toRail(app, expect);
          await railTo(app, expect, "settings");
          await app.key("right", 800);
          s = await st(app);
        }
        expect.eq(s.key, "language", "focus on language row before OK");
        s = await press(app, expect, "ok", 600, "OK language -> " + code);
        expect.eq(s.route, "settings", "still on settings");
        expect.eq(await app.storage("iptv:language"), code, "stored language");
        expect.eq(s.dir === "rtl", code === "ar", `html dir for ${code} is ${s.dir}`);
        let labels = await app.eval(`Array.prototype.map.call(document.querySelectorAll('.rail-item'), function(n){ return n.getAttribute('data-route') + '=' + n.querySelector('.rail-label').textContent; })`);
        if (MESSAGES && MESSAGES[code]) {
          for (let l of labels) {
            let [id, text] = l.split("=");
            expect.eq(text, MESSAGES[code]["nav." + id], `rail label ${id} in ${code}`);
          }
        }
        let raw = await app.eval(`(document.body.innerText.match(/\\b(nav|home|settings|player|details|search|live|common|welcome|login)\\.[a-z][A-Za-z]+\\b/g) || []).slice(0, 8)`);
        expect(!raw.length, `raw i18n keys visible in ${code}: ${raw.join(", ")}`);
        expect(s.key === "language", `after switching to ${code} focus should stay on the language row, got ${s.key || s.cls}`);
        // Rail still single-step in this language.
        await app.key("left", 300);
        s = await st(app);
        expect(s.inRail, `Left from settings in ${code} reaches the rail, got ${s.cls}`);
        for (let i = 0; i < 3; i++) {
          let b = s.railIndex;
          s = await press(app, expect, "up", 120, `${code} rail up`);
          expect.eq(s.railIndex, b - 1, `${code} rail up single-step`);
        }
        for (let i = 0; i < 3; i++) {
          let b = s.railIndex;
          s = await press(app, expect, "down", 120, `${code} rail down`);
          expect.eq(s.railIndex, b + 1, `${code} rail down single-step`);
        }
        expect.eq(s.railRoute, "settings", "back on settings rail item");
        await app.key("right", 600);
      }
      // Pick Arabic and reload.
      await press(app, expect, "ok", 600, "OK -> ar");
      expect.eq(await app.storage("iptv:language"), "ar", "stored ar");
      await app.reload(3000);
      s = await st(app);
      valid(expect, s, "after reload");
      expect.eq(s.dir, "rtl", "dir after reload in Arabic");
      if (MESSAGES) expect.eq(await app.text('.rail-item[data-route="home"] .rail-label'), MESSAGES.ar["nav.home"], "Arabic Home label after reload");
    },
  },
  {
    name: "N19 RTL (Arabic boot): rail single-step, Right into content and Left back, on Home/Live/Movies",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: { ...(await import("../lib.mjs")).signedIn(server), "iptv:language": "ar" } });
      await app.tick(2500);
      let s = await st(app);
      expect.eq(s.dir, "rtl", "dir");
      await railWalk(app, expect, 120, "rtl");
      let railSide = await app.eval("Math.round(document.querySelector('nav.rail').getBoundingClientRect().left)");
      note.push("rail left edge in RTL: " + railSide + "px (the rail stays on the left in Arabic)");
      for (let route of ["home", "live", "movies"]) {
        await railTo(app, expect, route);
        await app.key("right", 1500);
        s = await st(app);
        valid(expect, s, "rtl right " + route);
        expect(!s.inRail, `RTL Right on ${route}: focus stayed in rail`);
        // In RTL the categories sit on the right, so Left walks through the grid first.
        let lefts = 0;
        for (; lefts < 10 && !s.inRail; lefts++) {
          await sleep(60);
          s = await press(app, expect, "left", 300);
        }
        note.push(`RTL ${route}: ${lefts} Left presses from the first focus to the rail`);
        expect.eq(s.railRoute, route, `RTL Left back to ${route}`);
      }
    },
  },
  {
    name: "N20 pointer: hover focuses rail items, a resting pointer does not move focus, click activates, keys continue single-step",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      for (let route of RAIL) {
        let c = await center(app, `.rail-item[data-route="${route}"]`);
        await mouse(app, "mousemove", c.x, c.y);
        await app.tick(60);
        let s = await st(app);
        valid(expect, s, "hover " + route);
        expect.eq(s.railRoute, route, "hover focuses rail item");
      }
      // Pointer rests on "movies"; keys move focus; content changes under the pointer.
      let c = await center(app, '.rail-item[data-route="movies"]');
      await mouse(app, "mousemove", c.x, c.y);
      let s = await press(app, expect, "down", 150);
      expect.eq(s.railRoute, "series", "Down after hover moves one item from the hovered one");
      await mouse(app, "mousemove", c.x, c.y); // Chromium re-sends at the same spot
      s = await st(app);
      expect.eq(s.railRoute, "series", "same-coordinate mousemove must not move focus");
      // Click activates.
      await mouse(app, "click", c.x, c.y);
      await app.tick(800);
      s = await st(app);
      valid(expect, s, "after click");
      expect.eq(s.route, "movies", "click on rail item navigates");
      // Hover over a card in content, then a key press.
      await app.tick(1000);
      // While focus is in the rail it is expanded to 300 px and covers the left of the
      // category column, so the pointer first visits a grid card (the rail collapses).
      let grid = await center(app, ".content .card");
      expect(grid, "a grid card to hover");
      await mouse(app, "mousemove", grid.x, grid.y);
      await sleep(400);
      let card = await center(app, '.content .category-button[data-index="0"]');
      note.push("hover target under the expanded rail: " + (await app.eval("Math.round(document.querySelector('nav.rail').getBoundingClientRect().width)")) + "px rail, category 0 centre x=" + (card && card.x));
      expect(card, "a category button to hover");
      await mouse(app, "mousemove", card.x, card.y);
      s = await st(app);
      expect(/category-button/.test(s.cls), "hover focuses category button, got " + s.cls);
      let b = s.idx;
      s = await press(app, expect, "down", 150);
      expect.eq(s.idx, b + 1, "Down after hovering a category moves one");
      // Hover over nothing focusable keeps focus.
      await mouse(app, "mousemove", 1900, 1070);
      let s2 = await st(app);
      expect.eq(s2.cls + s2.idx, s.cls + s.idx, "hover on a non-focusable area keeps focus");
      // Pointer on rail "settings", then pointer on content, then Back: rail item of current route.
      let set = await center(app, '.rail-item[data-route="settings"]');
      await mouse(app, "mousemove", set.x, set.y);
      await mouse(app, "mousemove", card.x, card.y + 1);
      s = await press(app, expect, "back", 300);
      note.push(`Back after hovering Settings then content on Movies focuses rail:${s.railRoute}`);
      expect.eq(s.railRoute, "movies", "Back should focus the current route's rail item");
    },
  },
  {
    name: "N21 leaks: 120 section changes through the rail; timers, intervals, DOM nodes, video elements",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(4000);
      let snap = () => app.eval(`({ p: __sim.clock.pending(), nodes: document.querySelectorAll('*').length, videos: document.querySelectorAll('video').length, heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null, listeners: 0 })`);
      await railTo(app, expect, "home");
      await app.key("ok", 3000);
      let a = await snap();
      let cycle = ["live", "movies", "series", "favorites", "continue", "search", "settings", "home"];
      let t0 = Date.now();
      for (let i = 0; i < 120; i++) {
        let route = cycle[i % cycle.length];
        await railTo(app, expect, route, 60);
        let s = await press(app, expect, i % 2 ? "ok" : "right", 350, `nav ${i} -> ${route}`);
        expect.eq(s.route, route, "route");
        if (i % 3 === 0) {
          await app.key("right", 200);
          await app.key("down", 200);
        }
      }
      let wall = Date.now() - t0;
      await railTo(app, expect, "home");
      await app.key("ok", 3000);
      let b = await snap();
      note.push(`start ${JSON.stringify(a)} end ${JSON.stringify(b)} (120 navigations, ${wall} ms wall)`);
      expect(b.p.intervals <= a.p.intervals + 2, `intervals grew ${a.p.intervals} -> ${b.p.intervals}`);
      expect(b.p.timers <= a.p.timers + 10, `pending timers grew ${a.p.timers} -> ${b.p.timers}`);
      expect(b.videos <= a.videos, `video elements grew ${a.videos} -> ${b.videos}`);
      expect(b.nodes <= a.nodes * 1.5 + 200, `DOM nodes grew ${a.nodes} -> ${b.nodes}`);
    },
  },
  {
    name: "N22 perf: wall-clock key -> focus-moved latency with big data (20x500 live, 20x300 movies)",
    config: { liveCategories: 20, channelsPerCategory: 500, vodCategories: 20, moviesPerCategory: 300 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 5000 });
      await app.eval(`(function(){
        window.__perf = { t0: 0, samples: [], frames: [] };
        window.addEventListener('keydown', function(){ __perf.t0 = performance.now(); }, true);
        document.addEventListener('focus-moved', function(){
          if (!__perf.t0) return; var t0 = __perf.t0; __perf.t0 = 0;
          __perf.samples.push(performance.now() - t0);
          requestAnimationFrame(function(){ requestAnimationFrame(function(){ __perf.frames.push(performance.now() - t0); }); });
        });
      })()`);
      let stats = (a) => {
        if (!a.length) return "n/a";
        let s = a.slice().sort((x, y) => x - y);
        let q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(1);
        return `n=${s.length} med=${q(0.5)} p95=${q(0.95)} max=${s[s.length - 1].toFixed(1)} ms`;
      };
      let measure = async (label, keys, gap = 150) => {
        await app.eval("__perf.samples = []; __perf.frames = []");
        let rt = [];
        for (let k of keys) {
          let t = performance.now();
          await app.key(k, 0);
          rt.push(performance.now() - t);
          await sleep(40);
          await app.tick(gap);
        }
        await sleep(100);
        let p = await app.eval("__perf");
        note.push(`${label}: handler ${stats(p.samples)}; to 2nd frame ${stats(p.frames)}; CDP round-trip ${stats(rt)}`);
        return p;
      };
      await measure("Home content Down/Up", ["down", "down", "down", "down", "up", "up", "up", "up", "down", "down", "down", "up", "up", "up"]);
      await measure("Home row Right", Array(20).fill("right"));
      await toRail(app, expect);
      await measure("Rail Down/Up", ["up", "up", "up", "up", "down", "down", "down", "down", "down", "down", "up", "up"]);
      await railTo(app, expect, "live");
      await measure("Rail Right -> Live (route render)", ["right"], 1500);
      let s = await st(app);
      await measure("Live categories Down (list refresh)", Array(12).fill("down"), 300);
      await measure("Live channels Right+Down", ["right"].concat(Array(40).fill("down")), 80);
      await toRail(app, expect);
      await railTo(app, expect, "movies");
      await measure("Rail Right -> Movies", ["right"], 1500);
      await measure("Movies grid Right+Down", ["right"].concat(Array(20).fill("down")), 100);
      s = await st(app);
      valid(expect, s, "end");
    },
  },
  {
    name: "N23 Back spam from deep screens: Home -> Details -> Player -> Back x12 at 80 ms",
    async run({ open, expect, note }) {
      let app = await open({ media: [{ match: "", startDelay: 300 }] });
      await app.tick(3000);
      await railTo(app, expect, "movies");
      await app.key("right", 1500);
      await app.key("right", 400);
      let s = await press(app, expect, "ok", 1500, "OK on movie card");
      expect.eq(s.route, "details", "details");
      s = await press(app, expect, "ok", 1500, "OK on details");
      note.push("after OK on Details: route=" + s.route + " focus=" + s.cls);
      let trail = [];
      for (let i = 0; i < 12; i++) {
        s = await press(app, expect, "back", 80, "back spam " + i);
        trail.push(s.route + (s.inRail ? ":rail" : ""));
      }
      await app.tick(2000);
      s = await st(app);
      valid(expect, s, "after back spam");
      note.push("back trail: " + trail.join(" "));
      expect.eq(s.route, "movies", "back spam ends on the root route");
      expect.eq(await app.eval("__sim.connectionCount()"), 0, "open stream connections after leaving the player");
      // Live channel -> player -> back spam
      await railTo(app, expect, "live");
      await app.key("right", 1500);
      await app.key("right", 400);
      await app.key("ok", 600);
      s = await st(app);
      if (s.route !== "player") await app.key("ok", 1500);
      s = await st(app);
      note.push("live OK -> route " + s.route);
      for (let i = 0; i < 12; i++) s = await press(app, expect, "back", 60, "live back spam " + i);
      await app.tick(2000);
      s = await st(app);
      valid(expect, s, "after live back spam");
      expect.eq(s.route, "live", "live back spam ends on Live");
    },
  },
  {
    name: "N24 Back spam at every root screen (25 presses, 40 ms) and from content",
    allowErrors: /iptv-org|Failed to fetch|ERR_|net::/i,
    async run({ open, expect }) {
      let app = await open();
      await app.tick(2500);
      for (let route of RAIL.filter((r) => r !== "freetv")) {
        await railTo(app, expect, route);
        await app.key("right", 1200);
        for (let i = 0; i < 25; i++) await press(app, expect, "back", 40, `${route} back ${i}`);
        let s = await st(app);
        expect(s.inRail && s.railRoute === route, `${route}: after back spam focus=${s.inRail ? "rail:" + s.railRoute : s.cls}`);
      }
    },
  },
  {
    name: "N25 edge: rail items hidden at runtime are skipped; the focused item becoming hidden recovers next to it",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await app.eval(`['movies','series'].forEach(function(r){ document.querySelector('.rail-item[data-route="'+r+'"]').hidden = true; })`);
      let s = await railTo(app, expect, "live");
      s = await press(app, expect, "down", 150);
      expect.eq(s.railRoute, "settings", "Down from Live skips hidden Movies/Series");
      s = await press(app, expect, "up", 150);
      expect.eq(s.railRoute, "live", "Up from Settings skips hidden items");
      await app.eval(`['movies','series'].forEach(function(r){ document.querySelector('.rail-item[data-route="'+r+'"]').hidden = false; })`);
      s = await railTo(app, expect, "movies");
      await app.eval(`document.querySelector('.rail-item[data-route="movies"]').hidden = true`);
      s = await press(app, expect, "down", 150, "down from hidden focused item");
      note.push("Down from a focused item that became hidden -> " + (s.inRail ? "rail:" + s.railRoute : s.cls));
      expect.eq(s.railRoute, "series", "Down from the (now hidden) Movies item should land on Series");
    },
  },
  {
    name: "N26 edge: Live - Down on categories then Right quickly; the list refresh removes the focused row; next Down",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await railTo(app, expect, "live");
      await app.key("right", 1500);
      let s = await st(app);
      expect(/category-button/.test(s.cls), "on a category");
      if (s.idx === null) {
        s = await press(app, expect, "down", 800, "search button -> category 0");
        expect.eq(s.idx, 0, "category 0");
      }
      await app.key("down", 60); // category 1 - list refresh is debounced 160 ms
      s = await press(app, expect, "right", 60, "right into old list");
      note.push(`Right 60 ms after Down: focus=${s.cls} idx=${s.idx}`);
      await app.tick(800);
      let s1 = await st(app);
      note.push(`after refresh: focusCount=${s1.focusCount} inDoc=${s1.inDoc} visible=${s1.visible} focus=${s1.cls}`);
      let p = problems(s1);
      s = await app.key("down", 150).then(() => st(app));
      note.push(`next Down -> ${s.inRail ? "rail:" + s.railRoute : s.cls} idx=${s.idx}`);
      expect(!p.length, "focus broken by the list refresh: " + p.join(", "));
      expect(/channel-row/.test(s.cls), `Down after the refresh should stay in the channel list, went to ${s.inRail ? "rail:" + s.railRoute : s.cls}`);
    },
  },
  {
    name: "N27 edge: focused card removed by a re-render, then Right recovers inside the same screen",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(3000);
      let s = await press(app, expect, "down", 400);
      s = await press(app, expect, "right", 400);
      expect(/card/.test(s.cls), "on a card");
      await app.eval("document.querySelector('.focused').remove()");
      await app.key("right", 200);
      s = await st(app);
      valid(expect, s, "after removed + Right");
      note.push("Right after the focused card was removed -> " + (s.inRail ? "rail:" + s.railRoute : s.cls));
      expect(!s.inRail, `recovery jumped to the rail (${s.railRoute}) instead of staying in Home content`);
    },
  },
  {
    name: "N28 edge: Right into empty Favourites / Continue; nothing steals focus later; rail stays single-step",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      for (let route of ["favorites", "continue"]) {
        let s = await railTo(app, expect, route);
        s = await press(app, expect, "right", 150);
        expect.eq(s.route, route, "route");
        expect.eq(await contentFocusables(app), 0, route + " is empty");
        expect(s.inRail && s.railRoute === route, "focus stays on the item");
        let b = s.railIndex;
        s = await press(app, expect, "down", 150);
        expect.eq(s.railIndex, b + 1, "Down after Right into empty screen");
        await app.tick(2500);
        s = await st(app);
        expect.eq(s.railIndex, b + 1, `focus moved on its own after Right into empty ${route}: ${s.cls}`);
      }
    },
  },
  {
    name: "N29 favourites: yellow removes the focused card, focus stays valid down to an empty page",
    async run({ open, expect, note, server }) {
      let favs = Array.from({ length: 4 }, (_, i) => ({ kind: "movie", id: 20000 + i, name: "Fav " + i, poster: null, categoryId: "200", ext: "mkv", addedAt: 1 }));
      let lib = await import("../lib.mjs");
      let app = await open({ storage: { ...lib.signedIn(server), "iptv:favorites": favs } });
      await app.tick(2500);
      await railTo(app, expect, "favorites");
      let s = await press(app, expect, "right", 400);
      expect(/card/.test(s.cls), "on a favourite card, got " + s.cls);
      s = await press(app, expect, "right", 200);
      let trail = [];
      for (let i = 0; i < 4; i++) {
        s = await press(app, expect, "yellow", 300, "remove fav " + i);
        trail.push(s.inRail ? "rail:" + s.railRoute : s.cls + "#" + s.idx);
      }
      note.push("focus after each removal: " + trail.join(" | "));
      expect(s.inRail && s.railRoute === "favorites", "after removing the last favourite focus should be on the Favourites rail item, got " + (s.inRail ? "rail:" + s.railRoute : s.cls));
    },
  },
  {
    name: "N30 rail: Right pressed twice slowly on Home item, then Left: no focus jump after the rail poller",
    config: { latencyMs: 500 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 5000 });
      let s = await railTo(app, expect, "movies");
      await app.key("right", 120); // Movies renders, categories 500 ms away
      s = await st(app);
      note.push("120 ms after Right on Movies: " + (s.inRail ? "rail:" + s.railRoute : s.cls));
      // User gives up waiting and walks to Series, then Right again
      await sleep(400); // rail collapse transition (N31 covers pressing Left sooner)
      if (!s.inRail) await app.key("left", 150);
      await app.key("down", 150);
      await app.key("right", 150);
      s = await st(app);
      note.push("after Down+Right to Series: route=" + s.route + " focus=" + (s.inRail ? "rail:" + s.railRoute : s.cls));
      await app.tick(3000);
      s = await st(app);
      valid(expect, s, "settled");
      expect.eq(s.route, "series", "route after the second Right");
      expect(!s.inRail, "focus should end in Series content");
      let owner = await app.eval("(function(){var n=document.querySelector('.focused');return n && document.querySelector('.content').contains(n)})()");
      expect(owner, "focus in current content");
    },
  },
  {
    name: "N31 rail collapse: Left pressed right after Right into content (rail still animating) must not be ignored",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      let results = [];
      for (let realDelay of [0, 60, 120, 400]) {
        await railTo(app, expect, "settings");
        await sleep(300);
        await app.key("right", 100);
        if (realDelay) await sleep(realDelay);
        let railW = await app.eval("Math.round(document.querySelector('nav.rail').getBoundingClientRect().width)");
        await app.key("left", 150);
        let s = await st(app);
        valid(expect, s, "left after right");
        results.push(`${realDelay} ms real after Right (rail ${railW}px wide): ${s.inRail ? "rail:" + s.railRoute : "IGNORED, focus stays on " + (s.key || s.cls)}`);
        if (!s.inRail) {
          await sleep(400);
          await app.key("left", 150);
        }
      }
      note.push(results.join(" | "));
      expect(!results.some((r) => /IGNORED/.test(r)), "Left ignored while the rail collapses: " + results.join(" | "));
    },
  },
  {
    name: "N32 first Left from Home content focuses the Home rail item (then Down goes to Live)",
    async run({ open, expect, note }) {
      let out = [];
      for (let downs of [0, 1]) {
        let app = await open();
        await app.tick(3000);
        let s = await st(app);
        for (let i = 0; i < downs; i++) s = await press(app, expect, "down", 400);
        let from = s.label;
        await sleep(300);
        s = await press(app, expect, "left", 300);
        let landed = s.inRail ? s.railRoute : s.cls;
        s = await press(app, expect, "down", 300);
        out.push(`Left from "${from}" -> ${landed}, then Down -> ${s.inRail ? s.railRoute : s.cls}`);
        await app.close();
      }
      note.push(out.join(" | "));
      expect(out.every((o) => /-> home, then Down -> live/.test(o)), "Left from Home content should land on the Home rail item: " + out.join(" | "));
    },
  },
  {
    name: "N33 search keyboard: OK on a keyboard language button (and on More...) keeps a focused element",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      await railTo(app, expect, "search");
      let s = await press(app, expect, "right", 600);
      for (let i = 0; i < 8 && !/kb-lang/.test(s.cls || ""); i++) s = await press(app, expect, "up", 150);
      expect(/kb-lang/.test(s.cls || ""), "reach a keyboard language button, got " + s.cls);
      let bad = [];
      for (let round = 0; round < 2; round++) {
        if (round === 1) {
          for (let i = 0; i < 12 && !/kb-lang-more/.test(s.cls || ""); i++) {
            await app.key("right", 150);
            s = await st(app);
            if (problems(s).length) break;
          }
        }
        let label = s.label;
        await app.key("ok", 200);
        s = await st(app);
        let p = problems(s);
        note.push(`OK on "${label}": focusCount=${s.focusCount} focus=${s.cls || "none"}`);
        if (p.length) {
          bad.push(`"${label}": ${p.join(", ")}`);
          s = await press(app, expect, "down", 150, "Down after focus was lost");
          note.push(`next Down recovers to ${s.inRail ? "rail:" + s.railRoute : s.cls}`);
          for (let i = 0; i < 8 && !/kb-lang/.test(s.cls || ""); i++) s = await press(app, expect, s.inRail ? "right" : "up", 300);
        }
      }
      expect(!bad.length, "focus lost after OK on keyboard language: " + bad.join(" | "));
    },
  },
  {
    name: "N34 Magic Remote: pointer resting on the rail plus a 2 px hand jitter after Down must not pull focus back",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      let c = await center(app, '.rail-item[data-route="live"]');
      await mouse(app, "mousemove", c.x, c.y);
      let s = await press(app, expect, "down", 150);
      expect.eq(s.railRoute, "movies", "Down from hovered Live");
      s = await press(app, expect, "down", 150);
      expect.eq(s.railRoute, "series", "second Down");
      await mouse(app, "mousemove", c.x + 2, c.y + 1);
      s = await st(app);
      note.push("2 presses Down from Live, then a 2 px pointer jitter -> rail:" + s.railRoute);
      expect.eq(s.railRoute, "series", "a tiny pointer jitter after key presses moved focus back to the item under the pointer");
    },
  },
  {
    name: "N35 Up from the top of Home (hero buttons) stays in the page instead of jumping into the rail",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(3000);
      let s = await st(app);
      expect(/hero-button/.test(s.cls || ""), "boot focus on the hero, got " + s.cls);
      let out = [];
      for (let k of [null, "right"]) {
        if (k) {
          app = await open();
          await app.tick(3000);
          await app.key(k, 300);
        }
        s = await st(app);
        let from = s.label;
        s = await press(app, expect, "up", 200);
        out.push(`Up from "${from}" -> ${s.inRail ? "rail:" + s.railRoute : s.cls}`);
        if (s.inRail) await app.key("right", 300);
      }
      note.push(out.join(" | "));
      expect(!out.some((o) => /rail:/.test(o)), "Up at the top of Home jumped into the rail: " + out.join(" | "));
    },
  },
  {
    name: "N36 Home at human pace with a 300 ms provider: no Down press is swallowed by a row that has not loaded yet",
    config: { latencyMs: 300 },
    async run({ open, expect, note }) {
      let app = await open({ settle: 6000 });
      let rowOf = () => app.eval(`(function(){var n=document.querySelector('.focused');var r=n&&n.closest('.row, .hero');if(!r)return -1;return Array.prototype.indexOf.call(r.parentNode.children, r)})()`);
      let total = await app.eval("document.querySelector('.page').children.length");
      let row = await rowOf();
      let swallowed = [];
      for (let i = 0; i < 16; i++) {
        await app.key("down", 350);
        await sleep(250);
        let s = await st(app);
        valid(expect, s, "home down " + i);
        let r = await rowOf();
        total = await app.eval("document.querySelector('.page').children.length");
        if (r === row && r < total - 1) {
          let next = await app.eval(`(function(){var p=document.querySelector('.page').children[${r + 1}];return p?p.querySelectorAll('.card').length:null})()`);
          swallowed.push(`#${i} at row ${r} (next row has ${next} cards)`);
        }
        row = r;
      }
      note.push(`Home has ${total} blocks; reached row ${row}; swallowed Down presses: ${swallowed.length}${swallowed.length ? " - " + swallowed.join(", ") : ""}`);
      expect(!swallowed.length, `${swallowed.length} Down presses did nothing because the next row was still empty: ${swallowed.join(", ")}`);
    },
  },
  {
    name: "N37 settings: OK on every settings row keeps a focused element on that row",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(2500);
      let rows = null;
      let out = [];
      let bad = [];
      for (let i = 1; i < 20; i++) {
        await toRail(app, expect);
        await railTo(app, expect, "settings");
        await sleep(300);
        let s = await press(app, expect, "right", 600);
        if (!rows) rows = await app.eval("Array.prototype.map.call(document.querySelectorAll('.settings-row'), function(n){ return n.__key; })");
        if (i >= rows.length) break;
        let key = rows[i];
        if (key === "signOut" || key === "clearCache") continue;
        // Settings remembers the row used last, so count from wherever Right landed.
        let at = rows.indexOf(s.key);
        for (let d = at < 0 ? 0 : at; d < i; d++) s = await press(app, expect, "down", 120);
        for (let d = at; d > i; d--) s = await press(app, expect, "up", 120);
        expect.eq(s.key, key, "focused settings row");
        for (let n = 0; n < 2; n++) {
          await app.key("ok", 400);
          s = await st(app);
          let p = problems(s);
          out.push(`${key} OK#${n + 1}: ${p.length ? p.join(",") : s.key === key ? "ok" : "focus on " + (s.key || s.cls)}`);
          if (p.length) {
            bad.push(`${key}: ${p.join(", ")}`);
            break;
          }
          if (s.route !== "settings" || s.trap) {
            await app.key("back", 500);
            break;
          }
        }
      }
      note.push(out.join(" | "));
      expect(!bad.length, "focus lost after OK on settings rows: " + bad.join(" | "));
    },
  },
];
