// Network and provider stress: sign-in, every endpoint misbehaving, intermittent faults,
// caching of bad answers, huge catalogues, weird names, sparse payloads, M3U and Free TV
// without internet. Never touches a TV - everything is the simulated provider.
//
// Uses server.mjs additions: fault bodies "html-ws" | "html-head" | "error-json" | "object",
// config.shape = "sparse", and the /m3u/{list,html,hang}.m3u playlist host.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SIGNED_OUT = { "iptv:language": "en" };

// ------------------------------------------------------------------ helpers

// Poll a page expression, advancing virtual time a little and letting real network land.
async function waitFor(app, js, realMs = 8000, tickMs = 50) {
  let end = Date.now() + realMs;
  for (;;) {
    let v = await app.eval(js).catch(() => null);
    if (v || Date.now() > end) return v;
    await app.tick(tickMs);
    await sleep(10);
  }
}
async function waitNode(app, fn, realMs = 8000, tickMs = 50) {
  let end = Date.now() + realMs;
  for (;;) {
    let v = fn();
    if (v || Date.now() > end) return v;
    await app.tick(tickMs);
    await sleep(10);
  }
}
const q = (s) => JSON.stringify(s);
const CATS = "document.querySelectorAll('.category-pane .category-button:not(.category-search)').length";
const ITEMS = "document.querySelectorAll('.channel-pane .channel-row, .channel-pane .card').length";
const PANE_TITLE = "((document.querySelector('.channel-pane .pane-title')||{}).textContent||'')";
const LOGIN_ERR = "((document.querySelector('.login-error')||{}).textContent||'')";
const SIGNIN_BTN = "((document.querySelector('.welcome-actions .button.primary')||{}).textContent||'')";
const PLOT = "((document.querySelector('.details-plot')||{}).textContent||'')";

function hits(server, action, pred) {
  return server.hits.filter((h) => h.action === action && (!pred || pred(h)));
}
function resetHits(server) {
  server.hits.length = 0;
}

async function goto(app, route) {
  await app.eval(`(function(){var r=document.querySelector('.rail-item[data-route=${q(route)}]'); if(r) r.click();})()`);
  await app.tick(400);
  if ((await app.state()).route !== route) {
    await app.eval(`__router.go(${q(route)}, {})`);
    await app.tick(400);
  }
}

async function focusSane(app, expect, label) {
  let s = await app.state();
  expect(s.focusCount === 1 && s.focusInDoc && s.focusVisible, `${label}: focus not usable ${JSON.stringify(s)}`);
  return s;
}

async function signIn(app, url, form = 0) {
  let st = await app.state();
  if (!(await app.eval("!!document.querySelector('.welcome-form:not([hidden])')"))) {
    await app.eval(`document.querySelectorAll('.welcome-option')[${form}].click()`);
    await app.tick(200);
  }
  if (form === 0)
    await app.eval(`(function(){var f=document.querySelectorAll('.welcome-form')[0].querySelectorAll('input');f[0].value=${q(url)};f[1].value='sim';f[2].value='sim';})()`);
  else await app.eval(`(function(){var f=document.querySelectorAll('.welcome-form')[1].querySelectorAll('input');f[0].value=${q(url)};})()`);
  await app.eval("document.querySelector('.welcome-actions .button.primary').click()");
  return st;
}

const portal = (server) => `http://127.0.0.1:${server.port}`;

async function openDetails(app, kind, id, name) {
  await app.eval(`__router.push('details', ${q({ kind, id, item: { kind, id, name, poster: null, ext: "mkv" } })})`);
  await app.tick(200);
}

async function search(app, text) {
  await app.eval(`(function(){var s=document.querySelector('.search-input'); s.value=${q(text)}; s.dispatchEvent(new Event('input'));})()`);
}
const SEARCH_STATE =
  "(function(){return {cards:document.querySelectorAll('.search-results .card').length, msg:Array.prototype.map.call(document.querySelectorAll('.empty'),function(n){return n.textContent}).join('|')}})()";

// Measures a catalogue: boot, hero, background index, Live TV, Movies, key latency, search.
async function measure({ open, server, note }, label) {
  resetHits(server);
  let t0 = Date.now();
  let app = await open({ settle: 0 });
  let r = { label, load: Date.now() - t0 };
  await waitFor(app, "document.querySelectorAll('.card').length > 0", 90000);
  r.firstCard = Date.now() - t0;
  await waitFor(app, "!!document.querySelector('.hero.hero-ready, .hero.hero-artless')", 90000);
  r.hero = Date.now() - t0;
  let liveCats = server.config.liveCategories;
  await waitNode(app, () => new Set(hits(server, "get_live_streams").map((h) => h.query.category_id)).size >= liveCats, 120000, 100);
  r.indexRequestsDone = Date.now() - t0;
  await app.tick(1500);
  r.bootRequests = server.hits.length;
  Object.assign(
    r,
    await app.eval(`(function(){var n=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);n+=k.length+(localStorage.getItem(k)||'').length}
      return {dom:document.getElementsByTagName('*').length, storageChars:n, heapMB: performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null}})()`),
  );

  // Live TV
  let t1 = Date.now();
  await goto(app, "live");
  await waitFor(app, ITEMS + " > 0", 60000);
  r.liveOpen = Date.now() - t1;
  r.liveDom = await app.eval("document.getElementsByTagName('*').length");

  // key latency on the category list and inside a channel list
  await app.eval(`(function(){ if (window.__hl) return; window.__hl=[]; window.__fl=[]; var kd=0;
    document.addEventListener('keydown', function(){ kd=performance.now(); requestAnimationFrame(function(){ requestAnimationFrame(function(){ __fl.push(performance.now()-kd); }); }); }, true);
    document.addEventListener('keydown', function(){ __hl.push(performance.now()-kd); }, false); })()`);
  let focusCat = await app.eval("(function(){var b=document.querySelector('.category-pane .category-button:not(.category-search)'); if(b) b.click(); return !!b})()");
  await app.tick(300);
  let rt = [];
  for (let i = 0; i < 12; i++) {
    let t = Date.now();
    await app.key("down", 0);
    await app.tick(200); // 160 ms category debounce, then the list fills
    rt.push(Date.now() - t);
  }
  r.catSwitchRealMs = Math.round(rt.reduce((a, b) => a + b, 0) / rt.length);
  await app.key("right", 200);
  let rt2 = [];
  for (let i = 0; i < 20; i++) {
    let t = Date.now();
    await app.key("down", 0);
    await app.tick(30);
    rt2.push(Date.now() - t);
  }
  r.rowStepRealMs = Math.round(rt2.reduce((a, b) => a + b, 0) / rt2.length);
  await sleep(100);
  let lat = await app.eval("({h:__hl.slice(), f:__fl.slice()})");
  let avg = (a) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null);
  let max = (a) => (a.length ? Math.round(Math.max.apply(null, a)) : null);
  r.keyHandlerAvgMs = avg(lat.h);
  r.keyHandlerMaxMs = max(lat.h);
  r.keyToFrameAvgMs = avg(lat.f);
  r.focusCatOk = focusCat;

  // Movies
  let t2 = Date.now();
  await goto(app, "movies");
  await waitFor(app, ITEMS + " > 0", 60000);
  r.moviesOpen = Date.now() - t2;
  r.moviesDom = await app.eval("document.getElementsByTagName('*').length");

  // Search (builds the full index over every category of every kind)
  await goto(app, "search");
  let t3 = Date.now();
  await search(app, "mbc");
  await waitFor(app, "document.querySelectorAll('.search-results .card').length > 0", 90000, 100);
  r.searchFirstResults = Date.now() - t3;
  r.heapAfterSearchMB = await app.eval("performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null");
  r.totalRequests = server.hits.length;
  note.push(label + ": " + JSON.stringify(r));
  return { app, r };
}

// ------------------------------------------------------------------ scenarios

export default [
  // ---------------------------------------------------------------- sign-in
  {
    name: "signin: good credentials reach Home with one auth request",
    async run({ open, expect, server }) {
      resetHits(server);
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      expect(await waitFor(app, "__router.current()==='home'"), "never reached home");
      expect.eq(hits(server, "auth").length, 1, "auth requests");
      expect((await app.storage("iptv:credentials")).username === "sim", "credentials not saved");
      await app.tick(2000);
      await focusSane(app, expect, "home after sign-in");
    },
  },
  {
    name: "signin: wrong password shows readable message, retry after fix succeeds",
    config: { auth: "fail" },
    async run({ open, expect, server }) {
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      let msg = await waitFor(app, LOGIN_ERR);
      expect.eq(msg, "Wrong username or password.", "error text");
      expect.eq(await app.eval(SIGNIN_BTN), "Sign in", "button label back");
      expect.eq((await app.state()).route, "welcome", "route");
      await focusSane(app, expect, "after failure");
      server.setConfig({});
      await app.eval("document.querySelector('.welcome-actions .button.primary').click()");
      expect(await waitFor(app, "__router.current()==='home'"), "second attempt did not reach home");
    },
  },
  {
    name: "signin: expired account says so",
    config: { auth: "expired" },
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      let msg = await waitFor(app, LOGIN_ERR);
      note.push("message: " + msg);
      expect(/expired/i.test(msg), "message does not mention expiry: " + msg);
    },
  },
  {
    name: "signin: failed sign-in must not leave the TV signed in after a restart",
    config: { auth: "fail" },
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      await waitFor(app, LOGIN_ERR);
      note.push("stored credentials after failure: " + JSON.stringify(await app.storage("iptv:credentials")));
      await app.reload(2000);
      let route = (await app.state()).route;
      note.push("route after restart: " + route);
      expect.eq(route, "welcome", "route after restarting the app following a failed sign-in");
    },
  },
  {
    name: "signin: portal answering an HTML page gives the offline message, not an internal code",
    config: { auth: "html" },
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      let msg = await waitFor(app, LOGIN_ERR);
      note.push("message: " + msg);
      expect(msg && !/__NOAPI__|Bad JSON/.test(msg), "user sees an internal error string: " + msg);
    },
  },
  {
    name: "signin: portal hangs - 20 s timeout, readable message, button usable, recovers",
    config: { faults: { auth: { body: "hang" } } },
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      await app.tick(5000);
      expect.eq(await app.eval(SIGNIN_BTN), "Connecting…", "button while waiting");
      await app.tick(16000);
      let msg = await waitFor(app, LOGIN_ERR, 5000);
      note.push("timeout message: " + msg);
      expect.eq(await app.eval(SIGNIN_BTN), "Sign in", "button label after timeout (stuck spinner?)");
      await focusSane(app, expect, "after timeout");
      server.setConfig({});
      await app.eval("document.querySelector('.welcome-actions .button.primary').click()");
      expect(await waitFor(app, "__router.current()==='home'"), "did not recover");
      expect(msg && !/abort/i.test(msg), "timeout message is a raw AbortError: " + msg);
    },
  },
  {
    name: "signin: HTTP 500 / bad JSON give readable messages and recover",
    config: { faults: { auth: { status: 500 } } },
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      let m1 = await waitFor(app, LOGIN_ERR);
      server.setConfig({ faults: { auth: { body: "badjson" } } });
      await app.eval("(function(){var e=document.querySelector('.login-error'); e.textContent='';})()");
      await app.eval("document.querySelector('.welcome-actions .button.primary').click()");
      let m2 = await waitFor(app, LOGIN_ERR);
      note.push("500 -> " + q(m1) + " ; badjson -> " + q(m2));
      server.setConfig({});
      await app.eval("document.querySelector('.welcome-actions .button.primary').click()");
      expect(await waitFor(app, "__router.current()==='home'"), "did not recover");
      expect(!/^HTTP \d+ for|^Bad JSON from/.test(m1) && !/^HTTP \d+ for|^Bad JSON from/.test(m2), "developer error strings shown to the viewer: " + m1 + " / " + m2);
    },
  },
  {
    name: "signin: pressing Sign in repeatedly while connecting sends one auth request",
    config: { latencyMs: 800 },
    async run({ open, expect, server }) {
      resetHits(server);
      let app = await open({ storage: SIGNED_OUT });
      await signIn(app, portal(server));
      for (let i = 0; i < 3; i++) {
        await app.eval("document.querySelector('.welcome-actions .button.primary').click()");
        await app.tick(50);
      }
      expect(await waitFor(app, "__router.current()==='home'", 10000), "never reached home");
      expect.eq(hits(server, "auth").length, 1, "auth requests");
    },
  },

  // ---------------------------------------------------------------- bad answers cached
  {
    name: "cache: live categories answering null once must not be cached as an empty list",
    config: { faults: { get_live_categories: { body: "null", times: 1 } } },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(3000);
      note.push("cached cats:live after the null answer: " + JSON.stringify(await app.storage("iptv:cache:cats:live")));
      await goto(app, "live");
      let n = await waitFor(app, CATS, 5000);
      note.push("categories on Live TV: " + n + ", requests: " + hits(server, "get_live_categories").length);
      await app.reload(3000);
      await goto(app, "live");
      let n2 = await waitFor(app, CATS, 5000);
      note.push("after restart: " + n2);
      expect(n > 0 && n2 > 0, "Live TV has no categories although the portal is fine again (empty list cached 24 h)");
    },
  },
  {
    name: "cache: portal error JSON {user_info:{auth:0}} for movie categories must not be cached",
    config: { faults: { get_vod_categories: { body: "error-json", times: 1 } } },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(3000);
      note.push("cached cats:vod: " + JSON.stringify(await app.storage("iptv:cache:cats:vod")));
      await goto(app, "movies");
      let n = await waitFor(app, CATS, 5000);
      expect(n > 0, "Movies has no categories (portal error object cached as [] for 24 h)");
    },
  },
  {
    name: "cache: movie info answering null once must not blank that movie for a week",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      server.setConfig({ faults: { get_vod_info: { body: "null", times: 1 } } });
      resetHits(server);
      await openDetails(app, "movie", "29990", "Probe movie");
      await app.tick(1500);
      let p1 = await app.eval(PLOT);
      await app.eval("__router.back()");
      await app.tick(300);
      await openDetails(app, "movie", "29990", "Probe movie");
      await app.tick(3000);
      let p2 = await app.eval(PLOT);
      let cached = await app.storage("iptv:cache:movieinfo:29990");
      note.push("plot 1st open: " + q(p1) + " 2nd open: " + q(p2) + " requests: " + hits(server, "get_vod_info").length);
      note.push("cache entry expires in days: " + (cached ? Math.round((cached.expires - (await app.sim("sim.clock.now()"))) / 864e5) : "none"));
      expect(p2.length > 0, "movie details stay empty after the portal recovered (null answer cached for a week)");
    },
  },

  // ---------------------------------------------------------------- browse screens
  {
    name: "live: a category whose streams failed can be retried with OK",
    config: { faults: { get_live_streams: { status: 500 } } },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      await goto(app, "live");
      let title = await waitFor(app, `/could not load/i.test(${PANE_TITLE}) && ${PANE_TITLE}`, 5000);
      note.push("pane title on failure: " + q(title));
      expect(title, "no failure message in the channel pane");
      await focusSane(app, expect, "live after stream failure");
      server.setConfig({});
      await app.eval("document.querySelector('.category-pane .category-button:not(.category-search)').click()");
      let viaOk = await waitFor(app, ITEMS + " > 0", 3000);
      note.push("items after OK on the failed category: " + viaOk);
      if (!viaOk) {
        await app.key("down", 400);
        await app.key("up", 600);
        note.push("items after moving away and back: " + (await waitFor(app, ITEMS + " > 0", 3000)));
      }
      expect(viaOk, "OK on the failed category does not retry (only moving to another category and back does)");
    },
  },
  {
    name: "live: categories failing shows a message and recovers by itself when the portal is back",
    config: { faults: { get_live_categories: { status: 500 } } },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      await goto(app, "live");
      let msg = await waitFor(app, `/could not load/i.test(${PANE_TITLE}) && ${PANE_TITLE}`, 5000);
      note.push("message: " + q(msg));
      expect(msg, "no message when categories fail");
      await focusSane(app, expect, "live with no categories");
      server.setConfig({});
      let n = await waitFor(app, CATS, 6000, 500);
      note.push("categories 3 s (virtual ~60 s) after recovery, no key pressed: " + n);
      if (!n) {
        await goto(app, "home");
        await goto(app, "live");
        note.push("after leaving and re-entering: " + (await waitFor(app, CATS, 4000)));
      }
      expect(n, "Live TV stays on 'Could not load categories.' until the viewer leaves and re-enters");
    },
  },
  {
    name: "live: EPG endpoint failing (500 / bad JSON / hang) does not break browsing or preview",
    config: { faults: { get_short_epg: { body: "badjson" } } },
    async run({ open, expect, server }) {
      let app = await open();
      await app.tick(2000);
      await goto(app, "live");
      await waitFor(app, ITEMS + " > 0");
      // put focus in the channel list (goto leaves it on the menu)
      await app.eval("(function(){var r=document.querySelector('.channel-pane .channel-row'); r && r.click();})()");
      await app.tick(1500); // the click is an OK: starts the preview
      for (let i = 0; i < 4; i++) await app.key("down", 400);
      server.setConfig({ faults: { get_short_epg: { status: 500 } } });
      await app.key("ok", 1500);
      await app.tick(2000);
      server.setConfig({ faults: { get_short_epg: { body: "hang" } } });
      await app.key("down", 400);
      await app.tick(22000);
      let s = await app.state();
      expect(["live", "player"].includes(s.route), "unexpected route " + s.route);
      await focusSane(app, expect, "live with EPG faults");
    },
  },

  // ---------------------------------------------------------------- details
  {
    name: "details: movie info hangs - times out, says so, retries and recovers",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      server.setConfig({ faults: { get_vod_info: { body: "hang" } } });
      await openDetails(app, "movie", "29999", "Probe movie");
      await app.tick(1000);
      expect.eq(await app.eval("document.querySelector('.details-title').textContent"), "Probe movie", "title from the list item while loading");
      await app.tick(20500);
      let msg = await app.eval(PLOT);
      note.push("after 21 s: " + q(msg));
      expect(msg.length > 0, "no message after the 20 s timeout");
      await focusSane(app, expect, "details during retry");
      server.setConfig({});
      let ok = await waitFor(app, `/مالطا/.test(${PLOT})`, 6000, 250);
      expect(ok, "details did not recover after the portal came back");
    },
  },
  {
    name: "details: provider intercept (HTML) shows offline message, recovers when the line is back",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      server.setConfig({ faults: { get_vod_info: { body: "html" } } });
      await openDetails(app, "movie", "29998", "Probe movie");
      let msg = await waitFor(app, `/internet/i.test(${PLOT}) && ${PLOT}`, 5000);
      note.push("message: " + q(msg));
      expect(msg, "offline message not shown for an HTML interception");
      server.setConfig({});
      expect(await waitFor(app, `/مالطا/.test(${PLOT})`, 8000, 250), "did not recover");
    },
  },
  {
    name: "details: captive-portal page with leading whitespace or <head> is recognised as offline",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      server.setConfig({ faults: { get_vod_info: { body: "html-ws" } } });
      await openDetails(app, "movie", "29997", "Probe movie");
      await app.tick(1000);
      let m1 = await app.eval(PLOT);
      await app.eval("__router.back()");
      await app.tick(300);
      server.setConfig({ faults: { get_vod_info: { body: "html-head" } } });
      await openDetails(app, "movie", "29996", "Probe movie");
      await app.tick(1000);
      let m2 = await app.eval(PLOT);
      note.push("whitespace+<!DOCTYPE>: " + q(m1) + " ; <head>: " + q(m2));
      expect(/internet/i.test(m1), "HTML page starting with whitespace not detected as interception (regex /^s*</ lacks a backslash)");
      expect(/internet/i.test(m2), "HTML page starting with <head> not detected as interception");
    },
  },
  {
    name: "details: series info bad JSON twice, then episodes render",
    async run({ open, expect, server }) {
      let app = await open();
      await app.tick(2000);
      server.setConfig({ faults: { get_series_info: { body: "badjson", times: 2 } } });
      await openDetails(app, "series", "39999", "Probe series");
      expect(await waitFor(app, "document.querySelectorAll('.episode-row').length > 0", 8000, 250), "episodes never rendered");
      await focusSane(app, expect, "series details");
    },
  },

  // ---------------------------------------------------------------- boot outages
  {
    name: "boot: whole line intercepted (every action HTML) - Home says so and fills in when the line returns",
    config: { faults: { "*": { body: "html" } } },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(5000);
      let info = await app.eval("({artless:!!document.querySelector('.hero.hero-artless'), cards:document.querySelectorAll('.card').length, offlineText:/internet/i.test(document.body.innerText)})");
      note.push("during outage: " + JSON.stringify(info));
      await focusSane(app, expect, "home during outage");
      let emptyCached = await app.eval("Object.keys(localStorage).filter(function(k){return k.indexOf('iptv:cache:')===0 && /^\\{\"value\":\\[\\]/.test(localStorage.getItem(k))})");
      expect.eq(emptyCached, [], "empty lists cached during the outage");
      server.setConfig({});
      let cards = await waitFor(app, "document.querySelectorAll('.card').length", 6000, 500);
      note.push("cards ~60 s virtual after the line returned, no key pressed: " + cards);
      expect(info.offlineText, "Home shows no 'no internet' message during the outage");
      expect(cards > 0, "Home stays empty after the line returns (no retry)");
    },
  },
  {
    name: "boot: intermittent - each endpoint fails twice (500) - Home recovers without user action",
    config: { faults: { "*": { status: 500, times: 2 } } },
    async run({ open, expect, server, note }) {
      resetHits(server);
      let app = await open();
      let cards = await waitFor(app, "document.querySelectorAll('.card').length", 6000, 500);
      let counts = {};
      for (let h of server.hits) counts[h.action] = (counts[h.action] || 0) + 1;
      note.push("cards after ~60 s virtual: " + cards + " ; requests: " + JSON.stringify(counts));
      expect(cards > 0, "Home stays empty after a transient failure at boot (no retry)");
    },
  },
  {
    name: "index: live categories failing once at boot - channel index is still built later",
    config: { faults: { get_live_categories: { status: 500, times: 1 } } },
    async run({ open, expect, server, note }) {
      resetHits(server);
      let app = await open();
      await app.tick(3000);
      await goto(app, "live");
      await waitFor(app, ITEMS + " > 0", 5000);
      // the app retries a failed index build after 60 s; give it 70 s of virtual time, in
      // slices so the real requests can land
      for (let i = 0; i < 14; i++) {
        await app.eval("__sim.clock.tick(5000, 250)");
        await sleep(150);
      }
      let cats = new Set(hits(server, "get_live_streams").map((h) => h.query.category_id));
      note.push("live categories requested (index needs all 6): " + [...cats].join(","));
      expect(cats.size >= 6, "channelsByName index never retried after one failure (gn stays a rejected promise)");
    },
  },

  // ---------------------------------------------------------------- latency & duplicates
  {
    name: "latency 1.5 s: no duplicate requests; Live TV not blocked by the boot index",
    config: { latencyMs: 1500 },
    async run({ open, expect, server, note }) {
      resetHits(server);
      let t0 = Date.now();
      let app = await open({ settle: 0 });
      await waitFor(app, "__router.current()==='home'", 10000);
      let t1 = Date.now();
      await goto(app, "live");
      await waitFor(app, ITEMS + " > 0", 30000, 25);
      let liveMs = Date.now() - t1;
      await waitNode(app, () => new Set(hits(server, "get_live_streams").map((h) => h.query.category_id)).size >= 6, 30000, 100);
      await sleep(2000);
      await app.tick(500);
      let per = {};
      for (let h of server.hits) {
        let k = h.action + ":" + (h.query.category_id || h.query.vod_id || h.query.series_id || "");
        per[k] = (per[k] || 0) + 1;
      }
      let dups = Object.entries(per).filter(([, n]) => n > 1);
      note.push(`Live TV first channels ${liveMs} ms after opening (boot->home ${t1 - t0} ms); total requests ${server.hits.length}; vod_info at boot ${hits(server, "get_vod_info").length}`);
      note.push("duplicates: " + JSON.stringify(dups));
      expect.eq(dups, [], "duplicate requests");
    },
  },

  // ---------------------------------------------------------------- scale
  {
    name: "perf: baseline catalogue timings",
    async run(ctx) {
      let { r } = await measure(ctx, "baseline(6x24 live, 5x30 vod)");
      ctx.expect(r.keyHandlerMaxMs == null || r.keyHandlerMaxMs < 200, "slow key handler");
    },
  },
  {
    name: "perf: huge catalogue (30x2000 live, 30x1000 vod, 10x300 series)",
    config: { liveCategories: 30, channelsPerCategory: 2000, vodCategories: 30, moviesPerCategory: 1000, seriesCategories: 10, seriesPerCategory: 300 },
    async run(ctx) {
      let { r } = await measure(ctx, "huge");
      ctx.expect(r.keyHandlerMaxMs == null || r.keyHandlerMaxMs < 200, "a key press blocked the page for " + r.keyHandlerMaxMs + " ms");
      ctx.expect(r.liveOpen < 5000 && r.moviesOpen < 5000, "opening a screen took more than 5 s");
    },
  },
  {
    name: "storage: localStorage full - caching degrades gracefully; cache eviction frees room",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(2000);
      let filled = await app.eval(`(function(){
        Object.keys(localStorage).forEach(function(k){ if(k.indexOf('iptv:cache:')===0) localStorage.removeItem(k); });
        var big='x'.repeat(256*1024), i=0, j=0; try{for(;;){localStorage.setItem('junk'+i,big);i++;}}catch(e){}
        var small='x'.repeat(512); try{for(;;){localStorage.setItem('junks'+j,small);j++;}}catch(e){}
        return i+' big, '+j+' small'; })()`);
      note.push("filled: " + filled);
      await app.reload(3000);
      await goto(app, "live");
      expect((await waitFor(app, CATS, 5000)) > 0, "no live categories with storage full");
      await goto(app, "movies");
      expect((await waitFor(app, ITEMS + " > 0", 5000)) > 0, "no movies with storage full");
      // now make the room taken by expired cache entries: eviction should make room
      await app.eval(`(function(){ Object.keys(localStorage).forEach(function(k){ if(k.indexOf('junk')===0) localStorage.removeItem(k); });
        var v=JSON.stringify({value:'x'.repeat(200*1024),expires:1}), i=0; try{for(;;){localStorage.setItem('iptv:cache:old'+i,v);i++;}}catch(e){}
        var small='x'.repeat(256); try{for(var j=0;;j++){localStorage.setItem('junks'+j,small);}}catch(e){}
        Object.keys(localStorage).forEach(function(k){ if(/^iptv:cache:cats:/.test(k)) localStorage.removeItem(k); }); return i; })()`);
      await app.reload(3000);
      await goto(app, "series");
      await waitFor(app, CATS, 5000);
      let stored = await app.eval("!!localStorage.getItem('iptv:cache:cats:series')");
      note.push("series categories persisted after eviction: " + stored);
      expect(stored, "cache eviction did not make room for new entries");
    },
  },

  // ---------------------------------------------------------------- names / images
  {
    name: "names: weird names - no XSS, focus visible, Arabic/emoji search works",
    config: { names: "weird" },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(4000);
      expect((await app.eval("typeof window.__xss")) === "undefined", "XSS executed on Home");
      await goto(app, "live");
      await waitFor(app, ITEMS + " > 0");
      await app.key("right", 400);
      for (let i = 0; i < 12; i++) {
        await app.key("down", 150);
        let s = await app.state();
        expect(s.focusVisible && s.focusCount === 1, "focus lost at row " + i + " " + JSON.stringify(s));
      }
      let width = await app.eval("document.documentElement.scrollWidth");
      note.push("page scrollWidth with 300-char names: " + width);
      await goto(app, "movies");
      await waitFor(app, ITEMS + " > 0");
      await goto(app, "search");
      await search(app, "مرحبا"); // a series name the weird generator keeps ("مسلسل…" is never emitted)
      await waitFor(app, "document.querySelectorAll('.search-results .card').length > 0", 15000, 100);
      let ar = await app.eval(SEARCH_STATE);
      await search(app, "💥🎬");
      await app.tick(800);
      let emo = await app.eval(SEARCH_STATE);
      await search(app, "emoji");
      await app.tick(800);
      let emoWord = await app.eval(SEARCH_STATE);
      note.push("arabic: " + JSON.stringify(ar) + " emoji: " + JSON.stringify(emo) + " 'emoji': " + JSON.stringify(emoWord));
      expect(ar.cards > 0, "Arabic search found nothing");
      expect((await app.eval("typeof window.__xss")) === "undefined", "XSS executed");
      expect(width <= 1920, "page scrolls horizontally: " + width);
    },
  },
  {
    name: "images: every image fails - hero falls back, rows render, no errors",
    config: { images: "fail" },
    async run({ open, expect, server, note }) {
      resetHits(server);
      let app = await open();
      let artless = await waitFor(app, "!!document.querySelector('.hero.hero-artless')", 10000, 200);
      note.push("vod_info requests spent looking for hero art: " + hits(server, "get_vod_info").length);
      expect(artless, "hero never fell back to artless");
      expect((await app.eval("document.querySelectorAll('.card').length")) > 0, "no cards");
      await focusSane(app, expect, "home with no images");
    },
  },

  // ---------------------------------------------------------------- cache behaviour
  {
    name: "cache: restart serves categories from storage (request budget per boot)",
    async run({ open, expect, server, note }) {
      resetHits(server);
      let app = await open();
      await app.tick(6000);
      let first = {};
      for (let h of server.hits) first[h.action] = (first[h.action] || 0) + 1;
      resetHits(server);
      await app.reload(6000);
      let second = {};
      for (let h of server.hits) second[h.action] = (second[h.action] || 0) + 1;
      note.push("first boot: " + JSON.stringify(first) + " ; restart: " + JSON.stringify(second));
      expect(!second.get_live_categories && !second.get_vod_categories && !second.get_series_categories, "categories refetched on restart");
    },
  },
  {
    name: "cache: corrupted and old-format entries are discarded and refetched",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(3000);
      await app.setStorage("iptv:cache:cats:live", "{broken json");
      await app.setStorage("iptv:cache:cats:vod", JSON.stringify({ value: { 0: { id: "200", name: "Old" } }, expires: 9e15 }));
      await app.setStorage("iptv:cache:cats:series", JSON.stringify("just a string"));
      await app.reload(3000);
      await goto(app, "live");
      let live = await waitFor(app, CATS, 4000);
      await goto(app, "series");
      let series = await waitFor(app, CATS, 4000);
      await goto(app, "movies");
      let vod = await waitFor(app, CATS, 4000);
      note.push(`categories: live ${live}, series ${series}, movies(with object-shaped cache) ${vod}`);
      expect(live === 6 && series === 3, "corrupted entries not refetched");
      expect(vod === 5, "non-array cached value used as the category list (movies shows " + vod + ")");
    },
  },
  {
    name: "settings: Clear cached lists forces a refetch",
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(3000);
      await goto(app, "settings");
      await app.eval("Array.prototype.find.call(document.querySelectorAll('.settings-row'),function(n){return n.__key==='clearCache'}).click()");
      await app.tick(200);
      note.push("toast: " + (await app.text(".toast")));
      let left = await app.eval("Object.keys(localStorage).filter(function(k){return k.indexOf('iptv:cache:')===0}).length");
      expect.eq(left, 0, "cache entries left");
      resetHits(server);
      await goto(app, "live");
      await waitFor(app, ITEMS + " > 0");
      expect.eq(hits(server, "get_live_categories").length, 1, "live categories refetched");
      expect(hits(server, "get_live_streams").length >= 1, "live streams refetched");
    },
  },

  // ---------------------------------------------------------------- sparse payloads
  {
    name: "sparse payloads: missing icons/ratings, null category names, info [], episodes as objects",
    config: { shape: "sparse" },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(4000);
      await goto(app, "live");
      expect((await waitFor(app, ITEMS + " > 0")) > 0, "live list empty");
      note.push("live category labels: " + JSON.stringify(await app.eval("Array.prototype.map.call(document.querySelectorAll('.category-pane .category-button'),function(n){return n.textContent})")));
      await app.key("right", 400);
      await app.key("down", 1500);
      await goto(app, "movies");
      expect((await waitFor(app, ITEMS + " > 0")) > 0, "movies empty");
      await openDetails(app, "movie", "20001", "Sparse movie");
      await app.tick(1500);
      let mt = await app.eval("document.querySelector('.details-title').textContent");
      note.push("movie title with info: [] -> " + q(mt) + " (falls back to movie_data.name)");
      expect(mt.trim().length > 0, "movie details have no title with info: []");
      await app.eval("__router.back()");
      await app.tick(300);
      await openDetails(app, "series", "30001", "Sparse series");
      await app.tick(1500);
      let eps = await app.eval("document.querySelectorAll('.episode-row').length");
      note.push("episode rows with season objects: " + eps);
      await app.key("ok", 800);
      note.push("route after Play on series: " + (await app.state()).route);
      expect(eps > 0, "episodes delivered as objects are dropped (asArray) - series shows no episodes");
    },
  },

  // ---------------------------------------------------------------- M3U / Free TV
  {
    name: "m3u: HTML and 404 URLs give messages; correct URL signs in; hanging host does not freeze sign-in",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      let base = portal(server) + "/m3u/";
      await signIn(app, base + "html.m3u", 1);
      let m1 = await waitFor(app, LOGIN_ERR);
      await app.eval("document.querySelector('.login-error').textContent=''");
      await signIn(app, base + "missing.m3u", 1);
      let m2 = await waitFor(app, LOGIN_ERR);
      note.push("html: " + q(m1) + " ; 404: " + q(m2));
      expect(m1 && m2, "no messages for bad playlist URLs");
      await app.eval("document.querySelector('.login-error').textContent=''");
      await signIn(app, base + "hang.m3u", 1);
      await app.tick(30000);
      await sleep(1500);
      await app.tick(1000);
      let btn = await app.eval(SIGNIN_BTN);
      note.push("button 31 s after a hanging playlist host: " + q(btn) + " error: " + q(await app.eval(LOGIN_ERR)));
      let stuck = btn !== "Sign in";
      await signIn(app, base + "list.m3u", 1);
      let home = await waitFor(app, "__router.current()==='home'", 4000);
      note.push("reached home with a good URL afterwards: " + !!home);
      expect(!stuck, "sign-in stuck on 'Connecting…' forever: the M3U download has no timeout and the button is locked");
      expect(home, "correct playlist URL did not sign in");
    },
  },
  {
    name: "m3u: signed-in playlist browses in Live TV",
    async run({ open, expect, server }) {
      let app = await open({
        storage: { "iptv:credentials": { url: portal(server) + "/m3u/list.m3u", username: "", password: "" }, "iptv:source": "m3u", "iptv:language": "en" },
      });
      await app.tick(3000);
      await goto(app, "live");
      expect((await waitFor(app, CATS)) >= 3, "m3u categories missing");
      expect((await waitFor(app, ITEMS + " > 0")) > 0, "m3u channels missing");
    },
  },
  {
    name: "freetv: iptv-org unreachable gives a message and a second attempt works",
    async run({ open, expect, server, note }) {
      let app = await open({ storage: SIGNED_OUT });
      let requested = [];
      await app.eval(`(function(){ window.__rf = window.__rf || window.fetch; window.__iptvorg=[]; window.__iptvMode='fail';
        window.fetch = function(u,o){ var s=String(u); if (s.indexOf('iptv-org')>=0){ __iptvorg.push(s);
          if (__iptvMode==='fail') return Promise.reject(new TypeError('Failed to fetch'));
          var data = /channels/.test(s) ? [{id:'Test.eg',name:'Test Channel',country:'EG',categories:['news'],is_nsfw:false}]
            : /streams/.test(s) ? [{channel:'Test.eg',url:'http://127.0.0.1:${server.port}/stream/t.m3u8'}] : [{code:'EG',name:'Egypt'}];
          return Promise.resolve(new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})); }
          return __rf(u,o); }; })()`);
      await app.eval("document.querySelectorAll('.welcome-option')[2].click()");
      let m1 = await waitFor(app, LOGIN_ERR, 4000);
      note.push("offline message: " + q(m1) + " ; iptv-org requests: " + (await app.eval("__iptvorg.length")));
      await focusSane(app, expect, "welcome after free TV failure");
      await app.eval("window.__iptvMode='ok'; document.querySelector('.login-error').textContent=''");
      await app.eval("document.querySelectorAll('.welcome-option')[2].click()");
      let home = await waitFor(app, "__router.current()==='home'", 4000);
      note.push("second attempt reached home: " + !!home + " ; message: " + q(await app.eval(LOGIN_ERR)) + " ; iptv-org requests: " + (await app.eval("__iptvorg.length")));
      expect(m1, "no message when iptv-org is unreachable");
      expect(home, "second attempt fails with the same error without any request (freePlaylistPromise stays rejected)");
    },
  },

  // ---------------------------------------------------------------- search
  {
    name: "search: a failed request while building the index must not break search for the session",
    config: { faults: { get_series_categories: { status: 500 } } },
    async run({ open, expect, server, note }) {
      let app = await open();
      await app.tick(3000);
      await goto(app, "search");
      await search(app, "mbc");
      await app.tick(3000);
      await sleep(500);
      await app.tick(2000);
      let s1 = await app.eval(SEARCH_STATE);
      server.setConfig({});
      await search(app, "crown");
      let ok = await waitFor(app, "document.querySelectorAll('.search-results .card').length > 0", 5000, 200);
      let s2 = await app.eval(SEARCH_STATE);
      note.push("while failing: " + JSON.stringify(s1) + " ; after recovery: " + JSON.stringify(s2));
      expect(!/Preparing/.test(s1.msg), "search shows 'Preparing search…' forever while a request fails");
      expect(ok, "search never works again this session after one failed categories request (yr stays rejected)");
    },
  },
];
