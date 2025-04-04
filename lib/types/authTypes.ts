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
    userId?: string;
    profile?: string
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface OtpData {
    otp: number;
}

export interface UserResponse {
    userId: string | number;
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

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    expiresAt: string;
}

export interface ResetPasswordRequest {
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface LogoutResponse {
    message: string;
}

export interface CurrentUserResponse {
    customerId: number;
    displayName: string;
    email: string;
}

export interface AuthProviderResponse {
    providerId: string;
    providerName: string;
    linkedAt: string;
}

export interface LinkGoogleRequest {
    idToken: string;
}

export interface PasswordChangeRequest {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

export interface CustomerUpdateRequest {
    firstName?: string;
    middleName?: string;
    gender?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    dob?: string;
}

export interface CustomerUpdateResponse {
    firstName: string;
    middleName?: string;
    gender?: string;
    lastName: string;
    phoneNUmber: string;
    email: string;
    dob: string;
}