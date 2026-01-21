import type { UserSessionRequired } from '#auth-utils'
import type { H3Event, EventHandlerRequest } from 'h3'

export async function requireAuthIfNeeded(event: H3Event<EventHandlerRequest>): Promise<UserSessionRequired | null> {
    if (event.method === 'GET') return null
    return await requireUserSession(event)
}
