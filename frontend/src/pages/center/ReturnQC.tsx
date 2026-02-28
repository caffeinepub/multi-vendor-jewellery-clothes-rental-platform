import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters';
import { toast } from 'sonner';

export default function ReturnQC() {
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [selectedOrder, setSelectedOrder] = useState('');
  const [condition, setCondition] = useState('');
  const [damageCharge, setDamageCharge] = useState('');
  const [notes, setNotes] = useState('');
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const rentedOrders = orders.filter((o) => o.status === 'rented');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !condition) {
      toast.error('Please select an order and condition');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    updateOrderStatus(selectedOrder, 'returned', notes);
    setSubmitting(false);
    toast.success(
      condition === 'good'
        ? 'Return QC passed. Deposit refund initiated.'
        : `Return QC completed. Damage charge of ₹${damageCharge || 0} applied.`
    );
    setSelectedOrder('');
    setCondition('');
    setDamageCharge('');
    setNotes('');
    setBeforeFile(null);
  };

  return (
    <DashboardLayout title="Return QC Inspection" subtitle="Inspect returned products and process deposits">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="h-5 w-5 text-gold-DEFAULT" />
            <h3 className="font-display font-semibold text-foreground">Return Inspection Form</h3>
          </div>

          <div>
            <Label>Select Returned Order *</Label>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose an order" />
              </SelectTrigger>
              <SelectContent>
                {rentedOrders.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.id} — {o.productName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rentedOrders.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">No active rentals to inspect.</p>
            )}
          </div>

          <div>
            <Label>Product Condition *</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">✅ Good — No damage</SelectItem>
                <SelectItem value="minor">⚠️ Minor Damage</SelectItem>
                <SelectItem value="major">🔴 Major Damage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {condition && condition !== 'good' && (
            <div>
              <Label>Damage Charge (₹)</Label>
              <Input
                type="number"
                value={damageCharge}
                onChange={(e) => setDamageCharge(e.target.value)}
                placeholder="Enter damage amount"
                className="mt-1"
                min="0"
              />
            </div>
          )}

          <div>
            <Label>Inspection Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the condition of the returned item..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label>Inspection Photo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || rentedOrders.length === 0}
            className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Return QC
          </Button>
        </form>

        {/* Active Rentals Panel */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">Active Rentals ({rentedOrders.length})</h3>
          </div>
          {rentedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-DEFAULT/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No active rentals pending return.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rentedOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{order.productName}</p>
                    <p className="text-muted-foreground text-xs">{order.id}</p>
                    <p className="text-muted-foreground text-xs">
                      Deposit: {formatCurrency(order.depositAmount)}
                    </p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
