import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useGetProducts, useAcknowledgeReceivingProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gem, CheckCircle2, Loader2 } from 'lucide-react';
import { getStatusColor, getStatusLabel, formatCurrency } from '../../utils/formatters';
import { ProductStatus } from '../../backend';
import { toast } from 'sonner';

export default function InventoryReceipt() {
  const { data: products, isLoading } = useGetProducts({ only_approved: false, only_sanitized: false });
  const acknowledge = useAcknowledgeReceivingProduct();

  const inboundProducts = (products ?? []).filter(
    (p) => p.availability_status === ProductStatus.atCenter && p.center_id > 0n
  );

  const handleAcknowledge = async (productId: bigint, centerId: bigint) => {
    try {
      await acknowledge.mutateAsync({ product_id: productId, center_id: centerId });
      toast.success('Product receipt acknowledged');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message ?? 'Failed to acknowledge');
    }
  };

  return (
    <DashboardLayout title="Receive Inventory" subtitle="Acknowledge products sent by vendors">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Inbound Products</h3>
          <p className="text-muted-foreground text-sm mt-0.5">Products sent to your center awaiting acknowledgment</p>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : inboundProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Gem className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No inbound products at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {inboundProducts.map((product) => (
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
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Vendor #{product.vendor_id.toString()} · {formatCurrency(Number(product.rental_price))}/day
                  </p>
                </div>
                <Badge className={`text-xs ${getStatusColor(product.availability_status)}`}>
                  {getStatusLabel(product.availability_status)}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => handleAcknowledge(product.id, product.center_id)}
                  disabled={acknowledge.isPending}
                  className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-1 text-xs"
                >
                  {acknowledge.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                  Acknowledge
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
