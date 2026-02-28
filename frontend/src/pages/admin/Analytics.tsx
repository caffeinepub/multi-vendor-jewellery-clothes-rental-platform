import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartWrapper from '../../components/dashboard/ChartWrapper';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, ShoppingBag, Percent, BarChart3, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const kpiData = [
  { name: 'Oct', revenue: 45000, rentals: 18, trials: 32, conversions: 56 },
  { name: 'Nov', revenue: 62000, rentals: 25, trials: 41, conversions: 61 },
  { name: 'Dec', revenue: 89000, rentals: 36, trials: 55, conversions: 65 },
  { name: 'Jan', revenue: 54000, rentals: 22, trials: 38, conversions: 58 },
  { name: 'Feb', revenue: 71000, rentals: 29, trials: 47, conversions: 62 },
];

const centerPerformance = [
  { name: 'Elegance Center - Mumbai', score: 94, rentals: 45, rating: 4.8 },
  { name: 'Luxe Rentals - Delhi', score: 88, rentals: 38, rating: 4.6 },
  { name: 'Bridal Studio - Bangalore', score: 96, rentals: 52, rating: 4.9 },
  { name: 'Heritage Jewels - Chennai', score: 82, rentals: 31, rating: 4.7 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('monthly');

  const latestMonth = kpiData[kpiData.length - 1];
  const conversionRate = Math.round((latestMonth.rentals / latestMonth.trials) * 100);

  return (
    <DashboardLayout title="Analytics Dashboard" subtitle="Platform performance metrics and KPIs">
      <div className="flex justify-end mb-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Revenue" value={formatCurrency(latestMonth.revenue)} icon={<TrendingUp className="h-4 w-4" />} accent="gold" trend="up" trendValue="+31%" />
        <MetricCard title="Active Rentals" value={latestMonth.rentals} icon={<ShoppingBag className="h-4 w-4" />} accent="emerald" trend="up" trendValue="+7" />
        <MetricCard title="Conversion Rate" value={`${conversionRate}%`} icon={<Percent className="h-4 w-4" />} accent="gold" subtitle="Trial → Rental" />
        <MetricCard title="Trial Bookings" value={latestMonth.trials} icon={<BarChart3 className="h-4 w-4" />} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartWrapper
          type="line"
          data={kpiData}
          dataKeys={[
            { key: 'rentals', color: 'oklch(0.32 0.09 165)', name: 'Rentals' },
            { key: 'trials', color: 'oklch(0.72 0.12 75)', name: 'Trials' },
          ]}
          xKey="name"
          title="Rentals vs Trials"
          height={220}
        />
        <ChartWrapper
          type="bar"
          data={kpiData}
          dataKeys={[{ key: 'conversions', color: 'oklch(0.55 0.1 70)', name: 'Conversion %' }]}
          xKey="name"
          title="Trial-to-Rental Conversion (%)"
          height={220}
        />
      </div>

      {/* Center Performance Leaderboard */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Star className="h-5 w-5 text-gold-DEFAULT" />
          <h3 className="font-display font-semibold text-foreground">Center Performance Leaderboard</h3>
        </div>
        <div className="divide-y divide-border">
          {centerPerformance
            .sort((a, b) => b.score - a.score)
            .map((center, index) => (
              <div key={center.name} className="p-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0 ${
                  index === 0 ? 'bg-gold-DEFAULT text-emerald-dark' :
                  index === 1 ? 'bg-muted text-foreground' :
                  'bg-muted/50 text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{center.name}</p>
                  <p className="text-muted-foreground text-xs">{center.rentals} rentals · ⭐ {center.rating}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-emerald-DEFAULT">{center.score}</p>
                  <p className="text-xs text-muted-foreground">score</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
