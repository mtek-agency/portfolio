import { UserService } from './user.service'
import type { User } from '~~/server/db/schema'
import type { Auth } from '#shared/types/auth.type'

export const AuthService = {
    async validateUser(authData: Auth): Promise<User | null> {
        const user: User|undefined = await UserService.getUserWithEmail(authData.email)

        if (!user) return null

        const isValid: boolean = await verifyPassword(user.password, authData.password)

        if (!isValid) return null

        return user
    }
}