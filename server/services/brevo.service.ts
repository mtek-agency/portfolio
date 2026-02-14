import * as brevo from '@getbrevo/brevo'
import type { AddContactParams, SendTemplateEmailParams } from '#shared/types/brevo.type'

class BrevoService {
    private static instance: BrevoService
    private transactionalApi: brevo.TransactionalEmailsApi
    private contactsApi: brevo.ContactsApi
    private config

    private constructor() {
        this.config = useRuntimeConfig()

        // API emails transactionnels
        this.transactionalApi = new brevo.TransactionalEmailsApi()
        this.transactionalApi.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            this.config.brevo.apiKey
        )

        // API contacts
        this.contactsApi = new brevo.ContactsApi()
        this.contactsApi.setApiKey(
            brevo.ContactsApiApiKeys.apiKey,
            this.config.brevo.apiKey
        )
    }

    static getInstance(): BrevoService {
        if (!BrevoService.instance) {
            BrevoService.instance = new BrevoService()
        }
        return BrevoService.instance
    }

    async sendTemplateEmail({ to, templateId, params, sender, replyTo}: SendTemplateEmailParams): Promise<void> {
        const sendSmtpEmail = new brevo.SendSmtpEmail()
        sendSmtpEmail.templateId = templateId
        sendSmtpEmail.sender = sender || {
            name: 'Mattéo Bonneval',
            email: this.config.brevo.senderEmail
        }
        sendSmtpEmail.to = Array.isArray(to)
            ? to.map(email => ({ email }))
            : [{ email: to }]
        if (!replyTo) {
            replyTo = {
                name: 'Mattéo Bonneval',
                email: this.config.brevo.contactEmail
            }
        }
        sendSmtpEmail.replyTo = replyTo
        if (params) {
            sendSmtpEmail.params = params
        }

        await this.transactionalApi.sendTransacEmail(sendSmtpEmail)
    }

    async addContact({ email, attributes, listIds}: AddContactParams): Promise<void> {
        const createContact = new brevo.CreateContact()
        createContact.email = email
        createContact.updateEnabled = true

        if (attributes) {
            createContact.attributes = attributes
        }

        if (listIds) {
            createContact.listIds = listIds
        }

        await this.contactsApi.createContact(createContact)
    }
}

export const useBrevo = () => BrevoService.getInstance()