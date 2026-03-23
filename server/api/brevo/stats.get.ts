import { useBrevo } from '~~/server/services/brevo.service'

export default defineEventHandler(async () => {
    const brevo = useBrevo()
    const totalContacts = await brevo.getContactsCount()
    return { totalContacts }
})