import axios, {AxiosResponse} from "axios";
import {apiErrorHandler} from "@/lib/data/apiErrorHandler";
import {AllTagResponse, CreateTagRequest, GetTagByIdResponse, UpdateTagRequest} from "@/lib/types/tagTypes";
import {ConfirmationResponse} from "@/lib/types/commonTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const tagApi = axios.create({baseURL: API_URL, withCredentials: true});
apiErrorHandler(tagApi)

export const getAllTag = async (cursor: number | string, pageSize: number | string): Promise<AllTagResponse> => {
    const response: AxiosResponse<AllTagResponse> = await tagApi.get('/Tag', {
        params: {cursor, pageSize}
    })
    return response.data;
}

export const getTagById = async (id: string | number): Promise<GetTagByIdResponse> => {
    const response: AxiosResponse<GetTagByIdResponse> = await tagApi.get(`/Tag/${id}`)
    return response.data;
}

export const createTag = async (request: CreateTagRequest): Promise<ConfirmationResponse> => {
    const response: AxiosResponse<ConfirmationResponse> = await tagApi.post(`/Tag`, request)
    return response.data
}

export const updateTag = async (id: string | number, request: UpdateTagRequest) => {
    const response: AxiosResponse<ConfirmationResponse> = await tagApi.patch(`/Tag/${id}`, request)
    return response.data;
}

export const deleteTag = async (id:string | number ) => {
    const response: AxiosResponse<ConfirmationResponse> = await tagApi.delete(`/Tag/${id}`)
    return response.data
}
