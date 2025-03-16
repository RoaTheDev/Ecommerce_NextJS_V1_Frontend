import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {ProductByIdResponse} from "@/lib/types/productTypes";

interface ProductState {
    selectedProduct: ProductByIdResponse | null;
    setSelectedProduct: (product: ProductByIdResponse) => void;
    clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            selectedProduct: null,

            setSelectedProduct: (product) => set({selectedProduct: product}),

            clearSelectedProduct: () => set({selectedProduct: null}),
        }),
        {
            name: "product-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({selectedProduct: state.selectedProduct}), // Only persist selectedProduct
        }
    )
);
