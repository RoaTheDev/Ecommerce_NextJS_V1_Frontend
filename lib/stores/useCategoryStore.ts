import { create } from 'zustand';
import {
    CategoryCreateResponse,
    CategoryUpdateRequest
} from '@/lib/types/categoryTypes';
import { ProblemDetails } from '@/lib/types/commonTypes';
import { AxiosError } from 'axios';

interface CategoryState {
    categories: CategoryCreateResponse[];
    selectedCategory: CategoryCreateResponse | null;
    paginationInfo: {
        cursor: number;
        pageSize: number;
    };
    loading: boolean;
    error: AxiosError<ProblemDetails> | null;

    // Setters
    setCategories: (categoriesData: CategoryCreateResponse[]) => void;
    setSelectedCategory: (category: CategoryCreateResponse | null) => void;
    setPaginationInfo: (info: { cursor: number, pageSize: number }) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: AxiosError<ProblemDetails> | null) => void;

    // Actions
    addCategory: (category: CategoryCreateResponse) => void;
    updateCategory: (categoryId: number, updatedCategory: CategoryUpdateRequest) => void;
    removeCategory: (categoryId: number) => void;
    toggleCategoryStatus: (categoryId: number, isActive: boolean) => void;
    reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    selectedCategory: null,
    paginationInfo: {
        cursor: 0,
        pageSize: 10,
    },
    loading: false,
    error: null,

    // Setters
    setCategories: (categoriesData) =>
        set((state) => ({
            ...state,
            categories: categoriesData,
            loading: false,
            error: null,
        })),

    setSelectedCategory: (category) =>
        set((state) => ({
            ...state,
            selectedCategory: category,
            loading: false,
            error: null,
        })),

    setPaginationInfo: (info) =>
        set((state) => ({
            ...state,
            paginationInfo: info,
        })),

    setLoading: (loading) =>
        set((state) => ({
            ...state,
            loading,
        })),

    setError: (error) =>
        set((state) => ({
            ...state,
            error,
            loading: false,
        })),

    // Actions
    addCategory: (category) =>
        set((state) => ({
            ...state,
            categories: [...state.categories, category],
            loading: false,
            error: null,
        })),

    updateCategory: (categoryId, updatedCategory) =>
        set((state) => ({
            ...state,
            categories: state.categories.map((cat) =>
                cat.categoryId === categoryId
                    ? { ...cat, ...updatedCategory }
                    : cat
            ),
            selectedCategory:
                state.selectedCategory?.categoryId === categoryId
                    ? { ...state.selectedCategory, ...updatedCategory }
                    : state.selectedCategory,
            loading: false,
            error: null,
        })),

    removeCategory: (categoryId) =>
        set((state) => ({
            ...state,
            categories: state.categories.filter((cat) => cat.categoryId !== categoryId),
            selectedCategory:
                state.selectedCategory?.categoryId === categoryId
                    ? null
                    : state.selectedCategory,
            loading: false,
            error: null,
        })),

    toggleCategoryStatus: (categoryId, isActive) =>
        set((state) => ({
            ...state,
            categories: state.categories.map((cat) =>
                cat.categoryId === categoryId
                    ? { ...cat, isActive }
                    : cat
            ),
            selectedCategory:
                state.selectedCategory?.categoryId === categoryId
                    ? { ...state.selectedCategory, isActive }
                    : state.selectedCategory,
            loading: false,
            error: null,
        })),

    reset: () =>
        set({
            categories: [],
            selectedCategory: null,
            paginationInfo: {
                cursor: 0,
                pageSize: 10,
            },
            loading: false,
            error: null,
        }),
}));