export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
}

export function exportToCsv<T>(data: T[], columns: CsvColumn<T>[], filename: string): void {
  const headers = columns.map((col) => col.header).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = col.accessor(row);
        const str = String(value);
        // Escape commas and quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
