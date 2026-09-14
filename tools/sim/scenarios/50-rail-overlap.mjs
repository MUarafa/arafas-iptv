// The menu opens wider than it sits closed. Nothing on the screen beside it may end up
// hidden underneath: the screen slides aside while the menu is open, and back after.
// (CSS transitions run in real time, so these checks pause for real, not virtual, time.)

import { sleep } from "../lib.mjs";

const GEOMETRY = `(function(){
  var rail = document.querySelector('.rail').getBoundingClientRect();
  var content = document.querySelector('.content').getBoundingClientRect();
  // Text and focusables of the current screen that start left of the rail's right edge.
  var hidden = Array.prototype.filter.call(
    document.querySelectorAll('.content .hero-body > *, .content .focusable, .content .page-title, .content .row-title'),
    function (n) { var r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.right > 0 && r.left < rail.right - 1; }
  ).map(function (n) { return (n.className || n.tagName) + ' @' + Math.round(n.getBoundingClientRect().left); });
  return { railRight: Math.round(rail.right), contentLeft: Math.round(content.left), expanded: document.querySelector('.rail').classList.contains('expanded'), hidden: hidden.slice(0, 5) };
})()`;

async function screens(app, expect, note, route) {
  await app.eval(`__router.go(${JSON.stringify(route)}, {})`);
  await app.tick(2500);
  await app.key("left", 100);
  await sleep(450);
  let open = await app.eval(GEOMETRY);
  note.push(`${route} open: ${JSON.stringify(open)}`);
  expect(open.expanded, `${route}: menu should be open after Left`);
  expect(open.contentLeft >= open.railRight - 1, `${route}: screen starts under the open menu (${open.contentLeft} < ${open.railRight})`);
  expect.eq(open.hidden, [], `${route}: items hidden under the open menu`);
  return open;
}

export default [
  {
    name: "open menu never covers the screen beside it (home, live, movies, series, settings)",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(3000);
      for (let route of ["home", "live", "movies", "series", "settings"]) await screens(app, expect, note, route);
    },
  },
  {
    name: "closing the menu puts the screen back where it was",
    async run({ open, expect, note }) {
      let app = await open();
      await app.tick(3000);
      await sleep(450);
      let before = await app.eval(GEOMETRY);
      await app.key("left", 100);
      await sleep(450);
      await app.key("right", 600);
      await sleep(450);
      let after = await app.eval(GEOMETRY);
      note.push(`before ${JSON.stringify(before)} after ${JSON.stringify(after)}`);
      expect(!after.expanded, "menu closed after Right");
      expect.eq(after.contentLeft, before.contentLeft, "screen back in place");
    },
  },
  {
    name: "the player is full screen: no menu, no shift",
    async run({ open, expect }) {
      let app = await open({ storage: undefined });
      await app.tick(3000);
      await app.eval("__router.push('player', {item:{kind:'movie', id:'20001', name:'X', ext:'mkv'}})");
      await app.tick(1500);
      await sleep(450);
      let g = await app.eval("(function(){var c=document.querySelector('.content').getBoundingClientRect();return {left:Math.round(c.left), rail:getComputedStyle(document.querySelector('.rail')).display}})()");
      expect.eq(g, { left: 0, rail: "none" }, "player layout");
    },
  },
];
