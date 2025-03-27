'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Unlink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    useChangePassword,
    useChangeProfileImage,
    useCustomerProfile,
    useGetLinkedProviders,
    useUnlinkAuthProvider,
    useUpdateCustomerInfo
} from '@/lib/queries/useAuthQueries';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import toast from "react-hot-toast";
import { GoogleAuthHandler } from "@/components/common/GoogleAuthHandler";

// Zod Schemas
const userProfileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional(),
    dob: z.string().refine(val => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
    }, "Invalid date of birth"),
    gender: z.enum(["Male", "Female", "Other"]),
});

const passwordChangeSchema = z.object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string()
        .min(8, "New password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must include uppercase, lowercase, number, and special character"),
    confirmNewPassword: z.string().min(8, "Confirm new password")
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});

// Types
type UserProfileFormValues = z.infer<typeof userProfileSchema>;
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const AccountPage: React.FC = () => {
    const { currentUser } = useAuthStore();
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URLS;
    const { data: profile, isLoading: isProfileLoading } = useCustomerProfile(currentUser?.id);

    const { data: linkedProviders = [], refetch: fetchLinkedProviders } = useGetLinkedProviders();
    const changeProfileImageMutation = useChangeProfileImage(currentUser?.id || '');
    const updateProfileMutation = useUpdateCustomerInfo(currentUser?.id || '');
    const changePasswordMutation = useChangePassword(currentUser?.id || '');
    const unlinkProviderMutation = useUnlinkAuthProvider();

    const profileForm = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dob: '',
            gender: 'Male'
        }
    });

    useEffect(() => {
        if (profile) {
            profileForm.reset({
                firstName: profile.firstName || '',
                middleName: profile.middleName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                dob: profile.dob || '',
                gender: profile.gender as UserProfileFormValues['gender'] || 'Other'
            });
        }
    }, [profile, profileForm]);

    const passwordForm = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    });

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            changeProfileImageMutation.mutate(file);
        }
    };

    const onProfileSubmit = (data: UserProfileFormValues) => {
        updateProfileMutation.mutate(data, {
            onSuccess: () => {
                setIsProfileEditing(false);
                toast.success('Profile updated successfully');
            },
            onError: (error) => {
                toast.error('Failed to update profile');
                console.error('Profile update error:', error);
            }
        });
    };

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

    const handleProviderUnlink = (providerName: string, providerId: string) => {
        unlinkProviderMutation.mutate({ providerName, providerId }, {
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
        return <div className="text-red-500 text-center p-4">Error: Google OAuth configuration is missing</div>;
    }

    if (isProfileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[hsl(42,46%,94%)]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[hsl(148,58%,55%)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[hsl(42,46%,94%)] py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-[hsl(149,41%,39%)] mb-1">Account Settings</h1>
                    <p className="text-sm text-[hsl(32,32%,41%)]">Update your profile and security preferences</p>
                </div>

                {/* Profile Section */}
                <div className="grid md:grid-cols-4 gap-4">
                    <Card className="shadow-md border-[hsl(148,58%,55%)] md:col-span-1">
                        <CardHeader className="bg-[hsl(148,58%,55%)]/10 py-3">
                            <CardTitle className="text-[hsl(149,41%,39%)] text-lg">Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-4 space-y-3">
                            <div className="relative group">
                            <Avatar className="w-24 h-24 border-2 border-[hsl(138,49%,70%)] transition-transform group-hover:scale-105">
                                <AvatarImage
                                    src={`${baseUrl}${profile?.profile}` || '/default-avatar.png'}
                                    alt="Profile"
                                />
                                <AvatarFallback className="bg-[hsl(138,49%,70%)] text-white text-lg">
                                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 bg-[hsl(148,58%,55%)] text-white rounded-full p-1.5 cursor-pointer hover:bg-[hsl(149,41%,39%)] transition-all"
                            >
                                <Camera size={16} />
                                <input
                                    type="file"
                                    id="profileImage"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                />
                            </label>
                </div>
            </CardContent>
        </Card>

    <Card className="shadow-md border-[hsl(148,58%,55%)] md:col-span-3">
        <CardHeader className="bg-[hsl(148,58%,55%)]/10 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-[hsl(149,41%,39%)] text-lg">Personal Information</CardTitle>
            {!isProfileEditing ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProfileEditing(true)}
                    className="border-[hsl(32,32%,41%)] text-[hsl(32,32%,41%)] hover:bg-[hsl(138,49%,70%)]/20"
                >
                    Edit
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            profileForm.reset();
                            setIsProfileEditing(false);
                        }}
                        className="border-[hsl(32,32%,41%)] text-[hsl(32,32%,41%)] hover:bg-[hsl(138,49%,70%)]/20"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={profileForm.handleSubmit(onProfileSubmit)}
                        className="bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white"
                    >
                        Save
                    </Button>
                </div>
            )}
        </CardHeader>
        <CardContent className="pt-4">
            <form className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">First Name</Label>
                    <Controller
                        name="firstName"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={!isProfileEditing}
                                className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                            />
                        )}
                    />
                    {isProfileEditing && profileForm.formState.errors.firstName && (
                        <p className="text-red-500 text-xs">{profileForm.formState.errors.firstName.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">Middle Name</Label>
                    <Controller
                        name="middleName"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={!isProfileEditing}
                                className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                            />
                        )}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">Last Name</Label>
                    <Controller
                        name="lastName"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={!isProfileEditing}
                                className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                            />
                        )}
                    />
                    {isProfileEditing && profileForm.formState.errors.lastName && (
                        <p className="text-red-500 text-xs">{profileForm.formState.errors.lastName.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">Email</Label>
                    <Controller
                        name="email"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="email"
                                disabled={!isProfileEditing}
                                className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                            />
                        )}
                    />
                    {isProfileEditing && profileForm.formState.errors.email && (
                        <p className="text-red-500 text-xs">{profileForm.formState.errors.email.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">Phone Number</Label>
                    <Controller
                        name="phoneNumber"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={!isProfileEditing}
                                className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                            />
                        )}
                    />
                    {isProfileEditing && profileForm.formState.errors.phoneNumber && (
                        <p className="text-red-500 text-xs">{profileForm.formState.errors.phoneNumber.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">Date of Birth</Label>
                    <Controller
                        name="dob"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="date"
                                disabled={!isProfileEditing}
                                className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                            />
                        )}
                    />
                    {isProfileEditing && profileForm.formState.errors.dob && (
                        <p className="text-red-500 text-xs">{profileForm.formState.errors.dob.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label className="text-[hsl(149,41%,39%)] text-sm">Gender</Label>
                    <Controller
                        name="gender"
                        control={profileForm.control}
                        render={({ field }) => (
                            <Select
                                disabled={!isProfileEditing}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </form>
        </CardContent>
    </Card>
</div>

{/* Security Section */}
    <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-md border-[hsl(148,58%,55%)]">
            <CardHeader className="bg-[hsl(148,58%,55%)]/10 py-3">
                <CardTitle className="text-[hsl(149,41%,39%)] text-lg">Linked Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-[hsl(149,41%,39%)] text-sm font-medium">Google Account</span>
                        {linkedProviders.some(p => p.providerName === 'Google') ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        <Unlink className="mr-1" size={14} /> Unlink
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-[hsl(149,41%,39%)]">Unlink Google Account</DialogTitle>
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
                            <GoogleAuthHandler onLinkGoogle={fetchLinkedProviders} />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>

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
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    {...field}
                                    className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                />
                            )}
                        />
                        {passwordForm.formState.errors.currentPassword && (
                            <p className="text-red-500 text-xs">{passwordForm.formState.errors.currentPassword.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[hsl(149,41%,39%)] text-sm">New Password</Label>
                        <Controller
                            name="newPassword"
                            control={passwordForm.control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    {...field}
                                    className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                />
                            )}
                        />
                        {passwordForm.formState.errors.newPassword && (
                            <p className="text-red-500 text-xs">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[hsl(149,41%,39%)] text-sm">Confirm New Password</Label>
                        <Controller
                            name="confirmNewPassword"
                            control={passwordForm.control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    {...field}
                                    className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                />
                            )}
                        />
                        {passwordForm.formState.errors.confirmNewPassword && (
                            <p className="text-red-500 text-xs">{passwordForm.formState.errors.confirmNewPassword.message}</p>
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
    </div>
</div>
</div>
);
};

export default AccountPage;