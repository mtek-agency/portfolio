import { UserService } from '~~/server/services/user.service'
import { passwordUpdateSchema } from '#shared/schemas/user.schema'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readValidatedBody(event, (b) => passwordUpdateSchema.parse(b))

    const user = await UserService.findById(session.user.id)
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    const isValid = await verifyPassword(user.password, body.currentPassword)
    if (!isValid) throw createError({ statusCode: 401, statusMessage: 'Mot de passe actuel incorrect' })

    const newHash = await hashPassword(body.newPassword)
    await UserService.updatePassword(user.id, newHash)

    return { success: true }
})