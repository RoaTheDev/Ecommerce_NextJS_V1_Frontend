import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {ConfirmationResponse, ProblemDetails} from "@/lib/types/commonTypes";
import {AxiosError} from "axios";
import {createTag, deleteTag, getAllTag, getTagById, updateTag} from "@/lib/data/tagApi";
import toast from "react-hot-toast";
import {AllTagResponse, CreateTagRequest, GetTagByIdResponse, UpdateTagRequest} from "@/lib/types/tagTypes";

export const tagQueryKeys = {
    base: ['tag'] as const,
    list: () => [...tagQueryKeys.base, 'list'] as const,
    paginatedList: (filters: { cursor: number | string, pageSize: number | string }) =>
        [...tagQueryKeys.list(), filters] as const,
    details: () => [...tagQueryKeys.base, 'detail'] as const,
    detail: (id: string | number) => [...tagQueryKeys.details(), id] as const
};

export const useDeleteTag = (id: string | number): UseMutationResult<ConfirmationResponse, AxiosError<ProblemDetails>, string | number> => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, AxiosError<ProblemDetails>, string | number>({
        mutationFn: (id: number | string) => deleteTag(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: tagQueryKeys.list()});
            await queryClient.invalidateQueries({queryKey: tagQueryKeys.detail(id)});
            toast.success('Tag deleted successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to delete tag';
            toast.error(message);
        },
    });
};

// useTag.ts

export const useUpdateTag = (id: string | number): UseMutationResult<ConfirmationResponse, AxiosError<ProblemDetails>, UpdateTagRequest> => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, AxiosError<ProblemDetails>, UpdateTagRequest>({
        mutationFn: (request) => updateTag(id, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: tagQueryKeys.list()});
            await queryClient.invalidateQueries({queryKey: tagQueryKeys.detail(id)});
            toast.success('Tag updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to update tag';
            toast.error(message);
        },
    });
};
export const useCreateTag = (): UseMutationResult<ConfirmationResponse, AxiosError<ProblemDetails>, CreateTagRequest> => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, AxiosError<ProblemDetails>, CreateTagRequest>({
        mutationFn: createTag,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: tagQueryKeys.list()});
            toast.success('Tag created successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to create tag';
            toast.error(message);
        },
    });
};
export const useAllTags = (filter: {
    cursor: number | string;
    pageSize: number | string
}): UseQueryResult<AllTagResponse, AxiosError<ProblemDetails>> => {
    return useQuery<AllTagResponse, AxiosError<ProblemDetails>>({
            queryKey: tagQueryKeys.paginatedList(filter),
            queryFn: () => getAllTag(filter.cursor, filter.pageSize),
        }
    );
};

export const useTagById = (id: string | number): UseQueryResult<GetTagByIdResponse, AxiosError<ProblemDetails>> => {
    return useQuery<GetTagByIdResponse, AxiosError<ProblemDetails>>({
        queryKey: tagQueryKeys.detail(id),
        queryFn: () => getTagById(id),
        enabled: !!id,
    });
};
