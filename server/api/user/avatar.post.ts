import { blob } from 'hub:blob'
import { UserService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const formData = await readMultipartFormData(event)
    const file = formData?.find(f => f.name === 'avatar')

    if (!file?.data) throw createError({ statusCode: 400, statusMessage: 'Fichier requis' })

    const extension = file.filename?.split('.').pop() || 'png'
    const filename = `avatars/${session.user.id}-${Date.now()}.${extension}`

    const blobResult = await blob.put(filename, file.data, { contentType: file.type })

    const user = await UserService.updateAvatar(session.user.id, blobResult.pathname)
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    const { password: _, ...userWithoutPassword } = user
    await setUserSession(event, { user: userWithoutPassword, loggedInAt: session.loggedInAt })

    return { avatar: blobResult.pathname }
})