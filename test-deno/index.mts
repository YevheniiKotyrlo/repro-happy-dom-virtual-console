// Test: Import IVirtualConsole type
import type { IVirtualConsole } from 'happy-dom';
import { Window } from 'happy-dom';

// Test: Use Window API
const window = new Window();
const console: IVirtualConsole = window.console;
console.log('test');
window.close();

// Test: globalThis.console assignable to IVirtualConsole
const nativeConsole: IVirtualConsole = globalThis.console;
nativeConsole.log('native');
