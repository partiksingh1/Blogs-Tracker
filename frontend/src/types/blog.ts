export interface Blog {
    id: string,
    title: string | null,
    url: string,
    isRead: boolean,
    createdAt: Date
    categories: {
        id: string,
        name: string
    }[]
    tags: {
        name: string
    }[]
}