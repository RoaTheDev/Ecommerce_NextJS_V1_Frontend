interface ProductRequest {
    productName: string,
    description: string,
    price: number,
    quantity: number,
    discount: number,
    categoryId: number
}

export interface ProductCreateRequest extends ProductRequest {
    createBy: number,
    isAvailable?: boolean,
    tagIds: number[]
}

export interface ProductTagRemoveRequest {
    tagIds: number[]
}

export interface ProductUpdateRequest extends ProductRequest {
    updateBy: number
}

export interface ProductTagToAddRequest {
    tagsIds: number[]
}

// read

interface ProductResponse {
    productId: number,
    productName: string,
    description: string,
    price: number,
    quantity: number,
    discount: number,
}


export interface ProductByIdResponse extends ProductResponse {
    categoryName: string,
    imageUrls: string[],
    tags: string[]
}

export interface PaginatedProductResponse {
    products: ProductByIdResponse[],
    nextCursor: number,
    pageSize: number
}

export interface ProductCreateResponse extends ProductResponse {
    createBy: number,
    createAt: string,
    isAvailable: boolean
}

export interface ProductImageChangeResponse {
    productId: number,
    imageId: number,
    imageUrl: string
}

interface ImageResponse {
    imageId: number,
    imageUrl: string
}

export interface ProductImageResponse {
    productId: number,
    images: ImageResponse[]
}

export interface ProductStatusChange {
    productId: number,
    isAvailable: boolean
}

export interface ProductUpdateResponse extends ProductResponse {
    updateAt: string
}