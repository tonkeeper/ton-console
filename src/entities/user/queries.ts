import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DTOUser, getUserInfo, authViaTg, accountLogout } from 'src/shared/api';
import { User } from './model/interfaces/user';
import { loginViaTG } from './model/telegram-oauth';
import { AxiosError } from 'axios';

/**
 * Map DTO to domain User model
 */
function mapDTOUserToUser(user: DTOUser): User {
    return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        name: [user.first_name, user.last_name].join(' '),
        imageUrl: user.avatar,
        referralId: user.referral_id,
        referralCount: user.referrals_count
    };
}

/**
 * Query hook to fetch current user info
 *
 * Note: This query runs ONCE on initial load and is cached.
 * It returns null for 401 errors (user not authenticated), which is expected behavior.
 * The initial 401 response is normal and not an error.
 */
export function useUserQuery() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<User | null> => {
            try {
                const { data, error } = await getUserInfo();

                console.log('[useUserQuery] API response:', { data, error });

                if (error) {
                    console.log('[useUserQuery] Error details:', error);
                    
                    // Check for authentication errors in various formats
                    
                    // 1. Standard Axios 401 error
                    if (error instanceof AxiosError && error.response?.status === 401) {
                        console.log('[useUserQuery] 401 detected (AxiosError), returning null');
                        return null;
                    }
                    
                    // 2. API custom error format: {error: string, code: number}
                    if (error && typeof error === 'object' && 'code' in error && 'error' in error) {
                        const apiError = error as { error: string; code: number };
                        // code: 0 typically means authentication error
                        if (apiError.code === 0 || apiError.error.toLowerCase().includes('auth')) {
                            console.log('[useUserQuery] Auth error detected (code 0 or auth message), returning null');
                            return null;
                        }
                    }
                    
                    // 3. Direct status check
                    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
                        console.log('[useUserQuery] 401 detected (direct status), returning null');
                        return null;
                    }
                    
                    throw error;
                }

                return mapDTOUserToUser(data.user);
            } catch (e) {
                console.log('[useUserQuery] Caught exception:', e);
                // If 401, user is not authenticated - this is expected, return null
                if (e instanceof AxiosError && e.response?.status === 401) {
                    console.log('[useUserQuery] 401 in catch, returning null');
                    return null;
                }
                // Check any object with status 401
                if (e && typeof e === 'object' && 'status' in e && (e as any).status === 401) {
                    console.log('[useUserQuery] 401 in catch (direct status), returning null');
                    return null;
                }
                throw e;
            }
        },
        retry: false, // Don't retry - if user is not authenticated, it's expected
        staleTime: Infinity, // Never consider data stale - only refetch on manual invalidation
        gcTime: Infinity, // Keep user data in cache indefinitely
        refetchOnMount: false, // Don't refetch on component mount - use cached data
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        refetchOnReconnect: false // Don't refetch on network reconnect
    });
}

/**
 * Mutation hook for user login via Telegram
 */
export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (): Promise<User> => {
            const tgOAuthResponse = await loginViaTG();

            if (!tgOAuthResponse) {
                throw new Error('Telegram OAuth failed');
            }

            const url = window.location.href;
            const params = new URLSearchParams(new URL(url).search);
            const referral_id = params.get('referral') ?? undefined;

            const { error } = await authViaTg({
                body: { ...tgOAuthResponse, referral_id }
            });

            if (error) throw error;

            // Fetch user info after successful auth
            const { data: userData, error: userError } = await getUserInfo();

            if (userError) throw userError;

            return mapDTOUserToUser(userData.user);
        },
        onSuccess: user => {
            // Update user in cache
            queryClient.setQueryData(['user'], user);

            // Projects will be loaded by ProjectContext automatically
        },
        onError: error => {
            console.error('Login failed:', error);
        }
    });
}

/**
 * Mutation hook to update current user info
 */
export function useUpdateUserMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (): Promise<User> => {
            const { data, error } = await getUserInfo();

            if (error) throw error;

            return mapDTOUserToUser(data.user);
        },
        onSuccess: user => {
            // Update user in cache
            queryClient.setQueryData(['user'], user);
        }
    });
}

/**
 * Mutation hook for user logout
 */
export function useLogoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (): Promise<void> => {
            try {
                const { error } = await accountLogout();
                if (error) {
                    console.error('Logout API error:', error);
                }
            } catch (e) {
                console.error('Logout failed:', e);
            }
        },
        onSuccess: () => {
            // Clear user from cache
            // Projects will be automatically disabled through dependency chain
            queryClient.setQueryData(['user'], null);

            // Clear all other cached data
            queryClient.clear();
        }
    });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
    const { data: user } = useUserQuery();
    return !!user;
}
