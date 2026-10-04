import type { H3Event } from 'h3'

// --- Client ---

export type Envelope<T> = { data: T }
type StudioRequest = { method?: 'GET' | 'POST', body?: unknown, headers?: Record<string, string>, query?: Record<string, string | number> }

/**
 * Appelle la partie publique du site : /api/v1/sites/<site>/public<path>.
 * Le visiteur est relayé (IP, User-Agent) : l'API s'en sert pour limiter les envois et ignorer les robots.
 * Les erreurs de l'API sont converties ; aucun détail interne n'est renvoyé au navigateur.
 */
export async function studioFetch<T>(event: H3Event, path: string, req: StudioRequest = {}): Promise<T> {
  const { apiUrl, site } = useRuntimeConfig(event).studio
  const headers: Record<string, string> = { ...req.headers }
  const ip = getRequestIP(event, { xForwardedFor: true })
  if (ip) headers['X-Forwarded-For'] = ip
  const ua = getRequestHeader(event, 'user-agent')
  if (ua) headers['User-Agent'] = ua

  try {
    return await $fetch<T>(`${apiUrl}/api/v1/sites/${encodeURIComponent(site)}/public${path}`, {
      method: req.method ?? 'GET',
      body: req.body as Record<string, unknown> | undefined,
      query: req.query,
      headers,
      timeout: 8000,
      retry: 0,
    })
  }
  catch (e) {
    const status = (e as { statusCode?: number }).statusCode
    if (status && [400, 403, 404, 422, 429].includes(status)) {
      throw createError({ statusCode: status, statusMessage: status === 404 ? 'Introuvable' : 'Requête refusée' })
    }
    console.error('[studio] API call failed', path, status ?? (e as Error).message)
    throw createError({ statusCode: 502, statusMessage: 'Service momentanément indisponible' })
  }
}
