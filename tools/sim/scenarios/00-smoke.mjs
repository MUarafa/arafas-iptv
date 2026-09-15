// The harness itself works: the app boots against the simulated provider, reaches Home,
// and the menu responds.

export default [
  {
    name: "boots signed-in to Home with a ready hero",
    async run({ open, expect }) {
      let app = await open();
      await app.tick(4000);
      let s = await app.state();
      expect.eq(s.route, "home", "route after boot");
      expect(s.focusCount === 1, "exactly one focused element, got " + s.focusCount);
      expect(await app.eval("!!document.querySelector('.hero.hero-ready')"), "hero never became ready");
      expect.eq(await app.eval("document.querySelectorAll('.rail-icon svg').length"), 10, "menu icons");
    },
  },
  {
    name: "boots signed-out to the welcome screen",
    async run({ open, expect }) {
      let app = await open({ storage: { "iptv:language": "en" } });
      expect.eq((await app.state()).route, "welcome", "route");
    },
  },
];
