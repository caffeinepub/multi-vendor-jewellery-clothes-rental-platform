import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useGetAllUsers, useApproveUserKyc } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, XCircle, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../../backend';

export default function VendorApproval() {
  const { data: users, isLoading } = useGetAllUsers();
  const approveKyc = useApproveUserKyc();

  const vendors = (users ?? []).filter((u) => u.role === UserRole.vendor);

  const handleApprove = async (userId: bigint) => {
    try {
      await approveKyc.mutateAsync(userId);
      toast.success('Vendor KYC approved successfully');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message ?? 'Approval failed');
    }
  };

  return (
    <DashboardLayout title="Vendor Approval" subtitle="Review and approve vendor registrations">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">
            Vendors ({vendors.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading vendors...</div>
        ) : vendors.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No vendor registrations found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {vendors.map((vendor) => (
              <div key={vendor.id.toString()} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-DEFAULT/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-emerald-DEFAULT">
                    {vendor.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{vendor.name}</p>
                  <p className="text-muted-foreground text-xs">{vendor.email} · {vendor.phone}</p>
                  {vendor.gst_number && (
                    <p className="text-muted-foreground text-xs">GST: {vendor.gst_number}</p>
                  )}
                  {vendor.bank_kyc && (
                    <p className="text-muted-foreground text-xs">Bank: {vendor.bank_kyc}</p>
                  )}
                </div>
                <Badge className={`text-xs ${vendor.kyc_status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {vendor.kyc_status ? 'Approved' : 'Pending'}
                </Badge>
                {!vendor.kyc_status && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(vendor.id)}
                      disabled={approveKyc.isPending}
                      className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-1 text-xs"
                    >
                      {approveKyc.isPending ? (
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
                )}
                {vendor.kyc_status && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-DEFAULT" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
