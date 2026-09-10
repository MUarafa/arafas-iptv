(() => {
  var e = Object.defineProperty, t = (t2, n2) => {
    for (var i2 in n2) e(t2, i2, { get: n2[i2], enumerable: true });
  }, n = (e2, t2, n2) => new Promise((i2, r2) => {
    var s2 = (e3) => {
      try {
        l2(n2.next(e3));
      } catch (e4) {
        r2(e4);
      }
    }, a2 = (e3) => {
      try {
        l2(n2.throw(e3));
      } catch (e4) {
        r2(e4);
      }
    }, l2 = (e3) => e3.done ? i2(e3.value) : Promise.resolve(e3.value).then(s2, a2);
    l2((n2 = n2.apply(e2, t2)).next());
  });
  function i(e2, t2, n2) {
    let i2 = document.createElement(e2);
    if (t2) for (let e3 of Object.keys(t2)) {
      let n3 = t2[e3];
      null == n3 || false === n3 || ("class" === e3 ? i2.className = n3 : "text" === e3 ? i2.textContent = n3 : "html" === e3 ? i2.innerHTML = n3 : "style" === e3 ? i2.style.cssText = n3 : "on" === e3.slice(0, 2) ? i2.addEventListener(e3.slice(2), n3) : (e3.slice(0, 5), i2.setAttribute(e3, n3)));
    }
    return n2 && (function(e3, t3) {
      let n3 = Array.isArray(t3) ? t3 : [t3];
      for (let t4 of n3) null == t4 || false === t4 || e3.appendChild("string" == typeof t4 ? document.createTextNode(t4) : t4);
    })(i2, n2), i2;
  }
  function r(e2) {
    for (; e2.firstChild; ) e2.removeChild(e2.firstChild);
    return e2;
  }
  function s(e2, t2) {
    return Array.prototype.slice.call((t2 || document).querySelectorAll(e2));
  }
  function a(e2, t2) {
    let n2 = null;
    return function(...i2) {
      n2 && clearTimeout(n2), n2 = setTimeout(() => {
        n2 = null, e2.apply(this, i2);
      }, t2);
    };
  }
  typeof globalThis > "u" && (Object.defineProperty(Object.prototype, "__globalThis__", { get: function() {
    return this;
  }, configurable: true }), __globalThis__.globalThis = __globalThis__, delete Object.prototype.__globalThis__), Array.prototype.flat || Object.defineProperty(Array.prototype, "flat", { configurable: true, writable: true, value: function(e2) {
    var t2 = void 0 === e2 ? 1 : Number(e2) || 0, n2 = [];
    return (function e3(t3, i2) {
      for (var r2 = 0; r2 < t3.length; r2++) Array.isArray(t3[r2]) && i2 > 0 ? e3(t3[r2], i2 - 1) : n2.push(t3[r2]);
    })(this, t2), n2;
  } }), Object.fromEntries || (Object.fromEntries = function(e2) {
    for (var t2 = {}, n2 = Array.isArray(e2) ? e2 : Array.from(e2), i2 = 0; i2 < n2.length; i2++) t2[n2[i2][0]] = n2[i2][1];
    return t2;
  }), Promise.allSettled || (Promise.allSettled = function(e2) {
    return Promise.all(Array.prototype.map.call(e2, (function(e3) {
      return Promise.resolve(e3).then((function(e4) {
        return { status: "fulfilled", value: e4 };
      }), (function(e4) {
        return { status: "rejected", reason: e4 };
      }));
    })));
  }), typeof AbortController > "u" && (window.AbortController = function() {
    this.signal = { aborted: false, addEventListener: function() {
    }, removeEventListener: function() {
    } }, this.abort = function() {
      this.signal.aborted = true;
    };
  }), String.prototype.matchAll || Object.defineProperty(String.prototype, "matchAll", { configurable: true, writable: true, value: function(e2) {
    for (var t2, n2 = -1 === e2.flags.indexOf("g") ? e2.flags + "g" : e2.flags, i2 = new RegExp(e2.source, n2), r2 = String(this), s2 = []; null !== (t2 = i2.exec(r2)); ) s2.push(t2), "" === t2[0] && i2.lastIndex++;
    return s2[Symbol.iterator]();
  } });
  var l = {};
  t(l, { back: () => M, canGoBack: () => F, current: () => I, go: () => A, handleKey: () => q, init: () => L, push: () => E, register: () => T, replace: () => P, view: () => D });
  var o = ".focusable:not(.disabled):not([hidden])", u = null, c = /* @__PURE__ */ Object.create(null), d = true;
  function m() {
    return u;
  }
  function h(e2) {
    if (null === e2.offsetParent && "fixed" !== getComputedStyle(e2).position) return false;
    let t2 = e2.getBoundingClientRect();
    return t2.width > 0 && t2.height > 0;
  }
  function f(e2) {
    return s(o, e2 || document.querySelector("[data-focus-trap]") || document).filter(h);
  }
  function p(e2) {
    return { x: e2.left + e2.width / 2, y: e2.top + e2.height / 2 };
  }
  function g(e2, t2, n2) {
    let i2, r2, s2 = p(e2), a2 = p(t2);
    return "left" === n2 || "right" === n2 ? (i2 = "right" === n2 ? t2.left - e2.right : e2.left - t2.right, r2 = Math.min(e2.bottom, t2.bottom) - Math.max(e2.top, t2.top) > 0 ? 0 : Math.abs(a2.y - s2.y)) : (i2 = "down" === n2 ? t2.top - e2.bottom : e2.top - t2.bottom, r2 = Math.min(e2.right, t2.right) - Math.max(e2.left, t2.left) > 0 ? 0 : Math.abs(a2.x - s2.x)), i2 < -2 ? null : Math.max(i2, 0) + 4 * r2;
  }
  function v(e2, t2) {
    if (!e2) return false;
    let n2 = t2 && t2.exact ? e2 : (function(e3) {
      let t3 = e3.closest("[data-focus-memory]");
      if (!t3) return e3;
      let n3 = t3.getAttribute("data-focus-memory"), i2 = c[n3];
      return u && t3.contains(u) || !i2 || !t3.contains(i2) || !h(i2) ? e3 : i2;
    })(e2);
    return d = !(!t2 || !t2.provisional), n2 === u || (u && (u.classList.remove("focused"), u.removeAttribute("data-focused")), (u = n2).classList.add("focused"), u.setAttribute("data-focused", ""), (function(e3) {
      let t3 = e3.closest("[data-focus-memory]");
      t3 && (c[t3.getAttribute("data-focus-memory")] = e3);
    })(u), u.dispatchEvent(new CustomEvent("focus-enter", { bubbles: true })), document.dispatchEvent(new CustomEvent("focus-moved", { detail: { node: u } }))), true;
  }
  function y(e2) {
    let t2 = (function(e3, t3) {
      let n2 = t3 || u;
      if (!n2) return f()[0] || null;
      let i2 = n2.getBoundingClientRect(), r2 = (function(e4, t4) {
        let n3 = "up" === t4 || "down" === t4 ? "vertical" : "horizontal", i3 = e4.closest("[data-focus-contain]");
        return i3 && i3.getAttribute("data-focus-contain") === n3 ? i3 : null;
      })(n2, e3), a2 = null, l2 = 1 / 0;
      for (let t4 of r2 ? s(o, r2).filter(h) : f()) {
        if (t4 === n2) continue;
        let r3 = g(i2, t4.getBoundingClientRect(), e3);
        null === r3 || r3 >= l2 || (l2 = r3, a2 = t4);
      }
      return a2;
    })(e2);
    return t2 ? v(t2) : (u && u.dispatchEvent(new CustomEvent("focus-edge", { bubbles: true, detail: { dir: e2 } })), false);
  }
  function b(e2) {
    u && !document.contains(u) && (u.classList.remove("focused"), u = null), u || v(e2 || f()[0], { provisional: true });
  }
  function w(e2, t2) {
    return !(!t2 || !e2 || u && e2.contains(u) || !d) && v(t2);
  }
  var x = /* @__PURE__ */ Object.create(null), k = [], C = null, S = null, _ = null;
  function T(e2, t2) {
    x[e2] = t2;
  }
  function L(e2) {
    C = e2;
  }
  function I() {
    return _;
  }
  function N(e2, t2) {
    let n2 = x[e2];
    if (!n2) throw new Error("Unknown view: " + e2);
    if (S && S.unmount) try {
      S.unmount();
    } catch (e3) {
    }
    r(C), _ = e2, (S = n2(t2 || {})).mount(C), b(S.initialFocus ? S.initialFocus() : null);
  }
  function A(e2, t2) {
    k.length = 0, N(e2, t2);
  }
  function E(e2, t2) {
    _ && k.push({ name: _, params: O }), O = t2, N(e2, t2);
  }
  var O = null;
  function P(e2, t2) {
    O = t2, N(e2, t2);
  }
  function M() {
    let e2 = k.pop();
    return !!e2 && (O = e2.params, N(e2.name, e2.params), true);
  }
  function F() {
    return k.length > 0;
  }
  function q(e2) {
    return !(!S || !S.onKey) && S.onKey(e2);
  }
  function D() {
    return S;
  }
  var j = {};
  t(j, { authenticate: () => fe, episodeUrl: () => Ee, liveCategories: () => ge, liveStreams: () => ke, liveUrl: () => Ne, movieInfo: () => _e, movieUrl: () => Ae, seriesCategories: () => ye, seriesInfo: () => Te, seriesList: () => Se, shortEpg: () => Le, vodCategories: () => ve, vodStreams: () => Ce });
  var U = {url:"",username:"",password:""}, R = "iptv:credentials", K = "iptv:source", z = null, B = null;
  function V() {
    if (B) return B;
    try {
      B = localStorage.getItem(K) || "xtream";
    } catch (e2) {
      B = "xtream";
    }
    return B;
  }
  function W() {
    if (z) return z;
    try {
      let e2 = localStorage.getItem(R);
      e2 && (z = JSON.parse(e2));
    } catch (e2) {
      z = null;
    }
    return z;
  }
  function J() {
    let e2 = W();
    if (!e2) throw new Error("Not signed in");
    return e2;
  }
  var H = "iptv:settings", X = { preferLowerBitrate: true, liveFormat: "ts", showChannelNumbers: true, startupView: "home", introSkipSeconds: 90, nextEpisodePromptSeconds: 60, heroTeaser: true, heroTeaserSound: true }, G = null;
  function Z() {
    if (G) return G;
    G = Object.assign({}, X);
    try {
      let e2 = localStorage.getItem(H);
      e2 && Object.assign(G, JSON.parse(e2));
    } catch (e2) {
    }
    return G;
  }
  function $(e2) {
    let t2 = Object.assign(Z(), e2);
    G = t2;
    try {
      localStorage.setItem(H, JSON.stringify(t2));
    } catch (e3) {
    }
    return t2;
  }
  var Q = "iptv:cache:", Y = /* @__PURE__ */ new Map(), ee = 864e5, te = 216e5, ne = 6048e5, ie = 3e5;
  function re() {
    return Date.now();
  }
  function se(e2, t2, n2) {
    let i2, r2 = { value: t2, expires: re() + (n2 || ie) };
    Y.set(e2, r2);
    try {
      i2 = JSON.stringify(r2);
    } catch (e3) {
      return;
    }
    if (!(i2.length > 262144)) try {
      localStorage.setItem(Q + e2, i2);
    } catch (t3) {
      !(function(e3) {
        let t4 = [], n3 = 0;
        try {
          n3 = localStorage.length;
        } catch (e4) {
          return;
        }
        for (let e4 = 0; e4 < n3; e4++) {
          let n4;
          try {
            n4 = localStorage.key(e4);
          } catch (e5) {
            continue;
          }
          if (!n4 || n4.slice(0, Q.length) !== Q) continue;
          let i3 = 0;
          try {
            i3 = (JSON.parse(localStorage.getItem(n4)) || {}).expires || 0;
          } catch (e5) {
          }
          t4.push({ key: n4, expires: i3 });
        }
        t4.sort((e4, t5) => e4.expires - t5.expires);
        for (let n4 of t4.slice(0, e3)) try {
          localStorage.removeItem(n4.key);
        } catch (e4) {
        }
      })(8);
      try {
        localStorage.setItem(Q + e2, i2);
      } catch (e3) {
      }
    }
  }
  var ae = "iptv:lastRefresh";
  function le() {
    Y.clear();
    let e2 = [];
    try {
      for (let t2 = 0; t2 < localStorage.length; t2++) {
        let n2 = localStorage.key(t2);
        n2 && n2.slice(0, Q.length) === Q && e2.push(n2);
      }
      for (let t2 of e2) localStorage.removeItem(t2);
    } catch (e3) {
    }
  }
  var oe = /* @__PURE__ */ new Map();
  function ue(e2, t2, n2, i2) {
    let r2 = (function(e3) {
      let t3, n3, i3 = Y.get(e3);
      if (i3) {
        if (i3.expires > re()) return i3.value;
        Y.delete(e3);
      }
      try {
        t3 = localStorage.getItem(Q + e3);
      } catch (e4) {
        return null;
      }
      if (!t3) return null;
      try {
        n3 = JSON.parse(t3);
      } catch (t4) {
        try {
          localStorage.removeItem(Q + e3);
        } catch (e4) {
        }
        return null;
      }
      if (!n3 || n3.expires <= re()) {
        try {
          localStorage.removeItem(Q + e3);
        } catch (e4) {
        }
        return null;
      }
      return Y.set(e3, n3), n3.value;
    })(e2);
    if (null != r2) return Promise.resolve(r2);
    if (oe.has(e2)) return oe.get(e2);
    let s2 = n2().then((n3) => (i2 && i2.memoryOnly ? (function(e3, t3, n4) {
      Y.set(e3, { value: t3, expires: re() + (n4 || te) });
    })(e2, n3, t2) : se(e2, n3, t2), oe.delete(e2), n3)).catch((t3) => {
      throw oe.delete(e2), t3;
    });
    return oe.set(e2, s2), s2;
  }
  function ce() {
    return J().url.replace(/\/+$/, "");
  }
  function de() {
    let e2 = J();
    return encodeURIComponent(e2.username) + "/" + encodeURIComponent(e2.password);
  }
  function me(e2, t2) {
    return n(this, null, (function* () {
      let n2 = new AbortController(), i2 = setTimeout(() => n2.abort(), 2e4);
      try {
        let r2 = yield fetch((function(e3, t3) {
          let n3 = J(), i3 = new URLSearchParams();
          if (i3.set("username", n3.username), i3.set("password", n3.password), e3 && i3.set("action", e3), t3) for (let e4 of Object.keys(t3)) void 0 !== t3[e4] && null !== t3[e4] && i3.set(e4, t3[e4]);
          return ce() + "/player_api.php?" + i3.toString();
        })(e2, t2), { signal: n2.signal });
        if (!r2.ok) throw new Error("HTTP " + r2.status + " for " + (e2 || "auth"));
        let s2 = yield r2.text();
        try {
          return JSON.parse(s2);
        } catch (t3) {
          throw new Error("Bad JSON from " + (e2 || "auth"));
        }
      } finally {
        clearTimeout(i2);
      }
    }));
  }
  function he(e2) {
    return Array.isArray(e2) ? e2 : [];
  }
  function fe() {
    return n(this, null, (function* () {
      let e2 = yield me(null), t2 = e2 && e2.user_info;
      if (!t2 || "0" === String(t2.auth) || !t2.status) throw new Error("Login failed");
      if ("active" !== String(t2.status).toLowerCase()) throw new Error("Account is " + t2.status);
      return { status: t2.status, expiresAt: t2.exp_date ? 1e3 * Number(t2.exp_date) : null, maxConnections: Number(t2.max_connections) || 1, activeConnections: Number(t2.active_cons) || 0, allowedFormats: he(t2.allowed_output_formats), trial: "1" === String(t2.is_trial) };
    }));
  }
  function pe(e2, t2) {
    return ue("cats:" + e2, ee, () => n(null, null, (function* () {
      return he(yield me(t2)).map((t3) => ({ id: String(t3.category_id), name: String(t3.category_name || "").trim(), kind: e2 }));
    })));
  }
  function ge() {
    return pe("live", "get_live_categories");
  }
  function ve() {
    return pe("vod", "get_vod_categories");
  }
  function ye() {
    return pe("series", "get_series_categories");
  }
  function be(e2) {
    return { kind: "live", id: String(e2.stream_id), name: String(e2.name || "").trim(), logo: e2.stream_icon || null, categoryId: String(e2.category_id), epgChannelId: e2.epg_channel_id || null, number: null != e2.num ? Number(e2.num) : null };
  }
  function we(e2) {
    return { kind: "movie", id: String(e2.stream_id), name: String(e2.name || "").trim(), poster: e2.stream_icon || null, categoryId: String(e2.category_id), ext: e2.container_extension || "mp4", rating: e2.rating ? Number(e2.rating) : null, added: e2.added ? 1e3 * Number(e2.added) : null };
  }
  function xe(e2) {
    return { kind: "series", id: String(e2.series_id), name: String(e2.name || "").trim(), poster: e2.cover || null, categoryId: String(e2.category_id), rating: e2.rating ? Number(e2.rating) : null, plot: e2.plot || "", genre: e2.genre || "", lastModified: e2.last_modified ? 1e3 * Number(e2.last_modified) : null };
  }
  function ke(e2) {
    return ue("live:" + e2, te, () => n(null, null, (function* () {
      return he(yield me("get_live_streams", { category_id: e2 })).map(be);
    })), { memoryOnly: true });
  }
  function Ce(e2) {
    return ue("vod:" + e2, te, () => n(null, null, (function* () {
      return he(yield me("get_vod_streams", { category_id: e2 })).map(we);
    })), { memoryOnly: true });
  }
  function Se(e2) {
    return ue("series:" + e2, te, () => n(null, null, (function* () {
      return he(yield me("get_series", { category_id: e2 })).map(xe);
    })), { memoryOnly: true });
  }
  function _e(e2) {
    return ue("movieinfo:" + e2, ne, () => n(null, null, (function* () {
      let t2 = yield me("get_vod_info", { vod_id: e2 }), n2 = t2 && t2.info || {}, i2 = t2 && t2.movie_data || {};
      return { name: n2.name || i2.name || "", plot: n2.plot || n2.description || "", cast: n2.cast || "", director: n2.director || "", genre: n2.genre || "", releaseDate: n2.releasedate || n2.release_date || "", rating: n2.rating ? Number(n2.rating) : null, durationSecs: n2.duration_secs ? Number(n2.duration_secs) : null, poster: n2.movie_image || n2.cover_big || null, backdrops: he(n2.backdrop_path), youtubeTrailer: n2.youtube_trailer || null, ext: i2.container_extension || "mp4", streamId: String(i2.stream_id || e2) };
    })));
  }
  function Te(e2) {
    return ue("seriesinfo:" + e2, ne, () => n(null, null, (function* () {
      let t2 = yield me("get_series_info", { series_id: e2 }), n2 = t2 && t2.info || {}, i2 = t2 && t2.episodes || {}, r2 = Object.keys(i2).sort((e3, t3) => Number(e3) - Number(t3)).map((e3) => ({ number: Number(e3), episodes: he(i2[e3]).map((t3) => ({ id: String(t3.id), title: String(t3.title || "").trim(), episodeNumber: Number(t3.episode_num) || 0, season: Number(e3), ext: t3.container_extension || "mp4", plot: t3.info && t3.info.plot || "", still: t3.info && (t3.info.movie_image || t3.info.cover_big) || null, durationSecs: t3.info && t3.info.duration_secs ? Number(t3.info.duration_secs) : null })) }));
      return { name: n2.name || "", plot: n2.plot || "", cast: n2.cast || "", director: n2.director || "", genre: n2.genre || "", releaseDate: n2.releaseDate || n2.releasedate || "", rating: n2.rating ? Number(n2.rating) : null, poster: n2.cover || null, backdrops: he(n2.backdrop_path), seasons: r2 };
    })), { memoryOnly: true });
  }
  function Le(e2, t2) {
    return ue("epg:" + e2, ie, () => n(null, null, (function* () {
      let n2 = yield me("get_short_epg", { stream_id: e2, limit: t2 || 4 });
      return he(n2 && n2.epg_listings).map((e3) => ({ title: Ie(e3.title), description: Ie(e3.description), start: e3.start ? new Date(e3.start.replace(" ", "T")).getTime() : null, end: e3.end ? new Date(e3.end.replace(" ", "T")).getTime() : null, nowPlaying: "1" === String(e3.now_playing) }));
    })), { memoryOnly: true });
  }
  function Ie(e2) {
    if (!e2) return "";
    try {
      return decodeURIComponent(escape(window.atob(e2)));
    } catch (t2) {
      try {
        return window.atob(e2);
      } catch (t3) {
        return String(e2);
      }
    }
  }
  function Ne(e2, t2) {
    return ce() + "/live/" + de() + "/" + e2 + "." + (t2 || "ts");
  }
  function Ae(e2, t2) {
    return ce() + "/movie/" + de() + "/" + e2 + "." + (t2 || "mp4");
  }
  function Ee(e2, t2) {
    return ce() + "/series/" + de() + "/" + e2 + "." + (t2 || "mp4");
  }
  var Oe = {};
  t(Oe, { authenticate: () => Ye, build: () => Re, episodeUrl: () => Qe, liveCategories: () => Ke, liveStreams: () => ze, liveUrl: () => Ze, movieInfo: () => He, movieUrl: () => $e, parse: () => Ue, reset: () => et, seriesCategories: () => We, seriesInfo: () => Xe, seriesList: () => Je, shortEpg: () => Ge, vodCategories: () => Be, vodStreams: () => Ve });
  var Pe = null, Me = null;
  function Fe(e2) {
    let t2, n2 = /* @__PURE__ */ Object.create(null), i2 = /([a-zA-Z0-9-]+)="([^"]*)"/g;
    for (; null !== (t2 = i2.exec(e2)); ) n2[t2[1].toLowerCase()] = t2[2];
    return n2;
  }
  function qe(e2) {
    let t2 = e2.lastIndexOf(",");
    return -1 === t2 ? "" : e2.slice(t2 + 1).trim();
  }
  var De = [{ name: "United Kingdom", re: /\b(uk|gb|british|britain|england)\b/i }, { name: "United States", re: /\b(us|usa|united states|american)\b/i }, { name: "Egypt", re: /\b(eg|egy|egypt)\b|مصر/i }, { name: "Saudi Arabia", re: /\b(sa|ksa|saudi)\b|السعودية/i }, { name: "United Arab Emirates", re: /\b(ae|uae|emirates)\b|الامارات/i }, { name: "Qatar", re: /\b(qa|qatar)\b|قطر/i }, { name: "Kuwait", re: /\b(kw|kuwait)\b|الكويت/i }, { name: "Lebanon", re: /\b(lb|lebanon)\b|لبنان/i }, { name: "Morocco", re: /\b(ma|morocco)\b|المغرب/i }, { name: "Turkey", re: /\b(tr|turkey|turkish)\b/i }, { name: "France", re: /\b(fr|france|french)\b/i }, { name: "Germany", re: /\b(de|germany|german)\b/i }, { name: "Spain", re: /\b(es|spain|spanish)\b/i }, { name: "Italy", re: /\b(it|italy|italian)\b/i }, { name: "India", re: /\b(in|india|indian)\b/i }];
  function je(e2) {
    for (let t2 of De) if (t2.re.test(e2)) return t2.name;
    return null;
  }
  function Ue(e2) {
    let t2 = String(e2).split(/\r?\n/), n2 = /* @__PURE__ */ Object.create(null), i2 = [], r2 = null, s2 = 0, a2 = false;
    for (let e3 of t2) {
      let t3 = e3.trim();
      if (!t3) continue;
      if ("#EXTINF:" === t3.slice(0, 8)) {
        let e4 = Fe(t3), n3 = qe(t3) || e4["tvg-name"] || "Channel", i3 = (e4["group-title"] || "").trim();
        i3 && (a2 = true), r2 = { name: n3, logo: e4["tvg-logo"] || null, group: i3 || je(n3) || "Uncategorised" };
        continue;
      }
      if ("#" === t3.charAt(0) || !r2) continue;
      s2++;
      let l2 = { kind: "live", id: "m3u:" + s2, name: r2.name, logo: r2.logo, url: t3, categoryId: r2.group, number: null };
      n2[r2.group] || (n2[r2.group] = [], i2.push(r2.group)), n2[r2.group].push(l2), r2 = null;
    }
    return { categories: (a2 ? i2 : i2.slice().sort((e3, t3) => n2[t3].length - n2[e3].length)).map((e3) => ({ id: e3, name: e3 + "  (" + n2[e3].length + ")", kind: "live" })), items: n2, count: s2 };
  }
  function Re() {
    return Pe ? Promise.resolve(Pe) : Me || (Me = n(null, null, (function* () {
      let e2 = J(), t2 = yield fetch(e2.url);
      if (!t2.ok) throw new Error("Playlist download failed (HTTP " + t2.status + ")");
      let n2 = yield t2.text();
      if (-1 === n2.indexOf("#EXTM3U") && -1 === n2.indexOf("#EXTINF")) throw new Error("That URL is not an M3U playlist");
      return Pe = Ue(n2), Me = null, Pe;
    })));
  }
  function Ke() {
    return n(this, null, (function* () {
      return (yield Re()).categories;
    }));
  }
  function ze(e2) {
    return n(this, null, (function* () {
      return (yield Re()).items[e2] || [];
    }));
  }
  function Be() {
    return Promise.resolve([]);
  }
  function Ve() {
    return Promise.resolve([]);
  }
  function We() {
    return Promise.resolve([]);
  }
  function Je() {
    return Promise.resolve([]);
  }
  function He() {
    return Promise.reject(new Error("Not available"));
  }
  function Xe() {
    return Promise.reject(new Error("Not available"));
  }
  function Ge() {
    return Promise.resolve([]);
  }
  function Ze(e2, t2, n2) {
    return n2 && n2.url ? n2.url : "";
  }
  function $e() {
    return "";
  }
  function Qe() {
    return "";
  }
  function Ye() {
    return n(this, null, (function* () {
      let e2 = yield Re();
      if (!e2.count) throw new Error("That playlist has no channels in it");
      return { status: "Active", expiresAt: null, maxConnections: 0, activeConnections: 0, allowedFormats: ["m3u8"], trial: false, channelCount: e2.count };
    }));
  }
  function et() {
    Pe = null, Me = null;
  }
  var tt = {};
  t(tt, { ADULT_CATEGORY_ID: () => wt, KEEP_ADULT_SHELF: () => bt, authenticate: () => Dt, build: () => St, episodeUrl: () => qt, liveCategories: () => _t, liveStreams: () => Tt, liveUrl: () => Mt, movieInfo: () => Et, movieUrl: () => Ft, seriesCategories: () => Nt, seriesInfo: () => Ot, seriesList: () => At, shortEpg: () => Pt, stats: () => jt, vodCategories: () => Lt, vodStreams: () => It });
  var nt = ["xxx", "adult", "erotic"], it = ["xxx", "porn", "sex", "adult", "erotic", "playboy", "hustler", "brazzers", "penthouse", "private tv", "dorcel", "vivid", "redlight", "blue hustler", "hot tv", "sexy", "nudity", "eroxxx", "barely", "fetish", "babes"], rt = ["news", "sports", "movies", "series", "entertainment", "kids", "music", "documentary", "comedy", "religious", "culture", "education", "lifestyle", "animation", "science", "travel", "business", "classic", "family", "general"], st = ["EG", "SA", "AE", "QA", "KW", "LB", "JO", "MA", "DZ", "TN", "LY", "SY", "IQ", "YE", "OM", "BH", "PS", "SD", "MR", "SO", "DJ", "KM"];
  function at(e2) {
    return -1 !== st.indexOf(e2.country);
  }
  function lt(e2, t2) {
    return (e2.categories || []).some((e3) => String(e3).toLowerCase() === t2);
  }
  var ot = new RegExp("\\b(hbo|cinemax|starz|showtime|mgm|paramount|sony movies|film ?4|tcm|turner classic|amc|syfy|fx movie|movies ?24|great movies|talking pictures|sky cinema|canal\\+ cine|cine ?canal|studio universal|space|golden|rotana cinema|mbc ?2|mbc ?max|mbc ?action|art aflam|art cinema|zee cinema|star gold|sony max|dizi|fox movies|bein movies|osn movies)\\b", "i"), ut = [/\b(sky ?sports?|tnt sports?|bt sport)\b/i, /\b(movistar|dazn|gol tv|golt|laliga|real madrid tv|barca tv)\b/i, /\b(canal ?\+|rmc sport|l'?equipe|bein)\b/i, /\b(sky ?sport|dazn italia|rai sport|milan tv|inter tv|juventus)\b/i, /\b(sport1|sportdigital|magenta)\b/i, /\b(ziggo sport|espn nl|viaplay|nova sport|arena sport|sport tv)\b/i, /\b(match ?tv|setanta|футбол)\b/i, /\b(espn|fox sports?|cbs sports?|nbc sports?|tudn|tyc)\b/i, /\b(ssc|alkass|dubai sports?|abu dhabi sports?|ontime|al ?kass)\b/i], ct = /(qur'?an|quran|coran|قرآن|القرآن|tarateel|ترتيل|tilawa|تلاوة|tafsir|تفسير|makkah|مكة|madinah|المدينة|al ?haramain|الحرمين|saudi sunnah|السنة النبوية|iqraa|اقرأ|huda ?tv|peace ?tv|islam ?channel|بينونة|النور)/i, dt = [/(iqraa|اقرأ)/i, /\b(makkah|مكة|saudi qur'?an|القرآن الكريم)\b/i, /\b(madinah|المدينة|saudi sunnah|السنة)\b/i, /(tafsir|تفسير)/i, /\b(huda|peace ?tv|islam ?channel)\b/i], mt = [/\b(mbc ?masr|mbc ?مصر|إم بي سي مصر)\b/i, /\b(dmc)\b/i, /\b(cbc)\b/i, /\b(on ?e|on ?tv|قناة ?on|أون)\b/i, /(النهار|al ?nahar)/i, /(الحياة|al ?hayah|al ?hayat)/i, /(صدى البلد|sada ?el ?balad)/i, /\b(ten|تن)\b/i, /(القاهرة والناس|al ?kahera)/i, /(ontime|أون تايم)/i, /(المحور|mehwar)/i, /(روتانا مصرية|rotana masr)/i, /(extra ?news|إكسترا)/i, /(nile|النيل|المصرية)/i], ht = new RegExp("(\u0645\u0635\u0631|masr|misr|egypt|" + mt.map((e2) => e2.source).join("|") + ")", "i");
  function ft(e2, t2) {
    for (let n2 = 0; n2 < t2.length; n2++) if (t2[n2].test(e2)) return n2;
    return t2.length;
  }
  function pt(e2) {
    let t2 = /(\d+)\s*$/.exec(String(e2 || "").trim());
    return t2 ? Number(t2[1]) : 0;
  }
  var gt = [{ id: "featured:sports", name: "\u2B50  Sports Channels", match: (e2) => lt(e2, "sports"), rank: (e2) => ft(e2.name, ut) }, { id: "featured:best-movies", name: "\u2B50  Best Movie Channels", match: (e2) => ot.test(e2.name) || lt(e2, "movies"), rank: (e2) => ot.test(e2.name) ? 0 : 1 }, { id: "featured:quran", name: "\u2B50  \u0642\u0631\u0622\u0646", match: (e2) => ct.test(e2.name), rank: (e2) => ft(e2.name, dt), autoPlayFirst: true }, { id: "featured:egypt", name: "\u2B50  \u0645\u0635\u0631", match: (e2) => "EG" === e2.country || ht.test(e2.name), rank: (e2) => ft(e2.name, mt) }, { id: "featured:arab-sports", name: "\u2B50  Arab Sports", match: (e2) => at(e2) && lt(e2, "sports"), rank: (e2) => ft(e2.name, ut) }, { id: "featured:arab-news", name: "\u2B50  Arab News", match: (e2) => at(e2) && lt(e2, "news") }, { id: "featured:arab-entertainment", name: "\u2B50  Arab Entertainment", match: (e2) => at(e2) && (lt(e2, "entertainment") || lt(e2, "series") || lt(e2, "movies")) }, { id: "featured:world-news", name: "\u2B50  World News", match: (e2) => /\b(bbc|cnn|sky news|euronews|france 24|dw|al jazeera|aljazeera|rt|trt)\b/i.test(e2.name) }, { id: "featured:kids", name: "\u2B50  Kids", match: (e2) => lt(e2, "kids") || lt(e2, "animation") }, { id: "featured:documentary", name: "\u2B50  Documentary", match: (e2) => lt(e2, "documentary") }, { id: "featured:music", name: "\u2B50  Music", match: (e2) => lt(e2, "music") }], vt = null, yt = null, bt = true, wt = "adult:x";
  function xt(e2) {
    let t2 = String(e2 || "").toLowerCase();
    return /2160|4k/.test(t2) ? 0 : /1080/.test(t2) ? 1 : /720/.test(t2) ? 2 : /576|480/.test(t2) ? 3 : /360|240/.test(t2) ? 4 : 2;
  }
  function kt(e2) {
    let t2 = (e2.categories || []).map((e3) => String(e3).toLowerCase());
    for (let e3 of nt) if (-1 !== t2.indexOf(e3)) return true;
    if (true === e2.is_nsfw) return true;
    let n2 = ((e2.name || "") + " " + (e2.id || "")).toLowerCase();
    for (let e3 of it) if (-1 !== n2.indexOf(e3)) return true;
    return false;
  }
  function Ct(e2) {
    return n(this, null, (function* () {
      let t2 = yield fetch("https://iptv-org.github.io/api/" + e2 + ".json");
      if (!t2.ok) throw new Error("free playlist: " + e2 + " HTTP " + t2.status);
      return t2.json();
    }));
  }
  function St() {
    return vt ? Promise.resolve(vt) : yt || (yt = n(null, null, (function* () {
      let [e2, t2, n2] = yield Promise.all([Ct("channels"), Ct("streams"), Ct("countries")]), i2 = /* @__PURE__ */ Object.create(null);
      for (let t3 of e2) i2[t3.id] = t3;
      let r2 = /* @__PURE__ */ Object.create(null);
      for (let e3 of n2) r2[e3.code] = e3.name;
      let s2 = /* @__PURE__ */ Object.create(null), a2 = /* @__PURE__ */ Object.create(null), l2 = /* @__PURE__ */ Object.create(null), o2 = [], u2 = 0, c2 = 0, d2 = /* @__PURE__ */ new Map();
      for (let e3 of t2) !e3.url || !e3.channel || (d2.has(e3.channel) || d2.set(e3.channel, []), d2.get(e3.channel).push(e3));
      for (let [e3, t3] of d2) {
        let n3 = i2[e3];
        if (!n3) continue;
        let r3 = t3.map((t4, i3) => ({ id: "free:" + e3 + ":" + i3, url: t4.url, quality: t4.quality || null, rank: xt(t4.quality), name: n3.name || e3 })).sort((e4, t4) => e4.rank - t4.rank), d3 = { kind: "live", id: "free:" + e3, name: n3.name || e3, logo: n3.logo || null, url: r3[0].url, sources: r3, categoryId: null, number: null };
        if (kt(n3)) {
          u2++, bt && o2.push(d3);
          continue;
        }
        c2++;
        let m3 = (n3.categories || []).map((e4) => String(e4).toLowerCase());
        for (let e4 of m3.length ? m3 : ["general"]) s2[e4] || (s2[e4] = []), s2[e4].push(d3);
        let h3 = n3.country || "ZZ";
        a2[h3] || (a2[h3] = []), a2[h3].push(d3);
        for (let e4 of gt) {
          let t4 = false;
          try {
            t4 = e4.match(n3);
          } catch (e5) {
            t4 = false;
          }
          t4 && (l2[e4.id] || (l2[e4.id] = []), l2[e4.id].push(e4.rank ? Object.assign({}, d3, { __rank: e4.rank(n3) }) : d3));
        }
      }
      let m2 = [], h2 = /* @__PURE__ */ Object.create(null);
      for (let e3 of gt) {
        let t3 = l2[e3.id];
        !t3 || !t3.length || (e3.rank && t3.sort((e4, t4) => e4.__rank - t4.__rank || pt(e4.name) - pt(t4.name) || e4.name.localeCompare(t4.name)), m2.push({ id: e3.id, name: e3.name + "  (" + t3.length + ")", kind: "live", autoPlayFirst: !!e3.autoPlayFirst }), h2[e3.id] = t3);
      }
      let f2 = Object.keys(a2).sort((e3, t3) => a2[t3].length - a2[e3].length);
      for (let e3 of f2) {
        let t3 = "country:" + e3;
        m2.push({ id: t3, name: (r2[e3] || e3) + "  (" + a2[e3].length + ")", kind: "live" }), h2[t3] = a2[e3];
      }
      for (let e3 of rt) {
        if (!s2[e3] || !s2[e3].length) continue;
        let t3 = "genre:" + e3;
        m2.push({ id: t3, name: e3.charAt(0).toUpperCase() + e3.slice(1) + "  (" + s2[e3].length + ")", kind: "live" }), h2[t3] = s2[e3];
      }
      return bt && o2.length && (m2.push({ id: wt, name: "\u{1F512}  X  (" + o2.length + ")", kind: "live", locked: true }), h2[wt] = o2), yt = null, vt = { categories: m2, items: h2, kept: c2, dropped: u2 };
    })));
  }
  function _t() {
    return n(this, null, (function* () {
      return (yield St()).categories;
    }));
  }
  function Tt(e2) {
    return n(this, null, (function* () {
      return (yield St()).items[e2] || [];
    }));
  }
  function Lt() {
    return Promise.resolve([]);
  }
  function It() {
    return Promise.resolve([]);
  }
  function Nt() {
    return Promise.resolve([]);
  }
  function At() {
    return Promise.resolve([]);
  }
  function Et() {
    return Promise.reject(new Error("Not available"));
  }
  function Ot() {
    return Promise.reject(new Error("Not available"));
  }
  function Pt() {
    return Promise.resolve([]);
  }
  function Mt(e2, t2, n2) {
    return n2 && n2.url ? n2.url : "";
  }
  function Ft() {
    return "";
  }
  function qt() {
    return "";
  }
  function Dt() {
    return n(this, null, (function* () {
      let e2 = yield St();
      if (!e2.kept) throw new Error("Could not load the free playlist");
      return { status: "Active", expiresAt: null, maxConnections: 0, activeConnections: 0, allowedFormats: ["m3u8"], trial: false, channelCount: e2.kept };
    }));
  }
  function jt() {
    return vt ? { kept: vt.kept, dropped: vt.dropped } : null;
  }
  var Ut = { xtream: j, m3u: Oe, free: tt };
  function Rt() {
    return Ut[V()] || j;
  }
  function Kt() {
    let e2 = V();
    return { type: e2, hasVod: "xtream" === e2, hasSeries: "xtream" === e2, singleConnection: "xtream" === e2 };
  }
  function zt() {
    return Rt().liveCategories();
  }
  function Bt(e2) {
    return Rt().liveStreams(e2);
  }
  function Vt() {
    return Rt().vodCategories();
  }
  function Wt(e2) {
    return Rt().vodStreams(e2);
  }
  function Jt() {
    return Rt().seriesCategories();
  }
  function Ht(e2) {
    return Rt().seriesList(e2);
  }
  function Xt(e2) {
    return Rt().movieInfo(e2);
  }
  function Gt(e2, t2, n2) {
    return Rt().liveUrl(e2, t2, n2);
  }
  function Zt(e2, t2) {
    return Rt().movieUrl(e2, t2);
  }
  var $t = "iptv:language", Qt = [{ code: "en", label: "English" }, { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", rtl: true }, { code: "es", label: "Espa\xF1ol" }, { code: "fr", label: "Fran\xE7ais" }, { code: "tr", label: "T\xFCrk\xE7e" }, { code: "de", label: "Deutsch" }], Yt = { en: { "nav.continue": "Continue Watching", "nav.favorites": "Favourites", "nav.search": "Search", "nav.home": "Home", "nav.live": "Live TV", "nav.movies": "Movies", "nav.series": "Series", "nav.settings": "Settings", "nav.freetv": "Free TV", "welcome.question": "How would you like to watch?", "welcome.xtream": "Xtream account", "welcome.xtreamDetail": "A portal URL with a username and password. Live TV, films and series.", "welcome.m3u": "M3U playlist", "welcome.m3uDetail": "A playlist URL from your provider. Live channels.", "welcome.free": "Watch our free playlist", "welcome.freeDetail": "Thousands of public channels from around the world. Nothing to enter.", "welcome.serverUrl": "Server URL", "welcome.username": "Username", "welcome.password": "Password", "welcome.playlistUrl": "Playlist URL", "welcome.signIn": "Sign in", "welcome.back": "Back", "welcome.connecting": "Connecting\u2026", "welcome.loadingChannels": "Loading channels\u2026", "welcome.fillAll": "Fill in all three fields.", "welcome.wrongLogin": "Wrong username or password.", "welcome.enterPlaylist": "Enter your playlist URL.", "home.spotlight": "Recommended", "home.play": "Play", "home.moreInfo": "More info", "home.continue": "Continue Watching", "home.favorites": "My Favourites", "browse.categories": "Categories", "browse.search": "Search", "browse.preview": "Preview", "browse.pressOkPreview": "Press OK to preview", "browse.pressOkFull": "Press OK again for full screen", "browse.noResponse": "This channel did not respond", "browse.freeChannels": "Free channels", "search.placeholder": "Search channels, movies and series", "search.minChars": "Type at least two characters.", "search.preparing": "Preparing\u2026", "search.nothing": "Nothing found", "search.channels": "Channels", "search.movies": "Movies", "search.series": "Series", "player.skipIntro": "Skip intro", "player.nextEpisode": "Next episode", "player.quality": "Quality", "player.upNext": "Up next", "player.playNext": "Play next episode", "player.unavailable": "This channel is not available right now.", "player.fit": "Fit", "player.fill": "Fill screen", "player.stretch": "Stretch", "details.play": "Play", "details.resume": "Resume", "details.favorite": "Favourite", "details.season": "Season", "details.couldNotLoad": "Could not load details.", "favorites.empty": "Nothing saved yet. Press the yellow button on any channel or title to add it.", "favorites.added": "Added to favourites", "favorites.removed": "Removed from favourites", "continue.empty": "Nothing in progress. Anything you start will show up here.", "continue.hint": "Press the yellow button to remove something from this list.", "continue.removed": "Removed from Continue Watching", "continue.minLeft": "min left", "settings.title": "Settings", "settings.language": "Language", "settings.languageDetail": "The language the app itself is shown in.", "settings.on": "On", "settings.off": "Off", "lock.locked": "Locked", "lock.enterPin": "Enter PIN", "lock.wrongPin": "Wrong PIN" }, ar: { "nav.continue": "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0629", "nav.favorites": "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", "nav.search": "\u0628\u062D\u062B", "nav.home": "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", "nav.live": "\u0627\u0644\u0628\u062B \u0627\u0644\u0645\u0628\u0627\u0634\u0631", "nav.movies": "\u0623\u0641\u0644\u0627\u0645", "nav.series": "\u0645\u0633\u0644\u0633\u0644\u0627\u062A", "nav.settings": "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", "nav.freetv": "\u0642\u0646\u0648\u0627\u062A \u0645\u062C\u0627\u0646\u064A\u0629", "welcome.question": "\u0625\u0632\u0627\u064A \u062A\u062D\u0628 \u062A\u062A\u0641\u0631\u062C\u061F", "welcome.xtream": "\u062D\u0633\u0627\u0628 Xtream", "welcome.xtreamDetail": "\u0631\u0627\u0628\u0637 \u0627\u0644\u0633\u064A\u0631\u0641\u0631 \u0645\u0639 \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631. \u0642\u0646\u0648\u0627\u062A \u0648\u0623\u0641\u0644\u0627\u0645 \u0648\u0645\u0633\u0644\u0633\u0644\u0627\u062A.", "welcome.m3u": "\u0642\u0627\u0626\u0645\u0629 M3U", "welcome.m3uDetail": "\u0631\u0627\u0628\u0637 \u0642\u0627\u0626\u0645\u0629 \u062A\u0634\u063A\u064A\u0644 \u0645\u0646 \u0645\u0632\u0648\u0651\u062F\u0643. \u0642\u0646\u0648\u0627\u062A \u0645\u0628\u0627\u0634\u0631\u0629.", "welcome.free": "\u0634\u0627\u0647\u062F \u0642\u0627\u0626\u0645\u062A\u0646\u0627 \u0627\u0644\u0645\u062C\u0627\u0646\u064A\u0629", "welcome.freeDetail": "\u0622\u0644\u0627\u0641 \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629 \u0645\u0646 \u0643\u0644 \u0627\u0644\u0639\u0627\u0644\u0645. \u0645\u0646 \u063A\u064A\u0631 \u0645\u0627 \u062A\u062F\u062E\u0644 \u0623\u064A \u062D\u0627\u062C\u0629.", "welcome.serverUrl": "\u0631\u0627\u0628\u0637 \u0627\u0644\u0633\u064A\u0631\u0641\u0631", "welcome.username": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", "welcome.password": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631", "welcome.playlistUrl": "\u0631\u0627\u0628\u0637 \u0627\u0644\u0642\u0627\u0626\u0645\u0629", "welcome.signIn": "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644", "welcome.back": "\u0631\u062C\u0648\u0639", "welcome.connecting": "\u062C\u0627\u0631\u064A \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u2026", "welcome.loadingChannels": "\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0642\u0646\u0648\u0627\u062A\u2026", "welcome.fillAll": "\u0627\u0645\u0644\u0623 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u062B\u0644\u0627\u062B\u0629.", "welcome.wrongLogin": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629.", "welcome.enterPlaylist": "\u0623\u062F\u062E\u0644 \u0631\u0627\u0628\u0637 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.", "home.spotlight": "\u0645\u064F\u0642\u062A\u0631\u062D \u0644\u0643", "home.play": "\u062A\u0634\u063A\u064A\u0644", "home.moreInfo": "\u062A\u0641\u0627\u0635\u064A\u0644", "home.continue": "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0629", "home.favorites": "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", "browse.categories": "\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A", "browse.search": "\u0628\u062D\u062B", "browse.preview": "\u0645\u0639\u0627\u064A\u0646\u0629", "browse.pressOkPreview": "\u0627\u0636\u063A\u0637 OK \u0644\u0644\u0645\u0639\u0627\u064A\u0646\u0629", "browse.pressOkFull": "\u0627\u0636\u063A\u0637 OK \u0645\u0631\u0629 \u062A\u0627\u0646\u064A\u0629 \u0644\u0645\u0644\u0621 \u0627\u0644\u0634\u0627\u0634\u0629", "browse.noResponse": "\u0627\u0644\u0642\u0646\u0627\u0629 \u062F\u064A \u0645\u0634 \u0645\u0633\u062A\u062C\u064A\u0628\u0629", "browse.freeChannels": "\u0642\u0646\u0648\u0627\u062A \u0645\u062C\u0627\u0646\u064A\u0629", "search.placeholder": "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0648\u0627\u0644\u0623\u0641\u0644\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0644\u0633\u0644\u0627\u062A", "search.minChars": "\u0627\u0643\u062A\u0628 \u062D\u0631\u0641\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.", "search.preparing": "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0636\u064A\u0631\u2026", "search.nothing": "\u0645\u0641\u064A\u0634 \u0646\u062A\u0627\u0626\u062C", "search.channels": "\u0642\u0646\u0648\u0627\u062A", "search.movies": "\u0623\u0641\u0644\u0627\u0645", "search.series": "\u0645\u0633\u0644\u0633\u0644\u0627\u062A", "player.skipIntro": "\u062A\u062E\u0637\u064A \u0627\u0644\u0645\u0642\u062F\u0645\u0629", "player.nextEpisode": "\u0627\u0644\u062D\u0644\u0642\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629", "player.quality": "\u0627\u0644\u062C\u0648\u062F\u0629", "player.upNext": "\u0627\u0644\u062A\u0627\u0644\u064A", "player.playNext": "\u0634\u063A\u0651\u0644 \u0627\u0644\u062D\u0644\u0642\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629", "player.unavailable": "\u0627\u0644\u0642\u0646\u0627\u0629 \u062F\u064A \u0645\u0634 \u0645\u062A\u0627\u062D\u0629 \u062F\u0644\u0648\u0642\u062A\u064A.", "player.fit": "\u0645\u0644\u0627\u0626\u0645", "player.fill": "\u0645\u0644\u0621 \u0627\u0644\u0634\u0627\u0634\u0629", "player.stretch": "\u062A\u0645\u062F\u064A\u062F", "details.play": "\u062A\u0634\u063A\u064A\u0644", "details.resume": "\u0645\u062A\u0627\u0628\u0639\u0629", "details.favorite": "\u0627\u0644\u0645\u0641\u0636\u0644\u0629", "details.season": "\u0627\u0644\u0645\u0648\u0633\u0645", "details.couldNotLoad": "\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644.", "favorites.empty": "\u0645\u0641\u064A\u0634 \u062D\u0627\u062C\u0629 \u0645\u062D\u0641\u0648\u0638\u0629. \u0627\u0636\u063A\u0637 \u0627\u0644\u0632\u0631 \u0627\u0644\u0623\u0635\u0641\u0631 \u0639\u0644\u0649 \u0623\u064A \u0642\u0646\u0627\u0629 \u0623\u0648 \u0639\u0645\u0644 \u0644\u0625\u0636\u0627\u0641\u062A\u0647.", "favorites.added": "\u062A\u0645\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0645\u0641\u0636\u0644\u0629", "favorites.removed": "\u062A\u0645 \u0627\u0644\u062D\u0630\u0641 \u0645\u0646 \u0627\u0644\u0645\u0641\u0636\u0644\u0629", "continue.empty": "\u0645\u0641\u064A\u0634 \u062D\u0627\u062C\u0629 \u0642\u064A\u062F \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0629. \u0623\u064A \u062D\u0627\u062C\u0629 \u062A\u0628\u062F\u0623\u0647\u0627 \u0647\u062A\u0638\u0647\u0631 \u0647\u0646\u0627.", "continue.hint": "\u0627\u0636\u063A\u0637 \u0627\u0644\u0632\u0631 \u0627\u0644\u0623\u0635\u0641\u0631 \u0644\u062D\u0630\u0641 \u0623\u064A \u062D\u0627\u062C\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u062F\u064A.", "continue.removed": "\u062A\u0645 \u0627\u0644\u062D\u0630\u0641 \u0645\u0646 \u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0629", "continue.minLeft": "\u062F\u0642\u064A\u0642\u0629 \u0645\u062A\u0628\u0642\u064A\u0629", "settings.title": "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", "settings.language": "\u0627\u0644\u0644\u063A\u0629", "settings.languageDetail": "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0644\u064A \u0628\u064A\u0638\u0647\u0631 \u0628\u064A\u0647\u0627 \u0627\u0644\u0623\u0628 \u0646\u0641\u0633\u0647.", "settings.on": "\u0645\u0641\u0639\u0651\u0644", "settings.off": "\u0645\u062A\u0648\u0642\u0641", "lock.locked": "\u0645\u0642\u0641\u0648\u0644", "lock.enterPin": "\u0623\u062F\u062E\u0644 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0633\u0631\u064A", "lock.wrongPin": "\u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D" }, es: { "nav.continue": "Seguir viendo", "nav.favorites": "Favoritos", "nav.search": "Buscar", "nav.home": "Inicio", "nav.live": "TV en vivo", "nav.movies": "Pel\xEDculas", "nav.series": "Series", "nav.settings": "Ajustes", "nav.freetv": "TV gratis", "welcome.question": "\xBFC\xF3mo quieres ver?", "welcome.xtream": "Cuenta Xtream", "welcome.xtreamDetail": "Una URL de portal con usuario y contrase\xF1a. TV, pel\xEDculas y series.", "welcome.m3u": "Lista M3U", "welcome.m3uDetail": "Una URL de lista de tu proveedor. Canales en vivo.", "welcome.free": "Ver nuestra lista gratuita", "welcome.freeDetail": "Miles de canales p\xFAblicos de todo el mundo. Sin registrarte.", "welcome.signIn": "Entrar", "welcome.back": "Atr\xE1s", "home.spotlight": "Recomendado", "home.play": "Reproducir", "home.moreInfo": "M\xE1s informaci\xF3n", "home.continue": "Seguir viendo", "home.favorites": "Mis favoritos", "browse.categories": "Categor\xEDas", "browse.search": "Buscar", "browse.preview": "Vista previa", "browse.pressOkPreview": "Pulsa OK para la vista previa", "browse.pressOkFull": "Pulsa OK otra vez para pantalla completa", "search.placeholder": "Busca canales, pel\xEDculas y series", "search.minChars": "Escribe al menos dos letras.", "player.skipIntro": "Saltar intro", "player.nextEpisode": "Siguiente episodio", "player.quality": "Calidad", "player.upNext": "A continuaci\xF3n", "player.fit": "Ajustar", "player.fill": "Llenar pantalla", "player.stretch": "Estirar", "details.play": "Reproducir", "details.resume": "Continuar", "details.favorite": "Favorito", "details.season": "Temporada", "settings.title": "Ajustes", "settings.language": "Idioma", "settings.on": "S\xED", "settings.off": "No", "lock.enterPin": "Introduce el PIN" }, fr: { "nav.continue": "Reprendre", "nav.favorites": "Favoris", "nav.search": "Rechercher", "nav.home": "Accueil", "nav.live": "TV en direct", "nav.movies": "Films", "nav.series": "S\xE9ries", "nav.settings": "Param\xE8tres", "nav.freetv": "TV gratuite", "welcome.question": "Comment voulez-vous regarder ?", "welcome.xtream": "Compte Xtream", "welcome.xtreamDetail": "Une URL de portail avec identifiant et mot de passe. TV, films et s\xE9ries.", "welcome.m3u": "Playlist M3U", "welcome.m3uDetail": "Une URL de playlist de votre fournisseur. Cha\xEEnes en direct.", "welcome.free": "Voir notre playlist gratuite", "welcome.freeDetail": "Des milliers de cha\xEEnes publiques du monde entier. Rien \xE0 saisir.", "welcome.signIn": "Se connecter", "welcome.back": "Retour", "home.spotlight": "Recommand\xE9", "home.play": "Lecture", "home.moreInfo": "Plus d\u2019infos", "home.continue": "Reprendre", "home.favorites": "Mes favoris", "browse.categories": "Cat\xE9gories", "browse.search": "Rechercher", "browse.preview": "Aper\xE7u", "browse.pressOkPreview": "Appuyez sur OK pour l\u2019aper\xE7u", "browse.pressOkFull": "Appuyez de nouveau pour le plein \xE9cran", "search.placeholder": "Rechercher cha\xEEnes, films et s\xE9ries", "search.minChars": "Saisissez au moins deux lettres.", "player.skipIntro": "Passer l\u2019intro", "player.nextEpisode": "\xC9pisode suivant", "player.quality": "Qualit\xE9", "player.upNext": "\xC0 suivre", "player.fit": "Ajuster", "player.fill": "Plein \xE9cran", "player.stretch": "\xC9tirer", "details.play": "Lecture", "details.resume": "Reprendre", "details.favorite": "Favori", "details.season": "Saison", "settings.title": "Param\xE8tres", "settings.language": "Langue", "settings.on": "Activ\xE9", "settings.off": "D\xE9sactiv\xE9", "lock.enterPin": "Saisissez le code" }, tr: { "nav.continue": "\u0130zlemeye devam et", "nav.favorites": "Favoriler", "nav.search": "Ara", "nav.home": "Ana sayfa", "nav.live": "Canl\u0131 TV", "nav.movies": "Filmler", "nav.series": "Diziler", "nav.settings": "Ayarlar", "nav.freetv": "\xDCcretsiz TV", "welcome.question": "Nas\u0131l izlemek istersiniz?", "welcome.xtream": "Xtream hesab\u0131", "welcome.m3u": "M3U listesi", "welcome.free": "\xDCcretsiz listemizi izleyin", "welcome.signIn": "Giri\u015F yap", "welcome.back": "Geri", "home.spotlight": "\xD6nerilen", "home.play": "Oynat", "home.moreInfo": "Daha fazla bilgi", "browse.categories": "Kategoriler", "browse.search": "Ara", "browse.preview": "\xD6nizleme", "search.minChars": "En az iki harf yaz\u0131n.", "player.skipIntro": "Jeneri\u011Fi ge\xE7", "player.nextEpisode": "Sonraki b\xF6l\xFCm", "player.quality": "Kalite", "player.upNext": "S\u0131rada", "details.play": "Oynat", "details.season": "Sezon", "settings.title": "Ayarlar", "settings.language": "Dil", "settings.on": "A\xE7\u0131k", "settings.off": "Kapal\u0131" }, de: { "nav.continue": "Weiterschauen", "nav.favorites": "Favoriten", "nav.search": "Suche", "nav.home": "Start", "nav.live": "Live-TV", "nav.movies": "Filme", "nav.series": "Serien", "nav.settings": "Einstellungen", "nav.freetv": "Gratis-TV", "welcome.question": "Wie m\xF6chten Sie schauen?", "welcome.xtream": "Xtream-Konto", "welcome.m3u": "M3U-Playlist", "welcome.free": "Unsere kostenlose Playlist", "welcome.signIn": "Anmelden", "welcome.back": "Zur\xFCck", "home.spotlight": "Empfohlen", "home.play": "Abspielen", "home.moreInfo": "Mehr Infos", "browse.categories": "Kategorien", "browse.search": "Suche", "browse.preview": "Vorschau", "search.minChars": "Mindestens zwei Zeichen eingeben.", "player.skipIntro": "Intro \xFCberspringen", "player.nextEpisode": "N\xE4chste Folge", "player.quality": "Qualit\xE4t", "player.upNext": "Als N\xE4chstes", "details.play": "Abspielen", "details.season": "Staffel", "settings.title": "Einstellungen", "settings.language": "Sprache", "settings.on": "An", "settings.off": "Aus" } }, en = null;
  function tn() {
    let e2 = "";
    try {
      e2 = (navigator.language || "").toLowerCase();
    } catch (e3) {
    }
    for (let t2 of Qt) if (0 === e2.indexOf(t2.code)) return t2.code;
    return "en";
  }
  function nn() {
    if (en) return en;
    try {
      en = localStorage.getItem($t) || tn();
    } catch (e2) {
      en = tn();
    }
    return en;
  }
  function rn() {
    document.documentElement.setAttribute("dir", (function() {
      let e2 = Qt.filter((e3) => e3.code === nn())[0];
      return !(!e2 || !e2.rtl);
    })() ? "rtl" : "ltr"), document.documentElement.setAttribute("lang", nn());
  }
  function sn(e2) {
    return (Yt[nn()] || Yt.en)[e2] || Yt.en[e2] || e2;
  }
  var an = "http://www.w3.org/2000/svg", ln = 0;
  function on(e2) {
    let t2 = "brand-grad-" + ++ln, n2 = document.createElementNS(an, "svg");
    n2.setAttribute("viewBox", "0 0 100 100"), n2.setAttribute("width", String(e2 || 44)), n2.setAttribute("height", String(e2 || 44)), n2.setAttribute("class", "logo-mark"), n2.setAttribute("aria-hidden", "true");
    let i2 = document.createElementNS(an, "defs"), r2 = document.createElementNS(an, "linearGradient");
    r2.setAttribute("id", t2), r2.setAttribute("x1", "0"), r2.setAttribute("y1", "0"), r2.setAttribute("x2", "0"), r2.setAttribute("y2", "1");
    let s2 = document.createElementNS(an, "stop");
    s2.setAttribute("offset", "0"), s2.setAttribute("stop-color", "#ff4d4d");
    let a2 = document.createElementNS(an, "stop");
    a2.setAttribute("offset", "1"), a2.setAttribute("stop-color", "#c40810"), r2.appendChild(s2), r2.appendChild(a2), i2.appendChild(r2), n2.appendChild(i2);
    let l2 = document.createElementNS(an, "path");
    l2.setAttribute("d", "M50 6 L94 90 L70 90 L50 52 L30 90 L6 90 Z"), l2.setAttribute("fill", "url(#" + t2 + ")"), n2.appendChild(l2);
    let o2 = document.createElementNS(an, "path");
    return o2.setAttribute("d", "M42 62 L66 77 L42 92 Z"), o2.setAttribute("fill", "#ffffff"), n2.appendChild(o2), n2;
  }
  function un(e2) {
    let t2 = document.createElement("span");
    t2.className = "logo-lockup", t2.appendChild(on(e2 || 44));
    let n2 = document.createElement("span");
    n2.className = "logo-word";
    let i2 = document.createElement("span");
    i2.className = "logo-word-owner", i2.textContent = "ARAFA\u2019S";
    let r2 = document.createElement("span");
    return r2.className = "logo-word-kind", r2.textContent = "IPTV", n2.appendChild(i2), n2.appendChild(r2), t2.appendChild(n2), t2;
  }
  var cn = [{ id: "continue", icon: "\u25B6", key: "nav.continue" }, { id: "favorites", icon: "\u2605", key: "nav.favorites" }, { id: "search", icon: "\u2315", key: "nav.search" }, { id: "home", icon: "\u2302", key: "nav.home" }, { id: "live", icon: "\u25A4", key: "nav.live", needs: "live" }, { id: "movies", icon: "\u{1F3AC}", key: "nav.movies", needs: "vod" }, { id: "series", icon: "\u{1F4FA}", key: "nav.series", needs: "series" }, { id: "settings", icon: "\u2699", key: "nav.settings" }, { id: "freetv", icon: "\u{1F310}", key: "nav.freetv", personalOnly: true }];
  function dn() {
    let e2 = i("nav", { class: "rail", "data-focus-memory": "rail", "data-focus-contain": "vertical" }), t2 = i("div", { class: "rail-brand" }), n2 = i("span", { class: "rail-brand-mark" });
    n2.appendChild(on(44));
    let r2 = i("span", { class: "rail-brand-full" });
    r2.appendChild(un(44)), t2.appendChild(n2), t2.appendChild(r2), e2.appendChild(t2);
    let s2 = {};
    for (let t3 of cn) {
      t3.personalOnly, 0;
      let n3 = i("div", { class: "rail-item focusable" + ("freetv" === t3.id ? " rail-item-last" : ""), "data-route": t3.id }, [i("span", { class: "rail-icon", text: t3.icon }), i("span", { class: "rail-label", text: sn(t3.key) })]);
      n3.__needs = t3.needs || null, s2[t3.id] = n3, e2.appendChild(n3);
    }
    function a2() {
      let e3 = Kt();
      for (let t3 of Object.keys(s2)) {
        let n3 = s2[t3].__needs, i2 = "vod" === n3 ? e3.hasVod : "series" !== n3 || e3.hasSeries;
        s2[t3].hidden = !i2;
      }
    }
    let l2 = null;
    return e2.addEventListener("focus-enter", (t3) => {
      let n3 = e2.contains(t3.target);
      if (e2.classList.toggle("expanded", n3), !n3 || d) return;
      let i2 = t3.target.closest(".rail-item");
      i2 && (function(e3) {
        l2 && clearTimeout(l2), l2 = setTimeout(() => {
          l2 = null, e3 !== I() && A(e3, {});
        }, 260);
      })(i2.getAttribute("data-route"));
    }), e2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target.closest(".rail-item");
      if (!t3) return;
      l2 && (clearTimeout(l2), l2 = null);
      let n3 = t3.getAttribute("data-route");
      n3 !== I() && A(n3, {});
    }), document.addEventListener("focus-moved", (t3) => {
      e2.contains(t3.detail.node) || e2.classList.remove("expanded");
    }), a2(), { node: e2, syncCapabilities: a2, setCurrent(e3) {
      for (let t3 of Object.keys(s2)) s2[t3].classList.toggle("current", t3 === e3);
    }, button: (e3) => s2[e3], collapse() {
      e2.classList.remove("expanded");
    } };
  }
  var mn = [{ rank: 0, tag: "4K", re: /(^|[\s\[\(_-])(4k|uhd|2160p?)([\s\]\)_-]|$)/i }, { rank: 1, tag: "FHD", re: /(^|[\s\[\(_-])(fhd|1080p?)([\s\]\)_-]|$)/i }, { rank: 2, tag: "HD", re: /(^|[\s\[\(_-])(hd|720p?)([\s\]\)_-]|$)/i }, { rank: 3, tag: "SD", re: /(^|[\s\[\(_-])(sd|480p?|420p?|low)([\s\]\)_-]|$)/i }];
  function hn(e2) {
    for (let t2 of mn) if (t2.re.test(e2)) return t2;
    return null;
  }
  function fn(e2) {
    let t2 = String(e2 || "");
    return t2 = t2.replace(/\[[^\]]*\]/g, " "), t2 = t2.replace(/\([^)]*\)/g, " "), t2 = t2.replace(/(^|[\s_-])(4k|uhd|2160p?|fhd|1080p?|hd|720p?|sd|480p?|420p?|low|h\s?265|h\s?264|hevc|raw|backup|multi|vip)([\s_-]|$)/gi, " "), t2 = t2.replace(/[|:_\-–—]+/g, " "), t2 = t2.replace(/\s+/g, " ").trim(), t2 = t2.replace(/\s+[A-Za-z]$/, ""), t2.toLowerCase().trim();
  }
  var pn = null, gn = null;
  function vn(e2) {
    let t2 = { id: e2.id, name: e2.name, logo: e2.logo, categoryId: e2.categoryId, quality: (hn(e2.name) || {}).tag || null, rank: null != (hn(e2.name) || {}).rank ? hn(e2.name).rank : 2 };
    if (!pn) return [t2];
    let n2 = pn[fn(e2.name)];
    if (!n2 || n2.length <= 1) return [t2];
    let i2 = n2.filter((t3) => t3.id !== e2.id);
    return [t2].concat(i2);
  }
  var yn = 37, bn = 38, wn = 39, xn = 40, kn = 13, Cn = 461, Sn = 8, _n = 27, Tn = 404, Ln = 405, In = 406, Nn = 415, An = 19, En = 179, On = 413, Pn = 412, Mn = 417, Fn = 33, qn = 34, Dn = { [yn]: "left", [bn]: "up", [wn]: "right", [xn]: "down" };
  function jn(e2) {
    return e2 === Cn || e2 === Sn || e2 === _n;
  }
  function Un(e2) {
    return e2 === kn;
  }
  var Rn = "0123456789".split(""), Kn = "abcdefghijklmnopqrstuvwxyz".split(""), zn = { ar: { label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", columns: 10, keys: "\u0627 \u0628 \u062A \u062B \u062C \u062D \u062E \u062F \u0630 \u0631 \u0632 \u0633 \u0634 \u0635 \u0636 \u0637 \u0638 \u0639 \u063A \u0641 \u0642 \u0643 \u0644 \u0645 \u0646 \u0647 \u0648 \u064A \u0621 \u0623 \u0625 \u0622 \u0629 \u0649 \u0626 \u0624".split(" ") }, en: { label: "English", columns: 10, keys: Kn }, es: { label: "Espa\xF1ol", columns: 10, keys: Kn.concat("\xF1 \xE1 \xE9 \xED \xF3 \xFA \xFC".split(" ")) }, fr: { label: "Fran\xE7ais", columns: 10, keys: Kn.concat("\xE0 \xE2 \xE7 \xE9 \xE8 \xEA \xEB \xEE \xEF \xF4 \xF9 \xFB".split(" ")) } }, Bn = { tr: { label: "T\xFCrk\xE7e", columns: 10, keys: Kn.concat("\xE7 \u011F \u0131 \xF6 \u015F \xFC".split(" ")) }, de: { label: "Deutsch", columns: 10, keys: Kn.concat("\xE4 \xF6 \xFC \xDF".split(" ")) }, ru: { label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", columns: 11, keys: "\u0430 \u0431 \u0432 \u0433 \u0434 \u0435 \u0451 \u0436 \u0437 \u0438 \u0439 \u043A \u043B \u043C \u043D \u043E \u043F \u0440 \u0441 \u0442 \u0443 \u0444 \u0445 \u0446 \u0447 \u0448 \u0449 \u044A \u044B \u044C \u044D \u044E \u044F".split(" ") }, pt: { label: "Portugu\xEAs", columns: 10, keys: Kn.concat("\xE3 \xE1 \xE2 \xE0 \xE7 \xE9 \xEA \xED \xF3 \xF4 \xF5 \xFA".split(" ")) }, it: { label: "Italiano", columns: 10, keys: Kn.concat("\xE0 \xE8 \xE9 \xEC \xF2 \xF9".split(" ")) }, hi: { label: "\u0939\u093F\u0928\u094D\u0926\u0940", columns: 11, keys: "\u0905 \u0906 \u0907 \u0908 \u0909 \u090A \u090F \u0910 \u0913 \u0914 \u0915 \u0916 \u0917 \u0918 \u091A \u091B \u091C \u091D \u091F \u0920 \u0921 \u0922 \u0923 \u0924 \u0925 \u0926 \u0927 \u0928 \u092A \u092B \u092C \u092D \u092E \u092F \u0930 \u0932 \u0935 \u0936 \u0937 \u0938 \u0939".split(" ") } }, Vn = Object.assign({}, zn, Bn), Wn = [".", "-", "_", ":", "/", "@"];
  function Jn(e2) {
    let t2 = e2 || {}, n2 = t2.onChange || function() {
    }, s2 = t2.onSubmit || null, a2 = t2.language || "ar", l2 = false, o2 = null, u2 = i("div", { class: "kb-suggestions", hidden: "hidden" }), c2 = i("div", { class: "kb-languages" }), d2 = i("div", { class: "kb-keys" }), m2 = i("div", { class: "kb-actions" }), h2 = i("div", { class: "keyboard", "data-focus-memory": "keyboard" }, [u2, c2, d2, m2]), f2 = t2.suggest || null;
    function p2() {
      if (!f2) return;
      let e3 = o2 ? o2.value : "", t3 = [];
      try {
        t3 = f2(e3) || [];
      } catch (e4) {
        t3 = [];
      }
      if (r(u2), t3.length) {
        for (let e4 of t3.slice(0, 6)) {
          let t4 = "string" == typeof e4 ? e4 : e4.text, n3 = i("div", { class: "kb-suggestion focusable", dir: "auto", text: "string" == typeof e4 ? e4 : e4.label || e4.text });
          n3.__press = () => {
            o2 && (o2.value = t4, w2());
          }, u2.appendChild(n3);
        }
        u2.hidden = false;
      } else u2.hidden = true;
    }
    function g2(e3) {
      o2 && (o2.value = o2.value + e3, w2());
    }
    function y2() {
      !o2 || !o2.value || (o2.value = o2.value.slice(0, -1), w2());
    }
    function b2() {
      o2 && (o2.value = "", w2());
    }
    function w2() {
      o2 && o2.dispatchEvent(new Event("input", { bubbles: true })), p2(), n2(o2 ? o2.value : "");
    }
    function x2(e3, t3, n3, r2) {
      let s3 = i("div", { class: "kb-key focusable" + (t3 ? " " + t3 : "") + (r2 ? " kb-key-wide" : ""), text: e3 });
      return s3.__press = n3, s3;
    }
    function k2() {
      r(c2);
      let e3 = Object.keys(l2 ? Vn : zn);
      for (let t3 of e3) {
        let e4 = i("div", { class: "kb-lang focusable" + (t3 === a2 ? " active" : ""), text: Vn[t3].label });
        e4.__press = () => {
          a2 = t3, k2(), C2();
        }, c2.appendChild(e4);
      }
      if (!l2) {
        let e4 = i("div", { class: "kb-lang kb-lang-more focusable", text: "More\u2026" });
        e4.__press = () => {
          l2 = true, k2();
        }, c2.appendChild(e4);
      }
    }
    function C2() {
      r(d2);
      let e3 = Vn[a2], t3 = e3.columns, n3 = "calc((100% - " + 10 * (t3 - 1) + "px) / " + t3 + ")";
      e3.keys.map((e4) => x2(e4, null, () => g2(e4))).concat(Rn.map((e4) => x2(e4, "kb-key-digit", () => g2(e4)))).concat(Wn.map((e4) => x2(e4, "kb-key-symbol", () => g2(e4)))).forEach((e4, i2) => (function(e5, t4) {
        e5.style.width = n3, t4 && (e5.style.marginRight = "0"), d2.appendChild(e5);
      })(e4, (i2 + 1) % t3 == 0));
    }
    return h2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target.closest(".kb-key, .kb-lang, .kb-suggestion");
      t3 && t3.__press && t3.__press();
    }), k2(), C2(), r(m2), m2.appendChild(x2("Space", "kb-key-space", () => g2(" "), true)), m2.appendChild(x2("\u232B  Delete", "kb-key-action", y2, true)), m2.appendChild(x2("Clear", "kb-key-action", b2, true)), s2 && m2.appendChild(x2("\u2315  Search", "kb-key-submit", () => s2(), true)), { node: h2, setTarget(e3) {
      (function(e4) {
        o2 = e4;
      })(e3), p2();
    }, refreshSuggestions: p2, setLanguage(e3) {
      Vn[e3] && (a2 = e3, k2(), C2());
    }, firstKey: () => d2.querySelector(".kb-key"), focusFirst() {
      v(d2.querySelector(".kb-key"));
    } };
  }
  var Hn = "iptv:searchHistory";
  function Xn() {
    try {
      let e2 = JSON.parse(localStorage.getItem(Hn));
      return Array.isArray(e2) ? e2 : [];
    } catch (e2) {
      return [];
    }
  }
  function Gn(e2) {
    let t2 = String(e2 || "").trim();
    if (t2.length < 2) return;
    let n2 = Xn().filter((e3) => e3 !== t2);
    n2.unshift(t2), n2.length > 20 && (n2.length = 20);
    try {
      localStorage.setItem(Hn, JSON.stringify(n2));
    } catch (e3) {
    }
  }
  function Zn(e2, t2, n2) {
    let i2 = (function(e3) {
      return String(e3 || "").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[آأإ]/g, "\u0627").replace(/ة/g, "\u0647").replace(/ى/g, "\u064A").replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
    })(t2);
    if (i2.length < 1) return [];
    let r2 = [], s2 = [], a2 = /* @__PURE__ */ Object.create(null);
    for (let t3 of e2) {
      if (r2.length >= (n2 || 6)) break;
      let e3 = t3.key.indexOf(i2);
      if (-1 === e3) continue;
      let l3 = t3.item.name;
      a2[l3] || (a2[l3] = true, 0 === e3 ? r2.push(l3) : s2.length < (n2 || 6) && s2.push(l3));
    }
    let l2 = (e3, t3) => e3.length - t3.length;
    return r2.sort(l2).concat(s2.sort(l2)).slice(0, n2 || 6);
  }
  var $n = ["@gmail.com", "@hotmail.com", "@yahoo.com", "@outlook.com", "@icloud.com"];
  var Qn = ["http://", "https://", ".com", ".net", ".tv", ":8080", ":80", ":2052"];
  var Yn = [{ id: "xtream", icon: "\u2302", titleKey: "welcome.xtream", detailKey: "welcome.xtreamDetail" }, { id: "m3u", icon: "\u2261", titleKey: "welcome.m3u", detailKey: "welcome.m3uDetail" }, { id: "free", icon: "\u2605", titleKey: "welcome.free", detailKey: "welcome.freeDetail" }];
  function ei() {
    let e2 = W() || U, t2 = false, s2 = null, a2 = i("div", { class: "login-error" }), l2 = i("div", { class: "welcome-options", "data-focus-memory": "welcome" });
    for (let e3 of Yn) {
      let t3 = i("div", { class: "welcome-option focusable" }, [i("span", { class: "welcome-option-icon", text: e3.icon }), i("div", { class: "welcome-option-text" }, [i("div", { class: "welcome-option-title", text: sn(e3.titleKey) }), i("div", { class: "welcome-option-detail", text: sn(e3.detailKey) })])]);
      t3.__option = e3, l2.appendChild(t3);
    }
    function o2(e3, t3) {
      return i("div", { class: "field" }, [i("label", { class: "field-label", text: e3 }), t3]);
    }
    let u2 = i("input", { class: "field-input focusable", type: "text", readonly: "readonly", value: e2.url || "", placeholder: "http://server:port" }), c2 = i("input", { class: "field-input focusable", type: "text", readonly: "readonly", value: e2.username || "" }), d2 = i("input", { class: "field-input focusable", type: "password", readonly: "readonly", value: e2.password || "" }), m2 = i("input", { class: "field-input focusable", type: "text", readonly: "readonly", placeholder: "http://example.com/playlist.m3u" }), h2 = i("div", { class: "button primary focusable", text: sn("welcome.signIn") }), f2 = i("div", { class: "button focusable", text: sn("welcome.back") }), p2 = i("div", { class: "welcome-actions" }, [h2, f2]), g2 = Jn({ language: "en", suggest: (e3) => y2 === c2 ? (function(e4) {
      let t3 = String(e4 || "").trim();
      return t3 ? -1 !== t3.indexOf("@") ? [] : $n.map((e5) => ({ text: t3 + e5, label: e5 })) : [];
    })(e3) : y2 === u2 || y2 === m2 ? (function(e4) {
      let t3 = String(e4 || "");
      if (!t3) return Qn.slice(0, 2).map((e5) => ({ text: e5, label: e5 }));
      let n2 = [];
      for (let e5 of Qn.slice(2)) t3.slice(-e5.length) !== e5 && n2.push({ text: t3 + e5, label: e5 });
      return n2;
    })(e3) : [] }), y2 = null, b2 = i("div", { class: "welcome-keyboard", hidden: "hidden" }, [g2.node]), w2 = i("div", { class: "welcome-form", hidden: "hidden" }, [i("h2", { class: "welcome-form-title", text: "Xtream account" }), o2(sn("welcome.serverUrl"), u2), o2(sn("welcome.username"), c2), o2(sn("welcome.password"), d2)]), x2 = i("div", { class: "welcome-form", hidden: "hidden" }, [i("h2", { class: "welcome-form-title", text: "M3U playlist" }), o2(sn("welcome.playlistUrl"), m2)]), k2 = i("div", { class: "login-brand" });
    k2.appendChild(un(72));
    let C2 = i("div", { class: "login-panel welcome-panel" }, [k2, i("p", { class: "login-hint", text: sn("welcome.question") }), l2, w2, x2, p2, a2, b2]), S2 = i("div", { class: "login" }, [C2]);
    function _2() {
      s2 = null, a2.textContent = "", l2.hidden = false, w2.hidden = true, x2.hidden = true, p2.hidden = true, b2.hidden = true, v(l2.querySelector(".welcome-option"));
    }
    function T2(e3, i2, r2) {
      return n(this, null, (function* () {
        if (!t2) {
          t2 = true, a2.textContent = "", h2.textContent = r2 || sn("welcome.connecting"), (function(e4) {
            B = e4;
            try {
              localStorage.setItem(K, e4);
            } catch (e5) {
            }
          })(e3), i2 && (function(e4) {
            z = { url: String(e4.url || "").trim().replace(/\/+$/, ""), username: String(e4.username || "").trim(), password: String(e4.password || "").trim() };
            try {
              localStorage.setItem(R, JSON.stringify(z));
            } catch (e5) {
            }
          })(i2), et && et();
          try {
            yield Rt().authenticate(), A("home", {});
          } catch (e4) {
            t2 = false, h2.textContent = sn("welcome.signIn"), a2.textContent = "Login failed" === e4.message ? sn("welcome.wrongLogin") : e4.message;
          }
        }
      }));
    }
    return S2.addEventListener("focus-enter", (e3) => {
      if ("INPUT" === e3.target.tagName) {
        y2 = e3.target, g2.setTarget(e3.target);
        for (let t3 of [u2, c2, d2, m2]) t3.classList.toggle("typing", t3 === e3.target);
      }
    }), S2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target.closest(".welcome-option");
      if (t3) {
        let e4 = t3.__option.id;
        "free" === e4 ? T2("free", null, sn("welcome.loadingChannels")) : (function(e5) {
          s2 = e5, a2.textContent = "", l2.hidden = true, w2.hidden = "xtream" !== e5, x2.hidden = "m3u" !== e5, p2.hidden = false, b2.hidden = false, h2.textContent = sn("welcome.signIn");
          let t4 = "xtream" === e5 ? u2 : m2;
          g2.setTarget(t4), v(t4);
        })(e4);
      } else e3.target === h2 ? (function() {
        if ("xtream" === s2) {
          let e4 = u2.value.trim(), t4 = c2.value.trim(), n2 = d2.value.trim();
          return e4 && t4 && n2 ? void T2("xtream", { url: e4, username: t4, password: n2 }) : void (a2.textContent = sn("welcome.fillAll"));
        }
        if ("m3u" === s2) {
          let e4 = m2.value.trim();
          if (!e4) return void (a2.textContent = sn("welcome.enterPlaylist"));
          T2("m3u", { url: e4, username: "", password: "" });
        }
      })() : e3.target === f2 ? _2() : "INPUT" === e3.target.tagName && g2.setTarget(e3.target);
    }), { mount(e3) {
      e3.appendChild(S2), _2();
    }, unmount() {
      r(S2);
    }, initialFocus: () => l2.querySelector(".welcome-option"), onKey: (e3) => !(!jn(e3) || !s2) && (_2(), true) };
  }
  function ti(e2) {
    let t2 = e2 || {}, n2 = i("div", { class: "page" }), r2 = 0;
    return t2.title && n2.appendChild(i("div", { class: "page-header" }, [i("h1", { class: "page-title", dir: "auto", text: t2.title }), t2.subtitle ? i("p", { class: "page-subtitle", dir: "auto", text: t2.subtitle }) : null])), n2.addEventListener("focus-enter", (e3) => {
      !(function(e4) {
        let t3 = e4.closest(".row") || e4.closest(".page-block") || e4, i2 = t3.offsetTop, s2 = i2 + t3.offsetHeight, a2 = r2;
        i2 - 40 < r2 ? a2 = Math.max(0, i2 - 40) : s2 + 80 > r2 + 1080 && (a2 = s2 + 80 - 1080), a2 !== r2 && (r2 = a2, n2.style.transform = "translate3d(0," + -r2 + "px,0)");
      })(e3.target);
    }), { node: n2, add: (e3) => (n2.appendChild(e3), e3), reset() {
      r2 = 0, n2.style.transform = "translate3d(0,0,0)";
    } };
  }
  var ni = "poster-fallback", ii = null;
  function ri(e2) {
    let t2 = e2.getAttribute("data-src");
    if (!t2) return void si(e2);
    let n2 = new Image();
    n2.decoding = "async", n2.onload = () => {
      e2.classList.remove(ni), e2.style.backgroundImage = 'url("' + t2.replace(/"/g, "%22") + '")', e2.classList.add("poster-loaded");
    }, n2.onerror = () => {
      si(e2);
    }, n2.src = t2;
  }
  function si(e2) {
    if (e2.classList.add(ni), !e2.querySelector(".poster-fallback-text")) {
      let t2 = document.createElement("span");
      t2.className = "poster-fallback-text", t2.setAttribute("dir", "auto"), t2.textContent = e2.getAttribute("data-title") || "", e2.appendChild(t2);
    }
  }
  function ai(e2) {
    e2.getAttribute("data-src") ? (ii || (ii = new IntersectionObserver((e3) => {
      for (let t2 of e3) t2.isIntersecting && (ii.unobserve(t2.target), ri(t2.target));
    }, { root: null, rootMargin: "200px 600px", threshold: 0.01 }))).observe(e2) : si(e2);
  }
  var li = "iptv:resume", oi = null;
  function ui() {
    if (oi) return oi;
    oi = {};
    try {
      let e2 = localStorage.getItem(li);
      e2 && (oi = JSON.parse(e2) || {});
    } catch (e2) {
    }
    return oi;
  }
  function ci() {
    try {
      localStorage.setItem(li, JSON.stringify(oi));
    } catch (e2) {
    }
  }
  function di(e2, t2) {
    return e2 + ":" + t2;
  }
  function mi(e2, t2, n2) {
    if ("live" === e2.kind) return;
    let i2 = ui(), r2 = di(e2.kind, e2.id);
    if (t2 < 60 || n2 > 0 && t2 / n2 >= 0.93) return delete i2[r2], void ci();
    (function(e3, t3) {
      if (!e3) return;
      let n3 = ui();
      for (let i3 of Object.keys(n3)) {
        let r3 = n3[i3];
        r3.seriesId === e3 && r3.id !== t3 && delete n3[i3];
      }
    })(e2.seriesId, e2.id), i2[r2] = { kind: e2.kind, id: e2.id, name: e2.name, poster: e2.poster || null, ext: e2.ext || null, seriesId: e2.seriesId || null, seriesName: e2.seriesName || null, season: e2.season || null, episodeNumber: e2.episodeNumber || null, position: Math.floor(t2), duration: Math.floor(n2 || 0), updatedAt: Date.now() };
    let s2 = Object.keys(i2);
    if (s2.length > 100) {
      s2.sort((e3, t3) => i2[e3].updatedAt - i2[t3].updatedAt);
      for (let e3 of s2.slice(0, s2.length - 100)) delete i2[e3];
    }
    ci();
  }
  function hi(e2, t2) {
    return ui()[di(e2, t2)] || null;
  }
  function fi(e2) {
    let t2 = ui(), n2 = Object.keys(t2).map((e3) => t2[e3]).sort((e3, t3) => t3.updatedAt - e3.updatedAt), i2 = /* @__PURE__ */ Object.create(null), r2 = [];
    for (let t3 of n2) {
      if (t3.seriesId) {
        if (i2[t3.seriesId]) continue;
        i2[t3.seriesId] = true;
      }
      if (r2.push(t3), r2.length >= (e2 || 20)) break;
    }
    return r2;
  }
  function pi(e2) {
    return e2 && e2.duration ? Math.min(1, e2.position / e2.duration) : 0;
  }
  function gi(e2, t2, n2) {
    let r2 = i("div", { class: "poster " + (n2 || ""), "data-src": e2 || "", "data-title": t2 || "" });
    return ai(r2), r2;
  }
  function vi(e2, t2) {
    let n2 = t2 || {}, r2 = i("div", { class: "card card-poster focusable", "data-kind": e2.kind, "data-id": e2.id }), s2 = gi(e2.poster, e2.name, "poster-2x3");
    r2.appendChild(s2);
    let a2 = n2.resume || hi(e2.kind, e2.id);
    return a2 && s2.appendChild((function(e3) {
      return i("div", { class: "card-progress" }, [i("div", { class: "card-progress-fill", style: "width:" + Math.round(100 * e3) + "%" })]);
    })(pi(a2))), e2.rating && s2.appendChild(i("div", { class: "card-rating", text: e2.rating.toFixed(1) })), r2.appendChild(i("div", { class: "card-label", dir: "auto", text: e2.name })), r2.__item = e2, r2;
  }
  function yi(e2, t2) {
    let n2 = t2 || {}, r2 = i("div", { class: "card card-channel focusable", "data-kind": "live", "data-id": e2.id }), s2 = gi(e2.logo, e2.name, "poster-16x9 poster-contain");
    return r2.appendChild(s2), n2.showNumber && null != e2.number && s2.appendChild(i("div", { class: "card-number", text: String(e2.number) })), r2.appendChild(i("div", { class: "card-label", dir: "auto", text: e2.name })), r2.__item = e2, r2;
  }
  function bi(e2, t2) {
    let n2 = t2 || {}, r2 = i("div", { class: "channel-row focusable", "data-kind": "live", "data-id": e2.id });
    n2.showNumber && null != e2.number && r2.appendChild(i("span", { class: "channel-row-number", text: String(e2.number) }));
    let s2 = gi(e2.logo, "", "channel-row-logo poster-contain");
    return r2.appendChild(s2), r2.appendChild(i("span", { class: "channel-row-name", dir: "auto", text: e2.name })), n2.favorite && r2.appendChild(i("span", { class: "channel-row-fav", text: "\u2605" })), r2.__item = e2, r2;
  }
  function wi(e2, t2) {
    let n2 = i("div", { class: "category-button focusable" + ((t2 || {}).active ? " active" : ""), "data-category-id": e2.id, dir: "auto", text: e2.name });
    return n2.__category = e2, n2;
  }
  function xi(e2) {
    return new class {
      constructor(e3) {
        this.title = e3.title || "", this.items = e3.items || [], this.variant = e3.variant || "poster", this.onSelect = e3.onSelect || null, this.showNumber = !!e3.showNumber, this.key = e3.key || "row-" + Math.random().toString(36).slice(2), this.metrics = "channel" === this.variant ? { width: 300, gap: 24 } : { width: 200, gap: 24 }, this.rendered = /* @__PURE__ */ new Map(), this.offset = 0, this.focusedIndex = 0, this.node = this.build();
      }
      build() {
        let e3 = i("div", { class: "row row-" + this.variant, "data-focus-memory": this.key });
        this.title && e3.appendChild(i("h2", { class: "row-title", dir: "auto", text: this.title })), this.viewport = i("div", { class: "row-viewport" }), this.track = i("div", { class: "row-track" });
        let t2 = this.metrics.width + this.metrics.gap;
        return this.track.style.width = this.items.length * t2 + "px", this.viewport.appendChild(this.track), e3.appendChild(this.viewport), e3.addEventListener("focus-enter", (e4) => this.handleFocusEnter(e4)), e3.addEventListener("focus-activate", (e4) => {
          let t3 = e4.target.closest(".card");
          t3 && this.onSelect && this.onSelect(t3.__item, t3);
        }), this.renderWindow(), e3;
      }
      visibleCount() {
        let e3 = this.metrics.width + this.metrics.gap, t2 = this.viewport.clientWidth || 1660;
        return Math.max(1, Math.ceil(t2 / e3));
      }
      renderWindow() {
        let e3 = this.metrics.width + this.metrics.gap, t2 = Math.max(0, this.offset - 3), n2 = Math.min(this.items.length - 1, this.offset + this.visibleCount() + 3);
        for (let [e4, i2] of this.rendered) (e4 < t2 || e4 > n2) && (i2.parentNode && i2.parentNode.removeChild(i2), this.rendered.delete(e4));
        for (let i2 = t2; i2 <= n2; i2++) {
          if (this.rendered.has(i2)) continue;
          let t3 = this.items[i2];
          if (!t3) continue;
          let n3 = "channel" === this.variant ? yi(t3, { showNumber: this.showNumber }) : vi(t3);
          n3.style.transform = "translate3d(" + i2 * e3 + "px,0,0)", n3.setAttribute("data-index", String(i2)), this.track.appendChild(n3), this.rendered.set(i2, n3);
        }
      }
      handleFocusEnter(e3) {
        let t2 = e3.target.closest(".card");
        if (!t2) return;
        let n2 = Number(t2.getAttribute("data-index"));
        if (isNaN(n2)) return;
        this.focusedIndex = n2;
        let i2 = this.visibleCount(), r2 = this.offset;
        n2 < r2 + 1 ? r2 = n2 - 1 : n2 > r2 + i2 - 2 && (r2 = n2 - i2 + 2), r2 = Math.max(0, Math.min(r2, Math.max(0, this.items.length - i2))), r2 !== this.offset && (this.offset = r2, this.renderWindow());
        let s2 = this.metrics.width + this.metrics.gap;
        this.track.style.transform = "translate3d(" + -this.offset * s2 + "px,0,0)";
      }
      setItems(e3) {
        this.items = e3 || [], this.offset = 0, this.rendered.clear(), r(this.track);
        let t2 = this.metrics.width + this.metrics.gap;
        this.track.style.width = this.items.length * t2 + "px", this.track.style.transform = "translate3d(0,0,0)", this.renderWindow();
      }
      firstCard() {
        return this.rendered.get(0) || null;
      }
    }(e2);
  }
  var ki = /\b(horror|slasher|gore|supernatural\s*horror)\b/i, Ci = /\b(horror|conjuring|annabelle|insidious|exorcis|nightmare on|saw\b|hostel|paranormal)\b/i, Si = /\b(action|thriller|crime|adventure|sci-?fi|science fiction|mystery)\b/i;
  function _i(e2, t2) {
    return ki.test(e2.genre || "") || Ci.test(t2 || "");
  }
  var Ti = [/box office/i, /2026/i, /2025/i, /netflix/i, /imdb/i, /pure movies/i];
  function Li(e2) {
    let t2 = e2.slice();
    for (let e3 = t2.length - 1; e3 > 0; e3--) {
      let n2 = Math.floor(Math.random() * (e3 + 1)), i2 = t2[e3];
      t2[e3] = t2[n2], t2[n2] = i2;
    }
    return t2;
  }
  function Ii(e2) {
    let t2 = e2.onPlay, r2 = e2.onInfo, s2 = false !== e2.teaser, a2 = i("div", { class: "hero-blur" }), l2 = i("div", { class: "hero-backdrop" }), o2 = i("div", { class: "hero-backdrop" }), u2 = l2, c2 = i("h1", { class: "hero-title", dir: "auto" }), d2 = i("div", { class: "hero-meta" }), m2 = i("p", { class: "hero-plot", dir: "auto" }), h2 = i("div", { class: "hero-dots" }), f2 = i("div", { class: "hero-button primary focusable", text: "\u25B6  " + sn("home.play") }), p2 = i("div", { class: "hero-button focusable", text: sn("home.moreInfo") }), g2 = i("div", { class: "hero-body" }, [i("div", { class: "hero-kicker", text: sn("home.spotlight") }), c2, d2, m2, i("div", { class: "hero-actions" }, [f2, p2]), h2]), v2 = i("video", { class: "hero-video" });
    v2.setAttribute("playsinline", ""), v2.preload = "auto", v2.muted = false === e2.teaserSound;
    let y2 = i("div", { class: "hero page-block", "data-focus-memory": "hero" }, [a2, l2, o2, v2, i("div", { class: "hero-scrim" }), g2]), b2 = [], w2 = 0, x2 = null, k2 = null, C2 = null, S2 = false, _2 = false;
    function T2() {
      h2.innerHTML = "";
      for (let e3 = 0; e3 < b2.length; e3++) h2.appendChild(i("span", { class: "hero-dot" + (e3 === w2 ? " active" : "") }));
    }
    function L2(e3) {
      let t3 = b2[e3];
      if (!t3) return;
      w2 = e3, c2.textContent = t3.title, d2.textContent = t3.meta, m2.textContent = t3.plot;
      let n2 = 'url("' + t3.art.replace(/"/g, "%22") + '")', i2 = u2 === l2 ? o2 : l2;
      i2.style.backgroundImage = n2, i2.classList.toggle("poster-art", !t3.wideArt), i2.classList.add("visible"), u2.classList.remove("visible"), u2 = i2, a2.style.backgroundImage = n2, y2.classList.toggle("hero-poster", !t3.wideArt), T2();
    }
    function I2() {
      k2 && (clearTimeout(k2), k2 = null), C2 && (clearTimeout(C2), C2 = null), y2.classList.remove("hero-playing");
      try {
        v2.pause(), v2.removeAttribute("src"), v2.load();
      } catch (e3) {
      }
    }
    function N2() {
      if (C2 && (clearTimeout(C2), C2 = null), !v2.__seeked && isFinite(v2.duration) && v2.duration > 0) {
        v2.__seeked = true;
        try {
          v2.currentTime = 0.3 * v2.duration;
        } catch (e3) {
        }
      } else y2.classList.add("hero-playing"), k2 && clearTimeout(k2), k2 = setTimeout(() => {
        E2();
      }, 2e4);
    }
    function A2() {
      let e3 = b2[w2];
      if (!(e3 && e3.streamUrl && s2 && _2)) return;
      I2(), v2.__seeked = false, v2.src = e3.streamUrl;
      let t3 = v2.play();
      t3 && t3.catch && t3.catch(() => {
      }), C2 = setTimeout(() => {
        E2();
      }, 7e3);
    }
    function E2() {
      S2 || !b2.length || (L2((w2 + 1) % b2.length), s2 && _2 && A2());
    }
    function O2() {
      if (!(b2.length < 2)) {
        if (s2 && _2) return void A2();
        x2 || (x2 = setInterval(() => {
          S2 || L2((w2 + 1) % b2.length);
        }, 5e3));
      }
    }
    function P2(e3) {
      return new Promise((t3) => {
        let n2 = new Image();
        n2.onload = () => t3({ ok: true, wide: n2.naturalWidth / n2.naturalHeight >= 1.4 }), n2.onerror = () => t3({ ok: false, wide: false }), n2.src = e3;
      });
    }
    function M2() {
      return n(this, null, (function* () {
        let e3 = yield Vt(), t3 = [];
        for (let n3 of Ti) {
          for (let i3 of e3) n3.test(i3.name) && t3.push(i3);
          if (t3.length >= 4) break;
        }
        !t3.length && e3.length && t3.push(e3[0]);
        let n2 = [];
        for (let e4 of t3.slice(0, 4)) try {
          n2 = n2.concat(yield Wt(e4.id));
        } catch (e5) {
        }
        if (!n2.length) return [];
        let i2 = Li(n2.filter((e4) => e4.rating && e4.rating >= 7)).sort((e4, t4) => t4.rating - e4.rating).slice(0, 30), r3 = n2.filter((e4) => e4.added).sort((e4, t4) => t4.added - e4.added).slice(0, 30), s3 = (function(e4, t4, n3) {
          let i3 = [], r4 = /* @__PURE__ */ Object.create(null);
          for (let s4 = 0; i3.length < n3 && (s4 < e4.length || s4 < t4.length); s4++) for (let a4 of [e4, t4]) {
            let e5 = a4[s4];
            if (e5 && !r4[e5.id] && (r4[e5.id] = true, i3.push(e5), i3.length >= n3)) break;
          }
          return i3;
        })(Li(i2), Li(r3), 24), a3 = [];
        for (let e4 of s3) {
          if (S2 || a3.length >= 8) break;
          let t4;
          try {
            t4 = yield Xt(e4.id);
          } catch (e5) {
            continue;
          }
          if (!t4 || _i(t4, t4.name || e4.name) || a3.length < 5 && !Si.test(t4.genre || "")) continue;
          let n3 = t4.backdrops && t4.backdrops[0] || t4.poster || e4.poster;
          if (!n3) continue;
          let i3 = yield P2(n3);
          if (!i3.ok) continue;
          let r4 = [t4.releaseDate ? String(t4.releaseDate).slice(0, 4) : null, t4.durationSecs ? Math.round(t4.durationSecs / 60) + " min" : null, t4.genre || null, t4.rating ? "\u2605 " + t4.rating.toFixed(1) : null].filter(Boolean);
          a3.push({ id: e4.id, name: t4.name || e4.name, poster: t4.poster || e4.poster, ext: t4.ext || e4.ext, title: t4.name || e4.name, meta: r4.join("   \xB7   "), plot: t4.plot || "", art: n3, wideArt: i3.wide, streamUrl: Zt(e4.id, t4.ext || e4.ext) }), 1 === a3.length ? (b2 = a3, y2.classList.add("hero-ready"), L2(0), O2()) : (b2 = a3, T2());
        }
        return a3;
      }));
    }
    return y2.addEventListener("focus-activate", (e3) => {
      let n2 = b2[w2];
      n2 && (e3.target === f2 ? t2(n2) : e3.target === p2 && r2(n2));
    }), v2.addEventListener("playing", N2), v2.addEventListener("error", () => {
      E2();
    }), { node: y2, load: function() {
      return n(this, null, (function* () {
        let e3 = yield M2();
        return !S2 && (e3.length ? (O2(), true) : (y2.classList.add("hero-artless"), false));
      }));
    }, playButton: f2, setFocused: function(e3) {
      _2 !== e3 && (_2 = e3, s2 && (_2 ? (x2 && (clearInterval(x2), x2 = null), A2()) : (I2(), !x2 && b2.length > 1 && (x2 = setInterval(() => {
        S2 || L2((w2 + 1) % b2.length);
      }, 5e3)))));
    }, stop() {
      S2 = true, x2 && (clearInterval(x2), x2 = null), I2(), v2.removeEventListener("playing", N2);
    }, hasContent: () => b2.length > 0 };
  }
  var Ni = "iptv:favorites", Ai = null;
  function Ei() {
    if (Ai) return Ai;
    Ai = [];
    try {
      let e2 = localStorage.getItem(Ni);
      if (e2) {
        let t2 = JSON.parse(e2);
        Array.isArray(t2) && (Ai = t2);
      }
    } catch (e2) {
    }
    return Ai;
  }
  function Oi() {
    try {
      localStorage.setItem(Ni, JSON.stringify(Ai));
    } catch (e2) {
    }
  }
  function Pi(e2) {
    return e2.kind + ":" + e2.id;
  }
  function Mi(e2) {
    let t2 = Ei();
    return e2 ? t2.filter((t3) => t3.kind === e2) : t2.slice();
  }
  function Fi(e2) {
    let t2 = Pi(e2);
    return Ei().some((e3) => Pi(e3) === t2);
  }
  function qi(e2) {
    let t2 = Ei(), n2 = Pi(e2), i2 = t2.findIndex((e3) => Pi(e3) === n2);
    return -1 !== i2 && (t2.splice(i2, 1), Oi(), true);
  }
  function Di(e2) {
    return Fi(e2) ? (qi(e2), false) : ((function(e3) {
      let t2 = Ei();
      !Fi(e3) && (t2.unshift({ kind: e3.kind, id: e3.id, name: e3.name, poster: e3.poster || e3.logo || null, categoryId: e3.categoryId || null, ext: e3.ext || null, addedAt: Date.now() }), t2.length > 500 && (t2.length = 500), Oi());
    })(e2), true);
  }
  function ji() {
    let e2 = ti({}), t2 = false, i2 = null, s2 = [];
    function a2(t3) {
      let n2 = xi(t3);
      return s2.push(n2), e2.add(n2.node), n2;
    }
    function l2(e3) {
      "live" === e3.kind ? E("player", { channel: e3 }) : "movie" === e3.kind ? E("details", { kind: "movie", id: e3.id, item: e3 }) : "series" === e3.kind && E("details", { kind: "series", id: e3.id, item: e3 });
    }
    let o2 = null;
    function u2(e3, t3) {
      e3.node.__load = t3, o2 || (o2 = new IntersectionObserver((e4) => {
        for (let t4 of e4) {
          if (!t4.isIntersecting) continue;
          o2.unobserve(t4.target);
          let e5 = t4.target.__load;
          e5 && (t4.target.__load = null, e5());
        }
      }, { root: null, rootMargin: "1200px 0px", threshold: 0.01 })), o2.observe(e3.node);
    }
    return { mount(r2) {
      r2.appendChild(e2.node), e2.node.addEventListener("focus-enter", (e3) => {
        i2 && i2.setFocused(i2.node.contains(e3.target));
      }), i2 = Ii({ teaser: Z().heroTeaser, teaserSound: Z().heroTeaserSound, onPlay: (e3) => E("player", { item: { kind: "movie", id: e3.id, name: e3.name, poster: e3.poster, ext: e3.ext } }), onInfo: (e3) => E("details", { kind: "movie", id: e3.id, item: e3 }) }), e2.add(i2.node), i2.load().catch(() => {
        i2.node.classList.add("hero-artless");
      }), (function() {
        let e3 = fi(20);
        e3.length && a2({ key: "home-continue", title: sn("home.continue"), items: e3.map((e4) => ({ kind: e4.kind, id: e4.id, name: e4.seriesName ? e4.seriesName + " \xB7 S" + e4.season + "E" + e4.episodeNumber : e4.name, poster: e4.poster, ext: e4.ext })), onSelect: (e4) => {
          let t3 = hi(e4.kind, e4.id);
          E("player", { item: e4, resumeAt: t3 ? t3.position : 0 });
        } });
      })(), (function() {
        let e3 = Mi();
        e3.length && a2({ key: "home-favorites", title: sn("home.favorites"), items: e3, onSelect: l2 });
      })(), (function() {
        n(this, null, (function* () {
          let i3 = [{ kind: "live", categories: zt, streams: Bt, variant: "channel" }, { kind: "movie", categories: Vt, streams: Wt, variant: "poster" }, { kind: "series", categories: Jt, streams: Ht, variant: "poster" }], r3 = 3;
          for (let s3 of i3) {
            if (t2) return;
            let i4;
            try {
              i4 = yield s3.categories();
            } catch (e3) {
              continue;
            }
            for (let o3 of i4) {
              if (t2) return;
              let i5 = a2({ key: "home-" + s3.kind + "-" + o3.id, title: o3.name, items: [], variant: s3.variant, onSelect: l2 }), c2 = () => n(null, null, (function* () {
                try {
                  let n2 = yield s3.streams(o3.id);
                  if (t2) return;
                  if (!n2.length) return void i5.node.classList.add("row-empty");
                  i5.setItems(n2), w(e2.node, i5.firstCard());
                } catch (e3) {
                  i5.node.classList.add("row-empty");
                }
              }));
              r3 > 0 ? (r3--, yield c2()) : u2(i5, c2);
            }
          }
        }));
      })();
    }, unmount() {
      t2 = true, i2 && (i2.stop(), i2 = null), o2 && (o2.disconnect(), o2 = null), r(e2.node);
    }, initialFocus: () => e2.node.querySelector(".hero-button") || e2.node.querySelector(".card") || null, onKey: () => false };
  }
  var Ui = null, Ri = null;
  function Ki(e2, t2) {
    Ui || (Ui = i("div", { class: "toast" }), document.body.appendChild(Ui)), Ui.textContent = e2, Ui.classList.add("visible"), Ri && clearTimeout(Ri), Ri = setTimeout(() => {
      Ui.classList.remove("visible"), Ri = null;
    }, t2 || 2600);
  }
  var zi = "iptv:preferences", Bi = null;
  function Vi() {
    if (Bi) return Bi;
    Bi = { intro: {}, fit: {} };
    try {
      let e2 = localStorage.getItem(zi);
      if (e2) {
        let t2 = JSON.parse(e2);
        t2 && "object" == typeof t2 && (Bi.intro = t2.intro || {}, Bi.fit = t2.fit || {});
      }
    } catch (e2) {
    }
    return Bi;
  }
  function Wi() {
    try {
      localStorage.setItem(zi, JSON.stringify(Bi));
    } catch (e2) {
    }
  }
  function Ji(e2) {
    return String(e2 || "");
  }
  function Hi(e2, t2) {
    if (!e2 || t2 < 15 || t2 > 420) return;
    let n2 = Vi(), i2 = Ji(e2), r2 = n2.intro[i2] ? n2.intro[i2].slice() : [];
    r2.push(Math.round(t2)), r2.length > 5 && r2.shift(), n2.intro[i2] = r2, Wi();
  }
  function Xi(e2) {
    if (!e2) return null;
    let t2 = Vi().intro[Ji(e2)];
    if (!t2 || !t2.length) return null;
    let n2 = t2.slice().sort((e3, t3) => e3 - t3);
    return n2[Math.floor(n2.length / 2)];
  }
  var Gi = ["fit", "fill", "stretch"];
  function Zi(e2) {
    return sn("player." + e2);
  }
  function $i(e2, t2) {
    return e2 + ":" + t2;
  }
  function Qi(e2, t2) {
    return Vi().fit[$i(e2, t2)] || "fit";
  }
  function Yi(e2, t2) {
    let n2 = Qi(e2, t2);
    return (function(e3, t3, n3) {
      let i2 = Vi();
      return "fit" === n3 ? delete i2.fit[$i(e3, t3)] : i2.fit[$i(e3, t3)] = n3, Wi(), n3;
    })(e2, t2, Gi[(Gi.indexOf(n2) + 1) % Gi.length]);
  }
  var er = ["nudge", "seek", "reload"], tr = [10, 30, 60, 300], nr = null;
  function ir(e2) {
    if (!isFinite(e2) || e2 < 0) return "--:--";
    let t2 = Math.floor(e2), n2 = Math.floor(t2 / 3600), i2 = Math.floor(t2 % 3600 / 60), r2 = t2 % 60, s2 = (e3) => e3 < 10 ? "0" + e3 : String(e3);
    return n2 > 0 ? n2 + ":" + s2(i2) + ":" + s2(r2) : s2(i2) + ":" + s2(r2);
  }
  function rr(e2) {
    let t2 = e2.channel || e2.item, n2 = "live" === t2.kind, s2 = i("video", { class: "player-video" });
    s2.setAttribute("playsinline", "");
    let a2 = new class {
      constructor(e3) {
        this.video = e3, this.sources = [], this.sourceIndex = 0, this.current = null, this.attempted = /* @__PURE__ */ new Set(), this.startTimer = null, this.stallTimer = null, this.promoteTimer = null, this.watchdog = null, this.lastTime = 0, this.lastAdvance = 0, this.started = false, this.stopped = true, this.recoveryStep = 0, this.wasStalled = false, this.listeners = /* @__PURE__ */ Object.create(null), this.onError = () => this.handleFailure("error"), this.onPlaying = () => this.handlePlaying(), this.onWaiting = () => this.emit("buffering", { source: this.current }), this.onEnded = () => this.emit("ended", { source: this.current }), this.video.addEventListener("error", this.onError), this.video.addEventListener("playing", this.onPlaying), this.video.addEventListener("waiting", this.onWaiting), this.video.addEventListener("ended", this.onEnded);
      }
      on(e3, t3) {
        return this.listeners[e3] || (this.listeners[e3] = []), this.listeners[e3].push(t3), this;
      }
      emit(e3, t3) {
        let n3 = this.listeners[e3];
        if (n3) for (let e4 of n3) try {
          e4(t3);
        } catch (e5) {
        }
      }
      play(e3, t3, n3) {
        this.stopTimers(), this.sources = e3.slice(), this.urlFor = t3, this.options = n3 || {}, this.sourceIndex = 0, this.attempted = /* @__PURE__ */ new Set(), this.stopped = false, this.recoveryStep = 0, this.wasStalled = false, this.openCurrent();
      }
      openCurrent() {
        let e3 = this.sources[this.sourceIndex];
        if (!e3) return this.exhausted();
        this.current = e3, this.attempted.add(e3.id), this.started = false, this.lastTime = 0, this.lastAdvance = Date.now(), this.releaseMedia();
        let t3 = this.urlFor(e3);
        this.emit("loading", { source: e3, url: t3 }), this.video.src = t3;
        let n3 = this.video.play();
        n3 && n3.catch && n3.catch(() => {
        }), this.startTimer = setTimeout(() => {
          this.started || this.handleFailure("timeout");
        }, 6e3), this.startWatchdog();
      }
      handlePlaying() {
        let e3 = !this.started;
        if (this.started = true, this.lastAdvance = Date.now(), this.startTimer && (clearTimeout(this.startTimer), this.startTimer = null), e3) {
          if (this.options.resumeAt > 0 && isFinite(this.video.duration)) {
            try {
              this.video.currentTime = this.options.resumeAt;
            } catch (e4) {
            }
            this.options.resumeAt = 0;
          }
          this.emit("playing", { source: this.current }), this.schedulePromotion();
        }
      }
      startWatchdog() {
        this.watchdog && clearInterval(this.watchdog), this.watchdog = setInterval(() => {
          if (this.stopped || this.video.paused) return;
          let e3 = Date.now(), t3 = this.video.currentTime;
          if (t3 > this.lastTime + 0.15) return this.lastTime = t3, this.lastAdvance = e3, this.recoveryStep = 0, this.wasStalled && (this.wasStalled = false, this.emit("recovered", { source: this.current })), void this.emit("progress", { position: t3, source: this.current });
          this.started && e3 - this.lastAdvance > 3500 && this.handleStall();
        }, 500);
      }
      handleStall() {
        this.lastAdvance = Date.now(), this.wasStalled = true, this.emit("stalled", { source: this.current });
        let e3 = this.nextSource({ degrade: true });
        if (e3) return this.emit("quality-change", { from: this.current, to: e3, reason: "stall" }), this.sourceIndex = this.sources.indexOf(e3), void this.openCurrent();
        this.recover();
      }
      recover() {
        let e3 = er[this.recoveryStep];
        if (this.recoveryStep++, !e3) return void this.emit("buffering", { source: this.current, terminal: true });
        let t3 = this.video.currentTime;
        if (this.emit("recovering", { source: this.current, step: e3, position: t3 }), "nudge" !== e3) if ("seek" !== e3) this.options.resumeAt = t3, this.attempted.delete(this.current.id), this.openCurrent();
        else {
          try {
            this.video.currentTime = t3 + 0.5;
          } catch (e5) {
          }
          let e4 = this.video.play();
          e4 && e4.catch && e4.catch(() => {
          });
        }
        else {
          let e4 = this.video.play();
          e4 && e4.catch && e4.catch(() => {
          });
        }
      }
      handleFailure(e3) {
        if (this.stopped) return;
        let t3 = this.current, n3 = this.nextSource({});
        if (!n3) return this.exhausted();
        this.emit("source-failed", { source: t3, reason: e3, next: n3 }), this.sourceIndex = this.sources.indexOf(n3), this.openCurrent();
      }
      nextSource(e3) {
        let t3 = this.current ? this.current.rank : 0, n3 = this.sources.filter((e4) => !this.attempted.has(e4.id));
        if (!n3.length) return null;
        if (e3 && e3.degrade) {
          let e4 = n3.filter((e5) => e5.rank > t3);
          if (e4.length) return e4.sort((e5, t4) => e5.rank - t4.rank)[0];
        }
        let i2 = n3.filter((e4) => e4.rank >= t3);
        return i2.length ? i2.sort((e4, t4) => e4.rank - t4.rank)[0] : n3[0];
      }
      schedulePromotion() {
        this.promoteTimer && clearTimeout(this.promoteTimer), !this.options.noPromote && (this.promoteTimer = setTimeout(() => {
          if (this.stopped || !this.started) return;
          let e3 = this.sources.filter((e4) => e4.rank < (this.current ? this.current.rank : 0)).sort((e4, t3) => t3.rank - e4.rank)[0];
          e3 && (this.emit("quality-change", { from: this.current, to: e3, reason: "promote" }), this.attempted.delete(e3.id), this.sourceIndex = this.sources.indexOf(e3), this.openCurrent());
        }, 9e4));
      }
      exhausted() {
        this.emit("exhausted", { attempted: this.attempted.size }), this.stop();
      }
      togglePause() {
        return this.video.paused ? this.video.play() : this.video.pause(), this.emit("paused-changed", { paused: this.video.paused }), this.video.paused;
      }
      seekBy(e3) {
        return !!isFinite(this.video.duration) && (this.seekTo(this.video.currentTime + e3), true);
      }
      seekTo(e3) {
        if (!isFinite(this.video.duration)) return false;
        let t3 = Math.max(0, Math.min(this.video.duration - 1, e3));
        this.lastAdvance = Date.now(), this.lastTime = t3;
        try {
          this.video.currentTime = t3;
        } catch (e4) {
          return false;
        }
        return this.emit("seeked", { position: t3, duration: this.video.duration }), true;
      }
      get position() {
        return this.video.currentTime || 0;
      }
      get duration() {
        return isFinite(this.video.duration) ? this.video.duration : 0;
      }
      get isLive() {
        return !isFinite(this.video.duration);
      }
      get paused() {
        return this.video.paused;
      }
      releaseMedia() {
        try {
          this.video.pause(), this.video.removeAttribute("src"), this.video.load();
        } catch (e3) {
        }
      }
      stopTimers() {
        this.startTimer && (clearTimeout(this.startTimer), this.startTimer = null), this.stallTimer && (clearTimeout(this.stallTimer), this.stallTimer = null), this.promoteTimer && (clearTimeout(this.promoteTimer), this.promoteTimer = null), this.watchdog && (clearInterval(this.watchdog), this.watchdog = null);
      }
      stop() {
        this.stopped = true, this.stopTimers(), this.releaseMedia(), this.current = null, this.emit("stopped", {});
      }
      destroy() {
        this.stop(), this.video.removeEventListener("error", this.onError), this.video.removeEventListener("playing", this.onPlaying), this.video.removeEventListener("waiting", this.onWaiting), this.video.removeEventListener("ended", this.onEnded), this.listeners = /* @__PURE__ */ Object.create(null);
      }
    }(s2), l2 = null, o2 = null, u2 = null, c2 = null, d2 = null, h2 = 0, f2 = 0, p2 = false, g2 = i("div", { class: "osd-title", dir: "auto", text: t2.name }), y2 = i("div", { class: "osd-subtitle" }), b2 = i("div", { class: "osd-quality" }), w2 = i("div", { class: "osd-bar-fill" }), x2 = i("div", { class: "osd-bar-knob" }), k2 = i("div", { class: "osd-bar" }, [w2, x2]), C2 = i("span", { class: "osd-time", text: "--:--" }), S2 = i("span", { class: "osd-time osd-time-total", text: "--:--" }), _2 = i("div", { class: "osd-button focusable", text: "\u275A\u275A" }), T2 = i("div", { class: "osd-button focusable", text: "\u2605" }), L2 = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.quality") }), I2 = e2.episodes || null, N2 = null == e2.episodeIndex ? -1 : e2.episodeIndex, A2 = !!(I2 && N2 >= 0 && N2 < I2.length - 1), E2 = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.skipIntro") }), O2 = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.nextEpisode") }), F2 = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.fit") }), q2 = i("div", { class: "osd-controls", "data-focus-memory": "osd" }, [_2, T2, n2 ? null : E2, A2 ? O2 : null, F2, L2]), D2 = i("div", { class: "credits-prompt", hidden: "hidden" }, [i("div", { class: "credits-label", text: sn("player.upNext") }), i("div", { class: "credits-title", dir: "auto", text: "" }), i("div", { class: "button primary focusable credits-play", text: "\u25B6  " + sn("player.playNext") })]), j2 = D2.querySelector(".credits-title"), U2 = D2.querySelector(".credits-play"), R2 = i("div", { class: "osd-progress" }, [C2, k2, S2]), K2 = i("div", { class: "osd" }, [i("div", { class: "osd-gradient" }), i("div", { class: "osd-body" }, [g2, y2, b2, n2 ? null : R2, q2])]), z2 = i("div", { class: "player-message" }), B2 = i("div", { class: "player", "data-focus-trap": "" }, [s2, z2, D2, K2]);
    function V2() {
      K2.classList.add("visible"), l2 && clearTimeout(l2), l2 = setTimeout(W2, 4500);
    }
    function W2() {
      K2.classList.remove("visible"), l2 && (clearTimeout(l2), l2 = null);
    }
    function J2(e3, t3) {
      z2.textContent = t3 || "", z2.classList.toggle("visible", !!t3);
    }
    function H2() {
      T2.classList.toggle("active", Fi(t2));
    }
    function X2() {
      if (n2 || null !== d2) return;
      G2(a2.position, a2.duration), (function() {
        if (!A2 || null !== d2) return;
        let e3 = a2.duration;
        if (!e3) return;
        let t3 = e3 - a2.position, n3 = Z().nextEpisodePromptSeconds, i2 = t3 > 0 && t3 <= n3;
        if (i2 !== !D2.hidden) if (i2) {
          let e4 = I2[N2 + 1];
          j2.textContent = "S" + e4.season + "E" + e4.episodeNumber + (e4.title ? " \xB7 " + e4.title : ""), D2.hidden = false, v(U2);
        } else D2.hidden = true, m() === U2 && v(_2);
      })();
    }
    function G2(e3, t3) {
      let n3 = t3 > 0 ? Math.min(1, e3 / t3) : 0;
      w2.style.width = 100 * n3 + "%", x2.style.left = 100 * n3 + "%", C2.textContent = ir(e3), S2.textContent = ir(t3);
    }
    function $2(t3) {
      if (n2 || !a2.duration) return;
      let i2 = Date.now();
      h2 = i2 - f2 < 400 ? Math.min(tr.length - 1, h2 + 1) : 0, f2 = i2;
      let r2 = null === d2 ? a2.position : d2, s3 = Math.max(0, Math.min(a2.duration - 1, r2 + t3 * tr[h2]));
      d2 = s3, G2(s3, a2.duration), k2.classList.add("seeking"), V2(), u2 && clearTimeout(u2), u2 = setTimeout(() => {
        let t4 = d2;
        d2 = null, h2 = 0, k2.classList.remove("seeking"), a2.seekTo(t4), e2.seriesId && t4 > a2.position && (Hi(e2.seriesId, t4), Q2());
      }, 450);
    }
    function Q2() {
      let t3 = Xi(e2.seriesId);
      E2.textContent = null !== t3 ? sn("player.skipIntro") : "Skip +" + Z().introSkipSeconds + "s";
    }
    function Y2() {
      return e2.seriesId ? { kind: "series", id: e2.seriesId } : { kind: t2.kind, id: t2.id };
    }
    function ee2() {
      let e3 = Y2(), t3 = Qi(e3.kind, e3.id);
      s2.classList.remove("fit-fit", "fit-fill", "fit-stretch"), s2.classList.add("fit-" + t3), F2.textContent = Zi(t3);
    }
    function te2() {
      if (!A2) return;
      let n3 = I2[N2 + 1];
      ne2(), P("player", { item: { kind: "episode", id: n3.id, name: (e2.seriesName || "") + " \xB7 S" + n3.season + "E" + n3.episodeNumber, poster: n3.still || t2.poster, ext: n3.ext }, episodes: I2, episodeIndex: N2 + 1, seriesId: e2.seriesId, seriesName: e2.seriesName, season: n3.season, episodeNumber: n3.episodeNumber, resumeAt: 0 });
    }
    function ne2() {
      n2 || mi({ kind: t2.kind, id: t2.id, name: t2.name, poster: t2.poster || null, ext: t2.ext || null, seriesId: e2.seriesId || null, seriesName: e2.seriesName || null, season: e2.season || null, episodeNumber: e2.episodeNumber || null }, a2.position, a2.duration);
    }
    function ie2(e3) {
      return e3.url ? e3.url : n2 ? Gt(e3.id, Z().liveFormat, e3.item || t2) : "episode" === t2.kind ? (function(e4, t3) {
        return Rt().episodeUrl(e4, t3);
      })(e3.id, e3.ext || t2.ext) : Zt(e3.id, e3.ext || t2.ext);
    }
    function re2() {
      if (!n2) return [{ id: t2.id, name: t2.name, ext: t2.ext, rank: 0 }];
      if (t2.sources && t2.sources.length) return t2.sources.map((e4) => ({ id: e4.id, name: e4.name || t2.name, url: e4.url, quality: e4.quality, rank: e4.rank, item: t2 }));
      if (t2.url || !Kt().singleConnection) return [{ id: t2.id, name: t2.name, url: t2.url, item: t2, rank: 0 }];
      let e3 = Z().preferLowerBitrate ? 1 : 0, i2 = (function(e4, t3) {
        let n3 = vn(e4), i3 = null == t3 ? 1 : t3, r3 = n3.filter((e5) => e5.rank >= i3);
        return r3.length ? r3.sort((e5, t4) => e5.rank - t4.rank)[0] : n3[0];
      })(t2, e3), r2 = vn(t2);
      return [i2].concat(r2.filter((e4) => e4.id !== i2.id));
    }
    a2.on("loading", () => {
      J2(0, "");
    }), a2.on("playing", (e3) => {
      J2(0, ""), n2 && (nr = t2), _2.textContent = "\u275A\u275A", b2.textContent = e3.source && e3.source.quality ? e3.source.quality : "", n2 || (S2.textContent = ir(a2.duration)), V2();
    }), a2.on("progress", () => {
      J2(0, "");
    }), a2.on("recovered", () => {
      J2(0, "");
    }), a2.on("recovering", () => {
      J2(0, "");
    }), a2.on("buffering", () => {
      a2.paused || J2(0, "");
    }), a2.on("source-failed", () => {
      J2(0, "");
    }), a2.on("quality-change", (e3) => {
      e3.to && e3.to.quality && (b2.textContent = e3.to.quality);
    }), a2.on("exhausted", () => {
      J2(0, "");
      let n3 = e2.previous || (nr && nr.id !== t2.id ? nr : null);
      n3 ? (Ki("\u201C" + t2.name + "\u201D is not available \u2014 back to " + n3.name), P("player", { channel: n3, siblings: e2.siblings, index: e2.siblings ? e2.siblings.findIndex((e3) => e3.id === n3.id) : null })) : (J2(0, sn("player.unavailable")), setTimeout(() => {
        p2 || M();
      }, 2200));
    }), a2.on("ended", () => {
      ne2(), A2 ? te2() : M();
    }), B2.addEventListener("focus-activate", (n3) => {
      let s3 = n3.target;
      if (s3 === _2) {
        let e3 = a2.togglePause();
        _2.textContent = e3 ? "\u25B6" : "\u275A\u275A", e3 && ne2(), V2();
      } else if (s3 === T2) {
        let e3 = Di(t2);
        H2(), Ki(e3 ? "Added to favourites" : "Removed from favourites"), V2();
      } else if (s3 === E2) !(function() {
        let t3, n4 = Xi(e2.seriesId), i2 = a2.position;
        if (null !== n4 && n4 > i2) a2.seekTo(n4), t3 = n4;
        else {
          let e3 = Z().introSkipSeconds;
          if (!a2.seekBy(e3)) return;
          t3 = i2 + e3;
        }
        Hi(e2.seriesId, t3), Q2(), V2();
      })();
      else if (s3 === O2 || s3 === U2) te2();
      else if (s3 === F2) !(function() {
        let e3 = Y2(), t3 = Yi(e3.kind, e3.id);
        ee2(), Ki(Zi(t3)), V2();
      })();
      else if (s3 === L2) !(function() {
        let e3 = vn(t2);
        r(se2), se2.appendChild(i("div", { class: "quality-title", text: sn("player.quality") })), e3.length <= 1 && se2.appendChild(i("div", { class: "quality-empty", text: "Only one source available for this channel." }));
        for (let t3 of e3) {
          let e4 = i("div", { class: "quality-option focusable" + (a2.current && a2.current.id === t3.id ? " active" : ""), dir: "auto", text: (t3.quality || "Auto") + " \u2014 " + t3.name });
          e4.__source = t3, se2.appendChild(e4);
        }
        se2.hidden = false, l2 && (clearTimeout(l2), l2 = null), v(se2.querySelector(".quality-option"));
      })();
      else if (s3.classList.contains("quality-option")) {
        let e3 = s3.__source;
        ae2();
        let t3 = re2().filter((t4) => t4.id !== e3.id);
        a2.play([e3].concat(t3), ie2, { noPromote: true }), Ki("Quality: " + (e3.quality || e3.name));
      }
    });
    let se2 = i("div", { class: "quality-panel", hidden: "hidden", "data-focus-memory": "quality" });
    function ae2() {
      se2.hidden = true, v(L2), V2();
    }
    return { mount(t3) {
      ((e3) => {
        B2.appendChild(e3);
      })(se2), t3.appendChild(B2), H2(), ee2(), n2 || Q2(), (function() {
        let t4 = re2();
        J2(0, ""), a2.play(t4, ie2, { resumeAt: e2.resumeAt || 0, noPromote: !n2 });
      })(), V2(), c2 = setInterval(X2, 500), o2 = setInterval(ne2, 1e4);
    }, unmount() {
      p2 = true, ne2(), l2 && clearTimeout(l2), o2 && clearInterval(o2), u2 && clearTimeout(u2), c2 && clearInterval(c2), a2.destroy(), r(B2);
    }, initialFocus: () => _2, onKey: function(i2) {
      if (jn(i2)) return se2.hidden ? K2.classList.contains("visible") ? (W2(), true) : (ne2(), M(), true) : (ae2(), true);
      if (!se2.hidden) return false;
      let r2 = K2.classList.contains("visible");
      if ((i2 === yn || i2 === Pn) && !n2) return $2(-1), true;
      if ((i2 === wn || i2 === Mn) && !n2) return $2(1), true;
      if (i2 === En || i2 === An || i2 === Nn) {
        let e3 = a2.togglePause();
        return _2.textContent = e3 ? "\u25B6" : "\u275A\u275A", e3 && ne2(), V2(), true;
      }
      if (i2 === On) return ne2(), M(), true;
      if (n2 && e2.siblings && e2.siblings.length > 1) {
        let n3 = 0;
        if (i2 === bn || i2 === Fn ? n3 = -1 : (i2 === xn || i2 === qn) && (n3 = 1), 0 !== n3) {
          let i3 = e2.siblings.length, r3 = ((null == e2.index ? 0 : e2.index) + n3 + i3) % i3;
          return ne2(), P("player", { channel: e2.siblings[r3], siblings: e2.siblings, index: r3, previous: t2 }), true;
        }
      }
      return !D2.hidden && Un(i2) ? (te2(), true) : !r2 && (V2(), v(_2), true);
    } };
  }
  function sr(e2) {
    return e2 ? Math.round(e2 / 60) + " min" : null;
  }
  function ar(e2) {
    let t2 = ti({}), s2 = i("div", { class: "details" });
    t2.add(s2);
    let a2 = false, l2 = null, o2 = 0, u2 = i("div", { class: "details-hero" }), c2 = i("div", { class: "poster poster-2x3 details-poster" }), d2 = i("h1", { class: "details-title", dir: "auto", text: e2.item ? e2.item.name : "" }), m2 = i("div", { class: "details-meta" }), h2 = i("p", { class: "details-plot", dir: "auto" }), f2 = i("div", { class: "button primary focusable details-play", text: "\u25B6  Play" }), p2 = i("div", { class: "button focusable", text: "\u2605  Favourite" }), g2 = i("div", { class: "details-actions", "data-focus-memory": "details-actions" }, [f2, p2]), v2 = i("div", { class: "details-info" }, [d2, m2, h2, g2]);
    u2.appendChild(c2), u2.appendChild(v2), s2.appendChild(u2);
    let y2 = i("div", { class: "details-episodes" });
    function x2() {
      let t3 = e2.item || { kind: e2.kind, id: e2.id, name: d2.textContent };
      p2.classList.toggle("active", Fi(t3));
    }
    function k2(e3, t3) {
      c2.setAttribute("data-src", e3 || ""), c2.setAttribute("data-title", t3 || ""), ai(c2);
    }
    function C2() {
      return n(this, null, (function* () {
        let t3 = yield Xt(e2.id);
        if (a2) return;
        l2 = t3, d2.textContent = t3.name || (e2.item ? e2.item.name : ""), k2(t3.poster || e2.item && e2.item.poster, d2.textContent);
        let n2 = [t3.releaseDate ? String(t3.releaseDate).slice(0, 4) : null, sr(t3.durationSecs), t3.genre || null, t3.rating ? "\u2605 " + t3.rating.toFixed(1) : null].filter(Boolean);
        m2.textContent = n2.join("   \xB7   "), h2.textContent = t3.plot || "";
        let i2 = hi("movie", e2.id);
        i2 && (f2.textContent = "\u25B6  Resume  \xB7  " + Math.floor(i2.position / 60) + " min in"), x2(), w(s2, f2);
      }));
    }
    function S2() {
      return n(this, null, (function* () {
        let t3 = yield (function(e3) {
          return Rt().seriesInfo(e3);
        })(e2.id);
        if (a2) return;
        l2 = t3, d2.textContent = t3.name || (e2.item ? e2.item.name : ""), k2(t3.poster || e2.item && e2.item.poster, d2.textContent);
        let n2 = [t3.releaseDate ? String(t3.releaseDate).slice(0, 4) : null, t3.seasons.length + (1 === t3.seasons.length ? " season" : " seasons"), t3.genre || null, t3.rating ? "\u2605 " + t3.rating.toFixed(1) : null].filter(Boolean);
        m2.textContent = n2.join("   \xB7   "), h2.textContent = t3.plot || "", f2.textContent = "\u25B6  Play", x2(), _2(), w(s2, f2);
      }));
    }
    function _2() {
      if (r(y2), !l2 || !l2.seasons.length) return;
      if (l2.seasons.length > 1) {
        let e4 = i("div", { class: "season-strip", "data-focus-memory": "seasons" });
        l2.seasons.forEach((t3, n2) => {
          let r2 = i("div", { class: "season-button focusable" + (n2 === o2 ? " active" : ""), text: "Season " + t3.number });
          r2.__seasonIndex = n2, e4.appendChild(r2);
        }), y2.appendChild(e4);
      }
      let e3 = i("div", { class: "episode-list", "data-focus-memory": "episodes" });
      for (let t3 of l2.seasons[o2].episodes) e3.appendChild(T2(t3));
      y2.appendChild(e3);
    }
    function T2(e3) {
      let t3 = i("div", { class: "poster poster-16x9 episode-still", "data-src": e3.still || "", "data-title": "" });
      ai(t3);
      let n2 = hi("episode", e3.id);
      if (n2) {
        let e4 = pi(n2);
        t3.appendChild(i("div", { class: "card-progress" }, [i("div", { class: "card-progress-fill", style: "width:" + Math.round(100 * e4) + "%" })]));
      }
      let r2 = i("div", { class: "episode-row focusable" }, [t3, i("div", { class: "episode-text" }, [i("div", { class: "episode-title", dir: "auto", text: e3.episodeNumber + ".  " + (e3.title || "Episode " + e3.episodeNumber) }), i("div", { class: "episode-plot", dir: "auto", text: e3.plot || "" })]), i("div", { class: "episode-duration", text: sr(e3.durationSecs) || "" })]);
      return r2.__episode = e3, r2;
    }
    function L2(t3) {
      let n2 = hi("episode", t3.id), i2 = l2.seasons.filter((e3) => e3.number === t3.season)[0], r2 = i2 ? i2.episodes : [t3];
      E("player", { item: { kind: "episode", id: t3.id, name: (l2 ? l2.name : "") + " \xB7 S" + t3.season + "E" + t3.episodeNumber, poster: t3.still || (l2 ? l2.poster : null), ext: t3.ext }, episodes: r2, episodeIndex: r2.indexOf(t3), seriesId: e2.id, seriesName: l2 ? l2.name : "", season: t3.season, episodeNumber: t3.episodeNumber, resumeAt: n2 ? n2.position : 0 });
    }
    return s2.appendChild(y2), s2.addEventListener("focus-activate", (t3) => {
      let n2 = t3.target;
      if (n2 === f2) return void ("series" === e2.kind ? (function() {
        if (!l2 || !l2.seasons.length) return;
        let e3 = null, t4 = 0;
        for (let n3 of l2.seasons) for (let i3 of n3.episodes) {
          let n4 = hi("episode", i3.id);
          n4 && n4.updatedAt > t4 && (t4 = n4.updatedAt, e3 = i3);
        }
        L2(e3 || l2.seasons[0].episodes[0]);
      })() : (function() {
        let t4 = hi("movie", e2.id);
        E("player", { item: { kind: "movie", id: e2.id, name: d2.textContent, poster: l2 ? l2.poster : null, ext: l2 ? l2.ext : e2.item && e2.item.ext || "mp4" }, resumeAt: t4 ? t4.position : 0 });
      })());
      if (n2 === p2) {
        let t4 = Di(e2.item || { kind: e2.kind, id: e2.id, name: d2.textContent, poster: l2 ? l2.poster : null });
        return x2(), void Ki(t4 ? "Added to favourites" : "Removed from favourites");
      }
      if (n2.classList.contains("season-button")) return o2 = n2.__seasonIndex, _2(), void b(y2.querySelector(".season-button.active"));
      let i2 = n2.closest(".episode-row");
      i2 && L2(i2.__episode);
    }), { mount(n2) {
      n2.appendChild(t2.node), ("series" === e2.kind ? S2 : C2)().catch(() => {
        a2 || (h2.textContent = "Could not load details.");
      });
    }, unmount() {
      a2 = true, r(t2.node);
    }, initialFocus: () => f2, onKey: () => false };
  }
  var lr = "iptv:health", or = null;
  function ur() {
    if (or) return or;
    or = {};
    try {
      let e2 = localStorage.getItem(lr);
      e2 && (or = JSON.parse(e2) || {});
    } catch (e2) {
      or = {};
    }
    return or;
  }
  function cr() {
    let e2 = ur(), t2 = Object.keys(e2);
    if (t2.length > 800) {
      t2.sort((t3, n2) => e2[t3].at - e2[n2].at);
      for (let n2 of t2.slice(0, t2.length - 800)) delete e2[n2];
    }
    try {
      localStorage.setItem(lr, JSON.stringify(e2));
    } catch (e3) {
    }
  }
  function dr(e2) {
    let t2 = ur()[e2];
    return t2 ? t2.ok ? -1 : Date.now() - t2.at > 432e5 ? 0 : 1 : 0;
  }
  function mr() {
    let e2 = i("video", { class: "preview-video" });
    e2.setAttribute("playsinline", ""), e2.muted = false;
    let t2 = i("div", { class: "poster poster-16x9 preview-poster" }), n2 = i("div", { class: "preview-name", dir: "auto", text: "" }), s2 = i("div", { class: "preview-hint", text: sn("browse.pressOkPreview") }), a2 = i("div", { class: "preview-frame" }, [t2, e2]), l2 = i("div", { class: "preview-pane" }, [i("div", { class: "pane-title", text: sn("browse.preview") }), a2, n2, s2]), o2 = null, u2 = null, c2 = [], d2 = 0;
    function m2() {
      a2.classList.add("preview-playing"), s2.textContent = sn("browse.pressOkFull"), u2 && (clearTimeout(u2), u2 = null), o2 && (function(e3) {
        if (!e3) return;
        ur()[e3] = { ok: true, at: Date.now(), fails: 0 }, cr();
      })(o2);
    }
    function h2() {
      if (u2 && (clearTimeout(u2), u2 = null), d2 < c2.length - 1) return d2++, s2.textContent = "Trying another source\u2026", void f2();
      a2.classList.remove("preview-playing"), s2.textContent = sn("browse.noResponse"), o2 && (function(e3) {
        if (!e3) return;
        let t3 = ur(), n3 = t3[e3];
        t3[e3] = { ok: false, at: Date.now(), fails: (n3 && n3.fails || 0) + 1 }, cr();
      })(o2), o2 = null;
    }
    function f2() {
      let t3 = c2[d2];
      if (!t3) return h2();
      try {
        e2.pause(), e2.removeAttribute("src"), e2.load();
      } catch (e3) {
      }
      e2.src = t3.url;
      let n3 = e2.play();
      n3 && n3.catch && n3.catch(() => {
      }), u2 = setTimeout(() => {
        e2.readyState < 3 && h2();
      }, 8e3);
    }
    function p2() {
      u2 && (clearTimeout(u2), u2 = null), a2.classList.remove("preview-playing");
      try {
        e2.pause(), e2.removeAttribute("src"), e2.load();
      } catch (e3) {
      }
      o2 = null, c2 = [], d2 = 0;
    }
    return e2.addEventListener("playing", m2), e2.addEventListener("error", h2), { node: l2, show: function(e3) {
      e3 && (o2 && o2 !== e3.id && p2(), n2.textContent = e3.name, o2 || (s2.textContent = sn("browse.pressOkPreview")), t2.setAttribute("data-src", e3.logo || ""), t2.setAttribute("data-title", e3.name || ""), t2.style.backgroundImage = "", t2.classList.remove("poster-loaded", "poster-fallback"), r(t2), ai(t2));
    }, play: function(e3, t3) {
      return !(!e3 || (p2(), c2 = e3.sources && e3.sources.length ? e3.sources.slice() : t3 ? [{ url: t3 }] : [], !c2.length)) && (d2 = 0, o2 = e3.id, n2.textContent = e3.name, s2.textContent = "Starting\u2026", f2(), true);
    }, release: p2, isPreviewing: (e3) => !!e3 && o2 === e3.id, destroy() {
      p2(), e2.removeEventListener("playing", m2), e2.removeEventListener("error", h2);
    } };
  }
  function hr(e2) {
    return String(e2 || "").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[آأإ]/g, "\u0627").replace(/ة/g, "\u0647").replace(/ى/g, "\u064A").replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
  }
  function fr(e2) {
    return e2.map((e3) => ({ item: e3, key: hr(e3.name) }));
  }
  var pr = (e2) => new Promise((t2) => setTimeout(t2, e2));
  function gr(e2, t2) {
    return n(this, null, (function* () {
      let n2 = yield e2(), i2 = [];
      for (let e3 of n2) {
        try {
          i2.push.apply(i2, yield t2(e3.id));
        } catch (e4) {
        }
        yield pr(120);
      }
      return i2;
    }));
  }
  var vr = null, yr = null;
  function br() {
    return vr;
  }
  function wr() {
    return vr ? Promise.resolve(vr) : yr || (yr = n(null, null, (function* () {
      let e2 = yield gr(zt, Bt), t2 = yield gr(Vt, Wt), n2 = yield gr(Jt, Ht);
      return vr = { live: fr(e2), movies: fr(t2), series: fr(n2) }, yr = null, vr;
    })));
  }
  var xr = null, kr = null;
  function Cr(e2, t2, n2) {
    let i2 = hr(t2);
    if (!i2) return [];
    let r2 = [], s2 = [];
    for (let t3 of e2) {
      let e3 = t3.key.indexOf(i2);
      if (-1 !== e3 && (0 === e3 ? r2.push(t3.item) : s2.push(t3.item), n2 && r2.length >= n2)) break;
    }
    return n2 ? r2.concat(s2).slice(0, n2) : r2.concat(s2);
  }
  function Sr(e2) {
    return n(this, null, (function* () {
      if ("freetv" === e2) return xr ? Promise.resolve(xr) : kr || (kr = n(null, null, (function* () {
        let e3 = yield St(), t3 = /* @__PURE__ */ Object.create(null), n2 = [];
        for (let i2 of Object.keys(e3.items)) for (let r2 of e3.items[i2]) t3[r2.name] || (t3[r2.name] = true, n2.push(r2));
        return xr = fr(n2), kr = null, xr;
      })));
      let t2 = yield wr();
      return "live" === e2 ? t2.live : "movies" === e2 ? t2.movies : "series" === e2 ? t2.series : t2.live.concat(t2.movies, t2.series);
    }));
  }
  function _r(e2) {
    let t2 = e2.kind, s2 = e2.renderRow, l2 = e2.onOpen, o2 = e2.language || "ar", u2 = null, c2 = [], d2 = i("input", { class: "field-input section-search-input", type: "text", readonly: "readonly", placeholder: "Search\u2026" }), m2 = i("div", { class: "section-search-status", text: "" }), h2 = i("div", { class: "section-search-results" }), f2 = Jn({ language: o2, suggest: (e3) => e3 ? u2 ? Zn(u2, e3, 6) : [] : Xn().slice(0, 6), onChange: () => {
      g2();
    }, onSubmit: () => {
      Gn(d2.value);
      let e3 = h2.querySelector(".channel-row, .card");
      e3 && v(e3);
    } });
    f2.setTarget(d2);
    let p2 = i("div", { class: "section-search" }, [d2, f2.node, m2, h2]), g2 = a(() => n(null, null, (function* () {
      let e3 = d2.value.trim();
      if (r(h2), e3.length < 2) return m2.textContent = "Type at least two characters.", void (c2 = []);
      if (!u2) {
        m2.textContent = "Preparing\u2026";
        try {
          u2 = yield Sr(t2);
        } catch (e4) {
          return void (m2.textContent = "Could not load this section.");
        }
        f2.refreshSuggestions();
      }
      if (d2.value.trim() === e3) {
        if (c2 = Cr(u2, e3, 200), r(h2), !c2.length) return void (m2.textContent = "Nothing found for \u201C" + e3 + "\u201D.");
        m2.textContent = c2.length >= 200 ? "First 200 matches" : c2.length + (1 === c2.length ? " match" : " matches");
        for (let e4 of c2) {
          let t3 = s2(e4);
          t3.__item = e4, h2.appendChild(t3);
        }
      }
    })), 250);
    return p2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target.closest(".channel-row, .card");
      t3 && t3.__item && l2(t3.__item, c2);
    }), { node: p2, prepare() {
      u2 || Sr(t2).then((e3) => {
        u2 = e3, f2.refreshSuggestions();
      }).catch(() => {
      });
    }, reset() {
      d2.value = "", r(h2), c2 = [], m2.textContent = "Type at least two characters.", f2.refreshSuggestions();
    }, firstKey: () => f2.firstKey() };
  }
  var Tr = { live: { title: "Live TV", categories: () => zt(), items: (e2) => Bt(e2), layout: "list", defaultCategory: /bein\s*sport.*\[\s*hd\s*\]/i, defaultItem: /bein\s*sports?\s*1\b/i }, movies: { title: "Movies", categories: () => Vt(), items: (e2) => Wt(e2), layout: "grid" }, series: { title: "Series", categories: () => Jt(), items: (e2) => Ht(e2), layout: "grid" } };
  function Lr(e2) {
    let t2 = Tr[e2.kind], s2 = [], a2 = [], l2 = 0, o2 = false, u2 = false, c2 = i("div", { class: "category-button category-search focusable", text: "\u2315   Search " + t2.title }), d2 = i("div", { class: "pane-scroll" }), h2 = i("div", { class: "category-pane", "data-focus-memory": "browse-cats" }, [i("div", { class: "pane-title", text: "Categories" }), c2, d2]), f2 = i("div", { class: "pane-scroll" }), p2 = i("div", { class: "pane-title", text: "" }), g2 = i("div", { class: "channel-pane", "data-focus-memory": "browse-items" }, [p2, f2]), y2 = "list" === t2.layout ? mr() : null, b2 = _r({ kind: e2.kind, renderRow: (e3) => "grid" === t2.layout ? vi(e3) : bi(e3, { showNumber: Z().showChannelNumbers }), onOpen: (e3, t3) => {
      "live" === e3.kind ? E("player", { channel: e3, siblings: t3, index: t3.indexOf(e3) }) : E("details", { kind: e3.kind, id: e3.id, item: e3 });
    } });
    function x2(e3) {
      b2.node.hidden = !e3, f2.hidden = e3, p2.hidden = e3, y2 && (y2.node.hidden = e3, y2.release()), c2.classList.toggle("active", e3), k2.classList.toggle("searching", e3);
    }
    b2.node.hidden = true;
    let k2 = i("div", { class: "split" + (y2 ? " split-with-preview" : "") }, y2 ? [h2, g2, y2.node] : [h2, g2]);
    function C2(e3, t3, n2, i2) {
      let s3 = 0, a3 = /* @__PURE__ */ new Map(), l3 = 0, o3 = i2 || 1;
      function u3() {
        return Math.ceil(l3 / o3);
      }
      function c3() {
        let i3 = Math.ceil(940 / t3), r2 = Math.max(0, s3 - 4), c4 = Math.min(u3() - 1, s3 + i3 + 4);
        for (let [e4, t4] of a3) {
          let n3 = Math.floor(e4 / o3);
          (n3 < r2 || n3 > c4) && (t4.parentNode && t4.parentNode.removeChild(t4), a3.delete(e4));
        }
        for (let i4 = r2; i4 <= c4; i4++) for (let r3 = 0; r3 < o3; r3++) {
          let s4 = i4 * o3 + r3;
          if (s4 >= l3 || a3.has(s4)) continue;
          let u4 = n2(s4);
          u4 && (u4.setAttribute("data-index", String(s4)), u4.style.position = "absolute", u4.style.top = i4 * t3 + "px", o3 > 1 && (u4.style.left = 224 * r3 + "px"), e3.appendChild(u4), a3.set(s4, u4));
        }
      }
      return { setTotal(n3) {
        l3 = n3, s3 = 0, a3.clear(), r(e3), e3.style.position = "relative", e3.style.height = u3() * t3 + "px", e3.style.transform = "translate3d(0,0,0)", c3();
      }, scrollTo(n3) {
        let i3 = Math.floor(n3 / o3), r2 = Math.floor(940 / t3), a4 = s3;
        i3 < s3 ? a4 = i3 : i3 > s3 + r2 - 1 && (a4 = i3 - r2 + 1), a4 = Math.max(0, Math.min(a4, Math.max(0, u3() - r2))), a4 !== s3 && (s3 = a4, c3()), e3.style.transform = "translate3d(0," + -s3 * t3 + "px,0)";
      }, node: (e4) => a3.get(e4) || null, redraw: c3 };
    }
    let S2 = C2(d2, 76, (e3) => {
      let t3 = s2[e3];
      return t3 ? wi(t3, { active: e3 === l2 }) : null;
    }), _2 = C2(f2, "grid" === t2.layout ? 392 : 88, (e3) => {
      let n2 = a2[e3];
      return n2 ? "grid" === t2.layout ? vi(n2) : bi(n2, { showNumber: Z().showChannelNumbers, favorite: Fi(n2) }) : null;
    }, "grid" === t2.layout ? 5 : 1);
    function T2(e3) {
      return n(this, null, (function* () {
        if (s2[e3]) {
          l2 = e3;
          for (let t3 of d2.querySelectorAll(".category-button")) t3.classList.toggle("active", Number(t3.getAttribute("data-index")) === e3);
          p2.textContent = s2[e3].name, a2 = [], _2.setTotal(0);
          try {
            let n2 = yield t2.items(s2[e3].id);
            if (o2 || l2 !== e3) return;
            if (a2 = n2, _2.setTotal(a2.length), !u2 && t2.defaultItem) {
              u2 = true;
              let e4 = a2.findIndex((e5) => t2.defaultItem.test(e5.name));
              e4 > 0 && _2.scrollTo(e4);
            }
          } catch (t3) {
            o2 || (p2.textContent = s2[e3].name + " \u2014 could not load");
          }
        }
      }));
    }
    function L2(e3) {
      "live" === e3.kind ? E("player", { channel: e3, siblings: a2, index: a2.indexOf(e3) }) : "movie" === e3.kind ? E("details", { kind: "movie", id: e3.id, item: e3 }) : E("details", { kind: "series", id: e3.id, item: e3 });
    }
    return k2.addEventListener("focus-enter", (e3) => {
      let t3 = e3.target, n2 = Number(t3.getAttribute("data-index"));
      isNaN(n2) || (t3.classList.contains("category-button") ? (S2.scrollTo(n2), n2 !== l2 && T2(n2)) : (_2.scrollTo(n2), y2 && t3.__item && y2.show(t3.__item)));
    }), k2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target;
      if (t3 === c2) return x2(true), b2.reset(), void v(b2.firstKey());
      if (t3.classList.contains("category-button")) {
        x2(false);
        let e4 = f2.querySelector(".channel-row, .card");
        e4 && v(e4);
      } else if (t3.__item) {
        if (y2) return void (y2.isPreviewing(t3.__item) ? (y2.release(), L2(t3.__item)) : y2.play(t3.__item, Gt(t3.__item.id, Z().liveFormat, t3.__item)));
        L2(t3.__item);
      }
    }), { mount(e3) {
      ((e4) => {
        g2.appendChild(e4);
      })(b2.node), e3.appendChild(k2), (function() {
        return n(this, null, (function* () {
          if (s2 = yield t2.categories(), o2) return;
          S2.setTotal(s2.length);
          let e4 = t2.defaultCategory ? Math.max(0, s2.findIndex((e5) => t2.defaultCategory.test(e5.name))) : 0;
          S2.scrollTo(e4), w(k2, S2.node(e4)), yield T2(e4);
        }));
      })().catch(() => {
        p2.textContent = "Could not load categories.";
      });
    }, unmount() {
      o2 = true, y2 && y2.destroy(), r(k2);
    }, initialFocus: () => d2.querySelector(".category-button"), onKey: function(e3) {
      if (e3 === Ln || e3 === In) {
        let e4 = m();
        if (e4 && e4.__item) {
          let t3 = Di(e4.__item);
          return e4.classList.toggle("has-favorite", t3), _2.redraw(), true;
        }
      }
      return false;
    } };
  }
  function Ir() {
    return Lr({ kind: "live" });
  }
  function Nr() {
    return Lr({ kind: "movies" });
  }
  function Ar() {
    return Lr({ kind: "series" });
  }
  var Er = [{ kind: "live", title: "Channels", variant: "channel" }, { kind: "movie", title: "Movies", variant: "poster" }, { kind: "series", title: "Series", variant: "poster" }];
  function Or() {
    let e2 = ti({ title: "My Favourites" }), t2 = i("div", { class: "empty", text: "Nothing saved yet. Press the yellow button on any channel or title to add it." });
    function n2(e3) {
      "live" === e3.kind ? E("player", { channel: e3 }) : E("details", { kind: e3.kind, id: e3.id, item: e3 });
    }
    function s2() {
      r(e2.node), e2.node.appendChild(i("div", { class: "page-header" }, [i("h1", { class: "page-title", text: "My Favourites" })]));
      let s3 = false;
      for (let t3 of Er) {
        let i2 = Mi(t3.kind);
        if (!i2.length) continue;
        s3 = true;
        let r2 = i2.map((e3) => "live" === t3.kind ? Object.assign({}, e3, { logo: e3.poster }) : e3), a2 = xi({ key: "fav-" + t3.kind, title: t3.title, items: r2, variant: t3.variant, onSelect: n2 });
        e2.add(a2.node);
      }
      s3 || e2.add(t2);
    }
    return { mount(t3) {
      t3.appendChild(e2.node), s2();
    }, unmount() {
      r(e2.node);
    }, initialFocus: () => e2.node.querySelector(".card"), onKey(t3) {
      if (t3 === Ln || t3 === In) {
        let t4 = m();
        if (t4 && t4.__item) return qi(t4.__item), Ki("Removed from favourites"), s2(), b(e2.node.querySelector(".card")), true;
      }
      return false;
    } };
  }
  function Pr(e2) {
    return e2.seriesName ? e2.seriesName + " \xB7 S" + e2.season + "E" + e2.episodeNumber : e2.name;
  }
  function Mr(e2) {
    if (!e2.duration) return "";
    let t2 = Math.max(0, e2.duration - e2.position);
    return Math.round(t2 / 60) + " min left";
  }
  function Fr() {
    let e2 = ti({});
    function t2(e3) {
      let t3 = hi(e3.kind, e3.id);
      E("player", { item: { kind: e3.kind, id: e3.id, name: e3.name, poster: e3.poster, ext: e3.ext }, seriesId: e3.seriesId || null, seriesName: e3.seriesName || null, season: e3.season || null, episodeNumber: e3.episodeNumber || null, resumeAt: t3 ? t3.position : 0 });
    }
    function n2() {
      r(e2.node), e2.node.appendChild(i("div", { class: "page-header" }, [i("h1", { class: "page-title", text: "Continue Watching" }), i("p", { class: "page-subtitle", text: "Press the yellow button to remove something from this list." })]));
      let n3 = fi(100);
      if (!n3.length) return void e2.add(i("div", { class: "empty", text: "Nothing in progress. Anything you start will show up here." }));
      let s2 = xi({ key: "continue-all", title: "", items: n3.map((e3) => ({ kind: e3.kind, id: e3.id, name: Pr(e3), poster: e3.poster, ext: e3.ext, seriesId: e3.seriesId, seriesName: e3.seriesName, season: e3.season, episodeNumber: e3.episodeNumber, subtitle: Mr(e3) })), onSelect: t2 });
      e2.add(s2.node);
    }
    return { mount(t3) {
      t3.appendChild(e2.node), n2();
    }, unmount() {
      r(e2.node);
    }, initialFocus: () => e2.node.querySelector(".card"), onKey(t3) {
      if (t3 === Ln || t3 === In) {
        let t4 = m();
        if (t4 && t4.__item) return (function(e3, t5) {
          delete ui()[di(e3, t5)], ci();
        })(t4.__item.kind, t4.__item.id), Ki("Removed from Continue Watching"), n2(), b(e2.node.querySelector(".card")), true;
      }
      return false;
    } };
  }
  var qr = hr;
  function Dr() {
    let e2 = ti({}), t2 = false, s2 = i("input", { class: "field-input search-input", type: "text", readonly: "readonly", placeholder: "Search channels, movies and series" }), l2 = i("div", { class: "empty", text: "" }), o2 = i("div", { class: "search-results" }), u2 = Jn({ language: "ar", suggest: (e3) => {
      if (!e3) return Xn().slice(0, 6);
      let t3 = br();
      return t3 ? Zn(t3.series.concat(t3.movies, t3.live), e3, 6) : [];
    }, onChange: () => {
      m2(s2.value);
    }, onSubmit: () => {
      Gn(s2.value);
      let e3 = o2.querySelector(".card");
      e3 && v(e3);
    } });
    function c2(e3) {
      "live" === e3.kind ? E("player", { channel: e3 }) : E("details", { kind: e3.kind, id: e3.id, item: e3 });
    }
    u2.setTarget(s2), e2.node.appendChild(i("div", { class: "page-header" }, [i("h1", { class: "page-title", text: "Search" })])), e2.add(i("div", { class: "search-bar page-block" }, [s2])), e2.add(i("div", { class: "page-block" }, [u2.node])), e2.add(l2), e2.add(o2);
    let d2 = (e3, t3) => Cr(e3, t3);
    let m2 = a((e3) => {
      (function(e4) {
        return n(this, null, (function* () {
          let n2 = qr(e4);
          if (r(o2), n2.length < 2) return void (l2.textContent = "Type at least two characters.");
          br() || (l2.textContent = "Preparing search\u2026");
          let i2 = yield wr();
          if (t2 || qr(s2.value) !== n2) return;
          u2.refreshSuggestions();
          let a2 = [{ title: "Channels", items: d2(i2.live, n2), variant: "channel" }, { title: "Movies", items: d2(i2.movies, n2), variant: "poster" }, { title: "Series", items: d2(i2.series, n2), variant: "poster" }].filter((e5) => e5.items.length);
          if (r(o2), a2.length) {
            l2.textContent = "";
            for (let e5 of a2) {
              let t3 = xi({ key: "search-" + e5.title, title: e5.title + "  (" + e5.items.length + ")", items: e5.items, variant: e5.variant, onSelect: c2 });
              o2.appendChild(t3.node);
            }
          } else l2.textContent = "Nothing found for \u201C" + e4 + "\u201D.";
        }));
      })(e3).catch(() => {
      });
    }, 350);
    return s2.addEventListener("input", () => {
      m2(s2.value);
    }), { mount(t3) {
      t3.appendChild(e2.node), l2.textContent = "Type at least two characters.";
    }, unmount() {
      t2 = true, r(e2.node);
    }, initialFocus: () => u2.firstKey(), onKey(e3) {
      if (e3 === Tn) {
        let e4 = o2.querySelector(".card");
        if (e4) return v(e4), true;
      }
      return false;
    } };
  }
  function jr() {
    let e2 = ti({ title: sn("settings.title") }), t2 = i("div", { class: "settings-list", "data-focus-memory": "settings" });
    function n2(e3, t3, n3, r2) {
      let s3 = i("div", { class: "settings-row focusable" }, [i("div", { class: "settings-text" }, [i("div", { class: "settings-label", text: t3 }), i("div", { class: "settings-description", text: n3 })]), i("div", { class: "settings-value", text: r2 })]);
      return s3.__key = e3, s3;
    }
    function s2() {
      r(t2);
      let e3 = Z();
      t2.appendChild(n2("language", sn("settings.language"), sn("settings.languageDetail"), (Qt.filter((e4) => e4.code === nn())[0] || Qt[0]).label)), t2.appendChild(n2("preferLowerBitrate", "Cap quality at FHD", "4K streams rebuffer on this connection. Off lets 4K play when a channel offers it.", e3.preferLowerBitrate ? sn("settings.on") : sn("settings.off"))), t2.appendChild(n2("liveFormat", "Live stream format", "Raw TS starts about a second faster than HLS on this TV.", "ts" === e3.liveFormat ? "TS (faster)" : "HLS")), t2.appendChild(n2("heroTeaser", "Play previews on the home spotlight", "Plays ~20s of each film. Only while the spotlight is focused, but it uses the account\u2019s single connection while it does.", e3.heroTeaser ? sn("settings.on") : sn("settings.off"))), t2.appendChild(n2("heroTeaserSound", "Spotlight sound", "Plays the preview with sound, the way Netflix\u2019s billboard does.", e3.heroTeaserSound ? sn("settings.on") : sn("settings.off"))), t2.appendChild(n2("showChannelNumbers", "Show channel numbers", "Displays the portal\u2019s channel number beside each channel.", e3.showChannelNumbers ? sn("settings.on") : sn("settings.off"))), t2.appendChild(n2("clearCache", "Clear cached lists", "Forces a fresh fetch of categories and listings.", "")), t2.appendChild(n2("signOut", "Sign out", "Forgets the portal credentials on this TV.", ""));
    }
    return e2.add(t2), t2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target.closest(".settings-row");
      if (!t3) return;
      let n3 = Z();
      switch (t3.__key) {
        case "language": {
          let e4 = Qt.map((e5) => e5.code);
          return (function(e5) {
            en = e5;
            try {
              localStorage.setItem($t, e5);
            } catch (e6) {
            }
            rn();
          })(e4[(e4.indexOf(nn()) + 1) % e4.length]), void A("settings", {});
        }
        case "preferLowerBitrate":
          $({ preferLowerBitrate: !n3.preferLowerBitrate });
          break;
        case "liveFormat":
          $({ liveFormat: "ts" === n3.liveFormat ? "m3u8" : "ts" });
          break;
        case "heroTeaser":
          $({ heroTeaser: !n3.heroTeaser });
          break;
        case "heroTeaserSound":
          $({ heroTeaserSound: !n3.heroTeaserSound });
          break;
        case "showChannelNumbers":
          $({ showChannelNumbers: !n3.showChannelNumbers });
          break;
        case "clearCache":
          return le(), void Ki("Cached lists cleared");
        case "signOut":
          return (function() {
            z = null;
            try {
              localStorage.removeItem(R);
            } catch (e4) {
            }
          })(), le(), void A("welcome", {});
        default:
          return;
      }
      s2();
    }), { mount(t3) {
      t3.appendChild(e2.node), s2();
    }, unmount() {
      r(e2.node);
    }, initialFocus: () => t2.querySelector(".settings-row"), onKey: () => false };
  }
  var Ur = false;
  function Rr(e2) {
    let t2 = e2.onUnlock, n2 = e2.onCancel, s2 = "", a2 = i("div", { class: "pin-dots" }), l2 = i("div", { class: "pin-message", text: "Enter PIN" }), o2 = i("div", { class: "pin-keypad", "data-focus-memory": "pinlock" }), u2 = i("div", { class: "pin-lock" }, [i("div", { class: "pin-title", text: "\u{1F512}  Locked" }), l2, a2, o2]);
    function c2() {
      r(a2);
      for (let e3 = 0; e3 < 4; e3++) a2.appendChild(i("span", { class: "pin-dot" + (e3 < s2.length ? " filled" : "") }));
    }
    function d2(e3) {
      s2.length >= 4 || (s2 += e3, c2(), !(s2.length < 4) && (s2 === (function() {
        try {
          return localStorage.getItem("iptv:lockPin") || "1112";
        } catch (e4) {
          return "1112";
        }
      })() ? (Ur = true, t2()) : (l2.textContent = "Wrong PIN", u2.classList.add("pin-wrong"), s2 = "", setTimeout(() => {
        u2.classList.remove("pin-wrong"), l2.textContent = "Enter PIN", c2();
      }, 900))));
    }
    for (let e3 = 1; e3 <= 9; e3++) {
      let t3 = i("div", { class: "pin-key focusable", text: String(e3) });
      t3.__press = () => d2(String(e3)), o2.appendChild(t3);
    }
    let m2 = i("div", { class: "pin-key pin-key-action focusable", text: "\u232B" });
    m2.__press = () => {
      s2 = s2.slice(0, -1), c2();
    }, o2.appendChild(m2);
    let h2 = i("div", { class: "pin-key focusable", text: "0" });
    h2.__press = () => d2("0"), o2.appendChild(h2);
    let f2 = i("div", { class: "pin-key pin-key-action focusable", text: "\u2715" });
    return f2.__press = () => {
      n2 && n2();
    }, o2.appendChild(f2), u2.addEventListener("focus-activate", (e3) => {
      let t3 = e3.target.closest(".pin-key");
      t3 && t3.__press && t3.__press();
    }), c2(), { node: u2, reset() {
      s2 = "", l2.textContent = "Enter PIN", c2();
    }, focusFirst() {
      v(o2.querySelector(".pin-key"));
    } };
  }
  function Kr() {
    let e2 = [], t2 = [], s2 = 0, a2 = false, l2 = i("div", { class: "category-button category-search focusable", text: "\u2315   Search free channels" }), o2 = i("div", { class: "pane-scroll" }), u2 = i("div", { class: "category-pane", "data-focus-memory": "free-cats" }, [i("div", { class: "pane-title", text: "Free channels" }), l2, o2]), c2 = i("div", { class: "pane-scroll" }), d2 = i("div", { class: "pane-title", text: "Loading\u2026" }), h2 = i("div", { class: "channel-pane", "data-focus-memory": "free-items" }, [d2, c2]), f2 = mr(), p2 = _r({ kind: "freetv", renderRow: (e3) => bi(e3, {}), onOpen: (e3, t3) => {
      E("player", { channel: e3, siblings: t3, index: t3.indexOf(e3) });
    } });
    p2.node.hidden = true;
    let g2 = i("div", { class: "split split-with-preview" }, [u2, h2, f2.node]);
    function y2(e3) {
      p2.node.hidden = !e3, c2.hidden = e3, d2.hidden = e3, f2.node.hidden = e3, f2.release(), l2.classList.toggle("active", e3);
    }
    function b2(e3, t3, n2) {
      let i2 = 0, s3 = /* @__PURE__ */ new Map(), a3 = 0;
      function l3() {
        let r2 = Math.ceil(940 / t3), l4 = Math.max(0, i2 - 4), o3 = Math.min(a3 - 1, i2 + r2 + 4);
        for (let [e4, t4] of s3) (e4 < l4 || e4 > o3) && (t4.parentNode && t4.parentNode.removeChild(t4), s3.delete(e4));
        for (let i3 = l4; i3 <= o3; i3++) {
          if (s3.has(i3)) continue;
          let r3 = n2(i3);
          r3 && (r3.setAttribute("data-index", String(i3)), r3.style.position = "absolute", r3.style.top = i3 * t3 + "px", e3.appendChild(r3), s3.set(i3, r3));
        }
      }
      return { setTotal(n3) {
        a3 = n3, i2 = 0, s3.clear(), r(e3), e3.style.position = "relative", e3.style.height = a3 * t3 + "px", e3.style.transform = "translate3d(0,0,0)", l3();
      }, scrollTo(n3) {
        let r2 = Math.floor(940 / t3), s4 = i2;
        n3 < i2 ? s4 = n3 : n3 > i2 + r2 - 1 && (s4 = n3 - r2 + 1), s4 = Math.max(0, Math.min(s4, Math.max(0, a3 - r2))), s4 !== i2 && (i2 = s4, l3()), e3.style.transform = "translate3d(0," + -i2 * t3 + "px,0)";
      }, node: (e4) => s3.get(e4) || null };
    }
    let x2 = b2(o2, 76, (t3) => {
      let n2 = e2[t3];
      return n2 ? wi(n2, { active: t3 === s2 }) : null;
    }), k2 = b2(c2, 88, (e3) => {
      let n2 = t2[e3];
      return n2 ? bi(n2, { favorite: Fi(n2) }) : null;
    });
    function C2(i2) {
      return n(this, null, (function* () {
        if (!e2[i2]) return;
        s2 = i2;
        for (let e3 of o2.querySelectorAll(".category-button")) e3.classList.toggle("active", Number(e3.getAttribute("data-index")) === i2);
        if (d2.textContent = e2[i2].name, e2[i2].locked && !Ur) return t2 = [], k2.setTotal(0), void _2(true);
        _2(false);
        let n2 = yield Tt(e2[i2].id);
        a2 || s2 !== i2 || (t2 = n2.slice().sort((e3, t3) => dr(e3.id) - dr(t3.id)), k2.setTotal(t2.length), e2[i2].autoPlayFirst && t2.length && f2.play(t2[0]));
      }));
    }
    let S2 = Rr({ onUnlock: () => {
      _2(false), C2(s2);
    }, onCancel: () => {
      _2(false), v(x2.node(s2));
    } });
    function _2(e3) {
      S2.node.hidden = !e3, c2.hidden = e3, f2.node.hidden = e3, e3 && (f2.release(), S2.reset(), S2.focusFirst());
    }
    return S2.node.hidden = true, g2.addEventListener("focus-enter", (e3) => {
      let t3 = Number(e3.target.getAttribute("data-index"));
      isNaN(t3) || (e3.target.classList.contains("category-button") ? (x2.scrollTo(t3), t3 !== s2 && C2(t3)) : (k2.scrollTo(t3), e3.target.__item && f2.show(e3.target.__item)));
    }), g2.addEventListener("focus-activate", (e3) => {
      let n2 = e3.target;
      if (n2 === l2) return y2(true), p2.reset(), void v(p2.firstKey());
      if (n2.classList.contains("category-button")) {
        y2(false);
        let e4 = c2.querySelector(".channel-row");
        e4 && v(e4);
      } else n2.__item && (f2.isPreviewing(n2.__item) ? (f2.release(), E("player", { channel: n2.__item, siblings: t2, index: t2.indexOf(n2.__item) })) : f2.play(n2.__item, n2.__item.url));
    }), { mount(t3) {
      h2.appendChild(p2.node), h2.appendChild(S2.node), t3.appendChild(g2), (function() {
        return n(this, null, (function* () {
          if (e2 = yield _t(), a2) return;
          x2.setTotal(e2.length), w(g2, x2.node(0)), yield C2(0);
          let t4 = jt();
          t4 && (d2.textContent = e2[0].name + "   \xB7   " + t4.kept.toLocaleString() + " channels  \xB7  unfiltered");
        }));
      })().catch((e3) => {
        d2.textContent = "Could not load: " + e3.message;
      }), p2.prepare();
    }, unmount() {
      a2 = true, f2.destroy(), r(g2);
    }, initialFocus: () => o2.querySelector(".category-button"), onKey(e3) {
      if (e3 === Ln || e3 === In) {
        let e4 = m();
        if (e4 && e4.__item) return Di(e4.__item), true;
      }
      return false;
    } };
  }
  function zr() {
    rn();
    let e2 = (function(e3, t3) {
      return (t3 || document).querySelector(e3);
    })("#app");
    e2.innerHTML = "";
    let t2 = dn(), r2 = i("div", { class: "content" });
    function s2() {
      let e3 = I(), n2 = "player" === e3;
      t2.node.style.display = n2 ? "none" : "", r2.style.left = n2 ? "0" : "", n2 || t2.setCurrent(e3);
    }
    e2.appendChild(t2.node), e2.appendChild(r2), L(r2), window.__router = l, T("welcome", ei), T("home", ji), T("player", rr), T("details", ar), T("live", Ir), T("movies", Nr), T("series", Ar), T("favorites", Or), T("continue", Fr), T("search", Dr), T("settings", jr), T("freetv", Kr), document.addEventListener("focus-moved", s2), document.addEventListener("keydown", (e3) => {
      let n2 = e3.keyCode;
      if (q(n2)) return void e3.preventDefault();
      let i2 = Dn[n2];
      if (i2) return y(i2), void e3.preventDefault();
      if (Un(n2)) return u && u.dispatchEvent(new CustomEvent("focus-activate", { bubbles: true })), void e3.preventDefault();
      if (jn(n2)) {
        if (!M()) {
          v(t2.button(I()) || t2.button("home"));
        }
        e3.preventDefault();
      }
    }), "free" === V() || null !== W() ? ((function() {
      let e3 = 0;
      try {
        e3 = Number(localStorage.getItem(ae)) || 0;
      } catch (e4) {
      }
      if (e3 && re() - e3 < 864e5) return false;
      le();
      try {
        localStorage.setItem(ae, String(re()));
      } catch (e4) {
      }
    })(), A("home", {}), (pn ? Promise.resolve(pn) : gn || (gn = n(null, null, (function* () {
      let e3 = yield zt(), t3 = /* @__PURE__ */ Object.create(null);
      for (let n2 of e3) {
        let e4;
        try {
          e4 = yield Bt(n2.id);
        } catch (e5) {
          continue;
        }
        for (let i2 of e4) {
          let e5 = fn(i2.name);
          if (!e5) continue;
          let r3 = hn(i2.name) || hn(n2.name);
          t3[e5] || (t3[e5] = []), t3[e5].push({ id: i2.id, name: i2.name, logo: i2.logo, categoryId: i2.categoryId, quality: r3 ? r3.tag : null, rank: r3 ? r3.rank : 2 });
        }
      }
      for (let e4 of Object.keys(t3)) t3[e4].sort((e5, t4) => e5.rank - t4.rank);
      return gn = null, pn = t3;
    })))).catch(() => {
    })) : A("welcome", {}), s2();
  }
  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", zr) : zr();
})();
