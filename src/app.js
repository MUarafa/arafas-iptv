import {
  activeRouteName,
  activeRouteParams,
  activeScreen,
  currentRoute,
  goBack,
  navigateRoot,
  pushRoute,
  registerRoute,
  renderRoute,
  replaceRoute,
  routeHistory,
  routeIsBack,
  routeRoot,
  routeTable,
  setRouteRoot,
} from "./router.js";
import {
  c,
  d,
  ensureFocus,
  f,
  focusElement,
  focusInto,
  focusedEl,
  focusedElement,
  g,
  h,
  moveFocus,
  o,
  p,
  s,
} from "./focus.js";
import {
  LANGUAGE_KEY,
  LOCALES,
  MESSAGES,
  applyDocumentLanguage,
  currentLanguage,
  detectLanguage,
  en,
  translate,
  setLanguageCode,
} from "./i18n.js";
import { clearChildren, createElement } from "./dom.js";
import {
  ALPHABET,
  Bn,
  DIGITS,
  DIRECTION_BY_KEY,
  KEYBOARD_LAYOUTS,
  KEY_BACK,
  KEY_BACKSPACE,
  normalizeKey,
  registerTvKeys,
  exitApp,
  KEY_BLUE,
  KEY_CHANNEL_DOWN,
  KEY_CHANNEL_UP,
  KEY_DOWN,
  KEY_ESCAPE,
  KEY_FORWARD,
  KEY_GREEN,
  KEY_RED,
  KEY_LEFT,
  KEY_OK,
  KEY_PAUSE,
  KEY_PLAY,
  KEY_PLAY_PAUSE,
  KEY_REWIND,
  KEY_RIGHT,
  KEY_STOP,
  KEY_UP,
  KEY_YELLOW,
  Vn,
  Wn,
  isBackKey,
  isSelectKey,
} from "./keys.js";
(() => {
  var e = Object.defineProperty,
    t = (t, n) => {
      for (var i in n)
        e(t, i, {
          get: n[i],
          enumerable: !0,
        });
    },
    runAsync = (e, t, n) =>
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
                return {
                  status: "fulfilled",
                  value: e,
                };
              },
              function (e) {
                return {
                  status: "rejected",
                  reason: e,
                };
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
    back: () => goBack,
    canGoBack: () => F,
    current: () => currentRoute,
    go: () => navigateRoot,
    handleKey: () => q,
    init: () => setRouteRoot,
    push: () => pushRoute,
    register: () => registerRoute,
    replace: () => replaceRoute,
    view: () => D,
  });
  function F() {
    return routeHistory.length > 0;
  }
  function q(e) {
    return !(!activeScreen || !activeScreen.onKey) && activeScreen.onKey(e);
  }
  function D() {
    return activeScreen;
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
    allStreams: () => allStreams,
    shortEpg: () => Le,
    vodCategories: () => ve,
    vodStreams: () => Ce,
  });
  var U = {
      url: "",
      username: "",
      password: "",
    },
    CREDENTIALS_KEY = "iptv:credentials",
    SOURCE_KIND_KEY = "iptv:source",
    credentialsCache = null,
    sourceKindCache = null;
  function sourceKind() {
    if (sourceKindCache) return sourceKindCache;
    try {
      sourceKindCache = localStorage.getItem(SOURCE_KIND_KEY) || "xtream";
    } catch (e) {
      sourceKindCache = "xtream";
    }
    return sourceKindCache;
  }
  function readCredentials() {
    if (credentialsCache) return credentialsCache;
    try {
      let e = localStorage.getItem(CREDENTIALS_KEY);
      e && (credentialsCache = JSON.parse(e));
    } catch (e) {
      credentialsCache = null;
    }
    return credentialsCache;
  }
  function requireCredentials() {
    let e = readCredentials();
    if (!e) throw new Error("Not signed in");
    return e;
  }

  // ---------------------------------------------------------------- saved accounts
  var ACCOUNTS_KEY = "iptv:accounts",
    // What belongs to one account rather than to the TV: its progress, favourites, playback
    // marks and what was learned about its provider. Parked under the account's id when it
    // is switched away from, and brought back when it is switched to.
    ACCOUNT_SCOPED_KEYS = [
      "iptv:resume",
      "iptv:favorites",
      "iptv:preferences",
      "iptv:maxConnections",
      "iptv:providerLingers",
      "iptv:history",
    ];
  function accountId(kind, creds) {
    return "free" === kind
      ? "free"
      : kind +
          "|" +
          String((creds && creds.url) || "") +
          "|" +
          String((creds && creds.username) || "");
  }
  function readAccounts() {
    try {
      let a = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
      return Array.isArray(a) ? a.filter((x) => x && x.id) : [];
    } catch (e) {
      return [];
    }
  }
  function writeAccounts(list) {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
    } catch (e) {}
  }
  function currentAccountId() {
    let kind = sourceKind(),
      creds = readCredentials();
    return "free" === kind ? "free" : creds ? accountId(kind, creds) : null;
  }
  /** Remember an account that signed in, most recent first. */
  function rememberAccount(kind, creds) {
    let id = accountId(kind, creds),
      list = readAccounts().filter((a) => a.id !== id);
    (list.unshift({
      id: id,
      kind: kind,
      url: creds ? creds.url : "",
      username: creds ? creds.username : "",
      password: creds ? creds.password : "",
      at: Date.now(),
    }),
      writeAccounts(list.slice(0, 20)));
  }
  /** Park one account's own data under its id and bring another's back (or start empty). */
  function swapAccountData(fromId, toId) {
    try {
      for (let k of ACCOUNT_SCOPED_KEYS) {
        if (fromId) {
          let v = localStorage.getItem(k),
            parked = "iptv:acct:" + fromId + ":" + k;
          null == v ? localStorage.removeItem(parked) : localStorage.setItem(parked, v);
        }
        let saved = toId ? localStorage.getItem("iptv:acct:" + toId + ":" + k) : null;
        null == saved ? localStorage.removeItem(k) : localStorage.setItem(k, saved);
      }
    } catch (e) {}
  }
  // Accounts a local build ships with (secrets/accounts.json, injected into the package by
  // the build scripts and never committed). Seeded once, on a TV with no saved accounts.
  var PRESET_ACCOUNTS = { json: "" };
  function seedPresetAccounts() {
    if (!PRESET_ACCOUNTS.json) return;
    try {
      if (localStorage.getItem(ACCOUNTS_KEY)) return;
      let list = JSON.parse(PRESET_ACCOUNTS.json);
      if (!Array.isArray(list)) return;
      let accts = list
        .filter((a) => a && a.url && a.username)
        .map((a, n) => {
          let creds = {
            url: String(a.url).trim().replace(/\/+$/, ""),
            username: String(a.username).trim(),
            password: String(a.password || "").trim(),
          };
          return Object.assign(
            {
              id: accountId("xtream", creds),
              kind: "xtream",
              label: a.label || "",
              at: Date.now() - n,
            },
            creds,
          );
        });
      if (!accts.length) return;
      writeAccounts(accts);
      // Nothing signed in yet: start on the first one.
      readCredentials() ||
        (localStorage.setItem(SOURCE_KIND_KEY, "xtream"),
        localStorage.setItem(
          CREDENTIALS_KEY,
          JSON.stringify({
            url: accts[0].url,
            username: accts[0].username,
            password: accts[0].password,
          }),
        ),
        (credentialsCache = null),
        (sourceKindCache = null));
    } catch (e) {}
  }
  /** Make a saved account the active one. Everything held in memory belongs to the old
   *  account (lists, caches, the channel index), so the app starts afresh on the new one. */
  function switchAccount(acct) {
    let from = currentAccountId();
    if (!acct || acct.id === from) return !1;
    (from &&
      !readAccounts().some((a) => a.id === from) &&
      rememberAccount(sourceKind(), "free" === from ? null : readCredentials()),
      swapAccountData(from, acct.id));
    try {
      (localStorage.setItem(SOURCE_KIND_KEY, acct.kind),
        "free" === acct.kind
          ? localStorage.removeItem(CREDENTIALS_KEY)
          : localStorage.setItem(
              CREDENTIALS_KEY,
              JSON.stringify({
                url: acct.url,
                username: acct.username,
                password: acct.password,
              }),
            ));
    } catch (e) {}
    return (le(), setTimeout(() => location.reload(), 300), !0);
  }
  var SETTINGS_KEY = "iptv:settings",
    DEFAULT_SETTINGS = {
      preferLowerBitrate: !0,
      liveFormat: "ts",
      showChannelNumbers: !0,
      startupView: "home",
      introSkipSeconds: 90,
      nextEpisodePromptSeconds: 60,
      heroTeaser: !0,
      heroTeaserSound: !0,
      seekThumbnails: !0,
    },
    settingsCache = null;
  function settings() {
    if (settingsCache) return settingsCache;
    settingsCache = Object.assign({}, DEFAULT_SETTINGS);
    try {
      let e = localStorage.getItem(SETTINGS_KEY);
      e && Object.assign(settingsCache, JSON.parse(e));
    } catch (e) {}
    return settingsCache;
  }
  /**
   * The live stream format to ask the portal for. Raw TS starts faster on LG, but Samsung's
   * Tizen video element does not play MPEG-TS at all - those channels load and never start -
   * so Tizen always asks for HLS.
   */
  function liveStreamFormat() {
    return window.tizen ? "m3u8" : settings().liveFormat;
  }
  function saveSettings(e) {
    let t = Object.assign(settings(), e);
    settingsCache = t;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(t));
    } catch (e) {}
    return t;
  }
  var CACHE_PREFIX = "iptv:cache:",
    cacheMemory = new Map(),
    DAY_MS = 864e5,
    SIX_HOURS_MS = 216e5,
    WEEK_MS = 6048e5,
    FIVE_MINUTES_MS = 3e5;
  function now() {
    return Date.now();
  }
  /** An empty list may be a provider hiccup, not an empty catalogue: keep it briefly. */
  function cacheTtl(value, ttl) {
    return Array.isArray(value) && !value.length
      ? Math.min(ttl || FIVE_MINUTES_MS, FIVE_MINUTES_MS)
      : ttl;
  }
  function se(e, t, n) {
    let i,
      r = {
        value: t,
        expires: now() + (n || FIVE_MINUTES_MS),
      };
    cacheMemory.set(e, r);
    try {
      i = JSON.stringify(r);
    } catch (e) {
      return;
    }
    if (!(i.length > 262144))
      try {
        localStorage.setItem(CACHE_PREFIX + e, i);
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
            if (!n || n.slice(0, CACHE_PREFIX.length) !== CACHE_PREFIX) continue;
            let i = 0;
            try {
              i = (JSON.parse(localStorage.getItem(n)) || {}).expires || 0;
            } catch (e) {}
            t.push({
              key: n,
              expires: i,
            });
          }
          t.sort((e, t) => e.expires - t.expires);
          for (let n of t.slice(0, e))
            try {
              localStorage.removeItem(n.key);
            } catch (e) {}
        })(8);
        try {
          localStorage.setItem(CACHE_PREFIX + e, i);
        } catch (e) {}
      }
  }
  var ae = "iptv:lastRefresh";
  function le() {
    cacheMemory.clear();
    let e = [];
    try {
      for (let t = 0; t < localStorage.length; t++) {
        let n = localStorage.key(t);
        n && n.slice(0, CACHE_PREFIX.length) === CACHE_PREFIX && e.push(n);
      }
      for (let t of e) localStorage.removeItem(t);
    } catch (e) {}
  }
  var pendingCacheReads = new Map();
  function cached(e, t, n, i) {
    let r = (function (e) {
      let t,
        n,
        i = cacheMemory.get(e);
      if (i) {
        if (i.expires > now()) return i.value;
        cacheMemory.delete(e);
      }
      try {
        t = localStorage.getItem(CACHE_PREFIX + e);
      } catch (e) {
        return null;
      }
      if (!t) return null;
      try {
        n = JSON.parse(t);
      } catch (t) {
        try {
          localStorage.removeItem(CACHE_PREFIX + e);
        } catch (e) {}
        return null;
      }
      if (!n || n.expires <= now()) {
        try {
          localStorage.removeItem(CACHE_PREFIX + e);
        } catch (e) {}
        return null;
      }
      return (cacheMemory.set(e, n), n.value);
    })(e);
    // A cached value of the wrong shape (an older format, a hand-edited or damaged entry)
    // is as good as missing: fetch it again rather than showing an empty screen for a day.
    if (null != r && (!i || !i.valid || i.valid(r))) return Promise.resolve(r);
    if (pendingCacheReads.has(e)) return pendingCacheReads.get(e);
    let s = n()
      .then(
        (n) => (
          i && i.memoryOnly
            ? (function (e, t, n) {
                cacheMemory.set(e, {
                  value: t,
                  expires: now() + (n || SIX_HOURS_MS),
                });
              })(e, n, cacheTtl(n, t))
            : se(e, n, cacheTtl(n, t)),
          pendingCacheReads.delete(e),
          n
        ),
      )
      .catch((t) => {
        throw (pendingCacheReads.delete(e), t);
      });
    return (pendingCacheReads.set(e, s), s);
  }
  function portalBase() {
    return requireCredentials().url.replace(/\/+$/, "");
  }
  function de() {
    let e = requireCredentials();
    return encodeURIComponent(e.username) + "/" + encodeURIComponent(e.password);
  }
  /** The loading ring: shown while a request the viewer is waiting on - one started within
   *  a second of a key press, click or launch - is still unanswered after 400 ms. Requests
   *  the app makes on its own later (the channel index, background catalogue) do not show it. */
  var loadingCount = 0,
    loadingTimer = null,
    loadingNode = null;
  function trackLoad(p) {
    if (Date.now() - lastInputAt > 1e3) return p;
    loadingCount++;
    loadingTimer ||
      (loadingTimer = setTimeout(() => {
        loadingTimer = null;
        if (!loadingCount) return;
        loadingNode ||
          ((loadingNode = createElement("div", { class: "loading-indicator" })),
          document.body.appendChild(loadingNode));
        loadingNode.classList.add("visible");
      }, 400));
    let done = () => {
      --loadingCount ||
        (loadingTimer && (clearTimeout(loadingTimer), (loadingTimer = null)),
        loadingNode && loadingNode.classList.remove("visible"));
    };
    return p.then(
      (r) => (done(), r),
      (e) => {
        throw (done(), e);
      },
    );
  }
  function playerApi(e, t) {
    return trackLoad(playerApiRequest(e, t));
  }
  function playerApiRequest(e, t) {
    return runAsync(this, null, function* () {
      let n = new AbortController(),
        i = setTimeout(() => n.abort(), 2e4);
      try {
        let r = yield fetch(
          (function (e, t) {
            let n = requireCredentials(),
              i = new URLSearchParams();
            if (
              (i.set("username", n.username),
              i.set("password", n.password),
              e && i.set("action", e),
              t)
            )
              for (let e of Object.keys(t)) void 0 !== t[e] && null !== t[e] && i.set(e, t[e]);
            return portalBase() + "/player_api.php?" + i.toString();
          })(e, t),
          {
            signal: n.signal,
          },
        );
        if (!r.ok) throw new Error("HTTP " + r.status + " for " + (e || "auth"));
        let s = yield r.text();
        try {
          return JSON.parse(s);
        } catch (t) {
          throw new Error(
            /^\s*<(!doctype|html|head|body|script|meta|\?xml)/i.test(s)
              ? "__NOAPI__"
              : "Bad JSON from " + (e || "auth"),
          );
        }
      } finally {
        clearTimeout(i);
      }
    });
  }
  function asArray(e) {
    return Array.isArray(e) ? e : [];
  }
  /**
   * A list the portal must answer with. null, an error object ({user_info:{auth:0}} when
   * the account lapses) or anything else is a failure, not an empty catalogue: it is
   * thrown, so it is never cached as "nothing here" for a day. Some panels send a list as
   * an object keyed by index; that is still a list.
   */
  function expectList(e, action) {
    if (Array.isArray(e)) return e;
    if (e && "object" == typeof e && !e.user_info) {
      let keys = Object.keys(e);
      if (keys.every((k) => /^\d+$/.test(k))) return keys.map((k) => e[k]);
    }
    return badResponse(action);
  }
  /** Like expectList, but a missing or unusable value is simply an empty list. */
  function expectListOrEmpty(e) {
    try {
      return expectList(e, "");
    } catch (err) {
      return [];
    }
  }
  /** fetch that gives up. A host that never answers must not leave a screen "Connecting…"
   *  forever. (No .finally: webOS 4's Chromium 53 does not have it.) */
  function fetchWithTimeout(url, ms) {
    let c = new AbortController(),
      timer = setTimeout(() => c.abort(), ms || 3e4);
    return trackLoad(fetch(url, {
      signal: c.signal,
    })).then(
      (r) => (clearTimeout(timer), r),
      (e) => {
        throw (clearTimeout(timer), e);
      },
    );
  }
  function badResponse(action) {
    throw new Error("Bad response from " + action);
  }
  /** What a failed sign-in means, in words the viewer can act on. */
  function signInErrorText(err) {
    let m = String((err && err.message) || err || "");
    return "Login failed" === m
      ? translate("welcome.wrongLogin")
      : /^Account is/.test(m)
        ? translate("welcome.inactive")
        : m.indexOf("__NOAPI__") >= 0
          ? translate("welcome.notPortal")
          : /^(That URL is not an M3U playlist|That playlist has no channels|Playlist download failed)/.test(
                m,
              )
            ? m
            : (err && "AbortError" === err.name) || /abort|failed to fetch|network/i.test(m)
              ? translate("welcome.noAnswer")
              : translate("welcome.serverError");
  }
  var CONNECTION_LIMIT_KEY = "iptv:maxConnections",
    // How long a released teaser or preview stream may still count against the
    // subscription's connection limit at the provider.
    BACKGROUND_RELEASE_GRACE_MS = 2500,
    // A TV left untouched stops opening teaser streams after this long, so an
    // unattended screen does not sit on a single-connection subscription.
    BACKGROUND_IDLE_MS = 10 * 60e3,
    lastStreamReleaseAt = 0,
    lastBackgroundReleaseAt = 0,
    PROVIDER_LINGERS_KEY = "iptv:providerLingers",
    lastInputAt = Date.now();
  /**
   * May the app open a stream nobody asked to watch (the home hero teaser)?
   *
   * Yes while someone is at the remote. On a single-connection subscription the teaser
   * does take the one slot, so the player waits for it to be handed back before opening
   * the real stream (see the player's start), and teasers stop once the TV is left alone.
   */
  function backgroundStreamAllowed() {
    return Date.now() - lastInputAt < BACKGROUND_IDLE_MS;
  }
  /** A stream the app cut off (a teaser, the previous title, an abandoned attempt). Until
   *  the provider has let go of it, a single-connection account has no free slot. */
  function noteBackgroundRelease() {
    lastBackgroundReleaseAt = lastStreamReleaseAt = Date.now();
  }
  function noteStreamRelease() {
    lastStreamReleaseAt = Date.now();
  }
  /**
   * How long to wait before opening a stream on a single-connection account. Films and
   * episodes always wait out a stream closed a moment ago. Live channels switch at once -
   * unless this provider has shown that it keeps closed streams counted (learned the first
   * time a channel got its notice clip) - but a teaser just stopped is always waited out.
   */
  function streamOpenDelay(live) {
    if (!Kt().singleConnection) return 0;
    let lingers = !1;
    try {
      lingers = "1" === localStorage.getItem(PROVIDER_LINGERS_KEY);
    } catch (e) {}
    let since = live && !lingers ? lastBackgroundReleaseAt : lastStreamReleaseAt;
    return Math.max(0, since + BACKGROUND_RELEASE_GRACE_MS - Date.now());
  }
  function learnProviderLingers() {
    try {
      localStorage.setItem(PROVIDER_LINGERS_KEY, "1");
    } catch (e) {}
  }
  function fe() {
    return runAsync(this, null, function* () {
      let e = yield playerApi(null),
        t = e && e.user_info;
      if (!t || "0" === String(t.auth) || !t.status) throw new Error("Login failed");
      if ("active" !== String(t.status).toLowerCase()) throw new Error("Account is " + t.status);
      // Remember the device limit. The home hero must not open a second stream on a
      // subscription that allows only one, or the next device to press play gets the
      // provider's "restricted" notice instead of the channel.
      try {
        localStorage.setItem(CONNECTION_LIMIT_KEY, String(Number(t.max_connections) || 1));
      } catch (e) {}
      return {
        status: t.status,
        expiresAt: t.exp_date ? 1e3 * Number(t.exp_date) : null,
        maxConnections: Number(t.max_connections) || 1,
        activeConnections: Number(t.active_cons) || 0,
        allowedFormats: asArray(t.allowed_output_formats),
        trial: "1" === String(t.is_trial),
      };
    });
  }
  function pe(e, t) {
    return cached(
      "cats:" + e,
      DAY_MS,
      () =>
        runAsync(null, null, function* () {
          return expectList(yield playerApi(t), t).map((t) => ({
            id: String(t.category_id),
            name: String(t.category_name || "").trim() || "Category " + t.category_id,
            kind: e,
          }));
        }),
      {
        valid: Array.isArray,
      },
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
    return cached(
      "live:" + e,
      SIX_HOURS_MS,
      () =>
        runAsync(null, null, function* () {
          return expectList(
            yield playerApi("get_live_streams", {
              category_id: e,
            }),
            "get_live_streams",
          ).map(be);
        }),
      {
        memoryOnly: !0,
        valid: Array.isArray,
      },
    );
  }
  function Ce(e) {
    return cached(
      "vod:" + e,
      SIX_HOURS_MS,
      () =>
        runAsync(null, null, function* () {
          return expectList(
            yield playerApi("get_vod_streams", {
              category_id: e,
            }),
            "get_vod_streams",
          ).map(we);
        }),
      {
        memoryOnly: !0,
        valid: Array.isArray,
      },
    );
  }
  function Se(e) {
    return cached(
      "series:" + e,
      SIX_HOURS_MS,
      () =>
        runAsync(null, null, function* () {
          return expectList(
            yield playerApi("get_series", {
              category_id: e,
            }),
            "get_series",
          ).map(xe);
        }),
      {
        memoryOnly: !0,
        valid: Array.isArray,
      },
    );
  }
  /** Every channel, film or series in one request (no category_id): what search needs. */
  function allStreams(kind) {
    let action = { live: "get_live_streams", vod: "get_vod_streams", series: "get_series" }[kind],
      map = { live: be, vod: we, series: xe }[kind];
    return runAsync(null, null, function* () {
      return expectList(yield playerApi(action, {}), action).map(map);
    });
  }
  function _e(e) {
    return cached("movieinfo:" + e, WEEK_MS, () =>
      runAsync(null, null, function* () {
        let t = yield playerApi("get_vod_info", {
            vod_id: e,
          }),
          n = t && (t.info || t.movie_data) ? t.info || {} : badResponse("get_vod_info"),
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
          backdrops: asArray(n.backdrop_path),
          youtubeTrailer: n.youtube_trailer || null,
          ext: i.container_extension || "mp4",
          streamId: String(i.stream_id || e),
        };
      }),
    );
  }
  function Te(e) {
    return cached(
      "seriesinfo:" + e,
      WEEK_MS,
      () =>
        runAsync(null, null, function* () {
          let t = yield playerApi("get_series_info", {
              series_id: e,
            }),
            n = t && (t.info || t.episodes) ? t.info || {} : badResponse("get_series_info"),
            i = (t && t.episodes) || {},
            r = Object.keys(i)
              .sort((e, t) => Number(e) - Number(t))
              .map((e) => ({
                number: Number(e),
                episodes: expectListOrEmpty(i[e]).map((t) => ({
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
            backdrops: asArray(n.backdrop_path),
            seasons: r,
          };
        }),
      {
        memoryOnly: !0,
      },
    );
  }
  function Le(e, t) {
    return cached(
      "epg:" + e,
      FIVE_MINUTES_MS,
      () =>
        runAsync(null, null, function* () {
          let n = yield playerApi("get_short_epg", {
            stream_id: e,
            limit: t || 4,
          });
          return asArray(n && n.epg_listings).map((e) => ({
            title: Ie(e.title),
            description: Ie(e.description),
            start: e.start ? new Date(e.start.replace(" ", "T")).getTime() : null,
            end: e.end ? new Date(e.end.replace(" ", "T")).getTime() : null,
            nowPlaying: "1" === String(e.now_playing),
          }));
        }),
      {
        memoryOnly: !0,
      },
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
    return portalBase() + "/live/" + de() + "/" + e + "." + (t || "ts");
  }
  function Ae(e, t) {
    return portalBase() + "/movie/" + de() + "/" + e + "." + (t || "mp4");
  }
  function Ee(e, t) {
    return portalBase() + "/series/" + de() + "/" + e + "." + (t || "mp4");
  }
  var Oe = {};
  t(Oe, {
    authenticate: () => Ye,
    build: () => loadM3uPlaylist,
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
    {
      name: "United Kingdom",
      re: /\b(uk|gb|british|britain|england)\b/i,
    },
    {
      name: "United States",
      re: /\b(us|usa|united states|american)\b/i,
    },
    {
      name: "Egypt",
      re: /\b(eg|egy|egypt)\b|مصر/i,
    },
    {
      name: "Saudi Arabia",
      re: /\b(sa|ksa|saudi)\b|السعودية/i,
    },
    {
      name: "United Arab Emirates",
      re: /\b(ae|uae|emirates)\b|الامارات/i,
    },
    {
      name: "Qatar",
      re: /\b(qa|qatar)\b|قطر/i,
    },
    {
      name: "Kuwait",
      re: /\b(kw|kuwait)\b|الكويت/i,
    },
    {
      name: "Lebanon",
      re: /\b(lb|lebanon)\b|لبنان/i,
    },
    {
      name: "Morocco",
      re: /\b(ma|morocco)\b|المغرب/i,
    },
    {
      name: "Turkey",
      re: /\b(tr|turkey|turkish)\b/i,
    },
    {
      name: "France",
      re: /\b(fr|france|french)\b/i,
    },
    {
      name: "Germany",
      re: /\b(de|germany|german)\b/i,
    },
    {
      name: "Spain",
      re: /\b(es|spain|spanish)\b/i,
    },
    {
      name: "Italy",
      re: /\b(it|italy|italian)\b/i,
    },
    {
      name: "India",
      re: /\b(in|india|indian)\b/i,
    },
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
          (r = {
            name: n,
            logo: e["tvg-logo"] || null,
            group: i || je(n) || "Uncategorised",
          }));
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
  function loadM3uPlaylist() {
    return Pe
      ? Promise.resolve(Pe)
      : Me ||
          (Me = runAsync(null, null, function* () {
            let e = requireCredentials(),
              t = yield fetchWithTimeout(e.url, 3e4);
            if (!t.ok) throw new Error("Playlist download failed (HTTP " + t.status + ")");
            let n = yield t.text();
            if (-1 === n.indexOf("#EXTM3U") && -1 === n.indexOf("#EXTINF"))
              throw new Error("That URL is not an M3U playlist");
            return ((Pe = Ue(n)), (Me = null), Pe);
          }).catch((e) => {
            // A failed download must not be handed out again for the rest of the session.
            throw ((Me = null), e);
          }));
  }
  function Ke() {
    return runAsync(this, null, function* () {
      return (yield loadM3uPlaylist()).categories;
    });
  }
  function ze(e) {
    return runAsync(this, null, function* () {
      return (yield loadM3uPlaylist()).items[e] || [];
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
    return runAsync(this, null, function* () {
      let e = yield loadM3uPlaylist();
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
    ADULT_CATEGORY_ID: () => ADULT_CATEGORY_KEY,
    KEEP_ADULT_SHELF: () => hideAdultChannels,
    authenticate: () => Dt,
    build: () => loadFreePlaylist,
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
  function matchesCategory(e, t) {
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
  function firstMatchIndex(e, t) {
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
        match: (e) => matchesCategory(e, "sports"),
        rank: (e) => firstMatchIndex(e.name, ut),
      },
      {
        id: "featured:best-movies",
        name: "⭐  Best Movie Channels",
        match: (e) => ot.test(e.name) || matchesCategory(e, "movies"),
        rank: (e) => (ot.test(e.name) ? 0 : 1),
      },
      {
        id: "featured:quran",
        name: "⭐  قرآن",
        match: (e) => ct.test(e.name),
        rank: (e) => firstMatchIndex(e.name, dt),
        autoPlayFirst: !0,
      },
      {
        id: "featured:egypt",
        name: "⭐  مصر",
        match: (e) => "EG" === e.country || ht.test(e.name),
        rank: (e) => firstMatchIndex(e.name, mt),
      },
      {
        id: "featured:arab-sports",
        name: "⭐  Arab Sports",
        match: (e) => at(e) && matchesCategory(e, "sports"),
        rank: (e) => firstMatchIndex(e.name, ut),
      },
      {
        id: "featured:arab-news",
        name: "⭐  Arab News",
        match: (e) => at(e) && matchesCategory(e, "news"),
      },
      {
        id: "featured:arab-entertainment",
        name: "⭐  Arab Entertainment",
        match: (e) =>
          at(e) &&
          (matchesCategory(e, "entertainment") ||
            matchesCategory(e, "series") ||
            matchesCategory(e, "movies")),
      },
      {
        id: "featured:world-news",
        name: "⭐  World News",
        match: (e) =>
          /\b(bbc|cnn|sky news|euronews|france 24|dw|al jazeera|aljazeera|rt|trt)\b/i.test(e.name),
      },
      {
        id: "featured:kids",
        name: "⭐  Kids",
        match: (e) => matchesCategory(e, "kids") || matchesCategory(e, "animation"),
      },
      {
        id: "featured:documentary",
        name: "⭐  Documentary",
        match: (e) => matchesCategory(e, "documentary"),
      },
      {
        id: "featured:music",
        name: "⭐  Music",
        match: (e) => matchesCategory(e, "music"),
      },
    ],
    freePlaylistCache = null,
    freePlaylistPromise = null,
    hideAdultChannels = !0,
    ADULT_CATEGORY_KEY = "adult:x";
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
    return runAsync(this, null, function* () {
      let t = yield fetchWithTimeout("https://iptv-org.github.io/api/" + e + ".json", 3e4);
      if (!t.ok) throw new Error("free playlist: " + e + " HTTP " + t.status);
      return t.json();
    });
  }
  function loadFreePlaylist() {
    return freePlaylistCache
      ? Promise.resolve(freePlaylistCache)
      : freePlaylistPromise ||
          (freePlaylistPromise = runAsync(null, null, function* () {
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
                (u++, hideAdultChannels && o.push(d));
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
                  l[e.id].push(
                    e.rank
                      ? Object.assign({}, d, {
                          __rank: e.rank(n),
                        })
                      : d,
                  ));
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
              (m.push({
                id: t,
                name: (r[e] || e) + "  (" + a[e].length + ")",
                kind: "live",
              }),
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
              hideAdultChannels &&
                o.length &&
                (m.push({
                  id: ADULT_CATEGORY_KEY,
                  name: "🔒  X  (" + o.length + ")",
                  kind: "live",
                  locked: !0,
                }),
                (h[ADULT_CATEGORY_KEY] = o)),
              (freePlaylistPromise = null),
              (freePlaylistCache = {
                categories: m,
                items: h,
                kept: c,
                dropped: u,
              })
            );
          }).catch((e) => {
            throw ((freePlaylistPromise = null), e);
          }));
  }
  function _t() {
    return runAsync(this, null, function* () {
      return (yield loadFreePlaylist()).categories;
    });
  }
  function Tt(e) {
    return runAsync(this, null, function* () {
      return (yield loadFreePlaylist()).items[e] || [];
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
    return runAsync(this, null, function* () {
      let e = yield loadFreePlaylist();
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
    return freePlaylistCache
      ? {
          kept: freePlaylistCache.kept,
          dropped: freePlaylistCache.dropped,
        }
      : null;
  }
  var Ut = {
    xtream: j,
    m3u: Oe,
    free: tt,
  };
  function activeAdapter() {
    return Ut[sourceKind()] || j;
  }
  function Kt() {
    let e = sourceKind();
    return {
      type: e,
      hasVod: "xtream" === e,
      hasSeries: "xtream" === e,
      singleConnection: "xtream" === e,
    };
  }
  function liveCategories() {
    return activeAdapter().liveCategories();
  }
  function liveStreams(e) {
    return activeAdapter().liveStreams(e);
  }
  function vodCategories() {
    return activeAdapter().vodCategories();
  }
  function vodStreams(e) {
    return activeAdapter().vodStreams(e);
  }
  function seriesCategories() {
    return activeAdapter().seriesCategories();
  }
  function Ht(e) {
    return activeAdapter().seriesList(e);
  }
  function Xt(e) {
    return activeAdapter().movieInfo(e);
  }
  function Gt(e, t, n) {
    return activeAdapter().liveUrl(e, t, n);
  }
  function Zt(e, t) {
    return activeAdapter().movieUrl(e, t);
  }
  var SVG_NS = "http://www.w3.org/2000/svg",
    gradientSeq = 0;
  function on(e) {
    let t = "brand-grad-" + ++gradientSeq,
      n = document.createElementNS(SVG_NS, "svg");
    (n.setAttribute("viewBox", "0 0 100 100"),
      n.setAttribute("width", String(e || 44)),
      n.setAttribute("height", String(e || 44)),
      n.setAttribute("class", "logo-mark"),
      n.setAttribute("aria-hidden", "true"));
    let i = document.createElementNS(SVG_NS, "defs"),
      r = document.createElementNS(SVG_NS, "linearGradient");
    (r.setAttribute("id", t),
      r.setAttribute("x1", "0"),
      r.setAttribute("y1", "0"),
      r.setAttribute("x2", "0"),
      r.setAttribute("y2", "1"));
    let s = document.createElementNS(SVG_NS, "stop");
    (s.setAttribute("offset", "0"), s.setAttribute("stop-color", "#ff4d4d"));
    let a = document.createElementNS(SVG_NS, "stop");
    (a.setAttribute("offset", "1"),
      a.setAttribute("stop-color", "#c40810"),
      r.appendChild(s),
      r.appendChild(a),
      i.appendChild(r),
      n.appendChild(i));
    let l = document.createElementNS(SVG_NS, "path");
    (l.setAttribute("d", "M50 6 L94 90 L70 90 L50 52 L30 90 L6 90 Z"),
      l.setAttribute("fill", "url(#" + t + ")"),
      n.appendChild(l));
    let o = document.createElementNS(SVG_NS, "path");
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
  // Menu icons in the logo's language: the red gradient carries the shape, a white
  // detail (often the logo's own play triangle) carries the meaning. Drawn here rather
  // than taken from a font, because the TV's fonts lack most symbol glyphs and showed
  // empty boxes. Each icon owns its gradient id, so none depends on another's defs.
  var RAIL_STROKE =
      ' fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke=',
    RAIL_WHITE = ' fill="#ffffff"',
    RAIL_WHITE_LINE = ' fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width=',
    RAIL_ICON_BODIES = {
      continue:
        '<path d="M20 12a8 8 0 1 1-2.34-5.66"%R/><path d="M20 3.8v4.7h-4.7"%R/>' +
        '<path d="M10 8.6v6.8l5.4-3.4z"' +
        RAIL_WHITE +
        "/>",
      history:
        '<circle cx="12" cy="12" r="8.6"%R/><path d="M12 7v5.2l3.4 2"' +
        RAIL_WHITE_LINE +
        '"2.2"/>',
      favorites:
        '<path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17.02l-5.38 2.83 1.03-6L3.3 9.6l6-.9z"%R/>' +
        '<circle cx="12" cy="12.3" r="1.9"' +
        RAIL_WHITE +
        "/>",
      search:
        '<circle cx="10.5" cy="10.5" r="6.5"%R/>' +
        '<path d="M15.6 15.6L20.8 20.8"' +
        RAIL_WHITE_LINE +
        '"2.6"/>',
      home:
        '<path d="M3.5 11L12 3.5l8.5 7.5v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"%R/>' +
        '<path d="M10.2 12.4v5.6l4.6-2.8z"' +
        RAIL_WHITE +
        "/>",
      live:
        '<rect x="2.5" y="7" width="19" height="13" rx="2.2"%R/><path d="M8 2.8l4 4 4-4"%R/>' +
        '<circle cx="12" cy="13.5" r="2.5"' +
        RAIL_WHITE +
        "/>",
      movies:
        '<rect x="3" y="10" width="18" height="10.5" rx="1.6"%R/>' +
        '<path d="M3 10L20.3 6.7 19.6 3.2 2.4 6.5z"%R/>' +
        '<path d="M7.4 5.6l2.2 3.2M12.8 4.6l2.2 3.2"' +
        RAIL_WHITE_LINE +
        '"1.7"/>' +
        '<path d="M10.4 12.6v5.3l4.3-2.65z"' +
        RAIL_WHITE +
        "/>",
      series:
        '<rect x="2.5" y="8" width="15.5" height="12" rx="2"%R/>' +
        '<path d="M6.5 4.5h13a2 2 0 0 1 2 2v9.5"%R/>' +
        '<path d="M8.4 11v6l4.9-3z"' +
        RAIL_WHITE +
        "/>",
      settings:
        '<circle cx="12" cy="12" r="6"%R/>' +
        '<path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1"%R/>' +
        '<circle cx="12" cy="12" r="2.4"' +
        RAIL_WHITE +
        "/>",
      freetv:
        '<circle cx="12" cy="12" r="9"%R/>' +
        '<path d="M3.4 12h17.2M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"' +
        RAIL_WHITE_LINE +
        '"1.6"/>',
      account:
        '<circle cx="12" cy="8.2" r="4.2"%R/><path d="M4 20.8c.9-4.1 4-6.6 8-6.6s7.1 2.5 8 6.6"%R/>' +
        '<path d="M10.7 6.6v3.2l2.8-1.6z"' +
        RAIL_WHITE +
        "/>",
    };
  function railIconSvg(id) {
    let grad = "rail-grad-" + id;
    return (
      '<svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">' +
      '<defs><linearGradient id="' +
      grad +
      '" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22">' +
      '<stop offset="0" stop-color="#ff4d4d"/><stop offset="1" stop-color="#c40810"/>' +
      "</linearGradient></defs>" +
      RAIL_ICON_BODIES[id].split("%R").join(RAIL_STROKE + '"url(#' + grad + ')"') +
      "</svg>"
    );
  }
  var NAV_ITEMS = [
    {
      id: "continue",
      key: "nav.continue",
    },
    {
      id: "history",
      key: "nav.history",
    },
    {
      id: "favorites",
      key: "nav.favorites",
    },
    {
      id: "search",
      key: "nav.search",
    },
    {
      id: "home",
      key: "nav.home",
    },
    {
      id: "live",
      key: "nav.live",
      needs: "live",
    },
    {
      id: "movies",
      key: "nav.movies",
      needs: "vod",
    },
    {
      id: "series",
      key: "nav.series",
      needs: "series",
    },
    {
      id: "settings",
      key: "nav.settings",
    },
    {
      id: "freetv",
      key: "nav.freetv",
      personalOnly: !0,
    },
    // Sign in, or switch account, at any time - not only on the first screen, which a
    // viewer can skip and then had no way back to.
    {
      id: "account",
      key: "nav.account",
    },
  ];
  function dn() {
    let e = createElement("nav", {
        class: "rail",
        "data-focus-memory": "rail",
        "data-focus-contain": "vertical",
      }),
      t = createElement("div", {
        class: "rail-brand",
      }),
      n = createElement("span", {
        class: "rail-brand-mark",
      });
    n.appendChild(on(44));
    let r = createElement("span", {
      class: "rail-brand-full",
    });
    (r.appendChild(un(44)), t.appendChild(n), t.appendChild(r), e.appendChild(t));
    let s = {};
    for (let t of NAV_ITEMS) {
      (t.personalOnly, 0);
      let n = createElement(
        "div",
        {
          class: "rail-item focusable" + ("freetv" === t.id ? " rail-item-last" : ""),
          "data-route": t.id,
        },
        [
          createElement("span", {
            class: "rail-icon",
            html: railIconSvg(t.id),
          }),
          createElement("span", {
            class: "rail-label",
            text: translate(t.key),
          }),
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
          // This handler stops the event before the global one, so it applies the same
          // echo guard itself: an echoed Right must not step again inside the content.
          var at = Date.now();
          if (39 === lastDirKey && at - lastDirAt < 50) return;
          ((lastDirKey = 39), (lastDirAt = at), (lastInputAt = at));
          var o = r.getAttribute("data-route");
          o !== currentRoute() && navigateRoot(o, {});
          var k = 0;
          !(function f() {
            // The viewer moved on while the section was loading: do not pull focus away.
            if (focusedElement() !== r) return;
            var a = document.querySelectorAll(".focusable");
            for (var q = 0; q < a.length; q++)
              if (!e.contains(a[q]) && null !== a[q].offsetParent)
                return (e.classList.remove("expanded"), void focusElement(a[q]));
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
        n !== currentRoute() && navigateRoot(n, {});
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
    {
      rank: 0,
      tag: "4K",
      re: /(^|[\s\[\(_-])(4k|uhd|2160p?)([\s\]\)_-]|$)/i,
    },
    {
      rank: 1,
      tag: "FHD",
      re: /(^|[\s\[\(_-])(fhd|1080p?)([\s\]\)_-]|$)/i,
    },
    {
      rank: 2,
      tag: "HD",
      re: /(^|[\s\[\(_-])(hd|720p?)([\s\]\)_-]|$)/i,
    },
    {
      rank: 3,
      tag: "SD",
      re: /(^|[\s\[\(_-])(sd|480p?|420p?|low)([\s\]\)_-]|$)/i,
    },
  ];
  function qualityTagFor(e) {
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
  var channelsByName = null,
    gn = null;
  function channelSources(e) {
    let t = {
      id: e.id,
      name: e.name,
      logo: e.logo,
      categoryId: e.categoryId,
      quality: (qualityTagFor(e.name) || {}).tag || null,
      rank: null != (qualityTagFor(e.name) || {}).rank ? qualityTagFor(e.name).rank : 2,
    };
    if (!channelsByName) return [t];
    let n = channelsByName[fn(e.name)];
    if (!n || n.length <= 1) return [t];
    let i = n.filter((t) => t.id !== e.id);
    return [t].concat(i);
  }
  function Jn(e) {
    let t = e || {},
      n = t.onChange || function () {},
      s = t.onSubmit || null,
      a = t.language || "ar",
      l = !1,
      o = null,
      u = createElement("div", {
        class: "kb-suggestions",
        hidden: "hidden",
      }),
      c = createElement("div", {
        class: "kb-languages",
      }),
      d = createElement("div", {
        class: "kb-keys",
      }),
      m = createElement("div", {
        class: "kb-actions",
      }),
      h = createElement(
        "div",
        {
          class: "keyboard",
          "data-focus-memory": "keyboard",
        },
        [u, c, d, m],
      ),
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
      // The chips are about to be rebuilt: if one had focus, keep focus at the same place.
      let fe = focusedElement(),
        had = !!fe && u.contains(fe),
        at = had ? Array.prototype.indexOf.call(u.children, fe) : -1;
      if ((clearChildren(u), t.length)) {
        for (let e of t.slice(0, 6)) {
          let t = "string" == typeof e ? e : e.text,
            n = createElement("div", {
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
      had &&
        focusElement(
          u.children[Math.min(at, u.children.length - 1)] || d.querySelector(".kb-key"),
          {
            exact: !0,
          },
        );
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
      (o &&
        o.dispatchEvent(
          new Event("input", {
            bubbles: !0,
          }),
        ),
        p(),
        n(o ? o.value : ""));
    }
    function x(e, t, n, r) {
      let s = createElement("div", {
        class: "kb-key focusable" + (t ? " " + t : "") + (r ? " kb-key-wide" : ""),
        text: e,
      });
      return ((s.__press = n), s);
    }
    function k() {
      clearChildren(c);
      let e = Object.keys(l ? Vn : KEYBOARD_LAYOUTS);
      for (let t of e) {
        let e = createElement("div", {
          class: "kb-lang focusable" + (t === a ? " active" : ""),
          text: Vn[t].label,
        });
        ((e.__press = () => {
          // The language buttons are rebuilt: keep focus on the one just chosen.
          ((a = t),
            k(),
            C(),
            focusElement(c.querySelector(".kb-lang.active") || c.firstChild, { exact: !0 }));
        }),
          c.appendChild(e));
      }
      if (!l) {
        let e = createElement("div", {
          class: "kb-lang kb-lang-more focusable",
          text: "More…",
        });
        ((e.__press = () => {
          // Land on the first of the languages that just appeared, where "More…" was.
          ((l = !0),
            k(),
            focusElement(c.children[Object.keys(KEYBOARD_LAYOUTS).length] || c.firstChild, {
              exact: !0,
            }));
        }),
          c.appendChild(e));
      }
    }
    function C() {
      clearChildren(d);
      let e = Vn[a],
        t = e.columns,
        n = "calc((100% - " + 10 * (t - 1) + "px) / " + t + ")";
      e.keys
        .map((e) => x(e, null, () => g(e)))
        .concat(DIGITS.map((e) => x(e, "kb-key-digit", () => g(e))))
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
      clearChildren(m),
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
          focusElement(d.querySelector(".kb-key"));
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
  /** The input the TV's own keyboard is typing into (one made editable for it), or null. */
  function nativeTypingInput() {
    let a = document.activeElement;
    return a && "INPUT" === a.tagName && !a.readOnly ? a : null;
  }
  /** "host:port" is enough: a provider's address without a scheme is plain http. */
  function withScheme(url) {
    let s = String(url || "").trim();
    return !s || /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : "http://" + s;
  }
  /** The full link a provider sends ("http://host:port/get.php?username=…&password=…",
   *  or ".../player_api.php?…", or ".../live/user/pass/1.ts") holds all three fields. */
  function splitXtreamLink(text) {
    let s = withScheme(text),
      m = /^([a-z]+:\/\/[^\/?#\s]+)(\/[^?#]*)?(\?[^#]*)?/i.exec(s);
    if (!m) return null;
    let q = m[3] || "",
      get = (k) => {
        let r = new RegExp("[?&]" + k + "=([^&]*)", "i").exec(q);
        if (!r) return "";
        try {
          return decodeURIComponent(r[1].replace(/\+/g, " "));
        } catch (e) {
          return r[1];
        }
      },
      user = get("username"),
      pass = get("password");
    if (!user || !pass) {
      let p = /^\/(?:live|movie|series)\/([^\/]+)\/([^\/]+)\//i.exec(m[2] || "");
      p && ((user = decodeURIComponent(p[1])), (pass = decodeURIComponent(p[2])));
    }
    return user && pass ? { url: m[1], username: user, password: pass } : null;
  }
  var $n = ["@gmail.com", "@hotmail.com", "@yahoo.com", "@outlook.com", "@icloud.com"];
  var Qn = ["http://", "https://", ".com", ".net", ".tv", ":8080", ":80", ":2052"];
  var Yn = [
    {
      id: "xtream",
      icon: "⌂",
      titleKey: "welcome.xtream",
      detailKey: "welcome.xtreamDetail",
    },
    {
      id: "m3u",
      icon: "≡",
      titleKey: "welcome.m3u",
      detailKey: "welcome.m3uDetail",
    },
    {
      id: "free",
      icon: "★",
      titleKey: "welcome.free",
      detailKey: "welcome.freeDetail",
    },
  ];
  function ei(opts) {
    // "Add account" opens this empty; otherwise it starts from the account in use.
    let e = (!(opts && opts.fresh) && readCredentials()) || U,
      t = !1,
      s = null,
      a = createElement("div", {
        class: "login-error",
      }),
      l = createElement("div", {
        class: "welcome-options",
        "data-focus-memory": "welcome",
      });
    for (let e of Yn) {
      let t = createElement(
        "div",
        {
          class: "welcome-option focusable",
        },
        [
          createElement("span", {
            class: "welcome-option-icon",
            text: e.icon,
          }),
          createElement(
            "div",
            {
              class: "welcome-option-text",
            },
            [
              createElement("div", {
                class: "welcome-option-title",
                text: translate(e.titleKey),
              }),
              createElement("div", {
                class: "welcome-option-detail",
                text: translate(e.detailKey),
              }),
            ],
          ),
        ],
      );
      ((t.__option = e), l.appendChild(t));
    }
    function o(e, t) {
      return createElement(
        "div",
        {
          class: "field",
        },
        [
          createElement("label", {
            class: "field-label",
            text: e,
          }),
          t,
        ],
      );
    }
    let u = createElement("input", {
        class: "field-input focusable",
        type: "text",
        readonly: "readonly",
        value: e.url || "",
        placeholder: "http://server:port",
      }),
      c = createElement("input", {
        class: "field-input focusable",
        type: "text",
        readonly: "readonly",
        value: e.username || "",
      }),
      d = createElement("input", {
        class: "field-input focusable",
        type: "password",
        readonly: "readonly",
        value: e.password || "",
      }),
      m = createElement("input", {
        class: "field-input focusable",
        type: "text",
        readonly: "readonly",
        placeholder: "http://example.com/playlist.m3u",
      }),
      h = createElement("div", {
        class: "button primary focusable",
        text: translate("welcome.signIn"),
      }),
      f = createElement("div", {
        class: "button focusable",
        text: translate("welcome.back"),
      }),
      p = createElement(
        "div",
        {
          class: "welcome-actions",
        },
        [h, f],
      ),
      g = Jn({
        language: "en",
        suggest: (e) =>
          y === c
            ? (function (e) {
                let t = String(e || "").trim();
                return t
                  ? -1 !== t.indexOf("@")
                    ? []
                    : $n.map((e) => ({
                        text: t + e,
                        label: e,
                      }))
                  : [];
              })(e)
            : y === u || y === m
              ? (function (e) {
                  let t = String(e || "");
                  if (!t)
                    return Qn.slice(0, 2).map((e) => ({
                      text: e,
                      label: e,
                    }));
                  let n = [];
                  for (let e of Qn.slice(2))
                    t.slice(-e.length) !== e &&
                      n.push({
                        text: t + e,
                        label: e,
                      });
                  return n;
                })(e)
              : [],
      }),
      y = null,
      b = createElement(
        "div",
        {
          class: "welcome-keyboard",
          hidden: "hidden",
        },
        [g.node],
      ),
      w = createElement(
        "div",
        {
          class: "welcome-form",
          hidden: "hidden",
        },
        [
          createElement("h2", {
            class: "welcome-form-title",
            text: "Xtream account",
          }),
          o(translate("welcome.serverUrl"), u),
          o(translate("welcome.username"), c),
          o(translate("welcome.password"), d),
        ],
      ),
      x = createElement(
        "div",
        {
          class: "welcome-form",
          hidden: "hidden",
        },
        [
          createElement("h2", {
            class: "welcome-form-title",
            text: "M3U playlist",
          }),
          o(translate("welcome.playlistUrl"), m),
        ],
      ),
      k = createElement("div", {
        class: "login-brand",
      }),
      typeHint = createElement("p", {
        class: "login-type-hint",
        hidden: "hidden",
        text: translate("welcome.typeHint").replace(
          "{app}",
          window.tizen ? "SmartThings" : "LG ThinQ",
        ),
      });
    k.appendChild(un(72));
    // OK on a field hands it to the TV's own keyboard: voice, a Magic Remote pointer, or the
    // phone (LG ThinQ / SmartThings type straight into it). The keys below stay for remotes
    // that have none of that.
    function typeNatively(inp) {
      inp.readOnly = !1;
      inp.focus();
      try {
        inp.setSelectionRange(inp.value.length, inp.value.length);
      } catch (e) {}
    }
    function doneTyping(inp) {
      if (inp.readOnly) return;
      ((inp.readOnly = !0), inp.blur());
      let link = inp === u ? splitXtreamLink(u.value) : null;
      link && ((u.value = link.url), (c.value = link.username), (d.value = link.password));
      (g.setTarget(inp), focusElement(inp, { exact: !0 }));
    }
    for (let inp of [u, c, d, m]) {
      inp.addEventListener("blur", () => doneTyping(inp));
      inp.addEventListener("keydown", (e) => {
        let n = normalizeKey(e.keyCode);
        // Enter, Back/Escape and the Tizen IME's Done (65376) / Cancel (65385) end typing.
        (13 === n || 461 === n || 27 === n || 65376 === n || 65385 === n) &&
          (e.preventDefault(), e.stopPropagation(), doneTyping(inp));
      });
    }
    // webOS says when its keyboard is put away (its own Back or Done).
    document.addEventListener("keyboardStateChange", (e) => {
      let a = nativeTypingInput();
      e && e.detail && !e.detail.visibility && a && S.contains(a) && doneTyping(a);
    });
    let C = createElement(
        "div",
        {
          class: "login-panel welcome-panel",
        },
        [
          k,
          createElement("p", {
            class: "login-hint",
            text: translate("welcome.question"),
          }),
          l,
          w,
          x,
          typeHint,
          p,
          a,
          b,
        ],
      ),
      S = createElement(
        "div",
        {
          class: "login",
        },
        [C],
      );
    // The form with its keyboard is taller than the screen: slide the panel so the focused
    // field or key stays in view.
    let panelShift = 0;
    C.addEventListener("focus-enter", (e) => {
      let r = e.target.getBoundingClientRect(),
        next = panelShift + (r.top < 40 ? 40 - r.top : r.bottom > 1040 ? 1040 - r.bottom : 0);
      next !== panelShift && ((panelShift = next), (C.style.transform = "translate3d(0," + next + "px,0)"));
    });
    function _() {
      ((panelShift = 0), (C.style.transform = ""), (s = null),
        (a.textContent = ""),
        (l.hidden = !1),
        (w.hidden = !0),
        (x.hidden = !0),
        (typeHint.hidden = !0),
        (p.hidden = !0),
        (b.hidden = !0),
        focusElement(l.querySelector(".welcome-option")));
    }
    function T(e, i, r) {
      return runAsync(this, null, function* () {
        if (!t) {
          ((t = !0), (a.textContent = ""), (h.textContent = r || translate("welcome.connecting")));
          // Try the account in memory first. It is written to storage only once the portal
          // has accepted it, so a failed sign-in never leaves the TV signed in to nothing.
          let prevKind = sourceKind(),
            prevCredentials = readCredentials();
          ((sourceKindCache = e),
            i &&
              (credentialsCache = {
                url: String(i.url || "")
                  .trim()
                  .replace(/\/+$/, ""),
                username: String(i.username || "").trim(),
                password: String(i.password || "").trim(),
              }),
            et && et());
          try {
            yield activeAdapter().authenticate();
            // Signed in: remember the account and give it its own progress and favourites,
            // parking the previous account's. A different account starts the app afresh.
            let prevId =
                "free" === prevKind
                  ? "free"
                  : prevCredentials
                    ? accountId(prevKind, prevCredentials)
                    : null,
              newId = accountId(e, "free" === e ? null : credentialsCache);
            (prevId &&
              prevId !== newId &&
              !readAccounts().some((a) => a.id === prevId) &&
              rememberAccount(prevKind, "free" === prevKind ? null : prevCredentials),
              prevId !== newId && swapAccountData(prevId, newId));
            try {
              (localStorage.setItem(SOURCE_KIND_KEY, e),
                i && localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentialsCache)));
            } catch (e) {}
            rememberAccount(e, "free" === e ? null : credentialsCache);
            prevId && prevId !== newId
              ? (le(), setTimeout(() => location.reload(), 300))
              : navigateRoot("home", {});
          } catch (e) {
            ((sourceKindCache = prevKind),
              (credentialsCache = prevCredentials),
              (t = !1),
              (h.textContent = translate("welcome.signIn")),
              (a.textContent = signInErrorText(e)));
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
            ? T("free", null, translate("welcome.loadingChannels"))
            : (function (e) {
                ((s = e),
                  (a.textContent = ""),
                  (l.hidden = !0),
                  (w.hidden = "xtream" !== e),
                  (x.hidden = "m3u" !== e),
                  (typeHint.hidden = !1),
                  (p.hidden = !1),
                  (b.hidden = !1),
                  (h.textContent = translate("welcome.signIn")));
                let t = "xtream" === e ? u : m;
                (g.setTarget(t), focusElement(t));
              })(e);
        } else
          e.target === h
            ? (function () {
                if ("xtream" === s) {
                  let link = splitXtreamLink(u.value);
                  link && ((u.value = link.url), (c.value = link.username), (d.value = link.password));
                  let e = withScheme(u.value),
                    t = c.value.trim(),
                    n = d.value.trim();
                  return e && t && n
                    ? void T("xtream", {
                        url: e,
                        username: t,
                        password: n,
                      })
                    : void (a.textContent = translate("welcome.fillAll"));
                }
                if ("m3u" === s) {
                  let e = withScheme(m.value);
                  if (!e) return void (a.textContent = translate("welcome.enterPlaylist"));
                  T("m3u", {
                    url: e,
                    username: "",
                    password: "",
                  });
                }
              })()
            : e.target === f
              ? _()
              : "INPUT" === e.target.tagName && (g.setTarget(e.target), typeNatively(e.target));
      }),
      {
        mount(e) {
          (e.appendChild(S), _());
        },
        unmount() {
          clearChildren(S);
        },
        initialFocus: () => l.querySelector(".welcome-option"),
        onKey: (e) => !(!isBackKey(e) || !s) && (_(), !0),
      }
    );
  }
  function createPage(e) {
    let t = e || {},
      n = createElement("div", {
        class: "page",
      }),
      r = 0;
    return (
      t.title &&
        n.appendChild(
          createElement(
            "div",
            {
              class: "page-header",
            },
            [
              createElement("h1", {
                class: "page-title",
                dir: "auto",
                text: t.title,
              }),
              t.subtitle
                ? createElement("p", {
                    class: "page-subtitle",
                    dir: "auto",
                    text: t.subtitle,
                  })
                : null,
            ],
          ),
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
            {
              root: null,
              rootMargin: "200px 600px",
              threshold: 0.01,
            },
          ))
        ).observe(e)
      : si(e);
  }
  var li = "iptv:resume",
    oi = null;
  function channelHealth() {
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
    let i = channelHealth(),
      r = di(e.kind, e.id);
    if (n > 0 && t / n >= 0.93) return (delete i[r], void ci());
    // A short position only clears the entry when there is nothing further along to
    // lose. A resume that failed to start reports 0, and dropping the title from
    // Continue Watching then is exactly the wrong answer.
    if (t < 60) {
      if (i[r] && i[r].position >= 60) return;
      return (delete i[r], void ci());
    }
    ((function (e, t) {
      if (!e) return;
      let n = channelHealth();
      for (let i of Object.keys(n)) {
        let r = n[i];
        (!r || (r.seriesId === e && r.id !== t)) && delete n[i];
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
      s.sort((e, t) => ((i[e] && i[e].updatedAt) || 0) - ((i[t] && i[t].updatedAt) || 0));
      for (let e of s.slice(0, s.length - 100)) delete i[e];
    }
    ci();
  }
  function progressFor(e, t) {
    return channelHealth()[di(e, t)] || null;
  }
  // Watch history, the way YouTube keeps it: everything that actually played - films,
  // episodes and channels, finished or not - newest first, one entry per title (watching
  // it again moves it to the top). Separate from Continue Watching, which forgets a title
  // once it is finished.
  var HISTORY_KEY = "iptv:history",
    HISTORY_LIMIT = 300,
    historyCache = null;
  function watchHistory() {
    if (historyCache) return historyCache;
    historyCache = [];
    try {
      let list = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      Array.isArray(list) && (historyCache = list.filter((x) => x && x.kind && x.id));
    } catch (e) {}
    return historyCache;
  }
  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(watchHistory()));
    } catch (e) {}
  }
  /** Note that `item` played (moving it to the top), or update where it got to. */
  function recordHistory(item, position, duration, moveToTop) {
    let list = watchHistory(),
      at = list.findIndex((x) => x.kind === item.kind && String(x.id) === String(item.id)),
      old = at >= 0 ? list[at] : null;
    if (!old && !moveToTop) return;
    let entry = Object.assign({}, old || {}, item, {
      watchedAt: moveToTop || !old ? Date.now() : old.watchedAt,
    });
    (null != position && position > 0 && (entry.position = Math.floor(position)),
      duration > 0 && (entry.duration = Math.floor(duration)));
    (at >= 0 && list.splice(at, 1),
      moveToTop || !old ? list.unshift(entry) : list.splice(at, 0, entry),
      list.length > HISTORY_LIMIT && (list.length = HISTORY_LIMIT),
      saveHistory());
  }
  function removeFromHistory(kind, id) {
    ((historyCache = watchHistory().filter(
      (x) => !(x.kind === kind && String(x.id) === String(id)),
    )),
      saveHistory());
  }
  function clearHistory() {
    ((historyCache = []), saveHistory());
  }
  function fi(e) {
    let t = channelHealth(),
      n = Object.keys(t)
        .map((e) => t[e])
        .filter((e) => e && e.kind && e.id)
        .sort((e, t) => (Number(t.updatedAt) || 0) - (Number(e.updatedAt) || 0)),
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
    let r = createElement("div", {
      class: "poster " + (n || ""),
      "data-src": e || "",
      "data-title": t || "",
    });
    return (ai(r), r);
  }
  function vi(e, t) {
    let n = t || {},
      r = createElement("div", {
        class: "card card-poster focusable",
        "data-kind": e.kind,
        "data-id": e.id,
      }),
      s = gi(e.poster, e.name, "poster-2x3");
    r.appendChild(s);
    let a = n.resume || progressFor(e.kind, e.id);
    return (
      a &&
        s.appendChild(
          (function (e) {
            return createElement(
              "div",
              {
                class: "card-progress",
              },
              [
                createElement("div", {
                  class: "card-progress-fill",
                  style: "width:" + Math.round(100 * e) + "%",
                }),
              ],
            );
          })(pi(a)),
        ),
      e.rating &&
        s.appendChild(
          createElement("div", {
            class: "card-rating",
            text: e.rating.toFixed(1),
          }),
        ),
      r.appendChild(
        createElement("div", {
          class: "card-label",
          dir: "auto",
          text: e.name,
        }),
      ),
      (r.__item = e),
      r
    );
  }
  function yi(e, t) {
    let n = t || {},
      r = createElement("div", {
        class: "card card-channel focusable",
        "data-kind": "live",
        "data-id": e.id,
      }),
      s = gi(e.logo, e.name, "poster-16x9 poster-contain");
    return (
      r.appendChild(s),
      n.showNumber &&
        null != e.number &&
        s.appendChild(
          createElement("div", {
            class: "card-number",
            text: String(e.number),
          }),
        ),
      r.appendChild(
        createElement("div", {
          class: "card-label",
          dir: "auto",
          text: e.name,
        }),
      ),
      (r.__item = e),
      r
    );
  }
  function bi(e, t) {
    let n = t || {},
      r = createElement("div", {
        class: "channel-row focusable",
        "data-kind": "live",
        "data-id": e.id,
      });
    n.showNumber &&
      null != e.number &&
      r.appendChild(
        createElement("span", {
          class: "channel-row-number",
          text: String(e.number),
        }),
      );
    let s = gi(e.logo, "", "channel-row-logo poster-contain");
    return (
      r.appendChild(s),
      r.appendChild(
        createElement("span", {
          class: "channel-row-name",
          dir: "auto",
          text: e.name,
        }),
      ),
      n.favorite &&
        r.appendChild(
          createElement("span", {
            class: "channel-row-fav",
            text: "★",
          }),
        ),
      (r.__item = e),
      r
    );
  }
  function wi(e, t) {
    let n = createElement("div", {
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
            "channel" === this.variant
              ? {
                  width: 300,
                  gap: 24,
                }
              : {
                  width: 200,
                  gap: 24,
                }),
          (this.rendered = new Map()),
          (this.offset = 0),
          (this.focusedIndex = 0),
          (this.node = this.build()));
      }
      build() {
        let e = createElement("div", {
          class: "row row-" + this.variant,
          "data-focus-memory": this.key,
        });
        (this.title &&
          e.appendChild(
            createElement("h2", {
              class: "row-title",
              dir: "auto",
              text: this.title,
            }),
          ),
          (this.viewport = createElement("div", {
            class: "row-viewport",
          })),
          (this.track = createElement("div", {
            class: "row-track",
          })));
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
          let n =
            "channel" === this.variant
              ? yi(t, {
                  showNumber: this.showNumber,
                })
              : vi(t);
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
        ((this.items = e || []),
          (this.offset = 0),
          this.rendered.clear(),
          clearChildren(this.track));
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
  var Ti = [/box office/i, /2026/i, /2025/i, /imdb/i, /pure movies/i];
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
      a = createElement("div", {
        class: "hero-blur",
      }),
      l = createElement("div", {
        class: "hero-backdrop",
      }),
      o = createElement("div", {
        class: "hero-backdrop",
      }),
      u = l,
      c = createElement("h1", {
        class: "hero-title",
        dir: "auto",
      }),
      d = createElement("div", {
        class: "hero-meta",
      }),
      m = createElement("p", {
        class: "hero-plot",
        dir: "auto",
      }),
      h = createElement("div", {
        class: "hero-dots",
      }),
      f = createElement("div", {
        class: "hero-button primary focusable",
        text: "▶  " + translate("home.play"),
      }),
      p = createElement("div", {
        class: "hero-button focusable",
        text: translate("home.moreInfo"),
      }),
      g = createElement(
        "div",
        {
          class: "hero-body",
        },
        [
          createElement("div", {
            class: "hero-kicker",
            text: translate("home.spotlight"),
          }),
          c,
          d,
          m,
          createElement(
            "div",
            {
              class: "hero-actions",
            },
            [f, p],
          ),
          h,
        ],
      ),
      v = createElement("video", {
        class: "hero-video",
      });
    (v.setAttribute("playsinline", ""), (v.preload = "auto"), (v.muted = !1 === e.teaserSound));
    let y = createElement(
        "div",
        {
          class: "hero page-block",
          "data-focus-memory": "hero",
        },
        [
          a,
          l,
          o,
          v,
          createElement("div", {
            class: "hero-scrim",
          }),
          g,
        ],
      ),
      b = [],
      w = 0,
      x = null,
      k = null,
      C = null,
      S = !1,
      _ = !1,
      // Teasers that failed in a row. Two means the provider will not preview right now:
      // show artwork instead of opening stream after stream.
      teaserFailures = 0;
    function T() {
      h.innerHTML = "";
      for (let e = 0; e < b.length; e++)
        h.appendChild(
          createElement("span", {
            class: "hero-dot" + (e === w ? " active" : ""),
          }),
        );
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
      v.getAttribute("src") && noteBackgroundRelease();
      try {
        (v.pause(), v.removeAttribute("src"), v.load());
      } catch (e) {}
    }
    function N() {
      teaserFailures = 0;
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
          }, 3e4)));
    }
    // Rotate the artwork while no teaser plays. Once someone is back at the remote and
    // the spotlight still has focus, hand over to the teaser again.
    function R() {
      x ||
        b.length < 2 ||
        (x = setInterval(() => {
          if (S) return;
          if (s && _ && teaserFailures < 2 && backgroundStreamAllowed())
            return (clearInterval(x), (x = null), void A());
          L((w + 1) % b.length);
        }, 8e3));
    }
    function A() {
      let e = b[w];
      if (!(e && e.streamUrl && s && _)) return;
      if (!backgroundStreamAllowed()) return void (I(), R());
      // Already opening this very title (loading reports "ready" twice): let it run.
      if (v.getAttribute("src") === e.streamUrl && !v.paused) return;
      I();
      let wait = Kt().singleConnection
        ? lastStreamReleaseAt + BACKGROUND_RELEASE_GRACE_MS - Date.now()
        : 0;
      if (wait > 0) return void (C = setTimeout(A, wait));
      ((v.__seeked = !1), (v.src = e.streamUrl));
      let t = v.play();
      // A muted retry when the TV refuses to autoplay with sound.
      (t &&
        t.catch &&
        t.catch(() => {
          if (v.muted) return;
          v.muted = !0;
          let again = v.play();
          again && again.catch && again.catch(() => {});
        }),
        // IPTV files often take 8-12 s to start: 7 s skipped every title before it began.
        (C = setTimeout(() => {
          E();
        }, 15e3)));
    }
    function E() {
      S || !b.length || (L((w + 1) % b.length), s && _ && A());
    }
    function O() {
      // The first title can preview as soon as it is ready. Waiting for the whole list meant
      // a slow portal (one info request per title, up to eight) showed a still spotlight
      // for a minute or more; later titles join the rotation as they arrive.
      if (s && _) return void A();
      b.length < 2 || R();
    }
    function P(e) {
      return new Promise((t) => {
        let n = new Image();
        ((n.onload = () =>
          t({
            ok: !0,
            wide: n.naturalWidth / n.naturalHeight >= 1.4,
          })),
          (n.onerror = () =>
            t({
              ok: !1,
              wide: !1,
            })),
          (n.src = e));
      });
    }
    function M() {
      return runAsync(this, null, function* () {
        let e = yield vodCategories(),
          t = [];
        for (let n of Ti) {
          for (let i of e) n.test(i.name) && t.push(i);
          if (t.length >= 4) break;
        }
        !t.length && e.length && t.push(e[0]);
        let n = [];
        for (let e of t.slice(0, 4))
          try {
            n = n.concat(yield vodStreams(e.id));
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
      // After the jump to 30 %, some TVs (webOS) never fire a second "playing": the preview
      // then played behind the artwork, unseen. Show it as soon as the jump has landed.
      v.addEventListener("seeked", () => {
        v.__seeked && !v.paused && !y.classList.contains("hero-playing") && N();
      }),
      v.addEventListener("timeupdate", () => {
        v.__seeked &&
          !v.paused &&
          v.currentTime > 0 &&
          !y.classList.contains("hero-playing") &&
          N();
      }),
      v.addEventListener("error", () => {
        if (!v.getAttribute("src")) return;
        ++teaserFailures < 2 ? E() : (I(), R());
      }),
      {
        node: y,
        load: function () {
          return runAsync(this, null, function* () {
            let e = yield M();
            return !S && (e.length ? (O(), !0) : (y.classList.add("hero-artless"), !1));
          });
        },
        playButton: f,
        setFocused: function (e) {
          _ !== e &&
            ((_ = e),
            s &&
              (_ ? ((teaserFailures = 0), x && (clearInterval(x), (x = null)), A()) : (I(), R())));
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
  function isFavourite(e) {
    let t = Pi(e);
    return Ei().some((e) => Pi(e) === t);
  }
  function qi(e) {
    let t = Ei(),
      n = Pi(e),
      i = t.findIndex((e) => Pi(e) === n);
    return -1 !== i && (t.splice(i, 1), Oi(), !0);
  }
  function toggleFavourite(e) {
    return isFavourite(e)
      ? (qi(e), !1)
      : ((function (e) {
          let t = Ei();
          !isFavourite(e) &&
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
  // Home is kept while the viewer is on a page opened from it: Back returns to it as it
  // was, instead of rebuilding every row and asking the portal for all of them again.
  var keptHome = null;
  function homeRoute(p) {
    if (routeIsBack && keptHome) return keptHome;
    keptHome && keptHome.destroy();
    return (keptHome = ji(p));
  }
  function ji() {
    let e = createPage({}),
      t = !1,
      i = null,
      s = [],
      built = !1,
      lastFocus = null;
    function a(t) {
      let n = xi(t);
      return (s.push(n), e.add(n.node), n);
    }
    function l(e) {
      "live" === e.kind
        ? pushRoute("player", {
            channel: e,
          })
        : "movie" === e.kind
          ? pushRoute("details", {
              kind: "movie",
              id: e.id,
              item: e,
            })
          : "series" === e.kind &&
            pushRoute("details", {
              kind: "series",
              id: e.id,
              item: e,
            });
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
            {
              // The rows live inside .content, which clips them; with the viewport as root
              // the margin never applied and a row only loaded once it was on screen - so
              // Down onto it did nothing. Rooted at .content, rows load ahead of focus.
              root: document.querySelector(".content"),
              rootMargin: "1200px 0px",
              threshold: 0.01,
            },
          )),
        o.observe(e.node));
    }
    return {
      mount(r) {
        if (built) return void r.appendChild(e.node);
        built = !0;
        (r.appendChild(e.node),
          e.node.addEventListener("focus-enter", (e) => {
            i && i.setFocused(i.node.contains(e.target));
          }),
          (i = Ii({
            teaser: settings().heroTeaser,
            teaserSound: settings().heroTeaserSound,
            onPlay: (e) =>
              pushRoute("player", {
                item: {
                  kind: "movie",
                  id: e.id,
                  name: e.name,
                  poster: e.poster,
                  ext: e.ext,
                },
              }),
            onInfo: (e) =>
              pushRoute("details", {
                kind: "movie",
                id: e.id,
                item: e,
              }),
          })),
          e.add(i.node),
          (function loadHero() {
            i &&
              i
                .load()
                .then((ok) => ok && i && i.node.classList.remove("hero-artless"))
                .catch(() => {
                  // The line may be down at boot: try again rather than stay blank.
                  i &&
                    (i.node.classList.add("hero-artless"),
                    t || setTimeout(() => t || loadHero(), 15e3));
                });
          })(),
          (function () {
            let e = fi(20);
            e.length &&
              a({
                key: "home-continue",
                title: translate("home.continue"),
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
                  let t = progressFor(e.kind, e.id);
                  pushRoute("player", {
                    item: e,
                    // An episode needs its series, or its progress loses the series and
                    // its end lands on a "series" page named after the episode.
                    seriesId: (t && t.seriesId) || null,
                    seriesName: (t && t.seriesName) || null,
                    season: (t && t.season) || null,
                    episodeNumber: (t && t.episodeNumber) || null,
                    resumeAt: t ? t.position : 0,
                  });
                },
              });
          })(),
          (function () {
            let e = Mi();
            e.length &&
              a({
                key: "home-favorites",
                title: translate("home.favorites"),
                items: e,
                onSelect: l,
              });
          })(),
          (function loadRows(only) {
            runAsync(this, null, function* () {
              let failed = [],
                i = [
                  {
                    kind: "live",
                    categories: liveCategories,
                    streams: liveStreams,
                    variant: "channel",
                  },
                  {
                    kind: "movie",
                    categories: vodCategories,
                    streams: vodStreams,
                    variant: "poster",
                  },
                  {
                    kind: "series",
                    categories: seriesCategories,
                    streams: Ht,
                    variant: "poster",
                  },
                ],
                r = 3;
              for (let s of i) {
                if (t) return;
                if (only && only.indexOf(s.kind) < 0) continue;
                let i;
                try {
                  i = yield s.categories();
                } catch (e) {
                  failed.push(s.kind);
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
                      runAsync(null, null, function* () {
                        try {
                          let n = yield s.streams(o.id);
                          if (t) return;
                          if (!n.length) return void i.node.classList.add("row-empty");
                          (i.setItems(n), focusInto(e.node, i.firstCard()));
                        } catch (e) {
                          i.node.classList.add("row-empty");
                        }
                      });
                  r > 0 ? (r--, yield c()) : u(i, c);
                }
              }
              // A kind whose categories could not load (the line is down, the portal
              // hiccuped) is fetched again shortly, so Home fills in once it is back.
              failed.length &&
                !t &&
                (showToast(translate("details.offline")),
                setTimeout(() => t || loadRows(failed), 1e4));
            });
          })(),
          // Build the search index once Home has settled, so Search answers at once
          // instead of saying "Preparing…" while the whole catalogue downloads.
          setTimeout(() => t || wr().catch(() => {}), 15e3));
      },
      // Leaving Home only sets it aside (see homeRoute); destroy() is the real teardown.
      unmount() {
        let f = focusedElement();
        lastFocus = f && e.node.contains(f) ? f : null;
        i && i.setFocused(!1);
      },
      destroy() {
        ((t = !0),
          i && (i.stop(), (i = null)),
          o && (o.disconnect(), (o = null)),
          clearChildren(e.node));
      },
      initialFocus: () =>
        (lastFocus && e.node.contains(lastFocus) && lastFocus) ||
        e.node.querySelector(".hero-button") ||
        e.node.querySelector(".card") ||
        null,
      onKey: () => !1,
    };
  }
  var toastEl = null,
    toastTimer = null;
  function showToast(e, t) {
    (toastEl ||
      ((toastEl = createElement("div", {
        class: "toast",
      })),
      document.body.appendChild(toastEl)),
      (toastEl.textContent = e),
      toastEl.classList.add("visible"),
      toastTimer && clearTimeout(toastTimer),
      (toastTimer = setTimeout(() => {
        (toastEl.classList.remove("visible"), (toastTimer = null));
      }, t || 2600)));
  }
  var zi = "iptv:preferences",
    playbackPrefsCache = null;
  function playbackPrefs() {
    if (playbackPrefsCache) return playbackPrefsCache;
    playbackPrefsCache = {
      intro: {},
      fit: {},
    };
    try {
      let e = localStorage.getItem(zi);
      if (e) {
        let t = JSON.parse(e);
        t &&
          "object" == typeof t &&
          ((playbackPrefsCache.intro = t.intro || {}), (playbackPrefsCache.fit = t.fit || {}));
      }
    } catch (e) {}
    return playbackPrefsCache;
  }
  function Wi() {
    try {
      localStorage.setItem(zi, JSON.stringify(playbackPrefsCache));
    } catch (e) {}
  }
  function Ji(e) {
    return String(e || "");
  }
  function Hi(e, t) {
    if (!e || t < 15 || t > 420) return;
    let n = playbackPrefs(),
      i = Ji(e),
      r = n.intro[i] ? n.intro[i].slice() : [];
    (r.push(Math.round(t)), r.length > 5 && r.shift(), (n.intro[i] = r), Wi());
  }
  function Xi(e) {
    if (!e) return null;
    let t = playbackPrefs().intro[Ji(e)];
    if (!t || !t.length) return null;
    let n = t.slice().sort((e, t) => e - t);
    return n[Math.floor(n.length / 2)];
  }
  var Gi = ["fit", "fill", "stretch"];
  function Zi(e) {
    return translate("player." + e);
  }
  function $i(e, t) {
    return e + ":" + t;
  }
  function Qi(e, t) {
    return playbackPrefs().fit[$i(e, t)] || "fit";
  }
  function Yi(e, t) {
    let n = Qi(e, t);
    return (function (e, t, n) {
      let i = playbackPrefs();
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
  /** Every episode of a series in watching order, across seasons (empty seasons skipped). */
  function allEpisodes(info) {
    let list = [];
    for (let season of (info && info.seasons) || []) list.push.apply(list, season.episodes || []);
    return list;
  }
  function episodeLabel(ep) {
    return "S" + ep.season + "E" + ep.episodeNumber + (ep.title ? " · " + ep.title : "");
  }
  /** The player's route params for one episode of a series. */
  function episodeRoute(ep, episodes, series, resumeAt) {
    return {
      item: {
        kind: "episode",
        id: ep.id,
        name: (series.name || "") + " · S" + ep.season + "E" + ep.episodeNumber,
        poster: ep.still || series.poster || null,
        ext: ep.ext,
      },
      episodes: episodes,
      episodeIndex: episodes.indexOf(ep),
      allSeasons: !0,
      seriesId: series.id,
      seriesName: series.name || "",
      season: ep.season,
      episodeNumber: ep.episodeNumber,
      resumeAt: resumeAt || 0,
    };
  }
  // Accelerating scrubbing: a tap moves 10 s; holding the key speeds up the longer it is
  // held, so a long jump takes a couple of seconds of holding, not dozens of presses.
  function seekStep(heldMs, duration) {
    let step = heldMs < 1e3 ? 10 : heldMs < 2e3 ? 30 : heldMs < 3e3 ? 60 : 120;
    // A short file does not need 2-minute jumps.
    return duration > 0 ? Math.max(10, Math.min(step, Math.round(duration / 40))) : step;
  }
  /** Seek thumbnails need a second connection to the file; only with a plan that has one. */
  function seekPreviewAllowed() {
    if (!settings().seekThumbnails) return !1;
    if (!Kt().singleConnection) return !0;
    try {
      return Number(localStorage.getItem(CONNECTION_LIMIT_KEY)) >= 2;
    } catch (e) {
      return !1;
    }
  }
  function rr(e) {
    let t = e.channel || e.item,
      n = "live" === t.kind,
      s = createElement("video", {
        class: "player-video",
      });
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
            (this.onWaiting = () =>
              this.emit("buffering", {
                source: this.current,
              })),
            (this.onEnded = () =>
              this.emit("ended", {
                source: this.current,
              })),
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
          (this.startTimer && (clearTimeout(this.startTimer), (this.startTimer = null)),
            this.gateTimer && (clearTimeout(this.gateTimer), (this.gateTimer = null)),
            this.releaseMedia());
          // On a single-connection subscription the provider still counts a stream that was
          // just closed. Opening now gets its "restricted" clip instead of the title, so wait
          // out the hand-back first.
          // Switching source inside the same title (failover, stall, quality promotion) always
          // waits: the stream just cut off is still counted, whatever the channel-zap policy.
          let wait = this.switching
            ? streamOpenDelay(!1)
            : this.options.gate
              ? streamOpenDelay("live" === this.options.gate)
              : 0;
          this.switching = !1;
          if (wait > 0)
            return (
              this.emit("waiting-for-slot", {
                source: e,
                wait: wait,
              }),
              void (this.gateTimer = setTimeout(() => {
                ((this.gateTimer = null), this.stopped || this.openCurrent());
              }, wait))
            );
          ((this.current = e),
            this.attempted.add(e.id),
            (this.started = !1),
            (this.lastTime = 0),
            (this.lastAdvance = Date.now()),
            this.releaseMedia());
          let t = this.urlFor(e);
          (this.emit("loading", {
            source: e,
            url: t,
          }),
            (this.video.src = t));
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
            this.applyResume();
            (this.emit("playing", {
              source: this.current,
            }),
              this.schedulePromotion());
          }
        }
        startWatchdog() {
          (this.watchdog && clearInterval(this.watchdog),
            (this.watchdog = setInterval(() => {
              if (this.stopped || this.video.paused) return;
              // Some files only report a duration after they start playing; the resume
              // seek waits for it rather than being dropped and starting from zero.
              (this.started && this.applyResume(), this.checkResume());
              let e = Date.now(),
                t = this.video.currentTime;
              if (t > this.lastTime + 0.15)
                return (
                  e - (this.lastProgressAt || 0) > 1500 && (this.advanceSince = e),
                  (this.lastProgressAt = e),
                  (this.lastTime = t),
                  (this.lastAdvance = e),
                  // Only sustained playback clears the recovery ladder: the jump to the resume
                  // point after a reload is one "advance", not a recovery, or reloads never end.
                  e - this.advanceSince >= 5e3 && (this.recoveryStep = 0),
                  this.wasStalled &&
                    ((this.wasStalled = !1),
                    this.emit("recovered", {
                      source: this.current,
                    })),
                  void this.emit("progress", {
                    position: t,
                    source: this.current,
                  })
                );
              this.started && e - this.lastAdvance > 3500 && this.handleStall();
            }, 500)));
        }
        /** Jump to where the viewer left off, once the file knows its length. A place at or
         *  past the end (the provider now serves a shorter file, or its notice clip) is not
         *  sought into - that would "finish" the title - and is reported instead. */
        applyResume() {
          let r = this.options.resumeAt,
            d = this.video.duration;
          if (!(r > 0) || !isFinite(d) || !(d > 0)) return;
          if (((this.options.resumeAt = 0), r >= d - 1))
            return void this.emit("resume-failed", {
              target: r,
            });
          try {
            this.video.currentTime = r;
          } catch (e) {}
          ((this.resumeTarget = r), (this.resumeCheckAt = Date.now() + 3e3));
        }
        /** Some files ignore a seek and play from the start. Say so, so the screen does not
         *  save that start over the viewer's real place. */
        checkResume() {
          if (!this.resumeTarget || Date.now() < this.resumeCheckAt) return;
          let r = this.resumeTarget;
          ((this.resumeTarget = 0),
            this.video.currentTime < r - 10 &&
              this.emit("resume-failed", {
                target: r,
              }));
        }
        handleStall() {
          ((this.lastAdvance = Date.now()),
            (this.wasStalled = !0),
            this.emit("stalled", {
              source: this.current,
            }));
          let e = this.nextSource({
            degrade: !0,
          });
          if (e)
            return (
              this.emit("quality-change", {
                from: this.current,
                to: e,
                reason: "stall",
              }),
              (this.sourceIndex = this.sources.indexOf(e)),
              (this.switching = !0),
              void this.openCurrent()
            );
          this.recover();
        }
        recover() {
          let e = er[this.recoveryStep];
          if ((this.recoveryStep++, !e))
            return void this.emit("buffering", {
              source: this.current,
              terminal: !0,
            });
          let t = this.video.currentTime;
          if (
            (this.emit("recovering", {
              source: this.current,
              step: e,
              position: t,
            }),
            "nudge" !== e)
          ) {
            if ("seek" !== e)
              ((this.options.resumeAt = t),
                this.attempted.delete(this.current.id),
                this.openCurrent());
            else {
              // The nudge itself is not progress: without this the watchdog counts the
              // half second as playback, resets the recovery steps, and never reloads.
              this.lastTime = t + 0.5;
              try {
                this.video.currentTime = t + 0.5;
              } catch (e) {}
              let e = this.video.play();
              e && e.catch && e.catch(() => {});
            }
          } else {
            let e = this.video.play();
            e && e.catch && e.catch(() => {});
          }
        }
        handleFailure(e) {
          if (this.stopped) return;
          let t = this.current,
            n = this.nextSource({});
          if (!n) return this.exhausted();
          (this.emit("source-failed", {
            source: t,
            reason: e,
            next: n,
          }),
            (this.sourceIndex = this.sources.indexOf(n)),
            (this.switching = !0),
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
                  (this.emit("quality-change", {
                    from: this.current,
                    to: e,
                    reason: "promote",
                  }),
                  this.attempted.delete(e.id),
                  (this.sourceIndex = this.sources.indexOf(e)),
                  (this.switching = !0),
                  this.openCurrent());
              }, 9e4)));
        }
        exhausted() {
          (this.emit("exhausted", {
            attempted: this.attempted.size,
          }),
            this.stop());
        }
        togglePause() {
          // No stream loaded (waiting for the connection, or stopped): there is nothing to
          // resume, and play() would only reject.
          let p = this.video.paused
            ? this.video.getAttribute("src")
              ? this.video.play()
              : null
            : this.video.pause();
          return (
            p && p.catch && p.catch(() => {}),
            this.emit("paused-changed", {
              paused: this.video.paused,
            }),
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
          return (
            this.emit("seeked", {
              position: t,
              duration: this.video.duration,
            }),
            !0
          );
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
          // Any stream closed here - cut off, cut short, or failed - may still be counted
          // by the provider for a moment. (A live stream the provider ended itself
          // reconnects without waiting; see the player's "ended".)
          this.video.getAttribute("src") && noteStreamRelease();
          try {
            (this.video.pause(), this.video.removeAttribute("src"), this.video.load());
          } catch (e) {}
        }
        stopTimers() {
          (this.startTimer && (clearTimeout(this.startTimer), (this.startTimer = null)),
            this.gateTimer && (clearTimeout(this.gateTimer), (this.gateTimer = null)),
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
      g = createElement("div", {
        class: "osd-title",
        dir: "auto",
        text: t.name,
      }),
      y = createElement("div", {
        class: "osd-subtitle",
      }),
      b = createElement("div", {
        class: "osd-quality",
      }),
      w = createElement("div", {
        class: "osd-bar-fill",
      }),
      x = createElement("div", {
        class: "osd-bar-knob",
      }),
      k = createElement(
        "div",
        {
          // Focusable (Up from the buttons): Left/Right on the bar seek.
          class: "osd-bar focusable",
        },
        [w, x],
      ),
      C = createElement("span", {
        class: "osd-time",
        text: "--:--",
      }),
      S = createElement("span", {
        class: "osd-time osd-time-total",
        text: "--:--",
      }),
      _ = createElement("div", {
        class: "osd-button focusable",
        text: "❚❚",
      }),
      T = createElement("div", {
        class: "osd-button focusable",
        text: "★",
      }),
      L = createElement("div", {
        class: "osd-button osd-button-wide focusable",
        text: translate("player.quality"),
      }),
      I = e.episodes || null,
      N = null == e.episodeIndex ? -1 : e.episodeIndex,
      A = !!(I && N >= 0 && N < I.length - 1),
      E = createElement("div", {
        class: "osd-button osd-button-wide focusable",
        text: translate("player.skipIntro"),
      }),
      prevEp = createElement("div", {
        class: "osd-button osd-button-wide focusable",
        text: "⏮  " + translate("player.prevEpisode"),
      }),
      O = createElement("div", {
        class: "osd-button osd-button-wide focusable",
        text: translate("player.nextEpisode") + "  ⏭",
      }),
      epBtn = createElement("div", {
        class: "osd-button osd-button-wide focusable",
        text: "☰  " + translate("player.episodes"),
      }),
      epList = createElement("div", {
        class: "episodes-panel-list",
      }),
      epPanel = createElement(
        "div",
        {
          class: "quality-panel episodes-panel",
          hidden: "hidden",
          "data-focus-memory": "player-episodes",
          "data-focus-contain": "vertical",
        },
        [
          createElement("div", {
            class: "quality-title",
            dir: "auto",
            text: e.seriesName || translate("player.episodes"),
          }),
          epList,
        ],
      ),
      thumbVideo = null,
      thumbTimer = null,
      thumbImg = createElement("div", {
        class: "osd-thumb-frame",
      }),
      thumbTime = createElement("div", {
        class: "osd-thumb-time",
        text: "",
      }),
      thumb = createElement(
        "div",
        {
          class: "osd-thumb",
          hidden: "hidden",
        },
        [thumbImg, thumbTime],
      ),
      F = createElement("div", {
        class: "osd-button osd-button-wide focusable",
        text: translate("player.fit"),
      }),
      q = createElement(
        "div",
        {
          class: "osd-controls",
          "data-focus-memory": "osd",
        },
        [_, T, n ? null : E, n ? null : prevEp, n ? null : O, n ? null : epBtn, F, L],
      ),
      D = createElement(
        "div",
        {
          class: "credits-prompt",
          hidden: "hidden",
        },
        [
          createElement("div", {
            class: "credits-label",
            text: translate("player.upNext"),
          }),
          createElement("div", {
            class: "credits-title",
            dir: "auto",
            text: "",
          }),
          createElement("div", {
            class: "button primary focusable credits-play",
            text: "▶  " + translate("player.playNext"),
          }),
        ],
      ),
      j = D.querySelector(".credits-title"),
      U = D.querySelector(".credits-play"),
      R = createElement(
        "div",
        {
          class: "osd-progress",
        },
        [C, k, S],
      ),
      __thumbBar = k.appendChild(thumb),
      K = createElement(
        "div",
        {
          class: "osd",
        },
        [
          createElement("div", {
            class: "osd-gradient",
          }),
          createElement(
            "div",
            {
              class: "osd-body",
            },
            [g, y, b, n ? null : R, q],
          ),
        ],
      ),
      z = createElement("div", {
        class: "player-message",
      }),
      busyRing = createElement("div", {
        class: "loading-indicator player-busy",
      }),
      B = createElement(
        "div",
        {
          class: "player",
          "data-focus-trap": "",
        },
        [s, z, busyRing, D, K],
      );
    function V() {
      (K.classList.add("visible"), l && clearTimeout(l), (l = setTimeout(W, 4500)));
    }
    function W() {
      (K.classList.remove("visible"), (a.__osdNav = !1), l && (clearTimeout(l), (l = null)));
    }
    function J(e, t) {
      ((z.textContent = t || ""), z.classList.toggle("visible", !!t));
    }
    /** The loading ring, while the stream opens, buffers or reconnects. */
    function busy(on) {
      busyRing.classList.toggle("visible", !!on);
    }
    function H() {
      T.classList.toggle("active", isFavourite(t));
    }
    function X() {
      // Live: a channel reporting a short, finite length is the provider's notice (the
      // connection is busy), not the channel. Reconnect instead of airing it.
      if (n && !a.__noticeRetry && a.duration > 0 && a.duration < 90)
        return ((a.__noticeRetry = !0), learnProviderLingers(), a.stop(), void __lr(0));
      if (n || null !== d) return;
      // When a provider's video host blocks it, the server answers with a short
      // "this video has been restricted" clip in place of the film or episode. A
      // title reporting well under two minutes is that clip, not the content, so say
      // what happened rather than playing someone else's notice.
      if (!a.__blocked) {
        var runtime = a.duration;
        if (runtime > 0 && isFinite(runtime) && runtime < 90) {
          a.__blocked = true;
          try {
            a.stop();
          } catch (e) {}
          (J(0, translate("player.providerBlocked")), busy(!1));
          return;
        }
      }
      (G(a.position, a.duration),
        (function () {
          if (!A || null !== d) return;
          let e = a.duration;
          if (!e) return;
          let t = e - a.position,
            n = settings().nextEpisodePromptSeconds,
            i = t > 0 && t <= n;
          if (i !== !D.hidden)
            if (i) {
              let e = I[N + 1];
              ((j.textContent = episodeLabel(e)), (D.hidden = !1), focusElement(U));
            } else ((D.hidden = !0), focusedElement() === U && focusElement(_));
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
      // h: when this run of presses (or a held key's repeats) began.
      ((h = i - f < 450 && h ? h : i), (f = i));
      let r = null === d ? a.position : d,
        s = Math.max(0, Math.min(a.duration - 1, r + t * seekStep(i - h, a.duration)));
      ((d = s),
        G(s, a.duration),
        k.classList.add("seeking"),
        showThumb(s),
        V(),
        u && clearTimeout(u),
        // Long enough after the last press to look at the picture and press again.
        (u = setTimeout(() => {
          let t = d;
          ((d = null),
            (h = 0),
            k.classList.remove("seeking"),
            hideThumb(),
            a.seekTo(t),
            (a.__floor = 0),
            e.seriesId && t > a.position && (Hi(e.seriesId, t), Q()));
        }, 800)));
    }
    function Q() {
      let t = Xi(e.seriesId);
      E.textContent =
        null !== t ? translate("player.skipIntro") : "Skip +" + settings().introSkipSeconds + "s";
    }
    function Y() {
      return e.seriesId
        ? {
            kind: "series",
            id: e.seriesId,
          }
        : {
            kind: t.kind,
            id: t.id,
          };
    }
    function ee() {
      let e = Y(),
        t = Qi(e.kind, e.id);
      (s.classList.remove("fit-fit", "fit-fill", "fit-stretch"),
        s.classList.add("fit-" + t),
        (F.textContent = Zi(t)));
    }
    // Go to the episode `step` places away (1 next, -1 previous), across seasons. A
    // previous episode resumes where it was left; the next one starts from the top.
    function te(step) {
      let to = N + (step || 1);
      if (!I || to < 0 || to >= I.length) return;
      let n = I[to],
        saved = step < 0 ? progressFor("episode", n.id) : null;
      (ne(),
        replaceRoute(
          "player",
          episodeRoute(
            n,
            I,
            { id: e.seriesId, name: e.seriesName, poster: t.poster },
            saved ? saved.position : 0,
          ),
        ));
    }
    // Which episode buttons apply, now that the episode list may have arrived.
    function syncEpisodeButtons() {
      let has = !!(I && N >= 0);
      ((A = has && N < I.length - 1),
        (prevEp.hidden = !(has && N > 0)),
        (O.hidden = !A),
        (epBtn.hidden = !(has && I.length > 1)));
    }
    // Opened from Continue Watching, History or Home, an episode arrives with no list (or
    // only its own season): fetch the series so Previous/Next work across all seasons.
    function loadAllEpisodes() {
      if (n || !e.seriesId || e.allSeasons) return;
      runAsync(null, null, function* () {
        let info = yield activeAdapter().seriesInfo(e.seriesId);
        if (p) return;
        let list = allEpisodes(info),
          at = list.findIndex((x) => String(x.id) === String(t.id));
        at >= 0 && ((I = list), (N = at), syncEpisodeButtons());
      }).catch(() => {});
    }
    function openEpisodes() {
      if (!I) return;
      clearChildren(epList);
      let current = null;
      I.forEach((ep, i) => {
        let watched = progressFor("episode", ep.id),
          row = createElement("div", {
            class: "quality-option episode-option focusable" + (i === N ? " active" : ""),
            dir: "auto",
            text:
              (i === N ? "▶  " : "") +
              episodeLabel(ep) +
              (watched ? "   ·   " + ir(watched.position) : ""),
          });
        ((row.__episodeIndex = i), epList.appendChild(row), i === N && (current = row));
      });
      ((epList.__scroll = 0),
        (epList.style.transform = "translate3d(0,0,0)"),
        (epPanel.hidden = !1),
        W(),
        focusElement(current || epList.firstChild, { exact: !0 }));
    }
    function closeEpisodes() {
      ((epPanel.hidden = !0), V(), focusElement(epBtn, { exact: !0 }));
    }
    epPanel.addEventListener("focus-enter", (ev) => {
      // Keep the focused episode inside the panel's window.
      let row = ev.target,
        top = row.offsetTop,
        view = 520,
        cur = epList.__scroll || 0,
        next = cur;
      (top < cur
        ? (next = top)
        : top + row.offsetHeight > cur + view && (next = top + row.offsetHeight - view),
        next !== cur &&
          ((epList.__scroll = next),
          (epList.style.transform = "translate3d(0," + -next + "px,0)")));
    });
    // ---- Seek thumbnails: a second, muted copy of the file that jumps to where the viewer
    // is scrubbing, so they can see where they will land before letting go.
    function showThumb(pos) {
      let dur = a.duration;
      if (!dur) return;
      ((thumb.hidden = !1),
        (thumb.style.left = (100 * Math.min(1, pos / dur)).toFixed(2) + "%"),
        (thumbTime.textContent = ir(pos)));
      if (!seekPreviewAllowed() || thumb.__failed || !a.current) return;
      thumbTimer && clearTimeout(thumbTimer);
      thumbTimer = setTimeout(() => {
        thumbTimer = null;
        if (p) return;
        if (!thumbVideo) {
          thumbVideo = createElement("video", {
            class: "osd-thumb-video",
          });
          ((thumbVideo.muted = !0), (thumbVideo.preload = "auto"));
          thumbVideo.setAttribute("playsinline", "");
          thumbVideo.addEventListener("seeked", () => thumb.classList.add("has-frame"));
          // A file the TV cannot open twice: drop the pictures, keep the time.
          thumbVideo.addEventListener("error", () => ((thumb.__failed = !0), dropThumbVideo()));
          thumbImg.appendChild(thumbVideo);
          try {
            thumbVideo.src = ie(a.current);
          } catch (x) {
            return void ((thumb.__failed = !0), dropThumbVideo());
          }
        }
        try {
          thumbVideo.currentTime = pos;
        } catch (x) {}
      }, 90);
    }
    function hideThumb() {
      ((thumb.hidden = !0), thumbTimer && (clearTimeout(thumbTimer), (thumbTimer = null)));
    }
    function dropThumbVideo() {
      if (!thumbVideo) return;
      try {
        (thumbVideo.removeAttribute("src"), thumbVideo.load());
      } catch (x) {}
      (thumbVideo.parentNode && thumbVideo.parentNode.removeChild(thumbVideo),
        (thumbVideo = null),
        thumb.classList.remove("has-frame"));
    }
    function ne() {
      // Nothing has played yet, or the resume seek is still pending: the position is the
      // start of the file, not where the viewer is, and saving it would lose their place.
      if (!a.__ok || (a.options && a.options.resumeAt > 0)) return;
      // Not while reconnecting (a cut file reports its duration as the cut point), not from
      // the provider's short notice clip, and not from before a resume seek the file
      // refused: each would overwrite or delete the viewer's real place.
      if (
        a.__retrying ||
        a.__blocked ||
        (a.duration > 0 && a.duration < 90) ||
        a.position < (a.__floor || 0)
      )
        return;
      n || recordHistory(__historyItem(), a.position, Math.max(a.__dur || 0, a.duration || 0), !1);
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
          Math.max(a.__dur || 0, a.duration || 0),
        );
    }
    function ie(e) {
      return e.url
        ? e.url
        : n
          ? Gt(e.id, liveStreamFormat(), e.item || t)
          : "episode" === t.kind
            ? (function (e, t) {
                return activeAdapter().episodeUrl(e, t);
              })(e.id, e.ext || t.ext)
            : Zt(e.id, e.ext || t.ext);
    }
    function re() {
      if (!n)
        return [
          {
            id: t.id,
            name: t.name,
            ext: t.ext,
            rank: 0,
          },
        ];
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
        return [
          {
            id: t.id,
            name: t.name,
            url: t.url,
            item: t,
            rank: 0,
          },
        ];
      let e = settings().preferLowerBitrate ? 1 : 0,
        i = (function (e, t) {
          let n = channelSources(e),
            i = null == t ? 1 : t,
            r = n.filter((e) => e.rank >= i);
          return r.length ? r.sort((e, t) => e.rank - t.rank)[0] : n[0];
        })(t, e),
        r = channelSources(t);
      // The best few copies of the channel are plenty to fail over between; a popular
      // channel listed in every category would otherwise mean trying a dozen dead streams.
      return [i].concat(r.filter((e) => e.id !== i.id)).slice(0, 6);
    }
    (a.on("loading", () => {
      (J(0, ""), busy(!0));
    }),
      a.on("waiting-for-slot", () => {
        (J(0, translate("welcome.connecting")), busy(!0));
      }),
      a.on("resume-failed", (x) => {
        // The file would not jump to the saved place: until the viewer seeks, nothing
        // earlier than it is saved over it.
        a.__floor = x.target;
      }),
      a.on("playing", (e) => {
        (J(0, ""),
          busy(!1),
          n && (nr = t),
          (_.textContent = "❚❚"),
          (b.textContent = e.source && e.source.quality ? e.source.quality : ""),
          n || (S.textContent = ir(a.duration)),
          V());
      }),
      a.on("progress", () => {
        (J(0, ""), busy(!1));
        // The provider's short notice clip "plays" too; none of it counts as watching.
        if (a.duration > 0 && a.duration < 90) return;
        // "Sustained" means progress without a gap: a reload that jumps to the resume point
        // produces one progress event, which must not refill the retry budget.
        let now = Date.now();
        (now - (a.__lastProgress || 0) > 1500 && (a.__since = now),
          (a.__lastProgress = now),
          a.__ok || __noteWatched(),
          (a.__ok = a.__ok || now),
          (a.__retrying = !1),
          (a.__noticeRetry = !1),
          now - a.__since >= 5e3 && (a.__rt = 0));
        n ||
          a.position < (a.__floor || 0) ||
          ((a.__pos = a.position), (a.__dur = Math.max(a.__dur || 0, a.duration || 0)));
      }),
      a.on("recovered", () => {
        (J(0, ""), busy(!1));
      }),
      a.on("recovering", () => {
        (J(0, ""), busy(!0));
      }),
      a.on("buffering", (e) => {
        if (e && e.terminal) return void __lr(__pos());
        a.paused || (J(0, ""), busy(!0));
      }),
      a.on("source-failed", () => {
        J(0, "");
      }),
      a.on("quality-change", (e) => {
        e.to && e.to.quality && (b.textContent = e.to.quality);
      }),
      a.on("exhausted", () => {
        (J(0, ""), busy(!1));
        __lr(__pos());
      }),
      a.on("ended", () => {
        // The provider ends live streams every minute or so; that stream is gone at its end
        // already, so the same channel reconnects at once.
        if (n) return void __lr(0, !0);
        var q = a.position,
          d = Math.max(a.__dur || 0, a.duration || 0);
        // Seconds-long "titles" are the provider's notice, not the film ending: keep the
        // viewer's place and try again once the connection is free.
        if (d > 0 && d < 90) return void __lr(__pos());
        if (d > 0 && q >= d - 3) {
          ne();
          if (A) return void te(1);
          try {
            if (e.seriesId)
              return void replaceRoute("details", {
                kind: "series",
                id: e.seriesId,
              });
            // (An episode without its series has no page of its own to land on.)
            if (t && t.id && "episode" !== t.kind)
              return void replaceRoute("details", {
                kind: t.kind || "movie",
                id: t.id,
                item: t,
              });
          } catch (_) {}
          return void goBack();
        }
        __lr(a.__pos || q || 0);
      }),
      B.addEventListener("focus-activate", (n) => {
        let s = n.target;
        if (s === _) {
          let e = a.togglePause();
          ((_.textContent = e ? "▶" : "❚❚"), e && ne(), V());
        } else if (s === T) {
          let e = toggleFavourite(t);
          (H(), showToast(e ? "Added to favourites" : "Removed from favourites"), V());
        } else if (s === E)
          !(function () {
            let t,
              n = Xi(e.seriesId),
              i = a.position;
            if (null !== n && n > i) (a.seekTo(n), (t = n));
            else {
              let e = settings().introSkipSeconds;
              if (!a.seekBy(e)) return;
              t = i + e;
            }
            (Hi(e.seriesId, t), Q(), V());
          })();
        else if (s === O || s === U) te(1);
        else if (s === prevEp) te(-1);
        else if (s === epBtn) openEpisodes();
        else if (s.classList.contains("episode-option")) {
          let to = s.__episodeIndex;
          to === N ? closeEpisodes() : te(to - N);
        } else if (s === F)
          !(function () {
            let e = Y(),
              t = Yi(e.kind, e.id);
            (ee(), showToast(Zi(t)), V());
          })();
        else if (s === L)
          !(function () {
            let e = channelSources(t);
            (clearChildren(se),
              se.appendChild(
                createElement("div", {
                  class: "quality-title",
                  text: translate("player.quality"),
                }),
              ),
              e.length <= 1 &&
                se.appendChild(
                  createElement("div", {
                    class: "quality-empty",
                    text: "Only one source available for this channel.",
                  }),
                ));
            for (let t of e) {
              let e = createElement("div", {
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
              focusElement(se.querySelector(".quality-option")));
          })();
        else if (s.classList.contains("quality-option") && s.__source) {
          let e = s.__source;
          ae();
          let t = re().filter((t) => t.id !== e.id);
          (a.play([e].concat(t), ie, {
            noPromote: !0,
          }),
            showToast("Quality: " + (e.quality || e.name)));
        }
      }));
    let se = createElement("div", {
      class: "quality-panel",
      hidden: "hidden",
      "data-focus-memory": "quality",
    });
    function ae() {
      ((se.hidden = !0), focusElement(L), V());
    }
    function __lr(r, noGate) {
      if (p) return;
      // The retry budget refills only after sustained playback (see "progress"), never just
      // because something played once long ago - or a dead line would retry forever.
      ((a.__rt = (a.__rt || 0) + 1), (a.__retrying = !0), (a.__since = 0));
      if (a.__rt > 3) {
        (J(0, translate(n ? "player.unavailable" : "player.titleUnavailable")), busy(!1));
        return;
      }
      J(0, translate("welcome.connecting"));
      a.__t && clearTimeout(a.__t);
      a.__t = setTimeout(() => {
        if (p) return;
        try {
          // A retry tries the best few sources, not every copy of the channel in every
          // category (18 for a popular one) over and over.
          a.play(n ? re().slice(0, 3) : re(), ie, {
            resumeAt: r > 2 ? r : 0,
            noPromote: !n,
            gate: !noGate && (n ? "live" : !0),
          });
        } catch (e) {
          (J(0, translate(n ? "player.unavailable" : "player.titleUnavailable")), busy(!1));
        }
      }, 600);
    }
    // What this player is showing, as History keeps it.
    function __historyItem() {
      return n
        ? {
            kind: "live",
            id: t.id,
            name: t.name,
            logo: t.logo || null,
            categoryId: t.categoryId || null,
            number: null != t.number ? t.number : null,
          }
        : {
            kind: t.kind,
            id: t.id,
            name: t.name,
            poster: t.poster || null,
            ext: t.ext || null,
            seriesId: e.seriesId || null,
            seriesName: e.seriesName || null,
            season: e.season || null,
            episodeNumber: e.episodeNumber || null,
          };
    }
    function __noteWatched() {
      try {
        recordHistory(__historyItem(), n ? 0 : a.position, n ? 0 : a.duration, !0);
      } catch (x) {}
    }
    function __pos() {
      // Before anything has played, the place to retry from is where the viewer left
      // off, not the start of the file.
      return n
        ? 0
        : Math.max(a.__pos || 0, a.__floor || 0, a.__ok ? 0 : e.resumeAt || 0) || a.position || 0;
    }
    // (a.__ok is set by the first real progress, not by "playing": a notice clip plays too.)
    return {
      mount(t) {
        (((e) => {
          B.appendChild(e);
        })(se),
          B.appendChild(epPanel),
          syncEpisodeButtons(),
          loadAllEpisodes(),
          t.appendChild(B),
          H(),
          ee(),
          n || Q(),
          (function () {
            (J(0, ""),
              a.play(re(), ie, {
                resumeAt: e.resumeAt || 0,
                noPromote: !n,
                // Wait for a stream just handed back to be released (see streamOpenDelay:
                // live channels only wait when this provider needs it).
                gate: n ? "live" : !0,
              }));
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
          hideThumb(),
          dropThumbVideo(),
          a.destroy(),
          clearChildren(B));
      },
      initialFocus: () => _,
      onKey: function (i) {
        // The episode list: Up/Down move inside it, Back closes it, Left/Right do nothing.
        if (!epPanel.hidden)
          return isBackKey(i)
            ? (closeEpisodes(), !0)
            : i === KEY_LEFT || i === KEY_RIGHT || i === KEY_CHANNEL_UP || i === KEY_CHANNEL_DOWN;
        if (isBackKey(i))
          return se.hidden
            ? K.classList.contains("visible")
              ? (W(), !0)
              : (ne(), goBack(), !0)
            : (ae(), !0);
        if (!se.hidden) return !1;
        let r = K.classList.contains("visible");
        // Up, Down or OK means the viewer is using the controls: from then until they hide,
        // Left/Right move between the buttons (Skip intro, Next episode…), which were
        // unreachable when every Left/Right was a seek. Otherwise - controls hidden, shown by
        // themselves as the player opens, or the progress bar focused - Left/Right seek.
        (i === KEY_UP || i === KEY_DOWN || isSelectKey(i)) && (a.__osdNav = !0);
        let seekKeys = !r || !a.__osdNav || focusedElement() === k;
        // Any key while the controls show keeps them up.
        r && V();
        if (!n && (i === KEY_REWIND || (i === KEY_LEFT && seekKeys))) return ($(-1), !0);
        if (!n && (i === KEY_FORWARD || (i === KEY_RIGHT && seekKeys))) return ($(1), !0);
        if (i === KEY_PLAY_PAUSE || i === KEY_PAUSE || i === KEY_PLAY) {
          // webOS can act on its media keys by itself; toggling again then undoes it and the
          // press looks ignored. Decide a moment later from what the video actually did:
          // Pause only pauses, Play only plays, Play/Pause toggles.
          let was = a.paused;
          return (
            setTimeout(() => {
              if (p) return;
              let now = a.paused;
              if (now === was && !((i === KEY_PAUSE && now) || (i === KEY_PLAY && !now)))
                now = a.togglePause();
              ((_.textContent = now ? "▶" : "❚❚"), now && ne(), V());
            }, 150),
            !0
          );
        }
        if (i === KEY_STOP) return (ne(), goBack(), !0);
        // Channel +/- on the remote: next / previous episode.
        if (!n && I && (i === KEY_CHANNEL_UP || i === KEY_CHANNEL_DOWN))
          return (te(i === KEY_CHANNEL_UP ? 1 : -1), !0);
        if (n && e.siblings && e.siblings.length > 1) {
          let n = 0;
          if (
            (i === KEY_UP || i === KEY_CHANNEL_UP
              ? (n = -1)
              : (i === KEY_DOWN || i === KEY_CHANNEL_DOWN) && (n = 1),
            0 !== n)
          ) {
            let i = e.siblings.length,
              r = ((null == e.index ? 0 : e.index) + n + i) % i;
            return (
              ne(),
              replaceRoute("player", {
                channel: e.siblings[r],
                siblings: e.siblings,
                index: r,
                previous: t,
              }),
              !0
            );
          }
        }
        return !D.hidden && isSelectKey(i) ? (te(1), !0) : !r && (V(), focusElement(_), !0);
      },
    };
  }
  function sr(e) {
    return e ? Math.round(e / 60) + " min" : null;
  }
  function ar(e) {
    let t = createPage({}),
      s = createElement("div", {
        class: "details",
      });
    t.add(s);
    let a = !1,
      l = null,
      o = 0,
      u = createElement("div", {
        class: "details-hero",
      }),
      c = createElement("div", {
        class: "poster poster-2x3 details-poster",
      }),
      d = createElement("h1", {
        class: "details-title",
        dir: "auto",
        text: e.item ? e.item.name : "",
      }),
      m = createElement("div", {
        class: "details-meta",
      }),
      h = createElement("p", {
        class: "details-plot",
        dir: "auto",
      }),
      f = createElement("div", {
        class: "button primary focusable details-play",
        text: "▶  Play",
      }),
      p = createElement("div", {
        class: "button focusable",
        text: "★  Favourite",
      }),
      g = createElement(
        "div",
        {
          class: "details-actions",
          "data-focus-memory": "details-actions",
        },
        [f, p],
      ),
      v = createElement(
        "div",
        {
          class: "details-info",
        },
        [d, m, h, g],
      );
    (u.appendChild(c), u.appendChild(v), s.appendChild(u));
    let y = createElement("div", {
      class: "details-episodes",
    });
    function x() {
      let t = e.item || {
        kind: e.kind,
        id: e.id,
        name: d.textContent,
      };
      p.classList.toggle("active", isFavourite(t));
    }
    function k(e, t) {
      (c.setAttribute("data-src", e || ""), c.setAttribute("data-title", t || ""), ai(c));
    }
    function C() {
      return runAsync(this, null, function* () {
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
        let i = progressFor("movie", e.id);
        (i && (f.textContent = "▶  Resume  ·  " + Math.floor(i.position / 60) + " min in"),
          x(),
          focusInto(s, f));
      });
    }
    function S() {
      return runAsync(this, null, function* () {
        let t = yield (function (e) {
          return activeAdapter().seriesInfo(e);
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
        // Open on the season being watched, and say on the button which episode resumes.
        let last = lastWatched();
        if (last) {
          let si = t.seasons.findIndex((x) => x.episodes.indexOf(last) >= 0);
          si >= 0 && (o = si);
        }
        ((m.textContent = n.join("   ·   ")),
          (h.textContent = t.plot || ""),
          (f.textContent = last
            ? "▶  Resume  ·  S" + last.season + "E" + last.episodeNumber
            : "▶  Play"),
          x(),
          _(),
          focusInto(s, f));
      });
    }
    function _() {
      if ((clearChildren(y), !l || !l.seasons.length)) return;
      if (l.seasons.length > 1) {
        let e = createElement("div", {
          class: "season-strip",
          "data-focus-memory": "seasons",
        });
        (l.seasons.forEach((t, n) => {
          let r = createElement("div", {
            class: "season-button focusable" + (n === o ? " active" : ""),
            text: "Season " + t.number,
          });
          ((r.__seasonIndex = n), e.appendChild(r));
        }),
          y.appendChild(e));
      }
      let e = createElement("div", {
        class: "episode-list",
        "data-focus-memory": "episodes",
      });
      for (let t of l.seasons[o].episodes) e.appendChild(T(t));
      y.appendChild(e);
    }
    function T(e) {
      let t = createElement("div", {
        class: "poster poster-16x9 episode-still",
        "data-src": e.still || "",
        "data-title": "",
      });
      ai(t);
      let n = progressFor("episode", e.id);
      if (n) {
        let e = pi(n);
        t.appendChild(
          createElement(
            "div",
            {
              class: "card-progress",
            },
            [
              createElement("div", {
                class: "card-progress-fill",
                style: "width:" + Math.round(100 * e) + "%",
              }),
            ],
          ),
        );
      }
      let r = createElement(
        "div",
        {
          class: "episode-row focusable",
        },
        [
          t,
          createElement(
            "div",
            {
              class: "episode-text",
            },
            [
              createElement("div", {
                class: "episode-title",
                dir: "auto",
                text: e.episodeNumber + ".  " + (e.title || "Episode " + e.episodeNumber),
              }),
              createElement("div", {
                class: "episode-plot",
                dir: "auto",
                text: e.plot || "",
              }),
            ],
          ),
          createElement("div", {
            class: "episode-duration",
            text: sr(e.durationSecs) || "",
          }),
        ],
      );
      return ((r.__episode = e), r);
    }
    // The player gets every episode of every season, so Previous / Next carry on across
    // the end of a season instead of stopping there.
    function L(t) {
      let n = progressFor("episode", t.id),
        r = allEpisodes(l);
      (r.indexOf(t) < 0 && (r = [t]),
        pushRoute(
          "player",
          episodeRoute(
            t,
            r,
            { id: e.id, name: l ? l.name : "", poster: l ? l.poster : null },
            n ? n.position : 0,
          ),
        ));
    }
    /** The episode watched most recently, if any. */
    function lastWatched() {
      let best = null,
        at = 0;
      for (let season of (l && l.seasons) || [])
        for (let ep of season.episodes) {
          let p = progressFor("episode", ep.id);
          p && p.updatedAt > at && ((at = p.updatedAt), (best = ep));
        }
      return best;
    }
    return (
      s.appendChild(y),
      s.addEventListener("focus-activate", (t) => {
        let n = t.target;
        if (n === f)
          return void ("series" === e.kind
            ? (function () {
                if (!l || !l.seasons.length) return;
                let e = lastWatched();
                // (A season can come back empty; start from the first episode that exists.)
                let first = l.seasons.filter((s) => s.episodes.length)[0];
                (e = e || (first && first.episodes[0])) && L(e);
              })()
            : (function () {
                let t = progressFor("movie", e.id);
                pushRoute("player", {
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
          let t = toggleFavourite(
            e.item || {
              kind: e.kind,
              id: e.id,
              name: d.textContent,
              poster: l ? l.poster : null,
            },
          );
          return (x(), void showToast(t ? "Added to favourites" : "Removed from favourites"));
        }
        if (n.classList.contains("season-button"))
          return (
            (o = n.__seasonIndex),
            _(),
            void ensureFocus(y.querySelector(".season-button.active"))
          );
        let i = n.closest(".episode-row");
        i && L(i.__episode);
      }),
      {
        mount(n) {
          (n.appendChild(t.node),
            (function __ld(k) {
              ("series" === e.kind ? S : C)().catch(function (err) {
                if (a) return;
                var msg = String((err && err.message) || err || ""),
                  off = msg.indexOf("__NOAPI__") >= 0,
                  // The portal said no (an expired or blocked account): asking again only
                  // makes a flood-protected portal block it for longer.
                  refused = /^HTTP 4\d\d/.test(msg);
                h.textContent = off
                  ? translate("details.offline")
                  : translate("details.couldNotLoad") +
                    (refused ? " (" + msg.split(" for ")[0] + ")" : "");
                if (!refused && k < 5)
                  setTimeout(
                    function () {
                      a || __ld(k + 1);
                    },
                    (off ? 5e3 : 3e3) * (k + 1),
                  );
              });
            })(0));
        },
        unmount() {
          ((a = !0), clearChildren(t.node));
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
    let e = createElement("video", {
      class: "preview-video",
    });
    (e.setAttribute("playsinline", ""), (e.muted = !1));
    let t = createElement("div", {
        class: "poster poster-16x9 preview-poster",
      }),
      n = createElement("div", {
        class: "preview-name",
        dir: "auto",
        text: "",
      }),
      s = createElement("div", {
        class: "preview-hint",
        text: translate("browse.pressOkPreview"),
      }),
      a = createElement(
        "div",
        {
          class: "preview-frame",
        },
        [t, e],
      ),
      l = createElement(
        "div",
        {
          class: "preview-pane",
        },
        [
          createElement("div", {
            class: "pane-title",
            text: translate("browse.preview"),
          }),
          a,
          n,
          s,
        ],
      ),
      o = null,
      u = null,
      c = [],
      d = 0;
    function m() {
      (a.classList.add("preview-playing"),
        (s.textContent = translate("browse.pressOkFull")),
        u && (clearTimeout(u), (u = null)),
        o &&
          (function (e) {
            if (!e) return;
            ((ur()[e] = {
              ok: !0,
              at: Date.now(),
              fails: 0,
            }),
              cr());
          })(o));
    }
    function h() {
      if ((u && (clearTimeout(u), (u = null)), d < c.length - 1))
        return (d++, (s.textContent = "Trying another source…"), void f());
      (a.classList.remove("preview-playing"),
        (s.textContent = translate("browse.noResponse")),
        o &&
          (function (e) {
            if (!e) return;
            let t = ur(),
              n = t[e];
            ((t[e] = {
              ok: !1,
              at: Date.now(),
              fails: ((n && n.fails) || 0) + 1,
            }),
              cr());
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
            o || (s.textContent = translate("browse.pressOkPreview")),
            t.setAttribute("data-src", e.logo || ""),
            t.setAttribute("data-title", e.name || ""),
            (t.style.backgroundImage = ""),
            t.classList.remove("poster-loaded", "poster-fallback"),
            clearChildren(t),
            ai(t));
        },
        play: function (e, t) {
          return (
            !(
              !e ||
              (p(),
              (c =
                e.sources && e.sources.length
                  ? e.sources.slice()
                  : t
                    ? [
                        {
                          url: t,
                        },
                      ]
                    : []),
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
    return e.map((e) => ({
      item: e,
      key: hr(e.name),
    }));
  }
  /** 4K / FHD / HD / SD for a title, from its own name or else its category's. */
  function titleQuality(item) {
    return (
      qualityTagFor(item.name || "") ||
      (item.categoryName && qualityTagFor(item.categoryName)) ||
      null
    );
  }
  /** The name as people would say it: no [tags], (notes) or quality markers. */
  function displayTitle(name) {
    let t = String(name || "")
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\([^)]*\)/g, " ")
      .replace(
        /(^|[\s_|:-])(4k|uhd|2160p?|fhd|1080p?|hd|720p?|sd|480p?|h\s?265|h\s?264|hevc|multi|vip)(?=[\s_|:-]|$)/gi,
        " ",
      )
      .replace(/\s+/g, " ")
      .replace(/^[\s|:_\-–—]+|[\s|:_\-–—]+$/g, "")
      .trim();
    return t || String(name || "").trim();
  }
  /**
   * How "hot" a title is right now, from what the provider tells us: how recently it was
   * added (or, for a series, got a new episode), its rating, and whether this TV has
   * watched it. Used to put the likeliest titles first in predictions and results.
   */
  function trendScore(entry) {
    if (null == entry.__trend) {
      let it = entry.item,
        score = 0,
        at = it.added || it.lastModified;
      if (at) {
        let days = (Date.now() - at) / 864e5;
        days >= 0 && (score += Math.max(0, 10 - days / 9));
      }
      (it.rating && (score += 0.6 * Math.min(10, it.rating)), (entry.__trend = score));
    }
    return entry.__trend + (watchedRecently()[entry.item.kind + ":" + entry.item.id] ? 4 : 0);
  }
  var watchedSetCache = null,
    watchedSetAt = 0;
  function watchedRecently() {
    if (watchedSetCache && Date.now() - watchedSetAt < 6e4) return watchedSetCache;
    let set = Object.create(null);
    for (let h of watchHistory()) {
      set[h.kind + ":" + h.id] = !0;
      h.seriesId && (set["series:" + h.seriesId] = !0);
    }
    return ((watchedSetAt = Date.now()), (watchedSetCache = set));
  }
  /**
   * Titles matching what has been typed, best first: every typed word must appear; a title
   * that starts with the text beats one where a word starts with it, which beats one that
   * only contains it; within each, the trendier title first.
   */
  function rankMatches(entries, query, limit) {
    let q = hr(query);
    if (!q) return [];
    let words = q.split(" "),
      buckets = [[], [], []];
    for (let x of entries) {
      let k = x.key,
        ok = !0;
      for (let w of words)
        if (-1 === k.indexOf(w)) {
          ok = !1;
          break;
        }
      if (!ok) continue;
      let at = k.indexOf(q);
      buckets[0 === at ? 0 : at > 0 && " " === k.charAt(at - 1) ? 1 : 2].push(x);
    }
    let out = [];
    for (let b of buckets) {
      (b.sort((a, c) => trendScore(c) - trendScore(a)), out.push.apply(out, b));
      if (limit && out.length >= limit) break;
    }
    return limit ? out.slice(0, limit) : out;
  }
  /** Predictions under the box: whole titles, one per title however many copies it has. */
  function predictTitles(entries, query, limit) {
    let seen = Object.create(null),
      out = [];
    for (let x of rankMatches(entries, query, 400)) {
      let title = displayTitle(x.item.name),
        k = hr(title);
      if (seen[k]) continue;
      if (((seen[k] = !0), out.push(title), out.length >= (limit || 6))) break;
    }
    return out;
  }
  /** What is new and highly rated on this provider: shown before anything is typed. */
  function trendingTitles(entries, limit) {
    let seen = Object.create(null),
      out = [],
      sorted = entries.filter((x) => x.item.added || x.item.lastModified || x.item.rating);
    sorted.sort((a, c) => trendScore(c) - trendScore(a));
    for (let x of sorted) {
      let title = displayTitle(x.item.name),
        k = hr(title);
      if (seen[k]) continue;
      if (((seen[k] = !0), out.push(title), out.length >= (limit || 8))) break;
    }
    return out;
  }
  var pr = (e) => new Promise((t) => setTimeout(t, e));
  function gr(e, t) {
    return runAsync(this, null, function* () {
      let n = yield e(),
        i = [];
      i.partial = !1;
      for (let e of n) {
        try {
          let items = yield t(e.id);
          // The category often carries the quality ("4K Movies", "Bein Sport [ HD ]"): keep
          // its name with each title so a search result can say which copy it is.
          for (let x of items) x.categoryName || (x.categoryName = e.name);
          i.push.apply(i, items);
        } catch (e) {
          i.partial = !0;
        }
        // One frame between categories keeps the TV responsive; a longer pause only added
        // seconds of waiting to the first search on a big catalogue (90 categories x 120 ms).
        yield pr(16);
      }
      return i;
    });
  }
  var vr = null,
    yr = null;
  function br() {
    return vr;
  }
  // A whole catalogue in one request where the provider allows it: category by category
  // was hundreds of requests (a minute of "Preparing…", and enough to trip a provider's
  // flood protection). Anything else falls back to walking the categories.
  function catalogue(categories, streams, kind) {
    let bulk = activeAdapter().allStreams;
    if (!bulk) return gr(categories, streams);
    return runAsync(null, null, function* () {
      let cats = yield categories(),
        names = Object.create(null);
      for (let c of cats) names[c.id] = c.name;
      let items = yield bulk(kind);
      for (let x of items) x.categoryName || (x.categoryName = names[x.categoryId] || "");
      return ((items.partial = !1), items);
    }).catch(() => gr(categories, streams));
  }
  function wr() {
    return vr
      ? Promise.resolve(vr)
      : yr ||
          (yr = runAsync(null, null, function* () {
            // Series and films first: they are what people search for.
            let n = yield catalogue(seriesCategories, Ht, "series"),
              t = yield catalogue(vodCategories, vodStreams, "vod"),
              e = yield catalogue(liveCategories, liveStreams, "live"),
              index = {
                live: fr(e),
                movies: fr(t),
                series: fr(n),
              };
            // An index missing a category that failed to load is used for this search but
            // not kept, so the next search tries to complete it.
            return ((yr = null), e.partial || t.partial || n.partial || (vr = index), index);
          }).catch((e) => {
            throw ((yr = null), e);
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
    return runAsync(this, null, function* () {
      if ("freetv" === e)
        return xr
          ? Promise.resolve(xr)
          : kr ||
              (kr = runAsync(null, null, function* () {
                let e = yield loadFreePlaylist(),
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
      d = createElement("input", {
        class: "field-input section-search-input",
        type: "text",
        readonly: "readonly",
        placeholder: "Search…",
      }),
      m = createElement("div", {
        class: "section-search-status",
        text: "",
      }),
      h = createElement("div", {
        class: "section-search-results",
      }),
      f = Jn({
        language: o,
        suggest: (e) => (e ? (u ? predictTitles(u, e, 6) : []) : Xn().slice(0, 6)),
        onChange: () => {
          g();
        },
        onSubmit: () => {
          Gn(d.value);
          let e = h.querySelector(".channel-row, .card");
          e && focusElement(e);
        },
      });
    f.setTarget(d);
    let p = createElement(
        "div",
        {
          class: "section-search",
        },
        [d, f.node, m, h],
      ),
      g = a(
        () =>
          runAsync(null, null, function* () {
            let e = d.value.trim();
            if ((clearChildren(h), e.length < 2))
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
              if (((c = Cr(u, e, 200)), clearChildren(h), !c.length))
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
            clearChildren(h),
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
      categories: () => liveCategories(),
      items: (e) => liveStreams(e),
      layout: "list",
      defaultCategory: /bein\s*sport.*\[\s*hd\s*\]/i,
      defaultItem: /bein\s*sports?\s*1\b/i,
    },
    movies: {
      title: "Movies",
      categories: () => vodCategories(),
      items: (e) => vodStreams(e),
      layout: "grid",
    },
    series: {
      title: "Series",
      categories: () => seriesCategories(),
      items: (e) => Ht(e),
      layout: "grid",
    },
  };
  function Lr(e) {
    let t = Tr[e.kind],
      s = [],
      a = [],
      l = 0,
      o = !1,
      u = !1,
      c = createElement("div", {
        class: "category-button category-search focusable",
        text: "⌕   Search " + t.title,
      }),
      d = createElement("div", {
        class: "pane-scroll",
      }),
      h = createElement(
        "div",
        {
          class: "category-pane",
          "data-focus-memory": "browse-cats",
        },
        [
          createElement("div", {
            class: "pane-title",
            text: "Categories",
          }),
          c,
          d,
        ],
      ),
      f = createElement("div", {
        class: "pane-scroll",
      }),
      p = createElement("div", {
        class: "pane-title",
        text: "",
      }),
      g = createElement(
        "div",
        {
          class: "channel-pane",
          "data-focus-memory": "browse-items",
        },
        [p, f],
      ),
      y = "list" === t.layout ? mr() : null,
      b = _r({
        kind: e.kind,
        renderRow: (e) =>
          "grid" === t.layout
            ? vi(e)
            : bi(e, {
                showNumber: settings().showChannelNumbers,
              }),
        onOpen: (e, t) => {
          "live" === e.kind
            ? pushRoute("player", {
                channel: e,
                siblings: t,
                index: t.indexOf(e),
              })
            : pushRoute("details", {
                kind: e.kind,
                id: e.id,
                item: e,
              });
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
    let k = createElement(
      "div",
      {
        class: "split" + (y ? " split-with-preview" : ""),
      },
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
            clearChildren(e),
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
        return t
          ? wi(t, {
              active: e === l,
            })
          : null;
      }),
      _ = C(
        f,
        "grid" === t.layout ? 392 : 88,
        (e) => {
          let n = a[e];
          return n
            ? "grid" === t.layout
              ? vi(n)
              : bi(n, {
                  showNumber: settings().showChannelNumbers,
                  favorite: isFavourite(n),
                })
            : null;
        },
        "grid" === t.layout ? 5 : 1,
      );
    function T(e) {
      return runAsync(this, null, function* () {
        if (s[e]) {
          l = e;
          for (let t of d.querySelectorAll(".category-button"))
            t.classList.toggle("active", Number(t.getAttribute("data-index")) === e);
          // The list is about to be emptied: if focus was in it, park it on the category and
          // bring it back to the first row once the new list is in.
          let wasInList = !!focusedElement() && f.contains(focusedElement());
          (wasInList && focusElement(d.querySelector(".category-button.active"), { exact: !0 }),
            (p.textContent = s[e].name),
            (a = []),
            _.setTotal(0));
          try {
            let n = yield t.items(s[e].id);
            if (o || l !== e) return;
            if (
              ((a = n),
              _.setTotal(a.length),
              wasInList &&
                focusedElement() &&
                focusedElement().classList.contains("category-button") &&
                focusElement(f.querySelector(".channel-row, .card"), { exact: !0 }),
              !u && t.defaultItem)
            ) {
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
        ? pushRoute("player", {
            channel: e,
            siblings: a,
            index: a.indexOf(e),
          })
        : "movie" === e.kind
          ? pushRoute("details", {
              kind: "movie",
              id: e.id,
              item: e,
            })
          : pushRoute("details", {
              kind: "series",
              id: e.id,
              item: e,
            });
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
        if (t === c) return (x(!0), b.reset(), void focusElement(b.firstKey()));
        if (t.classList.contains("category-button")) {
          x(!1);
          var __p = __cf();
          if (!__p) {
            // Nothing is loaded for this category - it failed, or came back empty - so OK
            // tries again rather than only moving away and back doing so.
            var __ix = Number(t.getAttribute("data-index"));
            isNaN(__ix) || (__ix === l && a.length) || (__p = T(__ix));
          }
          if (__p && __p.then) {
            __p.then(function () {
              var q = f.querySelector(".channel-row, .card");
              q && focusElement(q);
            });
            return;
          }
          let e = f.querySelector(".channel-row, .card");
          e && focusElement(e);
        } else if (t.__item) {
          if (y)
            return void (y.isPreviewing(t.__item)
              ? (y.release(), L(t.__item))
              : y.play(t.__item, Gt(t.__item.id, liveStreamFormat(), t.__item)));
          L(t.__item);
        }
      }),
      {
        mount(e) {
          (((e) => {
            g.appendChild(e);
          })(b.node),
            e.appendChild(k),
            (function loadCategories() {
              return runAsync(this, null, function* () {
                if (((s = yield t.categories()), o)) return;
                (S.setTotal(s.length), (p.textContent = ""));
                let e = t.defaultCategory
                  ? Math.max(
                      0,
                      s.findIndex((e) => t.defaultCategory.test(e.name)),
                    )
                  : 0;
                (S.scrollTo(e), focusInto(k, S.node(e)), yield T(e));
              }).catch(() => {
                // The portal may be back in a moment: keep trying while this screen is open.
                o ||
                  ((p.textContent = "Could not load categories."),
                  setTimeout(() => o || loadCategories(), 5e3));
              });
            })());
        },
        unmount() {
          ((o = !0), y && y.destroy(), clearChildren(k));
        },
        initialFocus: () => d.querySelector(".category-button"),
        onKey: function (e) {
          if (e === KEY_YELLOW || e === KEY_BLUE) {
            let e = focusedElement();
            if (e && e.__item) {
              let t = toggleFavourite(e.__item);
              return (e.classList.toggle("has-favorite", t), _.redraw(), !0);
            }
          }
          return !1;
        },
      }
    );
  }
  function Ir() {
    return Lr({
      kind: "live",
    });
  }
  function Nr() {
    return Lr({
      kind: "movies",
    });
  }
  function Ar() {
    return Lr({
      kind: "series",
    });
  }
  var Er = [
    {
      kind: "live",
      title: "Channels",
      variant: "channel",
    },
    {
      kind: "movie",
      title: "Movies",
      variant: "poster",
    },
    {
      kind: "series",
      title: "Series",
      variant: "poster",
    },
  ];
  function Or() {
    let e = createPage({
        title: "My Favourites",
      }),
      t = createElement("div", {
        class: "empty",
        text: "Nothing saved yet. Press the yellow button on any channel or title to add it.",
      });
    function n(e) {
      "live" === e.kind
        ? pushRoute("player", {
            channel: e,
          })
        : pushRoute("details", {
            kind: e.kind,
            id: e.id,
            item: e,
          });
    }
    function s() {
      (clearChildren(e.node),
        e.node.appendChild(
          createElement(
            "div",
            {
              class: "page-header",
            },
            [
              createElement("h1", {
                class: "page-title",
                text: "My Favourites",
              }),
            ],
          ),
        ));
      let s = !1;
      for (let t of Er) {
        let i = Mi(t.kind);
        if (!i.length) continue;
        s = !0;
        let r = i.map((e) =>
            "live" === t.kind
              ? Object.assign({}, e, {
                  logo: e.poster,
                })
              : e,
          ),
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
        clearChildren(e.node);
      },
      initialFocus: () => e.node.querySelector(".card"),
      onKey(t) {
        if (t === KEY_YELLOW || t === KEY_BLUE) {
          let t = focusedElement();
          if (t && t.__item)
            return (
              qi(t.__item),
              showToast("Removed from favourites"),
              s(),
              ensureFocus(e.node.querySelector(".card")),
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
    let e = createPage({});
    function t(e) {
      let t = progressFor(e.kind, e.id);
      pushRoute("player", {
        item: {
          kind: e.kind,
          id: e.id,
          name: e.name,
          poster: e.poster,
          ext: e.ext,
        },
        seriesId: e.seriesId || null,
        seriesName: e.seriesName || null,
        season: e.season || null,
        episodeNumber: e.episodeNumber || null,
        resumeAt: t ? t.position : 0,
      });
    }
    function n() {
      (clearChildren(e.node),
        e.node.appendChild(
          createElement(
            "div",
            {
              class: "page-header",
            },
            [
              createElement("h1", {
                class: "page-title",
                text: "Continue Watching",
              }),
              createElement("p", {
                class: "page-subtitle",
                text: "Press the yellow button to remove something from this list.",
              }),
            ],
          ),
        ));
      let n = fi(100);
      if (!n.length)
        return void e.add(
          createElement("div", {
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
        clearChildren(e.node);
      },
      initialFocus: () => e.node.querySelector(".card"),
      onKey(t) {
        if (t === KEY_YELLOW || t === KEY_BLUE) {
          let t = focusedElement();
          if (t && t.__item)
            return (
              (function (e, t) {
                (delete channelHealth()[di(e, t)], ci());
              })(t.__item.kind, t.__item.id),
              showToast("Removed from Continue Watching"),
              n(),
              ensureFocus(e.node.querySelector(".card")),
              !0
            );
        }
        return !1;
      },
    };
  }
  /** "Today", "Yesterday", or the date, for a History group heading. */
  function historyDayLabel(at) {
    let d = new Date(at),
      start = new Date();
    start.setHours(0, 0, 0, 0);
    let days = Math.round(
      (start.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 864e5,
    );
    if (days <= 0) return translate("history.today");
    if (days === 1) return translate("history.yesterday");
    try {
      return d.toLocaleDateString(currentLanguage(), {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: days > 300 ? "numeric" : void 0,
      });
    } catch (e) {
      return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }
  }
  function historyClock(at) {
    let d = new Date(at),
      two = (x) => (x < 10 ? "0" : "") + x;
    return two(d.getHours()) + ":" + two(d.getMinutes());
  }
  /** Open what a History (or search) entry points at: a channel, a film or an episode. */
  function playFromHistory(h) {
    if ("live" === h.kind)
      return void pushRoute("player", {
        channel: {
          kind: "live",
          id: h.id,
          name: h.name,
          logo: h.logo,
          categoryId: h.categoryId,
          number: h.number,
        },
      });
    // Where the viewer is in it now; a finished title starts again from the top.
    let saved = progressFor(h.kind, h.id);
    pushRoute("player", {
      item: {
        kind: h.kind,
        id: h.id,
        name: h.name,
        poster: h.poster,
        ext: h.ext,
      },
      seriesId: h.seriesId || null,
      seriesName: h.seriesName || null,
      season: h.season || null,
      episodeNumber: h.episodeNumber || null,
      resumeAt: saved ? saved.position : 0,
    });
  }
  function historyScreen() {
    let page = createPage({}),
      body = page.node;
    function row(h) {
      let isLive = "live" === h.kind,
        title = h.seriesName || h.name,
        kindText = isLive
          ? translate("search.channel")
          : "episode" === h.kind
            ? "S" + h.season + "E" + h.episodeNumber
            : translate("search.movie"),
        done = h.duration > 0 && h.position / h.duration >= 0.93,
        detail = [kindText, historyClock(h.watchedAt)];
      !isLive &&
        h.duration > 0 &&
        detail.push(
          done ? translate("history.watched") : ir(h.position || 0) + " / " + ir(h.duration),
        );
      let art = createElement("div", {
        class: "poster history-art" + (isLive ? " poster-contain" : ""),
        "data-src": (isLive ? h.logo : h.poster) || "",
        "data-title": title,
      });
      (ai(art),
        !isLive &&
          h.duration > 0 &&
          art.appendChild(
            createElement("div", { class: "card-progress" }, [
              createElement("div", {
                class: "card-progress-fill",
                style:
                  "width:" + Math.round(100 * Math.min(1, (h.position || 0) / h.duration)) + "%",
              }),
            ]),
          ));
      let node = createElement("div", { class: "history-row focusable" }, [
        art,
        createElement("div", { class: "history-text" }, [
          createElement("div", { class: "history-title", dir: "auto", text: title }),
          "episode" === h.kind && h.name && h.name !== title
            ? createElement("div", { class: "history-sub", dir: "auto", text: h.name })
            : null,
          createElement("div", {
            class: "history-detail",
            dir: "auto",
            text: detail.join("   ·   "),
          }),
        ]),
      ]);
      return ((node.__history = h), node);
    }
    function render() {
      (clearChildren(body),
        body.appendChild(
          createElement("div", { class: "page-header" }, [
            createElement("h1", { class: "page-title", text: translate("nav.history") }),
            createElement("p", { class: "page-subtitle", text: translate("history.hint") }),
          ]),
        ));
      let list = watchHistory();
      if (!list.length)
        return void body.appendChild(
          createElement("div", { class: "empty", text: translate("history.empty") }),
        );
      let day = null;
      for (let h of list) {
        let label = historyDayLabel(h.watchedAt);
        (label !== day &&
          ((day = label),
          body.appendChild(createElement("h2", { class: "history-day", text: label }))),
          body.appendChild(row(h)));
      }
    }
    body.addEventListener("focus-activate", (ev) => {
      let r = ev.target.closest(".history-row");
      r && r.__history && playFromHistory(r.__history);
    });
    return {
      mount(t) {
        (t.appendChild(body), render());
      },
      unmount() {
        clearChildren(body);
      },
      initialFocus: () => body.querySelector(".history-row"),
      onKey(k) {
        let f = focusedElement(),
          h = f && f.__history;
        if (h && (k === KEY_YELLOW || k === KEY_BLUE)) {
          // Land on the entry that takes its place, not back at the top.
          let rows = Array.prototype.slice.call(body.querySelectorAll(".history-row")),
            at = rows.indexOf(f);
          (removeFromHistory(h.kind, h.id),
            showToast(translate("history.removed")),
            page.reset(),
            render());
          let next = body.querySelectorAll(".history-row");
          return (ensureFocus(next[Math.min(at, next.length - 1)] || null), !0);
        }
        if (k === KEY_RED && watchHistory().length) {
          // Twice within a few seconds, so one stray press does not wipe everything.
          if (Date.now() - (this.__clearAsk || 0) > 4e3)
            return ((this.__clearAsk = Date.now()), showToast(translate("history.clearAsk")), !0);
          return (
            (this.__clearAsk = 0),
            clearHistory(),
            page.reset(),
            render(),
            showToast(translate("history.cleared")),
            focusElement(document.querySelector(".rail-item[data-route=history]"), { exact: !0 }),
            !0
          );
        }
        return !1;
      },
    };
  }
  var qr = hr;
  /**
   * Search everything from the menu: channels, films and series in one box. Predictions
   * appear above the keys as you type (and what is trending before you type), and every
   * result says what it is and which copy it is - "4K", "HD" - so two copies of a film
   * are never confused. Keys on the left, results on the right.
   */
  function Dr() {
    let gone = !1,
      root = createElement("div", { class: "page global-search" }),
      s = createElement("input", {
        class: "field-input search-input",
        type: "text",
        readonly: "readonly",
        placeholder: translate("search.placeholder"),
      }),
      status = createElement("div", { class: "gs-status", text: "" }),
      list = createElement("div", { class: "gs-list", "data-focus-memory": "search-results" }),
      results = createElement("div", { class: "gs-results" }, [status, list]),
      everything = () => {
        let i = br();
        return i ? i.series.concat(i.movies, i.live) : null;
      },
      u = Jn({
        language: "ar",
        suggest: (q) => {
          let all = everything();
          if (!q) {
            let past = Xn().slice(0, 3),
              hot = all
                ? trendingTitles(
                    all.filter((x) => "live" !== x.item.kind),
                    8,
                  )
                : [];
            return past
              .map((t) => ({ text: t, label: "⌕  " + t }))
              .concat(
                hot.filter((t) => past.indexOf(t) < 0).map((t) => ({ text: t, label: "★  " + t })),
              );
          }
          return all ? predictTitles(all, q, 6) : [];
        },
        onChange: () => run(s.value),
        onSubmit: () => {
          Gn(s.value);
          let first = list.querySelector(".gs-row");
          first && focusElement(first);
        },
      });
    u.setTarget(s);
    let left = createElement("div", { class: "gs-keys" }, [s, u.node]);
    (root.appendChild(
      createElement("div", { class: "page-header" }, [
        createElement("h1", { class: "page-title", text: translate("nav.search") }),
      ]),
    ),
      root.appendChild(createElement("div", { class: "gs-split" }, [left, results])));
    function open(item) {
      (Gn(s.value),
        "live" === item.kind
          ? pushRoute("player", { channel: item })
          : pushRoute("details", { kind: item.kind, id: item.id, item: item }));
    }
    function badge(text, cls) {
      return createElement("span", { class: "gs-badge " + cls, text: text });
    }
    function resultRow(item) {
      let live = "live" === item.kind,
        q = titleQuality(item),
        art = createElement("div", {
          class: "poster " + (live ? "gs-art-wide poster-contain" : "gs-art"),
          "data-src": (live ? item.logo : item.poster) || "",
          "data-title": displayTitle(item.name),
        });
      ai(art);
      let chips = createElement("div", { class: "gs-chips" }, [
        q ? badge(q.tag, "gs-q-" + q.tag.toLowerCase()) : null,
        badge(
          translate(
            live ? "search.channel" : "series" === item.kind ? "search.serie" : "search.movie",
          ),
          "gs-kind",
        ),
        item.rating ? badge("★ " + Number(item.rating).toFixed(1), "gs-rating") : null,
      ]);
      let node = createElement("div", { class: "gs-row focusable" }, [
        art,
        createElement("div", { class: "gs-text" }, [
          createElement("div", { class: "gs-title", dir: "auto", text: displayTitle(item.name) }),
          chips,
          // The full name as the provider lists it, and where: what tells two copies apart.
          createElement("div", {
            class: "gs-source",
            dir: "auto",
            text: item.name + (item.categoryName ? "   ·   " + item.categoryName : ""),
          }),
        ]),
      ]);
      return ((node.__item = item), node);
    }
    // Copies of the same title sit together, best quality first.
    function grouped(entries) {
      let order = [],
        groups = Object.create(null),
        seen = Object.create(null);
      for (let x of entries) {
        // A title listed in several categories is still one result.
        let q = titleQuality(x.item),
          same = hr(x.item.name) + "|" + (q ? q.tag : "");
        if (seen[x.item.id] || seen[same]) continue;
        seen[x.item.id] = seen[same] = !0;
        let k = hr(displayTitle(x.item.name));
        (groups[k] || ((groups[k] = []), order.push(k)), groups[k].push(x.item));
      }
      let out = [];
      for (let k of order) {
        let g = groups[k];
        (g.sort(
          (a, c) =>
            (titleQuality(a) || { rank: 2.5 }).rank - (titleQuality(c) || { rank: 2.5 }).rank,
        ),
          out.push.apply(out, g));
      }
      return out;
    }
    function scrollList(row) {
      let top = row.offsetTop,
        view = 800,
        cur = list.__scroll || 0,
        next = cur;
      (top - 60 < cur
        ? (next = Math.max(0, top - 60))
        : top + row.offsetHeight + 40 > cur + view && (next = top + row.offsetHeight + 40 - view),
        next !== cur &&
          ((list.__scroll = next), (list.style.transform = "translate3d(0," + -next + "px,0)")));
    }
    let run = a((text) => {
      runAsync(null, null, function* () {
        let q = qr(text);
        if ((clearChildren(list), (list.__scroll = 0), (list.style.transform = ""), q.length < 2))
          return void (status.textContent = translate("search.minChars"));
        br() || (status.textContent = translate("search.preparing"));
        let index;
        try {
          index = yield wr();
        } catch (err) {
          return void (
            gone ||
            qr(s.value) !== q ||
            (status.textContent = translate("search.unavailable"))
          );
        }
        if (gone || qr(s.value) !== q) return;
        u.refreshSuggestions();
        let sections = [
          { key: "search.series", entries: rankMatches(index.series, q, 120) },
          { key: "search.movies", entries: rankMatches(index.movies, q, 120) },
          { key: "search.channels", entries: rankMatches(index.live, q, 90) },
        ].filter((x) => x.entries.length);
        // The section whose best match is strongest comes first.
        sections.sort((x, y) => trendScore(y.entries[0]) - trendScore(x.entries[0]));
        if (!sections.length)
          return void (status.textContent = translate("search.nothing") + " “" + text.trim() + "”");
        status.textContent = "";
        for (let sec of sections) {
          list.appendChild(
            createElement("div", {
              class: "gs-section",
              text: translate(sec.key),
            }),
          );
          for (let item of grouped(sec.entries).slice(0, 40)) list.appendChild(resultRow(item));
        }
      }).catch(() => {});
    }, 300);
    s.addEventListener("input", () => run(s.value));
    return (
      root.addEventListener("focus-enter", (ev) => {
        list.contains(ev.target) && scrollList(ev.target);
      }),
      root.addEventListener("focus-activate", (ev) => {
        let row = ev.target.closest(".gs-row");
        row && row.__item && open(row.__item);
      }),
      {
        mount(t) {
          (t.appendChild(root),
            (status.textContent = translate("search.minChars")),
            // Build the index now, while the viewer reaches for the first letter, so
            // predictions and trending titles are there by the time they type.
            wr()
              .then(() => gone || u.refreshSuggestions())
              .catch(() => {}));
        },
        unmount() {
          ((gone = !0), clearChildren(root));
        },
        initialFocus: () => u.firstKey(),
        onKey(k) {
          if (k === KEY_GREEN) {
            let first = list.querySelector(".gs-row");
            if (first) return (focusElement(first), !0);
          }
          return !1;
        },
      }
    );
  }
  /** Saved accounts: switch between them, add one, remove one (Yellow/Blue). */
  function accountsScreen() {
    let page = createPage({
        title: translate("accounts.title"),
      }),
      list = createElement("div", {
        class: "settings-list",
        "data-focus-memory": "accounts",
      });
    function row(key, label, detail, value) {
      let r = createElement(
        "div",
        {
          class: "settings-row focusable",
        },
        [
          createElement("div", { class: "settings-text" }, [
            createElement("div", { class: "settings-label", dir: "auto", text: label }),
            createElement("div", { class: "settings-description", dir: "auto", text: detail }),
          ]),
          createElement("div", { class: "settings-value", text: value }),
        ],
      );
      return ((r.__key = key), r);
    }
    function render() {
      clearChildren(list);
      let cur = currentAccountId(),
        accts = readAccounts();
      // An account signed in before accounts were saved (or on another version) still counts.
      cur &&
        !accts.some((a) => a.id === cur) &&
        (rememberAccount(sourceKind(), "free" === cur ? null : readCredentials()),
        (accts = readAccounts()));
      for (let a of accts) {
        let free = "free" === a.kind,
          host = String(a.url || "").replace(/^https?:\/\//, ""),
          r = row(
            a.id,
            free
              ? translate("nav.freetv")
              : a.label
                ? a.label + "  ·  " + a.username
                : a.username || host,
            free ? translate("accounts.freeDetail") : host + ("m3u" === a.kind ? "  ·  M3U" : ""),
            a.id === cur ? translate("accounts.active") : "",
          );
        ((r.__account = a), a.id === cur && r.classList.add("active"), list.appendChild(r));
      }
      list.appendChild(
        row("add", translate("accounts.add"), translate("settings.accountDetail"), "+"),
      );
    }
    return (
      page.add(
        createElement("p", {
          class: "login-hint",
          text: translate("accounts.hint"),
        }),
      ),
      page.add(list),
      list.addEventListener("focus-activate", (ev) => {
        let r = ev.target.closest(".settings-row");
        if (!r) return;
        if ("add" === r.__key) return void navigateRoot("welcome", { fresh: !0 });
        r.__account &&
          showToast(
            translate(switchAccount(r.__account) ? "accounts.switching" : "accounts.already"),
          );
      }),
      {
        mount(t) {
          (t.appendChild(page.node), render());
        },
        unmount() {
          clearChildren(page.node);
        },
        initialFocus: () =>
          list.querySelector(".settings-row.active") || list.querySelector(".settings-row"),
        onKey(k) {
          if (k !== KEY_YELLOW && k !== KEY_BLUE) return !1;
          let f = focusedElement(),
            a = f && f.__account;
          if (!a) return !1;
          if (a.id === currentAccountId())
            return (showToast(translate("accounts.cantRemoveActive")), !0);
          writeAccounts(readAccounts().filter((x) => x.id !== a.id));
          try {
            for (let key of ACCOUNT_SCOPED_KEYS)
              localStorage.removeItem("iptv:acct:" + a.id + ":" + key);
          } catch (e) {}
          return (
            render(),
            ensureFocus(list.querySelector(".settings-row")),
            showToast(translate("accounts.removed")),
            !0
          );
        },
      }
    );
  }
  function jr() {
    let e = createPage({
        title: translate("settings.title"),
      }),
      t = createElement("div", {
        class: "settings-list",
        "data-focus-memory": "settings",
      });
    function n(e, t, n, r) {
      let s = createElement(
        "div",
        {
          class: "settings-row focusable",
        },
        [
          createElement(
            "div",
            {
              class: "settings-text",
            },
            [
              createElement("div", {
                class: "settings-label",
                text: t,
              }),
              createElement("div", {
                class: "settings-description",
                text: n,
              }),
            ],
          ),
          createElement("div", {
            class: "settings-value",
            text: r,
          }),
        ],
      );
      return ((s.__key = e), s);
    }
    function s() {
      clearChildren(t);
      let e = settings();
      (t.appendChild(
        n(
          "account",
          translate("settings.account"),
          readCredentials() && readCredentials().username
            ? readCredentials().url
            : translate("settings.accountDetail"),
          readCredentials() && readCredentials().username
            ? readCredentials().username
            : translate("welcome.signIn"),
        ),
      ),
        t.appendChild(
          n(
            "language",
            translate("settings.language"),
            translate("settings.languageDetail"),
            (LOCALES.filter((e) => e.code === currentLanguage())[0] || LOCALES[0]).label,
          ),
        ),
        t.appendChild(
          n(
            "preferLowerBitrate",
            "Cap quality at FHD",
            "4K streams rebuffer on this connection. Off lets 4K play when a channel offers it.",
            e.preferLowerBitrate ? translate("settings.on") : translate("settings.off"),
          ),
        ),
        // (Not offered on Samsung: it always uses HLS, see liveStreamFormat.)
        window.tizen ||
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
            e.heroTeaser ? translate("settings.on") : translate("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "heroTeaserSound",
            "Spotlight sound",
            "Plays the preview with sound.",
            e.heroTeaserSound ? translate("settings.on") : translate("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "seekThumbnails",
            "Pictures while seeking",
            "Shows a frame of where you will land as you skip through a film or episode. It opens the file a second time, so it is used only when the account allows two connections.",
            e.seekThumbnails ? translate("settings.on") : translate("settings.off"),
          ),
        ),
        t.appendChild(
          n(
            "showChannelNumbers",
            "Show channel numbers",
            "Displays the portal’s channel number beside each channel.",
            e.showChannelNumbers ? translate("settings.on") : translate("settings.off"),
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
        let key = t.__key,
          list = t.parentNode;
        let n = settings();
        switch (t.__key) {
          case "language": {
            let e = LOCALES.map((e) => e.code);
            return (
              (function (e) {
                setLanguageCode(e);
                try {
                  localStorage.setItem(LANGUAGE_KEY, e);
                } catch (e) {}
                applyDocumentLanguage();
                for (var __i = 0; __i < NAV_ITEMS.length; __i++) {
                  var __q = document.querySelector(
                    '.rail-item[data-route="' + NAV_ITEMS[__i].id + '"] .rail-label',
                  );
                  if (__q) __q.textContent = translate(NAV_ITEMS[__i].key);
                }
              })(e[(e.indexOf(currentLanguage()) + 1) % e.length]),
              void (navigateRoot("settings", {}),
              // The screen is rebuilt in the new language: stay on the Language row rather
              // than landing on the first row (Account).
              (function () {
                let r = Array.prototype.filter.call(
                  document.querySelectorAll(".settings-row"),
                  (x) => "language" === x.__key,
                )[0];
                r && focusElement(r, { exact: !0 });
              })())
            );
          }
          case "account":
            return void navigateRoot("account", {});
          case "preferLowerBitrate":
            saveSettings({
              preferLowerBitrate: !n.preferLowerBitrate,
            });
            break;
          case "liveFormat":
            saveSettings({
              liveFormat: "ts" === n.liveFormat ? "m3u8" : "ts",
            });
            break;
          case "heroTeaser":
            saveSettings({
              heroTeaser: !n.heroTeaser,
            });
            break;
          case "heroTeaserSound":
            saveSettings({
              heroTeaserSound: !n.heroTeaserSound,
            });
            break;
          case "seekThumbnails":
            saveSettings({
              seekThumbnails: !n.seekThumbnails,
            });
            break;
          case "showChannelNumbers":
            saveSettings({
              showChannelNumbers: !n.showChannelNumbers,
            });
            break;
          case "clearCache":
            return (le(), void showToast("Cached lists cleared"));
          case "signOut":
            return (
              (function () {
                credentialsCache = null;
                try {
                  localStorage.removeItem(CREDENTIALS_KEY);
                } catch (e) {}
              })(),
              le(),
              void navigateRoot("welcome", {})
            );
          default:
            return;
        }
        s();
        // The rows were rebuilt: keep focus on the one just changed.
        let again = Array.prototype.filter.call(
          list ? list.children : [],
          (r) => r.__key === key,
        )[0];
        again && focusElement(again, { exact: !0 });
      }),
      {
        mount(t) {
          (t.appendChild(e.node), s());
        },
        unmount() {
          clearChildren(e.node);
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
      a = createElement("div", {
        class: "pin-dots",
      }),
      l = createElement("div", {
        class: "pin-message",
        text: "Enter PIN",
      }),
      o = createElement("div", {
        class: "pin-keypad",
        "data-focus-memory": "pinlock",
      }),
      u = createElement(
        "div",
        {
          class: "pin-lock",
        },
        [
          createElement("div", {
            class: "pin-title",
            text: "🔒  Locked",
          }),
          l,
          a,
          o,
        ],
      );
    function c() {
      clearChildren(a);
      for (let e = 0; e < 4; e++)
        a.appendChild(
          createElement("span", {
            class: "pin-dot" + (e < s.length ? " filled" : ""),
          }),
        );
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
      let t = createElement("div", {
        class: "pin-key focusable",
        text: String(e),
      });
      ((t.__press = () => d(String(e))), o.appendChild(t));
    }
    let m = createElement("div", {
      class: "pin-key pin-key-action focusable",
      text: "⌫",
    });
    ((m.__press = () => {
      ((s = s.slice(0, -1)), c());
    }),
      o.appendChild(m));
    let h = createElement("div", {
      class: "pin-key focusable",
      text: "0",
    });
    ((h.__press = () => d("0")), o.appendChild(h));
    let f = createElement("div", {
      class: "pin-key pin-key-action focusable",
      text: "✕",
    });
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
          focusElement(o.querySelector(".pin-key"));
        },
      }
    );
  }
  function Kr() {
    let e = [],
      t = [],
      s = 0,
      a = !1,
      l = createElement("div", {
        class: "category-button category-search focusable",
        text: "⌕   Search free channels",
      }),
      o = createElement("div", {
        class: "pane-scroll",
      }),
      u = createElement(
        "div",
        {
          class: "category-pane",
          "data-focus-memory": "free-cats",
        },
        [
          createElement("div", {
            class: "pane-title",
            text: "Free channels",
          }),
          l,
          o,
        ],
      ),
      c = createElement("div", {
        class: "pane-scroll",
      }),
      d = createElement("div", {
        class: "pane-title",
        text: "Loading…",
      }),
      h = createElement(
        "div",
        {
          class: "channel-pane",
          "data-focus-memory": "free-items",
        },
        [d, c],
      ),
      f = mr(),
      p = _r({
        kind: "freetv",
        renderRow: (e) => bi(e, {}),
        onOpen: (e, t) => {
          pushRoute("player", {
            channel: e,
            siblings: t,
            index: t.indexOf(e),
          });
        },
      });
    p.node.hidden = !0;
    let g = createElement(
      "div",
      {
        class: "split split-with-preview",
      },
      [u, h, f.node],
    );
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
            clearChildren(e),
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
        return n
          ? wi(n, {
              active: t === s,
            })
          : null;
      }),
      k = b(c, 88, (e) => {
        let n = t[e];
        return n
          ? bi(n, {
              favorite: isFavourite(n),
            })
          : null;
      });
    function C(i) {
      return runAsync(this, null, function* () {
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
        (_(!1), focusElement(x.node(s)));
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
        if (n === l) return (y(!0), p.reset(), void focusElement(p.firstKey()));
        if (n.classList.contains("category-button")) {
          y(!1);
          let e = c.querySelector(".channel-row");
          e && focusElement(e);
        } else
          n.__item &&
            (f.isPreviewing(n.__item)
              ? (f.release(),
                pushRoute("player", {
                  channel: n.__item,
                  siblings: t,
                  index: t.indexOf(n.__item),
                }))
              : f.play(n.__item, n.__item.url));
      }),
      {
        mount(t) {
          (h.appendChild(p.node),
            h.appendChild(S.node),
            t.appendChild(g),
            (function () {
              return runAsync(this, null, function* () {
                if (((e = yield _t()), a)) return;
                (x.setTotal(e.length), focusInto(g, x.node(0)), yield C(0));
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
          ((a = !0), f.destroy(), clearChildren(g));
        },
        initialFocus: () => o.querySelector(".category-button"),
        onKey(e) {
          if (e === KEY_YELLOW || e === KEY_BLUE) {
            let e = focusedElement();
            if (e && e.__item) return (toggleFavourite(e.__item), !0);
          }
          return !1;
        },
      }
    );
  }
  var lastDirKey = 0,
    lastDirAt = 0;
  function zr() {
    (seedPresetAccounts(), registerTvKeys(), applyDocumentLanguage());
    let e = (function (e, t) {
      return (t || document).querySelector(e);
    })("#app");
    e.innerHTML = "";
    let t = dn(),
      r = createElement("div", {
        class: "content",
      });
    function s() {
      let e = currentRoute(),
        n = "player" === e;
      ((t.node.style.display = n ? "none" : ""),
        (r.style.left = n ? "0" : ""),
        n || t.setCurrent(e));
    }
    (e.appendChild(t.node),
      e.appendChild(r),
      setRouteRoot(r),
      (window.__router = l),
      registerRoute("welcome", ei),
      registerRoute("home", homeRoute),
      registerRoute("player", rr),
      registerRoute("details", ar),
      registerRoute("live", Ir),
      registerRoute("movies", Nr),
      registerRoute("series", Ar),
      registerRoute("favorites", Or),
      registerRoute("continue", Fr),
      registerRoute("history", historyScreen),
      registerRoute("search", Dr),
      registerRoute("settings", jr),
      registerRoute("freetv", Kr),
      registerRoute("account", accountsScreen),
      document.addEventListener("focus-moved", s),
      // Magic Remote pointer: focus follows the pointer and a click is OK. Only real
      // movement counts - Chromium re-sends a mousemove at the same spot when content
      // slides under a resting pointer, and following that would move focus on its own.
      (function () {
        let lx = -1,
          ly = -1,
          keyAt = -1e9,
          kx = -1,
          ky = -1;
        function target(e) {
          let t = e.target && e.target.closest ? e.target.closest(".focusable") : null,
            trap = document.querySelector("[data-focus-trap]");
          return !t || t.classList.contains("disabled") || (trap && !trap.contains(t)) ? null : t;
        }
        (document.addEventListener(
          "keydown",
          () => {
            ((keyAt = Date.now()), (kx = lx), (ky = ly));
          },
          !0,
        ),
          document.addEventListener("mousemove", (e) => {
            if (e.clientX === lx && e.clientY === ly) return;
            ((lx = e.clientX), (ly = e.clientY));
            // A hand resting on the Magic Remote jitters a few pixels. Just after a key press
            // that is not a choice to pull focus back under the pointer.
            if (Date.now() - keyAt < 1500 && Math.abs(lx - kx) + Math.abs(ly - ky) < 30) return;
            lastInputAt = Date.now();
            let t = target(e);
            t && t !== focusedEl && focusElement(t, { exact: !0 });
          }),
          document.addEventListener("click", (e) => {
            lastInputAt = Date.now();
            let t = target(e);
            t &&
              (t !== focusedEl && focusElement(t, { exact: !0 }),
              t.dispatchEvent(new CustomEvent("focus-activate", { bubbles: !0 })),
              e.preventDefault());
          }));
      })(),
      document.addEventListener("keydown", (e) => {
        let n = normalizeKey(e.keyCode),
          at = Date.now();
        lastInputAt = at;
        // The TV's keyboard is typing into a field: its keys (Delete, the caret's Left and
        // Right) are its own. Up or Down leaves the field and moves on as usual.
        let typing = nativeTypingInput();
        if (typing) {
          if (n !== KEY_UP && n !== KEY_DOWN) return;
          typing.blur();
        }
        // One press, one action: the same key again inside 50 ms is the remote echoing
        // itself, not the viewer pressing twice - for arrows, OK and Back alike.
        if (n === lastDirKey && at - lastDirAt < 50) return void e.preventDefault();
        ((lastDirKey = n), (lastDirAt = at));
        if (q(n)) return void e.preventDefault();
        let i = DIRECTION_BY_KEY[n];
        if (i) {
          let fromContent =
              "left" === i &&
              !!focusedEl &&
              document.contains(focusedEl) &&
              !t.node.contains(focusedEl) &&
              "none" !== t.node.style.display &&
              !document.querySelector("[data-focus-trap]"),
            moved = moveFocus(i);
          // Left out of a screen opens the menu on that screen's own item. Geometry alone
          // picked whichever item sat level with the button (Free TV, at the bottom, so
          // the next Down did nothing) and found none while the menu was animating shut.
          if (fromContent && (!moved || t.node.contains(focusedEl))) {
            let b = t.button(currentRoute());
            b
              ? focusElement(b, { exact: !0 })
              : moved || focusElement(t.button("home"), { exact: !0 });
          }
          return void e.preventDefault();
        }
        if (isSelectKey(n))
          return (
            focusedEl &&
              focusedEl.dispatchEvent(
                new CustomEvent("focus-activate", {
                  bubbles: !0,
                }),
              ),
            void e.preventDefault()
          );
        if (isBackKey(n)) {
          if (!goBack()) {
            // Back climbs out one level at a time: the content to the menu, another section
            // to Home, and Home (or the first-run welcome) out of the app, as webOS 23+ asks.
            let route = currentRoute(),
              b = t.button(route) || t.button("home");
            focusedEl !== b
              ? focusElement(b, { exact: !0 })
              : "home" === route || ("welcome" === route && "free" !== sourceKind() && null === readCredentials())
                ? exitApp()
                : (navigateRoot("home", {}), focusElement(t.button("home"), { exact: !0 }));
          }
          e.preventDefault();
        }
      }),
      "free" === sourceKind() || null !== readCredentials()
        ? ((function () {
            let e = 0;
            try {
              e = Number(localStorage.getItem(ae)) || 0;
            } catch (e) {}
            if (e && now() - e < 864e5) return !1;
            le();
            try {
              localStorage.setItem(ae, String(now()));
            } catch (e) {}
          })(),
          navigateRoot("home", {}),
          (function buildChannelIndex(force, attempt) {
            (!force && channelsByName
              ? Promise.resolve(channelsByName)
              : gn ||
                (gn = runAsync(null, null, function* () {
                  let e = yield liveCategories(),
                    t = Object.create(null),
                    partial = !1;
                  for (let n of e) {
                    let e;
                    try {
                      e = yield liveStreams(n.id);
                    } catch (e) {
                      partial = !0;
                      continue;
                    }
                    for (let i of e) {
                      let e = fn(i.name);
                      if (!e) continue;
                      let r = qualityTagFor(i.name) || qualityTagFor(n.name);
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
                  // A category that failed leaves the index short: fill it in once, later.
                  partial && !force && setTimeout(() => buildChannelIndex(!0), 12e4);
                  return ((gn = null), (channelsByName = t));
                }).catch((e) => {
                  throw ((gn = null), e);
                }))
            ).catch(() => {
              // The line was down at boot: build the index once it is back (bounded).
              (attempt || 0) < 10 &&
                setTimeout(
                  () => channelsByName || buildChannelIndex(!1, (attempt || 0) + 1),
                  Math.min(6e4, 15e3 * Math.pow(2, attempt || 0)),
                );
            });
          })())
        : navigateRoot("welcome", {}),
      s());
  }
  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", zr) : zr();
})();
