import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useGetAllUsers, useApproveUserKyc } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../../backend';

export default function CenterApproval() {
  const { data: users, isLoading } = useGetAllUsers();
  const approveKyc = useApproveUserKyc();

  const centers = (users ?? []).filter((u) => u.role === UserRole.center);

  const handleApprove = async (userId: bigint) => {
    try {
      await approveKyc.mutateAsync(userId);
      toast.success('Center approved successfully');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message ?? 'Approval failed');
    }
  };

  return (
    <DashboardLayout title="Center Approval" subtitle="Review and approve center registrations">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">Centers ({centers.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading centers...</div>
        ) : centers.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No center registrations found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {centers.map((center) => (
              <div key={center.id.toString()} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-DEFAULT/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-emerald-DEFAULT" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{center.name}</p>
                  <p className="text-muted-foreground text-xs">{center.email} · {center.phone}</p>
                  <p className="text-muted-foreground text-xs">ID: #{center.id.toString()}</p>
                </div>
                <Badge className={`text-xs ${center.kyc_status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {center.kyc_status ? 'Approved' : 'Pending'}
                </Badge>
                {!center.kyc_status && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(center.id)}
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
                {center.kyc_status && (
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
