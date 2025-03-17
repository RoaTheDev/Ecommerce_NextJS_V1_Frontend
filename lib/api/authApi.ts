// src/api/authApi.ts
import axios, {AxiosResponse} from 'axios';
import {
    CurrentUserResponse,
    ForgotPasswordResponse,
    LoginCredentials,
    LogoutResponse,
    OtpData, ResetPasswordRequest,
    ResetPasswordResponse,
    UserData,
    UserResponse
} from '@/lib/types/authTypes';
import {apiErrorHandler} from "@/lib/api/apiErrorHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const authApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
apiErrorHandler(authApi)
export const registerUser = async (userData: UserData): Promise<{ session: string }> => {
    const response: AxiosResponse<{ session: string }> = await authApi.post('/Auth/register/', userData);
    return response.data;
};

export const verifyEmail = async (session: string, otpData: OtpData): Promise<UserResponse> => {
    const response: AxiosResponse<UserResponse> = await authApi.post('/Auth/email-verification/', otpData, {
        headers: {
            'Auth-Session-Token': session
        }
    });
    return response.data;
};

export const loginUser = async (credentials: LoginCredentials): Promise<UserResponse> => {
    const response: AxiosResponse<UserResponse> = await authApi.post('/Auth/login/', credentials);
    return response.data;
};

export const googleLogin = async (tokenId: { idToken: string }): Promise<UserResponse> => {
    const response: AxiosResponse<UserResponse> = await authApi.post('/Auth/signin-google', tokenId);
    return response.data;
};

export const fetchCustomerProfile = async (id: string): Promise<UserData> => {
    const response: AxiosResponse<UserData> = await authApi.get(`/Auth/${id}`);
    return response.data;
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    const response: AxiosResponse<ForgotPasswordResponse> = await authApi.post('/Auth/forgot-password', {email});
    return response.data;
};

export const resetPassword = async (token: string, passwords: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response: AxiosResponse<ResetPasswordResponse> = await authApi.post(`/Auth/reset-password/${token}`, passwords);
    return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
    const response: AxiosResponse<LogoutResponse> = await authApi.post('/Auth/logout');
    return response.data;
};

export const me = async (): Promise<CurrentUserResponse> => {
    const response: AxiosResponse<CurrentUserResponse> = await authApi.get('/Auth/me');
    return response.data;
};