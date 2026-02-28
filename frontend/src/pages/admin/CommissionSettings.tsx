import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function CommissionSettings() {
  const [adminCommission, setAdminCommission] = useState('15');
  const [centerShare, setCenterShare] = useState('10');
  const [saving, setSaving] = useState(false);

  const vendorNet = 100 - Number(adminCommission) - Number(centerShare);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorNet < 0) {
      toast.error('Commission percentages cannot exceed 100%');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success('Commission settings saved successfully');
  };

  return (
    <DashboardLayout title="Commission Settings" subtitle="Configure platform commission and revenue share">
      <div className="max-w-lg space-y-6">
        <form onSubmit={handleSave} className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-gold-DEFAULT" />
            <h3 className="font-display font-semibold text-foreground">Commission Configuration</h3>
          </div>

          <div>
            <Label htmlFor="adminCommission">Admin Commission (%)</Label>
            <Input
              id="adminCommission"
              type="number"
              value={adminCommission}
              onChange={(e) => setAdminCommission(e.target.value)}
              min="0"
              max="50"
              step="0.5"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Platform fee deducted from each rental</p>
          </div>

          <div>
            <Label htmlFor="centerShare">Center Revenue Share (%)</Label>
            <Input
              id="centerShare"
              type="number"
              value={centerShare}
              onChange={(e) => setCenterShare(e.target.value)}
              min="0"
              max="50"
              step="0.5"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Share paid to the rental center</p>
          </div>

          {/* Formula Preview */}
          <div className="bg-ivory-dark rounded-lg p-4">
            <div className="flex items-center gap-1 mb-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Commission Formula</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Rental Price − <span className="text-red-600">{adminCommission}% Admin</span> − <span className="text-orange-600">{centerShare}% Center</span> = <span className={`font-semibold ${vendorNet >= 0 ? 'text-emerald-DEFAULT' : 'text-destructive'}`}>{vendorNet}% Vendor Net</span>
            </p>
          </div>

          <Button
            type="submit"
            disabled={saving || vendorNet < 0}
            className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </form>

        {/* History */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-display font-semibold text-foreground mb-3">Change History</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Admin: 15%, Center: 10%</span>
              <span>Current</span>
            </div>
            <div className="flex justify-between opacity-60">
              <span>Admin: 12%, Center: 8%</span>
              <span>Jan 2026</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
