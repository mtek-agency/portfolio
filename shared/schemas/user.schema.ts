import { z } from 'zod'

export const profileUpdateSchema = z.object({
    name: z.string().min(1, 'Nom requis').max(100),
    email: z.string().email('Email invalide'),
})

export const passwordUpdateSchema = z.object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(8, '8 caractères minimum'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>