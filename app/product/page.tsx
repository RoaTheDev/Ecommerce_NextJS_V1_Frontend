'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PaginatedProduct, ProductFilterRequest, SortByEnum } from '@/lib/types/productTypes';
import { useProducts } from '@/lib/queries/useProductQueries';
import { ProductCard } from "@/components/product/ProductCard";
import { LoadingSkeletons } from "@/components/product/LoadingSkeletion";
import ProductFilter from "@/components/product/ProductFilter"; // Import the filter component
import { FormProvider, useForm } from 'react-hook-form'; // Import FormProvider

export default function ProductPage() {
    const [products, setProducts] = useState<PaginatedProduct[]>([]);
    const [cursor, setCursor] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { ref, inView } = useInView();
    const initialLoadComplete = useRef(false);

    // Initial filter parameters
    const initialFilterParams: ProductFilterRequest = {
        sortBy: SortByEnum.Latest
    };

    // Set up form context that will be passed to ProductFilter
    const formMethods = useForm({
        defaultValues: initialFilterParams
    });

    // Current filter parameters state
    const [filterParams, setFilterParams] = useState<ProductFilterRequest>(initialFilterParams);

    const PAGE_SIZE = 12;
    const { data, isLoading, isError } = useProducts(cursor, PAGE_SIZE, filterParams);

    useEffect(() => {
        if (data && !isLoading) {
            if (cursor === 0) {
                setProducts(data.products);
            } else {
                setProducts(prev => {
                    const productIds = new Set(prev.map(p => Number(p.productId)));
                    const newProducts = data.products.filter(p => !productIds.has(Number(p.productId)));
                    return [...prev, ...newProducts];
                });
            }

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
        }
    }, [inView, hasMore]);

    // Handler for filter changes
    const handleFilterChange = async (filter: ProductFilterRequest) => {
        // Reset pagination when filters change
        setProducts([]);
        setCursor(0);
        setHasMore(true);
        initialLoadComplete.current = false;

        // Update filter parameters
        setFilterParams(filter);
    };

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

            {/* Wrap the filter in FormProvider */}
            <FormProvider {...formMethods}>
                <ProductFilter
                    onFilterChangeAction={handleFilterChange}
                    initialFilter={filterParams}
                />
            </FormProvider>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {products.map((product) => (
                    <ProductCard key={String(product.productId)} product={product} />
                ))}

                {hasMore && (
                    <div ref={ref} className="col-span-full flex justify-center py-8">
                        {isLoading && <LoadingSkeletons count={4} />}
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