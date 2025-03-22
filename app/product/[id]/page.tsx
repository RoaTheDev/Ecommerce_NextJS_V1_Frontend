// app/product/[id]/page.tsx
'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {ChevronLeft, ShoppingCart} from 'lucide-react';
import {Card} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useProduct} from '@/lib/queries/useProductQueries';

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id ? Number(params.id as string) : undefined;
    const {data: product, isLoading, isError} = useProduct(productId);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (product?.imageUrls && product.imageUrls.length > 0) {
            setSelectedImage(product.imageUrls[0]);
        }
    }, [product]);

    const handleBackClick = () => {
        router.back();
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div
                        className="aspect-square bg-white rounded-lg overflow-hidden border border-[hsl(var(--fauna-light)/30%)]">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.productName}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center bg-[hsl(var(--fauna-background))]">
                                <span className="text-[hsl(var(--fauna-secondary))]">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.imageUrls && product.imageUrls.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {product.imageUrls.map((url, index) => (
                                <button
                                    key={index}
                                    className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                                        selectedImage === url
                                            ? 'border-[hsl(var(--fauna-primary))]'
                                            : 'border-[hsl(var(--fauna-light)/30%)]'
                                    }`}
                                    onClick={() => setSelectedImage(url)}
                                >
                                    <img
                                        src={url}
                                        alt={`${product.productName} - image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
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

                        <h1 className="text-3xl font-bold text-[hsl(var(--fauna-deep))]">{product.productName}</h1>

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

                    {/* Add to Cart */}
                    <div className="pt-4">
                        <Button
                            className="w-full md:w-auto bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]"
                            disabled={product.quantity <= 0}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4"/>
                            Add to Cart
                        </Button>
                    </div>

                    {/* Product Information Tabs */}
                    <Tabs defaultValue="description" className="mt-8">
                        <TabsList
                            className="bg-[hsl(var(--fauna-background))] border border-[hsl(var(--fauna-light)/30%)]">
                            <TabsTrigger value="description"
                                         className="data-[state=active]:bg-[hsl(var(--fauna-light)/20%)] data-[state=active]:text-[hsl(var(--fauna-deep))]">
                                Description
                            </TabsTrigger>
                            <TabsTrigger value="specifications"
                                         className="data-[state=active]:bg-[hsl(var(--fauna-light)/20%)] data-[state=active]:text-[hsl(var(--fauna-deep))]">
                                Specifications
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="mt-4">
                            <Card className="p-4 bg-white border border-[hsl(var(--fauna-light)/30%)]">
                                <p className="text-[hsl(var(--fauna-secondary))] whitespace-pre-line">
                                    {product.description}
                                </p>
                            </Card>
                        </TabsContent>
                        <TabsContent value="specifications" className="mt-4">
                            <Card className="p-4 bg-white border border-[hsl(var(--fauna-light)/30%)]">
                                <ul className="space-y-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg"/>
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="w-20 h-20 rounded-md"/>
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

                    <div className="mt-8">
                        <div className="flex border-b">
                            <Skeleton className="h-10 w-24 mr-2"/>
                            <Skeleton className="h-10 w-24"/>
                        </div>
                        <Skeleton className="h-40 w-full mt-4 rounded-lg"/>
                    </div>
                </div>
            </div>
        </div>
    );
}