import { create } from 'zustand';
import {
    AllTagResponse,
    GetTagByIdResponse,
    UpdateTagRequest
} from '@/lib/types/tagTypes';
import { ProblemDetails } from '@/lib/types/commonTypes';
import { AxiosError } from 'axios';

interface TagState {
    tags: AllTagResponse[];
    selectedTag: GetTagByIdResponse | null;
    paginationInfo: {
        cursor: number | string;
        pageSize: number | string;
    };
    loading: boolean;
    error: AxiosError<ProblemDetails> | null;

    // Setters
    setTags: (tags: AllTagResponse[]) => void;
    setSelectedTag: (tag: GetTagByIdResponse | null) => void;
    setPaginationInfo: (info: { cursor: number | string, pageSize: number | string }) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: AxiosError<ProblemDetails> | null) => void;

    // Actions
    addTag: (tag: AllTagResponse) => void;
    updateTag: (tagId: number | string, updatedTag: UpdateTagRequest) => void;
    removeTag: (tagId: number | string) => void;
    reset: () => void;
}

export const useTagStore = create<TagState>((set) => ({
    tags: [],
    selectedTag: null,
    paginationInfo: {
        cursor: 0,
        pageSize: 10,
    },
    loading: false,
    error: null,

    // Setters
    setTags: (tags) =>
        set((state) => ({
            ...state,
            tags,
            loading: false,
            error: null,
        })),

    setSelectedTag: (tag) =>
        set((state) => ({
            ...state,
            selectedTag: tag,
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
    addTag: (tag) =>
        set((state) => ({
            ...state,
            tags: [...state.tags, tag],
            loading: false,
            error: null,
        })),

    updateTag: (tagId, updatedTag) =>
        set((state) => ({
            ...state,
            tags: state.tags.map((t) =>
                t.tagId === tagId
                    ? { ...t, ...updatedTag }
                    : t
            ),
            selectedTag:
                state.selectedTag?.tagId === tagId
                    ? { ...state.selectedTag, ...updatedTag }
                    : state.selectedTag,
            loading: false,
            error: null,
        })),

    removeTag: (tagId) =>
        set((state) => ({
            ...state,
            tags: state.tags.filter((t) => t.tagId !== tagId),
            selectedTag:
                state.selectedTag?.tagId === tagId
                    ? null
                    : state.selectedTag,
            loading: false,
            error: null,
        })),

    reset: () =>
        set({
            tags: [],
            selectedTag: null,
            paginationInfo: {
                cursor: 0,
                pageSize: 10,
            },
            loading: false,
            error: null,
        }),
}));