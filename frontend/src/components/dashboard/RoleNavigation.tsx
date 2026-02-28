import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { UserRole } from '../../backend';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  History,
  AlertCircle,
  Upload,
  Boxes,
  TrendingUp,
  CreditCard,
  Inbox,
  ClipboardCheck,
  Calendar,
  Sparkles,
  HandshakeIcon,
  RotateCcw,
  Users,
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const navByRole: Record<string, NavItem[]> = {
  [UserRole.customer]: [
    { label: 'Dashboard', to: '/customer', icon: LayoutDashboard },
    { label: 'Browse Products', to: '/products', icon: Package },
    { label: 'My Orders', to: '/customer/orders', icon: ShoppingBag },
    { label: 'Wallet', to: '/customer/wallet', icon: Wallet },
    { label: 'Rental History', to: '/customer/history', icon: History },
    { label: 'Disputes', to: '/customer/disputes', icon: AlertCircle },
  ],
  [UserRole.vendor]: [
    { label: 'Dashboard', to: '/vendor', icon: LayoutDashboard },
    { label: 'Upload Product', to: '/vendor/upload', icon: Upload },
    { label: 'Inventory', to: '/vendor/inventory', icon: Boxes },
    { label: 'Orders', to: '/vendor/orders', icon: ShoppingBag },
    { label: 'Earnings', to: '/vendor/earnings', icon: TrendingUp },
    { label: 'Payouts', to: '/vendor/payouts', icon: CreditCard },
  ],
  [UserRole.center]: [
    { label: 'Dashboard', to: '/center', icon: LayoutDashboard },
    { label: 'Receive Inventory', to: '/center/inventory', icon: Inbox },
    { label: 'QC Verification', to: '/center/qc', icon: ClipboardCheck },
    { label: 'Trial Slots', to: '/center/trials', icon: Calendar },
    { label: 'POS Booking', to: '/center/pos', icon: ShoppingBag },
    { label: 'Sanitization', to: '/center/sanitization', icon: Sparkles },
    { label: 'Handover', to: '/center/handover', icon: HandshakeIcon },
    { label: 'Return QC', to: '/center/return-qc', icon: RotateCcw },
  ],
  [UserRole.admin]: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Vendor Approval', to: '/admin/vendors', icon: Users },
    { label: 'Center Approval', to: '/admin/centers', icon: ShieldCheck },
    { label: 'Product Approval', to: '/admin/products', icon: Package },
    { label: 'Commission', to: '/admin/commission', icon: Settings },
    { label: 'Revenue', to: '/admin/revenue', icon: DollarSign },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
    { label: 'Disputes', to: '/admin/disputes', icon: AlertCircle },
    { label: 'Payouts', to: '/admin/payouts', icon: CreditCard },
    { label: 'GST Report', to: '/admin/gst', icon: FileText },
  ],
};

interface RoleNavigationProps {
  role: UserRole;
  collapsed?: boolean;
}

export default function RoleNavigation({ role, collapsed = false }: RoleNavigationProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const items = navByRole[role] ?? [];

  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to) && item.to.length > 1);

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-gold-DEFAULT/20 text-gold-DEFAULT border border-gold/30'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'
            )}
          >
            <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-gold-DEFAULT' : '')} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
