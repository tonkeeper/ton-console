import { client } from './console/client.gen';
import { queryClient } from 'src/shared/lib/query-client';
import { accountLogout } from './console';

// Flag to prevent infinite logout loop when logout endpoint returns 401
let isLoggingOut = false;

/**
 * Setup global error interceptor for API client
 * Automatically logs out user on 401 Unauthorized responses
 * 
 * Note: Only triggers logout if user was previously authenticated
 */
export function setupApiInterceptors() {
  client.interceptors.error.use(async (error: unknown, response: Response, request: Request) => {
    // Check if this is a 401 Unauthorized error
    if (response.status === 401 && !isLoggingOut) {
      // Check if we have a user in cache - only logout if user was authenticated before
      const cachedUser = queryClient.getQueryData(['user']);
      
      // Only trigger logout if:
      // 1. User was previously authenticated (cachedUser exists and is not null)
      // 2. This is not the initial user info fetch (to avoid infinite loop on first load)
      const isUserInfoRequest = request.url.includes('/account/info');
      
      if (cachedUser && !isUserInfoRequest) {
        // Set flag to prevent infinite loop if logout endpoint also returns 401
        isLoggingOut = true;
        try {
          // Logout user automatically
          try {
            await accountLogout();
          } catch (e) {
            console.error('Logout API error:', e);
          }

          // Clear user from React Query cache
          // Projects will be automatically disabled through dependency chain
          queryClient.setQueryData(['user'], null);
        } finally {
          // Reset flag after logout completes
          isLoggingOut = false;
        }
      }
    }

    // Return error to continue error handling chain
    return error;
  });
}
