// import {useQuery, UseQueryResult} from "@tanstack/react-query";
// import {ProductByIdResponse} from "@/lib/types/productTypes";
// import {useProductStore} from "@/lib/stores/useProductStore";
// import {getProductById} from "@/lib/api/productApi";
//
// const queryKeys = {
//     base: ['product'] as const,
//     list: () => [...queryKeys.base, 'list'] as const,
//     paginatedList: (filters: { cursor: number, pageSize: number }) =>
//         [...queryKeys.list(), filters] as const,
//     details: () => [...queryKeys.base, 'detail'] as const,
//     detail: (id: number) => [...queryKeys.details(), id] as const
// }
//
// export function useProduct(id?: number): UseQueryResult<ProductByIdResponse, Error> {
//     const setSelectedProduct = useProductStore((state) => state.setSelectedProduct)
//     return useQuery({
//         queryKey: id ? queryKeys.detail(id) : [],
//         queryFn: () => {
//             if (!id)
//                 throw new Error("Product Id does not exist")
//             return getProductById(id)
//         },
//         enabled: Boolean(id),
//     })
// }
//
