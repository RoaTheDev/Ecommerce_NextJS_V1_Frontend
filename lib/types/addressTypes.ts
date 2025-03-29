export interface AddressResponse {
    addressId: number;
    customerId: number;
    country: string;
    city: string;
    state: string;
    postalCode: string;
    firstAddressLine: string;
    secondAddressLine: string;
    isDefault: boolean
}

export interface AddressCreationRequest {
    country: string;
    state: string;
    city: string;
    postalCode: string;
    firstAddressLine: string;
    secondAddressLine: string;
}

export interface AddressUpdateRequest {
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    firstAddressLine?: string;
    secondAddressLine?: string;
}