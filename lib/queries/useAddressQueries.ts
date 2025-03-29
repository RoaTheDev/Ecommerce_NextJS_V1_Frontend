import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {AddressCreationRequest, AddressResponse, AddressUpdateRequest} from "@/lib/types/addressTypes";
import {
    changeDefaultAddress,
    createAddress,
    deleteAddress,
    fetchAddress,
    fetchAddresses,
    updateAddress
} from "@/lib/data/addressApi";
import {ConfirmationResponse, ProblemDetails} from "@/lib/types/commonTypes";
import {AxiosError} from "axios";

export const useAddress = (customerId: number, addressId: number) => {
    return useQuery<AddressResponse, AxiosError<ProblemDetails>>({
        queryKey: ['address', customerId, addressId],
        queryFn: () => fetchAddress(customerId, addressId),
    });
};

export const useAddresses = (customerId: number) => {
    return useQuery<AddressResponse[], AxiosError<ProblemDetails>>({
        queryKey: ['addresses', customerId],
        queryFn: () => fetchAddresses(customerId),
        select: (data) => data || []
    });
};

export const useCreateAddress = (customerId: number) => {
    const queryClient = useQueryClient();
    return useMutation<AddressResponse, AxiosError<ProblemDetails>, AddressCreationRequest>({
        mutationFn: (request) => createAddress(customerId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['addresses', customerId]});
            toast.success('Address created successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to create address';
            toast.error(message);
        },
    });
};

export const useUpdateAddress = (customerId: number, addressId: number) => {
    const queryClient = useQueryClient();
    return useMutation<AddressResponse, AxiosError<ProblemDetails>, AddressUpdateRequest>({
        mutationFn: (request) => updateAddress(customerId, addressId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['addresses', customerId]});
            await queryClient.invalidateQueries({queryKey: ['address', customerId, addressId]});
            toast.success('Address updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to update address';
            toast.error(message);
        },
    });
};

export const useDeleteAddress = (customerId: number) => {
    const queryClient = useQueryClient();
    return useMutation<ConfirmationResponse, AxiosError<ProblemDetails>, number>({
        mutationFn: (addressId) => deleteAddress(customerId, addressId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['addresses', customerId]});
            toast.success('Address deleted successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to delete address';
            toast.error(message);
        },
    });
};

export const useChangeDefaultAddress = (customerId: number) => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, AxiosError<ProblemDetails>, number>({
        mutationFn: (addressId) => changeDefaultAddress(customerId, addressId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['addresses', customerId]});
            toast.success('Default address changed successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to change default address';
            toast.error(message);
        },
    });
};