"use client";

import React from "react";
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";

interface CartSidebarProps {
    onClose: () => void;
    open: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({onClose, open}) => {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="w-full max-w-md h-full overflow-y-auto shadow-xl flex flex-col p-0 border-l border-[hsl(var(--fauna-secondary)/0.2)]"
                style={{backgroundColor: "hsl(var(--fauna-background))"}}
            >
                <SheetHeader
                    className="p-4 border-b flex justify-between items-center text-white"
                    style={{backgroundColor: "hsl(var(--fauna-primary))"}}
                >
                    <SheetTitle className="text-xl font-bold text-white">Your Cart (3)</SheetTitle>
                </SheetHeader>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {[
                        {
                            name: "Nature's Blessing Tee",
                            size: "M",
                            color: "Green",
                            price: "$29.99",
                            img: "/data/placeholder/80/80",
                        },
                        {
                            name: "Forest Guardian Hoodie",
                            size: "L",
                            color: "Brown",
                            price: "$49.99",
                            img: "/data/placeholder/80/80",
                        },
                        {
                            name: "Woodland Explorer Cap",
                            color: "Beige",
                            price: "$19.99",
                            img: "/data/placeholder/80/80",
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex border-b pb-4 last:border-b-0"
                            style={{borderColor: "hsl(var(--fauna-secondary)/0.2)"}}
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="ml-4 flex-grow">
                                <h3 style={{color: "hsl(var(--fauna-deep))"}} className="font-medium">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {item.size ? `Size: ${item.size} | ` : ""}Color: {item.color}
                                </p>
                                <div className="flex justify-between mt-2">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-6 h-6 p-0"
                                            style={{
                                                borderColor: "hsl(var(--fauna-secondary))",
                                                color: "hsl(var(--fauna-secondary))",
                                            }}
                                            onMouseOver={(e) =>
                                                (e.currentTarget.style.backgroundColor = "hsl(var(--fauna-light))")
                                            }
                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
                                        >
                                            -
                                        </Button>
                                        <span style={{color: "hsl(var(--fauna-deep))"}}>1</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-6 h-6 p-0"
                                            style={{
                                                borderColor: "hsl(var(--fauna-secondary))",
                                                color: "hsl(var(--fauna-secondary))",
                                            }}
                                            onMouseOver={(e) =>
                                                (e.currentTarget.style.backgroundColor = "hsl(var(--fauna-light))")
                                            }
                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <span style={{color: "hsl(var(--fauna-deep))"}} className="font-medium">
                    {item.price}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <SheetFooter
                    className="p-4 border-t mt-auto"
                    style={{
                        backgroundColor: "hsl(var(--fauna-background)/0.8)",
                        borderColor: "hsl(var(--fauna-secondary)/0.2)",
                    }}
                >
                    <div className="space-y-2 mb-4 w-full">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span style={{color: "hsl(var(--fauna-deep))"}} className="font-medium">
                $99.97
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span style={{color: "hsl(var(--fauna-deep))"}} className="font-medium">
                $5.99
              </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span style={{color: "hsl(var(--fauna-primary))"}}>$105.96</span>
                        </div>
                    </div>
                    <Button
                        className="w-full py-3 font-semibold text-white"
                        style={{
                            backgroundColor: "hsl(var(--fauna-primary))",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "hsl(var(--fauna-deep))")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "hsl(var(--fauna-primary))")
                        }
                    >
                        Checkout
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CartSidebar;