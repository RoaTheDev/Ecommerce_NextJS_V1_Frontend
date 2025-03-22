import {PaginatedProduct} from "@/lib/types/productTypes";
import Link from "next/link";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import React from "react";

export function ProductCard({ product }: { product: PaginatedProduct }) {
    const hasDiscount = product.discount > 0;
    const discountedPrice = product.price - (product.price * (product.discount / 100));

    // No longer need image index state since we only have one image now
    // Note that we don't need to navigate between images anymore

    return (
        <Link href={`/product/${product.productId}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden border border-[hsl(var(--fauna-light)/30%)] hover:border-[hsl(var(--fauna-primary))]">
                <div className="aspect-square relative overflow-hidden bg-[hsl(var(--fauna-background)/50%)]">
                    {product.imageUrls ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={"http://localhost:5297/" + product.imageUrls}
                                alt={product.productName}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--fauna-background))]">
                            <span className="text-[hsl(var(--fauna-secondary))]">No image</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <Badge className="absolute top-2 right-2 bg-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-deep))] z-10">
                        {product.categoryName}
                    </Badge>

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-secondary))] z-10">
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