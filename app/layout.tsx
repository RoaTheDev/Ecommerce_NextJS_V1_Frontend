import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryClientProvider } from "@/lib/providers/QueryClientProvider";
import "./globals.css";
import React from "react";
import ClientLayout from "./clientLayout"; // Import the client ClientLayout component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Your App Name",
    description: "Your application description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <QueryClientProvider>
            <ClientLayout>{children}</ClientLayout>
        </QueryClientProvider>
        </body>
        </html>
    );
}
