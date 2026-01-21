export interface Blog {
    id: string,
    title: string | null,
    url: string,
    isRead: boolean,
    createdAt: string
    categories: {
        id: string,
        name: string
    }
    tags: {
        id: string
        name: string
    }[]
}