import {useMutation, UseMutationResult, useQuery, UseQueryResult} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {
    fetchCustomerProfile,
    forgotPassword,
    googleLogin,
    loginUser,
    registerUser,
    resetPassword,
    verifyEmail
} from '@/lib/api/authApi';
import {useAuthStore} from '@/lib/stores/useAuthStore';
import {
    ForgotPasswordResponse,
    LoginCredentials,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserData,
    UserResponse,
    VerifyEmailParams
} from '@/lib/types/authTypes';
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

export const useRegister = (): UseMutationResult<{ session: string }, Error, UserData> => {
    const router = useRouter();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            router.push(`/auth/verify-email?session=${data.session}`);
        }
    });
};

export const useVerifyEmail = (): UseMutationResult<UserResponse, Error, VerifyEmailParams> => {
    const router = useRouter();
    const login = useAuthStore(state => state.login);
    return useMutation({
        mutationFn: ({session, otp}: VerifyEmailParams) => verifyEmail(session, {otp: parseInt(otp)}),
        onSuccess: (data) => {
            login(data);
            router.push('/admin/dashboard');
        }, onError: () => {
            toast.error('Email verification failed.');
        }
    });
};

export const useLogin = (): UseMutationResult<UserResponse, Error, LoginCredentials> => {
    const router = useRouter();
    const login = useAuthStore(state => state.login);

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data);
            const decodedToken = jwtDecode<{ exp: number; role: string }>(data.token.token);
            const role = decodedToken.role;
            return role === 'Admin' ? router.push('/admin/dashboard') : router.push('/');
        },
        onError: () => {
            toast.error('Login failed.');
        }
    });
};



export const useGoogleLogin = (): UseMutationResult<UserResponse, Error, { idToken: string }> => {
    const router = useRouter();
    const login = useAuthStore(state => state.login);

    return useMutation({
        mutationFn: googleLogin,
        onSuccess: (data) => {
            login(data);
            const decodedToken = jwtDecode<{ exp: number; role: string }>(data.token.token);
            const role = decodedToken.role;
            return role === 'Admin' ? router.push('/admin/dashboard') : router.push('/');
        },
        onError: () => {
            toast.error('Google login failed.');
        }
    });
};

export const useCustomerProfile = (id?: string): UseQueryResult<UserData, Error> => {
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => {
            if (!id) throw new Error('Customer ID is required');
            return fetchCustomerProfile(id);
        },
        enabled: Boolean(id),
    });
};

export const useForgotPassword = (): UseMutationResult<ForgotPasswordResponse, Error, string> => {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
        onSuccess: () => {
            toast.success('Password reset instructions sent to your email');
        }
    });
};

export const useResetPassword = (token: string): UseMutationResult<ResetPasswordResponse, Error, ResetPasswordRequest> => {
    const router = useRouter();

    return useMutation({
        mutationFn: (passwords: ResetPasswordRequest) => resetPassword(token, passwords),
        onSuccess: () => {
            toast.success('Password reset successful!');
            router.push('/auth/login');
        }, onError: () => {
            toast.error('Failed to send reset instructions.');
        }
    });
};

export const useLogout = (): UseMutationResult<void, Error, void> => {
    const router = useRouter();
    const logoutStore = useAuthStore(state => state.logout);

    return useMutation({
        mutationFn: logoutStore,
        onSuccess: () => {
            router.push('/auth/login');
            toast.success('You have been logged out successfully');
        },
        onError: () => {
            router.push('/auth/login');
        }
    });
};