import axios, {AxiosResponse} from "axios";
import {
    PaginatedProductResponse,
    ProductByIdResponse,
    ProductCreateRequest,
    ProductCreateResponse,
    ProductFilterRequest,
    ProductImageChangeResponse,
    ProductImageResponse,
    ProductListingResponse,
    ProductStatusChange,
    ProductTagRemoveRequest,
    ProductTagToAddRequest,
    ProductUpdateRequest,
    ProductUpdateResponse
} from "@/lib/types/productTypes";
import {ConfirmationResponse} from "@/lib/types/commonTypes";
import {apiErrorHandler} from "@/lib/data/apiErrorHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const productApi = axios.create({baseURL: API_URL, withCredentials: true});
apiErrorHandler(productApi)
// write
export const createProduct = async (Product: ProductCreateRequest): Promise<ProductCreateResponse> => {
    const response: AxiosResponse<ProductCreateResponse> = await productApi.post('/Product', Product);
    return response.data;
}

export const updateProduct = async (id: number, Product: ProductUpdateRequest): Promise<ProductUpdateResponse> => {
    const response: AxiosResponse<ProductUpdateResponse> = await productApi.put(`/Product/${id}`, Product)
    return response.data
}

export const deleteProductImage = async (productId: number, imageId: number): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await productApi.delete(`/Product/${productId}/image/${imageId}`);
    return response.data
}
export const changeProductStatus = async (id: number): Promise<ProductStatusChange> => {
    const response: AxiosResponse<ProductStatusChange> = await productApi.patch(`/Product/${id}`)
    return response.data
}

export const addProductImage = async (id: number, files: File[]): Promise<ProductImageResponse> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response: AxiosResponse<ProductImageResponse> = await productApi.post(
        `/Product/${id}/image`,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    );
    return response.data;
}

export const changeProductImage = async (productId: number, imageId: number, file: File): Promise<ProductImageChangeResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response: AxiosResponse<ProductImageChangeResponse> = await productApi.patch(
        `/Product/${productId}/image/${imageId}`,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}})
    return response.data
}

export const removeProductTag = async (id: number, request: ProductTagRemoveRequest): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await productApi.patch(`/Product/${id}/tag`, request);
    return response.data
}

export const addTagToProduct = async (id: number, request: ProductTagToAddRequest): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await productApi.post(`/Product/${id}/tag`, request)
    return response.data
}

export const getProductById = async (id: number): Promise<ProductByIdResponse> => {
    const response: AxiosResponse<ProductByIdResponse> = await productApi.get(`/Product/${id}`)
    return response.data
}

export const getAllProduct = async (cursor: number, pageSize: number): Promise<ProductListingResponse> => {
    const response: AxiosResponse<ProductListingResponse> = await productApi.get(`/Product?cursor=${cursor}&pageSize=${pageSize}`);
    return response.data
}

export const getBestSellingProduct = async (cursor: number, pageSize: number): Promise<PaginatedProductResponse> => {
    const response: AxiosResponse<PaginatedProductResponse> = await productApi.get('/Product/best-selling', {
        params: { cursor, pageSize }
    });
    return response.data;
}
export const getNewArrival = async (cursor: number, pageSize: number): Promise<PaginatedProductResponse> => {
    const response: AxiosResponse<PaginatedProductResponse> = await productApi.get('/Product/new-arrival', {
        params: { cursor, pageSize }
    });
    return response.data;
}
export const getFilteredProduct = async (filterRequest: ProductFilterRequest, cursor: number, pageSize: number): Promise<PaginatedProductResponse> => {
    const response: AxiosResponse<PaginatedProductResponse> = await productApi.get('/Product/filter', {
        params: {
            ...filterRequest,
            cursor,
            pageSize
        }
    });
    return response.data;
}