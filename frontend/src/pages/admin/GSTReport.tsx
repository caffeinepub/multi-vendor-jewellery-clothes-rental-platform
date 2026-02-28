import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Search, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Column } from '../../components/dashboard/DataTable';
import { toast } from 'sonner';

interface GSTRecord {
  id: string;
  transactionId: string;
  vendorName: string;
  gstNumber: string;
  rentalAmount: number;
  gstRate: number;
  gstAmount: number;
  date: Date;
  type: string;
}

const mockGSTData: GSTRecord[] = [
  { id: '1', transactionId: 'TXN-001', vendorName: 'Meera Jewels', gstNumber: '22AAAAA0000A1Z5', rentalAmount: 2500, gstRate: 18, gstAmount: 450, date: new Date('2026-02-20'), type: 'Rental' },
  { id: '2', transactionId: 'TXN-002', vendorName: 'Bridal Couture', gstNumber: '27BBBBB1111B2Y6', rentalAmount: 8000, gstRate: 18, gstAmount: 1440, date: new Date('2026-02-18'), type: 'Rental' },
  { id: '3', transactionId: 'TXN-003', vendorName: 'Diamond Dreams', gstNumber: '07CCCCC2222C3X7', rentalAmount: 3500, gstRate: 18, gstAmount: 630, date: new Date('2026-01-15'), type: 'Rental' },
  { id: '4', transactionId: 'TXN-004', vendorName: 'Ethnic Elegance', gstNumber: '29DDDDD3333D4W8', rentalAmount: 5000, gstRate: 18, gstAmount: 900, date: new Date('2026-01-10'), type: 'Rental' },
];

export default function GSTReport() {
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-02-28');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<GSTRecord[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 800));
    const filtered = mockGSTData.filter((r) => {
      const d = r.date;
      return d >= new Date(fromDate) && d <= new Date(toDate);
    });
    setReportData(filtered);
    setGenerated(true);
    setGenerating(false);
    toast.success(`GST report generated: ${filtered.length} records`);
  };

  const columns: Column<GSTRecord>[] = [
    { key: 'txn', header: 'Transaction ID', accessor: (r) => <span className="font-mono text-xs">{r.transactionId}</span>, csvAccessor: (r) => r.transactionId },
    { key: 'vendor', header: 'Vendor', accessor: (r) => <span className="text-sm font-medium">{r.vendorName}</span>, csvAccessor: (r) => r.vendorName },
    { key: 'gst', header: 'GST Number', accessor: (r) => <span className="font-mono text-xs">{r.gstNumber}</span>, csvAccessor: (r) => r.gstNumber },
    { key: 'amount', header: 'Rental Amount', accessor: (r) => formatCurrency(r.rentalAmount), csvAccessor: (r) => r.rentalAmount },
    { key: 'rate', header: 'GST Rate', accessor: (r) => `${r.gstRate}%`, csvAccessor: (r) => r.gstRate },
    { key: 'gstAmount', header: 'GST Amount', accessor: (r) => <span className="font-semibold text-emerald-DEFAULT">{formatCurrency(r.gstAmount)}</span>, csvAccessor: (r) => r.gstAmount },
    { key: 'date', header: 'Date', accessor: (r) => formatDate(r.date), csvAccessor: (r) => formatDate(r.date) },
    { key: 'type', header: 'Type', accessor: (r) => r.type, csvAccessor: (r) => r.type },
  ];

  const totalGST = reportData.reduce((s, r) => s + r.gstAmount, 0);

  return (
    <DashboardLayout title="GST Report" subtitle="Generate and export GST reports">
      <div className="space-y-6">
        {/* Filter Form */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gold-DEFAULT" />
            <h3 className="font-display font-semibold text-foreground">Report Parameters</h3>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label>From Date</Label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mt-1 w-40" />
            </div>
            <div>
              <Label>To Date</Label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mt-1 w-40" />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-2"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Generate Report
            </Button>
          </div>
        </div>

        {/* Results */}
        {generated && (
          <>
            {reportData.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-emerald-DEFAULT" />
                <div>
                  <p className="text-sm text-muted-foreground">Total GST Collected</p>
                  <p className="font-display text-xl font-bold text-emerald-DEFAULT">{formatCurrency(totalGST)}</p>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Records</p>
                  <p className="font-display text-xl font-bold">{reportData.length}</p>
                </div>
              </div>
            )}
            <DataTable
              data={reportData}
              columns={columns}
              title="GST Transactions"
              searchPlaceholder="Search transactions..."
              searchAccessor={(r) => `${r.transactionId} ${r.vendorName} ${r.gstNumber}`}
              csvFilename={`gst-report-${fromDate}-to-${toDate}`}
              emptyMessage="No GST records found for the selected period"
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
