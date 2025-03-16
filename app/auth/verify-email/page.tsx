'use client';

import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {VerificationFormData, verificationSchema} from '@/lib/schemas/authSchemas';
import {useVerifyEmail} from '@/lib/queries/useAuthQueries';
import {AxiosError} from 'axios';
import Link from 'next/link';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, Mail} from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const session = searchParams.get('session');
    const [isInvalid, setIsInvalid] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            otp: ''
        }
    });

    const verifyMutation = useVerifyEmail();

    useEffect(() => {
        if (!session) {
            setIsInvalid(true);
        }
    }, [session]);

    const onSubmit = (data: VerificationFormData) => {
        if (!session) {
            setIsInvalid(true);
            return;
        }

        verifyMutation.mutate({session, otp: data.otp});
    };

    const errorMessage = verifyMutation.error
        ? ((verifyMutation.error as AxiosError<{ detail: string }>).response?.data?.detail || 'Verification failed')
        : null;

    if (isInvalid) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
                <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                    <CardHeader className="bg-[#5CBD7B] text-white text-center">
                        <CardTitle className="text-2xl font-bold">Invalid Session</CardTitle>
                        <CardDescription className="text-[#F6F2E9]">Your verification link has expired</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                        <AlertCircle className="w-16 h-16 text-[#8B6E47]"/>
                        <p className="text-center text-[#3A8C5C]">Your verification session has expired or is
                            invalid.</p>
                        <Link href="/auth/register">
                            <Button className="bg-[#8B6E47] hover:bg-[#6A5335] text-white">
                                Register Again
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
            <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                <CardHeader className="bg-[#5CBD7B] text-white text-center">
                    <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription className="text-[#F6F2E9]">Complete your registration</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                    <div className="flex justify-center">
                        <div className="bg-[#90D4A3]/20 p-4 rounded-full">
                            <Mail className="w-10 h-10 text-[#3A8C5C]"/>
                        </div>
                    </div>

                    <p className="text-center text-[#3A8C5C]">
                        {"We've sent a verification code to your email."}
                        {"Please enter the code below to complete registration."}
                    </p>

                    {errorMessage && (
                        <Alert className="bg-red-50 text-red-600 border-red-300">
                            <AlertCircle className="w-4 h-4 mr-2"/>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-[#3A8C5C] font-medium">Verification Code</Label>
                            <Input
                                type="text"
                                id="otp"
                                placeholder="Enter verification code"
                                {...register('otp')}
                                className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C] text-center text-lg tracking-widest"
                            />
                            {errors.otp && <p className="text-red-500 text-xs text-center">{errors.otp.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={verifyMutation.isPending}
                            className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                        >
                            {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                    <p className="text-[#3A8C5C] text-sm">
                        {"Didn't receive the code? Check your spam folder or"}
                        <Link href="/auth/register"
                              className="text-[#8B6E47] hover:text-[#5CBD7B] ml-1 font-medium transition-colors">
                            try again
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
;

