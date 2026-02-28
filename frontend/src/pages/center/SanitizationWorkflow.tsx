import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useOrderStore } from '../../store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, AlertTriangle, Loader2, Tag } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { formatDateTime } from '../../utils/formatters';

export default function SanitizationWorkflow() {
  const addSanitizationRecord = useOrderStore((s) => s.addSanitizationRecord);
  const sanitizationRecords = useOrderStore((s) => s.sanitizationRecords);

  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [cleaningType, setCleaningType] = useState('');
  const [chemicalUsed, setChemicalUsed] = useState('');
  const [staffName, setStaffName] = useState('');
  const [status, setStatus] = useState<'approved' | 'recleanRequired'>('approved');
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [generatedTag, setGeneratedTag] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !cleaningType || !staffName) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const tagId = status === 'approved' ? `SANT-${Date.now().toString(36).toUpperCase()}` : undefined;

    addSanitizationRecord({
      id: `SAN-${Date.now()}`,
      orderId,
      productId,
      cleaningType,
      chemicalUsed,
      staffName,
      dateTime: new Date(),
      beforeImageUrl: beforeFile ? URL.createObjectURL(beforeFile) : undefined,
      afterImageUrl: afterFile ? URL.createObjectURL(afterFile) : undefined,
      status,
      tagId,
    });

    if (status === 'approved' && tagId) {
      setGeneratedTag(tagId);
    }

    setSubmitting(false);
    toast.success(status === 'approved' ? 'Sanitization approved! Tag generated.' : 'Reclean required. Vendor notified.');
  };

  return (
    <DashboardLayout title="Sanitization Workflow" subtitle="Record and manage product sanitization">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-gold-DEFAULT" />
            <h3 className="font-display font-semibold text-foreground">Sanitization Checklist</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Order ID *</Label>
              <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="ORD-001" className="mt-1" required />
            </div>
            <div>
              <Label>Product ID</Label>
              <Input value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="prod-1" className="mt-1" />
            </div>
          </div>

          <div>
            <Label>Cleaning Type *</Label>
            <Select value={cleaningType} onValueChange={setCleaningType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select cleaning type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry_clean">Dry Clean</SelectItem>
                <SelectItem value="steam">Steam Clean</SelectItem>
                <SelectItem value="uv">UV Sterilization</SelectItem>
                <SelectItem value="chemical">Chemical Wash</SelectItem>
                <SelectItem value="combined">Combined Process</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Chemical Used</Label>
            <Input value={chemicalUsed} onChange={(e) => setChemicalUsed(e.target.value)} placeholder="e.g. Dettol Pro, Isopropyl Alcohol" className="mt-1" />
          </div>

          <div>
            <Label>Staff Name *</Label>
            <Input value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="Staff member name" className="mt-1" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Before Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)} className="mt-1" />
            </div>
            <div>
              <Label>After Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)} className="mt-1" />
            </div>
          </div>

          <div>
            <Label>Status *</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'approved' | 'recleanRequired')}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">✅ Approved</SelectItem>
                <SelectItem value="recleanRequired">⚠️ Reclean Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT">
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Sanitization Record
          </Button>
        </form>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Generated Tag */}
          {generatedTag && (
            <div className="bg-emerald-dark rounded-xl p-6 text-center">
              <Tag className="h-8 w-8 text-gold-DEFAULT mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-ivory-DEFAULT mb-1">Sanitization Tag Generated</h3>
              <div className="bg-ivory-DEFAULT/10 rounded-lg p-3 mb-3">
                <p className="font-mono text-gold-DEFAULT text-xl font-bold">{generatedTag}</p>
                <p className="text-ivory-DEFAULT/60 text-xs mt-1">{formatDateTime(new Date())}</p>
              </div>
              <p className="text-ivory-DEFAULT/70 text-sm">Attach this tag to the product before handover.</p>
            </div>
          )}

          {/* Recent Records */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">Recent Records</h3>
            </div>
            {sanitizationRecords.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">No records yet</div>
            ) : (
              <div className="divide-y divide-border">
                {sanitizationRecords.slice(-5).reverse().map((rec) => (
                  <div key={rec.id} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{rec.orderId}</p>
                      <p className="text-xs text-muted-foreground">{rec.staffName} · {rec.cleaningType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {rec.tagId && <span className="font-mono text-xs text-gold-DEFAULT">{rec.tagId}</span>}
                      <Badge className={`text-xs ${rec.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {rec.status === 'approved' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                        {rec.status === 'approved' ? 'Approved' : 'Reclean'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
