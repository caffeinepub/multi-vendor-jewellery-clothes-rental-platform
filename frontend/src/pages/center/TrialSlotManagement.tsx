import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { formatDateTime, getStatusColor } from '../../utils/formatters';
import { toast } from 'sonner';

export default function TrialSlotManagement() {
  const trialBookings = useOrderStore((s) => s.trialBookings);
  const updateTrialStatus = useOrderStore((s) => s.updateTrialStatus);

  const handleComplete = (id: string) => {
    updateTrialStatus(id, 'completed');
    toast.success('Trial marked as completed');
  };

  const handleCancel = (id: string) => {
    updateTrialStatus(id, 'cancelled');
    toast.info('Trial slot cancelled');
  };

  return (
    <DashboardLayout title="Trial Slot Management" subtitle="Manage customer trial appointments">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-DEFAULT" />
            <h3 className="font-display font-semibold text-foreground">Trial Bookings ({trialBookings.length})</h3>
          </div>
        </div>
        {trialBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No trial bookings scheduled.</div>
        ) : (
          <div className="divide-y divide-border">
            {trialBookings.map((booking) => (
              <div key={booking.id} className="p-4 flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-DEFAULT/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-emerald-DEFAULT" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{booking.productName}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDateTime(booking.trialDate)}
                  </p>
                  <p className="text-muted-foreground text-xs">Customer #{booking.customerId}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                {booking.status === 'confirmed' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-1 text-xs"
                      onClick={() => handleComplete(booking.id)}>
                      <CheckCircle2 className="h-3 w-3" /> Complete
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive/50 text-destructive gap-1 text-xs"
                      onClick={() => handleCancel(booking.id)}>
                      <XCircle className="h-3 w-3" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
