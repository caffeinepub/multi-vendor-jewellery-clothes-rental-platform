import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../backend';

export default function AccessDenied() {
  const { currentRole } = useAuth();

  const getDashboardPath = () => {
    switch (currentRole) {
      case UserRole.admin: return '/admin';
      case UserRole.vendor: return '/vendor';
      case UserRole.center: return '/center';
      case UserRole.customer: return '/customer';
      default: return '/';
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          {currentRole && (
            <Button asChild className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT">
              <Link to={getDashboardPath()}>My Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
