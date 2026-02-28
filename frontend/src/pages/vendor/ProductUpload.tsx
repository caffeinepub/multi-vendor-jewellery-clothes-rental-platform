import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useUploadProduct } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ImagePlus, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductUpload() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const uploadProduct = useUploadProduct();

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rentalPrice || !depositAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUploadProgress(10);
      const blobs: ExternalBlob[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const bytes = new Uint8Array(await imageFiles[i].arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(10 + Math.round((pct / 100) * 70 * ((i + 1) / imageFiles.length)));
        });
        blobs.push(blob);
      }
      setUploadProgress(80);

      await uploadProduct.mutateAsync({
        name,
        description,
        rental_price: BigInt(rentalPrice),
        deposit_amount: BigInt(depositAmount),
        images: blobs,
      });

      setUploadProgress(100);
      setSubmitted(true);
      toast.success('Product uploaded successfully! Awaiting admin approval.');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error?.message ?? 'Upload failed');
      setUploadProgress(0);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout title="Upload Product">
        <div className="max-w-lg mx-auto bg-card rounded-xl border border-border p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-DEFAULT mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">Product Uploaded!</h3>
          <p className="text-muted-foreground mb-4">Your product is pending admin approval. You'll be notified once it's live.</p>
          <Button onClick={() => { setSubmitted(false); setName(''); setDescription(''); setRentalPrice(''); setDepositAmount(''); setImageFiles([]); setUploadProgress(0); }}
            className="bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT">
            Upload Another
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Upload Product" subtitle="Add a new product to your inventory">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Royal Kundan Necklace Set" className="mt-1" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." className="mt-1 min-h-[80px]" />
            </div>
            <div>
              <Label htmlFor="rental">Rental Price (₹/day) *</Label>
              <Input id="rental" type="number" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} placeholder="2500" className="mt-1" required min="1" />
            </div>
            <div>
              <Label htmlFor="deposit">Security Deposit (₹) *</Label>
              <Input id="deposit" type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="5000" className="mt-1" required min="1" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Images (up to 5)</Label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {imageFiles.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imageFiles.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-gold/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageAdd} className="sr-only" />
                </label>
              )}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Uploading... {uploadProgress}%</p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button
            type="submit"
            disabled={uploadProduct.isPending}
            className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT gap-2"
          >
            {uploadProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload Product
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
