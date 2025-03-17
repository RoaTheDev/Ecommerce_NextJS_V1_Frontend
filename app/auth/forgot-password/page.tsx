'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPassword } from '@/lib/queries/useAuthQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Leaf, Mail, ArrowLeft, CheckCircle } from "lucide-react";

// Create schema for the form
const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const forgotPasswordMutation = useForgotPassword();

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(data.email, {
            onSuccess: () => {
                setIsSubmitted(true);
            }
        });
    };

    const errorMessage = forgotPasswordMutation.error
        ? 'Failed to send reset instructions. Please try again.'
        : null;

    if (isSubmitted) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
                <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                    <CardHeader className="bg-[#5CBD7B] text-white">
                        <div className="flex justify-center mb-2">
                            <Leaf className="w-10 h-10 text-[#F6F2E9]"/>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
                        <CardDescription className="text-[#F6F2E9] text-center">Password reset instructions sent</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 flex flex-col items-center">
                        <div className="mb-6 p-4 bg-[#F6F2E9]/70 rounded-full">
                            <CheckCircle className="w-12 h-12 text-[#3A8C5C]" />
                        </div>
                        <div className="text-center mb-6">
                            <p className="text-[#3A8C5C] font-medium mb-2">Reset link sent!</p>
                            <p className="text-[#8B6E47]">
                                {"We've sent password reset instructions to your email address"}.
                                Please check your inbox and follow the link to reset your password.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Link href="/auth/login">
                                <Button
                                    className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                                >
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                        <p className="text-[#8B6E47] text-sm">
                            {"Didn't receive an email? Check your spam folder or"}
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-[#3A8C5C] hover:text-[#5CBD7B] ml-1 font-medium transition-colors"
                            >
                                try again
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
            <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                <CardHeader className="bg-[#5CBD7B] text-white">
                    <div className="flex justify-center mb-2">
                        <Leaf className="w-10 h-10 text-[#F6F2E9]"/>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-[#F6F2E9] text-center">Enter your email to reset your password</CardDescription>
                </CardHeader>

                <CardContent className="pt-6 pb-2">
                    {errorMessage && (
                        <Alert className="mb-4 bg-red-50 text-red-600 border-red-300">
                            <AlertCircle className="w-4 h-4 mr-2"/>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#3A8C5C] font-medium">Email</Label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your registered email"
                                    {...register('email')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C] pl-10"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5CBD7B] w-5 h-5" />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={forgotPasswordMutation.isPending}
                            className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                        >
                            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                    <Link href="/auth/login" className="flex items-center text-[#8B6E47] hover:text-[#5CBD7B] transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}