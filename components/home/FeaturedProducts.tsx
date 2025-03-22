'use client';

import React, {useEffect, useState} from 'react';
import {useProducts} from '@/lib/queries/useProductQueries';
import {PaginatedProduct} from '@/lib/types/productTypes';
import {Skeleton} from '@/components/ui/skeleton';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

const FeaturedProducts: React.FC = () => {
    const router = useRouter();
    const {data, isLoading} = useProducts(0, 4);
    const [featuredProducts, setFeaturedProducts] = useState<PaginatedProduct[]>([]);

    useEffect(() => {
        if (data?.products) {
            setFeaturedProducts(data.products);
        }
    }, [data]);

    const handleViewProduct = (productId: number) => {
        router.push(`/product/${productId}`);
    };

    const handleAddToCart = (e: React.MouseEvent, product: PaginatedProduct) => {
        e.stopPropagation();
        console.log(`Adding product ${product.productId} to cart`);
    };

    const handleViewAllProducts = () => {
        router.push('/product');
    };

    const BASE_URL = "http://localhost:5297"; // Replace with your actual backend URL

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return '/Fauna.png';

        if (!imagePath.startsWith('/')) {
            imagePath = `/${imagePath}`;
        }
        return `${BASE_URL}${imagePath}`;
    };

    const renderProductCard = (product: PaginatedProduct) => {
        const imageUrl = getImageUrl(product.imageUrls);
        const imageAlt = product.productName;

        return (
            <div
                key={product.productId.toString()}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewProduct(product.productId)}
            >
                <div className="h-64 overflow-hidden relative">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        priority
                        width={300}
                        height={300}
                        className="w-full h-full transition-transform hover:scale-105 duration-300"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/Fauna.png';
                        }}
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-[#8B6E47] text-white px-2 py-1 rounded-md text-sm font-medium">
                            -{product.discount}%
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-[#212121] line-clamp-2">
                        {product.productName}
                    </h3>
                    <div className="flex justify-between items-center">
                        <div>
                            {product.discount > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-[#3A8C5C] font-bold">
                                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="text-gray-400 text-sm line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[#3A8C5C] font-bold">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <button
                            className="bg-[#5CBD7B] text-white p-2 rounded-full hover:bg-[#3A8C5C] transition-colors"
                            onClick={(e) => handleAddToCart(e, product)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center text-[#212121]">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.from({length: 4}).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                                <Skeleton className="w-full h-64"/>
                                <div className="p-4">
                                    <Skeleton className="h-6 w-3/4 mb-2"/>
                                    <Skeleton className="h-5 w-1/4"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center text-[#212121]">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => renderProductCard(product))}
                </div>
                <div className="mt-12 text-center">
                    <button
                        onClick={handleViewAllProducts}
                        className="bg-[#5CBD7B] text-white px-6 py-2 rounded-md hover:bg-[#3A8C5C] transition-colors"
                    >
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;