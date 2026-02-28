import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import { useGetProducts } from '../../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Inbox, ClipboardCheck, Calendar, Sparkles, Package, ArrowRight } from 'lucide-react';
import { ProductStatus } from '../../backend';
import { getStatusColor, getStatusLabel } from '../../utils/formatters';
import { Badge } from '@/components/ui/badge';

export default function CenterDashboard() {
  const { data: products } = useGetProducts({ only_approved: false, only_sanitized: false });
  const atCenter = (products ?? []).filter((p) => p.availability_status === ProductStatus.atCenter).length;
  const onTrial = (products ?? []).filter((p) => p.availability_status === ProductStatus.onTrial).length;
  const rented = (products ?? []).filter((p) => p.availability_status === ProductStatus.rented).length;
  const sanitizing = (products ?? []).filter((p) => p.availability_status === ProductStatus.underSanitization).length;

  return (
    <DashboardLayout title="Center Dashboard" subtitle="Manage your rental center operations">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="At Center" value={atCenter} icon={<Package className="h-4 w-4" />} accent="emerald" />
        <MetricCard title="On Trial" value={onTrial} icon={<Calendar className="h-4 w-4" />} accent="gold" />
        <MetricCard title="Active Rentals" value={rented} icon={<ClipboardCheck className="h-4 w-4" />} accent="emerald" />
        <MetricCard title="Sanitization Queue" value={sanitizing} icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Inventory Overview</h3>
            <Button asChild variant="ghost" size="sm" className="text-emerald-DEFAULT gap-1">
              <Link to="/center/inventory">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {(products ?? []).slice(0, 6).map((p) => (
              <div key={p.id.toString()} className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(p.availability_status)}`}>
                  {getStatusLabel(p.availability_status)}
                </Badge>
              </div>
            ))}
            {(products ?? []).length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">No inventory yet</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <NotificationPanel />
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-display font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT justify-start gap-2">
                <Link to="/center/inventory"><Inbox className="h-4 w-4" /> Receive Inventory</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/center/trials"><Calendar className="h-4 w-4" /> Manage Trials</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2 border-gold/30">
                <Link to="/center/sanitization"><Sparkles className="h-4 w-4" /> Sanitization</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
