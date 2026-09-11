// dom: extracted from the recovered bundle. See docs/RECOVERY.md.

export function createElement(e, t, n) {
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

export function clearChildren(e) {
  for (; e.firstChild;) e.removeChild(e.firstChild);
  return e;
}
