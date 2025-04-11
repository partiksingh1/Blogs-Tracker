import {z} from 'zod'

export const SignupSchema = z.object({
    username:z.string().min(4).max(20),
    email:z.string().email(),
    password:z.string().min(6),
    picture:z.string().optional(),
    bio:z.string().max(200).optional()
})

export const LoginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6)
})