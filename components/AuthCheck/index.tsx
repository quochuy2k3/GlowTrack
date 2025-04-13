import { useAuth } from '@/contexts/auth';
import { PropsWithChildren } from 'react';

export default function AuthCheck({ children }: PropsWithChildren) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
