import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { StoreProvider } from './store';
import './index.css';
import { storage } from './lib/storage';
import { pull, isAuthed } from './lib/sync';

// The ported UI reads/writes through window.storage. Back it with our
// local-first, cloud-syncing store.
window.storage = storage;

// On launch, hydrate from the cloud if signed in. Any failure (offline, server
// down) silently falls back to the local copy — the app must always open.
(async () => {
  try {
    if (await isAuthed()) await pull();
  } catch {
    /* offline-first: ignore and render local state */
  }
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </React.StrictMode>,
  );
})();
