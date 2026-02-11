export interface Blog {
    id: string,
    title: string | null,
    url: string,
    isRead: boolean,
    createdAt: string
    category: {
        id: string,
        name: string
    }
    tags: {
        id: string
        name: string
    }[],
    categoryId?: string
}