import {PaginatedProduct} from "@/lib/types/productTypes";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import React from "react";

export function ProductCard({product}: { product: PaginatedProduct }) {
    const hasDiscount = product.discount > 0;
    const discountedPrice = product.price - (product.price * (product.discount / 100));
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URLS

    return (
        <Link href={`/product/${product.productId}`}>
            <Card
                className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden border border-[hsl(var(--fauna-light)/30%)] hover:border-[hsl(var(--fauna-primary))]">
                <div className="aspect-square relative overflow-hidden bg-[hsl(var(--fauna-background)/50%)] p-0 -mt-6">
                    {product.imageUrls ? (
                        <Image
                            src={`${baseUrl}${product.imageUrls}`}
                            alt={product.productName}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{objectFit: 'cover'}}
                            priority
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center bg-[hsl(var(--fauna-background))]">
                            <span className="text-[hsl(var(--fauna-secondary))]">No image</span>
                        </div>
                    )}

                    <div className="absolute top-2 right-2 z-10 mt-1.5">
                        <Badge
                            className="text-sm px-3 py-1.5 bg-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-deep))]">
                            {product.categoryName}
                        </Badge>
                    </div>

                    {hasDiscount && (
                        <div className="absolute top-2 left-2 z-10 mt-1.5">
                            <Badge
                                className="text-sm px-3 py-1.5 bg-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-secondary))]">
                                {product.discount}% OFF
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-3">
                    <h3 className="font-semibold -mt-4 text-xl truncate text-[hsl(var(--fauna-deep))]">
                        {product.productName}
                    </h3>

                    <div className="flex justify-between items-center mt-1.5 mb-1.5">
                        <div>
                            {hasDiscount ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-[hsl(var(--fauna-primary))]">
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-base line-through text-gray-500">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-base font-bold text-[hsl(var(--fauna-primary))]">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="text-base text-[hsl(var(--fauna-secondary))]">
                            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                        </div>
                    </div>

                    {/* Tags with minimal space */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {product.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline"
                                       className="text-sm px-1.5 py-0 bg-[hsl(var(--fauna-background))] border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))]">
                                    {tag}
                                </Badge>
                            ))}
                            {product.tags.length > 3 && (
                                <Badge variant="outline"
                                       className="text-sm px-1.5 py-0 bg-[hsl(var(--fauna-background))] border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))]">
                                    +{product.tags.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}