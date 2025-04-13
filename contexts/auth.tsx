import { useStorageState } from '@/hooks/useStorageState';
import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';

const AuthContext = createContext<{
  signIn: (accessToken: string) => void;
  signOut: () => void;
  accessToken?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoadingAccessToken, accessToken], setAccessToken] = useStorageState('accessToken');
  return (
    <AuthContext.Provider
      value={{
        signIn: (accessToken: string) => {
          setAccessToken(accessToken);
        },
        signOut: () => {
          setAccessToken(null);
        },
        accessToken,
        isLoading: isLoadingAccessToken,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
