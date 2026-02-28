import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useGetProducts } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ClipboardCheck, CheckCircle2, XCircle, Gem } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ProductStatus } from '../../backend';
import { toast } from 'sonner';

export default function QCVerification() {
  const { data: products } = useGetProducts({ only_approved: false, only_sanitized: false });
  const [qcDialog, setQcDialog] = useState<{ open: boolean; productId: string | null; action: 'approve' | 'reject' | null }>({ open: false, productId: null, action: null });
  const [notes, setNotes] = useState('');

  const pendingQC = (products ?? []).filter((p) => p.availability_status === ProductStatus.atCenter && !p.approved);

  const handleQC = () => {
    if (qcDialog.action === 'approve') {
      toast.success('Product approved for trial');
    } else {
      toast.info('Product rejected and vendor notified');
    }
    setQcDialog({ open: false, productId: null, action: null });
    setNotes('');
  };

  return (
    <DashboardLayout title="QC Verification" subtitle="Inspect and approve products for trial">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-emerald-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">Pending QC ({pendingQC.length})</h3>
        </div>
        {pendingQC.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-DEFAULT/30 mx-auto mb-3" />
            <p className="text-muted-foreground">All products have been QC verified.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pendingQC.map((product) => (
              <div key={product.id.toString()} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img src={product.images[0].getDirectURL()} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Gem className="h-5 w-5 text-muted-foreground/40" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-muted-foreground text-xs">{formatCurrency(Number(product.rental_price))}/day</p>
                </div>
                <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">Pending QC</Badge>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-1 text-xs"
                    onClick={() => setQcDialog({ open: true, productId: product.id.toString(), action: 'approve' })}>
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/50 text-destructive gap-1 text-xs"
                    onClick={() => setQcDialog({ open: true, productId: product.id.toString(), action: 'reject' })}>
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={qcDialog.open} onOpenChange={(open) => setQcDialog({ open, productId: null, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              {qcDialog.action === 'approve' ? 'Approve for Trial' : 'Reject Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label>QC Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add inspection notes..." className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQcDialog({ open: false, productId: null, action: null })}>Cancel</Button>
            <Button onClick={handleQC} className={qcDialog.action === 'approve' ? 'bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT' : 'bg-destructive hover:bg-destructive/90 text-white'}>
              Confirm {qcDialog.action === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
