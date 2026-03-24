import { UserService } from '~~/server/services/user.service'
import { profileUpdateSchema } from '#shared/schemas/user.schema'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readValidatedBody(event, (b) => profileUpdateSchema.parse(b))

    const user = await UserService.updateProfile(session.user.id, body)
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    const { password: _, ...userWithoutPassword } = user
    await setUserSession(event, { user: userWithoutPassword, loggedInAt: session.loggedInAt })

    return userWithoutPassword
})