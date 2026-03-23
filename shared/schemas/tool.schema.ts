import { z } from 'zod'
import { TOOL_CATEGORY_IDS } from '#shared/constants/tool'

export const toolCreateSchema = z.object({
    name: z.string().min(1, 'Nom requis').max(100),
    url: z.string().url('URL invalide'),
    icon: z.string().max(100).optional().nullable(),
    category: z.enum(TOOL_CATEGORY_IDS),
    isActive: z.boolean().default(true),
})

export const toolUpdateSchema = toolCreateSchema.partial()

export const toolReorderSchema = z.object({
    items: z.array(z.object({
        id: z.number(),
        category: z.enum(TOOL_CATEGORY_IDS),
        order: z.number(),
    })).min(1),
})

export type ToolCreateInput = z.infer<typeof toolCreateSchema>
export type ToolUpdateInput = z.infer<typeof toolUpdateSchema>
export type ToolReorderInput = z.infer<typeof toolReorderSchema>