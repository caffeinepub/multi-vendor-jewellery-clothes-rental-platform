import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { HandshakeIcon, CheckCircle2, Loader2, Package } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters';
import { toast } from 'sonner';

export default function HandoverConfirmation() {
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [customerVerification, setCustomerVerification] = useState<Record<string, string>>({});

  const readyOrders = orders.filter((o) => o.status === 'readyForHandover');

  const handleHandover = async (orderId: string) => {
    const verification = customerVerification[orderId] ?? '';
    if (!verification) {
      toast.error('Please enter customer verification ID');
      return;
    }
    setConfirmingId(orderId);
    await new Promise((r) => setTimeout(r, 600));
    updateOrderStatus(orderId, 'rented', 'Handover confirmed');
    setConfirmingId(null);
    setCustomerVerification((prev) => ({ ...prev, [orderId]: '' }));
    toast.success('Handover confirmed! Order is now active.');
  };

  return (
    <DashboardLayout title="Handover Confirmation" subtitle="Confirm product handover to customers">
      <div className="space-y-4">
        {readyOrders.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <HandshakeIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No orders ready for handover at this time.</p>
            <p className="text-muted-foreground text-sm mt-1">
              Orders will appear here once sanitization is complete and payment is confirmed.
            </p>
          </div>
        ) : (
          readyOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{order.productName}</h3>
                  <p className="text-muted-foreground text-sm">{order.id} · {order.centerName}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Rental: </span>
                  <span className="font-medium">{formatCurrency(order.rentalPrice)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Deposit: </span>
                  <span className="font-medium">{formatCurrency(order.depositAmount)}</span>
                </div>
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label>Customer ID Verification *</Label>
                  <Input
                    value={customerVerification[order.id] ?? ''}
                    onChange={(e) =>
                      setCustomerVerification((prev) => ({ ...prev, [order.id]: e.target.value }))
                    }
                    placeholder="Aadhaar / PAN last 4 digits"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={() => handleHandover(order.id)}
                  disabled={confirmingId === order.id}
                  className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-2"
                >
                  {confirmingId === order.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Confirm Handover
                </Button>
              </div>
            </div>
          ))
        )}

        {/* Demo helper: show all orders for testing */}
        {readyOrders.length === 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground text-sm">All Orders (Demo)</h3>
            </div>
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <div key={order.id} className="p-3 flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{order.productName}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
