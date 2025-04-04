'use client';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Calendar, Camera, Mail, Phone, User} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useChangeProfileImage, useCustomerProfile, useUpdateCustomerInfo} from '@/lib/queries/useAuthQueries';
import {useAuthStore} from '@/lib/stores/useAuthStore';
import toast from "react-hot-toast";
import {UserProfileFormValues, userProfileSchema} from "@/lib/schemas/authSchemas";


const ProfileTab: React.FC = () => {
    const {currentUser} = useAuthStore();
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URLS;

    const {data: profile, isLoading: isProfileLoading} = useCustomerProfile(currentUser?.id);
    const changeProfileImageMutation = useChangeProfileImage(currentUser?.id || '');
    const updateProfileMutation = useUpdateCustomerInfo(currentUser?.id || '');

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

    if (isProfileLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[hsl(148,58%,55%)]"></div>
            </div>
        );
    }

    return (
        <Card className="shadow-lg border-[hsl(148,58%,55%)] max-w-4xl mx-auto">
            <CardHeader
                className="bg-[hsl(148,58%,55%)]/10 py-4 flex flex-col sm:flex-row justify-between items-center gap-3"
            >
                <CardTitle className="text-[hsl(149,41%,39%)] text-xl font-semibold flex items-center gap-2">
                    <User className="w-6 h-6 text-[hsl(149,41%,39%)]"/>
                    Personal Information
                </CardTitle>
                {!isProfileEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsProfileEditing(true)}
                        className="border-[hsl(32,32%,41%)] text-[hsl(32,32%,41%)] hover:bg-[hsl(138,49%,70%)]/20"
                    >
                        Edit Profile
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
                            Save Changes
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Picture Section */}
                    <div className="md:w-1/4 flex flex-col items-center">
                        <div className="relative group mb-4">
                            <Avatar
                                className="w-40 h-40 border-3 border-[hsl(138,49%,70%)] transition-transform group-hover:scale-105">
                                <AvatarImage
                                    src={`${baseUrl}${profile?.profile}` || '/default-avatar.png'}
                                    alt="Profile"
                                />
                                <AvatarFallback className="bg-[hsl(138,49%,70%)] text-white text-2xl">
                                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 bg-[hsl(148,58%,55%)] text-white rounded-full p-2.5 cursor-pointer hover:bg-[hsl(149,41%,39%)] transition-all"
                            >
                                <Camera size={20}/>
                                <input
                                    type="file"
                                    id="profileImage"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                />
                            </label>
                        </div>
                        {isProfileEditing &&
                            <p className="text-[hsl(32,32%,41%)] text-sm text-center">
                                Update your profile picture
                            </p>}
                    </div>

                    {/* Profile Details Form */}
                    <form className="flex-grow grid gap-6 sm:grid-cols-2">
                        {/* First Name */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm flex items-center gap-2">
                                <User className="w-4 h-4"/> First Name
                            </Label>
                            <Controller
                                name="firstName"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        disabled={!isProfileEditing}
                                        className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                    />
                                )}
                            />
                            {isProfileEditing && profileForm.formState.errors.firstName && (
                                <p className="text-red-500 text-xs">
                                    {profileForm.formState.errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Middle Name */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm flex items-center gap-2">
                                <User className="w-4 h-4"/> Middle Name
                            </Label>
                            <Controller
                                name="middleName"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        disabled={!isProfileEditing}
                                        className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                    />
                                )}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm flex items-center gap-2">
                                <User className="w-4 h-4"/> Last Name
                            </Label>
                            <Controller
                                name="lastName"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        disabled={!isProfileEditing}
                                        className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                    />
                                )}
                            />
                            {isProfileEditing && profileForm.formState.errors.lastName && (
                                <p className="text-red-500 text-xs">
                                    {profileForm.formState.errors.lastName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4"/> Email
                            </Label>
                            <Controller
                                name="email"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        disabled={!isProfileEditing}
                                        className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                    />
                                )}
                            />
                            {isProfileEditing && profileForm.formState.errors.email && (
                                <p className="text-red-500 text-xs">
                                    {profileForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm flex items-center gap-2">
                                <Phone className="w-4 h-4"/> Phone Number
                            </Label>
                            <Controller
                                name="phoneNumber"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        type="tel"
                                        disabled={!isProfileEditing}
                                        placeholder="+1 (123) 456-7890"
                                        className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                    />
                                )}
                            />
                            {isProfileEditing && profileForm.formState.errors.phoneNumber && (
                                <p className="text-red-500 text-xs">
                                    {profileForm.formState.errors.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4"/> Date of Birth
                            </Label>
                            <Controller
                                name="dob"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        type="date"
                                        disabled={!isProfileEditing}
                                        className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm"
                                    />
                                )}
                            />
                            {isProfileEditing && profileForm.formState.errors.dob && (
                                <p className="text-red-500 text-xs">
                                    {profileForm.formState.errors.dob.message}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label className="text-[hsl(149,41%,39%)] text-sm">Gender</Label>
                            <Controller
                                name="gender"
                                control={profileForm.control}
                                render={({field}) => (
                                    <Select
                                        disabled={!isProfileEditing}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            className="border-[hsl(138,49%,70%)] focus:border-[hsl(149,41%,39%)] text-sm">
                                            <SelectValue placeholder="Select Gender"/>
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
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileTab;