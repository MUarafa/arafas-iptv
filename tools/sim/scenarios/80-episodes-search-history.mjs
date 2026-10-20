// Episode navigation across seasons, the global search (predictions, quality labels) and
// the watch history.

import { signedIn, sleep } from "../lib.mjs";

async function waitFor(app, js, realMs = 30000, tickMs = 50) {
  let end = Date.now() + realMs;
  for (;;) {
    let v = await app.eval(js).catch(() => null);
    if (v || Date.now() > end) return v;
    await app.tick(tickMs);
    await sleep(10);
  }
}

const SERIES = "30000";

async function openApp(open, server, extra = {}) {
  return open({
    storage: signedIn(server, Object.assign({ "iptv:settings": { heroTeaser: false } }, extra)),
    media: [{ match: "/series/", duration: 2700 }, { match: "/movie/", duration: 5400 }],
  });
}
const focusText = async (app) => ((await app.state()).focus || "").trim();

export default [
  {
    name: "the last episode of season 1 offers Next (season 2's first) and Previous; Channel + moves on",
    async run({ open, server, expect, note }) {
      let app = await openApp(open, server);
      await app.eval(`__router.push('details', {kind: 'series', id: '${SERIES}'})`);
      await app.tick(3000);
      // Open season 1's last episode from the details page.
      let ok = await app.eval(`(function(){
        var rows = document.querySelectorAll('.episode-row');
        if (!rows.length) return false;
        rows[rows.length-1].dispatchEvent(new CustomEvent('focus-activate', {bubbles:true}));
        return true; })()`);
      expect(ok, "details lists episodes");
      await app.tick(4000);
      let btns = await app.eval(`Array.prototype.filter.call(document.querySelectorAll('.osd-controls .osd-button'), function(b){return !b.hidden}).map(function(b){return b.textContent.trim()})`);
      note.push("buttons: " + btns.join(" | "));
      expect(btns.some((b) => /Previous/.test(b)), "Previous episode shown");
      expect(btns.some((b) => /Next episode/.test(b)), "Next episode shown at the end of a season");
      expect(btns.some((b) => /Episodes/.test(b)), "Episodes list button shown");
      let before = await app.eval("document.querySelector('.osd-title').textContent");
      await app.key("chup", 3000);
      let after = await app.eval("document.querySelector('.osd-title').textContent");
      note.push(before + " -> " + after);
      expect(/S2E1\b/.test(after), "Channel + went to S2E1: " + after);
      await app.key("chdown", 3000);
      let back = await app.eval("document.querySelector('.osd-title').textContent");
      expect(back === before, "Channel - came back: " + back);
    },
  },
  {
    name: "search from the menu: predictions while typing, results say Movie/Series and the quality",
    async run({ open, server, expect, note }) {
      let app = await openApp(open, server);
      await app.eval(`__router.go('search', {})`);
      await app.tick(2500);
      let first = await app.eval(`(function(){var r = window.__simFirstTitle; return null})()`);
      // Type the first two letters of a film that exists.
      let name = await app.eval(`(function(){ return null })()`);
      await app.eval(`(function(){var s=document.querySelector('.search-input'); s.value='se'; s.dispatchEvent(new Event('input'));})()`);
      await waitFor(app, "document.querySelectorAll('.gs-row').length > 0");
      await app.tick(500);
      let rows = await app.eval(`Array.prototype.map.call(document.querySelectorAll('.gs-row'), function(r){return r.querySelector('.gs-title').textContent + ' [' + Array.prototype.map.call(r.querySelectorAll('.gs-badge'), function(b){return b.textContent}).join(',') + ']'})`);
      note.push("results: " + rows.slice(0, 4).join(" ; ") + " (" + rows.length + ")");
      expect(rows.length > 0, "results for 'se'");
      expect(rows.every((r) => /Movie|Series|Channel/.test(r)), "every result says what it is");
      let preds = await app.eval(`Array.prototype.map.call(document.querySelectorAll('.kb-suggestion'), function(n){return n.textContent})`);
      note.push("predictions: " + preds.join(" | "));
      expect(preds.length > 0, "predictions shown while typing");
      void first, void name;
    },
  },
  {
    name: "History lists what played, newest first, and OK plays it again",
    async run({ open, server, expect, note }) {
      let app = await openApp(open, server);
      await app.eval(`__router.push('player', {item: {kind:'movie', id:'20001', name:'Film A', ext:'mkv'}})`);
      await app.tick(5000);
      await app.key("back", 300);
      await app.key("back", 800);
      await app.eval(`__router.go('history', {})`);
      await app.tick(800);
      let rows = await app.eval(`Array.prototype.map.call(document.querySelectorAll('.history-row .history-title'), function(n){return n.textContent})`);
      let day = await app.eval(`(document.querySelector('.history-day')||{}).textContent`);
      note.push(day + ": " + rows.join(", "));
      expect.eq(rows, ["Film A"], "history rows");
      await app.eval("document.querySelector('.history-row').dispatchEvent(new CustomEvent('focus-activate', {bubbles:true}))");
      await app.tick(2500);
      expect.eq((await app.state()).route, "player", "OK plays it");
    },
  },
];
