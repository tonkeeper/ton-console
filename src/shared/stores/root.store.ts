import { AppStore } from './app.store';
import { client } from 'src/shared/api';

// Initialize API client with base URL from env
const apiClientBaseURL = import.meta.env.VITE_BASE_URL;
client.setConfig({ baseUrl: apiClientBaseURL, credentials: 'include' });

export const appStore = new AppStore();
