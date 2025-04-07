import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query';
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategoryById,
    getCategoryByName,
    updateCategory
} from "@/lib/data/categoryApi";
import {
    CategoryCreateRequest,
    CategoryCreateResponse,
    CategoryResponse,
    CategoryUpdateRequest,
    PaginatedCategoryResponse,
} from "@/lib/types/categoryTypes";
import {AxiosError} from 'axios';
import {ConfirmationResponse, ProblemDetails} from '@/lib/types/commonTypes';
import toast from 'react-hot-toast';

export const categoryQueryKeys = {
    base: ['category'] as const,
    list: () => [...categoryQueryKeys.base, 'list'] as const,
    paginatedList: (filters: { cursor: number, pageSize: number }) =>
        [...categoryQueryKeys.list(), filters] as const,
    details: () => [...categoryQueryKeys.base, 'detail'] as const,
    detail: (id: number) => [...categoryQueryKeys.details(), id] as const,
    searchByName: (categoryName: string) =>
        [...categoryQueryKeys.base, 'search', categoryName] as const
};


export const useCategoryById = (categoryId: number): UseQueryResult<CategoryResponse, AxiosError<ProblemDetails>> => {
    return useQuery<CategoryResponse, AxiosError<ProblemDetails>>({
        queryKey: categoryQueryKeys.detail(categoryId),
        queryFn: () => getCategoryById(categoryId),
        enabled: !!categoryId,
    });
};

export const useCategoryByName = (categoryName: string): UseQueryResult<CategoryResponse, AxiosError<ProblemDetails>> => {
    return useQuery<CategoryResponse, AxiosError<ProblemDetails>>({
        queryKey: categoryQueryKeys.searchByName(categoryName),
        queryFn: () => getCategoryByName(categoryName),
        enabled: !!categoryName,
    });
};

export const useAllCategories = (filter: {
    cursor: number;
    pageSize: number
}): UseQueryResult<PaginatedCategoryResponse, AxiosError<ProblemDetails>> => {
    return useQuery<PaginatedCategoryResponse, AxiosError<ProblemDetails>>({
        queryKey: categoryQueryKeys.paginatedList(filter),
        queryFn: () => getAllCategory(filter.cursor, filter.pageSize),
    });
};

export const useCreateCategory = (): UseMutationResult<CategoryCreateResponse, AxiosError<ProblemDetails>, CategoryCreateRequest> => {
    const queryClient = useQueryClient();

    return useMutation<CategoryCreateResponse, AxiosError<ProblemDetails>, CategoryCreateRequest>({
        mutationFn: (request) => createCategory(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: categoryQueryKeys.list()});
            toast.success('Category created successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to create category';
            toast.error(message);
        },
    });
};

export const useUpdateCategory = (categoryId: number): UseMutationResult<CategoryResponse, AxiosError<ProblemDetails>, CategoryUpdateRequest> => {
    const queryClient = useQueryClient();

    return useMutation<CategoryResponse, AxiosError<ProblemDetails>, CategoryUpdateRequest>({
        mutationFn: (request) => updateCategory(categoryId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: categoryQueryKeys.list()});
            await queryClient.invalidateQueries({queryKey: categoryQueryKeys.detail(categoryId)});
            toast.success('Category updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to update category';
            toast.error(message);
        },
    });
};

export const useDeleteCategory = (categoryId: number): UseMutationResult<ConfirmationResponse, AxiosError<ProblemDetails>, number> => {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, AxiosError<ProblemDetails>, number>({
        mutationFn: (adminId) => deleteCategory(categoryId, adminId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: categoryQueryKeys.list()});
            await queryClient.invalidateQueries({queryKey: categoryQueryKeys.detail(categoryId)});
            toast.success('Category deleted successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.detail || 'Failed to delete category';
            toast.error(message);
        },
    });
};
