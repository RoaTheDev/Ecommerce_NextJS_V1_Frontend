import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<'completed' | 'processing' | 'pending' | 'cancelled', string> = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
};

interface Order {
    id: string;
    customer: string;
    email: string;
    amount: string;
    status: 'completed' | 'processing' | 'pending' | 'cancelled';
    date: string;
}

const orders: Order[] = [
    { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', amount: '$250.00', status: 'completed', date: '2025-03-14' },
    { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', amount: '$125.50', status: 'processing', date: '2025-03-15' },
    { id: 'ORD-003', customer: 'Robert Johnson', email: 'robert@example.com', amount: '$350.75', status: 'pending', date: '2025-03-16' },
    { id: 'ORD-004', customer: 'Emily Davis', email: 'emily@example.com', amount: '$89.99', status: 'completed', date: '2025-03-17' },
    { id: 'ORD-005', customer: 'Michael Brown', email: 'michael@example.com', amount: '$199.95', status: 'cancelled', date: '2025-03-18' },
];

export function RecentOrders() {
    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <Avatar className="hidden sm:flex h-9 w-9">
                        <AvatarFallback className="bg-[hsl(var(--fauna-light))] text-white">
                            {order.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{order.customer}</p>
                            <Badge
                                className={statusColors[order.status]} // ✅ No more TypeScript error
                                variant="outline"
                            >
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <p>{order.id}</p>
                            <span className="mx-1">•</span>
                            <p>{order.date}</p>
                        </div>
                    </div>
                    <div className="font-medium">{order.amount}</div>
                </div>
            ))}
            <button className="w-full text-sm text-center py-2 text-[hsl(var(--fauna-primary))] hover:underline">
                View All Orders
            </button>
        </div>
    );
}
