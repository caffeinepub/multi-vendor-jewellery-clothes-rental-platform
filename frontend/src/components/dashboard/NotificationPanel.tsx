import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../../utils/formatters';
import { cn } from '@/lib/utils';

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export default function NotificationPanel() {
  const notifications = useOrderStore((s) => s.notifications);
  const markRead = useOrderStore((s) => s.markNotificationRead);

  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">Notifications</h3>
          {unread.length > 0 && (
            <Badge className="bg-gold-DEFAULT text-emerald-dark border-0 text-xs h-5 px-1.5">
              {unread.length}
            </Badge>
          )}
        </div>
        {unread.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-emerald-DEFAULT gap-1"
            onClick={() => unread.forEach((n) => markRead(n.id))}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="h-64">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.slice(0, 10).map((notif) => {
              const Icon = typeIcons[notif.type];
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'p-3 flex gap-3 cursor-pointer hover:bg-muted/20 transition-colors',
                    !notif.read && 'bg-gold/5'
                  )}
                  onClick={() => markRead(notif.id)}
                >
                  <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', typeColors[notif.type])} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm leading-snug', !notif.read && 'font-medium')}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-gold-DEFAULT flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
