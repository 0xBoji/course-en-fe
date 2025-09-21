// Re-export authentication hooks from auth context
export { 
  useAuth, 
  useIsAuthenticated, 
  useCurrentUser 
} from '@/lib/auth/auth-context';

// Additional authentication-related hooks can be added here
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/auth-context';
import type { LoginRequest } from '@/lib/types';

// Hook for login mutation with React Query integration
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      // Invalidate all queries on successful login
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      // Silent error handling
    },
  });
}

// Hook for logout with React Query integration
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return () => {
    logout();
    // Clear all cached data on logout
    queryClient.clear();
  };
}
