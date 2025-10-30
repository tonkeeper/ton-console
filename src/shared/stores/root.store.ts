import { UserStore } from 'src/entities/user/model/user.store';
import { AppStore } from './app.store';
import { client } from 'src/shared/api';

// Initialize API client with base URL from env
const apiClientBaseURL = import.meta.env.VITE_BASE_URL;
client.setConfig({ baseUrl: apiClientBaseURL, credentials: 'include' });

export const userStore = new UserStore();
export const appStore = new AppStore({ userStore });
