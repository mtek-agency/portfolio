import { UserService } from '~~/server/services/user.service'
import type { User } from '~~/server/db/schema'


export default defineNitroPlugin(async (): Promise<void> => {
    const config = useRuntimeConfig()
    const adminEmail: string = config.admin.email
    const adminPassword: string = config.admin.password

    const userExist: User|undefined = await UserService.getUserWithEmail(adminEmail)

    if (userExist) return

    if (adminEmail && adminPassword) {
        await UserService.createAdmin(adminEmail, adminPassword)
    }
})
