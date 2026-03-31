import { z } from 'zod'

export const parcoursCreateSchema = z.object({
    role: z.string().min(1, 'Rôle requis').max(100),
    place: z.string().min(1, 'Lieu requis').max(100),
    period: z.string().min(1, 'Période requise').max(50),
    description: z.string().max(300).optional().nullable(),
    isActive: z.boolean().default(true),
})

export const parcoursUpdateSchema = parcoursCreateSchema.partial()

export const parcoursReorderSchema = z.object({
    items: z.array(z.object({
        id: z.number(),
        order: z.number(),
    })).min(1),
})

export type ParcoursCreateInput = z.infer<typeof parcoursCreateSchema>
export type ParcoursUpdateInput = z.infer<typeof parcoursUpdateSchema>
export type ParcoursReorderInput = z.infer<typeof parcoursReorderSchema>
