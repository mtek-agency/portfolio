import { db, schema } from 'hub:db'
import type { User } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export const UserService = {
    async createAdmin(email: string, password: string): Promise<User> {
        if (!email || !password) {
            throw new Error('Email et mot de passe requis')
        }
        const passwordHash = await hashPassword(password)
        const [admin] = await db
            .insert(schema.users)
            .values({
                name: 'Admin',
                email,
                password: passwordHash,
                avatar: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Admin'
            })
            .returning()

        return admin
    },
    async getUserWithEmail(email: string): Promise<User|undefined> {
        return await db.query.users.findFirst({
            where: eq(schema.users.email, email)
        })
    }
}