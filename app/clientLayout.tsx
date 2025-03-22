"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CartSidebar from "@/components/home/CardSidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[hsl(var(--fauna-background))] font-sans">
            <Header setCartOpen={setCartOpen} />
            {children}
            <Footer />
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
}
