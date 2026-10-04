// Formes renvoyées par l'API Studio (champs utilisés uniquement).

export type ApiMedia = { id: number, url: string }
export type ApiProjectSummary = { id: number, slug: string, name: string, description: string, year: number, tags: string[], cover: ApiMedia | null }
export type ApiProject = ApiProjectSummary & {
  stack: string[]
  website_url: string | null
  repository_url: string | null
  meta_title: string | null
  meta_description: string | null
  media: ApiMedia[]
}
export type ApiArticleSummary = {
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
export type ApiArticle = ApiArticleSummary & { content_html: string, meta_title: string | null, meta_description: string | null }
export type ApiLink = { id: number, name: string, url: string, icon: string | null, description: string | null, category: string, is_daily_driver: boolean }
export type ApiExperience = { id: number, role: string, place: string, period: string, description: string | null }
export type ApiSitemap = { projects: { slug: string, updated_at: string }[], articles: { slug: string, updated_at: string }[] }

