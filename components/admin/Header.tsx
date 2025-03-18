import React from 'react';
import {Bell, Search, User} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import LogoutConfirmation from "@/components/common/LogoutConfirmation";

export function Header() {
    return (
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-white">
            <div className="flex items-center w-full max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full pl-8 bg-gray-100 border-none"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                    <Bell size={20}/>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 text-sm">
                            <div
                                className="w-8 h-8 rounded-full bg-[hsl(var(--fauna-primary))] flex items-center justify-center text-white">
                                <User size={16}/>
                            </div>
                            <span className="hidden md:inline">Admin User</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <div>
                            <LogoutConfirmation/>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}