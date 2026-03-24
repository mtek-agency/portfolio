export type PublicProject = {
  id: number
  name: string
  slug: string
  description: string
  year: string
  tags: string | null
  images: { id: number; url: string }[]
}
