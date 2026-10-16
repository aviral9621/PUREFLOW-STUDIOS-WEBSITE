import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { setShellActive } from './lib/intro';

// Always open the site from the top (the hero) instead of letting the browser
// restore the previous scroll position (which could land visitors mid-page on
// the Work section after a reload). The app handles its own scroll-to-top.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// The homepage HTML already shows the navbar and hero (scripts/prerender.mjs).
// React replaces that markup on mount, starting from the same finished state.
const shell = document.getElementById('pf-shell');
if (shell) {
  if (location.pathname === '/') setShellActive(true);
  else shell.remove();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);