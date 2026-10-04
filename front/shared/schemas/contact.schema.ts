import { z } from 'zod'

export const emailSchema = z.string().email()

export const newsletterSchema = z.object({
    email: emailSchema,
    token: z.string()
})

export const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: emailSchema,
    message: z.string().min(10).max(1000),
    newsletter: z.boolean().optional(),
    token: z.string()
})