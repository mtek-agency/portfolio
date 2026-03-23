import { AuthService } from '~~/server/services/auth.service'
import { loginSchema } from '#shared/schemas/auth.schema'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (b) => loginSchema.parse(b))

    const user = await AuthService.validateUser(body)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password',
        })
    }

    const { password: _, ...userWithoutPassword } = user
    await setUserSession(event, {
        user: userWithoutPassword,
        loggedInAt: new Date(),
    })
    return getUserSession(event)
})
