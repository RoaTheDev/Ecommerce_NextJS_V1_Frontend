"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/common/NewsLetter";
import Footer from "@/components/common/Footer";
import Hero from "@/components/common/Hero";
import CartSidebar from "@/components/home/CardSidebar";

export default function Home() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[hsl(var(--fauna-background))] font-sans">
            <Header setCartOpen={setCartOpen} />
            <Hero />
            <FeaturedProducts />
            <Categories />
            <Newsletter />
            <Footer />
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
}