import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Column } from '../../components/dashboard/DataTable';

interface Payout {
  id: string;
  orderId: string;
  date: Date;
  gross: number;
  adminCommission: number;
  centerShare: number;
  net: number;
  status: 'completed' | 'pending' | 'processing';
}

const mockPayouts: Payout[] = [
  { id: 'PAY-001', orderId: 'ORD-003', date: new Date('2026-01-18'), gross: 3500, adminCommission: 525, centerShare: 350, net: 2625, status: 'completed' },
  { id: 'PAY-002', orderId: 'ORD-001', date: new Date('2026-02-27'), gross: 2500, adminCommission: 375, centerShare: 250, net: 1875, status: 'pending' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
};

export default function PayoutHistory() {
  const columns: Column<Payout>[] = [
    { key: 'id', header: 'Payout ID', accessor: (r) => <span className="font-mono text-xs">{r.id}</span>, csvAccessor: (r) => r.id },
    { key: 'orderId', header: 'Order', accessor: (r) => <span className="text-sm">{r.orderId}</span>, csvAccessor: (r) => r.orderId },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date), csvAccessor: (r) => formatDate(r.date) },
    { key: 'gross', header: 'Gross', accessor: (r) => formatCurrency(r.gross), csvAccessor: (r) => r.gross },
    { key: 'commission', header: 'Commission', accessor: (r) => <span className="text-red-600">-{formatCurrency(r.adminCommission)}</span>, csvAccessor: (r) => r.adminCommission },
    { key: 'centerShare', header: 'Center Share', accessor: (r) => <span className="text-orange-600">-{formatCurrency(r.centerShare)}</span>, csvAccessor: (r) => r.centerShare },
    { key: 'net', header: 'Net Payout', accessor: (r) => <span className="font-semibold text-emerald-DEFAULT">{formatCurrency(r.net)}</span>, csvAccessor: (r) => r.net },
    { key: 'status', header: 'Status', accessor: (r) => <Badge className={`text-xs ${statusColors[r.status]}`}>{r.status}</Badge>, csvAccessor: (r) => r.status },
  ];

  return (
    <DashboardLayout title="Payout History" subtitle="All completed and pending payouts">
      <DataTable
        data={mockPayouts}
        columns={columns}
        title="Payouts"
        searchPlaceholder="Search payouts..."
        searchAccessor={(r) => `${r.id} ${r.orderId}`}
        statusFilter={{ key: 'status', options: [
          { value: 'completed', label: 'Completed' },
          { value: 'pending', label: 'Pending' },
          { value: 'processing', label: 'Processing' },
        ]}}
        statusAccessor={(r) => r.status}
        csvFilename="payout-history"
      />
    </DashboardLayout>
  );
}
