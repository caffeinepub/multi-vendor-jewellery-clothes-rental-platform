import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartWrapper from '../../components/dashboard/ChartWrapper';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, DollarSign, Percent, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ADMIN_COMMISSION = 0.15;
const CENTER_SHARE = 0.10;

const monthlyData = [
  { name: 'Oct', gross: 12000 },
  { name: 'Nov', gross: 18000 },
  { name: 'Dec', gross: 25000 },
  { name: 'Jan', gross: 15000 },
  { name: 'Feb', gross: 22000 },
];

export default function EarningsSummary() {
  const [period, setPeriod] = useState('monthly');

  const totalGross = monthlyData.reduce((s, d) => s + d.gross, 0);
  const adminCommission = Math.round(totalGross * ADMIN_COMMISSION);
  const centerShare = Math.round(totalGross * CENTER_SHARE);
  const netPayout = totalGross - adminCommission - centerShare;

  const chartData = monthlyData.map((d) => ({
    name: d.name,
    gross: d.gross,
    adminCommission: Math.round(d.gross * ADMIN_COMMISSION),
    centerShare: Math.round(d.gross * CENTER_SHARE),
    net: Math.round(d.gross * (1 - ADMIN_COMMISSION - CENTER_SHARE)),
  }));

  return (
    <DashboardLayout title="Earnings Summary" subtitle="Revenue breakdown and commission details">
      <div className="flex items-center justify-between mb-6">
        <div />
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Gross Revenue" value={formatCurrency(totalGross)} icon={<TrendingUp className="h-4 w-4" />} accent="emerald" />
        <MetricCard title="Admin Commission (15%)" value={formatCurrency(adminCommission)} icon={<Percent className="h-4 w-4" />} subtitle="Deducted" />
        <MetricCard title="Center Share (10%)" value={formatCurrency(centerShare)} icon={<DollarSign className="h-4 w-4" />} subtitle="Deducted" />
        <MetricCard title="Net Payout" value={formatCurrency(netPayout)} icon={<CreditCard className="h-4 w-4" />} accent="gold" trend="up" trendValue="+75%" />
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <h3 className="font-display font-semibold text-foreground mb-2">Commission Formula</h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Rental Price</span>
          {' − '}
          <span className="text-red-600">Admin Commission (15%)</span>
          {' − '}
          <span className="text-orange-600">Center Share (10%)</span>
          {' = '}
          <span className="font-semibold text-emerald-DEFAULT">Vendor Net (75%)</span>
        </p>
      </div>

      <ChartWrapper
        type="bar"
        data={chartData}
        dataKeys={[
          { key: 'gross', color: 'oklch(0.32 0.09 165)', name: 'Gross' },
          { key: 'net', color: 'oklch(0.72 0.12 75)', name: 'Net Payout' },
          { key: 'adminCommission', color: 'oklch(0.577 0.245 27.325)', name: 'Admin Commission' },
        ]}
        xKey="name"
        title="Monthly Earnings Breakdown"
        height={280}
      />
    </DashboardLayout>
  );
}
