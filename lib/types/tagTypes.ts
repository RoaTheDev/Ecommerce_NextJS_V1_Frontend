export interface CreateTagRequest {
    tagName: string
}

export interface UpdateTagRequest {
    tagName: string
}

export interface AllTagResponse {
    tagId: number,
    tagName: string
}

export interface GetTagByIdResponse {
    tagId: number,
    tagName: string,
    isDeleted: boolean
}

