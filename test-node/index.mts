import { Window } from 'happy-dom';

// Test: Use Window API with native console passthrough
const window = new Window({ console: globalThis.console });
window.console.log('test');
window.close();
