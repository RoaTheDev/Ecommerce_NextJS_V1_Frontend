'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useResetPassword} from '@/lib/queries/useAuthQueries';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, CheckCircle, Eye, EyeOff, Leaf, Shield} from "lucide-react";
import {useSearchParams} from 'next/navigation';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {ResetPasswordFormData, resetPasswordSchema} from "@/lib/schemas/authSchemas";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const resetPasswordMutation = useResetPassword(token);
    const password = form.watch('password', '');

    const getPasswordStrength = (password: string): { strength: number, text: string, color: string } => {
        if (!password) return {strength: 0, text: '', color: ''};

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        const text = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'][Math.min(strength - 1, 4)];
        const color = [
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-lime-500',
            'bg-green-500'
        ][Math.min(strength - 1, 4)];

        return {strength, text, color};
    };

    const passwordStrength = getPasswordStrength(password);

    const onSubmit = (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate(data);
    };

    const errorMessage = resetPasswordMutation.error
        ? 'Failed to reset password. The link may have expired or is invalid.'
        : null;

    if (!token) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
                <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                    <CardHeader className="bg-[#5CBD7B] text-white">
                        <div className="flex justify-center mb-2">
                            <Leaf className="w-10 h-10 text-[#F6F2E9]"/>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Invalid Link</CardTitle>
                        <CardDescription className="text-[#F6F2E9] text-center">Reset password link is missing or
                            invalid</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 flex flex-col items-center">
                        <div className="mb-6 p-4 bg-[#F6F2E9]/70 rounded-full">
                            <AlertCircle className="w-12 h-12 text-[#8B6E47]"/>
                        </div>
                        <p className="text-[#3A8C5C] text-center mb-6">
                            The reset password link is invalid or has expired. Please request a new password reset link.
                        </p>
                        <Link href="/auth/forgot-password" className="w-full">
                            <Button
                                className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                            >
                                Request New Link
                            </Button>
                        </Link>
                    </CardContent>

                    <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                        <Link href="/auth/login" className="text-[#8B6E47] hover:text-[#5CBD7B] transition-colors">
                            Return to Login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (resetPasswordMutation.isSuccess) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
                <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                    <CardHeader className="bg-[#5CBD7B] text-white">
                        <div className="flex justify-center mb-2">
                            <Leaf className="w-10 h-10 text-[#F6F2E9]"/>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Password Reset Complete</CardTitle>
                        <CardDescription className="text-[#F6F2E9] text-center">Your password has been successfully
                            reset</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 flex flex-col items-center">
                        <div className="mb-6 p-4 bg-[#F6F2E9]/70 rounded-full">
                            <CheckCircle className="w-12 h-12 text-[#3A8C5C]"/>
                        </div>
                        <p className="text-[#3A8C5C] text-center mb-6">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <Link href="/auth/login" className="w-full">
                            <Button
                                className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                            >
                                Log In
                            </Button>
                        </Link>
                    </CardContent>

                    <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                        <p className="text-[#8B6E47] text-sm">
                            Thank you for using our platform
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
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-[#F6F2E9] text-center">Create a new password for your
                        account</CardDescription>
                </CardHeader>

                <CardContent className="pt-6 pb-2">
                    {errorMessage && (
                        <Alert className="mb-4 bg-red-50 text-red-600 border-red-300">
                            <AlertCircle className="w-4 h-4 mr-2"/>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mb-4 flex items-center justify-center">
                        <div className="p-3 bg-[#F6F2E9]/70 rounded-full">
                            <Shield className="w-8 h-8 text-[#3A8C5C]"/>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[#3A8C5C] font-medium">New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your new password"
                                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C] pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B6E47]"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5"/>
                                                    ) : (
                                                        <Eye className="w-5 h-5"/>
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs"/>

                                        {/* Password strength meter */}
                                        {password && (
                                            <div className="mt-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-[#8B6E47]">Password strength:</span>
                                                    <span
                                                        className={`text-xs font-medium ${passwordStrength.strength < 3 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {passwordStrength.text}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${passwordStrength.color}`}
                                                        style={{width: `${(passwordStrength.strength / 5) * 100}%`}}
                                                    ></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-1.5 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <span className="text-xs text-[#8B6E47]">8+ characters</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-1.5 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <span className="text-xs text-[#8B6E47]">Uppercase</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-1.5 ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <span className="text-xs text-[#8B6E47]">Lowercase</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-1.5 ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <span className="text-xs text-[#8B6E47]">Number</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-1.5 ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <span className="text-xs text-[#8B6E47]">Special char</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[#3A8C5C] font-medium">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm your new password"
                                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C] pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B6E47]"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="w-5 h-5"/>
                                                    ) : (
                                                        <Eye className="w-5 h-5"/>
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs"/>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={resetPasswordMutation.isPending}
                                className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors disabled:bg-[#90D4A3] disabled:cursor-not-allowed"
                            >
                                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                    <Link href="/auth/login" className="text-[#8B6E47] hover:text-[#5CBD7B] transition-colors">
                        Return to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}