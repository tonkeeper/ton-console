import { client } from './client.gen';
import type { UserStore } from 'src/entities/user/model/user.store';

// Flag to prevent infinite logout loop when logout endpoint returns 401
let isLoggingOut = false;

/**
 * Setup global error interceptor for API client
 * Automatically logs out user on 401 Unauthorized responses
 */
export function setupApiInterceptors(userStore: UserStore) {
  client.interceptors.error.use(async (error: unknown, response: Response) => {
    // Check if this is a 401 Unauthorized error
    if (response.status === 401 && !isLoggingOut) {
      // Set flag to prevent infinite loop if logout endpoint also returns 401
      isLoggingOut = true;
      try {
        // Logout user automatically
        await userStore.logout();
      } finally {
        // Reset flag after logout completes
        isLoggingOut = false;
      }
    }

    // Return error to continue error handling chain
    return error;
  });
}
