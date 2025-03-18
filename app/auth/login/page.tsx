'use client';

import React from 'react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {LoginFormData, loginSchema} from '@/lib/schemas/authSchemas';
import {useGoogleLogin, useLogin} from '@/lib/queries/useAuthQueries';
import {CredentialResponse, GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
import {AxiosError} from 'axios';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, Leaf} from "lucide-react";

export default function LoginPage() {
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const login = useLogin();
    const googleLoginMutation = useGoogleLogin();

    const onSubmit = (data: LoginFormData) => {
        login.mutate(data);
    };

    const handleGoogleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            googleLoginMutation.mutate({idToken: response.credential});
        } else {
            console.error('Google login failed: No credential provided');
        }
    };

    const handleGoogleFailure = () => {
        console.error('Google login failed');
    };

    const errorMessage = login.error
        ? ((login.error as AxiosError<{ detail: string }>).response?.data?.detail || 'Login failed')
        : null;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
                <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                    <CardHeader className="bg-[#5CBD7B] text-white">
                        <div className="flex justify-center mb-2">
                            <Leaf className="w-10 h-10 text-[#F6F2E9]"/>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-[#F6F2E9] text-center">Login to your account</CardDescription>
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
                                <Input
                                    type="email"
                                    id="email"
                                    {...register('email')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-[#3A8C5C] font-medium">Password</Label>
                                    <Link href="/auth/forgot-password"
                                          className="text-xs text-[#8B6E47] hover:text-[#5CBD7B]">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    id="password"
                                    {...register('password')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={login.isPending}
                                className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                            >
                                {login.isPending ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#90D4A3]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-[#8B6E47]">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                shape="pill"
                                theme="outline"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                        <p className="text-[#3A8C5C]">
                            {"Don't have an user?"}
                            <Link href="/auth/register"
                                  className="text-[#8B6E47] hover:text-[#5CBD7B] ml-1 font-medium transition-colors">
                                Register here
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </GoogleOAuthProvider>
    );
};

