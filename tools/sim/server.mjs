// A stand-in Xtream provider plus a static host for app/, for the simulator.
//
// Everything the app asks a real portal for is generated here from a small config,
// and every endpoint can be told to misbehave the way real providers do: answer late,
// never answer, answer with an ISP's HTML page, with broken JSON, with nothing at all.
// No dependencies - Node's http module only.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../app");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

export const DEFAULT_CONFIG = {
  liveCategories: 6,
  channelsPerCategory: 24,
  vodCategories: 5,
  moviesPerCategory: 30,
  seriesCategories: 3,
  seriesPerCategory: 12,
  seasons: 2,
  episodesPerSeason: 6,
  maxConnections: 1,
  // "ok" | "fail" | "expired" | "html"
  auth: "ok",
  latencyMs: 0,
  // action -> { status, body: "html" | "badjson" | "empty" | "null" | "hang", latencyMs, times }
  // `times` limits how many requests misbehave before the endpoint recovers.
  faults: {},
  // "ok" | "fail"
  images: "ok",
  // "mixed" | "weird"
  names: "mixed",
};

const LIVE_NAMES = [
  "MBC 1 HD", "MBC 1 FHD", "MBC 1 SD", "beIN Sports 1 4K", "beIN Sports 1 HD",
  "ON Time Sports FHD", "Al Jazeera", "CBC", "الحياة", "القاهرة والناس", "Rotana Cinema",
  "Nile Drama", "روتانا سينما HD", "DMC", "Sky News Arabia", "National Geographic",
];
const MOVIE_NAMES = [
  "Enola Holmes 3 (2026)", "Seduced by His Lies (2026)", "الممر", "Key to the Castle",
  "Kira & El Gin", "The Long Night", "ولاد رزق 3", "Northern Lights", "Harbour", "Blue Hour",
];
const WEIRD_NAMES = [
  "", "   ", "<img src=x onerror=window.__xss=1>", "💥🎬📺 Emoji Channel",
  "A".repeat(300), "مسلسل ‏طويل جداً ".repeat(12), "null", "undefined", "‮right-to-left override",
];

function nameFor(list, i, config) {
  if (config.names === "weird" && i % 3 === 0) return WEIRD_NAMES[i % WEIRD_NAMES.length];
  let base = list[i % list.length];
  return i < list.length ? base : base + " " + (Math.floor(i / list.length) + 1);
}

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
const epoch = (d) => Math.floor(d / 1000);

function user(config) {
  let now = Date.now();
  return {
    user_info: {
      username: "sim",
      password: "sim",
      auth: config.auth === "fail" ? 0 : 1,
      status: config.auth === "expired" ? "Expired" : "Active",
      exp_date: String(epoch(now + 90 * 864e5)),
      is_trial: "0",
      active_cons: "0",
      max_connections: String(config.maxConnections),
      allowed_output_formats: ["m3u8", "ts"],
    },
    server_info: { url: "127.0.0.1", timezone: "Africa/Cairo", time_now: new Date(now).toISOString() },
  };
}

function categories(kind, count) {
  let label = { live: ["Egypt", "Sports", "News", "Arabic", "Kids", "Documentary"],
    vod: ["Netflix", "Arabic Movies", "Action", "Drama", "Comedy"],
    series: ["Ramadan", "Turkish", "Netflix Series"] }[kind];
  return Array.from({ length: count }, (_, i) => ({
    category_id: String((kind === "live" ? 100 : kind === "vod" ? 200 : 300) + i),
    category_name: (label[i % label.length] || kind) + (i >= label.length ? " " + i : ""),
    parent_id: 0,
  }));
}

function catIndex(url, base) {
  return Math.max(0, Number(url.searchParams.get("category_id")) - base);
}

function api(url, config) {
  let action = url.searchParams.get("action") || "";
  let host = `http://${url.host}`;
  let img = (w, h, label) => `${host}/img/${w}x${h}/${encodeURIComponent(label)}.svg`;
  switch (action) {
    case "":
      return user(config);
    case "get_live_categories":
      return categories("live", config.liveCategories);
    case "get_vod_categories":
      return categories("vod", config.vodCategories);
    case "get_series_categories":
      return categories("series", config.seriesCategories);
    case "get_live_streams": {
      let c = catIndex(url, 100);
      return Array.from({ length: config.channelsPerCategory }, (_, i) => ({
        num: c * 1000 + i + 1,
        name: nameFor(LIVE_NAMES, i, config),
        stream_type: "live",
        stream_id: 10000 + c * 1000 + i,
        stream_icon: i % 5 === 4 ? "" : img(200, 200, "ch" + i),
        epg_channel_id: i % 2 ? "ch" + i : null,
        added: String(epoch(Date.now() - i * 3600e3)),
        category_id: String(100 + c),
        tv_archive: 0,
      }));
    }
    case "get_vod_streams": {
      let c = catIndex(url, 200);
      return Array.from({ length: config.moviesPerCategory }, (_, i) => ({
        num: i + 1,
        name: nameFor(MOVIE_NAMES, i, config),
        stream_type: "movie",
        stream_id: 20000 + c * 1000 + i,
        stream_icon: img(400, 600, "movie" + i),
        rating: String(5 + ((i * 7) % 50) / 10),
        rating_5based: 4,
        added: String(epoch(Date.now() - i * 864e5)),
        category_id: String(200 + c),
        container_extension: i % 4 === 0 ? "mp4" : "mkv",
      }));
    }
    case "get_series": {
      let c = catIndex(url, 300);
      return Array.from({ length: config.seriesPerCategory }, (_, i) => ({
        num: i + 1,
        name: nameFor(["مرحبا دولة", "The Crown", "Paranormal", "Lost Signal"], i, config),
        series_id: 30000 + c * 1000 + i,
        cover: img(400, 600, "series" + i),
        plot: "A series plot.",
        genre: "Drama",
        releaseDate: "2026-01-01",
        last_modified: String(epoch(Date.now() - i * 864e5)),
        rating: "7.5",
        category_id: String(300 + c),
      }));
    }
    case "get_vod_info": {
      let id = Number(url.searchParams.get("vod_id"));
      return {
        info: {
          name: nameFor(MOVIE_NAMES, id % 1000, config),
          movie_image: img(400, 600, "poster" + id),
          backdrop_path: [img(1920, 1080, "backdrop" + id)],
          plot: "تتبع المغامرة المحققة إينولا هولمز إلى مالطا.",
          genre: ["Adventure / Mystery", "Thriller / TV Movie", "Drama", "Action"][id % 4],
          releasedate: "2026-07-01",
          rating: "8.1",
          duration_secs: 6300,
        },
        movie_data: { stream_id: id, name: "m" + id, container_extension: id % 4 === 0 ? "mp4" : "mkv" },
      };
    }
    case "get_series_info": {
      let id = Number(url.searchParams.get("series_id"));
      let episodes = {};
      for (let s = 1; s <= config.seasons; s++)
        episodes[String(s)] = Array.from({ length: config.episodesPerSeason }, (_, e) => ({
          id: String(40000 + ((id % 1000) * 100 + s * 10 + e)),
          episode_num: e + 1,
          title: "Episode " + (e + 1),
          container_extension: "mkv",
          info: { plot: "Episode plot", duration_secs: 2400, movie_image: img(640, 360, "ep" + e) },
        }));
      return {
        info: { name: "Series " + id, cover: img(400, 600, "s" + id), plot: "Plot", genre: "Drama",
          rating: "7.9", backdrop_path: [img(1920, 1080, "sb" + id)] },
        episodes,
      };
    }
    case "get_short_epg": {
      let start = Date.now() - 20 * 60e3;
      let fmt = (t) => new Date(t).toISOString().slice(0, 19).replace("T", " ");
      return {
        epg_listings: Array.from({ length: 4 }, (_, i) => ({
          title: b64(i ? "Next show " + i : "النشرة"),
          description: b64("Description " + i),
          start: fmt(start + i * 60 * 60e3),
          end: fmt(start + (i + 1) * 60 * 60e3),
          now_playing: i === 0 ? 1 : 0,
        })),
      };
    }
    default:
      return [];
  }
}

// Added for 30-network (config.shape === "sparse"): drop or reshape the optional fields
// real providers leave out or send in another type. Only applied when asked for.
function sparsify(action, data) {
  let each = (list, fn) => (Array.isArray(list) ? list.map((x, i) => (fn(x, i), x)) : list);
  switch (action) {
    case "get_live_categories":
    case "get_vod_categories":
    case "get_series_categories":
      return each(data, (c, i) => {
        if (i % 2) c.category_name = null;
        delete c.parent_id;
      });
    case "get_live_streams":
      return each(data, (s, i) => {
        delete s.stream_icon;
        delete s.added;
        delete s.epg_channel_id;
        if (i % 3 === 0) s.num = null;
      });
    case "get_vod_streams":
      return each(data, (s, i) => {
        delete s.stream_icon;
        delete s.rating;
        delete s.added;
        delete s.container_extension;
        if (i % 2) s.rating = "";
      });
    case "get_series":
      return each(data, (s) => {
        delete s.cover;
        delete s.rating;
        delete s.last_modified;
        s.plot = null;
        s.genre = null;
      });
    case "get_vod_info":
      return { info: [], movie_data: data.movie_data };
    case "get_series_info": {
      // episodes keyed by season, each season an object keyed by index instead of an array;
      // info as [] instead of {}; one empty season.
      let episodes = {};
      for (let k of Object.keys(data.episodes)) {
        let obj = {};
        data.episodes[k].forEach((e, i) => {
          delete e.info;
          delete e.container_extension;
          obj[i] = e;
        });
        episodes[k] = obj;
      }
      episodes["99"] = [];
      return { info: [], episodes };
    }
    case "get_short_epg":
      return { epg_listings: [{ title: "not base64 !!", start: null, end: null }] };
    default:
      return data;
  }
}

function svg(w, h, label) {
  let hue = [...label].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="100%" height="100%" fill="hsl(${hue},45%,30%)"/>` +
    `<text x="50%" y="50%" fill="#fff" font-size="${Math.round(h / 12)}" text-anchor="middle">${label.replace(/[<&]/g, "")}</text></svg>`;
}

export function startServer(port = 0) {
  let config = structuredClone(DEFAULT_CONFIG);
  let faultUses = {};
  let hits = [];
  let hanging = new Set();

  const server = http.createServer(async (req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}`);
    try {
      if (url.pathname.startsWith("/app/")) {
        let file = path.join(APP_ROOT, decodeURIComponent(url.pathname.slice(5)) || "index.html");
        if (!file.startsWith(APP_ROOT) || !fs.existsSync(file)) return send(res, 404, "text/plain", "not found");
        return send(res, 200, TYPES[path.extname(file)] || "application/octet-stream", fs.readFileSync(file));
      }
      if (url.pathname.startsWith("/img/")) {
        if (config.images === "fail") return send(res, 404, "text/plain", "no image");
        let [, , size, name] = url.pathname.split("/");
        let [w, h] = size.split("x").map(Number);
        return send(res, 200, "image/svg+xml", svg(w || 100, h || 100, decodeURIComponent(name || "").replace(/\.svg$/, "")));
      }
      if (url.pathname === "/player_api.php") {
        let action = url.searchParams.get("action") || "auth";
        hits.push({ action, at: Date.now(), query: Object.fromEntries(url.searchParams) });
        let fault = config.faults[action] || config.faults["*"];
        if (fault && fault.times != null) {
          faultUses[action] = (faultUses[action] || 0) + 1;
          if (faultUses[action] > fault.times) fault = null;
        }
        let delay = (fault && fault.latencyMs) || config.latencyMs;
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (fault) {
          if (fault.body === "hang") return void hanging.add(res);
          if (fault.body === "html")
            return send(res, fault.status || 200, "text/html", "<!DOCTYPE html><html><body>Your ISP has a message for you</body></html>");
          if (fault.body === "badjson") return send(res, fault.status || 200, "application/json", '{"user_info": [1, 2');
          if (fault.body === "empty") return send(res, fault.status || 200, "application/json", "");
          if (fault.body === "null") return send(res, fault.status || 200, "application/json", "null");
          // Added for 30-network: shapes real portals and captive portals answer with.
          if (fault.body === "html-ws")
            return send(res, fault.status || 200, "text/html", "\r\n\r\n  <!DOCTYPE html><html><body>Your ISP has a message for you</body></html>");
          if (fault.body === "html-head")
            return send(res, fault.status || 200, "text/html", '<head><meta http-equiv="refresh" content="0;url=http://10.0.0.1/"></head>');
          if (fault.body === "error-json")
            return send(res, fault.status || 200, "application/json", '{"user_info":{"auth":0}}');
          if (fault.body === "object") return send(res, fault.status || 200, "application/json", "{}");
          if (fault.status) return send(res, fault.status, "text/plain", "error " + fault.status);
        }
        if (config.auth === "html" && action === "auth")
          return send(res, 200, "text/html", "<html><body>portal moved</body></html>");
        let payload = api(url, config);
        if (config.shape === "sparse") payload = sparsify(action, payload);
        return send(res, 200, "application/json", JSON.stringify(payload));
      }
      // Added for 30-network: a local M3U playlist host.
      //   /m3u/list.m3u  -> config.m3uChannels channels in 4 groups
      //   /m3u/html.m3u  -> an HTML page (captive portal)
      //   anything else  -> 404
      if (url.pathname.startsWith("/m3u/")) {
        hits.push({ action: "m3u:" + url.pathname, at: Date.now(), query: {} });
        if (config.latencyMs) await new Promise((r) => setTimeout(r, config.latencyMs));
        if (url.pathname === "/m3u/html.m3u") return send(res, 200, "text/html", "<html><body>login to wifi</body></html>");
        if (url.pathname === "/m3u/hang.m3u") return void hanging.add(res);
        if (url.pathname !== "/m3u/list.m3u") return send(res, 404, "text/plain", "no playlist");
        let lines = ["#EXTM3U"];
        for (let i = 0; i < (config.m3uChannels || 50); i++)
          lines.push(
            `#EXTINF:-1 tvg-id="c${i}" tvg-logo="http://${url.host}/img/200x200/m${i}.svg" group-title="${["News", "Sports", "Kids", ""][i % 4]}",${nameFor(LIVE_NAMES, i, config)}`,
            `http://${url.host}/stream/m3u/${i}.m3u8`,
          );
        return send(res, 200, "audio/x-mpegurl", lines.join("\n"));
      }
      send(res, 404, "text/plain", "not found");
    } catch (e) {
      send(res, 500, "text/plain", String(e && e.stack));
    }
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      resolve({
        port: server.address().port,
        get config() {
          return config;
        },
        setConfig(patch) {
          config = Object.assign(structuredClone(DEFAULT_CONFIG), patch);
          faultUses = {};
        },
        hits,
        close() {
          for (let r of hanging) r.destroy();
          server.closeAllConnections && server.closeAllConnections();
          return new Promise((r) => server.close(r));
        },
      });
    });
  });
}

function send(res, status, type, body) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" });
  res.end(body);
}
