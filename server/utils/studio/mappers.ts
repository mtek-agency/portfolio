// Conversions des réponses de l'API vers les types de shared/types/studio.ts.
import type { Parcours, Post, ProjectWithImages, PublicProject, Tool } from '#shared/types/studio'
import type { ApiArticle, ApiArticleSummary, ApiExperience, ApiLink, ApiProject, ApiProjectSummary } from './types'

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
