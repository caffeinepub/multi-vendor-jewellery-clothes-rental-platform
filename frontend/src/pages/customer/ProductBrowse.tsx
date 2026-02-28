import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useGetProducts } from '../../hooks/useQueries';
import { ProductStatus } from '../../backend';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, Tag, Gem } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/formatters';

export default function ProductBrowse() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  const query = {
    only_approved: true,
    only_sanitized: false,
    status: statusFilter !== 'all' ? (statusFilter as ProductStatus) : undefined,
    min_rental_price: minPrice ? BigInt(minPrice) : undefined,
    max_rental_price: maxPrice ? BigInt(maxPrice) : undefined,
  };

  const { data: products, isLoading } = useGetProducts(query);

  const filtered = (products ?? []).filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-emerald-dark py-12">
        <div className="container mx-auto px-4">
          <p className="text-gold-DEFAULT text-sm font-medium tracking-widest uppercase mb-2">Collection</p>
          <h1 className="font-display text-4xl font-bold text-ivory-DEFAULT">Browse Products</h1>
          <p className="text-ivory-DEFAULT/70 mt-2">Discover premium jewellery and designer clothing</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={ProductStatus.atCenter}>At Center</SelectItem>
              <SelectItem value={ProductStatus.onTrial}>On Trial</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Min price (₹)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-32"
            type="number"
          />
          <Input
            placeholder="Max price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-32"
            type="number"
          />
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <SlidersHorizontal className="h-4 w-4" />
            <span>{filtered.length} results</span>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Gem className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const imageUrl = product.images[0]?.getDirectURL();
              return (
                <div
                  key={product.id.toString()}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:border-gold/40 hover:shadow-luxury transition-all duration-200 group cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: '/products/$productId',
                      params: { productId: product.id.toString() },
                    })
                  }
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gem className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground text-sm mb-1 truncate group-hover:text-emerald-DEFAULT transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-1 text-gold-DEFAULT">
                          <Tag className="h-3 w-3" />
                          <span className="font-semibold text-sm">{formatCurrency(Number(product.rental_price))}/day</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Deposit: {formatCurrency(Number(product.deposit_amount))}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(product.availability_status)}`}>
                        {getStatusLabel(product.availability_status)}
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full bg-emerald-DEFAULT hover:bg-emerald-light text-ivory-DEFAULT text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
