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

export interface categoryResponse {
    categoryName: string,
    description: string
}

export interface CategoryCreateRequest extends categoryResponse {
    categoryId: number,
    createBy: number,
    isActive: boolean
}

export interface categoryListResponse extends categoryResponse {
    categoryId: number,
    isActive: boolean
}

