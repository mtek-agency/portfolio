// Adaptateur vers l'API Studio : un client minimal et les conversions vers les types de
// shared/types/studio.ts. Seule la lecture publique et les formulaires visiteurs passent ici.
import type { H3Event } from 'h3'
import type { Parcours, Post, ProjectWithImages, PublicProject, Tool } from '#shared/types/studio'

// --- Formes renvoyées par l'API (champs utilisés uniquement) ---

type ApiMedia = { id: number, url: string }
type ApiProjectSummary = { id: number, slug: string, name: string, description: string, year: number, tags: string[], cover: ApiMedia | null }
type ApiProject = ApiProjectSummary & {
  stack: string[]
  website_url: string | null
  repository_url: string | null
  meta_title: string | null
  meta_description: string | null
  media: ApiMedia[]
}
type ApiArticleSummary = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  cover: ApiMedia | null
  tags: string[]
  is_featured: boolean
  published_at: string
  reading_time_minutes: number
}
type ApiArticle = ApiArticleSummary & { content_html: string, meta_title: string | null, meta_description: string | null }
type ApiLink = { id: number, name: string, url: string, icon: string | null, description: string | null, category: string, is_daily_driver: boolean }
type ApiExperience = { id: number, role: string, place: string, period: string, description: string | null }
type ApiSitemap = { projects: { slug: string, updated_at: string }[], articles: { slug: string, updated_at: string }[] }

// --- Client ---

type Envelope<T> = { data: T }
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

// --- Conversions ---

const join = (values: string[]) => (values.length ? values.join(', ') : null)

export function toPublicProject(p: ApiProjectSummary): PublicProject {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    year: String(p.year),
    tags: join(p.tags),
    images: p.cover ? [{ id: p.cover.id, url: p.cover.url }] : [],
  }
}

export function toProjectWithImages(p: ApiProject): ProjectWithImages {
  return {
    ...toPublicProject(p),
    images: p.media.map(m => ({ id: m.id, url: m.url })),
    urlWebsite: p.website_url,
    urlRepository: p.repository_url,
    stack: join(p.stack),
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
  }
}

export function toPost(a: ApiArticleSummary & Partial<ApiArticle>): Post {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content_html ?? '',
    coverImage: a.cover?.url ?? null,
    tags: join(a.tags),
    isFeatured: a.is_featured,
    publishedAt: a.published_at,
    updatedAt: null,
    metaTitle: a.meta_title ?? null,
    metaDescription: a.meta_description ?? null,
    readingTime: a.reading_time_minutes,
  }
}

export function toTool(l: ApiLink): Tool {
  return { id: l.id, name: l.name, url: l.url, icon: l.icon, description: l.description, category: l.category, isDailyDriver: l.is_daily_driver }
}

export function toParcours(e: ApiExperience): Parcours {
  return { id: e.id, role: e.role, place: e.place, period: e.period, description: e.description }
}

// --- Lectures ---

export async function fetchProjects(event: H3Event): Promise<PublicProject[]> {
  const { data } = await studioFetch<Envelope<ApiProjectSummary[]>>(event, '/projects')
  return data.map(toPublicProject)
}

export async function fetchProject(event: H3Event, slug: string): Promise<ProjectWithImages> {
  const { data } = await studioFetch<Envelope<ApiProject>>(event, `/projects/${encodeURIComponent(slug)}`)
  return toProjectWithImages(data)
}

// Le portfolio publie peu d'articles : une page de 100 suffit (maximum de l'API).
export async function fetchPosts(event: H3Event): Promise<Post[]> {
  const { data } = await studioFetch<Envelope<ApiArticleSummary[]>>(event, '/articles', { query: { per_page: 100 } })
  return data.map(toPost)
}

export async function fetchPost(event: H3Event, slug: string): Promise<Post> {
  const { data } = await studioFetch<Envelope<ApiArticle>>(event, `/articles/${encodeURIComponent(slug)}`)
  return toPost(data)
}

export async function fetchTools(event: H3Event): Promise<Tool[]> {
  const { data } = await studioFetch<Envelope<ApiLink[]>>(event, '/links')
  return data.map(toTool)
}

export async function fetchParcours(event: H3Event): Promise<Parcours[]> {
  const { data } = await studioFetch<Envelope<ApiExperience[]>>(event, '/experiences')
  return data.map(toParcours)
}

export async function fetchSitemap(event: H3Event): Promise<ApiSitemap> {
  const { data } = await studioFetch<Envelope<ApiSitemap>>(event, '/sitemap')
  return data
}
