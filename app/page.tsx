"use client";

import { useState } from "react";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Newsletter from "@/components/common/NewsLetter";
import Hero from "@/components/common/Hero";

export default function Home() {

    return (
        <div className="min-h-screen bg-[hsl(var(--fauna-background))] font-sans">
            <Hero />
            <FeaturedProducts />
            <Categories />
            <Newsletter />
        </div>
    );
}