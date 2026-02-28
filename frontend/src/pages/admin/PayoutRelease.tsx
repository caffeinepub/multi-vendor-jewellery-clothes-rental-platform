import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

interface PendingPayout {
  id: string;
  vendorId: string;
  vendorName: string;
  orderId: string;
  gross: number;
  adminCommission: number;
  centerShare: number;
  net: number;
  status: 'pending' | 'processing' | 'released';
  createdAt: Date;
}

const initialPayouts: PendingPayout[] = [
  { id: 'PAY-P001', vendorId: 'v1', vendorName: 'Meera Jewels', orderId: 'ORD-001', gross: 2500, adminCommission: 375, centerShare: 250, net: 1875, status: 'pending', createdAt: new Date('2026-02-26') },
  { id: 'PAY-P002', vendorId: 'v2', vendorName: 'Bridal Couture', orderId: 'ORD-003', gross: 8000, adminCommission: 1200, centerShare: 800, net: 6000, status: 'pending', createdAt: new Date('2026-02-25') },
  { id: 'PAY-P003', vendorId: 'v3', vendorName: 'Diamond Dreams', orderId: 'ORD-005', gross: 3500, adminCommission: 525, centerShare: 350, net: 2625, status: 'processing', createdAt: new Date('2026-02-24') },
];

export default function PayoutRelease() {
  const [payouts, setPayouts] = useState<PendingPayout[]>(initialPayouts);
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const handleRelease = async (payoutId: string) => {
    setReleasingId(payoutId);
    await new Promise((r) => setTimeout(r, 800));
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'released' } : p))
    );
    setReleasingId(null);
    toast.success('Payout released successfully');
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    released: 'bg-green-100 text-green-700',
  };

  const pendingTotal = payouts
    .filter((p) => p.status === 'pending')
    .reduce((s, p) => s + p.net, 0);

  return (
    <DashboardLayout title="Payout Release" subtitle="Review and release vendor payouts">
      <div className="mb-4 bg-card rounded-xl border border-border p-4 flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-gold-DEFAULT" />
        <div>
          <p className="text-sm text-muted-foreground">Total Pending Payouts</p>
          <p className="font-display text-xl font-bold text-foreground">{formatCurrency(pendingTotal)}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">Vendor Payouts</h3>
        </div>
        <div className="divide-y divide-border">
          {payouts.map((payout) => (
            <div key={payout.id} className="p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{payout.vendorName}</p>
                <p className="text-muted-foreground text-xs">
                  {payout.id} · Order: {payout.orderId} · {formatDate(payout.createdAt)}
                </p>
                <div className="flex gap-3 mt-1 text-xs">
                  <span className="text-muted-foreground">Gross: {formatCurrency(payout.gross)}</span>
                  <span className="text-red-600">-{formatCurrency(payout.adminCommission)}</span>
                  <span className="text-orange-600">-{formatCurrency(payout.centerShare)}</span>
                  <span className="font-semibold text-emerald-DEFAULT">Net: {formatCurrency(payout.net)}</span>
                </div>
              </div>
              <Badge className={`text-xs ${statusColors[payout.status]}`}>{payout.status}</Badge>
              {payout.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleRelease(payout.id)}
                  disabled={releasingId === payout.id}
                  className="bg-gold-DEFAULT hover:bg-gold-dark text-emerald-dark gap-1 text-xs font-semibold"
                >
                  {releasingId === payout.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  Release
                </Button>
              )}
              {payout.status === 'released' && (
                <CheckCircle2 className="h-5 w-5 text-emerald-DEFAULT" />
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
