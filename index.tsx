
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

const render = () => {
  if (!container) return;
  
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
      <div style="color: white; padding: 40px; text-align: center; font-family: sans-serif; background: #020617; height: 100vh;">
        <h1 style="color: #ef4444; font-size: 24px;">Application Failed to Start</h1>
        <p style="color: #94a3b8; margin: 10px 0 20px;">This is likely due to a dependency conflict or missing API Key.</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 12px; text-align: left; overflow: auto; max-width: 600px; margin: 0 auto; border: 1px solid #334155;">
          <code style="color: #f8fafc; font-size: 13px; line-height: 1.5;">
            ${error instanceof Error ? error.stack || error.message : String(error)}
          </code>
        </div>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 99px; cursor: pointer; margin-top: 30px; font-weight: 600;">
          Refresh Page
        </button>
      </div>
    `;
  }
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
