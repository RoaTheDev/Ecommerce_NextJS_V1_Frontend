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

export interface PaginatedProduct extends ProductResponse {
    categoryName: string,
    imageUrls: string,
    createAt: string,
    tags: string[]
}

export interface ProductListingResponse {
    products: PaginatedProduct[],
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

export interface AppliedProductFilters {
    categoryId?: number;
    tagIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
    searchQuery?: string;
}

export enum SortOrder {
    Ascending = 'Ascending',
    Descending = 'Descending'
}

export interface ProductFilterRequest {
    categoryId?: number,
    tagIds?: number[],
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    sortBy?: SortByEnum,
    searchQuery?: string
}


export interface PaginatedProductResponse {
    products: PaginatedProduct[],
    nextCursor: number,
    pageSize: number,
    appliedFilters?: AppliedProductFilters
}

export enum SortByEnum {
    none = 'None',
    minPrice = 'MinPrice',
    maxPrice = 'MaxPrice',
    name = 'Name',
    date = 'Date',
    latest = 'Latest',
    bestSelling = 'BestSelling'
}

