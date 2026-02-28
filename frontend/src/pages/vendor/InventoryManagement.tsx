import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useGetProducts, useSubmitProductToCenter } from '../../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Gem, Send, Loader2 } from 'lucide-react';
import { getStatusColor, getStatusLabel, formatCurrency } from '../../utils/formatters';
import { ProductStatus } from '../../backend';
import { toast } from 'sonner';

export default function InventoryManagement() {
  const { data: products, isLoading } = useGetProducts({ only_approved: false, only_sanitized: false });
  const submitToCenter = useSubmitProductToCenter();
  const [sendDialog, setSendDialog] = useState<{ open: boolean; productId: bigint | null }>({ open: false, productId: null });
  const [centerId, setCenterId] = useState('');

  const handleSendToCenter = async () => {
    if (!sendDialog.productId || !centerId) {
      toast.error('Please enter a center ID');
      return;
    }
    try {
      await submitToCenter.mutateAsync({ product_id: sendDialog.productId, center_id: BigInt(centerId) });
      toast.success('Product sent to center successfully');
      setSendDialog({ open: false, productId: null });
      setCenterId('');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message ?? 'Failed to send product');
    }
  };

  return (
    <DashboardLayout title="Inventory Management" subtitle="Track and manage your products">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">My Products</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>
        ) : !products || products.length === 0 ? (
          <div className="p-8 text-center">
            <Gem className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No products yet. Upload your first product.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {products.map((product) => (
              <div key={product.id.toString()} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img src={product.images[0].getDirectURL()} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gem className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatCurrency(Number(product.rental_price))}/day · Deposit: {formatCurrency(Number(product.deposit_amount))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getStatusColor(product.availability_status)}`}>
                    {getStatusLabel(product.availability_status)}
                  </Badge>
                  {!product.approved && (
                    <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">Pending Approval</Badge>
                  )}
                </div>
                {product.availability_status === ProductStatus.atVendor && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gold/30 hover:border-gold-DEFAULT gap-1 text-xs"
                    onClick={() => setSendDialog({ open: true, productId: product.id })}
                  >
                    <Send className="h-3 w-3" /> Send to Center
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={sendDialog.open} onOpenChange={(open) => setSendDialog({ open, productId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Send Product to Center</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="centerId">Center ID *</Label>
            <Input
              id="centerId"
              value={centerId}
              onChange={(e) => setCenterId(e.target.value)}
              placeholder="Enter center ID (e.g. 1)"
              className="mt-1"
              type="number"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter the ID of the center you want to send this product to.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialog({ open: false, productId: null })}>Cancel</Button>
            <Button
              onClick={handleSendToCenter}
              disabled={submitToCenter.isPending}
              className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT"
            >
              {submitToCenter.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
