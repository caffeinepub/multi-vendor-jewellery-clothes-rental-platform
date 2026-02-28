import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { UserRole } from '../../backend';
import RoleNavigation from './RoleNavigation';
import NotificationPanel from './NotificationPanel';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrderStore } from '../../store/orderStore';
import {
  Menu,
  X,
  Gem,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const roleLabels: Record<string, string> = {
  [UserRole.customer]: 'Customer',
  [UserRole.vendor]: 'Vendor',
  [UserRole.center]: 'Center',
  [UserRole.admin]: 'Admin',
};

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { currentRole, userProfile } = useAuth();
  const notifications = useOrderStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentRole) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-gold-DEFAULT" />
          <span className="font-display text-lg font-semibold text-sidebar-foreground">
            Rent<span className="text-gold-DEFAULT">Lux</span>
          </span>
        </Link>
        <div className="mt-2">
          <Badge className="bg-gold-DEFAULT/20 text-gold-DEFAULT border-gold/30 text-xs">
            {roleLabels[currentRole]}
          </Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-DEFAULT/20 border border-gold/30 flex items-center justify-center">
            <span className="font-display text-sm font-bold text-gold-DEFAULT">
              {userProfile?.name?.charAt(0) ?? '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sidebar-foreground text-sm font-medium truncate">
              {userProfile?.name ?? 'User'}
            </p>
            <p className="text-sidebar-foreground/50 text-xs truncate">
              {userProfile?.email ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        <RoleNavigation role={currentRole} />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-2 text-sidebar-foreground/50 hover:text-sidebar-foreground text-xs transition-colors"
        >
          <ChevronRight className="h-3 w-3" />
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-display font-semibold text-foreground text-base">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-gold-DEFAULT text-emerald-dark border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <NotificationPanel />
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
