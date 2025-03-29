'use client';
import React from 'react';
import { Unlink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    useGetLinkedProviders,
    useUnlinkAuthProvider
} from '@/lib/queries/useAuthQueries';
import { GoogleAuthHandler } from "@/components/common/GoogleAuthHandler";
import toast from "react-hot-toast";

const LinkAccountTab: React.FC = () => {
    const {
        data: linkedProviders = [],
        refetch: fetchLinkedProviders
    } = useGetLinkedProviders();

    const unlinkProviderMutation = useUnlinkAuthProvider();

    const handleProviderUnlink = (providerName: string, providerId: string) => {
        unlinkProviderMutation.mutate({providerName, providerId}, {
            onSuccess: async () => {
                toast.success(`${providerName} account unlinked successfully`);
                await fetchLinkedProviders();
            },
            onError: (error) => {
                toast.error(`Failed to unlink ${providerName} account`);
                console.error(`Unlink error for ${providerName}:${providerId}:`, error);
            }
        });
    };

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
        return (
            <Card className="shadow-md border-[hsl(148,58%,55%)]">
                <CardContent>
                    <div className="text-red-500 text-center p-4">
                        Error: Google OAuth configuration is missing
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-md border-[hsl(148,58%,55%)]">
            <CardHeader className="bg-[hsl(148,58%,55%)]/10 py-3">
                <CardTitle className="text-[hsl(149,41%,39%)] text-lg">Linked Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-[hsl(149,41%,39%)] text-sm font-medium">
                            Google Account
                        </span>
                        {linkedProviders.some(p => p.providerName === 'Google') ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        <Unlink className="mr-1" size={14}/> Unlink
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-[hsl(149,41%,39%)]">
                                            Unlink Google Account
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to unlink your Google account?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" size="sm">Cancel</Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                const googleProvider = linkedProviders.find(p => p.providerName === 'Google');
                                                if (googleProvider) {
                                                    handleProviderUnlink('Google', googleProvider.providerId);
                                                }
                                            }}
                                        >
                                            Unlink
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <GoogleAuthHandler onLinkGoogle={fetchLinkedProviders}/>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LinkAccountTab;