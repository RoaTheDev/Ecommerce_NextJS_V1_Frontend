'use client';
import React, { useEffect, useState } from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfileTab from '@/components/account/ProfileTab';
import SecurityTab from '@/components/account/SecurityTab';
import LinkAccountTab from '@/components/account/LinkAccountTab';
import { AddressTab } from '@/components/account/AddressTab';
// import OrderSection from '@/components/account/OrderTab';

const AccountPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const tab = searchParams.get('tab') || 'profile';
        setActiveTab(tab);
        setIsLoading(false);
    }, [searchParams]);

    const handleTabChange = (newTab: string) => {
        router.push(`/account?tab=${newTab}`);
        setActiveTab(newTab);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[hsl(148,58%,55%)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[hsl(42,46%,94%)] py-6 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold text-[hsl(149,41%,39%)] mb-4 text-center">
                    Account Settings
                </h1>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 mb-10 bg-[hsl(138,49%,70%)]/20">
                        <TabsTrigger value="profile"
                                     className="data-[state=active]:bg-[hsl(148,58%,55%)] data-[state=active]:text-white">
                            Profile
                        </TabsTrigger>

                        <TabsTrigger value="addresses"
                                     className="data-[state=active]:bg-[hsl(148,58%,55%)] data-[state=active]:text-white">
                            Addresses
                        </TabsTrigger>
                        <TabsTrigger value="orders"
                                     className="data-[state=active]:bg-[hsl(148,58%,55%)] data-[state=active]:text-white">
                            Orders
                        </TabsTrigger>
                        <TabsTrigger value="linked-accounts"
                                     className="data-[state=active]:bg-[hsl(148,58%,55%)] data-[state=active]:text-white">
                            Linked Accounts
                        </TabsTrigger>
                        <TabsTrigger value="security"
                                     className="data-[state=active]:bg-[hsl(148,58%,55%)] data-[state=active]:text-white">
                            Change password
                        </TabsTrigger>

                        <TabsTrigger value="preferences"
                                     className="data-[state=active]:bg-[hsl(148,58%,55%)] data-[state=active]:text-white">
                            Preferences
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <ProfileTab />
                    </TabsContent>

                    <TabsContent value="addresses">
                        <AddressTab />
                    </TabsContent>

                    {/*<TabsContent value="orders">*/}
                    {/*    <OrderSection/>*/}
                    {/*</TabsContent>*/}

                    <TabsContent value="security">
                        <SecurityTab />
                    </TabsContent>

                    <TabsContent value="linked-accounts">
                        <LinkAccountTab />
                    </TabsContent>

                    <TabsContent value="preferences">
                        <Card className="p-6 bg-white shadow-md">
                            <h2 className="text-xl font-semibold text-[hsl(149,41%,39%)] mb-4">
                                User Preferences
                            </h2>
                            <p className="text-[hsl(32,32%,41%)]">
                                Customize your account preferences
                            </p>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AccountPage;
