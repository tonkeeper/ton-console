import React from 'react';
import App from 'src/app';
import { client } from 'src/shared/api';
import { createRoot } from 'react-dom/client';

// Initialize API client with base URL from env
const apiClientBaseURL = import.meta.env.VITE_BASE_URL;
client.setConfig({ baseUrl: apiClientBaseURL, credentials: 'include' });

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
