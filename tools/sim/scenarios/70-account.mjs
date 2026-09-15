// Accounts: one step away from anywhere (menu item below Free TV, first Settings row),
// several saved at once, switching keeps each account's own progress and favourites.

import { signedIn, sleep } from "../lib.mjs";

const rows = (app) =>
  app.eval(
    "Array.prototype.map.call(document.querySelectorAll('.settings-row'), function(r){return {key:r.__key,label:(r.querySelector('.settings-label')||{}).textContent,value:(r.querySelector('.settings-value')||{}).textContent}})",
  );
const activate = (app, key) =>
  app.eval(
    `(function(){var r=Array.prototype.filter.call(document.querySelectorAll('.settings-row'),function(x){return x.__key===${JSON.stringify(key)}})[0];if(!r)return false;r.dispatchEvent(new CustomEvent('focus-activate',{bubbles:true}));return true})()`,
  );

async function afterReload(app) {
  // The switch reloads the page a moment later (a virtual-clock timer): advancing the clock
  // triggers it, and the evaluation in flight is cut off by the navigation - expected.
  try {
    await app.tick(1000);
  } catch (e) {}
  await sleep(3000); // the reload itself happens in real time
  await app.tick(2500);
}

export default [
  {
    name: "Accounts sits below Free TV in the menu and lists 'Add account' when nothing is saved",
    async run({ open, expect }) {
      let app = await open({ storage: { "iptv:language": "en", "iptv:source": "free" } });
      await app.tick(1500);
      let order = await app.eval("Array.prototype.map.call(document.querySelectorAll('.rail-item'), function(n){return n.getAttribute('data-route')}).slice(-2)");
      expect.eq(order, ["freetv", "account"], "menu order");
      expect.eq(await app.eval("document.querySelector('.rail-item[data-route=\"account\"] .rail-label').textContent"), "Accounts", "label");
      await app.eval("__router.go('account', {})");
      await app.tick(800);
      let r = await rows(app);
      expect.eq(r.map((x) => x.key), ["free", "add"], "the free playlist in use, then Add account");
      await activate(app, "add");
      await app.tick(800);
      expect.eq((await app.state()).route, "welcome", "Add account opens sign-in");
    },
  },
  {
    name: "Settings' first row opens Accounts and shows who is signed in",
    async run({ open, server, expect }) {
      let app = await open({ storage: signedIn(server) });
      await app.eval("__router.go('settings', {})");
      await app.tick(800);
      let first = (await rows(app))[0];
      expect.eq({ key: first.key, value: first.value }, { key: "account", value: "sim" }, "first settings row");
      await activate(app, "account");
      await app.tick(800);
      expect.eq((await app.state()).route, "account", "opens Accounts");
    },
  },
  {
    name: "switching accounts keeps each account's Continue Watching separate",
    async run({ open, server, expect, note }) {
      let base = `http://127.0.0.1:${server.port}`;
      let a = { url: base, username: "alice", password: "a" };
      let b = { url: base, username: "bob", password: "b" };
      let idA = "xtream|" + base + "|alice",
        idB = "xtream|" + base + "|bob";
      let aliceResume = { "movie:20001": { kind: "movie", id: "20001", name: "Alice film", position: 900, duration: 5400, updatedAt: Date.now() } };
      let app = await open({
        storage: {
          "iptv:language": "en",
          "iptv:source": "xtream",
          "iptv:credentials": a,
          "iptv:resume": aliceResume,
          "iptv:accounts": [
            { id: idA, kind: "xtream", ...a, at: 2 },
            { id: idB, kind: "xtream", ...b, at: 1 },
          ],
        },
      });
      await app.eval("__router.go('account', {})");
      await app.tick(800);
      let listed = await rows(app);
      note.push("listed: " + JSON.stringify(listed.map((r) => [r.label, r.value])));
      expect.eq(listed.map((r) => r.key), [idA, idB, "add"], "both accounts and Add");
      expect.eq(listed[0].value, "In use", "alice marked in use");

      await activate(app, idB);
      await afterReload(app);
      expect.eq((await app.storage("iptv:credentials")).username, "bob", "bob is now signed in");
      expect.eq(await app.storage("iptv:resume"), null, "bob starts with his own (empty) Continue Watching");

      await app.eval("__router.go('account', {})");
      await app.tick(800);
      await activate(app, idA);
      await afterReload(app);
      expect.eq((await app.storage("iptv:credentials")).username, "alice", "back on alice");
      expect.eq(await app.storage("iptv:resume"), aliceResume, "alice's Continue Watching came back");
    },
  },
  {
    name: "Yellow removes a saved account, but not the one in use",
    async run({ open, server, expect }) {
      let base = `http://127.0.0.1:${server.port}`;
      let idA = "xtream|" + base + "|sim",
        idB = "xtream|" + base + "|bob";
      let app = await open({
        storage: signedIn(server, {
          "iptv:accounts": [
            { id: idA, kind: "xtream", url: base, username: "sim", password: "sim", at: 2 },
            { id: idB, kind: "xtream", url: base, username: "bob", password: "b", at: 1 },
          ],
        }),
      });
      await app.eval("__router.go('account', {})");
      await app.tick(800);
      // focus the active row and press Yellow: refused
      await app.key("yellow", 300);
      expect.eq((await rows(app)).map((r) => r.key), [idA, idB, "add"], "active account not removed");
      await app.key("down", 200);
      await app.key("yellow", 300);
      expect.eq((await rows(app)).map((r) => r.key), [idA, "add"], "bob removed");
    },
  },
];
