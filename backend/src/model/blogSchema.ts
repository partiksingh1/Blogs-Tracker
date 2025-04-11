import {z} from 'zod'

export const BlogSchema = z.object({
    userId : z.number(),
    url:z.string().min(8),
    title:z.string().min(3),
    isRead:z.boolean(),
    note:z.string().optional(),
    categoryName:z.string().optional()
})