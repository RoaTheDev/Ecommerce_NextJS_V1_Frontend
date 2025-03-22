import React from 'react';

export default function ProductLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[hsl(var(--fauna-background))]">
            <div
                className="py-6 mb-6 bg-gradient-to-r from-[hsl(var(--fauna-deep))] to-[hsl(var(--fauna-primary))] text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center">{"Fauna's Collection"}</h1>
                    <p className="text-[hsl(var(--fauna-background))] mt-1 text-center">Discover our beautiful products inspired by
                        nature</p>
                </div>
            </div>
            {children}
        </div>
    );
}