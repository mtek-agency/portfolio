export interface BrevoSender {
    name: string
    email: string
}

export interface BrevoRecipient {
    email: string
    name?: string
}

export type TemplateParam = string | number | boolean | null | undefined

export interface SendTemplateEmailParams {
    to: string | string[]
    templateId: number
    params?: Record<string, TemplateParam>
    sender?: BrevoSender
    replyTo?: BrevoSender
}

export interface AddContactParams {
    email: string
    attributes?: Record<string, TemplateParam>
    listIds?: number[]
}

export interface ContactEmailParams {
    name: string
    email: string
    message: string
    newsletter?: boolean
}

export interface WelcomeEmailParams {
    email: string
    name?: string
}

export interface NewsletterSubscribeParams {
    email: string
    name?: string
    newsletter?: boolean
}

export interface ApiResponse {
    success: boolean
}

export interface NewsletterSubscribe {
    email: string
}