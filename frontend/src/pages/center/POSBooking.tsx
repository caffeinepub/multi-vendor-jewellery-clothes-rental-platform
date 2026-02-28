import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { useGetProducts } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { ProductStatus } from '../../backend';

export default function POSBooking() {
  const { data: products } = useGetProducts({ only_approved: true, only_sanitized: false, status: ProductStatus.atCenter });
  const addTrialBooking = useOrderStore((s) => s.addTrialBooking);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [trialDate, setTrialDate] = useState('');
  const [trialTime, setTrialTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedProduct || !trialDate || !trialTime) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const product = (products ?? []).find((p) => p.id.toString() === selectedProduct);
    addTrialBooking({
      id: `TRIAL-POS-${Date.now()}`,
      customerId: `walkin-${Date.now()}`,
      productId: selectedProduct,
      productName: product?.name ?? 'Unknown Product',
      centerId: 'center-1',
      centerName: 'This Center',
      trialDate: new Date(`${trialDate}T${trialTime}`),
      status: 'confirmed',
      createdAt: new Date(),
    });
    setSubmitting(false);
    setDone(true);
    toast.success('Walk-in trial booked successfully');
  };

  if (done) {
    return (
      <DashboardLayout title="POS Booking">
        <div className="max-w-lg mx-auto bg-card rounded-xl border border-border p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-DEFAULT mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">Trial Booked!</h3>
          <p className="text-muted-foreground mb-4">Walk-in trial has been scheduled successfully.</p>
          <Button onClick={() => { setDone(false); setCustomerName(''); setCustomerPhone(''); setSelectedProduct(''); setTrialDate(''); setTrialTime(''); }}
            className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT">
            Book Another
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="POS Walk-in Booking" subtitle="Book a trial for walk-in customers">
      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-5 w-5 text-gold-DEFAULT" />
            <h3 className="font-display font-semibold text-foreground">Walk-in Customer Details</h3>
          </div>
          <div>
            <Label>Customer Name *</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name" className="mt-1" required />
          </div>
          <div>
            <Label>Phone Number *</Label>
            <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1" required />
          </div>
          <div>
            <Label>Select Product *</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {(products ?? []).map((p) => (
                  <SelectItem key={p.id.toString()} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Trial Date *</Label>
              <Input type="date" value={trialDate} onChange={(e) => setTrialDate(e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label>Trial Time *</Label>
              <Input type="time" value={trialTime} onChange={(e) => setTrialTime(e.target.value)} className="mt-1" required />
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT">
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Book Trial
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
