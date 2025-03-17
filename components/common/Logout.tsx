'use client';

import React from 'react';
import { useLogout } from '@/lib/queries/useAuthQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut } from "lucide-react";
import Link from 'next/link';

export default function Logout() {
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
            <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                <CardHeader className="bg-[#5CBD7B] text-white">
                    <div className="flex justify-center mb-2">
                        <Leaf className="w-10 h-10 text-[#F6F2E9]"/>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Sign Out</CardTitle>
                    <CardDescription className="text-[#F6F2E9] text-center">
                        Are you sure you want to sign out?
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 flex flex-col items-center">
                    <div className="mb-6 p-4 bg-[#F6F2E9]/70 rounded-full">
                        <LogOut className="w-12 h-12 text-[#3A8C5C]" />
                    </div>
                    <p className="text-[#8B6E47] text-center mb-6">
                        You will be logged out of your account. You can log in again at any time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Button
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                            className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                        >
                            {logoutMutation.isPending ? 'Signing out...' : 'Yes, Sign Out'}
                        </Button>
                        <Link href="/" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full border-[#90D4A3] text-[#3A8C5C] hover:bg-[#F6F2E9] hover:text-[#3A8C5C] hover:border-[#3A8C5C] transition-colors"
                            >
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                    <p className="text-[#3A8C5C] text-sm text-center">
                        Thank you for shopping with us. We hope to see you again soon!
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}