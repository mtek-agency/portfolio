// Formes consommées par les pages publiques. L'adaptateur (server/utils/studio.ts) convertit
// les réponses de l'API Studio vers ces types : les pages et composants n'en dépendent pas.

export type PublicProject = {
  id: number
  name: string
  slug: string
  description: string
  year: string
  tags: string | null
  images: { id: number, url: string }[]
}

export type ProjectWithImages = PublicProject & {
  urlWebsite: string | null
  urlRepository: string | null
  stack: string | null
  metaTitle: string | null
  metaDescription: string | null
}

export type Post = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  tags: string | null
  isFeatured: boolean
  publishedAt: string | null
  updatedAt: string | null
  metaTitle: string | null
  metaDescription: string | null
  readingTime: number
}

export type Tool = {
  id: number
  name: string
  url: string
  icon: string | null
  description: string | null
  category: string
  isDailyDriver: boolean
}

export type Parcours = {
  id: number
  role: string
  place: string
  period: string
  description: string | null
}
