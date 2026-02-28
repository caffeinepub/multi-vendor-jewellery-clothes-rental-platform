import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '../../store/orderStore';

const STATUS_FLOW: OrderStatus[] = [
  'trialBooked',
  'trialCompleted',
  'paymentDone',
  'sanitizing',
  'readyForHandover',
  'rented',
  'returned',
  'closed',
];

export default function OrderTracking() {
  const orders = useOrderStore((s) => s.orders);

  return (
    <DashboardLayout title="My Orders" subtitle="Track your rental orders">
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No orders found.</div>
        ) : (
          orders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(order.status);
            return (
              <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{order.productName}</h3>
                    <p className="text-muted-foreground text-sm">{order.centerName} · {order.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(order.status)} mb-1`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Updated {formatDate(order.updatedAt)}</p>
                  </div>
                </div>

                {/* Status Progress */}
                <div className="p-4 overflow-x-auto">
                  <div className="flex items-center min-w-max gap-0">
                    {STATUS_FLOW.map((status, index) => {
                      const isDone = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const isLast = index === STATUS_FLOW.length - 1;
                      return (
                        <React.Fragment key={status}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={cn(
                              'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors',
                              isDone ? 'bg-emerald-DEFAULT border-emerald-DEFAULT' :
                              isCurrent ? 'bg-gold-DEFAULT border-gold-DEFAULT' :
                              'bg-background border-border'
                            )}>
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-ivory-DEFAULT" />
                              ) : isCurrent ? (
                                <Clock className="h-3.5 w-3.5 text-emerald-dark" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <span className={cn(
                              'text-[10px] font-medium text-center max-w-[60px] leading-tight',
                              isCurrent ? 'text-gold-DEFAULT' : isDone ? 'text-emerald-DEFAULT' : 'text-muted-foreground'
                            )}>
                              {getStatusLabel(status)}
                            </span>
                          </div>
                          {!isLast && (
                            <div className={cn(
                              'h-0.5 w-8 mx-1 mb-5 flex-shrink-0',
                              isDone ? 'bg-emerald-DEFAULT' : 'bg-border'
                            )} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div className="px-4 pb-4 flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rental: </span>
                    <span className="font-medium">{formatCurrency(order.rentalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deposit: </span>
                    <span className="font-medium">{formatCurrency(order.depositAmount)}</span>
                  </div>
                  {order.rentalStart && (
                    <div>
                      <span className="text-muted-foreground">Start: </span>
                      <span className="font-medium">{formatDate(order.rentalStart)}</span>
                    </div>
                  )}
                  {order.rentalEnd && (
                    <div>
                      <span className="text-muted-foreground">End: </span>
                      <span className="font-medium">{formatDate(order.rentalEnd)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
