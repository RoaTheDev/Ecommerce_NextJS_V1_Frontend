'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {PaginatedProduct} from '@/lib/types/productTypes';
import { useProducts } from '@/lib/queries/useProductQueries';
import {ProductCard} from "@/components/product/ProductCard";
import {LoadingSkeletons} from "@/components/product/LoadingSkeletion";

export default function ProductPage() {
    const [products, setProducts] = useState<PaginatedProduct[]>([]);
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={String(product.productId)} product={product} />
                ))}

                {hasMore && (
                    <div ref={ref} className="col-span-full flex justify-center py-8">
                        <LoadingSkeletons count={4} />
                    </div>
                )}
            </div>

            {isLoading && products.length === 0 && <LoadingSkeletons count={8} />}

            {!isLoading && products.length === 0 && (
                <div className="text-center py-12">
                    <h2 className="text-xl text-[hsl(var(--fauna-secondary))]">No products found</h2>
                </div>
            )}
        </div>
    );
}


