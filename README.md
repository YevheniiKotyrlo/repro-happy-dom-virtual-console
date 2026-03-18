# happy-dom VirtualConsole type reproduction

Reproduction for [happy-dom#1845](https://github.com/capricorn86/happy-dom/issues/1845): `VirtualConsole implements Console` causes TS2420 in environments where the global `Console` interface is extended (e.g. Bun).

## The problem

happy-dom's `VirtualConsole` declares `implements Console`. When a consumer uses `skipLibCheck: false` in an environment where `Console` has extra members (Bun adds `write()` and `[Symbol.asyncIterator]()`), TypeScript raises TS2420.

## Branches

- **`main`** — unpatched happy-dom@20.8.3, demonstrates the failure
- **`fix`** — same happy-dom@20.8.3 with a patch applied after install, demonstrates the fix

## Test matrix

All tests use `skipLibCheck: false` to trigger type checking of happy-dom's `.d.ts` files.

| Environment | Types | Console extensions |
|---|---|---|
| Node.js | `@types/node` | `Console` constructor property |
| Bun | `bun-types` | `write()`, `[Symbol.asyncIterator]()` |
| Browser (DOM) | `lib.dom.d.ts` | None |

### Expected results

| Environment | `main` (unpatched) | `fix` (patched) |
|---|---|---|
| Node.js + @types/node | PASS | PASS |
| Bun + bun-types | FAIL (TS2305 + TS2420) | PASS |
| Browser (lib.dom) | FAIL (TS2305) | PASS |

## The patch

The patch in `patches/happy-dom@20.8.3.patch` applies two changes to `VirtualConsole.d.ts`:

1. **Remove `implements Console`** — decouples VirtualConsole from the consumer's Console definition
2. **Replace `ConsoleConstructor` import with `Console['Console']`** — avoids importing from the `console` module (already merged upstream as [PR #2095](https://github.com/capricorn86/happy-dom/pull/2095), but not yet released in 20.8.3)

## Structure

```
test-node/    — Node.js + @types/node
test-bun/     — Bun + bun-types
test-deno/    — Browser-like (lib.dom)
patches/      — Unified diff patch for happy-dom@20.8.3
```

Each directory has the same `index.mts` test file that imports VirtualConsole and uses the Window API.
