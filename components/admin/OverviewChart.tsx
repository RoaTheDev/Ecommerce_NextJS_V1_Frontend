'use client'
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    {
        name: 'Jan',
        revenue: 4000,
        orders: 240,
    },
    {
        name: 'Feb',
        revenue: 3000,
        orders: 198,
    },
    {
        name: 'Mar',
        revenue: 2000,
        orders: 120,
    },
    {
        name: 'Apr',
        revenue: 2780,
        orders: 160,
    },
    {
        name: 'May',
        revenue: 1890,
        orders: 108,
    },
    {
        name: 'Jun',
        revenue: 2390,
        orders: 150,
    },
    {
        name: 'Jul',
        revenue: 3490,
        orders: 210,
    },
];

export function OverviewChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#5CBD7B" />
                <YAxis yAxisId="right" orientation="right" stroke="#8B6E47" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#5CBD7B" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#8B6E47" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
