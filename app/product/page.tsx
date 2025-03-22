// app/product/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductByIdResponse } from '@/lib/types/productTypes';
import { useProducts } from '@/lib/queries/useProductQueries';

export default function ProductPage() {
    const [products, setProducts] = useState<ProductByIdResponse[]>([]);
    const [cursor, setCursor] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { ref, inView } = useInView();
    const initialLoadComplete = useRef(false);

    const PAGE_SIZE = 12;
    const { data, isLoading, isError } = useProducts(cursor, PAGE_SIZE);

    useEffect(() => {
        if (data && !isLoading) {
            setProducts(prev => {
                // Filter out duplicates
                const productIds = new Set(prev.map(p => Number(p.productId)));
                const newProducts = data.products.filter(p => !productIds.has(Number(p.productId)));
                return [...prev, ...newProducts];
            });

            setHasMore(data.nextCursor !== null);
            if (data.nextCursor !== null) {
                setCursor(data.nextCursor);
            }
            initialLoadComplete.current = true;
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (inView && hasMore && initialLoadComplete.current) {
            // Load more products when the last item is in view
            // The actual loading is triggered by changing cursor which updates the useProducts hook
        }
    }, [inView, hasMore]);

    if (isError) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error loading products</h1>
                <p className="mt-4">Something went wrong. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-[hsl(var(--fauna-background))]">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[hsl(var(--fauna-deep))] text-center">
                Our Products
            </h1>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={String(product.productId)} product={product} />
                ))}

                {/* Loading more indicator */}
                {hasMore && (
                    <div ref={ref} className="col-span-full flex justify-center py-8">
                        <LoadingSkeletons count={4} />
                    </div>
                )}
            </div>

            {/* Initial loading state */}
            {isLoading && products.length === 0 && <LoadingSkeletons count={8} />}

            {/* No products found */}
            {!isLoading && products.length === 0 && (
                <div className="text-center py-12">
                    <h2 className="text-xl text-[hsl(var(--fauna-secondary))]">No products found</h2>
                </div>
            )}
        </div>
    );
}

function ProductCard({ product }: { product: ProductByIdResponse }) {
    const hasDiscount = product.discount > 0;
    const discountedPrice = product.price - (product.price * (product.discount / 100));

    return (
        <Link href={`/product/${product.productId}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden border border-[hsl(var(--fauna-light)/30%)] hover:border-[hsl(var(--fauna-primary))]">
                <div className="aspect-square relative overflow-hidden bg-[hsl(var(--fauna-background)/50%)]">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                            src={product.imageUrls[0]}
                            alt={product.productName}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--fauna-background))]">
                            <span className="text-[hsl(var(--fauna-secondary))]">No image</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <Badge className="absolute top-2 right-2 bg-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-deep))]">
                        {product.categoryName}
                    </Badge>

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-secondary))]">
                            {product.discount}% OFF
                        </Badge>
                    )}
                </div>

                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg truncate text-[hsl(var(--fauna-deep))]">
                        {product.productName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 h-10 mt-1">
                        {product.description}
                    </p>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {product.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-[hsl(var(--fauna-background))] border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))]">
                                    {tag}
                                </Badge>
                            ))}
                            {product.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-[hsl(var(--fauna-background))] border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))]">
                                    +{product.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div>
                        {hasDiscount ? (
                            <div className="flex flex-col">
                <span className="text-lg font-bold text-[hsl(var(--fauna-primary))]">
                  ${discountedPrice.toFixed(2)}
                </span>
                                <span className="text-sm line-through text-gray-500">
                  ${product.price.toFixed(2)}
                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-[hsl(var(--fauna-primary))]">
                ${product.price.toFixed(2)}
              </span>
                        )}
                    </div>

                    <div className="text-sm text-[hsl(var(--fauna-secondary))]">
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}

function LoadingSkeletons({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {Array(count).fill(0).map((_, i) => (
                <Card key={i} className="h-full">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-6 w-1/3" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}