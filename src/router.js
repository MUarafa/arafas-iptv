// router: extracted from the recovered bundle. See docs/RECOVERY.md.

import { clearChildren } from "./dom.js";
import { ensureFocus } from "./focus.js";

export var routeTable = Object.create(null),
  routeHistory = [],
  routeRoot = null,
  activeScreen = null,
  activeRouteName = null;

export function registerRoute(e, t) {
  routeTable[e] = t;
}

export function setRouteRoot(e) {
  routeRoot = e;
}

export function currentRoute() {
  return activeRouteName;
}

export function renderRoute(e, t) {
  let n = routeTable[e];
  if (!n) throw new Error("Unknown view: " + e);
  if (activeScreen && activeScreen.unmount)
    try {
      activeScreen.unmount();
    } catch (e) {}
  (clearChildren(routeRoot),
    (activeRouteName = e),
    (activeScreen = n(t || {})).mount(routeRoot),
    ensureFocus(activeScreen.initialFocus ? activeScreen.initialFocus() : null));
}

export function navigateRoot(e, t) {
  ((routeHistory.length = 0), renderRoute(e, t));
}

export function pushRoute(e, t) {
  (activeRouteName &&
    routeHistory.push({
      name: activeRouteName,
      params: activeRouteParams,
    }),
    (activeRouteParams = t),
    renderRoute(e, t));
}

export var activeRouteParams = null;

export function replaceRoute(e, t) {
  ((activeRouteParams = t), renderRoute(e, t));
}

export function goBack() {
  let e = routeHistory.pop();
  return !!e && ((activeRouteParams = e.params), renderRoute(e.name, e.params), !0);
}
