import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MetricCard from '../../components/dashboard/MetricCard';
import { useOrderStore } from '../../store/orderStore';
import { Wallet, Shield, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '@/components/ui/badge';

const mockTransactions = [
  { id: 'TXN-001', type: 'deposit_hold', amount: -5000, description: 'Deposit held for ORD-001', date: new Date('2026-02-20'), status: 'completed' },
  { id: 'TXN-002', type: 'rental_payment', amount: -2500, description: 'Rental payment for ORD-001', date: new Date('2026-02-20'), status: 'completed' },
  { id: 'TXN-003', type: 'deposit_refund', amount: 8000, description: 'Deposit refund for ORD-003', date: new Date('2026-01-16'), status: 'completed' },
  { id: 'TXN-004', type: 'wallet_topup', amount: 10000, description: 'Wallet top-up', date: new Date('2026-01-10'), status: 'completed' },
];

export default function CustomerWallet() {
  const walletBalance = useOrderStore((s) => s.walletBalance);
  const depositHeld = useOrderStore((s) => s.depositHeld);

  return (
    <DashboardLayout title="Wallet & Deposits" subtitle="Manage your balance and security deposits">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Wallet Balance"
          value={formatCurrency(walletBalance)}
          icon={<Wallet className="h-4 w-4" />}
          accent="gold"
          subtitle="Available to spend"
        />
        <MetricCard
          title="Security Deposit Held"
          value={formatCurrency(depositHeld)}
          icon={<Shield className="h-4 w-4" />}
          accent="emerald"
          subtitle="Refundable after return QC"
        />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Transaction History</h3>
        </div>
        <div className="divide-y divide-border">
          {mockTransactions.map((txn) => {
            const isCredit = txn.amount > 0;
            return (
              <div key={txn.id} className="p-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCredit ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isCredit
                    ? <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    : <ArrowUpRight className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{txn.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDate(txn.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : ''}{formatCurrency(txn.amount)}
                  </p>
                  <Badge variant="outline" className="text-xs">{txn.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
