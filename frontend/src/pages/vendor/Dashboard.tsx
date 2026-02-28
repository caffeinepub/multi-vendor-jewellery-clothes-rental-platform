import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartWrapper from '../../components/dashboard/ChartWrapper';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import { useGetProducts } from '../../hooks/useQueries';
import { useAuth } from '../../hooks/useAuth';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, TrendingUp, CreditCard, Upload, Boxes, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ProductStatus } from '../../backend';

const earningsData = [
  { name: 'Oct', gross: 12000, net: 9000 },
  { name: 'Nov', gross: 18000, net: 13500 },
  { name: 'Dec', gross: 25000, net: 18750 },
  { name: 'Jan', gross: 15000, net: 11250 },
  { name: 'Feb', gross: 22000, net: 16500 },
];

export default function VendorDashboard() {
  const { userProfile } = useAuth();
  const { data: allProducts } = useGetProducts({ only_approved: false, only_sanitized: false });

  const myProducts = allProducts ?? [];
  const activeRentals = myProducts.filter((p) => p.availability_status === ProductStatus.rented).length;
  const atCenter = myProducts.filter((p) => p.availability_status === ProductStatus.atCenter).length;

  return (
    <DashboardLayout title="Vendor Dashboard" subtitle={`Welcome, ${userProfile?.name ?? 'Vendor'}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Products" value={myProducts.length} icon={<Package className="h-4 w-4" />} accent="emerald" />
        <MetricCard title="Active Rentals" value={activeRentals} icon={<ShoppingBag className="h-4 w-4" />} accent="gold" trend="up" trendValue="+2" />
        <MetricCard title="At Centers" value={atCenter} icon={<Boxes className="h-4 w-4" />} accent="emerald" />
        <MetricCard title="This Month" value={formatCurrency(22000)} icon={<TrendingUp className="h-4 w-4" />} accent="gold" trend="up" trendValue="+15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartWrapper
            type="bar"
            data={earningsData}
            dataKeys={[
              { key: 'gross', color: 'oklch(0.32 0.09 165)', name: 'Gross Revenue' },
              { key: 'net', color: 'oklch(0.72 0.12 75)', name: 'Net Payout' },
            ]}
            xKey="name"
            title="Revenue Overview (Last 5 Months)"
            height={250}
          />
        </div>
        <div className="space-y-4">
          <NotificationPanel />
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-display font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT justify-start gap-2">
                <Link to="/vendor/upload"><Upload className="h-4 w-4" /> Upload Product</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/vendor/inventory"><Boxes className="h-4 w-4" /> Manage Inventory</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/vendor/earnings"><TrendingUp className="h-4 w-4" /> View Earnings</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
