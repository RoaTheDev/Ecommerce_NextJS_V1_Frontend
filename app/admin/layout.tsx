// src/app/admin/layout.tsx
import React from 'react';
import {Sidebar} from '@/components/admin/Sidebar';
import {Header} from '@/components/admin/Header';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[hsl(var(--fauna-background))]">
            <Sidebar/>
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header/>
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}