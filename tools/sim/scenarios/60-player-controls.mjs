// The player's controls, with the key codes an LG remote actually sends
// (Pause 19, Play 415, Play/Pause 179).

import { signedIn } from "../lib.mjs";

const MOVIE = { kind: "movie", id: "20001", name: "Seduced by His Lies", ext: "mkv" };

async function startFilm(open, server, resumeAt = 600) {
  let app = await open({
    storage: signedIn(server, { "iptv:settings": { heroTeaser: false } }),
    media: [{ match: "/movie/", duration: 5400 }],
  });
  await app.eval(`__router.push('player', {item: ${JSON.stringify(MOVIE)}, resumeAt: ${resumeAt}})`);
  await app.tick(4000);
  return app;
}
const video = async (app) => (await app.media()).find((m) => m.cls.indexOf("player-video") >= 0);
const osdVisible = (app) => app.eval("document.querySelector('.osd').classList.contains('visible')");
const focusText = async (app) => ((await app.state()).focus || "").trim();

export default [
  {
    name: "Down shows the controls on Pause; Right walks the buttons; OK on Skip jumps ahead",
    async run({ open, server, expect, note }) {
      let app = await startFilm(open, server);
      expect((await video(app)).t >= 600, "film playing from the resume point");
      await app.key("down", 300);
      expect(await osdVisible(app), "controls visible after Down");
      expect.eq(await focusText(app), "❚❚", "focus on Pause");
      let walked = [];
      for (let i = 0; i < 3; i++) {
        await app.key("right", 1000);
        walked.push(await focusText(app));
      }
      note.push("Right walks: " + walked.join(" → "));
      expect(walked.some((t) => /skip/i.test(t)), "Skip intro / Skip +90s reachable with Right: " + walked.join(", "));
      expect(await osdVisible(app), "controls stay up while navigating (3 s of presses)");
      // back to the Skip button and press it
      while (!/skip/i.test(await focusText(app))) await app.key("left", 200);
      let before = (await video(app)).t;
      await app.key("ok", 800);
      let after = (await video(app)).t;
      note.push(`skip: ${before.toFixed(1)} -> ${after.toFixed(1)}`);
      expect(after >= before + 80, "Skip jumped ahead");
    },
  },
  {
    name: "controls hidden: Left/Right seek; Up from the buttons focuses the bar, where they seek too",
    async run({ open, server, expect, note }) {
      let app = await startFilm(open, server, 1800);
      // The controls show for 4.5 s when the player opens; wait for them to hide.
      await app.tick(6000);
      expect(!(await osdVisible(app)), "controls hidden before the test");
      let t0 = (await video(app)).t;
      await app.key("right", 1200);
      let t1 = (await video(app)).t;
      note.push(`hidden controls, Right: ${t0.toFixed(1)} -> ${t1.toFixed(1)}`);
      expect(t1 > t0 + 5, "Right seeks forward while the controls are hidden");
      await app.tick(6000); // controls hide again
      await app.key("down", 300);
      await app.key("up", 300);
      expect(/osd-bar/.test((await app.state()).focusClass || ""), "Up from the buttons focuses the progress bar");
      let t2 = (await video(app)).t;
      await app.key("left", 1200);
      let t3 = (await video(app)).t;
      note.push(`bar focused, Left: ${t2.toFixed(1)} -> ${t3.toFixed(1)}`);
      expect(t3 < t2 - 5, "Left on the bar seeks back");
    },
  },
  {
    name: "remote Pause (19), Play (415) and Play/Pause (179) do what they say",
    async run({ open, server, expect }) {
      let app = await startFilm(open, server);
      let paused = async () => (await video(app)).paused;
      await app.key(19, 400);
      expect.eq(await paused(), true, "Pause pauses");
      await app.key(19, 400);
      expect.eq(await paused(), true, "Pause again stays paused");
      await app.key(415, 400);
      expect.eq(await paused(), false, "Play plays");
      await app.key(415, 400);
      expect.eq(await paused(), false, "Play again keeps playing");
      await app.key(179, 400);
      expect.eq(await paused(), true, "Play/Pause toggles to paused");
      await app.key(179, 400);
      expect.eq(await paused(), false, "Play/Pause toggles back");
      expect.eq(await app.eval("document.querySelector('.osd-controls .osd-button').textContent"), "❚❚", "button shows Pause while playing");
    },
  },
  {
    name: "Samsung Tizen key codes: Play/Pause (10252) toggles, Back (10009) leaves the player",
    async run({ open, server, expect }) {
      let app = await startFilm(open, server);
      await app.key(10252, 400);
      expect.eq((await video(app)).paused, true, "Tizen Play/Pause pauses");
      await app.key(10252, 400);
      expect.eq((await video(app)).paused, false, "Tizen Play/Pause resumes");
      await app.tick(6000); // let the controls hide, so one Back leaves
      await app.key(10009, 400);
      expect(((await app.state()).route || "") !== "player", "Tizen Back left the player");
    },
  },
  {
    name: "a TV that pauses on its own media key is not toggled back",
    async run({ open, server, expect }) {
      let app = await startFilm(open, server);
      // Simulate webOS acting on the key itself: pause the video inside the same keydown.
      await app.eval("document.addEventListener('keydown', function (e) { if (e.keyCode === 19) document.querySelector('.player-video').pause(); if (e.keyCode === 415) document.querySelector('.player-video').play(); }, true)");
      await app.key(19, 400);
      expect.eq((await video(app)).paused, true, "still paused after the platform already paused it");
      await app.key(415, 400);
      expect.eq((await video(app)).paused, false, "still playing after the platform already resumed it");
    },
  },
];
