# happy-dom VirtualConsole type reproduction

Reproduction for [happy-dom#1845](https://github.com/capricorn86/happy-dom/issues/1845): `VirtualConsole implements Console` causes TS2420 in environments where the global `Console` interface is extended (e.g. Bun).

## The problem

happy-dom's `VirtualConsole` declares `implements Console`. When a consumer uses `skipLibCheck: false` in an environment where `Console` has extra members (Bun adds `write()` and `[Symbol.asyncIterator]()`), TypeScript raises TS2420.

## Test matrix

This repo tests happy-dom's type declarations across three environments with `skipLibCheck: false`:

| Environment | Types | Console extensions |
|---|---|---|
| Node.js | `@types/node` | `Console` constructor property |
| Bun | `bun-types` | `write()`, `[Symbol.asyncIterator]()` |
| Browser (DOM) | `lib.dom.d.ts` | None |

## Structure

```
test-node/    — Node.js + @types/node
test-bun/     — Bun + bun-types
test-deno/    — Browser-like (lib.dom)
```

Each directory has the same `index.mts` test file that imports VirtualConsole and uses the Window API.
