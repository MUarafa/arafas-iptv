// focus: extracted from the recovered bundle. See docs/RECOVERY.md.

export function s(e, t) {
  return Array.prototype.slice.call((t || document).querySelectorAll(e));
}

export var o = ".focusable:not(.disabled):not([hidden])",
  focusedEl = null,
  // Where focus last was on screen, for when the focused node is re-rendered away.
  lastRect = null,
  c = Object.create(null),
  d = !0;

export function focusedElement() {
  return focusedEl;
}

export function h(e) {
  if (null === e.offsetParent && "fixed" !== getComputedStyle(e).position) return !1;
  let t = e.getBoundingClientRect();
  return t.width > 0 && t.height > 0;
}

export function f(e) {
  return s(o, e || document.querySelector("[data-focus-trap]") || document).filter(h);
}

export function p(e) {
  return {
    x: e.left + e.width / 2,
    y: e.top + e.height / 2,
  };
}

export function g(e, t, n) {
  let i,
    r,
    s = p(e),
    a = p(t);
  return (
    "left" === n || "right" === n
      ? ((i = "right" === n ? t.left - e.right : e.left - t.right),
        (r = Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top) > 0 ? 0 : Math.abs(a.y - s.y)))
      : ((i = "down" === n ? t.top - e.bottom : e.top - t.bottom),
        (r = Math.min(e.right, t.right) - Math.max(e.left, t.left) > 0 ? 0 : Math.abs(a.x - s.x))),
    i < -2 ? null : Math.max(i, 0) + 4 * r
  );
}

export function focusElement(e, t) {
  if (!e) return !1;
  let n =
    t && t.exact
      ? e
      : (function (e) {
          let t = e.closest("[data-focus-memory]");
          if (!t) return e;
          let n = t.getAttribute("data-focus-memory"),
            i = c[n];
          return (focusedEl && t.contains(focusedEl)) || !i || !t.contains(i) || !h(i) ? e : i;
        })(e);
  return (
    (d = !(!t || !t.provisional)),
    n === focusedEl ||
      (focusedEl &&
        (focusedEl.classList.remove("focused"), focusedEl.removeAttribute("data-focused")),
      (focusedEl = n).classList.add("focused"),
      focusedEl.setAttribute("data-focused", ""),
      (lastRect = focusedEl.getBoundingClientRect()),
      (function (e) {
        let t = e.closest("[data-focus-memory]");
        t && (c[t.getAttribute("data-focus-memory")] = e);
      })(focusedEl),
      focusedEl.dispatchEvent(
        new CustomEvent("focus-enter", {
          bubbles: !0,
        }),
      ),
      document.dispatchEvent(
        new CustomEvent("focus-moved", {
          detail: {
            node: focusedEl,
          },
        }),
      )),
    !0
  );
}

export function moveFocus(e) {
  let t = (function (e, t) {
    let n = t || focusedEl,
      attached = !!n && document.contains(n) && h(n);
    // A focused node that was re-rendered away or hidden has no position of its own: move
    // from where it last was, so the press lands next to it rather than on the first item
    // of the screen (which reads as "the menu jumped").
    if (!attached) {
      if (!lastRect) return f()[0] || null;
      n = null;
    }
    let axis = "up" === e || "down" === e ? "vertical" : "horizontal",
      i = n ? n.getBoundingClientRect() : lastRect,
      r = (function () {
        let c = n && n.closest("[data-focus-contain]");
        return c && c.getAttribute("data-focus-contain") === axis ? c : null;
      })(),
      a = null,
      l = 1 / 0;
    for (let t of r ? s(o, r).filter(h) : f()) {
      if (t === n) continue;
      // A container that keeps moves along one axis inside it (the rail) is not entered
      // along that axis from outside either: Up from the spotlight must not land in the menu.
      let c = t.closest("[data-focus-contain]");
      if (c && c !== r && c.getAttribute("data-focus-contain") === axis) continue;
      let d = g(i, t.getBoundingClientRect(), e);
      null === d || d >= l || ((l = d), (a = t));
    }
    return a;
  })(e);
  return t
    ? focusElement(t)
    : (focusedEl &&
        focusedEl.dispatchEvent(
          new CustomEvent("focus-edge", {
            bubbles: !0,
            detail: {
              dir: e,
            },
          }),
        ),
      !1);
}

export function ensureFocus(e) {
  (focusedEl &&
    !document.contains(focusedEl) &&
    (focusedEl.classList.remove("focused"), (focusedEl = null)),
    focusedEl ||
      focusElement(e || f()[0], {
        provisional: !0,
      }));
}

export function focusInto(e, t) {
  return !(!t || !e || (focusedEl && e.contains(focusedEl)) || !d) && focusElement(t);
}
