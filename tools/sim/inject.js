// Injected into the page before the app runs. Three things:
//
//  1. A virtual clock. setTimeout/setInterval/Date.now run on time the simulator
//     advances, so "30 seconds of teaser" or "a 20 s fetch timeout" take milliseconds.
//  2. A scriptable <video>. There are no real streams here; instead every media element
//     follows a behaviour chosen by URL - start late, never start, fail, get cut, stall,
//     report no duration until playing, refuse to seek, or be the provider's
//     "restricted" clip when the connection limit is exceeded.
//  3. Error capture, so the runner sees uncaught exceptions and rejections.
//
// window.__SIM_SEED__ (set by the runner) may carry { storage, media, maxConnections,
// releaseDelayMs }.

(function () {
  "use strict";
  var seed = window.__SIM_SEED__ || {};
  var sim = (window.__sim = { errors: [], log: [] });

  // ---------------------------------------------------------------- storage seed
  try {
    if (seed.storage && !sessionStorage.getItem("__simSeeded")) {
      localStorage.clear();
      Object.keys(seed.storage).forEach(function (k) {
        var v = seed.storage[k];
        localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
      });
      sessionStorage.setItem("__simSeeded", "1");
    }
  } catch (e) {}

  // ---------------------------------------------------------------- errors
  window.addEventListener("error", function (e) {
    sim.errors.push({ type: "error", message: String(e.message), stack: e.error && e.error.stack });
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    sim.errors.push({ type: "rejection", message: String(r && r.message ? r.message : r), stack: r && r.stack });
  });

  // ---------------------------------------------------------------- virtual clock
  var realSetTimeout = window.setTimeout.bind(window);
  var virtualNow = Date.now();
  var timers = new Map();
  var seq = 1;
  var activeIntervals = 0;

  window.setTimeout = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    var id = seq++;
    timers.set(id, { at: virtualNow + Math.max(0, Number(ms) || 0), fn: fn, args: args, every: 0, id: id });
    return id;
  };
  window.setInterval = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    var id = seq++;
    var every = Math.max(1, Number(ms) || 0);
    timers.set(id, { at: virtualNow + every, fn: fn, args: args, every: every, id: id });
    return id;
  };
  window.clearTimeout = window.clearInterval = function (id) {
    timers.delete(id);
  };
  Date.now = function () {
    return virtualNow;
  };

  function runDue(until) {
    for (;;) {
      var next = null;
      timers.forEach(function (t) {
        if (t.at <= until && (!next || t.at < next.at || (t.at === next.at && t.id < next.id))) next = t;
      });
      if (!next) return;
      virtualNow = Math.max(virtualNow, next.at);
      if (next.every) next.at += next.every;
      else timers.delete(next.id);
      try {
        typeof next.fn === "function" ? next.fn.apply(window, next.args) : eval(String(next.fn));
      } catch (e) {
        sim.errors.push({ type: "timer", message: String(e && e.message), stack: e && e.stack });
      }
    }
  }

  sim.clock = {
    now: function () {
      return virtualNow;
    },
    pending: function () {
      var n = 0;
      timers.forEach(function (t) {
        if (t.every) n++;
      });
      return { timers: timers.size, intervals: n };
    },
    // Advance virtual time in small steps, yielding to the real event loop between
    // steps so fetches, image loads and promise chains can land.
    tick: function (ms, step) {
      step = step || 25;
      var target = virtualNow + ms;
      return new Promise(function (resolve) {
        (function loop() {
          var until = Math.min(target, virtualNow + step);
          runDue(until);
          virtualNow = until;
          if (virtualNow >= target) return realSetTimeout(resolve, 0);
          realSetTimeout(loop, 0);
        })();
      });
    },
  };

  // ---------------------------------------------------------------- media
  sim.maxConnections = seed.maxConnections != null ? seed.maxConnections : Infinity;
  sim.releaseDelayMs = seed.releaseDelayMs || 0;
  sim.media = seed.media || [];
  sim.connections = new Map();
  sim.peakConnections = 0;
  sim.restricted = 0;

  var DEFAULT_BEHAVIOUR = {
    startDelay: 400, // ms from play() to "playing"
    duration: 3600, // media seconds; ignored when live
    live: false,
    fail: null, // "error" (fires error) | "never" (never starts)
    failTimes: Infinity, // how many opens of this URL fail before it recovers
    durationAfter: 0, // ms of playback before duration becomes known (NaN until then)
    errorAt: null, // media second at which an error fires
    endAt: null, // media second at which the stream is cut ("ended" early); live: every N s
    stallAt: null, // media second at which playback freezes
    stallFor: 0, // ms the freeze lasts (0 = forever)
    seekable: true,
    rate: 1,
  };
  var opens = {};

  function behaviourFor(url) {
    var b = {};
    for (var k in DEFAULT_BEHAVIOUR) b[k] = DEFAULT_BEHAVIOUR[k];
    sim.media.forEach(function (rule) {
      if (url.indexOf(rule.match) >= 0) for (var k in rule) if (k !== "match") b[k] = rule[k];
    });
    return b;
  }

  var P = HTMLMediaElement.prototype;
  var nativeRemoveAttribute = Element.prototype.removeAttribute;
  var nativeSetAttribute = Element.prototype.setAttribute;
  var states = new WeakMap();

  function st(el) {
    var s = states.get(el);
    if (!s) {
      s = { src: "", t: 0, dur: NaN, paused: true, ready: 0, ended: false, error: null, gen: 0, ticker: 0, beh: null, conn: false };
      states.set(el, s);
    }
    return s;
  }
  function fire(el, name) {
    el.dispatchEvent(new Event(name));
  }
  function connectionCount() {
    var n = 0;
    sim.connections.forEach(function (v) {
      if (!v.releasingAt || v.releasingAt > virtualNow) n++;
    });
    return n;
  }
  function release(el) {
    var s = st(el);
    if (!s.conn) return;
    s.conn = false;
    var entry = sim.connections.get(el);
    if (!entry) return;
    entry.releasingAt = virtualNow + sim.releaseDelayMs;
    sim.log.push(["close", entry.url, virtualNow]);
    setTimeout(function () {
      if (sim.connections.get(el) === entry) sim.connections.delete(el);
    }, sim.releaseDelayMs);
  }
  function stopTicker(s) {
    if (s.ticker) clearInterval(s.ticker);
    s.ticker = 0;
  }
  function reset(el) {
    var s = st(el);
    stopTicker(s);
    release(el);
    s.gen++;
    s.t = 0;
    s.dur = NaN;
    s.paused = true;
    s.ready = 0;
    s.ended = false;
    s.error = null;
    s.opened = false;
  }

  function open(el) {
    var s = st(el);
    if (s.opened || !s.src) return;
    s.opened = true;
    var gen = s.gen;
    var url = s.src;
    var beh = (s.beh = behaviourFor(url));
    opens[url] = (opens[url] || 0) + 1;

    var restricted = connectionCount() >= sim.maxConnections;
    s.conn = true;
    sim.connections.set(el, { url: url, openedAt: virtualNow });
    sim.peakConnections = Math.max(sim.peakConnections, connectionCount());
    sim.log.push(["open", url, virtualNow, connectionCount(), restricted ? "RESTRICTED" : ""]);
    if (restricted) {
      sim.restricted++;
      beh = s.beh = behaviourFor("");
      beh.duration = 12; // the provider's short "this video has been restricted" clip
    }
    var failing = beh.fail && opens[url] <= beh.failTimes;

    setTimeout(function () {
      if (s.gen !== gen) return;
      if (failing && beh.fail === "error") {
        s.error = { code: 4, message: "sim: source failed" };
        return fire(el, "error");
      }
      if (failing && beh.fail === "never") return fire(el, "waiting");
      s.ready = 4;
      s.dur = beh.live ? Infinity : beh.durationAfter ? NaN : beh.duration;
      fire(el, "loadedmetadata");
      fire(el, "durationchange");
      if (s.paused) return;
      startPlaying(el, gen);
    }, beh.startDelay);
  }

  function startPlaying(el, gen) {
    var s = st(el);
    var beh = s.beh;
    var playedMs = 0;
    var stalledUntil = 0;
    var stalledOnce = false;
    fire(el, "playing");
    stopTicker(s);
    s.ticker = setInterval(function () {
      if (s.gen !== gen || s.paused) return;
      if (stalledUntil) {
        if (beh.stallFor && virtualNow >= stalledUntil) {
          stalledUntil = 0;
          fire(el, "playing");
        } else return;
      }
      playedMs += 250;
      if (beh.durationAfter && playedMs >= beh.durationAfter && !isFinite(s.dur) && !beh.live) {
        s.dur = beh.duration;
        fire(el, "durationchange");
      }
      s.t += 0.25 * beh.rate;
      if (!beh.live && isFinite(s.dur) && s.t >= s.dur) {
        s.t = s.dur;
        return end(el);
      }
      fire(el, "timeupdate");
      if (beh.stallAt != null && !stalledOnce && s.t >= beh.stallAt) {
        stalledOnce = true;
        stalledUntil = beh.stallFor ? virtualNow + beh.stallFor : Infinity;
        return fire(el, "waiting");
      }
      if (beh.errorAt != null && s.t >= beh.errorAt) {
        stopTicker(s);
        s.error = { code: 2, message: "sim: network error" };
        return fire(el, "error");
      }
      if (beh.endAt != null && s.t >= beh.endAt) {
        if (!beh.live) s.dur = s.t; // a truncated file shrinks its reported duration to the cut
        return end(el);
      }
    }, 250);
  }

  function end(el) {
    var s = st(el);
    stopTicker(s);
    s.paused = true;
    s.ended = true;
    fire(el, "ended");
  }

  Object.defineProperty(P, "src", {
    configurable: true,
    get: function () {
      return st(this).src;
    },
    set: function (v) {
      reset(this);
      st(this).src = String(v || "");
      // The property reflects to the attribute, as in a real browser - but only through
      // getAttribute/hasAttribute below. Writing the real attribute would make Chrome
      // fetch the fake URL itself, fail, and fire a genuine "error" event.
      if (st(this).src) fire(this, "loadstart");
    },
  });
  Object.defineProperty(P, "currentSrc", { configurable: true, get: function () { return st(this).src; } });
  Object.defineProperty(P, "currentTime", {
    configurable: true,
    get: function () {
      return st(this).t;
    },
    set: function (v) {
      var s = st(this);
      v = Number(v);
      if (!isFinite(v)) throw new TypeError("sim: non-finite currentTime");
      if (s.beh && !s.beh.seekable) return;
      if (isFinite(s.dur)) v = Math.min(v, s.dur);
      s.t = Math.max(0, v);
      s.ended = false;
      fire(this, "seeking");
      fire(this, "seeked");
      // Seeking a stream mid-playback rebuffers at the new position, as real ones do.
      if (s.ready && !s.paused) {
        var el = this,
          gen = s.gen;
        fire(el, "waiting");
        setTimeout(function () {
          if (s.gen === gen && !s.paused) fire(el, "playing");
        }, 300);
      }
    },
  });
  Object.defineProperty(P, "duration", { configurable: true, get: function () { return st(this).dur; } });
  Object.defineProperty(P, "paused", { configurable: true, get: function () { return st(this).paused; } });
  Object.defineProperty(P, "ended", { configurable: true, get: function () { return st(this).ended; } });
  Object.defineProperty(P, "readyState", { configurable: true, get: function () { return st(this).ready; } });
  Object.defineProperty(P, "error", { configurable: true, get: function () { return st(this).error; } });
  Object.defineProperty(P, "buffered", {
    configurable: true,
    get: function () {
      var s = st(this);
      return { length: s.ready ? 1 : 0, start: function () { return 0; }, end: function () { return s.t + 10; } };
    },
  });
  Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", { configurable: true, get: function () { return st(this).ready ? 1920 : 0; } });
  Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", { configurable: true, get: function () { return st(this).ready ? 1080 : 0; } });

  P.play = function () {
    var s = st(this);
    if (!s.src) return Promise.reject(new DOMException("sim: no source", "NotSupportedError"));
    var wasPaused = s.paused;
    s.paused = false;
    if (s.ended) {
      s.ended = false;
      s.t = 0;
    }
    if (!s.opened) open(this);
    else if (wasPaused && s.ready) startPlaying(this, s.gen);
    return Promise.resolve();
  };
  P.pause = function () {
    var s = st(this);
    if (s.paused) return;
    s.paused = true;
    fire(this, "pause");
  };
  P.load = function () {
    var s = st(this);
    var src = s.src;
    reset(this);
    s.src = src;
  };
  Element.prototype.removeAttribute = function (name) {
    if (this instanceof HTMLMediaElement && String(name).toLowerCase() === "src") {
      reset(this);
      st(this).src = "";
    }
    return nativeRemoveAttribute.apply(this, arguments);
  };
  var nativeGetAttribute = Element.prototype.getAttribute;
  var nativeHasAttribute = Element.prototype.hasAttribute;
  Element.prototype.getAttribute = function (name) {
    if (this instanceof HTMLMediaElement && String(name).toLowerCase() === "src") return st(this).src || null;
    return nativeGetAttribute.apply(this, arguments);
  };
  Element.prototype.hasAttribute = function (name) {
    if (this instanceof HTMLMediaElement && String(name).toLowerCase() === "src") return !!st(this).src;
    return nativeHasAttribute.apply(this, arguments);
  };
  Element.prototype.setAttribute = function (name, value) {
    if (this instanceof HTMLMediaElement && String(name).toLowerCase() === "src") {
      this.src = value;
      return;
    }
    return nativeSetAttribute.apply(this, arguments);
  };

  sim.mediaState = function () {
    return Array.prototype.map.call(document.querySelectorAll("video"), function (v) {
      var s = st(v);
      return { cls: v.className, src: s.src, t: s.t, dur: s.dur, paused: s.paused, conn: s.conn };
    });
  };
  sim.connectionCount = connectionCount;
})();
