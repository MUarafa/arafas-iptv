(() => {
  var e = Object.defineProperty,
    t = (t, n) => {
      for (var i in n) e(t, i, { get: n[i], enumerable: !0 });
    },
    n = (e, t, n) =>
      new Promise((i, r) => {
        var s = (e) => {
            try {
              l(n.next(e));
            } catch (e) {
              r(e);
            }
          },
          a = (e) => {
            try {
              l(n.throw(e));
            } catch (e) {
              r(e);
            }
          },
          l = (e) => (e.done ? i(e.value) : Promise.resolve(e.value).then(s, a));
        l((n = n.apply(e, t)).next());
      });
  function i(e, t, n) {
    let i = document.createElement(e);
    if (t)
      for (let e of Object.keys(t)) {
        let n = t[e];
        null == n ||
          !1 === n ||
          ("class" === e
            ? (i.className = n)
            : "text" === e
              ? (i.textContent = n)
              : "html" === e
                ? (i.innerHTML = n)
                : "style" === e
                  ? (i.style.cssText = n)
                  : "on" === e.slice(0, 2)
                    ? i.addEventListener(e.slice(2), n)
                    : (e.slice(0, 5), i.setAttribute(e, n)));
      }
    return (
      n &&
        (function (e, t) {
          let n = Array.isArray(t) ? t : [t];
          for (let t of n)
            null == t ||
              !1 === t ||
              e.appendChild("string" == typeof t ? document.createTextNode(t) : t);
        })(i, n),
      i
    );
  }
  function r(e) {
    for (; e.firstChild;) e.removeChild(e.firstChild);
    return e;
  }
  function s(e, t) {
    return Array.prototype.slice.call((t || document).querySelectorAll(e));
  }
  function a(e, t) {
    let n = null;
    return function (...i) {
      (n && clearTimeout(n),
        (n = setTimeout(() => {
          ((n = null), e.apply(this, i));
        }, t)));
    };
  }
  (typeof globalThis > "u" &&
    (Object.defineProperty(Object.prototype, "__globalThis__", {
      get: function () {
        return this;
      },
      configurable: !0,
    }),
    (__globalThis__.globalThis = __globalThis__),
    delete Object.prototype.__globalThis__),
    Array.prototype.flat ||
      Object.defineProperty(Array.prototype, "flat", {
        configurable: !0,
        writable: !0,
        value: function (e) {
          var t = void 0 === e ? 1 : Number(e) || 0,
            n = [];
          return (
            (function e(t, i) {
              for (var r = 0; r < t.length; r++)
                Array.isArray(t[r]) && i > 0 ? e(t[r], i - 1) : n.push(t[r]);
            })(this, t),
            n
          );
        },
      }),
    Object.fromEntries ||
      (Object.fromEntries = function (e) {
        for (var t = {}, n = Array.isArray(e) ? e : Array.from(e), i = 0; i < n.length; i++)
          t[n[i][0]] = n[i][1];
        return t;
      }),
    Promise.allSettled ||
      (Promise.allSettled = function (e) {
        return Promise.all(
          Array.prototype.map.call(e, function (e) {
            return Promise.resolve(e).then(
              function (e) {
                return { status: "fulfilled", value: e };
              },
              function (e) {
                return { status: "rejected", reason: e };
              },
            );
          }),
        );
      }),
    typeof AbortController > "u" &&
      (window.AbortController = function () {
        ((this.signal = {
          aborted: !1,
          addEventListener: function () {},
          removeEventListener: function () {},
        }),
          (this.abort = function () {
            this.signal.aborted = !0;
          }));
      }),
    String.prototype.matchAll ||
      Object.defineProperty(String.prototype, "matchAll", {
        configurable: !0,
        writable: !0,
        value: function (e) {
          for (
            var t,
              n = -1 === e.flags.indexOf("g") ? e.flags + "g" : e.flags,
              i = new RegExp(e.source, n),
              r = String(this),
              s = [];
            null !== (t = i.exec(r));
          )
            (s.push(t), "" === t[0] && i.lastIndex++);
          return s[Symbol.iterator]();
        },
      }));
  var l = {};
  t(l, {
    back: () => M,
    canGoBack: () => F,
    current: () => I,
    go: () => A,
    handleKey: () => q,
    init: () => L,
    push: () => E,
    register: () => T,
    replace: () => P,
    view: () => D,
  });
  var o = ".focusable:not(.disabled):not([hidden])",
    u = null,
    c = Object.create(null),
    d = !0;
  function m() {
    return u;
  }
  function h(e) {
    if (null === e.offsetParent && "fixed" !== getComputedStyle(e).position) return !1;
    let t = e.getBoundingClientRect();
    return t.width > 0 && t.height > 0;
  }
  function f(e) {
    return s(o, e || document.querySelector("[data-focus-trap]") || document).filter(h);
  }
  function p(e) {
    return { x: e.left + e.width / 2, y: e.top + e.height / 2 };
  }
  function g(e, t, n) {
    let i,
      r,
      s = p(e),
      a = p(t);
    return (
      "left" === n || "right" === n
        ? ((i = "right" === n ? t.left - e.right : e.left - t.right),
          (r = Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top) > 0 ? 0 : Math.abs(a.y - s.y)))
        : ((i = "down" === n ? t.top - e.bottom : e.top - t.bottom),
          (r =
            Math.min(e.right, t.right) - Math.max(e.left, t.left) > 0 ? 0 : Math.abs(a.x - s.x))),
      i < -2 ? null : Math.max(i, 0) + 4 * r
    );
  }
  function v(e, t) {
    if (!e) return !1;
    let n =
      t && t.exact
        ? e
        : (function (e) {
            let t = e.closest("[data-focus-memory]");
            if (!t) return e;
            let n = t.getAttribute("data-focus-memory"),
              i = c[n];
            return (u && t.contains(u)) || !i || !t.contains(i) || !h(i) ? e : i;
          })(e);
    return (
      (d = !(!t || !t.provisional)),
      n === u ||
        (u && (u.classList.remove("focused"), u.removeAttribute("data-focused")),
        (u = n).classList.add("focused"),
        u.setAttribute("data-focused", ""),
        (function (e) {
          let t = e.closest("[data-focus-memory]");
          t && (c[t.getAttribute("data-focus-memory")] = e);
        })(u),
        u.dispatchEvent(new CustomEvent("focus-enter", { bubbles: !0 })),
        document.dispatchEvent(new CustomEvent("focus-moved", { detail: { node: u } }))),
      !0
    );
  }
  function y(e) {
    let t = (function (e, t) {
      let n = t || u;
      if (!n) return f()[0] || null;
      let i = n.getBoundingClientRect(),
        r = (function (e, t) {
          let n = "up" === t || "down" === t ? "vertical" : "horizontal",
            i = e.closest("[data-focus-contain]");
          return i && i.getAttribute("data-focus-contain") === n ? i : null;
        })(n, e),
        a = null,
        l = 1 / 0;
      for (let t of r ? s(o, r).filter(h) : f()) {
        if (t === n) continue;
        let r = g(i, t.getBoundingClientRect(), e);
        null === r || r >= l || ((l = r), (a = t));
      }
      return a;
    })(e);
    return t
      ? v(t)
      : (u && u.dispatchEvent(new CustomEvent("focus-edge", { bubbles: !0, detail: { dir: e } })),
        !1);
  }
  function b(e) {
    (u && !document.contains(u) && (u.classList.remove("focused"), (u = null)),
      u || v(e || f()[0], { provisional: !0 }));
  }
  function w(e, t) {
    return !(!t || !e || (u && e.contains(u)) || !d) && v(t);
  }
  var x = Object.create(null),
    k = [],
    C = null,
    S = null,
    _ = null;
  function T(e, t) {
    x[e] = t;
  }
  function L(e) {
    C = e;
  }
  function I() {
    return _;
  }
  function N(e, t) {
    let n = x[e];
    if (!n) throw new Error("Unknown view: " + e);
    if (S && S.unmount)
      try {
        S.unmount();
      } catch (e) {}
    (r(C), (_ = e), (S = n(t || {})).mount(C), b(S.initialFocus ? S.initialFocus() : null));
  }
  function A(e, t) {
    ((k.length = 0), N(e, t));
  }
  function E(e, t) {
    (_ && k.push({ name: _, params: O }), (O = t), N(e, t));
  }
  var O = null;
  function P(e, t) {
    ((O = t), N(e, t));
  }
  function M() {
    let e = k.pop();
    return !!e && ((O = e.params), N(e.name, e.params), !0);
  }
  function F() {
    return k.length > 0;
  }
  function q(e) {
    return !(!S || !S.onKey) && S.onKey(e);
  }
  function D() {
    return S;
  }
  var j = {};
  t(j, {
    authenticate: () => fe,
    episodeUrl: () => Ee,
    liveCategories: () => ge,
    liveStreams: () => ke,
    liveUrl: () => Ne,
    movieInfo: () => _e,
    movieUrl: () => Ae,
    seriesCategories: () => ye,
    seriesInfo: () => Te,
    seriesList: () => Se,
    shortEpg: () => Le,
    vodCategories: () => ve,
    vodStreams: () => Ce,
  });
  var U = { url: "", username: "", password: "" },
    R = "iptv:credentials",
    K = "iptv:source",
    z = null,
    B = null;
  function V() {
    if (B) return B;
    try {
      B = localStorage.getItem(K) || "xtream";
    } catch (e) {
      B = "xtream";
    }
    return B;
  }
  function W() {
    if (z) return z;
    try {
      let e = localStorage.getItem(R);
      e && (z = JSON.parse(e));
    } catch (e) {
      z = null;
    }
    return z;
  }
  function J() {
    let e = W();
    if (!e) throw new Error("Not signed in");
    return e;
  }
  var H = "iptv:settings",
    X = {
      preferLowerBitrate: !0,
      liveFormat: "ts",
      showChannelNumbers: !0,
      startupView: "home",
      introSkipSeconds: 90,
      nextEpisodePromptSeconds: 60,
      heroTeaser: !0,
      heroTeaserSound: !0,
    },
    G = null;
  function Z() {
    if (G) return G;
    G = Object.assign({}, X);
    try {
      let e = localStorage.getItem(H);
      e && Object.assign(G, JSON.parse(e));
    } catch (e) {}
    return G;
  }
  function $(e) {
    let t = Object.assign(Z(), e);
    G = t;
    try {
      localStorage.setItem(H, JSON.stringify(t));
    } catch (e) {}
    return t;
  }
  var Q = "iptv:cache:",
    Y = new Map(),
    ee = 864e5,
    te = 216e5,
    ne = 6048e5,
    ie = 3e5;
  function re() {
    return Date.now();
  }
  function se(e, t, n) {
    let i,
      r = { value: t, expires: re() + (n || ie) };
    Y.set(e, r);
    try {
      i = JSON.stringify(r);
    } catch (e) {
      return;
    }
    if (!(i.length > 262144))
      try {
        localStorage.setItem(Q + e, i);
      } catch (t) {
        !(function (e) {
          let t = [],
            n = 0;
          try {
            n = localStorage.length;
          } catch (e) {
            return;
          }
          for (let e = 0; e < n; e++) {
            let n;
            try {
              n = localStorage.key(e);
            } catch (e) {
              continue;
            }
            if (!n || n.slice(0, Q.length) !== Q) continue;
            let i = 0;
            try {
              i = (JSON.parse(localStorage.getItem(n)) || {}).expires || 0;
            } catch (e) {}
            t.push({ key: n, expires: i });
          }
          t.sort((e, t) => e.expires - t.expires);
          for (let n of t.slice(0, e))
            try {
              localStorage.removeItem(n.key);
            } catch (e) {}
        })(8);
        try {
          localStorage.setItem(Q + e, i);
        } catch (e) {}
      }
  }
  var ae = "iptv:lastRefresh";
  function le() {
    Y.clear();
    let e = [];
    try {
      for (let t = 0; t < localStorage.length; t++) {
        let n = localStorage.key(t);
        n && n.slice(0, Q.length) === Q && e.push(n);
      }
      for (let t of e) localStorage.removeItem(t);
    } catch (e) {}
  }
  var oe = new Map();
  function ue(e, t, n, i) {
    let r = (function (e) {
      let t,
        n,
        i = Y.get(e);
      if (i) {
        if (i.expires > re()) return i.value;
        Y.delete(e);
      }
      try {
        t = localStorage.getItem(Q + e);
      } catch (e) {
        return null;
      }
      if (!t) return null;
      try {
        n = JSON.parse(t);
      } catch (t) {
        try {
          localStorage.removeItem(Q + e);
        } catch (e) {}
        return null;
      }
      if (!n || n.expires <= re()) {
        try {
          localStorage.removeItem(Q + e);
        } catch (e) {}
        return null;
      }
      return (Y.set(e, n), n.value);
    })(e);
    if (null != r) return Promise.resolve(r);
    if (oe.has(e)) return oe.get(e);
    let s = n()
      .then(
        (n) => (
          i && i.memoryOnly
            ? (function (e, t, n) {
                Y.set(e, { value: t, expires: re() + (n || te) });
              })(e, n, t)
            : se(e, n, t),
          oe.delete(e),
          n
        ),
      )
      .catch((t) => {
        throw (oe.delete(e), t);
      });
    return (oe.set(e, s), s);
  }
  function ce() {
    return J().url.replace(/\/+$/, "");
  }
  function de() {
    let e = J();
    return encodeURIComponent(e.username) + "/" + encodeURIComponent(e.password);
  }
  function me(e, t) {
    return n(this, null, function* () {
      let n = new AbortController(),
        i = setTimeout(() => n.abort(), 2e4);
      try {
        let r = yield fetch(
          (function (e, t) {
            let n = J(),
              i = new URLSearchParams();
            if (
              (i.set("username", n.username),
              i.set("password", n.password),
              e && i.set("action", e),
              t)
            )
              for (let e of Object.keys(t)) void 0 !== t[e] && null !== t[e] && i.set(e, t[e]);
            return ce() + "/player_api.php?" + i.toString();
          })(e, t),
          { signal: n.signal },
        );
        if (!r.ok) throw new Error("HTTP " + r.status + " for " + (e || "auth"));
        let s = yield r.text();
        try {
          return JSON.parse(s);
        } catch (t) {
          throw new Error(
            /^s*<(!doctype|html)/i.test(s) ? "__NOAPI__" : "Bad JSON from " + (e || "auth"),
          );
        }
      } finally {
        clearTimeout(i);
      }
    });
  }
  function he(e) {
    return Array.isArray(e) ? e : [];
  }
  function fe() {
    return n(this, null, function* () {
      let e = yield me(null),
        t = e && e.user_info;
      if (!t || "0" === String(t.auth) || !t.status) throw new Error("Login failed");
      if ("active" !== String(t.status).toLowerCase()) throw new Error("Account is " + t.status);
      return {
        status: t.status,
        expiresAt: t.exp_date ? 1e3 * Number(t.exp_date) : null,
        maxConnections: Number(t.max_connections) || 1,
        activeConnections: Number(t.active_cons) || 0,
        allowedFormats: he(t.allowed_output_formats),
        trial: "1" === String(t.is_trial),
      };
    });
  }
  function pe(e, t) {
    return ue("cats:" + e, ee, () =>
      n(null, null, function* () {
        return he(yield me(t)).map((t) => ({
          id: String(t.category_id),
          name: String(t.category_name || "").trim(),
          kind: e,
        }));
      }),
    );
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
  function be(e) {
    return {
      kind: "live",
      id: String(e.stream_id),
      name: String(e.name || "").trim(),
      logo: e.stream_icon || null,
      categoryId: String(e.category_id),
      epgChannelId: e.epg_channel_id || null,
      number: null != e.num ? Number(e.num) : null,
    };
  }
  function we(e) {
    return {
      kind: "movie",
      id: String(e.stream_id),
      name: String(e.name || "").trim(),
      poster: e.stream_icon || null,
      categoryId: String(e.category_id),
      ext: e.container_extension || "mp4",
      rating: e.rating ? Number(e.rating) : null,
      added: e.added ? 1e3 * Number(e.added) : null,
    };
  }
  function xe(e) {
    return {
      kind: "series",
      id: String(e.series_id),
      name: String(e.name || "").trim(),
      poster: e.cover || null,
      categoryId: String(e.category_id),
      rating: e.rating ? Number(e.rating) : null,
      plot: e.plot || "",
      genre: e.genre || "",
      lastModified: e.last_modified ? 1e3 * Number(e.last_modified) : null,
    };
  }
  function ke(e) {
    return ue(
      "live:" + e,
      te,
      () =>
        n(null, null, function* () {
          return he(yield me("get_live_streams", { category_id: e })).map(be);
        }),
      { memoryOnly: !0 },
    );
  }
  function Ce(e) {
    return ue(
      "vod:" + e,
      te,
      () =>
        n(null, null, function* () {
          return he(yield me("get_vod_streams", { category_id: e })).map(we);
        }),
      { memoryOnly: !0 },
    );
  }
  function Se(e) {
    return ue(
      "series:" + e,
      te,
      () =>
        n(null, null, function* () {
          return he(yield me("get_series", { category_id: e })).map(xe);
        }),
      { memoryOnly: !0 },
    );
  }
  function _e(e) {
    return ue("movieinfo:" + e, ne, () =>
      n(null, null, function* () {
        let t = yield me("get_vod_info", { vod_id: e }),
          n = (t && t.info) || {},
          i = (t && t.movie_data) || {};
        return {
          name: n.name || i.name || "",
          plot: n.plot || n.description || "",
          cast: n.cast || "",
          director: n.director || "",
          genre: n.genre || "",
          releaseDate: n.releasedate || n.release_date || "",
          rating: n.rating ? Number(n.rating) : null,
          durationSecs: n.duration_secs ? Number(n.duration_secs) : null,
          poster: n.movie_image || n.cover_big || null,
          backdrops: he(n.backdrop_path),
          youtubeTrailer: n.youtube_trailer || null,
          ext: i.container_extension || "mp4",
          streamId: String(i.stream_id || e),
        };
      }),
    );
  }
  function Te(e) {
    return ue(
      "seriesinfo:" + e,
      ne,
      () =>
        n(null, null, function* () {
          let t = yield me("get_series_info", { series_id: e }),
            n = (t && t.info) || {},
            i = (t && t.episodes) || {},
            r = Object.keys(i)
              .sort((e, t) => Number(e) - Number(t))
              .map((e) => ({
                number: Number(e),
                episodes: he(i[e]).map((t) => ({
                  id: String(t.id),
                  title: String(t.title || "").trim(),
                  episodeNumber: Number(t.episode_num) || 0,
                  season: Number(e),
                  ext: t.container_extension || "mp4",
                  plot: (t.info && t.info.plot) || "",
                  still: (t.info && (t.info.movie_image || t.info.cover_big)) || null,
                  durationSecs:
                    t.info && t.info.duration_secs ? Number(t.info.duration_secs) : null,
                })),
              }));
          return {
            name: n.name || "",
            plot: n.plot || "",
            cast: n.cast || "",
            director: n.director || "",
            genre: n.genre || "",
            releaseDate: n.releaseDate || n.releasedate || "",
            rating: n.rating ? Number(n.rating) : null,
            poster: n.cover || null,
            backdrops: he(n.backdrop_path),
            seasons: r,
          };
        }),
      { memoryOnly: !0 },
    );
  }
  function Le(e, t) {
    return ue(
      "epg:" + e,
      ie,
      () =>
        n(null, null, function* () {
          let n = yield me("get_short_epg", { stream_id: e, limit: t || 4 });
          return he(n && n.epg_listings).map((e) => ({
            title: Ie(e.title),
            description: Ie(e.description),
            start: e.start ? new Date(e.start.replace(" ", "T")).getTime() : null,
            end: e.end ? new Date(e.end.replace(" ", "T")).getTime() : null,
            nowPlaying: "1" === String(e.now_playing),
          }));
        }),
      { memoryOnly: !0 },
    );
  }
  function Ie(e) {
    if (!e) return "";
    try {
      return decodeURIComponent(escape(window.atob(e)));
    } catch (t) {
      try {
        return window.atob(e);
      } catch (t) {
        return String(e);
      }
    }
  }
  function Ne(e, t) {
    return ce() + "/live/" + de() + "/" + e + "." + (t || "ts");
  }
  function Ae(e, t) {
    return ce() + "/movie/" + de() + "/" + e + "." + (t || "mp4");
  }
  function Ee(e, t) {
    return ce() + "/series/" + de() + "/" + e + "." + (t || "mp4");
  }
  var Oe = {};
  t(Oe, {
    authenticate: () => Ye,
    build: () => Re,
    episodeUrl: () => Qe,
    liveCategories: () => Ke,
    liveStreams: () => ze,
    liveUrl: () => Ze,
    movieInfo: () => He,
    movieUrl: () => $e,
    parse: () => Ue,
    reset: () => et,
    seriesCategories: () => We,
    seriesInfo: () => Xe,
    seriesList: () => Je,
    shortEpg: () => Ge,
    vodCategories: () => Be,
    vodStreams: () => Ve,
  });
  var Pe = null,
    Me = null;
  function Fe(e) {
    let t,
      n = Object.create(null),
      i = /([a-zA-Z0-9-]+)="([^"]*)"/g;
    for (; null !== (t = i.exec(e));) n[t[1].toLowerCase()] = t[2];
    return n;
  }
  function qe(e) {
    let t = e.lastIndexOf(",");
    return -1 === t ? "" : e.slice(t + 1).trim();
  }
  var De = [
    { name: "United Kingdom", re: /\b(uk|gb|british|britain|england)\b/i },
    { name: "United States", re: /\b(us|usa|united states|american)\b/i },
    { name: "Egypt", re: /\b(eg|egy|egypt)\b|مصر/i },
    { name: "Saudi Arabia", re: /\b(sa|ksa|saudi)\b|السعودية/i },
    { name: "United Arab Emirates", re: /\b(ae|uae|emirates)\b|الامارات/i },
    { name: "Qatar", re: /\b(qa|qatar)\b|قطر/i },
    { name: "Kuwait", re: /\b(kw|kuwait)\b|الكويت/i },
    { name: "Lebanon", re: /\b(lb|lebanon)\b|لبنان/i },
    { name: "Morocco", re: /\b(ma|morocco)\b|المغرب/i },
    { name: "Turkey", re: /\b(tr|turkey|turkish)\b/i },
    { name: "France", re: /\b(fr|france|french)\b/i },
    { name: "Germany", re: /\b(de|germany|german)\b/i },
    { name: "Spain", re: /\b(es|spain|spanish)\b/i },
    { name: "Italy", re: /\b(it|italy|italian)\b/i },
    { name: "India", re: /\b(in|india|indian)\b/i },
  ];
  function je(e) {
    for (let t of De) if (t.re.test(e)) return t.name;
    return null;
  }
  function Ue(e) {
    let t = String(e).split(/\r?\n/),
      n = Object.create(null),
      i = [],
      r = null,
      s = 0,
      a = !1;
    for (let e of t) {
      let t = e.trim();
      if (!t) continue;
      if ("#EXTINF:" === t.slice(0, 8)) {
        let e = Fe(t),
          n = qe(t) || e["tvg-name"] || "Channel",
          i = (e["group-title"] || "").trim();
        (i && (a = !0),
          (r = { name: n, logo: e["tvg-logo"] || null, group: i || je(n) || "Uncategorised" }));
        continue;
      }
      if ("#" === t.charAt(0) || !r) continue;
      s++;
      let l = {
        kind: "live",
        id: "m3u:" + s,
        name: r.name,
        logo: r.logo,
        url: t,
        categoryId: r.group,
        number: null,
      };
      (n[r.group] || ((n[r.group] = []), i.push(r.group)), n[r.group].push(l), (r = null));
    }
    return {
      categories: (a ? i : i.slice().sort((e, t) => n[t].length - n[e].length)).map((e) => ({
        id: e,
        name: e + "  (" + n[e].length + ")",
        kind: "live",
      })),
      items: n,
      count: s,
    };
  }
  function Re() {
    return Pe
      ? Promise.resolve(Pe)
      : Me ||
          (Me = n(null, null, function* () {
            let e = J(),
              t = yield fetch(e.url);
            if (!t.ok) throw new Error("Playlist download failed (HTTP " + t.status + ")");
            let n = yield t.text();
            if (-1 === n.indexOf("#EXTM3U") && -1 === n.indexOf("#EXTINF"))
              throw new Error("That URL is not an M3U playlist");
            return ((Pe = Ue(n)), (Me = null), Pe);
          }));
  }
  function Ke() {
    return n(this, null, function* () {
      return (yield Re()).categories;
    });
  }
  function ze(e) {
    return n(this, null, function* () {
      return (yield Re()).items[e] || [];
    });
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
  function Ze(e, t, n) {
    return n && n.url ? n.url : "";
  }
  function $e() {
    return "";
  }
  function Qe() {
    return "";
  }
  function Ye() {
    return n(this, null, function* () {
      let e = yield Re();
      if (!e.count) throw new Error("That playlist has no channels in it");
      return {
        status: "Active",
        expiresAt: null,
        maxConnections: 0,
        activeConnections: 0,
        allowedFormats: ["m3u8"],
        trial: !1,
        channelCount: e.count,
      };
    });
  }
  function et() {
    ((Pe = null), (Me = null));
  }
  var tt = {};
  t(tt, {
    ADULT_CATEGORY_ID: () => wt,
    KEEP_ADULT_SHELF: () => bt,
    authenticate: () => Dt,
    build: () => St,
    episodeUrl: () => qt,
    liveCategories: () => _t,
    liveStreams: () => Tt,
    liveUrl: () => Mt,
    movieInfo: () => Et,
    movieUrl: () => Ft,
    seriesCategories: () => Nt,
    seriesInfo: () => Ot,
    seriesList: () => At,
    shortEpg: () => Pt,
    stats: () => jt,
    vodCategories: () => Lt,
    vodStreams: () => It,
  });
  var nt = ["xxx", "adult", "erotic"],
    it = [
      "xxx",
      "porn",
      "sex",
      "adult",
      "erotic",
      "playboy",
      "hustler",
      "brazzers",
      "penthouse",
      "private tv",
      "dorcel",
      "vivid",
      "redlight",
      "blue hustler",
      "hot tv",
      "sexy",
      "nudity",
      "eroxxx",
      "barely",
      "fetish",
      "babes",
    ],
    rt = [
      "news",
      "sports",
      "movies",
      "series",
      "entertainment",
      "kids",
      "music",
      "documentary",
      "comedy",
      "religious",
      "culture",
      "education",
      "lifestyle",
      "animation",
      "science",
      "travel",
      "business",
      "classic",
      "family",
      "general",
    ],
    st = [
      "EG",
      "SA",
      "AE",
      "QA",
      "KW",
      "LB",
      "JO",
      "MA",
      "DZ",
      "TN",
      "LY",
      "SY",
      "IQ",
      "YE",
      "OM",
      "BH",
      "PS",
      "SD",
      "MR",
      "SO",
      "DJ",
      "KM",
    ];
  function at(e) {
    return -1 !== st.indexOf(e.country);
  }
  function lt(e, t) {
    return (e.categories || []).some((e) => String(e).toLowerCase() === t);
  }
  var ot = new RegExp(
      "\\b(hbo|cinemax|starz|showtime|mgm|paramount|sony movies|film ?4|tcm|turner classic|amc|syfy|fx movie|movies ?24|great movies|talking pictures|sky cinema|canal\\+ cine|cine ?canal|studio universal|space|golden|rotana cinema|mbc ?2|mbc ?max|mbc ?action|art aflam|art cinema|zee cinema|star gold|sony max|dizi|fox movies|bein movies|osn movies)\\b",
      "i",
    ),
    ut = [
      /\b(sky ?sports?|tnt sports?|bt sport)\b/i,
      /\b(movistar|dazn|gol tv|golt|laliga|real madrid tv|barca tv)\b/i,
      /\b(canal ?\+|rmc sport|l'?equipe|bein)\b/i,
      /\b(sky ?sport|dazn italia|rai sport|milan tv|inter tv|juventus)\b/i,
      /\b(sport1|sportdigital|magenta)\b/i,
      /\b(ziggo sport|espn nl|viaplay|nova sport|arena sport|sport tv)\b/i,
      /\b(match ?tv|setanta|футбол)\b/i,
      /\b(espn|fox sports?|cbs sports?|nbc sports?|tudn|tyc)\b/i,
      /\b(ssc|alkass|dubai sports?|abu dhabi sports?|ontime|al ?kass)\b/i,
    ],
    ct =
      /(qur'?an|quran|coran|قرآن|القرآن|tarateel|ترتيل|tilawa|تلاوة|tafsir|تفسير|makkah|مكة|madinah|المدينة|al ?haramain|الحرمين|saudi sunnah|السنة النبوية|iqraa|اقرأ|huda ?tv|peace ?tv|islam ?channel|بينونة|النور)/i,
    dt = [
      /(iqraa|اقرأ)/i,
      /\b(makkah|مكة|saudi qur'?an|القرآن الكريم)\b/i,
      /\b(madinah|المدينة|saudi sunnah|السنة)\b/i,
      /(tafsir|تفسير)/i,
      /\b(huda|peace ?tv|islam ?channel)\b/i,
    ],
    mt = [
      /\b(mbc ?masr|mbc ?مصر|إم بي سي مصر)\b/i,
      /\b(dmc)\b/i,
      /\b(cbc)\b/i,
      /\b(on ?e|on ?tv|قناة ?on|أون)\b/i,
      /(النهار|al ?nahar)/i,
      /(الحياة|al ?hayah|al ?hayat)/i,
      /(صدى البلد|sada ?el ?balad)/i,
      /\b(ten|تن)\b/i,
      /(القاهرة والناس|al ?kahera)/i,
      /(ontime|أون تايم)/i,
      /(المحور|mehwar)/i,
      /(روتانا مصرية|rotana masr)/i,
      /(extra ?news|إكسترا)/i,
      /(nile|النيل|المصرية)/i,
    ],
    ht = new RegExp("(مصر|masr|misr|egypt|" + mt.map((e) => e.source).join("|") + ")", "i");
  function ft(e, t) {
    for (let n = 0; n < t.length; n++) if (t[n].test(e)) return n;
    return t.length;
  }
  function pt(e) {
    let t = /(\d+)\s*$/.exec(String(e || "").trim());
    return t ? Number(t[1]) : 0;
  }
  var gt = [
      {
        id: "featured:sports",
        name: "⭐  Sports Channels",
        match: (e) => lt(e, "sports"),
        rank: (e) => ft(e.name, ut),
      },
      {
        id: "featured:best-movies",
        name: "⭐  Best Movie Channels",
        match: (e) => ot.test(e.name) || lt(e, "movies"),
        rank: (e) => (ot.test(e.name) ? 0 : 1),
      },
      {
        id: "featured:quran",
        name: "⭐  قرآن",
        match: (e) => ct.test(e.name),
        rank: (e) => ft(e.name, dt),
        autoPlayFirst: !0,
      },
      {
        id: "featured:egypt",
        name: "⭐  مصر",
        match: (e) => "EG" === e.country || ht.test(e.name),
        rank: (e) => ft(e.name, mt),
      },
      {
        id: "featured:arab-sports",
        name: "⭐  Arab Sports",
        match: (e) => at(e) && lt(e, "sports"),
        rank: (e) => ft(e.name, ut),
      },
      { id: "featured:arab-news", name: "⭐  Arab News", match: (e) => at(e) && lt(e, "news") },
      {
        id: "featured:arab-entertainment",
        name: "⭐  Arab Entertainment",
        match: (e) => at(e) && (lt(e, "entertainment") || lt(e, "series") || lt(e, "movies")),
      },
      {
        id: "featured:world-news",
        name: "⭐  World News",
        match: (e) =>
          /\b(bbc|cnn|sky news|euronews|france 24|dw|al jazeera|aljazeera|rt|trt)\b/i.test(e.name),
      },
      { id: "featured:kids", name: "⭐  Kids", match: (e) => lt(e, "kids") || lt(e, "animation") },
      { id: "featured:documentary", name: "⭐  Documentary", match: (e) => lt(e, "documentary") },
      { id: "featured:music", name: "⭐  Music", match: (e) => lt(e, "music") },
    ],
    vt = null,
    yt = null,
    bt = !0,
    wt = "adult:x";
  function xt(e) {
    let t = String(e || "").toLowerCase();
    return /2160|4k/.test(t)
      ? 0
      : /1080/.test(t)
        ? 1
        : /720/.test(t)
          ? 2
          : /576|480/.test(t)
            ? 3
            : /360|240/.test(t)
              ? 4
              : 2;
  }
  function kt(e) {
    let t = (e.categories || []).map((e) => String(e).toLowerCase());
    for (let e of nt) if (-1 !== t.indexOf(e)) return !0;
    if (!0 === e.is_nsfw) return !0;
    let n = ((e.name || "") + " " + (e.id || "")).toLowerCase();
    for (let e of it) if (-1 !== n.indexOf(e)) return !0;
    return !1;
  }
  function Ct(e) {
    return n(this, null, function* () {
      let t = yield fetch("https://iptv-org.github.io/api/" + e + ".json");
      if (!t.ok) throw new Error("free playlist: " + e + " HTTP " + t.status);
      return t.json();
    });
  }
  function St() {
    return vt
      ? Promise.resolve(vt)
      : yt ||
          (yt = n(null, null, function* () {
            let [e, t, n] = yield Promise.all([Ct("channels"), Ct("streams"), Ct("countries")]),
              i = Object.create(null);
            for (let t of e) i[t.id] = t;
            let r = Object.create(null);
            for (let e of n) r[e.code] = e.name;
            let s = Object.create(null),
              a = Object.create(null),
              l = Object.create(null),
              o = [],
              u = 0,
              c = 0,
              d = new Map();
            for (let e of t)
              !e.url ||
                !e.channel ||
                (d.has(e.channel) || d.set(e.channel, []), d.get(e.channel).push(e));
            for (let [e, t] of d) {
              let n = i[e];
              if (!n) continue;
              let r = t
                  .map((t, i) => ({
                    id: "free:" + e + ":" + i,
                    url: t.url,
                    quality: t.quality || null,
                    rank: xt(t.quality),
                    name: n.name || e,
                  }))
                  .sort((e, t) => e.rank - t.rank),
                d = {
                  kind: "live",
                  id: "free:" + e,
                  name: n.name || e,
                  logo: n.logo || null,
                  url: r[0].url,
                  sources: r,
                  categoryId: null,
                  number: null,
                };
              if (kt(n)) {
                (u++, bt && o.push(d));
                continue;
              }
              c++;
              let m = (n.categories || []).map((e) => String(e).toLowerCase());
              for (let e of m.length ? m : ["general"]) (s[e] || (s[e] = []), s[e].push(d));
              let h = n.country || "ZZ";
              (a[h] || (a[h] = []), a[h].push(d));
              for (let e of gt) {
                let t = !1;
                try {
                  t = e.match(n);
                } catch (e) {
                  t = !1;
                }
                t &&
                  (l[e.id] || (l[e.id] = []),
                  l[e.id].push(e.rank ? Object.assign({}, d, { __rank: e.rank(n) }) : d));
              }
            }
            let m = [],
              h = Object.create(null);
            for (let e of gt) {
              let t = l[e.id];
              !t ||
                !t.length ||
                (e.rank &&
                  t.sort(
                    (e, t) =>
                      e.__rank - t.__rank ||
                      pt(e.name) - pt(t.name) ||
                      e.name.localeCompare(t.name),
                  ),
                m.push({
                  id: e.id,
                  name: e.name + "  (" + t.length + ")",
                  kind: "live",
                  autoPlayFirst: !!e.autoPlayFirst,
                }),
                (h[e.id] = t));
            }
            let f = Object.keys(a).sort((e, t) => a[t].length - a[e].length);
            for (let e of f) {
              let t = "country:" + e;
              (m.push({ id: t, name: (r[e] || e) + "  (" + a[e].length + ")", kind: "live" }),
                (h[t] = a[e]));
            }
            for (let e of rt) {
              if (!s[e] || !s[e].length) continue;
              let t = "genre:" + e;
              (m.push({
                id: t,
                name: e.charAt(0).toUpperCase() + e.slice(1) + "  (" + s[e].length + ")",
                kind: "live",
              }),
                (h[t] = s[e]));
            }
            return (
              bt &&
                o.length &&
                (m.push({ id: wt, name: "🔒  X  (" + o.length + ")", kind: "live", locked: !0 }),
                (h[wt] = o)),
              (yt = null),
              (vt = { categories: m, items: h, kept: c, dropped: u })
            );
          }));
  }
  function _t() {
    return n(this, null, function* () {
      return (yield St()).categories;
    });
  }
  function Tt(e) {
    return n(this, null, function* () {
      return (yield St()).items[e] || [];
    });
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
  function Mt(e, t, n) {
    return n && n.url ? n.url : "";
  }
  function Ft() {
    return "";
  }
  function qt() {
    return "";
  }
  function Dt() {
    return n(this, null, function* () {
      let e = yield St();
      if (!e.kept) throw new Error("Could not load the free playlist");
      return {
        status: "Active",
        expiresAt: null,
        maxConnections: 0,
        activeConnections: 0,
        allowedFormats: ["m3u8"],
        trial: !1,
        channelCount: e.kept,
      };
    });
  }
  function jt() {
    return vt ? { kept: vt.kept, dropped: vt.dropped } : null;
  }
  var Ut = { xtream: j, m3u: Oe, free: tt };
  function Rt() {
    return Ut[V()] || j;
  }
  function Kt() {
    let e = V();
    return {
      type: e,
      hasVod: "xtream" === e,
      hasSeries: "xtream" === e,
      singleConnection: "xtream" === e,
    };
  }
  function zt() {
    return Rt().liveCategories();
  }
  function Bt(e) {
    return Rt().liveStreams(e);
  }
  function Vt() {
    return Rt().vodCategories();
  }
  function Wt(e) {
    return Rt().vodStreams(e);
  }
  function Jt() {
    return Rt().seriesCategories();
  }
  function Ht(e) {
    return Rt().seriesList(e);
  }
  function Xt(e) {
    return Rt().movieInfo(e);
  }
  function Gt(e, t, n) {
    return Rt().liveUrl(e, t, n);
  }
  function Zt(e, t) {
    return Rt().movieUrl(e, t);
  }
  var $t = "iptv:language",
    Qt = [
      { code: "en", label: "English" },
      { code: "ar", label: "العربية", rtl: !0 },
      { code: "es", label: "Español" },
      { code: "fr", label: "Français" },
      { code: "tr", label: "Türkçe" },
      { code: "de", label: "Deutsch" },
    ],
    Yt = {
      en: {
        "nav.continue": "Continue Watching",
        "nav.favorites": "Favourites",
        "nav.search": "Search",
        "nav.home": "Home",
        "nav.live": "Live TV",
        "nav.movies": "Movies",
        "nav.series": "Series",
        "nav.settings": "Settings",
        "nav.freetv": "Free TV",
        "welcome.question": "How would you like to watch?",
        "welcome.xtream": "Xtream account",
        "welcome.xtreamDetail":
          "A portal URL with a username and password. Live TV, films and series.",
        "welcome.m3u": "M3U playlist",
        "welcome.m3uDetail": "A playlist URL from your provider. Live channels.",
        "welcome.free": "Watch our free playlist",
        "welcome.freeDetail":
          "Thousands of public channels from around the world. Nothing to enter.",
        "welcome.serverUrl": "Server URL",
        "welcome.username": "Username",
        "welcome.password": "Password",
        "welcome.playlistUrl": "Playlist URL",
        "welcome.signIn": "Sign in",
        "welcome.back": "Back",
        "welcome.connecting": "Connecting…",
        "welcome.loadingChannels": "Loading channels…",
        "welcome.fillAll": "Fill in all three fields.",
        "welcome.wrongLogin": "Wrong username or password.",
        "welcome.enterPlaylist": "Enter your playlist URL.",
        "home.spotlight": "Recommended",
        "home.play": "Play",
        "home.moreInfo": "More info",
        "home.continue": "Continue Watching",
        "home.favorites": "My Favourites",
        "browse.categories": "Categories",
        "browse.search": "Search",
        "browse.preview": "Preview",
        "browse.pressOkPreview": "Press OK to preview",
        "browse.pressOkFull": "Press OK again for full screen",
        "browse.noResponse": "This channel did not respond",
        "browse.freeChannels": "Free channels",
        "search.placeholder": "Search channels, movies and series",
        "search.minChars": "Type at least two characters.",
        "search.preparing": "Preparing…",
        "search.nothing": "Nothing found",
        "search.channels": "Channels",
        "search.movies": "Movies",
        "search.series": "Series",
        "player.skipIntro": "Skip intro",
        "player.nextEpisode": "Next episode",
        "player.quality": "Quality",
        "player.upNext": "Up next",
        "player.playNext": "Play next episode",
        "player.unavailable": "This channel is not available right now.",
        "player.fit": "Fit",
        "player.fill": "Fill screen",
        "player.stretch": "Stretch",
        "details.play": "Play",
        "details.resume": "Resume",
        "details.favorite": "Favourite",
        "details.season": "Season",
        "details.couldNotLoad": "Could not load details.",
        "details.offline":
          "No internet — your provider is redirecting the connection. Trying again…",
        "favorites.empty":
          "Nothing saved yet. Press the yellow button on any channel or title to add it.",
        "favorites.added": "Added to favourites",
        "favorites.removed": "Removed from favourites",
        "continue.empty": "Nothing in progress. Anything you start will show up here.",
        "continue.hint": "Press the yellow button to remove something from this list.",
        "continue.removed": "Removed from Continue Watching",
        "continue.minLeft": "min left",
        "settings.title": "Settings",
        "settings.language": "Language",
        "settings.languageDetail": "The language the app itself is shown in.",
        "settings.on": "On",
        "settings.off": "Off",
        "lock.locked": "Locked",
        "lock.enterPin": "Enter PIN",
        "lock.wrongPin": "Wrong PIN",
      },
      ar: {
        "nav.continue": "متابعة المشاهدة",
        "nav.favorites": "المفضلة",
        "nav.search": "بحث",
        "nav.home": "الرئيسية",
        "nav.live": "البث المباشر",
        "nav.movies": "أفلام",
        "nav.series": "مسلسلات",
        "nav.settings": "الإعدادات",
        "nav.freetv": "قنوات مجانية",
        "welcome.question": "إزاي تحب تتفرج؟",
        "welcome.xtream": "حساب Xtream",
        "welcome.xtreamDetail": "رابط السيرفر مع اسم المستخدم وكلمة السر. قنوات وأفلام ومسلسلات.",
        "welcome.m3u": "قائمة M3U",
        "welcome.m3uDetail": "رابط قائمة تشغيل من مزوّدك. قنوات مباشرة.",
        "welcome.free": "شاهد قائمتنا المجانية",
        "welcome.freeDetail": "آلاف القنوات العامة من كل العالم. من غير ما تدخل أي حاجة.",
        "welcome.serverUrl": "رابط السيرفر",
        "welcome.username": "اسم المستخدم",
        "welcome.password": "كلمة السر",
        "welcome.playlistUrl": "رابط القائمة",
        "welcome.signIn": "تسجيل الدخول",
        "welcome.back": "رجوع",
        "welcome.connecting": "جاري الاتصال…",
        "welcome.loadingChannels": "جاري تحميل القنوات…",
        "welcome.fillAll": "املأ الحقول الثلاثة.",
        "welcome.wrongLogin": "اسم المستخدم أو كلمة السر غير صحيحة.",
        "welcome.enterPlaylist": "أدخل رابط القائمة.",
        "home.spotlight": "مُقترح لك",
        "home.play": "تشغيل",
        "home.moreInfo": "تفاصيل",
        "home.continue": "متابعة المشاهدة",
        "home.favorites": "المفضلة",
        "browse.categories": "التصنيفات",
        "browse.search": "بحث",
        "browse.preview": "معاينة",
        "browse.pressOkPreview": "اضغط OK للمعاينة",
        "browse.pressOkFull": "اضغط OK مرة تانية لملء الشاشة",
        "browse.noResponse": "القناة دي مش مستجيبة",
        "browse.freeChannels": "قنوات مجانية",
        "search.placeholder": "ابحث في القنوات والأفلام والمسلسلات",
        "search.minChars": "اكتب حرفين على الأقل.",
        "search.preparing": "جاري التحضير…",
        "search.nothing": "مفيش نتائج",
        "search.channels": "قنوات",
        "search.movies": "أفلام",
        "search.series": "مسلسلات",
        "player.skipIntro": "تخطي المقدمة",
        "player.nextEpisode": "الحلقة التالية",
        "player.quality": "الجودة",
        "player.upNext": "التالي",
        "player.playNext": "شغّل الحلقة التالية",
        "player.unavailable": "القناة دي مش متاحة دلوقتي.",
        "player.fit": "ملائم",
        "player.fill": "ملء الشاشة",
        "player.stretch": "تمديد",
        "details.play": "تشغيل",
        "details.resume": "متابعة",
        "details.favorite": "المفضلة",
        "details.season": "الموسم",
        "details.couldNotLoad": "تعذّر تحميل التفاصيل.",
        "details.offline": "مفيش إنترنت — مزوّد الخدمة بيحوّل الاتصال. بنحاول تاني…",
        "favorites.empty": "مفيش حاجة محفوظة. اضغط الزر الأصفر على أي قناة أو عمل لإضافته.",
        "favorites.added": "تمت الإضافة للمفضلة",
        "favorites.removed": "تم الحذف من المفضلة",
        "continue.empty": "مفيش حاجة قيد المشاهدة. أي حاجة تبدأها هتظهر هنا.",
        "continue.hint": "اضغط الزر الأصفر لحذف أي حاجة من القائمة دي.",
        "continue.removed": "تم الحذف من متابعة المشاهدة",
        "continue.minLeft": "دقيقة متبقية",
        "settings.title": "الإعدادات",
        "settings.language": "اللغة",
        "settings.languageDetail": "اللغة اللي بيظهر بيها الأب نفسه.",
        "settings.on": "مفعّل",
        "settings.off": "متوقف",
        "lock.locked": "مقفول",
        "lock.enterPin": "أدخل الرقم السري",
        "lock.wrongPin": "رقم غير صحيح",
      },
      es: {
        "nav.continue": "Seguir viendo",
        "nav.favorites": "Favoritos",
        "nav.search": "Buscar",
        "nav.home": "Inicio",
        "nav.live": "TV en vivo",
        "nav.movies": "Películas",
        "nav.series": "Series",
        "nav.settings": "Ajustes",
        "nav.freetv": "TV gratis",
        "welcome.question": "¿Cómo quieres ver?",
        "welcome.xtream": "Cuenta Xtream",
        "welcome.xtreamDetail":
          "Una URL de portal con usuario y contraseña. TV, películas y series.",
        "welcome.m3u": "Lista M3U",
        "welcome.m3uDetail": "Una URL de lista de tu proveedor. Canales en vivo.",
        "welcome.free": "Ver nuestra lista gratuita",
        "welcome.freeDetail": "Miles de canales públicos de todo el mundo. Sin registrarte.",
        "welcome.signIn": "Entrar",
        "welcome.back": "Atrás",
        "home.spotlight": "Recomendado",
        "home.play": "Reproducir",
        "home.moreInfo": "Más información",
        "home.continue": "Seguir viendo",
        "home.favorites": "Mis favoritos",
        "browse.categories": "Categorías",
        "browse.search": "Buscar",
        "browse.preview": "Vista previa",
        "browse.pressOkPreview": "Pulsa OK para la vista previa",
        "browse.pressOkFull": "Pulsa OK otra vez para pantalla completa",
        "search.placeholder": "Busca canales, películas y series",
        "search.minChars": "Escribe al menos dos letras.",
        "player.skipIntro": "Saltar intro",
        "player.nextEpisode": "Siguiente episodio",
        "player.quality": "Calidad",
        "player.upNext": "A continuación",
        "player.fit": "Ajustar",
        "player.fill": "Llenar pantalla",
        "player.stretch": "Estirar",
        "details.play": "Reproducir",
        "details.resume": "Continuar",
        "details.favorite": "Favorito",
        "details.season": "Temporada",
        "settings.title": "Ajustes",
        "settings.language": "Idioma",
        "settings.on": "Sí",
        "settings.off": "No",
        "lock.enterPin": "Introduce el PIN",
      },
      fr: {
        "nav.continue": "Reprendre",
        "nav.favorites": "Favoris",
        "nav.search": "Rechercher",
        "nav.home": "Accueil",
        "nav.live": "TV en direct",
        "nav.movies": "Films",
        "nav.series": "Séries",
        "nav.settings": "Paramètres",
        "nav.freetv": "TV gratuite",
        "welcome.question": "Comment voulez-vous regarder ?",
        "welcome.xtream": "Compte Xtream",
        "welcome.xtreamDetail":
          "Une URL de portail avec identifiant et mot de passe. TV, films et séries.",
        "welcome.m3u": "Playlist M3U",
        "welcome.m3uDetail": "Une URL de playlist de votre fournisseur. Chaînes en direct.",
        "welcome.free": "Voir notre playlist gratuite",
        "welcome.freeDetail": "Des milliers de chaînes publiques du monde entier. Rien à saisir.",
        "welcome.signIn": "Se connecter",
        "welcome.back": "Retour",
        "home.spotlight": "Recommandé",
        "home.play": "Lecture",
        "home.moreInfo": "Plus d’infos",
        "home.continue": "Reprendre",
        "home.favorites": "Mes favoris",
        "browse.categories": "Catégories",
        "browse.search": "Rechercher",
        "browse.preview": "Aperçu",
        "browse.pressOkPreview": "Appuyez sur OK pour l’aperçu",
        "browse.pressOkFull": "Appuyez de nouveau pour le plein écran",
        "search.placeholder": "Rechercher chaînes, films et séries",
        "search.minChars": "Saisissez au moins deux lettres.",
        "player.skipIntro": "Passer l’intro",
        "player.nextEpisode": "Épisode suivant",
        "player.quality": "Qualité",
        "player.upNext": "À suivre",
        "player.fit": "Ajuster",
        "player.fill": "Plein écran",
        "player.stretch": "Étirer",
        "details.play": "Lecture",
        "details.resume": "Reprendre",
        "details.favorite": "Favori",
        "details.season": "Saison",
        "settings.title": "Paramètres",
        "settings.language": "Langue",
        "settings.on": "Activé",
        "settings.off": "Désactivé",
        "lock.enterPin": "Saisissez le code",
      },
      tr: {
        "nav.continue": "İzlemeye devam et",
        "nav.favorites": "Favoriler",
        "nav.search": "Ara",
        "nav.home": "Ana sayfa",
        "nav.live": "Canlı TV",
        "nav.movies": "Filmler",
        "nav.series": "Diziler",
        "nav.settings": "Ayarlar",
        "nav.freetv": "Ücretsiz TV",
        "welcome.question": "Nasıl izlemek istersiniz?",
        "welcome.xtream": "Xtream hesabı",
        "welcome.m3u": "M3U listesi",
        "welcome.free": "Ücretsiz listemizi izleyin",
        "welcome.signIn": "Giriş yap",
        "welcome.back": "Geri",
        "home.spotlight": "Önerilen",
        "home.play": "Oynat",
        "home.moreInfo": "Daha fazla bilgi",
        "browse.categories": "Kategoriler",
        "browse.search": "Ara",
        "browse.preview": "Önizleme",
        "search.minChars": "En az iki harf yazın.",
        "player.skipIntro": "Jeneriği geç",
        "player.nextEpisode": "Sonraki bölüm",
        "player.quality": "Kalite",
        "player.upNext": "Sırada",
        "details.play": "Oynat",
        "details.season": "Sezon",
        "settings.title": "Ayarlar",
        "settings.language": "Dil",
        "settings.on": "Açık",
        "settings.off": "Kapalı",
      },
      de: {
        "nav.continue": "Weiterschauen",
        "nav.favorites": "Favoriten",
        "nav.search": "Suche",
        "nav.home": "Start",
        "nav.live": "Live-TV",
        "nav.movies": "Filme",
        "nav.series": "Serien",
        "nav.settings": "Einstellungen",
        "nav.freetv": "Gratis-TV",
        "welcome.question": "Wie möchten Sie schauen?",
        "welcome.xtream": "Xtream-Konto",
        "welcome.m3u": "M3U-Playlist",
        "welcome.free": "Unsere kostenlose Playlist",
        "welcome.signIn": "Anmelden",
        "welcome.back": "Zurück",
        "home.spotlight": "Empfohlen",
        "home.play": "Abspielen",
        "home.moreInfo": "Mehr Infos",
        "browse.categories": "Kategorien",
        "browse.search": "Suche",
        "browse.preview": "Vorschau",
        "search.minChars": "Mindestens zwei Zeichen eingeben.",
        "player.skipIntro": "Intro überspringen",
        "player.nextEpisode": "Nächste Folge",
        "player.quality": "Qualität",
        "player.upNext": "Als Nächstes",
        "details.play": "Abspielen",
        "details.season": "Staffel",
        "settings.title": "Einstellungen",
        "settings.language": "Sprache",
        "settings.on": "An",
        "settings.off": "Aus",
      },
    },
    en = null;
  function tn() {
    let e = "";
    try {
      e = (navigator.language || "").toLowerCase();
    } catch (e) {}
    for (let t of Qt) if (0 === e.indexOf(t.code)) return t.code;
    return "en";
  }
  function nn() {
    if (en) return en;
    try {
      en = localStorage.getItem($t) || tn();
    } catch (e) {
      en = tn();
    }
    return en;
  }
  function rn() {
    (document.documentElement.setAttribute(
      "dir",
      (function () {
        let e = Qt.filter((e) => e.code === nn())[0];
        return !(!e || !e.rtl);
      })()
        ? "rtl"
        : "ltr",
    ),
      document.documentElement.setAttribute("lang", nn()));
  }
  function sn(e) {
    return (Yt[nn()] || Yt.en)[e] || Yt.en[e] || e;
  }
  var an = "http://www.w3.org/2000/svg",
    ln = 0;
  function on(e) {
    let t = "brand-grad-" + ++ln,
      n = document.createElementNS(an, "svg");
    (n.setAttribute("viewBox", "0 0 100 100"),
      n.setAttribute("width", String(e || 44)),
      n.setAttribute("height", String(e || 44)),
      n.setAttribute("class", "logo-mark"),
      n.setAttribute("aria-hidden", "true"));
    let i = document.createElementNS(an, "defs"),
      r = document.createElementNS(an, "linearGradient");
    (r.setAttribute("id", t),
      r.setAttribute("x1", "0"),
      r.setAttribute("y1", "0"),
      r.setAttribute("x2", "0"),
      r.setAttribute("y2", "1"));
    let s = document.createElementNS(an, "stop");
    (s.setAttribute("offset", "0"), s.setAttribute("stop-color", "#ff4d4d"));
    let a = document.createElementNS(an, "stop");
    (a.setAttribute("offset", "1"),
      a.setAttribute("stop-color", "#c40810"),
      r.appendChild(s),
      r.appendChild(a),
      i.appendChild(r),
      n.appendChild(i));
    let l = document.createElementNS(an, "path");
    (l.setAttribute("d", "M50 6 L94 90 L70 90 L50 52 L30 90 L6 90 Z"),
      l.setAttribute("fill", "url(#" + t + ")"),
      n.appendChild(l));
    let o = document.createElementNS(an, "path");
    return (
      o.setAttribute("d", "M42 62 L66 77 L42 92 Z"),
      o.setAttribute("fill", "#ffffff"),
      n.appendChild(o),
      n
    );
  }
  function un(e) {
    let t = document.createElement("span");
    ((t.className = "logo-lockup"), t.appendChild(on(e || 44)));
    let n = document.createElement("span");
    n.className = "logo-word";
    let i = document.createElement("span");
    ((i.className = "logo-word-owner"), (i.textContent = "ARAFA’S"));
    let r = document.createElement("span");
    return (
      (r.className = "logo-word-kind"),
      (r.textContent = "IPTV"),
      n.appendChild(i),
      n.appendChild(r),
      t.appendChild(n),
      t
    );
  }
  var cn = [
    { id: "continue", icon: "▶", key: "nav.continue" },
    { id: "favorites", icon: "★", key: "nav.favorites" },
    { id: "search", icon: "⌕", key: "nav.search" },
    { id: "home", icon: "⌂", key: "nav.home" },
    { id: "live", icon: "▤", key: "nav.live", needs: "live" },
    { id: "movies", icon: "🎬", key: "nav.movies", needs: "vod" },
    { id: "series", icon: "📺", key: "nav.series", needs: "series" },
    { id: "settings", icon: "⚙", key: "nav.settings" },
    { id: "freetv", icon: "🌐", key: "nav.freetv", personalOnly: !0 },
  ];
  function dn() {
    let e = i("nav", {
        class: "rail",
        "data-focus-memory": "rail",
        "data-focus-contain": "vertical",
      }),
      t = i("div", { class: "rail-brand" }),
      n = i("span", { class: "rail-brand-mark" });
    n.appendChild(on(44));
    let r = i("span", { class: "rail-brand-full" });
    (r.appendChild(un(44)), t.appendChild(n), t.appendChild(r), e.appendChild(t));
    let s = {};
    for (let t of cn) {
      (t.personalOnly, 0);
      let n = i(
        "div",
        {
          class: "rail-item focusable" + ("freetv" === t.id ? " rail-item-last" : ""),
          "data-route": t.id,
        },
        [
          i("span", { class: "rail-icon", text: t.icon }),
          i("span", { class: "rail-label", text: sn(t.key) }),
        ],
      );
      ((n.__needs = t.needs || null), (s[t.id] = n), e.appendChild(n));
    }
    function a() {
      let e = Kt();
      for (let t of Object.keys(s)) {
        let n = s[t].__needs,
          i = "vod" === n ? e.hasVod : "series" !== n || e.hasSeries;
        s[t].hidden = !i;
      }
    }
    let l = null;
    return (
      document.addEventListener(
        "keydown",
        function (t) {
          if (39 !== t.keyCode) return;
          var r = e.querySelector(".rail-item.focused");
          if (!r) return;
          (t.stopPropagation(), t.preventDefault());
          var o = r.getAttribute("data-route");
          o !== I() && A(o, {});
          var k = 0;
          !(function f() {
            var a = document.querySelectorAll(".focusable");
            for (var q = 0; q < a.length; q++)
              if (!e.contains(a[q]) && null !== a[q].offsetParent)
                return (e.classList.remove("expanded"), void v(a[q]));
            k++ < 15 && setTimeout(f, 110);
          })();
        },
        !0,
      ),
      e.addEventListener("focus-enter", (t) => {
        e.classList.toggle("expanded", e.contains(t.target));
      }),
      e.addEventListener("focus-activate", (e) => {
        let t = e.target.closest(".rail-item");
        if (!t) return;
        l && (clearTimeout(l), (l = null));
        let n = t.getAttribute("data-route");
        n !== I() && A(n, {});
      }),
      document.addEventListener("focus-moved", (t) => {
        e.contains(t.detail.node) || e.classList.remove("expanded");
      }),
      a(),
      {
        node: e,
        syncCapabilities: a,
        setCurrent(e) {
          for (let t of Object.keys(s)) s[t].classList.toggle("current", t === e);
        },
        button: (e) => s[e],
        collapse() {
          e.classList.remove("expanded");
        },
      }
    );
  }
  var mn = [
    { rank: 0, tag: "4K", re: /(^|[\s\[\(_-])(4k|uhd|2160p?)([\s\]\)_-]|$)/i },
    { rank: 1, tag: "FHD", re: /(^|[\s\[\(_-])(fhd|1080p?)([\s\]\)_-]|$)/i },
    { rank: 2, tag: "HD", re: /(^|[\s\[\(_-])(hd|720p?)([\s\]\)_-]|$)/i },
    { rank: 3, tag: "SD", re: /(^|[\s\[\(_-])(sd|480p?|420p?|low)([\s\]\)_-]|$)/i },
  ];
  function hn(e) {
    for (let t of mn) if (t.re.test(e)) return t;
    return null;
  }
  function fn(e) {
    let t = String(e || "");
    return (
      (t = t.replace(/\[[^\]]*\]/g, " ")),
      (t = t.replace(/\([^)]*\)/g, " ")),
      (t = t.replace(
        /(^|[\s_-])(4k|uhd|2160p?|fhd|1080p?|hd|720p?|sd|480p?|420p?|low|h\s?265|h\s?264|hevc|raw|backup|multi|vip)([\s_-]|$)/gi,
        " ",
      )),
      (t = t.replace(/[|:_\-–—]+/g, " ")),
      (t = t.replace(/\s+/g, " ").trim()),
      (t = t.replace(/\s+[A-Za-z]$/, "")),
      t.toLowerCase().trim()
    );
  }
  var pn = null,
    gn = null;
  function vn(e) {
    let t = {
      id: e.id,
      name: e.name,
      logo: e.logo,
      categoryId: e.categoryId,
      quality: (hn(e.name) || {}).tag || null,
      rank: null != (hn(e.name) || {}).rank ? hn(e.name).rank : 2,
    };
    if (!pn) return [t];
    let n = pn[fn(e.name)];
    if (!n || n.length <= 1) return [t];
    let i = n.filter((t) => t.id !== e.id);
    return [t].concat(i);
  }
  var yn = 37,
    bn = 38,
    wn = 39,
    xn = 40,
    kn = 13,
    Cn = 461,
    Sn = 8,
    _n = 27,
    Tn = 404,
    Ln = 405,
    In = 406,
    Nn = 415,
    An = 19,
    En = 179,
    On = 413,
    Pn = 412,
    Mn = 417,
    Fn = 33,
    qn = 34,
    Dn = { [yn]: "left", [bn]: "up", [wn]: "right", [xn]: "down" };
  function jn(e) {
    return e === Cn || e === Sn || e === _n;
  }
  function Un(e) {
    return e === kn;
  }
  var Rn = "0123456789".split(""),
    Kn = "abcdefghijklmnopqrstuvwxyz".split(""),
    zn = {
      ar: {
        label: "العربية",
        columns: 10,
        keys: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي ء أ إ آ ة ى ئ ؤ".split(" "),
      },
      en: { label: "English", columns: 10, keys: Kn },
      es: { label: "Español", columns: 10, keys: Kn.concat("ñ á é í ó ú ü".split(" ")) },
      fr: { label: "Français", columns: 10, keys: Kn.concat("à â ç é è ê ë î ï ô ù û".split(" ")) },
    },
    Bn = {
      tr: { label: "Türkçe", columns: 10, keys: Kn.concat("ç ğ ı ö ş ü".split(" ")) },
      de: { label: "Deutsch", columns: 10, keys: Kn.concat("ä ö ü ß".split(" ")) },
      ru: {
        label: "Русский",
        columns: 11,
        keys: "а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я".split(" "),
      },
      pt: {
        label: "Português",
        columns: 10,
        keys: Kn.concat("ã á â à ç é ê í ó ô õ ú".split(" ")),
      },
      it: { label: "Italiano", columns: 10, keys: Kn.concat("à è é ì ò ù".split(" ")) },
      hi: {
        label: "हिन्दी",
        columns: 11,
        keys: "अ आ इ ई उ ऊ ए ऐ ओ औ क ख ग घ च छ ज झ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह".split(
          " ",
        ),
      },
    },
    Vn = Object.assign({}, zn, Bn),
    Wn = [".", "-", "_", ":", "/", "@"];
  function Jn(e) {
    let t = e || {},
      n = t.onChange || function () {},
      s = t.onSubmit || null,
      a = t.language || "ar",
      l = !1,
      o = null,
      u = i("div", { class: "kb-suggestions", hidden: "hidden" }),
      c = i("div", { class: "kb-languages" }),
      d = i("div", { class: "kb-keys" }),
      m = i("div", { class: "kb-actions" }),
      h = i("div", { class: "keyboard", "data-focus-memory": "keyboard" }, [u, c, d, m]),
      f = t.suggest || null;
    function p() {
      if (!f) return;
      let e = o ? o.value : "",
        t = [];
      try {
        t = f(e) || [];
      } catch (e) {
        t = [];
      }
      if ((r(u), t.length)) {
        for (let e of t.slice(0, 6)) {
          let t = "string" == typeof e ? e : e.text,
            n = i("div", {
              class: "kb-suggestion focusable",
              dir: "auto",
              text: "string" == typeof e ? e : e.label || e.text,
            });
          ((n.__press = () => {
            o && ((o.value = t), w());
          }),
            u.appendChild(n));
        }
        u.hidden = !1;
      } else u.hidden = !0;
    }
    function g(e) {
      o && ((o.value = o.value + e), w());
    }
    function y() {
      !o || !o.value || ((o.value = o.value.slice(0, -1)), w());
    }
    function b() {
      o && ((o.value = ""), w());
    }
    function w() {
      (o && o.dispatchEvent(new Event("input", { bubbles: !0 })), p(), n(o ? o.value : ""));
    }
    function x(e, t, n, r) {
      let s = i("div", {
        class: "kb-key focusable" + (t ? " " + t : "") + (r ? " kb-key-wide" : ""),
        text: e,
      });
      return ((s.__press = n), s);
    }
    function k() {
      r(c);
      let e = Object.keys(l ? Vn : zn);
      for (let t of e) {
        let e = i("div", {
          class: "kb-lang focusable" + (t === a ? " active" : ""),
          text: Vn[t].label,
        });
        ((e.__press = () => {
          ((a = t), k(), C());
        }),
          c.appendChild(e));
      }
      if (!l) {
        let e = i("div", { class: "kb-lang kb-lang-more focusable", text: "More…" });
        ((e.__press = () => {
          ((l = !0), k());
        }),
          c.appendChild(e));
      }
    }
    function C() {
      r(d);
      let e = Vn[a],
        t = e.columns,
        n = "calc((100% - " + 10 * (t - 1) + "px) / " + t + ")";
      e.keys
        .map((e) => x(e, null, () => g(e)))
        .concat(Rn.map((e) => x(e, "kb-key-digit", () => g(e))))
        .concat(Wn.map((e) => x(e, "kb-key-symbol", () => g(e))))
        .forEach((e, i) =>
          (function (e, t) {
            ((e.style.width = n), t && (e.style.marginRight = "0"), d.appendChild(e));
          })(e, (i + 1) % t == 0),
        );
    }
    return (
      h.addEventListener("focus-activate", (e) => {
        let t = e.target.closest(".kb-key, .kb-lang, .kb-suggestion");
        t && t.__press && t.__press();
      }),
      k(),
      C(),
      r(m),
      m.appendChild(x("Space", "kb-key-space", () => g(" "), !0)),
      m.appendChild(x("⌫  Delete", "kb-key-action", y, !0)),
      m.appendChild(x("Clear", "kb-key-action", b, !0)),
      s && m.appendChild(x("⌕  Search", "kb-key-submit", () => s(), !0)),
      {
        node: h,
        setTarget(e) {
          ((function (e) {
            o = e;
          })(e),
            p());
        },
        refreshSuggestions: p,
        setLanguage(e) {
          Vn[e] && ((a = e), k(), C());
        },
        firstKey: () => d.querySelector(".kb-key"),
        focusFirst() {
          v(d.querySelector(".kb-key"));
        },
      }
    );
  }
  var Hn = "iptv:searchHistory";
  function Xn() {
    try {
      let e = JSON.parse(localStorage.getItem(Hn));
      return Array.isArray(e) ? e : [];
    } catch (e) {
      return [];
    }
  }
  function Gn(e) {
    let t = String(e || "").trim();
    if (t.length < 2) return;
    let n = Xn().filter((e) => e !== t);
    (n.unshift(t), n.length > 20 && (n.length = 20));
    try {
      localStorage.setItem(Hn, JSON.stringify(n));
    } catch (e) {}
  }
  function Zn(e, t, n) {
    let i = (function (e) {
      return String(e || "")
        .toLowerCase()
        .replace(/[ً-ْـ]/g, "")
        .replace(/[آأإ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[^\p{L}\p{N} ]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
    })(t);
    if (i.length < 1) return [];
    let r = [],
      s = [],
      a = Object.create(null);
    for (let t of e) {
      if (r.length >= (n || 6)) break;
      let e = t.key.indexOf(i);
      if (-1 === e) continue;
      let l = t.item.name;
      a[l] || ((a[l] = !0), 0 === e ? r.push(l) : s.length < (n || 6) && s.push(l));
    }
    let l = (e, t) => e.length - t.length;
    return r
      .sort(l)
      .concat(s.sort(l))
      .slice(0, n || 6);
  }
  var $n = ["@gmail.com", "@hotmail.com", "@yahoo.com", "@outlook.com", "@icloud.com"];
  var Qn = ["http://", "https://", ".com", ".net", ".tv", ":8080", ":80", ":2052"];
  var Yn = [
    { id: "xtream", icon: "⌂", titleKey: "welcome.xtream", detailKey: "welcome.xtreamDetail" },
    { id: "m3u", icon: "≡", titleKey: "welcome.m3u", detailKey: "welcome.m3uDetail" },
    { id: "free", icon: "★", titleKey: "welcome.free", detailKey: "welcome.freeDetail" },
  ];
  function ei() {
    let e = W() || U,
      t = !1,
      s = null,
      a = i("div", { class: "login-error" }),
      l = i("div", { class: "welcome-options", "data-focus-memory": "welcome" });
    for (let e of Yn) {
      let t = i("div", { class: "welcome-option focusable" }, [
        i("span", { class: "welcome-option-icon", text: e.icon }),
        i("div", { class: "welcome-option-text" }, [
          i("div", { class: "welcome-option-title", text: sn(e.titleKey) }),
          i("div", { class: "welcome-option-detail", text: sn(e.detailKey) }),
        ]),
      ]);
      ((t.__option = e), l.appendChild(t));
    }
    function o(e, t) {
      return i("div", { class: "field" }, [i("label", { class: "field-label", text: e }), t]);
    }
    let u = i("input", {
        class: "field-input focusable",
        type: "text",
        readonly: "readonly",
        value: e.url || "",
        placeholder: "http://server:port",
      }),
      c = i("input", {
        class: "field-input focusable",
        type: "text",
        readonly: "readonly",
        value: e.username || "",
      }),
      d = i("input", {
        class: "field-input focusable",
        type: "password",
        readonly: "readonly",
        value: e.password || "",
      }),
      m = i("input", {
        class: "field-input focusable",
        type: "text",
        readonly: "readonly",
        placeholder: "http://example.com/playlist.m3u",
      }),
      h = i("div", { class: "button primary focusable", text: sn("welcome.signIn") }),
      f = i("div", { class: "button focusable", text: sn("welcome.back") }),
      p = i("div", { class: "welcome-actions" }, [h, f]),
      g = Jn({
        language: "en",
        suggest: (e) =>
          y === c
            ? (function (e) {
                let t = String(e || "").trim();
                return t
                  ? -1 !== t.indexOf("@")
                    ? []
                    : $n.map((e) => ({ text: t + e, label: e }))
                  : [];
              })(e)
            : y === u || y === m
              ? (function (e) {
                  let t = String(e || "");
                  if (!t) return Qn.slice(0, 2).map((e) => ({ text: e, label: e }));
                  let n = [];
                  for (let e of Qn.slice(2))
                    t.slice(-e.length) !== e && n.push({ text: t + e, label: e });
                  return n;
                })(e)
              : [],
      }),
      y = null,
      b = i("div", { class: "welcome-keyboard", hidden: "hidden" }, [g.node]),
      w = i("div", { class: "welcome-form", hidden: "hidden" }, [
        i("h2", { class: "welcome-form-title", text: "Xtream account" }),
        o(sn("welcome.serverUrl"), u),
        o(sn("welcome.username"), c),
        o(sn("welcome.password"), d),
      ]),
      x = i("div", { class: "welcome-form", hidden: "hidden" }, [
        i("h2", { class: "welcome-form-title", text: "M3U playlist" }),
        o(sn("welcome.playlistUrl"), m),
      ]),
      k = i("div", { class: "login-brand" });
    k.appendChild(un(72));
    let C = i("div", { class: "login-panel welcome-panel" }, [
        k,
        i("p", { class: "login-hint", text: sn("welcome.question") }),
        l,
        w,
        x,
        p,
        a,
        b,
      ]),
      S = i("div", { class: "login" }, [C]);
    function _() {
      ((s = null),
        (a.textContent = ""),
        (l.hidden = !1),
        (w.hidden = !0),
        (x.hidden = !0),
        (p.hidden = !0),
        (b.hidden = !0),
        v(l.querySelector(".welcome-option")));
    }
    function T(e, i, r) {
      return n(this, null, function* () {
        if (!t) {
          ((t = !0),
            (a.textContent = ""),
            (h.textContent = r || sn("welcome.connecting")),
            (function (e) {
              B = e;
              try {
                localStorage.setItem(K, e);
              } catch (e) {}
            })(e),
            i &&
              (function (e) {
                z = {
                  url: String(e.url || "")
                    .trim()
                    .replace(/\/+$/, ""),
                  username: String(e.username || "").trim(),
                  password: String(e.password || "").trim(),
                };
                try {
                  localStorage.setItem(R, JSON.stringify(z));
                } catch (e) {}
              })(i),
            et && et());
          try {
            (yield Rt().authenticate(), A("home", {}));
          } catch (e) {
            ((t = !1),
              (h.textContent = sn("welcome.signIn")),
              (a.textContent =
                "Login failed" === e.message ? sn("welcome.wrongLogin") : e.message));
          }
        }
      });
    }
    return (
      S.addEventListener("focus-enter", (e) => {
        if ("INPUT" === e.target.tagName) {
          ((y = e.target), g.setTarget(e.target));
          for (let t of [u, c, d, m]) t.classList.toggle("typing", t === e.target);
        }
      }),
      S.addEventListener("focus-activate", (e) => {
        let t = e.target.closest(".welcome-option");
        if (t) {
          let e = t.__option.id;
          "free" === e
            ? T("free", null, sn("welcome.loadingChannels"))
            : (function (e) {
                ((s = e),
                  (a.textContent = ""),
                  (l.hidden = !0),
                  (w.hidden = "xtream" !== e),
                  (x.hidden = "m3u" !== e),
                  (p.hidden = !1),
                  (b.hidden = !1),
                  (h.textContent = sn("welcome.signIn")));
                let t = "xtream" === e ? u : m;
                (g.setTarget(t), v(t));
              })(e);
        } else
          e.target === h
            ? (function () {
                if ("xtream" === s) {
                  let e = u.value.trim(),
                    t = c.value.trim(),
                    n = d.value.trim();
                  return e && t && n
                    ? void T("xtream", { url: e, username: t, password: n })
                    : void (a.textContent = sn("welcome.fillAll"));
                }
                if ("m3u" === s) {
                  let e = m.value.trim();
                  if (!e) return void (a.textContent = sn("welcome.enterPlaylist"));
                  T("m3u", { url: e, username: "", password: "" });
                }
              })()
            : e.target === f
              ? _()
              : "INPUT" === e.target.tagName && g.setTarget(e.target);
      }),
      {
        mount(e) {
          (e.appendChild(S), _());
        },
        unmount() {
          r(S);
        },
        initialFocus: () => l.querySelector(".welcome-option"),
        onKey: (e) => !(!jn(e) || !s) && (_(), !0),
      }
    );
  }
  function ti(e) {
    let t = e || {},
      n = i("div", { class: "page" }),
      r = 0;
    return (
      t.title &&
        n.appendChild(
          i("div", { class: "page-header" }, [
            i("h1", { class: "page-title", dir: "auto", text: t.title }),
            t.subtitle ? i("p", { class: "page-subtitle", dir: "auto", text: t.subtitle }) : null,
          ]),
        ),
      n.addEventListener("focus-enter", (e) => {
        !(function (e) {
          let t = e.closest(".row") || e.closest(".page-block") || e,
            i = t.offsetTop,
            s = i + t.offsetHeight,
            a = r;
          (i - 40 < r ? (a = Math.max(0, i - 40)) : s + 80 > r + 1080 && (a = s + 80 - 1080),
            a !== r && ((r = a), (n.style.transform = "translate3d(0," + -r + "px,0)")));
        })(e.target);
      }),
      {
        node: n,
        add: (e) => (n.appendChild(e), e),
        reset() {
          ((r = 0), (n.style.transform = "translate3d(0,0,0)"));
        },
      }
    );
  }
  var ni = "poster-fallback",
    ii = null;
  function ri(e) {
    let t = e.getAttribute("data-src");
    if (!t) return void si(e);
    let n = new Image();
    ((n.decoding = "async"),
      (n.onload = () => {
        (e.classList.remove(ni),
          (e.style.backgroundImage = 'url("' + t.replace(/"/g, "%22") + '")'),
          e.classList.add("poster-loaded"));
      }),
      (n.onerror = () => {
        si(e);
      }),
      (n.src = t));
  }
  function si(e) {
    if ((e.classList.add(ni), !e.querySelector(".poster-fallback-text"))) {
      let t = document.createElement("span");
      ((t.className = "poster-fallback-text"),
        t.setAttribute("dir", "auto"),
        (t.textContent = e.getAttribute("data-title") || ""),
        e.appendChild(t));
    }
  }
  function ai(e) {
    e.getAttribute("data-src")
      ? (
          ii ||
          (ii = new IntersectionObserver(
            (e) => {
              for (let t of e) t.isIntersecting && (ii.unobserve(t.target), ri(t.target));
            },
            { root: null, rootMargin: "200px 600px", threshold: 0.01 },
          ))
        ).observe(e)
      : si(e);
  }
  var li = "iptv:resume",
    oi = null;
  function ui() {
    if (oi) return oi;
    oi = {};
    try {
      let e = localStorage.getItem(li);
      e && (oi = JSON.parse(e) || {});
    } catch (e) {}
    return oi;
  }
  function ci() {
    try {
      localStorage.setItem(li, JSON.stringify(oi));
    } catch (e) {}
  }
  function di(e, t) {
    return e + ":" + t;
  }
  function mi(e, t, n) {
    if ("live" === e.kind) return;
    let i = ui(),
      r = di(e.kind, e.id);
    if (t < 60 || (n > 0 && t / n >= 0.93)) return (delete i[r], void ci());
    ((function (e, t) {
      if (!e) return;
      let n = ui();
      for (let i of Object.keys(n)) {
        let r = n[i];
        r.seriesId === e && r.id !== t && delete n[i];
      }
    })(e.seriesId, e.id),
      (i[r] = {
        kind: e.kind,
        id: e.id,
        name: e.name,
        poster: e.poster || null,
        ext: e.ext || null,
        seriesId: e.seriesId || null,
        seriesName: e.seriesName || null,
        season: e.season || null,
        episodeNumber: e.episodeNumber || null,
        position: Math.floor(t),
        duration: Math.floor(n || 0),
        updatedAt: Date.now(),
      }));
    let s = Object.keys(i);
    if (s.length > 100) {
      s.sort((e, t) => i[e].updatedAt - i[t].updatedAt);
      for (let e of s.slice(0, s.length - 100)) delete i[e];
    }
    ci();
  }
  function hi(e, t) {
    return ui()[di(e, t)] || null;
  }
  function fi(e) {
    let t = ui(),
      n = Object.keys(t)
        .map((e) => t[e])
        .sort((e, t) => t.updatedAt - e.updatedAt),
      i = Object.create(null),
      r = [];
    for (let t of n) {
      if (t.seriesId) {
        if (i[t.seriesId]) continue;
        i[t.seriesId] = !0;
      }
      if ((r.push(t), r.length >= (e || 20))) break;
    }
    return r;
  }
  function pi(e) {
    return e && e.duration ? Math.min(1, e.position / e.duration) : 0;
  }
  function gi(e, t, n) {
    let r = i("div", { class: "poster " + (n || ""), "data-src": e || "", "data-title": t || "" });
    return (ai(r), r);
  }
  function vi(e, t) {
    let n = t || {},
      r = i("div", { class: "card card-poster focusable", "data-kind": e.kind, "data-id": e.id }),
      s = gi(e.poster, e.name, "poster-2x3");
    r.appendChild(s);
    let a = n.resume || hi(e.kind, e.id);
    return (
      a &&
        s.appendChild(
          (function (e) {
            return i("div", { class: "card-progress" }, [
              i("div", {
                class: "card-progress-fill",
                style: "width:" + Math.round(100 * e) + "%",
              }),
            ]);
          })(pi(a)),
        ),
      e.rating && s.appendChild(i("div", { class: "card-rating", text: e.rating.toFixed(1) })),
      r.appendChild(i("div", { class: "card-label", dir: "auto", text: e.name })),
      (r.__item = e),
      r
    );
  }
  function yi(e, t) {
    let n = t || {},
      r = i("div", { class: "card card-channel focusable", "data-kind": "live", "data-id": e.id }),
      s = gi(e.logo, e.name, "poster-16x9 poster-contain");
    return (
      r.appendChild(s),
      n.showNumber &&
        null != e.number &&
        s.appendChild(i("div", { class: "card-number", text: String(e.number) })),
      r.appendChild(i("div", { class: "card-label", dir: "auto", text: e.name })),
      (r.__item = e),
      r
    );
  }
  function bi(e, t) {
    let n = t || {},
      r = i("div", { class: "channel-row focusable", "data-kind": "live", "data-id": e.id });
    n.showNumber &&
      null != e.number &&
      r.appendChild(i("span", { class: "channel-row-number", text: String(e.number) }));
    let s = gi(e.logo, "", "channel-row-logo poster-contain");
    return (
      r.appendChild(s),
      r.appendChild(i("span", { class: "channel-row-name", dir: "auto", text: e.name })),
      n.favorite && r.appendChild(i("span", { class: "channel-row-fav", text: "★" })),
      (r.__item = e),
      r
    );
  }
  function wi(e, t) {
    let n = i("div", {
      class: "category-button focusable" + ((t || {}).active ? " active" : ""),
      "data-category-id": e.id,
      dir: "auto",
      text: e.name,
    });
    return ((n.__category = e), n);
  }
  function xi(e) {
    return new (class {
      constructor(e) {
        ((this.title = e.title || ""),
          (this.items = e.items || []),
          (this.variant = e.variant || "poster"),
          (this.onSelect = e.onSelect || null),
          (this.showNumber = !!e.showNumber),
          (this.key = e.key || "row-" + Math.random().toString(36).slice(2)),
          (this.metrics =
            "channel" === this.variant ? { width: 300, gap: 24 } : { width: 200, gap: 24 }),
          (this.rendered = new Map()),
          (this.offset = 0),
          (this.focusedIndex = 0),
          (this.node = this.build()));
      }
      build() {
        let e = i("div", { class: "row row-" + this.variant, "data-focus-memory": this.key });
        (this.title &&
          e.appendChild(i("h2", { class: "row-title", dir: "auto", text: this.title })),
          (this.viewport = i("div", { class: "row-viewport" })),
          (this.track = i("div", { class: "row-track" })));
        let t = this.metrics.width + this.metrics.gap;
        return (
          (this.track.style.width = this.items.length * t + "px"),
          this.viewport.appendChild(this.track),
          e.appendChild(this.viewport),
          e.addEventListener("focus-enter", (e) => this.handleFocusEnter(e)),
          e.addEventListener("focus-activate", (e) => {
            let t = e.target.closest(".card");
            t && this.onSelect && this.onSelect(t.__item, t);
          }),
          this.renderWindow(),
          e
        );
      }
      visibleCount() {
        let e = this.metrics.width + this.metrics.gap,
          t = this.viewport.clientWidth || 1660;
        return Math.max(1, Math.ceil(t / e));
      }
      renderWindow() {
        let e = this.metrics.width + this.metrics.gap,
          t = Math.max(0, this.offset - 3),
          n = Math.min(this.items.length - 1, this.offset + this.visibleCount() + 3);
        for (let [e, i] of this.rendered)
          (e < t || e > n) &&
            (i.parentNode && i.parentNode.removeChild(i), this.rendered.delete(e));
        for (let i = t; i <= n; i++) {
          if (this.rendered.has(i)) continue;
          let t = this.items[i];
          if (!t) continue;
          let n = "channel" === this.variant ? yi(t, { showNumber: this.showNumber }) : vi(t);
          ((n.style.transform = "translate3d(" + i * e + "px,0,0)"),
            n.setAttribute("data-index", String(i)),
            this.track.appendChild(n),
            this.rendered.set(i, n));
        }
      }
      handleFocusEnter(e) {
        let t = e.target.closest(".card");
        if (!t) return;
        let n = Number(t.getAttribute("data-index"));
        if (isNaN(n)) return;
        this.focusedIndex = n;
        let i = this.visibleCount(),
          r = this.offset;
        (n < r + 1 ? (r = n - 1) : n > r + i - 2 && (r = n - i + 2),
          (r = Math.max(0, Math.min(r, Math.max(0, this.items.length - i)))),
          r !== this.offset && ((this.offset = r), this.renderWindow()));
        let s = this.metrics.width + this.metrics.gap;
        this.track.style.transform = "translate3d(" + -this.offset * s + "px,0,0)";
      }
      setItems(e) {
        ((this.items = e || []), (this.offset = 0), this.rendered.clear(), r(this.track));
        let t = this.metrics.width + this.metrics.gap;
        ((this.track.style.width = this.items.length * t + "px"),
          (this.track.style.transform = "translate3d(0,0,0)"),
          this.renderWindow());
      }
      firstCard() {
        return this.rendered.get(0) || null;
      }
    })(e);
  }
  var ki = /\b(horror|slasher|gore|supernatural\s*horror)\b/i,
    Ci = /\b(horror|conjuring|annabelle|insidious|exorcis|nightmare on|saw\b|hostel|paranormal)\b/i,
    Si = /\b(action|thriller|crime|adventure|sci-?fi|science fiction|mystery)\b/i;
  function _i(e, t) {
    return ki.test(e.genre || "") || Ci.test(t || "");
  }
  var Ti = [/box office/i, /2026/i, /2025/i, /netflix/i, /imdb/i, /pure movies/i];
  function Li(e) {
    let t = e.slice();
    for (let e = t.length - 1; e > 0; e--) {
      let n = Math.floor(Math.random() * (e + 1)),
        i = t[e];
      ((t[e] = t[n]), (t[n] = i));
    }
    return t;
  }
  function Ii(e) {
    let t = e.onPlay,
      r = e.onInfo,
      s = !1 !== e.teaser,
      a = i("div", { class: "hero-blur" }),
      l = i("div", { class: "hero-backdrop" }),
      o = i("div", { class: "hero-backdrop" }),
      u = l,
      c = i("h1", { class: "hero-title", dir: "auto" }),
      d = i("div", { class: "hero-meta" }),
      m = i("p", { class: "hero-plot", dir: "auto" }),
      h = i("div", { class: "hero-dots" }),
      f = i("div", { class: "hero-button primary focusable", text: "▶  " + sn("home.play") }),
      p = i("div", { class: "hero-button focusable", text: sn("home.moreInfo") }),
      g = i("div", { class: "hero-body" }, [
        i("div", { class: "hero-kicker", text: sn("home.spotlight") }),
        c,
        d,
        m,
        i("div", { class: "hero-actions" }, [f, p]),
        h,
      ]),
      v = i("video", { class: "hero-video" });
    (v.setAttribute("playsinline", ""), (v.preload = "auto"), (v.muted = !1 === e.teaserSound));
    let y = i("div", { class: "hero page-block", "data-focus-memory": "hero" }, [
        a,
        l,
        o,
        v,
        i("div", { class: "hero-scrim" }),
        g,
      ]),
      b = [],
      w = 0,
      x = null,
      k = null,
      C = null,
      S = !1,
      _ = !1;
    function T() {
      h.innerHTML = "";
      for (let e = 0; e < b.length; e++)
        h.appendChild(i("span", { class: "hero-dot" + (e === w ? " active" : "") }));
    }
    function L(e) {
      let t = b[e];
      if (!t) return;
      ((w = e), (c.textContent = t.title), (d.textContent = t.meta), (m.textContent = t.plot));
      let n = 'url("' + t.art.replace(/"/g, "%22") + '")',
        i = u === l ? o : l;
      ((i.style.backgroundImage = n),
        i.classList.toggle("poster-art", !t.wideArt),
        i.classList.add("visible"),
        u.classList.remove("visible"),
        (u = i),
        (a.style.backgroundImage = n),
        y.classList.toggle("hero-poster", !t.wideArt),
        T());
    }
    function I() {
      (k && (clearTimeout(k), (k = null)),
        C && (clearTimeout(C), (C = null)),
        y.classList.remove("hero-playing"));
      try {
        (v.pause(), v.removeAttribute("src"), v.load());
      } catch (e) {}
    }
    function N() {
      if (
        (C && (clearTimeout(C), (C = null)), !v.__seeked && isFinite(v.duration) && v.duration > 0)
      ) {
        v.__seeked = !0;
        try {
          v.currentTime = 0.3 * v.duration;
        } catch (e) {}
      } else
        (y.classList.add("hero-playing"),
          k && clearTimeout(k),
          (k = setTimeout(() => {
            E();
          }, 2e4)));
    }
    function A() {
      let e = b[w];
      if (!(e && e.streamUrl && s && _)) return;
      (I(), (v.__seeked = !1), (v.src = e.streamUrl));
      let t = v.play();
      (t && t.catch && t.catch(() => {}),
        (C = setTimeout(() => {
          E();
        }, 7e3)));
    }
    function E() {
      S || !b.length || (L((w + 1) % b.length), s && _ && A());
    }
    function O() {
      if (!(b.length < 2)) {
        if (s && _) return void A();
        x ||
          (x = setInterval(() => {
            S || L((w + 1) % b.length);
          }, 5e3));
      }
    }
    function P(e) {
      return new Promise((t) => {
        let n = new Image();
        ((n.onload = () => t({ ok: !0, wide: n.naturalWidth / n.naturalHeight >= 1.4 })),
          (n.onerror = () => t({ ok: !1, wide: !1 })),
          (n.src = e));
      });
    }
    function M() {
      return n(this, null, function* () {
        let e = yield Vt(),
          t = [];
        for (let n of Ti) {
          for (let i of e) n.test(i.name) && t.push(i);
          if (t.length >= 4) break;
        }
        !t.length && e.length && t.push(e[0]);
        let n = [];
        for (let e of t.slice(0, 4))
          try {
            n = n.concat(yield Wt(e.id));
          } catch (e) {}
        if (!n.length) return [];
        let i = Li(n.filter((e) => e.rating && e.rating >= 7))
            .sort((e, t) => t.rating - e.rating)
            .slice(0, 30),
          r = n
            .filter((e) => e.added)
            .sort((e, t) => t.added - e.added)
            .slice(0, 30),
          s = (function (e, t, n) {
            let i = [],
              r = Object.create(null);
            for (let s = 0; i.length < n && (s < e.length || s < t.length); s++)
              for (let a of [e, t]) {
                let e = a[s];
                if (e && !r[e.id] && ((r[e.id] = !0), i.push(e), i.length >= n)) break;
              }
            return i;
          })(Li(i), Li(r), 24),
          a = [];
        for (let e of s) {
          if (S || a.length >= 8) break;
          let t;
          try {
            t = yield Xt(e.id);
          } catch (e) {
            continue;
          }
          if (!t || _i(t, t.name || e.name) || (a.length < 5 && !Si.test(t.genre || ""))) continue;
          let n = (t.backdrops && t.backdrops[0]) || t.poster || e.poster;
          if (!n) continue;
          let i = yield P(n);
          if (!i.ok) continue;
          let r = [
            t.releaseDate ? String(t.releaseDate).slice(0, 4) : null,
            t.durationSecs ? Math.round(t.durationSecs / 60) + " min" : null,
            t.genre || null,
            t.rating ? "★ " + t.rating.toFixed(1) : null,
          ].filter(Boolean);
          (a.push({
            id: e.id,
            name: t.name || e.name,
            poster: t.poster || e.poster,
            ext: t.ext || e.ext,
            title: t.name || e.name,
            meta: r.join("   ·   "),
            plot: t.plot || "",
            art: n,
            wideArt: i.wide,
            streamUrl: Zt(e.id, t.ext || e.ext),
          }),
            1 === a.length ? ((b = a), y.classList.add("hero-ready"), L(0), O()) : ((b = a), T()));
        }
        return a;
      });
    }
    return (
      y.addEventListener("focus-activate", (e) => {
        let n = b[w];
        n && (e.target === f ? t(n) : e.target === p && r(n));
      }),
      v.addEventListener("playing", N),
      v.addEventListener("error", () => {
        E();
      }),
      {
        node: y,
        load: function () {
          return n(this, null, function* () {
            let e = yield M();
            return !S && (e.length ? (O(), !0) : (y.classList.add("hero-artless"), !1));
          });
        },
        playButton: f,
        setFocused: function (e) {
          _ !== e &&
            ((_ = e),
            s &&
              (_
                ? (x && (clearInterval(x), (x = null)), A())
                : (I(),
                  !x &&
                    b.length > 1 &&
                    (x = setInterval(() => {
                      S || L((w + 1) % b.length);
                    }, 5e3)))));
        },
        stop() {
          ((S = !0), x && (clearInterval(x), (x = null)), I(), v.removeEventListener("playing", N));
        },
        hasContent: () => b.length > 0,
      }
    );
  }
  var Ni = "iptv:favorites",
    Ai = null;
  function Ei() {
    if (Ai) return Ai;
    Ai = [];
    try {
      let e = localStorage.getItem(Ni);
      if (e) {
        let t = JSON.parse(e);
        Array.isArray(t) && (Ai = t);
      }
    } catch (e) {}
    return Ai;
  }
  function Oi() {
    try {
      localStorage.setItem(Ni, JSON.stringify(Ai));
    } catch (e) {}
  }
  function Pi(e) {
    return e.kind + ":" + e.id;
  }
  function Mi(e) {
    let t = Ei();
    return e ? t.filter((t) => t.kind === e) : t.slice();
  }
  function Fi(e) {
    let t = Pi(e);
    return Ei().some((e) => Pi(e) === t);
  }
  function qi(e) {
    let t = Ei(),
      n = Pi(e),
      i = t.findIndex((e) => Pi(e) === n);
    return -1 !== i && (t.splice(i, 1), Oi(), !0);
  }
  function Di(e) {
    return Fi(e)
      ? (qi(e), !1)
      : ((function (e) {
          let t = Ei();
          !Fi(e) &&
            (t.unshift({
              kind: e.kind,
              id: e.id,
              name: e.name,
              poster: e.poster || e.logo || null,
              categoryId: e.categoryId || null,
              ext: e.ext || null,
              addedAt: Date.now(),
            }),
            t.length > 500 && (t.length = 500),
            Oi());
        })(e),
        !0);
  }
  function ji() {
    let e = ti({}),
      t = !1,
      i = null,
      s = [];
    function a(t) {
      let n = xi(t);
      return (s.push(n), e.add(n.node), n);
    }
    function l(e) {
      "live" === e.kind
        ? E("player", { channel: e })
        : "movie" === e.kind
          ? E("details", { kind: "movie", id: e.id, item: e })
          : "series" === e.kind && E("details", { kind: "series", id: e.id, item: e });
    }
    let o = null;
    function u(e, t) {
      ((e.node.__load = t),
        o ||
          (o = new IntersectionObserver(
            (e) => {
              for (let t of e) {
                if (!t.isIntersecting) continue;
                o.unobserve(t.target);
                let e = t.target.__load;
                e && ((t.target.__load = null), e());
              }
            },
            { root: null, rootMargin: "1200px 0px", threshold: 0.01 },
          )),
        o.observe(e.node));
    }
    return {
      mount(r) {
        (r.appendChild(e.node),
          e.node.addEventListener("focus-enter", (e) => {
            i && i.setFocused(i.node.contains(e.target));
          }),
          (i = Ii({
            teaser: Z().heroTeaser,
            teaserSound: Z().heroTeaserSound,
            onPlay: (e) =>
              E("player", {
                item: { kind: "movie", id: e.id, name: e.name, poster: e.poster, ext: e.ext },
              }),
            onInfo: (e) => E("details", { kind: "movie", id: e.id, item: e }),
          })),
          e.add(i.node),
          i.load().catch(() => {
            i.node.classList.add("hero-artless");
          }),
          (function () {
            let e = fi(20);
            e.length &&
              a({
                key: "home-continue",
                title: sn("home.continue"),
                items: e.map((e) => ({
                  kind: e.kind,
                  id: e.id,
                  name: e.seriesName
                    ? e.seriesName + " · S" + e.season + "E" + e.episodeNumber
                    : e.name,
                  poster: e.poster,
                  ext: e.ext,
                })),
                onSelect: (e) => {
                  let t = hi(e.kind, e.id);
                  E("player", { item: e, resumeAt: t ? t.position : 0 });
                },
              });
          })(),
          (function () {
            let e = Mi();
            e.length &&
              a({ key: "home-favorites", title: sn("home.favorites"), items: e, onSelect: l });
          })(),
          (function () {
            n(this, null, function* () {
              let i = [
                  { kind: "live", categories: zt, streams: Bt, variant: "channel" },
                  { kind: "movie", categories: Vt, streams: Wt, variant: "poster" },
                  { kind: "series", categories: Jt, streams: Ht, variant: "poster" },
                ],
                r = 3;
              for (let s of i) {
                if (t) return;
                let i;
                try {
                  i = yield s.categories();
                } catch (e) {
                  continue;
                }
                for (let o of i) {
                  if (t) return;
                  let i = a({
                      key: "home-" + s.kind + "-" + o.id,
                      title: o.name,
                      items: [],
                      variant: s.variant,
                      onSelect: l,
                    }),
                    c = () =>
                      n(null, null, function* () {
                        try {
                          let n = yield s.streams(o.id);
                          if (t) return;
                          if (!n.length) return void i.node.classList.add("row-empty");
                          (i.setItems(n), w(e.node, i.firstCard()));
                        } catch (e) {
                          i.node.classList.add("row-empty");
                        }
                      });
                  r > 0 ? (r--, yield c()) : u(i, c);
                }
              }
            });
          })());
      },
      unmount() {
        ((t = !0), i && (i.stop(), (i = null)), o && (o.disconnect(), (o = null)), r(e.node));
      },
      initialFocus: () =>
        e.node.querySelector(".hero-button") || e.node.querySelector(".card") || null,
      onKey: () => !1,
    };
  }
  var Ui = null,
    Ri = null;
  function Ki(e, t) {
    (Ui || ((Ui = i("div", { class: "toast" })), document.body.appendChild(Ui)),
      (Ui.textContent = e),
      Ui.classList.add("visible"),
      Ri && clearTimeout(Ri),
      (Ri = setTimeout(() => {
        (Ui.classList.remove("visible"), (Ri = null));
      }, t || 2600)));
  }
  var zi = "iptv:preferences",
    Bi = null;
  function Vi() {
    if (Bi) return Bi;
    Bi = { intro: {}, fit: {} };
    try {
      let e = localStorage.getItem(zi);
      if (e) {
        let t = JSON.parse(e);
        t && "object" == typeof t && ((Bi.intro = t.intro || {}), (Bi.fit = t.fit || {}));
      }
    } catch (e) {}
    return Bi;
  }
  function Wi() {
    try {
      localStorage.setItem(zi, JSON.stringify(Bi));
    } catch (e) {}
  }
  function Ji(e) {
    return String(e || "");
  }
  function Hi(e, t) {
    if (!e || t < 15 || t > 420) return;
    let n = Vi(),
      i = Ji(e),
      r = n.intro[i] ? n.intro[i].slice() : [];
    (r.push(Math.round(t)), r.length > 5 && r.shift(), (n.intro[i] = r), Wi());
  }
  function Xi(e) {
    if (!e) return null;
    let t = Vi().intro[Ji(e)];
    if (!t || !t.length) return null;
    let n = t.slice().sort((e, t) => e - t);
    return n[Math.floor(n.length / 2)];
  }
  var Gi = ["fit", "fill", "stretch"];
  function Zi(e) {
    return sn("player." + e);
  }
  function $i(e, t) {
    return e + ":" + t;
  }
  function Qi(e, t) {
    return Vi().fit[$i(e, t)] || "fit";
  }
  function Yi(e, t) {
    let n = Qi(e, t);
    return (function (e, t, n) {
      let i = Vi();
      return ("fit" === n ? delete i.fit[$i(e, t)] : (i.fit[$i(e, t)] = n), Wi(), n);
    })(e, t, Gi[(Gi.indexOf(n) + 1) % Gi.length]);
  }
  var er = ["nudge", "seek", "reload"],
    tr = [10, 30, 60, 300],
    nr = null;
  function ir(e) {
    if (!isFinite(e) || e < 0) return "--:--";
    let t = Math.floor(e),
      n = Math.floor(t / 3600),
      i = Math.floor((t % 3600) / 60),
      r = t % 60,
      s = (e) => (e < 10 ? "0" + e : String(e));
    return n > 0 ? n + ":" + s(i) + ":" + s(r) : s(i) + ":" + s(r);
  }
  function rr(e) {
    let t = e.channel || e.item,
      n = "live" === t.kind,
      s = i("video", { class: "player-video" });
    s.setAttribute("playsinline", "");
    let a = new (class {
        constructor(e) {
          ((this.video = e),
            (this.sources = []),
            (this.sourceIndex = 0),
            (this.current = null),
            (this.attempted = new Set()),
            (this.startTimer = null),
            (this.stallTimer = null),
            (this.promoteTimer = null),
            (this.watchdog = null),
            (this.lastTime = 0),
            (this.lastAdvance = 0),
            (this.started = !1),
            (this.stopped = !0),
            (this.recoveryStep = 0),
            (this.wasStalled = !1),
            (this.listeners = Object.create(null)),
            (this.onError = () => this.handleFailure("error")),
            (this.onPlaying = () => this.handlePlaying()),
            (this.onWaiting = () => this.emit("buffering", { source: this.current })),
            (this.onEnded = () => this.emit("ended", { source: this.current })),
            this.video.addEventListener("error", this.onError),
            this.video.addEventListener("playing", this.onPlaying),
            this.video.addEventListener("waiting", this.onWaiting),
            this.video.addEventListener("ended", this.onEnded));
        }
        on(e, t) {
          return (this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t), this);
        }
        emit(e, t) {
          let n = this.listeners[e];
          if (n)
            for (let e of n)
              try {
                e(t);
              } catch (e) {}
        }
        play(e, t, n) {
          (this.stopTimers(),
            (this.sources = e.slice()),
            (this.urlFor = t),
            (this.options = n || {}),
            (this.sourceIndex = 0),
            (this.attempted = new Set()),
            (this.stopped = !1),
            (this.recoveryStep = 0),
            (this.wasStalled = !1),
            this.openCurrent());
        }
        openCurrent() {
          let e = this.sources[this.sourceIndex];
          if (!e) return this.exhausted();
          ((this.current = e),
            this.attempted.add(e.id),
            (this.started = !1),
            (this.lastTime = 0),
            (this.lastAdvance = Date.now()),
            this.releaseMedia());
          let t = this.urlFor(e);
          (this.emit("loading", { source: e, url: t }), (this.video.src = t));
          let n = this.video.play();
          (n && n.catch && n.catch(() => {}),
            (this.startTimer = setTimeout(() => {
              this.started || this.handleFailure("timeout");
            }, 6e3)),
            this.startWatchdog());
        }
        handlePlaying() {
          let e = !this.started;
          if (
            ((this.started = !0),
            (this.lastAdvance = Date.now()),
            this.startTimer && (clearTimeout(this.startTimer), (this.startTimer = null)),
            e)
          ) {
            if (this.options.resumeAt > 0 && isFinite(this.video.duration)) {
              try {
                this.video.currentTime = this.options.resumeAt;
              } catch (e) {}
              this.options.resumeAt = 0;
            }
            (this.emit("playing", { source: this.current }), this.schedulePromotion());
          }
        }
        startWatchdog() {
          (this.watchdog && clearInterval(this.watchdog),
            (this.watchdog = setInterval(() => {
              if (this.stopped || this.video.paused) return;
              let e = Date.now(),
                t = this.video.currentTime;
              if (t > this.lastTime + 0.15)
                return (
                  (this.lastTime = t),
                  (this.lastAdvance = e),
                  (this.recoveryStep = 0),
                  this.wasStalled &&
                    ((this.wasStalled = !1), this.emit("recovered", { source: this.current })),
                  void this.emit("progress", { position: t, source: this.current })
                );
              this.started && e - this.lastAdvance > 3500 && this.handleStall();
            }, 500)));
        }
        handleStall() {
          ((this.lastAdvance = Date.now()),
            (this.wasStalled = !0),
            this.emit("stalled", { source: this.current }));
          let e = this.nextSource({ degrade: !0 });
          if (e)
            return (
              this.emit("quality-change", { from: this.current, to: e, reason: "stall" }),
              (this.sourceIndex = this.sources.indexOf(e)),
              void this.openCurrent()
            );
          this.recover();
        }
        recover() {
          let e = er[this.recoveryStep];
          if ((this.recoveryStep++, !e))
            return void this.emit("buffering", { source: this.current, terminal: !0 });
          let t = this.video.currentTime;
          if (
            (this.emit("recovering", { source: this.current, step: e, position: t }), "nudge" !== e)
          )
            if ("seek" !== e)
              ((this.options.resumeAt = t),
                this.attempted.delete(this.current.id),
                this.openCurrent());
            else {
              try {
                this.video.currentTime = t + 0.5;
              } catch (e) {}
              let e = this.video.play();
              e && e.catch && e.catch(() => {});
            }
          else {
            let e = this.video.play();
            e && e.catch && e.catch(() => {});
          }
        }
        handleFailure(e) {
          if (this.stopped) return;
          let t = this.current,
            n = this.nextSource({});
          if (!n) return this.exhausted();
          (this.emit("source-failed", { source: t, reason: e, next: n }),
            (this.sourceIndex = this.sources.indexOf(n)),
            this.openCurrent());
        }
        nextSource(e) {
          let t = this.current ? this.current.rank : 0,
            n = this.sources.filter((e) => !this.attempted.has(e.id));
          if (!n.length) return null;
          if (e && e.degrade) {
            let e = n.filter((e) => e.rank > t);
            if (e.length) return e.sort((e, t) => e.rank - t.rank)[0];
          }
          let i = n.filter((e) => e.rank >= t);
          return i.length ? i.sort((e, t) => e.rank - t.rank)[0] : n[0];
        }
        schedulePromotion() {
          (this.promoteTimer && clearTimeout(this.promoteTimer),
            !this.options.noPromote &&
              (this.promoteTimer = setTimeout(() => {
                if (this.stopped || !this.started) return;
                let e = this.sources
                  .filter((e) => e.rank < (this.current ? this.current.rank : 0))
                  .sort((e, t) => t.rank - e.rank)[0];
                e &&
                  (this.emit("quality-change", { from: this.current, to: e, reason: "promote" }),
                  this.attempted.delete(e.id),
                  (this.sourceIndex = this.sources.indexOf(e)),
                  this.openCurrent());
              }, 9e4)));
        }
        exhausted() {
          (this.emit("exhausted", { attempted: this.attempted.size }), this.stop());
        }
        togglePause() {
          return (
            this.video.paused ? this.video.play() : this.video.pause(),
            this.emit("paused-changed", { paused: this.video.paused }),
            this.video.paused
          );
        }
        seekBy(e) {
          return !!isFinite(this.video.duration) && (this.seekTo(this.video.currentTime + e), !0);
        }
        seekTo(e) {
          if (!isFinite(this.video.duration)) return !1;
          let t = Math.max(0, Math.min(this.video.duration - 1, e));
          ((this.lastAdvance = Date.now()), (this.lastTime = t));
          try {
            this.video.currentTime = t;
          } catch (e) {
            return !1;
          }
          return (this.emit("seeked", { position: t, duration: this.video.duration }), !0);
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
            (this.video.pause(), this.video.removeAttribute("src"), this.video.load());
          } catch (e) {}
        }
        stopTimers() {
          (this.startTimer && (clearTimeout(this.startTimer), (this.startTimer = null)),
            this.stallTimer && (clearTimeout(this.stallTimer), (this.stallTimer = null)),
            this.promoteTimer && (clearTimeout(this.promoteTimer), (this.promoteTimer = null)),
            this.watchdog && (clearInterval(this.watchdog), (this.watchdog = null)));
        }
        stop() {
          ((this.stopped = !0),
            this.stopTimers(),
            this.releaseMedia(),
            (this.current = null),
            this.emit("stopped", {}));
        }
        destroy() {
          (this.stop(),
            this.video.removeEventListener("error", this.onError),
            this.video.removeEventListener("playing", this.onPlaying),
            this.video.removeEventListener("waiting", this.onWaiting),
            this.video.removeEventListener("ended", this.onEnded),
            (this.listeners = Object.create(null)));
        }
      })(s),
      l = null,
      o = null,
      u = null,
      c = null,
      d = null,
      h = 0,
      f = 0,
      p = !1,
      g = i("div", { class: "osd-title", dir: "auto", text: t.name }),
      y = i("div", { class: "osd-subtitle" }),
      b = i("div", { class: "osd-quality" }),
      w = i("div", { class: "osd-bar-fill" }),
      x = i("div", { class: "osd-bar-knob" }),
      k = i("div", { class: "osd-bar" }, [w, x]),
      C = i("span", { class: "osd-time", text: "--:--" }),
      S = i("span", { class: "osd-time osd-time-total", text: "--:--" }),
      _ = i("div", { class: "osd-button focusable", text: "❚❚" }),
      T = i("div", { class: "osd-button focusable", text: "★" }),
      L = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.quality") }),
      I = e.episodes || null,
      N = null == e.episodeIndex ? -1 : e.episodeIndex,
      A = !!(I && N >= 0 && N < I.length - 1),
      E = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.skipIntro") }),
      O = i("div", {
        class: "osd-button osd-button-wide focusable",
        text: sn("player.nextEpisode"),
      }),
      F = i("div", { class: "osd-button osd-button-wide focusable", text: sn("player.fit") }),
      q = i("div", { class: "osd-controls", "data-focus-memory": "osd" }, [
        _,
        T,
        n ? null : E,
        A ? O : null,
        F,
        L,
      ]),
      D = i("div", { class: "credits-prompt", hidden: "hidden" }, [
        i("div", { class: "credits-label", text: sn("player.upNext") }),
        i("div", { class: "credits-title", dir: "auto", text: "" }),
        i("div", {
          class: "button primary focusable credits-play",
          text: "▶  " + sn("player.playNext"),
        }),
      ]),
      j = D.querySelector(".credits-title"),
      U = D.querySelector(".credits-play"),
      R = i("div", { class: "osd-progress" }, [C, k, S]),
      K = i("div", { class: "osd" }, [
        i("div", { class: "osd-gradient" }),
        i("div", { class: "osd-body" }, [g, y, b, n ? null : R, q]),
      ]),
      z = i("div", { class: "player-message" }),
      B = i("div", { class: "player", "data-focus-trap": "" }, [s, z, D, K]);
    function V() {
      (K.classList.add("visible"), l && clearTimeout(l), (l = setTimeout(W, 4500)));
    }
    function W() {
      (K.classList.remove("visible"), l && (clearTimeout(l), (l = null)));
    }
    function J(e, t) {
      ((z.textContent = t || ""), z.classList.toggle("visible", !!t));
    }
    function H() {
      T.classList.toggle("active", Fi(t));
    }
    function X() {
      if (n || null !== d) return;
      (G(a.position, a.duration),
        (function () {
          if (!A || null !== d) return;
          let e = a.duration;
          if (!e) return;
          let t = e - a.position,
            n = Z().nextEpisodePromptSeconds,
            i = t > 0 && t <= n;
          if (i !== !D.hidden)
            if (i) {
              let e = I[N + 1];
              ((j.textContent =
                "S" + e.season + "E" + e.episodeNumber + (e.title ? " · " + e.title : "")),
                (D.hidden = !1),
                v(U));
            } else ((D.hidden = !0), m() === U && v(_));
        })());
    }
    function G(e, t) {
      let n = t > 0 ? Math.min(1, e / t) : 0;
      ((w.style.width = 100 * n + "%"),
        (x.style.left = 100 * n + "%"),
        (C.textContent = ir(e)),
        (S.textContent = ir(t)));
    }
    function $(t) {
      if (n || !a.duration) return;
      let i = Date.now();
      ((h = i - f < 400 ? Math.min(tr.length - 1, h + 1) : 0), (f = i));
      let r = null === d ? a.position : d,
        s = Math.max(0, Math.min(a.duration - 1, r + t * tr[h]));
      ((d = s),
        G(s, a.duration),
        k.classList.add("seeking"),
        V(),
        u && clearTimeout(u),
        (u = setTimeout(() => {
          let t = d;
          ((d = null),
            (h = 0),
            k.classList.remove("seeking"),
            a.seekTo(t),
            e.seriesId && t > a.position && (Hi(e.seriesId, t), Q()));
        }, 450)));
    }
    function Q() {
      let t = Xi(e.seriesId);
      E.textContent = null !== t ? sn("player.skipIntro") : "Skip +" + Z().introSkipSeconds + "s";
    }
    function Y() {
      return e.seriesId ? { kind: "series", id: e.seriesId } : { kind: t.kind, id: t.id };
    }
    function ee() {
      let e = Y(),
        t = Qi(e.kind, e.id);
      (s.classList.remove("fit-fit", "fit-fill", "fit-stretch"),
        s.classList.add("fit-" + t),
        (F.textContent = Zi(t)));
    }
    function te() {
      if (!A) return;
      let n = I[N + 1];
      (ne(),
        P("player", {
          item: {
            kind: "episode",
            id: n.id,
            name: (e.seriesName || "") + " · S" + n.season + "E" + n.episodeNumber,
            poster: n.still || t.poster,
            ext: n.ext,
          },
          episodes: I,
          episodeIndex: N + 1,
          seriesId: e.seriesId,
          seriesName: e.seriesName,
          season: n.season,
          episodeNumber: n.episodeNumber,
          resumeAt: 0,
        }));
    }
    function ne() {
      n ||
        mi(
          {
            kind: t.kind,
            id: t.id,
            name: t.name,
            poster: t.poster || null,
            ext: t.ext || null,
            seriesId: e.seriesId || null,
            seriesName: e.seriesName || null,
            season: e.season || null,
            episodeNumber: e.episodeNumber || null,
          },
          a.position,
          a.duration,
        );
    }
    function ie(e) {
      return e.url
        ? e.url
        : n
          ? Gt(e.id, Z().liveFormat, e.item || t)
          : "episode" === t.kind
            ? (function (e, t) {
                return Rt().episodeUrl(e, t);
              })(e.id, e.ext || t.ext)
            : Zt(e.id, e.ext || t.ext);
    }
    function re() {
      if (!n) return [{ id: t.id, name: t.name, ext: t.ext, rank: 0 }];
      if (t.sources && t.sources.length)
        return t.sources.map((e) => ({
          id: e.id,
          name: e.name || t.name,
          url: e.url,
          quality: e.quality,
          rank: e.rank,
          item: t,
        }));
      if (t.url || !Kt().singleConnection)
        return [{ id: t.id, name: t.name, url: t.url, item: t, rank: 0 }];
      let e = Z().preferLowerBitrate ? 1 : 0,
        i = (function (e, t) {
          let n = vn(e),
            i = null == t ? 1 : t,
            r = n.filter((e) => e.rank >= i);
          return r.length ? r.sort((e, t) => e.rank - t.rank)[0] : n[0];
        })(t, e),
        r = vn(t);
      return [i].concat(r.filter((e) => e.id !== i.id));
    }
    (a.on("loading", () => {
      J(0, "");
    }),
      a.on("playing", (e) => {
        (J(0, ""),
          n && (nr = t),
          (_.textContent = "❚❚"),
          (b.textContent = e.source && e.source.quality ? e.source.quality : ""),
          n || (S.textContent = ir(a.duration)),
          V());
      }),
      a.on("progress", () => {
        J(0, "");
        n || ((a.__pos = a.position), (a.__dur = Math.max(a.__dur || 0, a.duration || 0)));
      }),
      a.on("recovered", () => {
        J(0, "");
      }),
      a.on("recovering", () => {
        J(0, "");
      }),
      a.on("buffering", (e) => {
        if (e && e.terminal) return void __lr(__pos());
        a.paused || J(0, "");
      }),
      a.on("source-failed", () => {
        J(0, "");
      }),
      a.on("quality-change", (e) => {
        e.to && e.to.quality && (b.textContent = e.to.quality);
      }),
      a.on("exhausted", () => {
        J(0, "");
        __lr(__pos());
      }),
      a.on("ended", () => {
        if (n) return void __lr(0);
        var q = a.position,
          d = Math.max(a.__dur || 0, a.duration || 0);
        if (d > 0 && q >= d - 3) {
          ne();
          if (A) return void te();
          try {
            if (e.seriesId) return void P("details", { kind: "series", id: e.seriesId });
            if (t && t.id)
              return void P("details", {
                kind: "episode" === t.kind ? "series" : t.kind || "movie",
                id: t.id,
                item: t,
              });
          } catch (_) {}
          return void M();
        }
        __lr(a.__pos || q || 0);
      }),
      B.addEventListener("focus-activate", (n) => {
        let s = n.target;
        if (s === _) {
          let e = a.togglePause();
          ((_.textContent = e ? "▶" : "❚❚"), e && ne(), V());
        } else if (s === T) {
          let e = Di(t);
          (H(), Ki(e ? "Added to favourites" : "Removed from favourites"), V());
        } else if (s === E)
          !(function () {
            let t,
              n = Xi(e.seriesId),
              i = a.position;
            if (null !== n && n > i) (a.seekTo(n), (t = n));
            else {
              let e = Z().introSkipSeconds;
              if (!a.seekBy(e)) return;
              t = i + e;
            }
            (Hi(e.seriesId, t), Q(), V());
          })();
        else if (s === O || s === U) te();
        else if (s === F)
          !(function () {
            let e = Y(),
              t = Yi(e.kind, e.id);
            (ee(), Ki(Zi(t)), V());
          })();
        else if (s === L)
          !(function () {
            let e = vn(t);
            (r(se),
              se.appendChild(i("div", { class: "quality-title", text: sn("player.quality") })),
              e.length <= 1 &&
                se.appendChild(
                  i("div", {
                    class: "quality-empty",
                    text: "Only one source available for this channel.",
                  }),
                ));
            for (let t of e) {
              let e = i("div", {
                class:
                  "quality-option focusable" +
                  (a.current && a.current.id === t.id ? " active" : ""),
                dir: "auto",
                text: (t.quality || "Auto") + " — " + t.name,
              });
              ((e.__source = t), se.appendChild(e));
            }
            ((se.hidden = !1),
              l && (clearTimeout(l), (l = null)),
              v(se.querySelector(".quality-option")));
          })();
        else if (s.classList.contains("quality-option")) {
          let e = s.__source;
          ae();
          let t = re().filter((t) => t.id !== e.id);
          (a.play([e].concat(t), ie, { noPromote: !0 }), Ki("Quality: " + (e.quality || e.name)));
        }
      }));
    let se = i("div", { class: "quality-panel", hidden: "hidden", "data-focus-memory": "quality" });
    function ae() {
      ((se.hidden = !0), v(L), V());
    }
    function __lr(r) {
      if (p) return;
      if (a.__ok && Date.now() - a.__ok >= 5e3) a.__rt = 0;
      a.__rt = (a.__rt || 0) + 1;
      if (a.__rt > 3) {
        J(0, sn("player.unavailable"));
        return;
      }
      J(0, sn("welcome.connecting"));
      a.__t && clearTimeout(a.__t);
      a.__t = setTimeout(() => {
        if (p) return;
        try {
          a.play(re(), ie, { resumeAt: r > 2 ? r : 0, noPromote: !n });
        } catch (e) {
          J(0, sn("player.unavailable"));
        }
      }, 600);
    }
    function __pos() {
      return n ? 0 : a.__pos || a.position || 0;
    }
    a.on("playing", () => {
      a.__ok = Date.now();
    });
    return {
      mount(t) {
        (((e) => {
          B.appendChild(e);
        })(se),
          t.appendChild(B),
          H(),
          ee(),
          n || Q(),
          (function () {
            let t = re();
            (J(0, ""), a.play(t, ie, { resumeAt: e.resumeAt || 0, noPromote: !n }));
          })(),
          V(),
          (c = setInterval(X, 500)),
          (o = setInterval(ne, 1e4)));
      },
      unmount() {
        ((p = !0),
          ne(),
          l && clearTimeout(l),
          o && clearInterval(o),
          u && clearTimeout(u),
          c && clearInterval(c),
          a.destroy(),
          r(B));
      },
      initialFocus: () => _,
      onKey: function (i) {
        if (jn(i))
          return se.hidden
            ? K.classList.contains("visible")
              ? (W(), !0)
              : (ne(), M(), !0)
            : (ae(), !0);
        if (!se.hidden) return !1;
        let r = K.classList.contains("visible");
        if ((i === yn || i === Pn) && !n) return ($(-1), !0);
        if ((i === wn || i === Mn) && !n) return ($(1), !0);
        if (i === En || i === An || i === Nn) {
          let e = a.togglePause();
          return ((_.textContent = e ? "▶" : "❚❚"), e && ne(), V(), !0);
        }
        if (i === On) return (ne(), M(), !0);
        if (n && e.siblings && e.siblings.length > 1) {
          let n = 0;
          if ((i === bn || i === Fn ? (n = -1) : (i === xn || i === qn) && (n = 1), 0 !== n)) {
            let i = e.siblings.length,
              r = ((null == e.index ? 0 : e.index) + n + i) % i;
            return (
              ne(),
              P("player", { channel: e.siblings[r], siblings: e.siblings, index: r, previous: t }),
              !0
            );
          }
        }
        return !D.hidden && Un(i) ? (te(), !0) : !r && (V(), v(_), !0);
      },
    };
  }
  function sr(e) {
    return e ? Math.round(e / 60) + " min" : null;
  }
  function ar(e) {
    let t = ti({}),
      s = i("div", { class: "details" });
    t.add(s);
    let a = !1,
      l = null,
      o = 0,
      u = i("div", { class: "details-hero" }),
      c = i("div", { class: "poster poster-2x3 details-poster" }),
      d = i("h1", { class: "details-title", dir: "auto", text: e.item ? e.item.name : "" }),
      m = i("div", { class: "details-meta" }),
      h = i("p", { class: "details-plot", dir: "auto" }),
      f = i("div", { class: "button primary focusable details-play", text: "▶  Play" }),
      p = i("div", { class: "button focusable", text: "★  Favourite" }),
      g = i("div", { class: "details-actions", "data-focus-memory": "details-actions" }, [f, p]),
      v = i("div", { class: "details-info" }, [d, m, h, g]);
    (u.appendChild(c), u.appendChild(v), s.appendChild(u));
    let y = i("div", { class: "details-episodes" });
    function x() {
      let t = e.item || { kind: e.kind, id: e.id, name: d.textContent };
      p.classList.toggle("active", Fi(t));
    }
    function k(e, t) {
      (c.setAttribute("data-src", e || ""), c.setAttribute("data-title", t || ""), ai(c));
    }
    function C() {
      return n(this, null, function* () {
        let t = yield Xt(e.id);
        if (a) return;
        ((l = t),
          (d.textContent = t.name || (e.item ? e.item.name : "")),
          k(t.poster || (e.item && e.item.poster), d.textContent));
        let n = [
          t.releaseDate ? String(t.releaseDate).slice(0, 4) : null,
          sr(t.durationSecs),
          t.genre || null,
          t.rating ? "★ " + t.rating.toFixed(1) : null,
        ].filter(Boolean);
        ((m.textContent = n.join("   ·   ")), (h.textContent = t.plot || ""));
        let i = hi("movie", e.id);
        (i && (f.textContent = "▶  Resume  ·  " + Math.floor(i.position / 60) + " min in"),
          x(),
          w(s, f));
      });
    }
    function S() {
      return n(this, null, function* () {
        let t = yield (function (e) {
          return Rt().seriesInfo(e);
        })(e.id);
        if (a) return;
        ((l = t),
          (d.textContent = t.name || (e.item ? e.item.name : "")),
          k(t.poster || (e.item && e.item.poster), d.textContent));
        let n = [
          t.releaseDate ? String(t.releaseDate).slice(0, 4) : null,
          t.seasons.length + (1 === t.seasons.length ? " season" : " seasons"),
          t.genre || null,
          t.rating ? "★ " + t.rating.toFixed(1) : null,
        ].filter(Boolean);
        ((m.textContent = n.join("   ·   ")),
          (h.textContent = t.plot || ""),
          (f.textContent = "▶  Play"),
          x(),
          _(),
          w(s, f));
      });
    }
    function _() {
      if ((r(y), !l || !l.seasons.length)) return;
      if (l.seasons.length > 1) {
        let e = i("div", { class: "season-strip", "data-focus-memory": "seasons" });
        (l.seasons.forEach((t, n) => {
          let r = i("div", {
            class: "season-button focusable" + (n === o ? " active" : ""),
            text: "Season " + t.number,
          });
          ((r.__seasonIndex = n), e.appendChild(r));
        }),
          y.appendChild(e));
      }
      let e = i("div", { class: "episode-list", "data-focus-memory": "episodes" });
      for (let t of l.seasons[o].episodes) e.appendChild(T(t));
      y.appendChild(e);
    }
    function T(e) {
      let t = i("div", {
        class: "poster poster-16x9 episode-still",
        "data-src": e.still || "",
        "data-title": "",
      });
      ai(t);
      let n = hi("episode", e.id);
      if (n) {
        let e = pi(n);
        t.appendChild(
          i("div", { class: "card-progress" }, [
            i("div", { class: "card-progress-fill", style: "width:" + Math.round(100 * e) + "%" }),
          ]),
        );
      }
      let r = i("div", { class: "episode-row focusable" }, [
        t,
        i("div", { class: "episode-text" }, [
          i("div", {
            class: "episode-title",
            dir: "auto",
            text: e.episodeNumber + ".  " + (e.title || "Episode " + e.episodeNumber),
          }),
          i("div", { class: "episode-plot", dir: "auto", text: e.plot || "" }),
        ]),
        i("div", { class: "episode-duration", text: sr(e.durationSecs) || "" }),
      ]);
      return ((r.__episode = e), r);
    }
    function L(t) {
      let n = hi("episode", t.id),
        i = l.seasons.filter((e) => e.number === t.season)[0],
        r = i ? i.episodes : [t];
      E("player", {
        item: {
          kind: "episode",
          id: t.id,
          name: (l ? l.name : "") + " · S" + t.season + "E" + t.episodeNumber,
          poster: t.still || (l ? l.poster : null),
          ext: t.ext,
        },
        episodes: r,
        episodeIndex: r.indexOf(t),
        seriesId: e.id,
        seriesName: l ? l.name : "",
        season: t.season,
        episodeNumber: t.episodeNumber,
        resumeAt: n ? n.position : 0,
      });
    }
    return (
      s.appendChild(y),
      s.addEventListener("focus-activate", (t) => {
        let n = t.target;
        if (n === f)
          return void ("series" === e.kind
            ? (function () {
                if (!l || !l.seasons.length) return;
                let e = null,
                  t = 0;
                for (let n of l.seasons)
                  for (let i of n.episodes) {
                    let n = hi("episode", i.id);
                    n && n.updatedAt > t && ((t = n.updatedAt), (e = i));
                  }
                L(e || l.seasons[0].episodes[0]);
              })()
            : (function () {
                let t = hi("movie", e.id);
                E("player", {
                  item: {
                    kind: "movie",
                    id: e.id,
                    name: d.textContent,
                    poster: l ? l.poster : null,
                    ext: l ? l.ext : (e.item && e.item.ext) || "mp4",
                  },
                  resumeAt: t ? t.position : 0,
                });
              })());
        if (n === p) {
          let t = Di(
            e.item || { kind: e.kind, id: e.id, name: d.textContent, poster: l ? l.poster : null },
          );
          return (x(), void Ki(t ? "Added to favourites" : "Removed from favourites"));
        }
        if (n.classList.contains("season-button"))
          return ((o = n.__seasonIndex), _(), void b(y.querySelector(".season-button.active")));
        let i = n.closest(".episode-row");
        i && L(i.__episode);
      }),
      {
        mount(n) {
          (n.appendChild(t.node),
            (function __ld(k) {
              ("series" === e.kind ? S : C)().catch(function (err) {
                if (a) return;
                var off = !!(err && String(err.message || err).indexOf("__NOAPI__") >= 0);
                h.textContent = off ? sn("details.offline") : sn("details.couldNotLoad");
                if (k < 20)
                  setTimeout(
                    function () {
                      a || __ld(k + 1);
                    },
                    off ? 5e3 : 2e3,
                  );
              });
            })(0));
        },
        unmount() {
          ((a = !0), r(t.node));
        },
        initialFocus: () => f,
        onKey: () => !1,
      }
    );
  }
  var lr = "iptv:health",
    or = null;
  function ur() {
    if (or) return or;
    or = {};
    try {
      let e = localStorage.getItem(lr);
      e && (or = JSON.parse(e) || {});
    } catch (e) {
      or = {};
    }
    return or;
  }
  function cr() {
    let e = ur(),
      t = Object.keys(e);
    if (t.length > 800) {
      t.sort((t, n) => e[t].at - e[n].at);
      for (let n of t.slice(0, t.length - 800)) delete e[n];
    }
    try {
      localStorage.setItem(lr, JSON.stringify(e));
    } catch (e) {}
  }
  function dr(e) {
    let t = ur()[e];
    return t ? (t.ok ? -1 : Date.now() - t.at > 432e5 ? 0 : 1) : 0;
  }
  function mr() {
    let e = i("video", { class: "preview-video" });
    (e.setAttribute("playsinline", ""), (e.muted = !1));
    let t = i("div", { class: "poster poster-16x9 preview-poster" }),
      n = i("div", { class: "preview-name", dir: "auto", text: "" }),
      s = i("div", { class: "preview-hint", text: sn("browse.pressOkPreview") }),
      a = i("div", { class: "preview-frame" }, [t, e]),
      l = i("div", { class: "preview-pane" }, [
        i("div", { class: "pane-title", text: sn("browse.preview") }),
        a,
        n,
        s,
      ]),
      o = null,
      u = null,
      c = [],
      d = 0;
    function m() {
      (a.classList.add("preview-playing"),
        (s.textContent = sn("browse.pressOkFull")),
        u && (clearTimeout(u), (u = null)),
        o &&
          (function (e) {
            if (!e) return;
            ((ur()[e] = { ok: !0, at: Date.now(), fails: 0 }), cr());
          })(o));
    }
    function h() {
      if ((u && (clearTimeout(u), (u = null)), d < c.length - 1))
        return (d++, (s.textContent = "Trying another source…"), void f());
      (a.classList.remove("preview-playing"),
        (s.textContent = sn("browse.noResponse")),
        o &&
          (function (e) {
            if (!e) return;
            let t = ur(),
              n = t[e];
            ((t[e] = { ok: !1, at: Date.now(), fails: ((n && n.fails) || 0) + 1 }), cr());
          })(o),
        (o = null));
    }
    function f() {
      let t = c[d];
      if (!t) return h();
      try {
        (e.pause(), e.removeAttribute("src"), e.load());
      } catch (e) {}
      e.src = t.url;
      let n = e.play();
      (n && n.catch && n.catch(() => {}),
        (u = setTimeout(() => {
          e.readyState < 3 && h();
        }, 8e3)));
    }
    function p() {
      (u && (clearTimeout(u), (u = null)), a.classList.remove("preview-playing"));
      try {
        (e.pause(), e.removeAttribute("src"), e.load());
      } catch (e) {}
      ((o = null), (c = []), (d = 0));
    }
    return (
      e.addEventListener("playing", m),
      e.addEventListener("error", h),
      {
        node: l,
        show: function (e) {
          e &&
            (o && o !== e.id && p(),
            (n.textContent = e.name),
            o || (s.textContent = sn("browse.pressOkPreview")),
            t.setAttribute("data-src", e.logo || ""),
            t.setAttribute("data-title", e.name || ""),
            (t.style.backgroundImage = ""),
            t.classList.remove("poster-loaded", "poster-fallback"),
            r(t),
            ai(t));
        },
        play: function (e, t) {
          return (
            !(
              !e ||
              (p(),
              (c = e.sources && e.sources.length ? e.sources.slice() : t ? [{ url: t }] : []),
              !c.length)
            ) &&
            ((d = 0), (o = e.id), (n.textContent = e.name), (s.textContent = "Starting…"), f(), !0)
          );
        },
        release: p,
        isPreviewing: (e) => !!e && o === e.id,
        destroy() {
          (p(), e.removeEventListener("playing", m), e.removeEventListener("error", h));
        },
      }
    );
  }
  function hr(e) {
    return String(e || "")
      .toLowerCase()
      .replace(/[ً-ْـ]/g, "")
      .replace(/[آأإ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[^\p{L}\p{N} ]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function fr(e) {
    return e.map((e) => ({ item: e, key: hr(e.name) }));
  }
  var pr = (e) => new Promise((t) => setTimeout(t, e));
  function gr(e, t) {
    return n(this, null, function* () {
      let n = yield e(),
        i = [];
      for (let e of n) {
        try {
          i.push.apply(i, yield t(e.id));
        } catch (e) {}
        yield pr(120);
      }
      return i;
    });
  }
  var vr = null,
    yr = null;
  function br() {
    return vr;
  }
  function wr() {
    return vr
      ? Promise.resolve(vr)
      : yr ||
          (yr = n(null, null, function* () {
            let e = yield gr(zt, Bt),
              t = yield gr(Vt, Wt),
              n = yield gr(Jt, Ht);
            return ((vr = { live: fr(e), movies: fr(t), series: fr(n) }), (yr = null), vr);
          }));
  }
  var xr = null,
    kr = null;
  function Cr(e, t, n) {
    let i = hr(t);
    if (!i) return [];
    let r = [],
      s = [];
    for (let t of e) {
      let e = t.key.indexOf(i);
      if (-1 !== e && (0 === e ? r.push(t.item) : s.push(t.item), n && r.length >= n)) break;
    }
    return n ? r.concat(s).slice(0, n) : r.concat(s);
  }
  function Sr(e) {
    return n(this, null, function* () {
      if ("freetv" === e)
        return xr
          ? Promise.resolve(xr)
          : kr ||
              (kr = n(null, null, function* () {
                let e = yield St(),
                  t = Object.create(null),
                  n = [];
                for (let i of Object.keys(e.items))
                  for (let r of e.items[i]) t[r.name] || ((t[r.name] = !0), n.push(r));
                return ((xr = fr(n)), (kr = null), xr);
              }));
      let t = yield wr();
      return "live" === e
        ? t.live
        : "movies" === e
          ? t.movies
          : "series" === e
            ? t.series
            : t.live.concat(t.movies, t.series);
    });
  }
  function _r(e) {
    let t = e.kind,
      s = e.renderRow,
      l = e.onOpen,
      o = e.language || "ar",
      u = null,
      c = [],
      d = i("input", {
        class: "field-input section-search-input",
        type: "text",
        readonly: "readonly",
        placeholder: "Search…",
      }),
      m = i("div", { class: "section-search-status", text: "" }),
      h = i("div", { class: "section-search-results" }),
      f = Jn({
        language: o,
        suggest: (e) => (e ? (u ? Zn(u, e, 6) : []) : Xn().slice(0, 6)),
        onChange: () => {
          g();
        },
        onSubmit: () => {
          Gn(d.value);
          let e = h.querySelector(".channel-row, .card");
          e && v(e);
        },
      });
    f.setTarget(d);
    let p = i("div", { class: "section-search" }, [d, f.node, m, h]),
      g = a(
        () =>
          n(null, null, function* () {
            let e = d.value.trim();
            if ((r(h), e.length < 2))
              return ((m.textContent = "Type at least two characters."), void (c = []));
            if (!u) {
              m.textContent = "Preparing…";
              try {
                u = yield Sr(t);
              } catch (e) {
                return void (m.textContent = "Could not load this section.");
              }
              f.refreshSuggestions();
            }
            if (d.value.trim() === e) {
              if (((c = Cr(u, e, 200)), r(h), !c.length))
                return void (m.textContent = "Nothing found for “" + e + "”.");
              m.textContent =
                c.length >= 200
                  ? "First 200 matches"
                  : c.length + (1 === c.length ? " match" : " matches");
              for (let e of c) {
                let t = s(e);
                ((t.__item = e), h.appendChild(t));
              }
            }
          }),
        250,
      );
    return (
      p.addEventListener("focus-activate", (e) => {
        let t = e.target.closest(".channel-row, .card");
        t && t.__item && l(t.__item, c);
      }),
      {
        node: p,
        prepare() {
          u ||
            Sr(t)
              .then((e) => {
                ((u = e), f.refreshSuggestions());
              })
              .catch(() => {});
        },
        reset() {
          ((d.value = ""),
            r(h),
            (c = []),
            (m.textContent = "Type at least two characters."),
            f.refreshSuggestions());
        },
        firstKey: () => f.firstKey(),
      }
    );
  }
  var Tr = {
    live: {
      title: "Live TV",
      categories: () => zt(),
      items: (e) => Bt(e),
      layout: "list",
      defaultCategory: /bein\s*sport.*\[\s*hd\s*\]/i,
      defaultItem: /bein\s*sports?\s*1\b/i,
    },
    movies: { title: "Movies", categories: () => Vt(), items: (e) => Wt(e), layout: "grid" },
    series: { title: "Series", categories: () => Jt(), items: (e) => Ht(e), layout: "grid" },
  };
  function Lr(e) {
    let t = Tr[e.kind],
      s = [],
      a = [],
      l = 0,
      o = !1,
      u = !1,
      c = i("div", {
        class: "category-button category-search focusable",
        text: "⌕   Search " + t.title,
      }),
      d = i("div", { class: "pane-scroll" }),
      h = i("div", { class: "category-pane", "data-focus-memory": "browse-cats" }, [
        i("div", { class: "pane-title", text: "Categories" }),
        c,
        d,
      ]),
      f = i("div", { class: "pane-scroll" }),
      p = i("div", { class: "pane-title", text: "" }),
      g = i("div", { class: "channel-pane", "data-focus-memory": "browse-items" }, [p, f]),
      y = "list" === t.layout ? mr() : null,
      b = _r({
        kind: e.kind,
        renderRow: (e) =>
          "grid" === t.layout ? vi(e) : bi(e, { showNumber: Z().showChannelNumbers }),
        onOpen: (e, t) => {
          "live" === e.kind
            ? E("player", { channel: e, siblings: t, index: t.indexOf(e) })
            : E("details", { kind: e.kind, id: e.id, item: e });
        },
      });
    function x(e) {
      ((b.node.hidden = !e),
        (f.hidden = e),
        (p.hidden = e),
        y && ((y.node.hidden = e), y.release()),
        c.classList.toggle("active", e),
        k.classList.toggle("searching", e));
    }
    b.node.hidden = !0;
    let k = i(
      "div",
      { class: "split" + (y ? " split-with-preview" : "") },
      y ? [h, g, y.node] : [h, g],
    );
    function C(e, t, n, i) {
      let s = 0,
        a = new Map(),
        l = 0,
        o = i || 1;
      function u() {
        return Math.ceil(l / o);
      }
      function c() {
        let i = Math.ceil(940 / t),
          r = Math.max(0, s - 4),
          c = Math.min(u() - 1, s + i + 4);
        for (let [e, t] of a) {
          let n = Math.floor(e / o);
          (n < r || n > c) && (t.parentNode && t.parentNode.removeChild(t), a.delete(e));
        }
        for (let i = r; i <= c; i++)
          for (let r = 0; r < o; r++) {
            let s = i * o + r;
            if (s >= l || a.has(s)) continue;
            let u = n(s);
            u &&
              (u.setAttribute("data-index", String(s)),
              (u.style.position = "absolute"),
              (u.style.top = i * t + "px"),
              o > 1 && (u.style.left = 224 * r + "px"),
              e.appendChild(u),
              a.set(s, u));
          }
      }
      return {
        setTotal(n) {
          ((l = n),
            (s = 0),
            a.clear(),
            r(e),
            (e.style.position = "relative"),
            (e.style.height = u() * t + "px"),
            (e.style.transform = "translate3d(0,0,0)"),
            c());
        },
        scrollTo(n) {
          let i = Math.floor(n / o),
            r = Math.floor(940 / t),
            a = s;
          (i < s ? (a = i) : i > s + r - 1 && (a = i - r + 1),
            (a = Math.max(0, Math.min(a, Math.max(0, u() - r)))),
            a !== s && ((s = a), c()),
            (e.style.transform = "translate3d(0," + -s * t + "px,0)"));
        },
        node: (e) => a.get(e) || null,
        redraw: c,
      };
    }
    let S = C(d, 76, (e) => {
        let t = s[e];
        return t ? wi(t, { active: e === l }) : null;
      }),
      _ = C(
        f,
        "grid" === t.layout ? 392 : 88,
        (e) => {
          let n = a[e];
          return n
            ? "grid" === t.layout
              ? vi(n)
              : bi(n, { showNumber: Z().showChannelNumbers, favorite: Fi(n) })
            : null;
        },
        "grid" === t.layout ? 5 : 1,
      );
    function T(e) {
      return n(this, null, function* () {
        if (s[e]) {
          l = e;
          for (let t of d.querySelectorAll(".category-button"))
            t.classList.toggle("active", Number(t.getAttribute("data-index")) === e);
          ((p.textContent = s[e].name), (a = []), _.setTotal(0));
          try {
            let n = yield t.items(s[e].id);
            if (o || l !== e) return;
            if (((a = n), _.setTotal(a.length), !u && t.defaultItem)) {
              u = !0;
              let e = a.findIndex((e) => t.defaultItem.test(e.name));
              e > 0 && _.scrollTo(e);
            }
          } catch (t) {
            o || (p.textContent = s[e].name + " — could not load");
          }
        }
      });
    }
    var __cdT = null,
      __cdI = -1;
    function __cd(i) {
      __cdI = i;
      __cdT && clearTimeout(__cdT);
      __cdT = setTimeout(function () {
        __cdT = null;
        __cdI = -1;
        T(i);
      }, 160);
    }
    function __cf() {
      if (!__cdT) return null;
      clearTimeout(__cdT);
      __cdT = null;
      var i = __cdI;
      __cdI = -1;
      return i >= 0 ? T(i) : null;
    }
    function L(e) {
      "live" === e.kind
        ? E("player", { channel: e, siblings: a, index: a.indexOf(e) })
        : "movie" === e.kind
          ? E("details", { kind: "movie", id: e.id, item: e })
          : E("details", { kind: "series", id: e.id, item: e });
    }
    return (
      k.addEventListener("focus-enter", (e) => {
        let t = e.target,
          n = Number(t.getAttribute("data-index"));
        isNaN(n) ||
          (t.classList.contains("category-button")
            ? (S.scrollTo(n), n !== l && __cd(n))
            : (_.scrollTo(n), y && t.__item && y.show(t.__item)));
      }),
      k.addEventListener("focus-activate", (e) => {
        let t = e.target;
        if (t === c) return (x(!0), b.reset(), void v(b.firstKey()));
        if (t.classList.contains("category-button")) {
          x(!1);
          var __p = __cf();
          if (__p && __p.then) {
            __p.then(function () {
              var q = f.querySelector(".channel-row, .card");
              q && v(q);
            });
            return;
          }
          let e = f.querySelector(".channel-row, .card");
          e && v(e);
        } else if (t.__item) {
          if (y)
            return void (y.isPreviewing(t.__item)
              ? (y.release(), L(t.__item))
              : y.play(t.__item, Gt(t.__item.id, Z().liveFormat, t.__item)));
          L(t.__item);
        }
      }),
      {
        mount(e) {
          (((e) => {
            g.appendChild(e);
          })(b.node),
            e.appendChild(k),
            (function () {
              return n(this, null, function* () {
                if (((s = yield t.categories()), o)) return;
                S.setTotal(s.length);
                let e = t.defaultCategory
                  ? Math.max(
                      0,
                      s.findIndex((e) => t.defaultCategory.test(e.name)),
                    )
                  : 0;
                (S.scrollTo(e), w(k, S.node(e)), yield T(e));
              });
            })().catch(() => {
              p.textContent = "Could not load categories.";
            }));
        },
        unmount() {
          ((o = !0), y && y.destroy(), r(k));
        },
        initialFocus: () => d.querySelector(".category-button"),
        onKey: function (e) {
          if (e === Ln || e === In) {
            let e = m();
            if (e && e.__item) {
              let t = Di(e.__item);
              return (e.classList.toggle("has-favorite", t), _.redraw(), !0);
            }
          }
          return !1;
        },
      }
    );
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
  var Er = [
    { kind: "live", title: "Channels", variant: "channel" },
    { kind: "movie", title: "Movies", variant: "poster" },
    { kind: "series", title: "Series", variant: "poster" },
  ];
  function Or() {
    let e = ti({ title: "My Favourites" }),
      t = i("div", {
        class: "empty",
        text: "Nothing saved yet. Press the yellow button on any channel or title to add it.",
      });
    function n(e) {
      "live" === e.kind
        ? E("player", { channel: e })
        : E("details", { kind: e.kind, id: e.id, item: e });
    }
    function s() {
      (r(e.node),
        e.node.appendChild(
          i("div", { class: "page-header" }, [
            i("h1", { class: "page-title", text: "My Favourites" }),
          ]),
        ));
      let s = !1;
      for (let t of Er) {
        let i = Mi(t.kind);
        if (!i.length) continue;
        s = !0;
        let r = i.map((e) => ("live" === t.kind ? Object.assign({}, e, { logo: e.poster }) : e)),
          a = xi({
            key: "fav-" + t.kind,
            title: t.title,
            items: r,
            variant: t.variant,
            onSelect: n,
          });
        e.add(a.node);
      }
      s || e.add(t);
    }
    return {
      mount(t) {
        (t.appendChild(e.node), s());
      },
      unmount() {
        r(e.node);
      },
      initialFocus: () => e.node.querySelector(".card"),
      onKey(t) {
        if (t === Ln || t === In) {
          let t = m();
          if (t && t.__item)
            return (
              qi(t.__item),
              Ki("Removed from favourites"),
              s(),
              b(e.node.querySelector(".card")),
              !0
            );
        }
        return !1;
      },
    };
  }
  function Pr(e) {
    return e.seriesName ? e.seriesName + " · S" + e.season + "E" + e.episodeNumber : e.name;
  }
  function Mr(e) {
    if (!e.duration) return "";
    let t = Math.max(0, e.duration - e.position);
    return Math.round(t / 60) + " min left";
  }
  function Fr() {
    let e = ti({});
    function t(e) {
      let t = hi(e.kind, e.id);
      E("player", {
        item: { kind: e.kind, id: e.id, name: e.name, poster: e.poster, ext: e.ext },
        seriesId: e.seriesId || null,
        seriesName: e.seriesName || null,
        season: e.season || null,
        episodeNumber: e.episodeNumber || null,
        resumeAt: t ? t.position : 0,
      });
    }
    function n() {
      (r(e.node),
        e.node.appendChild(
          i("div", { class: "page-header" }, [
            i("h1", { class: "page-title", text: "Continue Watching" }),
            i("p", {
              class: "page-subtitle",
              text: "Press the yellow button to remove something from this list.",
            }),
          ]),
        ));
      let n = fi(100);
      if (!n.length)
        return void e.add(
          i("div", {
            class: "empty",
            text: "Nothing in progress. Anything you start will show up here.",
          }),
        );
      let s = xi({
        key: "continue-all",
        title: "",
        items: n.map((e) => ({
          kind: e.kind,
          id: e.id,
          name: Pr(e),
          poster: e.poster,
          ext: e.ext,
          seriesId: e.seriesId,
          seriesName: e.seriesName,
          season: e.season,
          episodeNumber: e.episodeNumber,
          subtitle: Mr(e),
        })),
        onSelect: t,
      });
      e.add(s.node);
    }
    return {
      mount(t) {
        (t.appendChild(e.node), n());
      },
      unmount() {
        r(e.node);
      },
      initialFocus: () => e.node.querySelector(".card"),
      onKey(t) {
        if (t === Ln || t === In) {
          let t = m();
          if (t && t.__item)
            return (
              (function (e, t) {
                (delete ui()[di(e, t)], ci());
              })(t.__item.kind, t.__item.id),
              Ki("Removed from Continue Watching"),
              n(),
              b(e.node.querySelector(".card")),
              !0
            );
        }
        return !1;
      },
    };
  }
  var qr = hr;
  function Dr() {
    let e = ti({}),
      t = !1,
      s = i("input", {
        class: "field-input search-input",
        type: "text",
        readonly: "readonly",
        placeholder: "Search channels, movies and series",
      }),
      l = i("div", { class: "empty", text: "" }),
      o = i("div", { class: "search-results" }),
      u = Jn({
        language: "ar",
        suggest: (e) => {
          if (!e) return Xn().slice(0, 6);
          let t = br();
          return t ? Zn(t.series.concat(t.movies, t.live), e, 6) : [];
        },
        onChange: () => {
          m(s.value);
        },
        onSubmit: () => {
          Gn(s.value);
          let e = o.querySelector(".card");
          e && v(e);
        },
      });
    function c(e) {
      "live" === e.kind
        ? E("player", { channel: e })
        : E("details", { kind: e.kind, id: e.id, item: e });
    }
    (u.setTarget(s),
      e.node.appendChild(
        i("div", { class: "page-header" }, [i("h1", { class: "page-title", text: "Search" })]),
      ),
      e.add(i("div", { class: "search-bar page-block" }, [s])),
      e.add(i("div", { class: "page-block" }, [u.node])),
      e.add(l),
      e.add(o));
    let d = (e, t) => Cr(e, t);
    let m = a((e) => {
      (function (e) {
        return n(this, null, function* () {
          let n = qr(e);
          if ((r(o), n.length < 2)) return void (l.textContent = "Type at least two characters.");
          br() || (l.textContent = "Preparing search…");
          let i = yield wr();
          if (t || qr(s.value) !== n) return;
          u.refreshSuggestions();
          let a = [
            { title: "Channels", items: d(i.live, n), variant: "channel" },
            { title: "Movies", items: d(i.movies, n), variant: "poster" },
            { title: "Series", items: d(i.series, n), variant: "poster" },
          ].filter((e) => e.items.length);
          if ((r(o), a.length)) {
            l.textContent = "";
            for (let e of a) {
              let t = xi({
                key: "search-" + e.title,
                title: e.title + "  (" + e.items.length + ")",
                items: e.items,
                variant: e.variant,
                onSelect: c,
              });
              o.appendChild(t.node);
            }
          } else l.textContent = "Nothing found for “" + e + "”.";
        });
      })(e).catch(() => {});
    }, 350);
    return (
      s.addEventListener("input", () => {
        m(s.value);
      }),
      {
        mount(t) {
          (t.appendChild(e.node), (l.textContent = "Type at least two characters."));
        },
        unmount() {
          ((t = !0), r(e.node));
        },
        initialFocus: () => u.firstKey(),
        onKey(e) {
          if (e === Tn) {
            let e = o.querySelector(".card");
            if (e) return (v(e), !0);
          }
          return !1;
        },
      }
    );
  }
  function jr() {
    let e = ti({ title: sn("settings.title") }),
      t = i("div", { class: "settings-list", "data-focus-memory": "settings" });
    function n(e, t, n, r) {
      let s = i("div", { class: "settings-row focusable" }, [
        i("div", { class: "settings-text" }, [
          i("div", { class: "settings-label", text: t }),
          i("div", { class: "settings-description", text: n }),
        ]),
        i("div", { class: "settings-value", text: r }),
      ]);
      return ((s.__key = e), s);
    }
    function s() {
      r(t);
      let e = Z();
      (t.appendChild(
        n(
          "language",
          sn("settings.language"),
          sn("settings.languageDetail"),
          (Qt.filter((e) => e.code === nn())[0] || Qt[0]).label,
        ),
      ),
        t.appendChild(
          n(
            "preferLowerBitrate",
            "Cap quality at FHD",
            "4K streams rebuffer on this connection. Off lets 4K play when a channel offers it.",
            e.preferLowerBitrate ? sn("settings.on") : sn("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "liveFormat",
            "Live stream format",
            "Raw TS starts about a second faster than HLS on this TV.",
            "ts" === e.liveFormat ? "TS (faster)" : "HLS",
          ),
        ),
        t.appendChild(
          n(
            "heroTeaser",
            "Play previews on the home spotlight",
            "Plays ~20s of each film. Only while the spotlight is focused, but it uses the account’s single connection while it does.",
            e.heroTeaser ? sn("settings.on") : sn("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "heroTeaserSound",
            "Spotlight sound",
            "Plays the preview with sound, the way Netflix’s billboard does.",
            e.heroTeaserSound ? sn("settings.on") : sn("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "showChannelNumbers",
            "Show channel numbers",
            "Displays the portal’s channel number beside each channel.",
            e.showChannelNumbers ? sn("settings.on") : sn("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "clearCache",
            "Clear cached lists",
            "Forces a fresh fetch of categories and listings.",
            "",
          ),
        ),
        t.appendChild(n("signOut", "Sign out", "Forgets the portal credentials on this TV.", "")));
    }
    return (
      e.add(t),
      t.addEventListener("focus-activate", (e) => {
        let t = e.target.closest(".settings-row");
        if (!t) return;
        let n = Z();
        switch (t.__key) {
          case "language": {
            let e = Qt.map((e) => e.code);
            return (
              (function (e) {
                en = e;
                try {
                  localStorage.setItem($t, e);
                } catch (e) {}
                rn();
                for (var __i = 0; __i < cn.length; __i++) {
                  var __q = document.querySelector(
                    '.rail-item[data-route="' + cn[__i].id + '"] .rail-label',
                  );
                  if (__q) __q.textContent = sn(cn[__i].key);
                }
              })(e[(e.indexOf(nn()) + 1) % e.length]),
              void A("settings", {})
            );
          }
          case "preferLowerBitrate":
            $({ preferLowerBitrate: !n.preferLowerBitrate });
            break;
          case "liveFormat":
            $({ liveFormat: "ts" === n.liveFormat ? "m3u8" : "ts" });
            break;
          case "heroTeaser":
            $({ heroTeaser: !n.heroTeaser });
            break;
          case "heroTeaserSound":
            $({ heroTeaserSound: !n.heroTeaserSound });
            break;
          case "showChannelNumbers":
            $({ showChannelNumbers: !n.showChannelNumbers });
            break;
          case "clearCache":
            return (le(), void Ki("Cached lists cleared"));
          case "signOut":
            return (
              (function () {
                z = null;
                try {
                  localStorage.removeItem(R);
                } catch (e) {}
              })(),
              le(),
              void A("welcome", {})
            );
          default:
            return;
        }
        s();
      }),
      {
        mount(t) {
          (t.appendChild(e.node), s());
        },
        unmount() {
          r(e.node);
        },
        initialFocus: () => t.querySelector(".settings-row"),
        onKey: () => !1,
      }
    );
  }
  var Ur = !1;
  function Rr(e) {
    let t = e.onUnlock,
      n = e.onCancel,
      s = "",
      a = i("div", { class: "pin-dots" }),
      l = i("div", { class: "pin-message", text: "Enter PIN" }),
      o = i("div", { class: "pin-keypad", "data-focus-memory": "pinlock" }),
      u = i("div", { class: "pin-lock" }, [
        i("div", { class: "pin-title", text: "🔒  Locked" }),
        l,
        a,
        o,
      ]);
    function c() {
      r(a);
      for (let e = 0; e < 4; e++)
        a.appendChild(i("span", { class: "pin-dot" + (e < s.length ? " filled" : "") }));
    }
    function d(e) {
      s.length >= 4 ||
        ((s += e),
        c(),
        !(s.length < 4) &&
          (s ===
          (function () {
            try {
              return localStorage.getItem("iptv:lockPin") || "1112";
            } catch (e) {
              return "1112";
            }
          })()
            ? ((Ur = !0), t())
            : ((l.textContent = "Wrong PIN"),
              u.classList.add("pin-wrong"),
              (s = ""),
              setTimeout(() => {
                (u.classList.remove("pin-wrong"), (l.textContent = "Enter PIN"), c());
              }, 900))));
    }
    for (let e = 1; e <= 9; e++) {
      let t = i("div", { class: "pin-key focusable", text: String(e) });
      ((t.__press = () => d(String(e))), o.appendChild(t));
    }
    let m = i("div", { class: "pin-key pin-key-action focusable", text: "⌫" });
    ((m.__press = () => {
      ((s = s.slice(0, -1)), c());
    }),
      o.appendChild(m));
    let h = i("div", { class: "pin-key focusable", text: "0" });
    ((h.__press = () => d("0")), o.appendChild(h));
    let f = i("div", { class: "pin-key pin-key-action focusable", text: "✕" });
    return (
      (f.__press = () => {
        n && n();
      }),
      o.appendChild(f),
      u.addEventListener("focus-activate", (e) => {
        let t = e.target.closest(".pin-key");
        t && t.__press && t.__press();
      }),
      c(),
      {
        node: u,
        reset() {
          ((s = ""), (l.textContent = "Enter PIN"), c());
        },
        focusFirst() {
          v(o.querySelector(".pin-key"));
        },
      }
    );
  }
  function Kr() {
    let e = [],
      t = [],
      s = 0,
      a = !1,
      l = i("div", {
        class: "category-button category-search focusable",
        text: "⌕   Search free channels",
      }),
      o = i("div", { class: "pane-scroll" }),
      u = i("div", { class: "category-pane", "data-focus-memory": "free-cats" }, [
        i("div", { class: "pane-title", text: "Free channels" }),
        l,
        o,
      ]),
      c = i("div", { class: "pane-scroll" }),
      d = i("div", { class: "pane-title", text: "Loading…" }),
      h = i("div", { class: "channel-pane", "data-focus-memory": "free-items" }, [d, c]),
      f = mr(),
      p = _r({
        kind: "freetv",
        renderRow: (e) => bi(e, {}),
        onOpen: (e, t) => {
          E("player", { channel: e, siblings: t, index: t.indexOf(e) });
        },
      });
    p.node.hidden = !0;
    let g = i("div", { class: "split split-with-preview" }, [u, h, f.node]);
    function y(e) {
      ((p.node.hidden = !e),
        (c.hidden = e),
        (d.hidden = e),
        (f.node.hidden = e),
        f.release(),
        l.classList.toggle("active", e));
    }
    function b(e, t, n) {
      let i = 0,
        s = new Map(),
        a = 0;
      function l() {
        let r = Math.ceil(940 / t),
          l = Math.max(0, i - 4),
          o = Math.min(a - 1, i + r + 4);
        for (let [e, t] of s)
          (e < l || e > o) && (t.parentNode && t.parentNode.removeChild(t), s.delete(e));
        for (let i = l; i <= o; i++) {
          if (s.has(i)) continue;
          let r = n(i);
          r &&
            (r.setAttribute("data-index", String(i)),
            (r.style.position = "absolute"),
            (r.style.top = i * t + "px"),
            e.appendChild(r),
            s.set(i, r));
        }
      }
      return {
        setTotal(n) {
          ((a = n),
            (i = 0),
            s.clear(),
            r(e),
            (e.style.position = "relative"),
            (e.style.height = a * t + "px"),
            (e.style.transform = "translate3d(0,0,0)"),
            l());
        },
        scrollTo(n) {
          let r = Math.floor(940 / t),
            s = i;
          (n < i ? (s = n) : n > i + r - 1 && (s = n - r + 1),
            (s = Math.max(0, Math.min(s, Math.max(0, a - r)))),
            s !== i && ((i = s), l()),
            (e.style.transform = "translate3d(0," + -i * t + "px,0)"));
        },
        node: (e) => s.get(e) || null,
      };
    }
    let x = b(o, 76, (t) => {
        let n = e[t];
        return n ? wi(n, { active: t === s }) : null;
      }),
      k = b(c, 88, (e) => {
        let n = t[e];
        return n ? bi(n, { favorite: Fi(n) }) : null;
      });
    function C(i) {
      return n(this, null, function* () {
        if (!e[i]) return;
        s = i;
        for (let e of o.querySelectorAll(".category-button"))
          e.classList.toggle("active", Number(e.getAttribute("data-index")) === i);
        if (((d.textContent = e[i].name), e[i].locked && !Ur))
          return ((t = []), k.setTotal(0), void _(!0));
        _(!1);
        let n = yield Tt(e[i].id);
        a ||
          s !== i ||
          ((t = n.slice().sort((e, t) => dr(e.id) - dr(t.id))),
          k.setTotal(t.length),
          e[i].autoPlayFirst && t.length && f.play(t[0]));
      });
    }
    let S = Rr({
      onUnlock: () => {
        (_(!1), C(s));
      },
      onCancel: () => {
        (_(!1), v(x.node(s)));
      },
    });
    function _(e) {
      ((S.node.hidden = !e),
        (c.hidden = e),
        (f.node.hidden = e),
        e && (f.release(), S.reset(), S.focusFirst()));
    }
    return (
      (S.node.hidden = !0),
      g.addEventListener("focus-enter", (e) => {
        let t = Number(e.target.getAttribute("data-index"));
        isNaN(t) ||
          (e.target.classList.contains("category-button")
            ? (x.scrollTo(t), t !== s && C(t))
            : (k.scrollTo(t), e.target.__item && f.show(e.target.__item)));
      }),
      g.addEventListener("focus-activate", (e) => {
        let n = e.target;
        if (n === l) return (y(!0), p.reset(), void v(p.firstKey()));
        if (n.classList.contains("category-button")) {
          y(!1);
          let e = c.querySelector(".channel-row");
          e && v(e);
        } else
          n.__item &&
            (f.isPreviewing(n.__item)
              ? (f.release(),
                E("player", { channel: n.__item, siblings: t, index: t.indexOf(n.__item) }))
              : f.play(n.__item, n.__item.url));
      }),
      {
        mount(t) {
          (h.appendChild(p.node),
            h.appendChild(S.node),
            t.appendChild(g),
            (function () {
              return n(this, null, function* () {
                if (((e = yield _t()), a)) return;
                (x.setTotal(e.length), w(g, x.node(0)), yield C(0));
                let t = jt();
                t &&
                  (d.textContent =
                    e[0].name + "   ·   " + t.kept.toLocaleString() + " channels  ·  unfiltered");
              });
            })().catch((e) => {
              d.textContent = "Could not load: " + e.message;
            }),
            p.prepare());
        },
        unmount() {
          ((a = !0), f.destroy(), r(g));
        },
        initialFocus: () => o.querySelector(".category-button"),
        onKey(e) {
          if (e === Ln || e === In) {
            let e = m();
            if (e && e.__item) return (Di(e.__item), !0);
          }
          return !1;
        },
      }
    );
  }
  function zr() {
    rn();
    let e = (function (e, t) {
      return (t || document).querySelector(e);
    })("#app");
    e.innerHTML = "";
    let t = dn(),
      r = i("div", { class: "content" });
    function s() {
      let e = I(),
        n = "player" === e;
      ((t.node.style.display = n ? "none" : ""),
        (r.style.left = n ? "0" : ""),
        n || t.setCurrent(e));
    }
    (e.appendChild(t.node),
      e.appendChild(r),
      L(r),
      (window.__router = l),
      T("welcome", ei),
      T("home", ji),
      T("player", rr),
      T("details", ar),
      T("live", Ir),
      T("movies", Nr),
      T("series", Ar),
      T("favorites", Or),
      T("continue", Fr),
      T("search", Dr),
      T("settings", jr),
      T("freetv", Kr),
      document.addEventListener("focus-moved", s),
      document.addEventListener("keydown", (e) => {
        let n = e.keyCode;
        if (q(n)) return void e.preventDefault();
        let i = Dn[n];
        if (i) return (y(i), void e.preventDefault());
        if (Un(n))
          return (
            u && u.dispatchEvent(new CustomEvent("focus-activate", { bubbles: !0 })),
            void e.preventDefault()
          );
        if (jn(n)) {
          if (!M()) {
            v(t.button(I()) || t.button("home"));
          }
          e.preventDefault();
        }
      }),
      "free" === V() || null !== W()
        ? ((function () {
            let e = 0;
            try {
              e = Number(localStorage.getItem(ae)) || 0;
            } catch (e) {}
            if (e && re() - e < 864e5) return !1;
            le();
            try {
              localStorage.setItem(ae, String(re()));
            } catch (e) {}
          })(),
          A("home", {}),
          (pn
            ? Promise.resolve(pn)
            : gn ||
              (gn = n(null, null, function* () {
                let e = yield zt(),
                  t = Object.create(null);
                for (let n of e) {
                  let e;
                  try {
                    e = yield Bt(n.id);
                  } catch (e) {
                    continue;
                  }
                  for (let i of e) {
                    let e = fn(i.name);
                    if (!e) continue;
                    let r = hn(i.name) || hn(n.name);
                    (t[e] || (t[e] = []),
                      t[e].push({
                        id: i.id,
                        name: i.name,
                        logo: i.logo,
                        categoryId: i.categoryId,
                        quality: r ? r.tag : null,
                        rank: r ? r.rank : 2,
                      }));
                  }
                }
                for (let e of Object.keys(t)) t[e].sort((e, t) => e.rank - t.rank);
                return ((gn = null), (pn = t));
              }))
          ).catch(() => {}))
        : A("welcome", {}),
      s());
  }
  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", zr) : zr();
})();
