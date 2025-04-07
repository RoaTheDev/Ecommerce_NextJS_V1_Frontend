export interface CategoryCreateRequest {
    categoryName: string,
    description: string,
    createBy: number
}

export interface CategoryStatusChangeRequest {
    categoryId: number,
    adminId: number
}

export interface CategoryUpdateRequest {
    categoryName: string,
    description: string,
    updateBy: number
}

export interface CategoryResponse {
    categoryName: string,
    description: string
}

export interface CategoryCreateResponse extends CategoryResponse {
    categoryId: number,
    createBy: number,
    isActive: boolean
}

interface CategoryListResponse extends CategoryResponse {
    categoryId: number,
    isActive: boolean
}

export interface PaginatedCategoryResponse {
    categories: CategoryListResponse,
    cursor: number,
    pageSize: number
}