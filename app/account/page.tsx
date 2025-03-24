'use client'
import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCustomerProfile } from "@/lib/queries/useAuthQueries";
import { UserData } from "@/lib/types/authTypes";
import { Calendar, Camera, Mail, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormData = UserData;

const UserAccountPage = () => {
    const { currentUser } = useAuthStore();
    const { data: userData, isLoading } = useCustomerProfile(currentUser?.customerId);
    const [isEditing, setIsEditing] = React.useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dob: "",
            gender: "Male",
        },
    });


    useEffect(() => {
        if (userData) {
            setValue("firstName", userData.firstName || "");
            setValue("middleName", userData.middleName || "");
            setValue("lastName", userData.lastName || "");
            setValue("email", userData.email || "");
            setValue("phoneNumber", userData.phoneNumber || "");
            setValue("dob", userData.dob || "");
            setValue("gender", userData.gender || "Male");
        }
    }, [userData, setValue]);

    const onSubmit = (data: FormData) => {
        // Here you would implement the API call to update the profile
        console.log("Form submitted:", data);
        setIsEditing(false);
    };

    const genderValue = watch("gender");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[hsl(42,46%,94%)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(148,58%,55%)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[hsl(42,46%,94%)] py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[hsl(32,32%,41%)] mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar / Profile Summary */}
                    <div className="md:col-span-1">
                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src="/api/placeholder/96/96" alt="Profile" />
                                            <AvatarFallback className="bg-[hsl(148,58%,55%)] text-white text-2xl">
                                                {watch("firstName").charAt(0)}
                                                {watch("lastName").charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="icon"
                                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[hsl(148,58%,55%)] shadow-md hover:bg-[hsl(149,41%,39%)]"
                                        >
                                            <Camera size={16} />
                                            <span className="sr-only">Change profile picture</span>
                                        </Button>
                                    </div>

                                    <h2 className="text-xl font-semibold">
                                        {watch("firstName")} {watch("lastName")}
                                    </h2>
                                    <p className="text-gray-500 mb-4">{watch("email")}</p>

                                    <div className="w-full space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-[hsl(149,41%,39%)]" />
                                            <span>{watch("email")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-[hsl(149,41%,39%)]" />
                                            <span>{watch("phoneNumber") || "Not provided"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-[hsl(149,41%,39%)]" />
                                            <span>{watch("dob") || "Not provided"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-[hsl(149,41%,39%)]" />
                                            <span>{watch("gender")}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid grid-cols-2 mb-6">
                                <TabsTrigger value="profile" className="text-center">
                                    Profile Details
                                </TabsTrigger>
                                <TabsTrigger value="security" className="text-center">
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card className="bg-white shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Personal Information</CardTitle>
                                            {!isEditing ? (
                                                <Button
                                                    onClick={() => setIsEditing(true)}
                                                    variant="outline"
                                                    className="border-[hsl(148,58%,55%)] text-[hsl(148,58%,55%)] hover:bg-[hsla(148,58%,55%,0.1)]"
                                                >
                                                    Edit Profile
                                                </Button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => setIsEditing(false)}
                                                        variant="outline"
                                                        className="border-gray-300"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleSubmit(onSubmit)}
                                                        className="bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)]"
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        {...register("firstName", { required: "First name is required" })}
                                                        disabled={!isEditing}
                                                        className="border-gray-300"
                                                    />
                                                    {errors.firstName && (
                                                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        {...register("lastName", { required: "Last name is required" })}
                                                        disabled={!isEditing}
                                                        className="border-gray-300"
                                                    />
                                                    {errors.lastName && (
                                                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="middleName">Middle Name (Optional)</Label>
                                                    <Input
                                                        id="middleName"
                                                        {...register("middleName")}
                                                        disabled={!isEditing}
                                                        className="border-gray-300"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        {...register("email", {
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^\S+@\S+$/i,
                                                                message: "Invalid email address",
                                                            },
                                                        })}
                                                        disabled={!isEditing}
                                                        className="border-gray-300"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        {...register("phoneNumber", {
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: "Invalid phone number (10 digits required)",
                                                            },
                                                        })}
                                                        disabled={!isEditing}
                                                        className="border-gray-300"
                                                    />
                                                    {errors.phoneNumber && (
                                                        <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="dob">Date of Birth</Label>
                                                    <Input
                                                        id="dob"
                                                        type="date"
                                                        {...register("dob", { required: "Date of birth is required" })}
                                                        disabled={!isEditing}
                                                        className="border-gray-300"
                                                    />
                                                    {errors.dob && (
                                                        <p className="text-red-500 text-sm">{errors.dob.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Gender</Label>
                                                    <RadioGroup
                                                        value={genderValue}
                                                        onValueChange={(value) => setValue("gender", value)}
                                                        disabled={!isEditing}
                                                        className="flex space-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Male" id="male" />
                                                            <Label htmlFor="male">Male</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Female" id="female" />
                                                            <Label htmlFor="female">Female</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Other" id="other" />
                                                            <Label htmlFor="other">Other</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security">
                                <Card className="bg-white shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="current-password">Current Password</Label>
                                                        <Input
                                                            id="current-password"
                                                            type="password"
                                                            placeholder="Enter your current password"
                                                            className="border-gray-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="new-password">New Password</Label>
                                                        <Input
                                                            id="new-password"
                                                            type="password"
                                                            placeholder="Enter your new password"
                                                            className="border-gray-300"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                        <Input
                                                            id="confirm-password"
                                                            type="password"
                                                            placeholder="Confirm your new password"
                                                            className="border-gray-300"
                                                        />
                                                    </div>
                                                    <Button
                                                        className="mt-2 w-full md:w-auto bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)]"
                                                    >
                                                        Update Password
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t">
                                                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-gray-600">
                                                            Enhance your account security by enabling two-factor authentication.
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Status: <span className="text-red-500 font-medium">Not Enabled</span>
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="border-[hsl(148,58%,55%)] text-[hsl(148,58%,55%)] hover:bg-[hsla(148,58%,55%,0.1)]"
                                                    >
                                                        Enable 2FA
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t">
                                                <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                                                <div className="space-y-4">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                        fill="#4285F4"
                                                                    />
                                                                    <path
                                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                        fill="#34A853"
                                                                    />
                                                                    <path
                                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                        fill="#FBBC05"
                                                                    />
                                                                    <path
                                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                        fill="#EA4335"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Google</p>
                                                                <p className="text-sm text-gray-500">Connected</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="border-red-400 text-red-500 hover:bg-red-50">
                                                            Disconnect
                                                        </Button>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                                        fill="#1877F2"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Facebook</p>
                                                                <p className="text-sm text-gray-500">Not Connected</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-[hsl(148,58%,55%)] text-[hsl(148,58%,55%)] hover:bg-[hsla(148,58%,55%,0.1)]"
                                                        >
                                                            Connect
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAccountPage;