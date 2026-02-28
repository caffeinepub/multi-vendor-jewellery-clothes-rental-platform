import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function LoginButton({ className, size = 'default' }: LoginButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      size={size}
      className={className}
      variant={isAuthenticated ? 'outline' : 'default'}
    >
      {disabled ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isAuthenticated ? (
        <LogOut className="h-4 w-4 mr-2" />
      ) : (
        <LogIn className="h-4 w-4 mr-2" />
      )}
      {disabled ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
}
