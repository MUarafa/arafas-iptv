# Contributing

Thanks for looking. This project has an unusual history — the original sources were
lost and the app was recovered from a running TV — so it is worth knowing how it is
put together before you change anything.

## The shape of it

```
src/keys.js     remote-control key codes
src/dom.js      element helpers
src/i18n.js     six languages, RTL, the language cache
src/focus.js    the d-pad focus engine
src/router.js   screens and history
src/app.js      everything else: the Xtream client, storage, and every screen
app/bundle.js   the build output that gets packaged (generated, but committed)
```

`src/app.js` is still large. Splitting more of it out is the most useful thing
anyone can do — see *Good first tasks*.

## Build and install

```bash
npm install
npm run build                  # regenerate app/bundle.js from src/
./build.sh                     # package an .ipk
./build.sh install             # package, then install on your webOS TVs
```

## Two checks that matter

Because this code was recovered rather than written, a refactor can look fine and
still be wrong. Two tools exist to stop that, and `build.sh` runs the second one:

```bash
node tools/verify-equivalence.mjs HEAD   # did any literal change?
node tools/check-globals.mjs             # does every name still resolve?
```

`verify-equivalence` parses the built bundle before and after your change and compares
every string and number literal. Renaming identifiers or moving declarations between
modules cannot alter a literal, so if any changed, the refactor did more than it
claimed. `check-globals` catches the other failure: a call that now points at nothing.
The build succeeds, and the app breaks only when someone opens that screen.

If you are changing behaviour on purpose, the literals will change — that is expected.
Say so in the pull request.

## Good first tasks

- **Move a screen out of `src/app.js`.** Use `node tools/split-module.mjs <name>
  <bindings...>`; it refuses to move anything that would still depend on code left
  behind, so it will tell you what else belongs with it.
- **Give more names back.** `node tools/inspect-bindings.mjs` lists what is still
  called `Bn` or `zt`, ordered by how often it is used; `node tools/show-fn.mjs <name>`
  prints the body so you can name it from evidence. Put the mapping in
  `tools/rename-map.json` and run `node tools/rename.mjs`.

## Testing on a TV

There is no emulator worth the trouble. Put an LG TV in Developer Mode, then
`./build.sh install`. If you have the developer inspector open you can drive the app
over the Chrome DevTools Protocol — that is how the recovery and every fix in the
changelog were verified.

## Style

Run `npm run format` (Prettier, 100 columns) before opening a pull request.
