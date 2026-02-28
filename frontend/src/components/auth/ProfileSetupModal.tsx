import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Gem } from 'lucide-react';
import { useRegisterCustomer, useRegisterVendor, useRegisterCenter } from '../../hooks/useQueries';
import { UserRole } from '../../backend';
import { ExternalBlob } from '../../backend';

interface ProfileSetupModalProps {
  open: boolean;
}

type RoleOption = 'customer' | 'vendor' | 'center';

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<RoleOption>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [bankKyc, setBankKyc] = useState('');
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const registerCustomer = useRegisterCustomer();
  const registerVendor = useRegisterVendor();
  const registerCenter = useRegisterCenter();

  const isLoading =
    registerCustomer.isPending || registerVendor.isPending || registerCenter.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (role === 'customer') {
        let kycBlob: ExternalBlob | null = null;
        if (kycFile) {
          const bytes = new Uint8Array(await kycFile.arrayBuffer());
          kycBlob = ExternalBlob.fromBytes(bytes);
        }
        await registerCustomer.mutateAsync({ name, email, phone, kyc_doc: kycBlob });
      } else if (role === 'vendor') {
        if (!gstNumber.trim() || !bankKyc.trim()) {
          setError('GST number and bank KYC are required for vendors.');
          return;
        }
        await registerVendor.mutateAsync({ name, email, phone, gst_number: gstNumber, bank_kyc: bankKyc });
      } else if (role === 'center') {
        await registerCenter.mutateAsync({ name, email, phone });
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-ivory" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Gem className="h-5 w-5 text-gold-DEFAULT" />
            <span className="font-display text-lg font-semibold text-emerald-DEFAULT">
              Welcome to RentLux
            </span>
          </div>
          <DialogTitle className="font-display text-xl">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Set up your account to start exploring premium rentals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {step === 1 && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2 block">I want to join as</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as RoleOption)} className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'customer', label: 'Customer', desc: 'Browse & rent' },
                    { value: 'vendor', label: 'Vendor', desc: 'List products' },
                    { value: 'center', label: 'Center', desc: 'Manage rentals' },
                  ].map((opt) => (
                    <div key={opt.value} className="relative">
                      <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                      <Label
                        htmlFor={opt.value}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                          role === opt.value
                            ? 'border-gold-DEFAULT bg-gold-light/20'
                            : 'border-border hover:border-gold/50'
                        }`}
                      >
                        <span className="font-medium text-sm">{opt.label}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{opt.desc}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT"
              >
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                    required
                  />
                </div>

                {role === 'vendor' && (
                  <>
                    <div>
                      <Label htmlFor="gst">GST Number *</Label>
                      <Input
                        id="gst"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        placeholder="22AAAAA0000A1Z5"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank">Bank Account Details *</Label>
                      <Input
                        id="bank"
                        value={bankKyc}
                        onChange={(e) => setBankKyc(e.target.value)}
                        placeholder="Account No / IFSC"
                        className="mt-1"
                        required
                      />
                    </div>
                  </>
                )}

                {role === 'customer' && (
                  <div>
                    <Label htmlFor="kyc">KYC Document (optional)</Label>
                    <Input
                      id="kyc"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setKycFile(e.target.files?.[0] ?? null)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Upload Aadhaar, PAN, or Passport</p>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
