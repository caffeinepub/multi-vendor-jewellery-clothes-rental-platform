import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, Shield, MapPin, Sparkles, ArrowLeft, Gem, Calendar } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters';
import { useOrderStore } from '../../store/orderStore';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/products/$productId' });
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useAuth();
  const addTrialBooking = useOrderStore((s) => s.addTrialBooking);

  const handleBookTrial = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a trial');
      return;
    }
    if (!product) return;
    addTrialBooking({
      id: `TRIAL-${Date.now()}`,
      customerId: 'cust-1',
      productId: product.id.toString(),
      productName: product.name,
      centerId: product.center_id.toString(),
      centerName: `Center #${product.center_id}`,
      trialDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'confirmed',
      createdAt: new Date(),
    });
    toast.success('Trial booked successfully! Check your dashboard for details.');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Gem className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Product not found</h2>
        <Button asChild variant="outline">
          <Link to="/products"><ArrowLeft className="h-4 w-4 mr-2" />Back to Browse</Link>
        </Button>
      </div>
    );
  }

  const images = product.images.map((img) => img.getDirectURL());

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-1 text-muted-foreground">
        <Link to="/products"><ArrowLeft className="h-4 w-4" />Back to Browse</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gem className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-gold-DEFAULT' : 'border-border'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
            <Badge className={`${getStatusColor(product.availability_status)} ml-2 flex-shrink-0`}>
              {getStatusLabel(product.availability_status)}
            </Badge>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          {/* Pricing */}
          <div className="bg-ivory-dark rounded-xl p-4 mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Rental Price</p>
              <div className="flex items-center gap-1 text-gold-DEFAULT">
                <Tag className="h-4 w-4" />
                <span className="font-display text-xl font-bold">{formatCurrency(Number(product.rental_price))}</span>
              </div>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Security Deposit</p>
              <div className="flex items-center gap-1 text-emerald-DEFAULT">
                <Shield className="h-4 w-4" />
                <span className="font-display text-xl font-bold">{formatCurrency(Number(product.deposit_amount))}</span>
              </div>
              <p className="text-xs text-muted-foreground">refundable</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            {product.sanitization_status && (
              <div className="flex items-center gap-2 text-sm text-emerald-DEFAULT">
                <Sparkles className="h-4 w-4" />
                <span>Sanitization Verified</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Available at Center #{product.center_id.toString()}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={handleBookTrial}
              size="lg"
              className="w-full bg-gold-DEFAULT hover:bg-gold-dark text-emerald-dark font-semibold gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book a Trial
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Visit the center to try before you rent. No commitment required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
