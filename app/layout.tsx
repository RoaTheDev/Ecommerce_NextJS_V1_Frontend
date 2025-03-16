import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {QueryClientProvider} from '@/lib/providers/QueryClientProvider';
import './globals.css';
import React from "react";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Your App Name',
    description: 'Your application description',
};

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <QueryClientProvider>
            {children}
        </QueryClientProvider>
        </body>
        </html>
    );
}