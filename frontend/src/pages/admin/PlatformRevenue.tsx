import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartWrapper from '../../components/dashboard/ChartWrapper';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, TrendingUp, Percent, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const revenueData = [
  { name: 'Oct', total: 45000, commission: 6750, centerShare: 4500, vendor: 33750 },
  { name: 'Nov', total: 62000, commission: 9300, centerShare: 6200, vendor: 46500 },
  { name: 'Dec', total: 89000, commission: 13350, centerShare: 8900, vendor: 66750 },
  { name: 'Jan', total: 54000, commission: 8100, centerShare: 5400, vendor: 40500 },
  { name: 'Feb', total: 71000, commission: 10650, centerShare: 7100, vendor: 53250 },
];

export default function PlatformRevenue() {
  const [period, setPeriod] = useState('monthly');

  const totalRevenue = revenueData.reduce((s, d) => s + d.total, 0);
  const totalCommission = revenueData.reduce((s, d) => s + d.commission, 0);
  const totalCenterShare = revenueData.reduce((s, d) => s + d.centerShare, 0);
  const totalVendorPayout = revenueData.reduce((s, d) => s + d.vendor, 0);

  return (
    <DashboardLayout title="Platform Revenue" subtitle="Cumulative revenue and financial overview">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="h-4 w-4" />} accent="gold" trend="up" trendValue="+22%" />
        <MetricCard title="Admin Commission" value={formatCurrency(totalCommission)} icon={<Percent className="h-4 w-4" />} accent="emerald" subtitle="15% of rentals" />
        <MetricCard title="Center Payouts" value={formatCurrency(totalCenterShare)} icon={<TrendingUp className="h-4 w-4" />} subtitle="10% of rentals" />
        <MetricCard title="Vendor Payouts" value={formatCurrency(totalVendorPayout)} icon={<CreditCard className="h-4 w-4" />} subtitle="75% of rentals" />
      </div>

      <div className="space-y-6">
        <ChartWrapper
          type="line"
          data={revenueData}
          dataKeys={[
            { key: 'total', color: 'oklch(0.72 0.12 75)', name: 'Total Revenue' },
            { key: 'commission', color: 'oklch(0.32 0.09 165)', name: 'Admin Commission' },
          ]}
          xKey="name"
          title="Revenue Trend"
          height={250}
        />

        <ChartWrapper
          type="bar"
          data={revenueData}
          dataKeys={[
            { key: 'commission', color: 'oklch(0.32 0.09 165)', name: 'Admin Commission' },
            { key: 'centerShare', color: 'oklch(0.72 0.12 75)', name: 'Center Share' },
            { key: 'vendor', color: 'oklch(0.55 0.1 70)', name: 'Vendor Payout' },
          ]}
          xKey="name"
          title="Revenue Distribution"
          height={250}
        />
      </div>
    </DashboardLayout>
  );
}
