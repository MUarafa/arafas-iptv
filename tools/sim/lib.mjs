// Drives the app in headless Chrome over the DevTools protocol. No dependencies:
// Node 22+ has fetch and WebSocket built in.

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const INJECT = fs.readFileSync(new URL("./inject.js", import.meta.url), "utf8");
const CHROME =
  process.env.SIM_CHROME ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].find((p) => fs.existsSync(p));

export const KEYS = {
  left: 37, up: 38, right: 39, down: 40, ok: 13, back: 461,
  red: 403, green: 404, yellow: 405, blue: 406,
  play: 415, pause: 19, playpause: 179, stop: 413, rewind: 412, forward: 417,
  chup: 33, chdown: 34,
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(url) {
  return new Promise((resolve, reject) => {
    let ws = new WebSocket(url);
    let id = 0;
    let waiting = new Map();
    let handlers = new Set();
    ws.onmessage = (m) => {
      let d = JSON.parse(m.data);
      if (d.id && waiting.has(d.id)) {
        let { res, rej } = waiting.get(d.id);
        waiting.delete(d.id);
        d.error ? rej(new Error(d.error.message)) : res(d.result);
      } else handlers.forEach((h) => h(d));
    };
    ws.onerror = (e) => reject(new Error("CDP socket error: " + (e.message || e.type)));
    ws.onopen = () =>
      resolve({
        send(method, params = {}, sessionId) {
          let i = ++id;
          ws.send(JSON.stringify({ id: i, method, params, sessionId }));
          return new Promise((res, rej) => waiting.set(i, { res, rej }));
        },
        on(h) {
          handlers.add(h);
          return () => handlers.delete(h);
        },
        close: () => ws.close(),
      });
  });
}

export async function launchBrowser() {
  if (!CHROME) throw new Error("No Chrome/Edge found; set SIM_CHROME");
  let dir = fs.mkdtempSync(path.join(os.tmpdir(), "arafas-sim-"));
  let port = 9300 + Math.floor(Math.random() * 600);
  let proc = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${dir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--autoplay-policy=no-user-gesture-required",
      "--window-size=1920,1080",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  let version = null;
  for (let i = 0; i < 150 && !version; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    } catch {
      await sleep(100);
    }
  }
  if (!version) throw new Error("browser did not start");
  let conn = await connect(version.webSocketDebuggerUrl);
  return {
    conn,
    async close() {
      try {
        await Promise.race([conn.send("Browser.close"), sleep(2000)]);
      } catch {}
      proc.kill();
      await sleep(300);
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {}
    },
  };
}

export function signedIn(server, extra = {}) {
  return {
    "iptv:credentials": { url: `http://127.0.0.1:${server.port}`, username: "sim", password: "sim" },
    "iptv:source": "xtream",
    "iptv:language": "en",
    ...extra,
  };
}

export async function openApp(browser, server, opts = {}) {
  let c = browser.conn;
  let { browserContextId } = await c.send("Target.createBrowserContext");
  let { targetId } = await c.send("Target.createTarget", { url: "about:blank", browserContextId });
  let { sessionId } = await c.send("Target.attachToTarget", { targetId, flatten: true });
  let send = (m, p) => c.send(m, p, sessionId);
  let errors = [];
  let consoleLines = [];
  let loadWaiters = [];

  let off = c.on((d) => {
    if (d.sessionId !== sessionId) return;
    if (d.method === "Page.loadEventFired") loadWaiters.splice(0).forEach((r) => r());
    if (d.method === "Runtime.exceptionThrown") {
      let x = d.params.exceptionDetails;
      errors.push({ type: "exception", message: (x.exception && x.exception.description) || x.text });
    }
    if (d.method === "Runtime.consoleAPICalled") {
      let text = d.params.args.map((a) => (a.value !== undefined ? a.value : a.description)).join(" ");
      consoleLines.push(d.params.type + ": " + text);
      if (d.params.type === "error") errors.push({ type: "console", message: text });
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  let seed = {
    storage: opts.storage === undefined ? signedIn(server) : opts.storage,
    media: opts.media || [],
    maxConnections: opts.maxConnections !== undefined ? opts.maxConnections : server.config.maxConnections,
    releaseDelayMs: opts.releaseDelayMs !== undefined ? opts.releaseDelayMs : 1500,
  };
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `window.__SIM_SEED__=${JSON.stringify(seed)};\n${INJECT}` });

  let waitLoad = () => new Promise((r) => loadWaiters.push(r));

  let app = {
    errors,
    consoleLines,
    async eval(expression) {
      let r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails)
        throw new Error("eval failed: " + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text));
      return r.result.value;
    },
    // `step` is the virtual-time slice between yields to the real event loop; raise it
    // (e.g. 250) to fast-forward many virtual minutes.
    tick(ms, step) {
      return app.eval(`__sim.clock.tick(${Number(ms)}${step ? ", " + Number(step) : ""})`);
    },
    async key(name, after = 120) {
      let code = typeof name === "number" ? name : KEYS[name];
      if (!code) throw new Error("unknown key " + name);
      await send("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: code, nativeVirtualKeyCode: code });
      await send("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: code, nativeVirtualKeyCode: code });
      if (after) await app.tick(after);
    },
    async keys(list, after = 120) {
      for (let k of list) await app.key(k, after);
    },
    state() {
      return app.eval(`(function(){
        var f = document.querySelectorAll('.focused');
        var n = f[0] || null, r = n && n.getBoundingClientRect();
        var router = window.__router;
        return {
          route: router ? router.current() : null,
          focusCount: f.length,
          focus: n ? (n.getAttribute('data-route') || (n.__key) || (n.textContent || '').trim().slice(0, 40) || n.className) : null,
          focusClass: n ? n.className : null,
          focusInDoc: !!n && document.contains(n),
          focusVisible: !!r && r.width > 0 && r.height > 0,
          railExpanded: !!document.querySelector('.rail.expanded'),
          now: __sim.clock.now(),
        };
      })()`);
    },
    text(selector) {
      return app.eval(`(function(){var n=document.querySelector(${JSON.stringify(selector)});return n?n.textContent:null})()`);
    },
    storage(key) {
      return app.eval(`(function(){try{return JSON.parse(localStorage.getItem(${JSON.stringify(key)}))}catch(e){return localStorage.getItem(${JSON.stringify(key)})}})()`);
    },
    setStorage(key, value) {
      return app.eval(`localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(typeof value === "string" ? value : JSON.stringify(value))})`);
    },
    media() {
      return app.eval("__sim.mediaState()");
    },
    sim(expr) {
      return app.eval(`(function(){var sim=window.__sim;return (${expr})})()`);
    },
    async screenshot(file) {
      let r = await send("Page.captureScreenshot", { format: "png" });
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(r.data, "base64"));
    },
    async reload(settle = 3000) {
      let loaded = waitLoad();
      await send("Page.reload", { ignoreCache: true });
      await loaded;
      await app.tick(settle);
    },
    async close() {
      off();
      try {
        await c.send("Target.disposeBrowserContext", { browserContextId });
      } catch {}
    },
  };

  let loaded = waitLoad();
  await send("Page.navigate", { url: `http://127.0.0.1:${server.port}/app/index.html` });
  await loaded;
  await app.tick(opts.settle !== undefined ? opts.settle : 3000);
  return app;
}
