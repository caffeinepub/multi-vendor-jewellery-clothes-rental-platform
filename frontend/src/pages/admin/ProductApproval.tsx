import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useGetProducts, useApproveProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle2, XCircle, Loader2, Gem } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters';
import { toast } from 'sonner';

export default function ProductApproval() {
  const { data: products, isLoading } = useGetProducts({ only_approved: false, only_sanitized: false });
  const approveProduct = useApproveProduct();

  const pendingProducts = (products ?? []).filter((p) => !p.approved);

  const handleApprove = async (productId: bigint) => {
    try {
      await approveProduct.mutateAsync(productId);
      toast.success('Product approved and listed');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message ?? 'Approval failed');
    }
  };

  return (
    <DashboardLayout title="Product Approval" subtitle="Review and approve vendor product listings">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">
            Pending Products ({pendingProducts.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading products...</div>
        ) : pendingProducts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-DEFAULT/30 mx-auto mb-3" />
            <p className="text-muted-foreground">All products have been reviewed.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pendingProducts.map((product) => (
              <div key={product.id.toString()} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gem className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-muted-foreground text-xs line-clamp-1">{product.description}</p>
                  <p className="text-muted-foreground text-xs">
                    Vendor #{product.vendor_id.toString()} ·{' '}
                    {formatCurrency(Number(product.rental_price))}/day ·{' '}
                    Deposit: {formatCurrency(Number(product.deposit_amount))}
                  </p>
                </div>
                <Badge className={`text-xs ${getStatusColor(product.availability_status)}`}>
                  {getStatusLabel(product.availability_status)}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(product.id)}
                    disabled={approveProduct.isPending}
                    className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-1 text-xs"
                  >
                    {approveProduct.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/50 text-destructive gap-1 text-xs"
                    onClick={() => toast.info('Rejection workflow coming soon')}
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
