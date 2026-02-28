import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartWrapper from '../../components/dashboard/ChartWrapper';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import { useGetAllUsers, useGetProducts } from '../../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Users, Package, DollarSign, BarChart3, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { UserRole } from '../../backend';

const revenueData = [
  { name: 'Oct', revenue: 45000, rentals: 18 },
  { name: 'Nov', revenue: 62000, rentals: 25 },
  { name: 'Dec', revenue: 89000, rentals: 36 },
  { name: 'Jan', revenue: 54000, rentals: 22 },
  { name: 'Feb', revenue: 71000, rentals: 29 },
];

export default function AdminDashboard() {
  const { data: users } = useGetAllUsers();
  const { data: products } = useGetProducts({ only_approved: false, only_sanitized: false });

  const pendingVendors = (users ?? []).filter((u) => u.role === UserRole.vendor && !u.kyc_status).length;
  const pendingCenters = (users ?? []).filter((u) => u.role === UserRole.center && !u.kyc_status).length;
  const pendingProducts = (products ?? []).filter((p) => !p.approved).length;
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and controls">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          accent="gold"
          trend="up"
          trendValue="+18%"
        />
        <MetricCard
          title="Total Users"
          value={(users ?? []).length}
          icon={<Users className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingVendors + pendingCenters + pendingProducts}
          icon={<ShieldCheck className="h-4 w-4" />}
          subtitle="Vendors, Centers, Products"
        />
        <MetricCard
          title="Total Products"
          value={(products ?? []).length}
          icon={<Package className="h-4 w-4" />}
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartWrapper
            type="line"
            data={revenueData}
            dataKeys={[
              { key: 'revenue', color: 'oklch(0.72 0.12 75)', name: 'Revenue (₹)' },
              { key: 'rentals', color: 'oklch(0.32 0.09 165)', name: 'Rentals' },
            ]}
            xKey="name"
            title="Platform Revenue & Rentals"
            height={250}
          />

          {/* Pending Approvals Summary */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">Pending Approvals</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { label: 'Vendor KYC Approvals', count: pendingVendors, to: '/admin/vendors' },
                { label: 'Center Approvals', count: pendingCenters, to: '/admin/centers' },
                { label: 'Product Approvals', count: pendingProducts, to: '/admin/products' },
              ].map((item) => (
                <div key={item.label} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.count > 0 ? 'bg-gold-DEFAULT' : 'bg-emerald-DEFAULT'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${item.count > 0 ? 'text-gold-DEFAULT' : 'text-emerald-DEFAULT'}`}>
                      {item.count}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-DEFAULT gap-1">
                      <Link to={item.to as '/admin/vendors' | '/admin/centers' | '/admin/products'}>
                        Review <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <NotificationPanel />
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-display font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT justify-start gap-2">
                <Link to="/admin/vendors"><Users className="h-4 w-4" /> Approve Vendors</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/admin/analytics"><BarChart3 className="h-4 w-4" /> Analytics</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/admin/disputes"><AlertCircle className="h-4 w-4" /> Disputes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
