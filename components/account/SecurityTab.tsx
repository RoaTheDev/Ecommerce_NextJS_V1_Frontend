'use client';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from '@/lib/queries/useAuthQueries';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import toast from "react-hot-toast";
import {PasswordChangeFormValues, passwordChangeSchema} from "@/lib/schemas/authSchemas";



const SecurityTab: React.FC = () => {
    const { currentUser } = useAuthStore();
    const changePasswordMutation = useChangePassword(currentUser?.id || '');

    const passwordForm = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    });

    const onPasswordSubmit = (data: PasswordChangeFormValues) => {
        changePasswordMutation.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword
        }, {
            onSuccess: () => {
                toast.success('Password changed successfully');
                passwordForm.reset();
            },
            onError: (error) => {
                toast.error('Failed to change password');
                console.error('Password change error:', error);
            }
        });
    };

    return (
        <Card className="shadow-md border-[hsl(148,58%,55%)]">
            <CardHeader className="bg-[hsl(148,58%,55%)]/10 py-3">
                <CardTitle className="text-[hsl(149,41%,39%)] text-lg">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-[hsl(149,41%,39%)] text-sm">Current Password</Label>
                        <Controller
                            name="currentPassword"
                            control={passwordForm.control}
                            render={({field}) => (
                                <Input
                                    type="password"
                                    {...field}
                                    className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                />
                            )}
                        />
                        {passwordForm.formState.errors.currentPassword && (
                            <p className="text-red-500 text-xs">
                                {passwordForm.formState.errors.currentPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[hsl(149,41%,39%)] text-sm">New Password</Label>
                        <Controller
                            name="newPassword"
                            control={passwordForm.control}
                            render={({field}) => (
                                <Input
                                    type="password"
                                    {...field}
                                    className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                />
                            )}
                        />
                        {passwordForm.formState.errors.newPassword && (
                            <p className="text-red-500 text-xs">
                                {passwordForm.formState.errors.newPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[hsl(149,41%,39%)] text-sm">Confirm New Password</Label>
                        <Controller
                            name="confirmNewPassword"
                            control={passwordForm.control}
                            render={({field}) => (
                                <Input
                                    type="password"
                                    {...field}
                                    className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                />
                            )}
                        />
                        {passwordForm.formState.errors.confirmNewPassword && (
                            <p className="text-red-500 text-xs">
                                {passwordForm.formState.errors.confirmNewPassword.message}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="w-full bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white"
                    >
                        Update Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default SecurityTab;