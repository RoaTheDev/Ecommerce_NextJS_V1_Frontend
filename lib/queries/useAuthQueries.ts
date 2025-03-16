import {useMutation, UseMutationResult, useQuery, UseQueryResult} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {fetchCustomerProfile, googleLogin, loginUser, registerUser, verifyEmail} from '@/lib/api/authApi';
import {useAuthStore} from '@/lib/stores/useAuthStore';
import {LoginCredentials, UserData, UserResponse, VerifyEmailParams} from '@/lib/types/authTypes';

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
        mutationFn: ({session, otp}: VerifyEmailParams) =>
            verifyEmail(session, {otp: parseInt(otp)}),
        onSuccess: (data) => {
            login(data);
            router.push('/admin/dashboard');
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
            router.push('/dashboard');
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
            router.push('/admin/dashboard');
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