import axios from "axios";
import {AddressCreationRequest, AddressResponse, AddressUpdateRequest} from "@/lib/types/addressTypes";
import {ConfirmationResponse} from "@/lib/types/commonTypes";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});


export const fetchAddress = async (customerId: number | string, addressId: number | string): Promise<AddressResponse> => {
    const response = await api.get<AddressResponse>(`/Customer/${customerId}/Address/${addressId}/`);
    return response.data;
};

export const fetchAddresses = async (customerId: number | string): Promise<AddressResponse[]> => {
    const response = await api.get<AddressResponse[]>(`/Customer/${customerId}/Address`);
    return response.data;
};

export const createAddress = async (customerId: number | string, request: AddressCreationRequest): Promise<AddressResponse> => {
    const response = await api.post<AddressResponse>(`/Customer/${customerId}/Address`, request);
    return response.data;
};

export const updateAddress = async (
    customerId: number | string,
    addressId: number | string,
    request: AddressUpdateRequest
): Promise<AddressResponse> => {
    const response = await api.patch<AddressResponse>(`/Customer/${customerId}/Address/${addressId}/`, request);
    return response.data;
};

export const deleteAddress = async (customerId: number | string, addressId: number | string): Promise<ConfirmationResponse> => {
    const response = await api.delete<ConfirmationResponse>(`/Customer/${customerId}/Address/${addressId}/`);
    return response.data;
};

export const changeDefaultAddress = async (customerId: number | string, addressId: number | string): Promise<ConfirmationResponse> => {
    const response = await api.patch<ConfirmationResponse>(`/Customer/${customerId}/Address/${addressId}`);
    return response.data;
}