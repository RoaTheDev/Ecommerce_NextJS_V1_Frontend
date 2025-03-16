// src/api/authApi.ts
import axios, { AxiosResponse } from 'axios';
import { UserData, LoginCredentials, OtpData, UserResponse } from '@/lib/types/authTypes';
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