'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCustomerProfile } from "@/lib/queries/useAuthQueries";
import { UserData } from "@/lib/types/authTypes";
import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminAccountPage = () => {
    const { currentUser } = useAuthStore();
    const { data: userData, isLoading } = useCustomerProfile(currentUser?.id);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserData>();

    useEffect(() => {
        if (userData) {
            reset({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phoneNumber: userData.phoneNumber || "",
                dob: userData.dob || "",
                gender: userData.gender || "Male",
            });
        }
    }, [userData, reset]);

    const onSubmit = (data: UserData) => {
        console.log("Updated Data:", data);
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Fauna Admin</h1>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                        <Bell size={20} />
                    </Button>
                    <Avatar>
                        <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
                        <AvatarFallback>
                            {userData?.firstName.charAt(0)}{userData?.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </header>

            <div className="max-w-4xl mx-auto py-10 px-4">
                <Card>
                    <CardHeader className="flex justify-between">
                        <div>
                            <CardTitle>Admin Profile</CardTitle>
                            <CardDescription>Manage your personal information</CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        ) : (
                            <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>First Name</Label>
                                <Input {...register("firstName", { required: "First name is required" })} disabled={!isEditing} />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <Label>Last Name</Label>
                                <Input {...register("lastName", { required: "Last name is required" })} disabled={!isEditing} />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input {...register("email", { required: "Email is required" })} disabled={!isEditing} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                            <div>
                                <Label>Phone Number</Label>
                                <Input {...register("phoneNumber", { required: "Phone number is required" })} disabled={!isEditing} />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminAccountPage;
