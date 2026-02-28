import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { toast } from 'sonner';

export default function DisputeForm() {
  const orders = useOrderStore((s) => s.orders);
  const disputes = useOrderStore((s) => s.disputes);
  const addDispute = useOrderStore((s) => s.addDispute);

  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !reason || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    addDispute({
      id: `DISP-${Date.now()}`,
      orderId: selectedOrder,
      customerId: 'cust-1',
      reason,
      description,
      status: 'open',
      createdAt: new Date(),
    });
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Dispute submitted successfully');
  };

  return (
    <DashboardLayout title="Raise a Dispute" subtitle="Report an issue with your order">
      <div className="max-w-2xl space-y-6">
        {submitted ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-DEFAULT mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Dispute Submitted</h3>
            <p className="text-muted-foreground mb-4">Our team will review your dispute and respond within 24–48 hours.</p>
            <Button onClick={() => setSubmitted(false)} variant="outline">Raise Another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-gold-DEFAULT" />
              <h3 className="font-display font-semibold text-foreground">Dispute Details</h3>
            </div>

            <div>
              <Label>Select Order *</Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose an order" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.id} — {o.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reason *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damage">Item Damaged</SelectItem>
                  <SelectItem value="wrong_item">Wrong Item Delivered</SelectItem>
                  <SelectItem value="not_sanitized">Not Properly Sanitized</SelectItem>
                  <SelectItem value="deposit_not_refunded">Deposit Not Refunded</SelectItem>
                  <SelectItem value="overcharged">Overcharged</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="mt-1 min-h-[100px]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT"
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Dispute
            </Button>
          </form>
        )}

        {/* Existing Disputes */}
        {disputes.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">My Disputes</h3>
            </div>
            <div className="divide-y divide-border">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{d.reason}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{d.orderId} · {formatDate(d.createdAt)}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{d.description}</p>
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ${getStatusColor(d.status)}`}>{d.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
