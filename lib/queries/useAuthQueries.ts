import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {
    changePassword,
    changeProfileImage,
    fetchCustomerProfile,
    forgotPassword,
    getLinkedProviders,
    googleLogin,
    linkGoogleAccount,
    loginUser,
    registerUser,
    resetPassword,
    unlinkAuthProvider,
    updateCustomerInfo,
    verifyEmail
} from '@/lib/data/authApi';
import {useAuthStore} from '@/lib/stores/useAuthStore';
import {
    AuthProviderResponse,
    CustomerUpdateRequest,
    CustomerUpdateResponse,
    ForgotPasswordResponse,
    LoginCredentials,
    PasswordChangeRequest,
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
            console.log(data)
            login(data);
            const decodedToken = jwtDecode<{ exp: number; role: string }>(data.token.token);
            const role = decodedToken.role;
            return role === 'Admin' ? router.push('/admin/dashboard') : router.push('/');
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

export const useCustomerProfile = (id?: string | number): UseQueryResult<UserData, Error> => {
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

export const useChangePassword = (id: string | number): UseMutationResult<{ message: string }, Error, PasswordChangeRequest> => {
    return useMutation({
        mutationFn: (data: PasswordChangeRequest) => changePassword(id, data),
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: () => {
            toast.error('Failed to change password');
        }
    });
};

export const useChangeProfileImage = (id: string | number): UseMutationResult<{ message: string }, Error, File> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => changeProfileImage(id, file),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['customer', id]})
            toast.success('Profile image updated successfully');
        },
        onError: () => {
            toast.error('Failed to update profile image');
        }
    });
};

export const useLinkGoogleAccount = (): UseMutationResult<{ message: string }, Error, string> => {
    return useMutation({
        mutationFn: (idToken: string) => linkGoogleAccount(idToken),
        onSuccess: () => {
            toast.success('Google account linked successfully');
        },
        onError: () => {
            toast.error('Failed to link Google account');
        }
    });
};

export const useUnlinkAuthProvider = (): UseMutationResult<{ message: string }, Error, {
    providerName: string,
    providerId: string
}> => {
    return useMutation({
        mutationFn: ({providerName, providerId}) => unlinkAuthProvider(providerName, providerId),
        onSuccess: () => {
            toast.success('Authentication provider unlinked successfully');
        },
        onError: () => {
            toast.error('Failed to unlink authentication provider');
        }
    });
};

export const useGetLinkedProviders = (): UseQueryResult<AuthProviderResponse[], Error> => {
    return useQuery<AuthProviderResponse[], Error>({
        queryKey: ['linkedProviders'],
        queryFn: async () => {
            try {
                return await getLinkedProviders();
            } catch (error) {
                toast.error('Failed to fetch linked providers');
                throw error;
            }
        }
    });
};


export const useUpdateCustomerInfo = (id: string | number): UseMutationResult<CustomerUpdateResponse, Error, CustomerUpdateRequest> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updateData: CustomerUpdateRequest) => updateCustomerInfo(id, updateData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['customer', id]});
            toast.success('Customer information updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update customer information');
            console.error('Update customer info error:', error);
        }
    });
};