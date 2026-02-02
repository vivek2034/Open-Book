
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical Render Error:", error);
    container.innerHTML = `
      <div style="color: white; padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #ef4444;">Application Error</h1>
        <p>There was a problem loading the app. This is usually due to a connection error or API issue.</p>
        <pre style="background: #1e293b; padding: 20px; border-radius: 8px; text-align: left; overflow: auto; max-width: 100%;">${error instanceof Error ? error.message : String(error)}</pre>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 99px; cursor: pointer; margin-top: 20px;">
          Retry Loading
        </button>
      </div>
    `;
  }
}
