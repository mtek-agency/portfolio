import { AuthService } from '~~/server/services/auth.service'
import type { Auth } from '#shared/types/auth.type'
import {loginSchema} from "#shared/schemas/auth.schema";

export default defineEventHandler(async (event) => {
    const body: Auth = await readBody<Auth>(event)
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Validation failed",
            data: validationResult.error.message,
        })
    }

    const user = await AuthService.validateUser(validationResult.data)
    if (!user) {
        return createError({
            statusCode: 401,
            statusMessage: "Please check your email and password.",
        });
    }
    const { password: _, ...userWithoutPassword } = user
    await setUserSession(event, {
        user: userWithoutPassword,
        loggedInAt: new Date(),
    });
    return await getUserSession(event)
})
