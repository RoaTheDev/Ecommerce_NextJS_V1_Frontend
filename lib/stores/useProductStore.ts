import {create} from "zustand";
import {ProductByIdResponse} from "@/lib/types/productTypes";
import {createJSONStorage, persist} from "zustand/middleware";

interface ProductState {
    selectedProduct: ProductByIdResponse | null;
    pagination: {
        cursor: number;
        pageSize: number;
    };
    searchTerms: { term: string, products: ProductByIdResponse[] }[];
    setSelectedProduct: (product: ProductByIdResponse) => void;
    clearSelectedProduct: () => void;
    setPagination: (cursor: number, pageSize: number) => void;
    addSearchTerm: (term: string, products: ProductByIdResponse[]) => void;
    clearSearch: () => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            selectedProduct: null,
            pagination: {
                cursor: 0,
                pageSize: 10,
            },
            searchTerms: [],
            setSelectedProduct: (product) => set({selectedProduct: product}),
            clearSelectedProduct: () => set({selectedProduct: null}),
            setPagination: (cursor, pageSize) =>
                set((state) => ({
                    pagination: {...state.pagination, cursor, pageSize},
                })),
            addSearchTerm: (term, products) => set((state) => {
                const existingTermIndex = state.searchTerms.findIndex(
                    (entry) => entry.term === term
                );

                const newSearchTerms = [...state.searchTerms];
                if (existingTermIndex !== -1) {
                    newSearchTerms[existingTermIndex] = {
                        term,
                        products: products,
                    };
                } else {
                    newSearchTerms.push({
                        term,
                        products,
                    });
                }

                return {searchTerms: newSearchTerms};
            }),
            clearSearch: () => set({searchTerms: []}),
        }),
        {
            name: "product-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedProduct: state.selectedProduct,
                pagination: state.pagination,
                searchTerms: state.searchTerms,
            }),
        }
    )
);
