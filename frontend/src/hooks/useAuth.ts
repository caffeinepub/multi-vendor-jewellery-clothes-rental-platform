import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';
import type { UserRole } from '../backend';

export function useAuth() {
  const { identity, loginStatus, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const currentRole: UserRole | null = userProfile?.role ?? null;
  const isLoading = isInitializing || profileLoading;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return {
    isAuthenticated,
    currentRole,
    userProfile,
    isLoading,
    isFetched,
    showProfileSetup,
    loginStatus,
    identity,
  };
}
