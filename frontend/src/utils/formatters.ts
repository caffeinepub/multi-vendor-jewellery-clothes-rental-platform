export function formatCurrency(amount: bigint | number): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    trialBooked: 'bg-blue-100 text-blue-800',
    trialCompleted: 'bg-indigo-100 text-indigo-800',
    paymentDone: 'bg-yellow-100 text-yellow-800',
    sanitizing: 'bg-orange-100 text-orange-800',
    readyForHandover: 'bg-purple-100 text-purple-800',
    rented: 'bg-green-100 text-green-800',
    returned: 'bg-teal-100 text-teal-800',
    closed: 'bg-gray-100 text-gray-800',
    atVendor: 'bg-gray-100 text-gray-700',
    atCenter: 'bg-blue-100 text-blue-700',
    onTrial: 'bg-yellow-100 text-yellow-700',
    underSanitization: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    trialBooked: 'Trial Booked',
    trialCompleted: 'Trial Completed',
    paymentDone: 'Payment Done',
    sanitizing: 'Sanitizing',
    readyForHandover: 'Ready for Handover',
    rented: 'Rented',
    returned: 'Returned',
    closed: 'Closed',
    atVendor: 'At Vendor',
    atCenter: 'At Center',
    onTrial: 'On Trial',
    underSanitization: 'Under Sanitization',
  };
  return map[status] ?? status;
}
