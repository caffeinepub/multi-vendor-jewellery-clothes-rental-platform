import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import { useOrderStore } from '../../store/orderStore';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import type { Column } from '../../components/dashboard/DataTable';
import type { Order } from '../../store/orderStore';

export default function RentalHistory() {
  const orders = useOrderStore((s) => s.orders);

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      accessor: (row) => <span className="font-mono text-xs font-medium">{row.id}</span>,
      csvAccessor: (row) => row.id,
    },
    {
      key: 'product',
      header: 'Product',
      accessor: (row) => <span className="font-medium text-sm">{row.productName}</span>,
      csvAccessor: (row) => row.productName,
    },
    {
      key: 'center',
      header: 'Center',
      accessor: (row) => <span className="text-sm text-muted-foreground">{row.centerName}</span>,
      csvAccessor: (row) => row.centerName,
    },
    {
      key: 'rentalStart',
      header: 'Start Date',
      accessor: (row) => row.rentalStart ? formatDate(row.rentalStart) : '—',
      csvAccessor: (row) => row.rentalStart ? formatDate(row.rentalStart) : '',
    },
    {
      key: 'rentalEnd',
      header: 'End Date',
      accessor: (row) => row.rentalEnd ? formatDate(row.rentalEnd) : '—',
      csvAccessor: (row) => row.rentalEnd ? formatDate(row.rentalEnd) : '',
    },
    {
      key: 'rentalPrice',
      header: 'Amount',
      accessor: (row) => <span className="font-medium">{formatCurrency(row.rentalPrice)}</span>,
      csvAccessor: (row) => row.rentalPrice,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge className={`text-xs ${getStatusColor(row.status)}`}>
          {getStatusLabel(row.status)}
        </Badge>
      ),
      csvAccessor: (row) => getStatusLabel(row.status),
    },
  ];

  return (
    <DashboardLayout title="Rental History" subtitle="All your past and active rentals">
      <DataTable
        data={orders}
        columns={columns}
        title="All Orders"
        searchPlaceholder="Search orders..."
        searchAccessor={(row) => `${row.productName} ${row.id} ${row.centerName}`}
        statusFilter={{
          key: 'status',
          options: [
            { value: 'trialBooked', label: 'Trial Booked' },
            { value: 'rented', label: 'Rented' },
            { value: 'returned', label: 'Returned' },
            { value: 'closed', label: 'Closed' },
          ],
        }}
        statusAccessor={(row) => row.status}
        csvFilename="rental-history"
        emptyMessage="No rental history found"
      />
    </DashboardLayout>
  );
}
