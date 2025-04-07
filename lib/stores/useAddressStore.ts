import {create} from 'zustand';
import {AddressResponse, AddressUpdateRequest,} from '@/lib/types/addressTypes';
import {ProblemDetails} from '@/lib/types/commonTypes';
import {AxiosError} from 'axios';

interface AddressState {
    addresses: AddressResponse[];
    selectedAddress: AddressResponse | null;
    loading: boolean;
    error: AxiosError<ProblemDetails> | null;

    setAddresses: (addresses: AddressResponse[]) => void;
    setSelectedAddress: (address: AddressResponse | null) => void;
    addAddress: (address: AddressResponse) => void;
    updateAddress: (addressId: number, updatedAddress: AddressUpdateRequest) => void;
    removeAddress: (addressId: number) => void;
    setDefaultAddress: (addressId: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: AxiosError<ProblemDetails> | null) => void;
    reset: () => void;
}

export const useAddressStore = create<AddressState>((set) => ({
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,

    setAddresses: (addresses) =>
        set((state) => ({
            ...state,
            addresses,
            loading: false,
            error: null,
        })),

    setSelectedAddress: (address) =>
        set((state) => ({
            ...state,
            selectedAddress: address,
            loading: false,
            error: null,
        })),

    addAddress: (address) =>
        set((state) => ({
            ...state,
            addresses: [...state.addresses, address],
            loading: false,
            error: null,
        })),

    updateAddress: (addressId, updatedAddress) =>
        set((state) => ({
            ...state,
            addresses: state.addresses.map((addr) =>
                addr.addressId === addressId
                    ? {...addr, ...updatedAddress}
                    : addr
            ),
            selectedAddress:
                state.selectedAddress?.addressId === addressId
                    ? {...state.selectedAddress, ...updatedAddress}
                    : state.selectedAddress,
            loading: false,
            error: null,
        })),

    removeAddress: (addressId) =>
        set((state) => ({
            ...state,
            addresses: state.addresses.filter((addr) => addr.addressId !== addressId),
            selectedAddress:
                state.selectedAddress?.addressId === addressId
                    ? null
                    : state.selectedAddress,
            loading: false,
            error: null,
        })),

    setDefaultAddress: (addressId) =>
        set((state) => ({
            ...state,
            addresses: state.addresses.map((addr) => ({
                ...addr,
                isDefault: addr.addressId === addressId,
            })),
            selectedAddress: state.selectedAddress
                ? {
                    ...state.selectedAddress,
                    isDefault: state.selectedAddress.addressId === addressId,
                }
                : null,
            loading: false,
            error: null,
        })),

    setLoading: (loading) =>
        set((state) => ({
            ...state,
            loading,
        })),

    setError: (error) =>
        set((state) => ({
            ...state,
            error,
            loading: false,
        })),

    reset: () =>
        set({
            addresses: [],
            selectedAddress: null,
            loading: false,
            error: null,
        }),
}));