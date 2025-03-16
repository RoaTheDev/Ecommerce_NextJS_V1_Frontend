interface ProductRequest {
    productName: string,
    description: string,
    price: number,
    quantity: number,
    discount: number,
    categoryId: bigint
}

export interface ProductCreateRequest extends ProductRequest {
    createBy: bigint,
    isAvailable?: boolean,
    tagIds: bigint[]
}

export interface ProductTagRemoveRequest {
    tagIds: bigint[]
}

export interface ProductUpdateRequest extends ProductRequest {
    updateBy: bigint
}

export interface ProductTagToAddRequest {
    tagsIds: bigint[]
}

// read

interface ProductResponse {
    productId: bigint,
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
    createBy: bigint,
    createAt: string,
    isAvailable: boolean
}

export interface ProductImageChangeResponse {
    productId: bigint,
    imageId: bigint,
    imageUrl: string
}

interface ImageResponse {
    imageId: bigint,
    imageUrl: string
}

export interface ProductImageResponse {
    productId: bigint,
    images: ImageResponse[]
}

export interface ProductStatusChange {
    productId: bigint,
    isAvailable: boolean
}

export interface ProductUpdateResponse extends ProductResponse {
    updateAt: string
}