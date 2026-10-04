// Lectures de la partie publique de l'API, déjà converties pour les pages.
import type { H3Event } from 'h3'
import type { Parcours, Post, ProjectWithImages, PublicProject, Tool } from '#shared/types/studio'
import { studioFetch } from './client'
import type { Envelope } from './client'
import { toParcours, toPost, toProjectWithImages, toPublicProject, toTool } from './mappers'
import type { ApiArticle, ApiArticleSummary, ApiExperience, ApiLink, ApiProject, ApiProjectSummary, ApiSitemap } from './types'

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
