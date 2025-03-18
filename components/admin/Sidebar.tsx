'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Users, ShoppingBag, Tag, Layers, CreditCard,
    RefreshCcw, Package, Calendar, Home
} from 'lucide-react';
import LogoutConfirmation from "@/components/common/LogoutConfirmation"; // Import Logout Component

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Roles', href: '/admin/roles', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Refunds', href: '/admin/refunds', icon: RefreshCcw },
    { name: 'Cancellations', href: '/admin/cancellations', icon: Calendar },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <aside
            className={cn(
                "bg-[hsl(var(--fauna-deep))] text-white transition-all duration-300 relative",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex items-center justify-between h-16 px-4">
                {!collapsed && (
                    <h1 className="text-xl font-bold">Fauna Admin</h1>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-md hover:bg-[hsl(var(--fauna-secondary)/0.2)]"
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>
            <nav className="p-2 flex flex-col justify-between h-[calc(100%-4rem)]">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                        isActive
                                            ? "bg-[hsl(var(--fauna-primary))] text-white"
                                            : "hover:bg-[hsl(var(--fauna-secondary)/0.2)]"
                                    )}
                                >
                                    <Icon size={20} />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Logout Button */}
                <div className="p-2">
                    <LogoutConfirmation />
                </div>
            </nav>
        </aside>
    );
}
