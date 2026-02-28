import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  accent?: 'gold' | 'emerald' | 'default';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
  accent = 'default',
}: MetricCardProps) {
  const accentClasses = {
    gold: 'border-l-4 border-l-gold-DEFAULT',
    emerald: 'border-l-4 border-l-emerald-DEFAULT',
    default: '',
  };

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-5 hover:shadow-luxury transition-all duration-200',
        accentClasses[accent],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-emerald-DEFAULT/10 flex items-center justify-center text-emerald-DEFAULT">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-muted-foreground text-xs mt-0.5">{subtitle}</p>}
        </div>

        {trend && trendValue && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend === 'up' && 'bg-green-100 text-green-700',
              trend === 'down' && 'bg-red-100 text-red-700',
              trend === 'neutral' && 'bg-gray-100 text-gray-600'
            )}
          >
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}
