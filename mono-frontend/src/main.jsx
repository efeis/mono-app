import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
