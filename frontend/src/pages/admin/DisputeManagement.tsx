import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { toast } from 'sonner';
import type { Dispute } from '../../store/orderStore';

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  escalated: 'bg-red-100 text-red-700',
};

export default function DisputeManagement() {
  const disputes = useOrderStore((s) => s.disputes);
  const updateDisputeStatus = useOrderStore((s) => s.updateDisputeStatus);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Add some seed disputes for demo
  const allDisputes: Dispute[] = disputes.length > 0 ? disputes : [
    { id: 'DISP-001', orderId: 'ORD-001', customerId: 'cust-1', reason: 'damage', description: 'Item returned with scratch marks not present at rental.', status: 'open', createdAt: new Date('2026-02-26') },
    { id: 'DISP-002', orderId: 'ORD-003', customerId: 'cust-2', reason: 'deposit_not_refunded', description: 'Deposit not refunded after 7 days of return.', status: 'escalated', createdAt: new Date('2026-02-20') },
  ];

  const handleResolve = (dispute: Dispute) => {
    updateDisputeStatus(dispute.id, 'resolved');
    setSelectedDispute(null);
    setResolutionNotes('');
    toast.success('Dispute resolved successfully');
  };

  const handleEscalate = (dispute: Dispute) => {
    updateDisputeStatus(dispute.id, 'escalated');
    toast.info('Dispute escalated to senior team');
  };

  return (
    <DashboardLayout title="Dispute Management" subtitle="Review and resolve customer disputes">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-gold-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">
            Disputes ({allDisputes.length})
          </h3>
        </div>

        {allDisputes.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-DEFAULT/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No open disputes.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {allDisputes.map((dispute) => (
              <div key={dispute.id} className="p-4 flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{dispute.id}</span>
                    <Badge className={`text-xs ${statusColors[dispute.status]}`}>{dispute.status}</Badge>
                  </div>
                  <p className="font-medium text-sm">{dispute.reason.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                  <p className="text-muted-foreground text-xs">Order: {dispute.orderId} · {formatDate(dispute.createdAt)}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dispute.description}</p>
                </div>
                {dispute.status === 'open' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-1 text-xs"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <CheckCircle2 className="h-3 w-3" /> Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-400 text-orange-600 gap-1 text-xs"
                      onClick={() => handleEscalate(dispute)}
                    >
                      <ArrowUpCircle className="h-3 w-3" /> Escalate
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Resolve Dispute</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Dispute: <span className="font-medium text-foreground">{selectedDispute?.id}</span>
            </p>
            <p className="text-sm text-muted-foreground">{selectedDispute?.description}</p>
            <div>
              <Label>Resolution Notes</Label>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe the resolution..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDispute(null)}>Cancel</Button>
            <Button
              onClick={() => selectedDispute && handleResolve(selectedDispute)}
              className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT"
            >
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
