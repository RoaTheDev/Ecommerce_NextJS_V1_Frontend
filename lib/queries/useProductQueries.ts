import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {
    ProductListingResponse,
    ProductByIdResponse,
    ProductCreateRequest,
    ProductCreateResponse,
    ProductImageChangeResponse,
    ProductImageResponse,
    ProductStatusChange,
    ProductTagRemoveRequest,
    ProductTagToAddRequest,
    ProductUpdateRequest,
    ProductUpdateResponse, ProductFilterRequest, PaginatedProductResponse
} from "@/lib/types/productTypes";
import {ConfirmationResponse} from "@/lib/types/commonTypes";
import {useProductStore} from "@/lib/stores/useProductStore";
import {
    addProductImage,
    addTagToProduct,
    changeProductImage,
    changeProductStatus,
    createProduct,
    deleteProductImage,
    getAllProduct, getBestSellingProduct, getFilteredProduct, getNewArrival,
    getProductById,
    removeProductTag,
    updateProduct
} from "@/lib/data/productApi";

// Query keys
export const queryKeys = {
    base: ['product'] as const,
    list: () => [...queryKeys.base, 'list'] as const,
    paginatedList: (filters: { cursor: number, pageSize: number }) =>
        [...queryKeys.list(), filters] as const,
    details: () => [...queryKeys.base, 'detail'] as const,
    detail: (id: number) => [...queryKeys.details(), id] as const,
    bestSelling: (filters: { cursor: number, pageSize: number }) =>
        [...queryKeys.base, 'best-selling', filters] as const,
    newArrival: (filters: { cursor: number, pageSize: number }) =>
        [...queryKeys.base, 'new-arrival', filters] as const,
    filtered: (filters: ProductFilterRequest & { cursor: number, pageSize: number }) =>
        [...queryKeys.base, 'filtered', filters] as const
};

// Get a single product by ID
export function useProduct(id?: number): UseQueryResult<ProductByIdResponse, Error> {
    const setSelectedProduct = useProductStore((state) => state.setSelectedProduct);

    return useQuery<ProductByIdResponse, Error>({
        queryKey: id ? queryKeys.detail(id) : [],
        queryFn: async (): Promise<ProductByIdResponse> => {
            if (!id) throw new Error("Product Id does not exist");
            const product = await getProductById(id);
            setSelectedProduct(product);
            return product;
        },
        enabled: Boolean(id),
    });
}

// Get all products with pagination
export function useProducts(cursor: number, pageSize: number): UseQueryResult<ProductListingResponse, Error> {
    const setPagination = useProductStore((state) => state.setPagination);

    return useQuery<ProductListingResponse, Error>({
        queryKey: queryKeys.paginatedList({cursor, pageSize}),
        queryFn: async (): Promise<ProductListingResponse> => {
            const data = await getAllProduct(cursor, pageSize);
            setPagination(data.nextCursor, data.pageSize); // Move side effect here
            return data;
        },
        placeholderData: (previousData) => previousData
    });
}

// Create a new product
export function useCreateProduct(): UseMutationResult<ProductCreateResponse, Error, ProductCreateRequest> {
    const queryClient = useQueryClient();

    return useMutation<ProductCreateResponse, Error, ProductCreateRequest>({
        mutationFn: async (productData: ProductCreateRequest): Promise<ProductCreateResponse> => {
            return await createProduct(productData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.list()});
        }
    });
}

// Update an existing product
export function useUpdateProduct(id: number): UseMutationResult<ProductUpdateResponse, Error, ProductUpdateRequest> {
    const queryClient = useQueryClient();

    return useMutation<ProductUpdateResponse, Error, ProductUpdateRequest>({
        mutationFn: async (productData: ProductUpdateRequest): Promise<ProductUpdateResponse> => {
            return await updateProduct(id, productData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(id)});
            await queryClient.invalidateQueries({queryKey: queryKeys.list()});
        }
    });
}

// Change product status (available/unavailable)
export function useChangeProductStatus(): UseMutationResult<ProductStatusChange, Error, number> {
    const queryClient = useQueryClient();

    return useMutation<ProductStatusChange, Error, number>({
        mutationFn: async (id: number): Promise<ProductStatusChange> => {
            return await changeProductStatus(id);
        },
        onSuccess: async (data: ProductStatusChange) => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(data.productId)});
            await queryClient.invalidateQueries({queryKey: queryKeys.list()});
        }
    });
}

// Add images to a product
export function useAddProductImage(productId: number): UseMutationResult<ProductImageResponse, Error, File[]> {
    const queryClient = useQueryClient();

    return useMutation<ProductImageResponse, Error, File[]>({
        mutationFn: async (files: File[]): Promise<ProductImageResponse> => {
            return await addProductImage(productId, files);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(productId)});
        }
    });
}

// Change a product image
export function useChangeProductImage(productId: number): UseMutationResult<ProductImageChangeResponse, Error, {
    imageId: number;
    file: File
}> {
    const queryClient = useQueryClient();

    return useMutation<ProductImageChangeResponse, Error, { imageId: number; file: File }>({
        mutationFn: async ({imageId, file}: { imageId: number; file: File }): Promise<ProductImageChangeResponse> => {
            return await changeProductImage(productId, imageId, file);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(productId)});
        }
    });
}

// Delete a product image
export function useDeleteProductImage(productId: number): UseMutationResult<ConfirmationResponse, Error, number> {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, Error, number>({
        mutationFn: async (imageId: number): Promise<ConfirmationResponse> => {
            return await deleteProductImage(productId, imageId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(productId)});
        }
    });
}

// Add tags to a product
export function useAddProductTag(productId: number): UseMutationResult<ConfirmationResponse, Error, ProductTagToAddRequest> {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, Error, ProductTagToAddRequest>({
        mutationFn: async (tagData: ProductTagToAddRequest): Promise<ConfirmationResponse> => {
            return await addTagToProduct(productId, tagData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(productId)});
        }
    });
}

// Remove tags from a product
export function useRemoveProductTag(productId: number): UseMutationResult<ConfirmationResponse, Error, ProductTagRemoveRequest> {
    const queryClient = useQueryClient();

    return useMutation<ConfirmationResponse, Error, ProductTagRemoveRequest>({
        mutationFn: async (tagData: ProductTagRemoveRequest): Promise<ConfirmationResponse> => {
            return await removeProductTag(productId, tagData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: queryKeys.detail(productId)});
        }
    });
}

export function useBestSellingProducts(cursor: number, pageSize: number): UseQueryResult<PaginatedProductResponse, Error> {
    const setPagination = useProductStore((state) => state.setPagination);

    return useQuery<PaginatedProductResponse, Error>({
        queryKey: queryKeys.bestSelling({ cursor, pageSize }),
        queryFn: async (): Promise<PaginatedProductResponse> => {
            const data = await getBestSellingProduct(cursor, pageSize);
            setPagination(data.nextCursor, data.pageSize);
            return data;
        },
        placeholderData: (previousData) => previousData
    });
}

export function useNewArrivalProducts(cursor: number, pageSize: number): UseQueryResult<PaginatedProductResponse, Error> {
    const setPagination = useProductStore((state) => state.setPagination);

    return useQuery<PaginatedProductResponse, Error>({
        queryKey: queryKeys.newArrival({ cursor, pageSize }),
        queryFn: async (): Promise<PaginatedProductResponse> => {
            const data = await getNewArrival(cursor, pageSize);
            setPagination(data.nextCursor, data.pageSize);
            return data;
        },
        placeholderData: (previousData) => previousData
    });
}
export function useFilteredProducts(
    filterRequest: ProductFilterRequest,
    cursor: number,
    pageSize: number
): UseQueryResult<PaginatedProductResponse, Error> {
    const setPagination = useProductStore((state) => state.setPagination);
    const addSearchTerm = useProductStore((state) => state.addSearchTerm);

    return useQuery<PaginatedProductResponse, Error>({
        queryKey: queryKeys.filtered({ ...filterRequest, cursor, pageSize }),
        queryFn: async (): Promise<PaginatedProductResponse> => {
            const data = await getFilteredProduct(filterRequest, cursor, pageSize);
            setPagination(data.nextCursor, data.pageSize);

            if (filterRequest.searchQuery) {
                addSearchTerm(filterRequest.searchQuery, data.products);
            }

            return data;
        },
        placeholderData: (previousData) => previousData
    });
}