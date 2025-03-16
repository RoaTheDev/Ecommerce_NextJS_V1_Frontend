import React from "react";

export interface UserData {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber: string;
    dob: string;
    gender: string;
    customerId?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface OtpData {
    otp: number;
}

export interface UserResponse {
    customerId: string;
    displayName: string;
    email: string;
    token: {
        token: string;
        expiresIn: number;
    };
}

export interface VerifyEmailParams {
    session: string;
    otp: string;
}

export interface AuthContextType {
    currentUser: UserResponse | null;
    loading: boolean;
    login: (userData: UserResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
}