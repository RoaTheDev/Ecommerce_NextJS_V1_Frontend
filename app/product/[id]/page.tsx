// app/product/[id]/page.tsx
'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Image from 'next/image';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {ChevronLeft, Heart, ShoppingCart} from 'lucide-react';
import {Card} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useProduct} from '@/lib/queries/useProductQueries';

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id ? Number(params.id as string) : undefined;
    const {data: product, isLoading, isError} = useProduct(productId);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product?.imageUrls) {
            if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
                setSelectedImage(product.imageUrls[0]);
            }
        }
    }, [product]);

    const handleBackClick = () => {
        router.back();
    };

    const incrementQuantity = () => {
        if (product && quantity < product.quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (isLoading) {
        return <ProductDetailSkeleton/>;
    }

    if (isError || !product) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
                <p className="mt-4">The product you are looking for does not exist or has been removed.</p>
                <Button onClick={handleBackClick}
                        className="mt-6 bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]">
                    <ChevronLeft className="mr-2 h-4 w-4"/>
                    Back to Products
                </Button>
            </div>
        );
    }

    const discountedPrice = product.discount > 0
        ? product.price - (product.price * (product.discount / 100))
        : product.price;

    const hasMultipleImages = Array.isArray(product.imageUrls) && product.imageUrls.length > 1;

    const imageUrls = product.imageUrls;

    return (
        <div className="container mx-auto px-4 py-8 bg-[hsl(var(--fauna-background))]">
            <Button
                variant="ghost"
                className="mb-6 text-[hsl(var(--fauna-deep))] hover:text-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-background))]"
                onClick={handleBackClick}
            >
                <ChevronLeft className="mr-2 h-4 w-4"/>
                Back to Products
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div
                        className="aspect-square w-full max-h-[500px] sm:max-h-[600px] bg-white rounded-lg overflow-hidden border border-[hsl(var(--fauna-light)/30%)] relative">
                        {selectedImage ? (
                            <Image
                                src={"http://localhost:5297/" + selectedImage}
                                alt={product.productName}
                                fill
                                quality={100}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[hsl(var(--fauna-secondary))]">No image available</span>
                            </div>
                        )}
                    </div>

                    {hasMultipleImages && (
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                            {imageUrls.map((url, index) => (
                                <button
                                    key={index}
                                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                                        selectedImage === url
                                            ? 'border-[hsl(var(--fauna-primary))]'
                                            : 'border-[hsl(var(--fauna-light)/30%)]'
                                    }`}
                                    onClick={() => setSelectedImage(url)}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={"http://localhost:5297/" + url}
                                            alt={`${product.productName} - image ${index + 1}`}
                                            fill
                                            quality={80}
                                            sizes="(max-width: 640px) 20vw, 80px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        {/* Category and Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className="bg-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-deep))]">
                                {product.categoryName}
                            </Badge>
                            {product.tags && product.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline"
                                       className="bg-[hsl(var(--fauna-background))] border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))]">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--fauna-deep))]">{product.productName}</h1>

                        {/* Price Information */}
                        <div className="mt-4 flex items-end gap-2">
                            <span className="text-2xl font-bold text-[hsl(var(--fauna-primary))]">
                                ${discountedPrice.toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-lg line-through text-gray-500">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <Badge
                                        className="ml-2 bg-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-secondary))]">
                                        {product.discount}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mt-4">
                            <span className={`text-sm font-medium ${
                                product.quantity > 0
                                    ? 'text-[hsl(var(--fauna-primary))]'
                                    : 'text-red-500'
                            }`}>
                                {product.quantity > 10
                                    ? 'In Stock'
                                    : product.quantity > 0
                                        ? `Only ${product.quantity} left in stock`
                                        : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    {/* Quantity Selector and Add to Cart - Improved layout */}
                    {product.quantity > 0 && (
                        <div className="pt-4">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    <span className="text-[hsl(var(--fauna-secondary))] mr-2">Quantity:</span>
                                    <div
                                        className="flex items-center border border-[hsl(var(--fauna-light))] rounded-md">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="px-3 py-1 text-[hsl(var(--fauna-secondary))] disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span
                                            className="px-4 py-1 border-x border-[hsl(var(--fauna-light))]">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.quantity}
                                            className="px-3 py-1 text-[hsl(var(--fauna-secondary))] disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 max-w-xs bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))] py-6 text-base"
                                    disabled={product.quantity <= 0}>
                                    <ShoppingCart className="mr-2 h-5 w-5"/>
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 w-12 p-2"
                                    aria-label="Add to wishlist">
                                    <Heart className="h-5 w-5"/>
                                </Button>
                            </div>
                        </div>
                    )}

                    <Tabs defaultValue="description" className="mt-8">
                        <TabsList
                            className="bg-[hsl(var(--fauna-background))] border border-[hsl(var(--fauna-secondary))]
               rounded-xl shadow-sm w-full flex gap-0">
                            <TabsTrigger
                                value="description"
                                className="flex-1 h-full py-2 rounded-lg transition-colors
                   data-[state=active]:bg-[hsl(var(--fauna-light)/25%)]
                   data-[state=active]:text-[hsl(var(--fauna-deep))]"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="specifications"
                                className="flex-1 h-full py-2 rounded-lg transition-colors
                   data-[state=active]:bg-[hsl(var(--fauna-light)/25%)]
                   data-[state=active]:text-[hsl(var(--fauna-deep))]"
                            >
                                Specifications
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-4">
                            <Card className="p-4 sm:p-6 bg-white border border-[hsl(var(--fauna-light)/30%)]">
                                <p className="text-[hsl(var(--fauna-secondary))] whitespace-pre-line">
                                    {product.description}
                                </p>
                            </Card>
                        </TabsContent>
                        <TabsContent value="specifications" className="mt-4">
                            <Card className="p-4 sm:p-6 bg-white border border-[hsl(var(--fauna-light)/30%)]">
                                <ul className="space-y-3">
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium">{product.categoryName}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Price:</span>
                                        <span className="font-medium">${product.price.toFixed(2)}</span>
                                    </li>
                                    {product.discount > 0 && (
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Discount:</span>
                                            <span className="font-medium">{product.discount}%</span>
                                        </li>
                                    )}
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Availability:</span>
                                        <span
                                            className="font-medium">{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                                    </li>
                                    {product.tags && product.tags.length > 0 && (
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Tags:</span>
                                            <span className="font-medium">{product.tags.join(', ')}</span>
                                        </li>
                                    )}
                                </ul>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Skeleton className="h-10 w-32"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full max-h-[500px] rounded-lg"/>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="aspect-square rounded-md"/>
                        ))}
                    </div>
                </div>

                {/* Product Details Skeleton */}
                <div className="space-y-6">
                    <div>
                        <div className="flex gap-2 mb-3">
                            <Skeleton className="h-6 w-20 rounded-full"/>
                            <Skeleton className="h-6 w-16 rounded-full"/>
                        </div>
                        <Skeleton className="h-10 w-3/4 mb-4"/>
                        <Skeleton className="h-8 w-32 mb-2"/>
                        <Skeleton className="h-5 w-24"/>
                    </div>

                    <Skeleton className="h-12 w-40 mt-4"/>

                    <div className="flex gap-3 mt-4">
                        <Skeleton className="h-12 w-40"/>
                        <Skeleton className="h-12 w-12"/>
                    </div>

                    <div className="mt-8">
                        <div className="flex border-b">
                            <Skeleton className="h-10 w-1/2"/>
                            <Skeleton className="h-10 w-1/2"/>
                        </div>
                        <Skeleton className="h-40 w-full mt-4 rounded-lg"/>
                    </div>
                </div>
            </div>
        </div>
    );
}