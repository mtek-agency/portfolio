import type { H3Event } from 'h3'

export function getValidatedSlug(event: H3Event): string {
    const slug = getRouterParam(event, 'slug')
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Slug is required',
        })
    }
    return slug
}

export function getValidatedId(event: H3Event): number {
    const id = getRouterParam(event, 'id')
    if (!id || isNaN(Number(id))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid ID is required',
        })
    }
    return Number(id)
}
