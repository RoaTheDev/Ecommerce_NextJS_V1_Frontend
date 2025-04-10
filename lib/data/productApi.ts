import axios, { AxiosResponse } from "axios";
import {
    PaginatedProductResponse,
    ProductByIdResponse,
    ProductCreateRequest,
    ProductCreateResponse,
    ProductFilterRequest,
    ProductImageChangeResponse,
    ProductImageResponse,
    ProductStatusChange,
    ProductTagRemoveRequest,
    ProductTagToAddRequest,
    ProductUpdateRequest,
    ProductUpdateResponse
} from "@/lib/types/productTypes";
import { ConfirmationResponse } from "@/lib/types/commonTypes";
import { apiErrorHandler } from "@/lib/data/apiErrorHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const productApi = axios.create({ baseURL: API_URL, withCredentials: true });
apiErrorHandler(productApi);

// Create a product
export const createProduct = async (product: ProductCreateRequest): Promise<ProductCreateResponse> => {
    const response: AxiosResponse<ProductCreateResponse> = await productApi.post('/Product', product);
    return response.data;
};

// Update a product
export const updateProduct = async (id: number, product: ProductUpdateRequest): Promise<ProductUpdateResponse> => {
    const response: AxiosResponse<ProductUpdateResponse> = await productApi.put(`/Product/${id}`, product);
    return response.data;
};

// Delete a product image
export const deleteProductImage = async (productId: number, imageId: number): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await productApi.delete(`/Product/${productId}/image/${imageId}`);
    return response.data;
};

// Change product status
export const changeProductStatus = async (id: number): Promise<ProductStatusChange> => {
    const response: AxiosResponse<ProductStatusChange> = await productApi.patch(`/Product/${id}`);
    return response.data;
};

// Add product images
export const addProductImage = async (id: number, files: File[]): Promise<ProductImageResponse> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response: AxiosResponse<ProductImageResponse> = await productApi.post(
        `/Product/${id}/image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
};

// Change a product image
export const changeProductImage = async (productId: number, imageId: number, file: File): Promise<ProductImageChangeResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response: AxiosResponse<ProductImageChangeResponse> = await productApi.patch(
        `/Product/${productId}/image/${imageId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
};

// Remove a product tag
export const removeProductTag = async (id: number, request: ProductTagRemoveRequest): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await productApi.patch(`/Product/${id}/tag`, request);
    return response.data;
};

// Add a tag to a product
export const addTagToProduct = async (id: number, request: ProductTagToAddRequest): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await productApi.post(`/Product/${id}/tag`, request);
    return response.data;
};

// Get a product by ID
export const getProductById = async (id: number): Promise<ProductByIdResponse> => {
    const response: AxiosResponse<ProductByIdResponse> = await productApi.get(`/Product/${id}`);
    return response.data;
};

export const getAllProduct = async (
    cursor: number,
    pageSize: number,
    filterRequest?: ProductFilterRequest
): Promise<PaginatedProductResponse> => {
    let response: AxiosResponse<PaginatedProductResponse>;

    if (filterRequest) {
        const params = new URLSearchParams({
            cursor: String(cursor),
            pageSize: String(pageSize),
            ...(filterRequest?.searchQuery && { searchQuery: filterRequest.searchQuery }),
            ...(filterRequest?.categoryId && { categoryId: String(filterRequest.categoryId) }),
            ...(filterRequest?.tagIds && { tagIds: filterRequest.tagIds.join(',') }),
            ...(filterRequest?.minPrice && { minPrice: String(filterRequest.minPrice) }),
            ...(filterRequest?.maxPrice && { maxPrice: String(filterRequest.maxPrice) }),
            ...(filterRequest?.inStock !== undefined && { inStock: String(filterRequest.inStock) }),
            ...(filterRequest?.sortBy && { sortBy: filterRequest.sortBy }),
        });

        response = await productApi.get('/Product/filter', { params: params });
    } else {
        response = await productApi.get('/Product', {
            params: { cursor, pageSize }
        });
    }

    return response.data;
};

// Get best-selling products
export const getBestSellingProduct = async (cursor: number, pageSize: number): Promise<PaginatedProductResponse> => {
    const response: AxiosResponse<PaginatedProductResponse> = await productApi.get('/Product/best-selling', {
        params: { cursor, pageSize }
    });
    return response.data;
};

// Get new arrival products
export const getNewArrival = async (cursor: number, pageSize: number): Promise<PaginatedProductResponse> => {
    const response: AxiosResponse<PaginatedProductResponse> = await productApi.get('/Product/new-arrival', {
        params: { cursor, pageSize }
    });
    return response.data;
};
