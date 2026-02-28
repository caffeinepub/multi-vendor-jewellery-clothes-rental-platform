import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import { useOrderStore } from '../../store/orderStore';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import type { Column } from '../../components/dashboard/DataTable';
import type { Order } from '../../store/orderStore';

export default function VendorOrdersList() {
  const orders = useOrderStore((s) => s.orders);

  const columns: Column<Order>[] = [
    { key: 'id', header: 'Order ID', accessor: (r) => <span className="font-mono text-xs">{r.id}</span>, csvAccessor: (r) => r.id },
    { key: 'product', header: 'Product', accessor: (r) => <span className="font-medium text-sm">{r.productName}</span>, csvAccessor: (r) => r.productName },
    { key: 'center', header: 'Center', accessor: (r) => <span className="text-sm text-muted-foreground">{r.centerName}</span>, csvAccessor: (r) => r.centerName },
    { key: 'start', header: 'Start', accessor: (r) => r.rentalStart ? formatDate(r.rentalStart) : '—', csvAccessor: (r) => r.rentalStart ? formatDate(r.rentalStart) : '' },
    { key: 'end', header: 'End', accessor: (r) => r.rentalEnd ? formatDate(r.rentalEnd) : '—', csvAccessor: (r) => r.rentalEnd ? formatDate(r.rentalEnd) : '' },
    { key: 'amount', header: 'Rental', accessor: (r) => <span className="font-medium">{formatCurrency(r.rentalPrice)}</span>, csvAccessor: (r) => r.rentalPrice },
    { key: 'status', header: 'Status', accessor: (r) => <Badge className={`text-xs ${getStatusColor(r.status)}`}>{getStatusLabel(r.status)}</Badge>, csvAccessor: (r) => getStatusLabel(r.status) },
  ];

  return (
    <DashboardLayout title="Rental Orders" subtitle="Orders involving your products">
      <DataTable
        data={orders}
        columns={columns}
        title="All Orders"
        searchPlaceholder="Search orders..."
        searchAccessor={(r) => `${r.productName} ${r.id}`}
        statusFilter={{ key: 'status', options: [
          { value: 'rented', label: 'Rented' },
          { value: 'returned', label: 'Returned' },
          { value: 'closed', label: 'Closed' },
        ]}}
        statusAccessor={(r) => r.status}
        csvFilename="vendor-orders"
      />
    </DashboardLayout>
  );
}
