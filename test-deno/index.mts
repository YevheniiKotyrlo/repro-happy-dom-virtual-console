// Test: Import VirtualConsole type (triggers TS2420 on unpatched happy-dom in Bun)
import type VirtualConsole from 'happy-dom/lib/console/VirtualConsole.js';
export type { VirtualConsole };

// Test: Use Window class — the main consumer API
import { Window } from 'happy-dom';

const window = new Window();
window.console.log('test');
window.close();
