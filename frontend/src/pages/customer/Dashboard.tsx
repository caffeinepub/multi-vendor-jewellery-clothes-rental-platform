import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import ChartWrapper from '../../components/dashboard/ChartWrapper';
import { useOrderStore } from '../../store/orderStore';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Calendar, Wallet, Shield, Package, ArrowRight } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters';

const rentalTrendData = [
  { name: 'Oct', rentals: 1 },
  { name: 'Nov', rentals: 2 },
  { name: 'Dec', rentals: 1 },
  { name: 'Jan', rentals: 3 },
  { name: 'Feb', rentals: 2 },
];

export default function CustomerDashboard() {
  const orders = useOrderStore((s) => s.orders);
  const trialBookings = useOrderStore((s) => s.trialBookings);
  const walletBalance = useOrderStore((s) => s.walletBalance);
  const depositHeld = useOrderStore((s) => s.depositHeld);

  const activeRentals = orders.filter((o) => o.status === 'rented').length;
  const upcomingTrials = trialBookings.filter((t) => t.status === 'confirmed').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardLayout title="My Dashboard" subtitle="Welcome back to RentLux">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Active Rentals"
          value={activeRentals}
          icon={<ShoppingBag className="h-4 w-4" />}
          accent="emerald"
          trend="up"
          trendValue="+1"
        />
        <MetricCard
          title="Upcoming Trials"
          value={upcomingTrials}
          icon={<Calendar className="h-4 w-4" />}
          accent="gold"
        />
        <MetricCard
          title="Wallet Balance"
          value={formatCurrency(walletBalance)}
          icon={<Wallet className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          title="Deposit Held"
          value={formatCurrency(depositHeld)}
          icon={<Shield className="h-4 w-4" />}
          subtitle="Refundable after return"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">Recent Orders</h3>
              <Button asChild variant="ghost" size="sm" className="text-emerald-DEFAULT gap-1">
                <Link to="/customer/orders">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-emerald-DEFAULT/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-5 w-5 text-emerald-DEFAULT" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{order.productName}</p>
                      <p className="text-muted-foreground text-xs">{order.centerName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatCurrency(order.rentalPrice)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Rental Trend Chart */}
          <ChartWrapper
            type="bar"
            data={rentalTrendData}
            dataKeys={[{ key: 'rentals', color: 'oklch(0.32 0.09 165)', name: 'Rentals' }]}
            xKey="name"
            title="Rental Activity (Last 5 Months)"
            height={200}
          />
        </div>

        <div className="space-y-4">
          <NotificationPanel />
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-display font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT justify-start gap-2">
                <Link to="/products">
                  <Package className="h-4 w-4" /> Browse Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/customer/orders">
                  <ShoppingBag className="h-4 w-4" /> Track Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/customer/wallet">
                  <Wallet className="h-4 w-4" /> My Wallet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
