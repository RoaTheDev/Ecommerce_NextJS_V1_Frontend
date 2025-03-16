'use client';

import React from 'react';
import Link from 'next/link';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {RegisterFormData, registerSchema} from '@/lib/schemas/authSchemas';
import {useRegister} from '@/lib/queries/useAuthQueries';
import {AxiosError} from 'axios';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CaptionProps, useNavigation} from "react-day-picker";

export default function RegisterPage() {
    const {register, handleSubmit, formState: {errors}, setValue, watch, control} = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            dob: '',
            gender: 'Male'
        }
    });

    const registerMutation = useRegister();

    const onSubmit: SubmitHandler<RegisterFormData> = (data: RegisterFormData) => {
        registerMutation.mutate(data);
    };

    const errorMessage = registerMutation.error
        ? ((registerMutation.error as AxiosError<{ detail: string }>).response?.data?.detail || 'Registration failed')
        : null;

    const handleGenderChange = (value: string) => {
        setValue('gender', value);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F6F2E9] p-4">
            <Card className="w-full max-w-md border-[#5CBD7B] border-2 shadow-lg">
                <CardHeader className="bg-[#5CBD7B] text-white">
                    <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                    <CardDescription className="text-[#F6F2E9] text-center">Join our nature-inspired
                        marketplace</CardDescription>
                </CardHeader>

                <CardContent className="pt-6 pb-2">
                    {errorMessage && (
                        <Alert className="mb-4 bg-red-50 text-red-600 border-red-300">
                            <AlertCircle className="w-4 h-4 mr-2"/>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-[#3A8C5C] font-medium">First Name</Label>
                                <Input
                                    id="firstName"
                                    {...register('firstName')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middleName" className="text-[#3A8C5C] font-medium">Middle Name
                                    (Optional)</Label>
                                <Input
                                    id="middleName"
                                    {...register('middleName')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                                />
                                {errors.middleName &&
                                    <p className="text-red-500 text-xs">{errors.middleName.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-[#3A8C5C] font-medium">Last Name</Label>
                            <Input
                                id="lastName"
                                {...register('lastName')}
                                className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[#3A8C5C] font-medium">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    {...register('password')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-[#3A8C5C] font-medium">Confirm
                                    Password</Label>
                                <Input
                                    type="password"
                                    id="confirmPassword"
                                    {...register('confirmPassword')}
                                    className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                                />
                                {errors.confirmPassword &&
                                    <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-[#3A8C5C] font-medium">Phone Number</Label>
                            <Input
                                type="tel"
                                id="phoneNumber"
                                {...register('phoneNumber')}
                                className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-[#3A8C5C] font-medium">Date of Birth</Label>

                                <Controller
                                    control={control}
                                    name="dob"
                                    render={({field}) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="dob"
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal border-[#90D4A3] hover:bg-[#F6F2E9] hover:text-[#3A8C5C] focus:ring-[#3A8C5C]",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#5CBD7B]"/>
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                    initialFocus
                                                    className="rounded-md border border-[#90D4A3]"
                                                    classNames={{
                                                        day_selected: "bg-[#5CBD7B] text-white hover:bg-[#3A8C5C] hover:text-white focus:bg-[#3A8C5C] focus:text-white",
                                                        day_today: "bg-[#F6F2E9] text-[#3A8C5C]",
                                                        day_range_middle: "bg-[#90D4A3]/20",
                                                        day_hidden: "invisible",
                                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#90D4A3]/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                        nav_button: "border border-[#90D4A3] bg-white hover:bg-[#F6F2E9] rounded-md",
                                                        nav_button_previous: "absolute left-1",
                                                        nav_button_next: "absolute right-1",
                                                        caption: "py-2 px-4 text-[#3A8C5C]",
                                                        head_cell: "text-[#8B6E47] font-medium text-xs w-8",
                                                        head_row: "flex",
                                                        row: "flex w-full mt-2",
                                                        table: "w-full border-collapse space-y-1",
                                                    }}
                                                    components={{
                                                        Caption: ((props: CaptionProps) => {
                                                            const {goToMonth} = useNavigation();

                                                            const years = Array.from({length: 125}, (_, i) => new Date().getFullYear() - i);
                                                            const months = [
                                                                "January", "February", "March", "April", "May", "June",
                                                                "July", "August", "September", "October", "November", "December"
                                                            ];

                                                            const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                const newDate = new Date(props.displayMonth);
                                                                newDate.setFullYear(parseInt(e.target.value, 10));
                                                                goToMonth(newDate);
                                                            };

                                                            const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                const newDate = new Date(props.displayMonth);
                                                                newDate.setMonth(parseInt(e.target.value, 10));
                                                                goToMonth(newDate);
                                                            };

                                                            return (
                                                                <div
                                                                    className="flex justify-center items-center gap-2 py-3 px-2 bg-[#F6F2E9]/50 border-b border-[#90D4A3] rounded-t-md">
                                                                    <div className="relative w-full">
                                                                        <select
                                                                            value={props.displayMonth.getMonth()}
                                                                            onChange={handleMonthChange}
                                                                            className="w-full appearance-none bg-white border border-[#90D4A3] text-[#3A8C5C] py-1 px-3 pr-8 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5CBD7B] focus:border-transparent cursor-pointer"
                                                                        >
                                                                            {months.map((month, i) => (
                                                                                <option key={month}
                                                                                        value={i}>{month}</option>
                                                                            ))}
                                                                        </select>
                                                                        <div
                                                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5CBD7B]">
                                                                            <svg className="h-4 w-4" fill="none"
                                                                                 viewBox="0 0 24 24"
                                                                                 stroke="currentColor">
                                                                                <path strokeLinecap="round"
                                                                                      strokeLinejoin="round"
                                                                                      strokeWidth={2}
                                                                                      d="M19 9l-7 7-7-7"/>
                                                                            </svg>
                                                                        </div>
                                                                    </div>

                                                                    <div className="relative w-full">
                                                                        <select
                                                                            value={props.displayMonth.getFullYear()}
                                                                            onChange={handleYearChange}
                                                                            className="w-full appearance-none bg-white border border-[#90D4A3] text-[#3A8C5C] py-1 px-3 pr-8 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5CBD7B] focus:border-transparent cursor-pointer"
                                                                        >
                                                                            {years.map(year => (
                                                                                <option key={year}
                                                                                        value={year}>{year}</option>
                                                                            ))}
                                                                        </select>
                                                                        <div
                                                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5CBD7B]">
                                                                            <svg className="h-4 w-4" fill="none"
                                                                                 viewBox="0 0 24 24"
                                                                                 stroke="currentColor">
                                                                                <path strokeLinecap="round"
                                                                                      strokeLinejoin="round"
                                                                                      strokeWidth={2}
                                                                                      d="M19 9l-7 7-7-7"/>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-[#3A8C5C] font-medium">Gender</Label>
                                <Select onValueChange={handleGenderChange} defaultValue={watch('gender')}>
                                    <SelectTrigger
                                        className="border-[#90D4A3] focus:border-[#3A8C5C] focus:ring-[#3A8C5C]">
                                        <SelectValue placeholder="Select your gender"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-[#90D4A3]">
                                        <SelectItem value="Male"
                                                    className="focus:bg-[#90D4A3]/20 focus:text-[#3A8C5C]">Male</SelectItem>
                                        <SelectItem value="Female"
                                                    className="focus:bg-[#90D4A3]/20 focus:text-[#3A8C5C]">Female</SelectItem>
                                        <SelectItem value="Other"
                                                    className="focus:bg-[#90D4A3]/20 focus:text-[#3A8C5C]">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-[#5CBD7B] hover:bg-[#3A8C5C] text-white transition-colors"
                        >
                            {registerMutation.isPending ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center p-4 border-t border-[#90D4A3] bg-[#F6F2E9]/70">
                    <p className="text-[#3A8C5C]">
                        Already have an account?
                        <Link href="/auth/login"
                              className="text-[#8B6E47] hover:text-[#5CBD7B] ml-1 font-medium transition-colors">
                            Login here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};