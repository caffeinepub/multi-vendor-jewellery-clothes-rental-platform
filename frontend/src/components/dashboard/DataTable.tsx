import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportToCsv, CsvColumn } from '../../utils/csvExport';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  csvAccessor?: (row: T) => string | number;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  statusFilter?: { key: string; options: { value: string; label: string }[] };
  statusAccessor?: (row: T) => string;
  csvFilename?: string;
  pageSize?: number;
  emptyMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  title,
  searchPlaceholder = 'Search...',
  searchAccessor,
  statusFilter,
  statusAccessor,
  csvFilename = 'export',
  pageSize = 10,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [statusValue, setStatusValue] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = data;
    if (search && searchAccessor) {
      result = result.filter((row) =>
        searchAccessor(row).toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusValue !== 'all' && statusAccessor) {
      result = result.filter((row) => statusAccessor(row) === statusValue);
    }
    return result;
  }, [data, search, searchAccessor, statusValue, statusAccessor]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleExport = () => {
    const csvColumns: CsvColumn<T>[] = columns
      .filter((col) => col.csvAccessor)
      .map((col) => ({
        header: col.header,
        accessor: col.csvAccessor!,
      }));
    exportToCsv(filtered, csvColumns, csvFilename);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {title && <h3 className="font-display font-semibold text-foreground">{title}</h3>}
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          {searchAccessor && (
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 h-9 w-full sm:w-48"
              />
            </div>
          )}
          {statusFilter && (
            <Select value={statusValue} onValueChange={(v) => { setStatusValue(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusFilter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9 gap-1.5 border-gold/30 hover:border-gold-DEFAULT"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-foreground/80 whitespace-nowrap">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {col.accessor(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
