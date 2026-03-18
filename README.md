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

## The fix

The patch introduces a custom `IVirtualConsole` interface owned by happy-dom, replacing all `Console` type annotations:

1. **New `IVirtualConsole` interface** — contains all standard console methods with VirtualConsole's actual signatures
2. **`VirtualConsole implements IVirtualConsole`** instead of `implements Console`
3. **All `Console` type annotations** in BrowserWindow, BrowserPage, Browser, etc. changed to `IVirtualConsole`
4. **`ConsoleConstructor` import replaced** (already merged upstream as [PR #2095](https://github.com/capricorn86/happy-dom/pull/2095), not yet released in 20.8.3)

This works because `Console` (any runtime) is a superset of `IVirtualConsole` — `globalThis.console` remains assignable to `IVirtualConsole` in all environments.

## Test coverage

Each test file validates:
- `import type { IVirtualConsole } from 'happy-dom'` — type import works
- `new Window({ console: globalThis.console })` — native console passthrough works
- `const c: IVirtualConsole = window.console` — Window API usage works
- `const c: IVirtualConsole = globalThis.console` — native console assignability works
- `const c: IVirtualConsole = new VirtualConsole(printer)` — direct construction works

## Structure

```
test-node/    — Node.js + @types/node
test-bun/     — Bun + bun-types
test-deno/    — Browser-like (lib.dom)
patches/      — Unified diff patch for happy-dom@20.8.3
```
