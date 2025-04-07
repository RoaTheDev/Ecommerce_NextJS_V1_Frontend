import axios, {AxiosResponse} from "axios";
import {apiErrorHandler} from "@/lib/data/apiErrorHandler";
import {
    CategoryCreateRequest,
    CategoryCreateResponse,
    CategoryResponse,
    CategoryUpdateRequest,
    PaginatedCategoryResponse
} from "@/lib/types/categoryTypes";
import {ConfirmationResponse} from "@/lib/types/commonTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const categoryApi = axios.create({baseURL: API_URL, withCredentials: true});
apiErrorHandler(categoryApi)
const resourceName = 'Category'

export const getCategoryById = async (id: number): Promise<CategoryResponse> => {
    const response: AxiosResponse<CategoryResponse> = await categoryApi.get(`/${resourceName}/${id}`)
    return response.data
}

export const getCategoryByName = async (categoryName: string): Promise<CategoryResponse> => {
    const response: AxiosResponse<CategoryResponse> = await categoryApi.get(`/${resourceName}/search`, {
        params: {categoryName}
    })
    return response.data
}

export const getAllCategory = async (cursor: number, pageSize: number): Promise<PaginatedCategoryResponse> => {
    const response: AxiosResponse<PaginatedCategoryResponse> = await categoryApi.get(`/${resourceName}`, {
        params: {cursor, pageSize}
    })
    return response.data
}

export const createCategory = async (request: CategoryCreateRequest): Promise<CategoryCreateResponse> => {
    const response: AxiosResponse<CategoryCreateResponse> = await categoryApi.post(`/${resourceName}`, request)
    return response.data
}

export const updateCategory = async (id: number, request: CategoryUpdateRequest) => {
    const response: AxiosResponse<CategoryResponse> = await categoryApi.patch(`/${resourceName}/${id}`, request)
    return response.data
}

export const deleteCategory = async (categoryId: number, adminId: number): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await categoryApi.delete(`/${resourceName}/${categoryId}/${adminId}`)
    return response.data
}
