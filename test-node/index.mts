// Test: Import IVirtualConsole type
import type { IVirtualConsole } from 'happy-dom';
import { Window, VirtualConsole, VirtualConsolePrinter } from 'happy-dom';

// Test: Use Window API with native console
const window = new Window({ console: globalThis.console });
const console: IVirtualConsole = window.console;
console.log('test');
window.close();

// Test: globalThis.console assignable to IVirtualConsole
const nativeConsole: IVirtualConsole = globalThis.console;
nativeConsole.log('native');

// Test: VirtualConsole assignable to IVirtualConsole
const vc: IVirtualConsole = new VirtualConsole(new VirtualConsolePrinter());
vc.log('virtual');
