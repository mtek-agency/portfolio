import { eq, and, desc } from 'drizzle-orm'
import { posts } from '~~/server/db/schema'
import type { PostUpdateInput } from '#shared/schemas/post.schema'

export async function findAllPosts() {
  return db.select().from(posts).orderBy(desc(posts.createdAt))
}

export async function findPublishedPosts() {
  return db.select().from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
}

export async function findPostBySlug(slug: string) {
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug))
  return post ?? null
}

export async function findPublishedPostBySlug(slug: string) {
  const [post] = await db.select().from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
  return post ?? null
}

export async function createPost(data: { title: string, slug: string }) {
  const [post] = await db.insert(posts).values({
    title: data.title,
    slug: data.slug,
    content: '',
    status: 'draft',
  }).returning()
  return post!
}

export async function updatePost(slug: string, data: PostUpdateInput) {
  const now = new Date()
  const current = await findPostBySlug(slug)
  const publishedAt = data.status === 'published'
    ? (current?.publishedAt ?? now)
    : null

  const [post] = await db.update(posts)
    .set({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? null,
      content: data.content,
      coverImage: data.coverImage ?? null,
      tags: data.tags ?? null,
      status: data.status,
      isFeatured: data.isFeatured,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.slug, slug))
    .returning()
  return post!
}

export async function deletePost(slug: string) {
  await db.delete(posts).where(eq(posts.slug, slug))
}

export async function togglePostPublished(slug: string) {
  const post = await findPostBySlug(slug)
  if (!post) throw new Error('Post not found')
  const newStatus = post.status === 'published' ? 'draft' : 'published'
  const [updated] = await db.update(posts)
    .set({
      status: newStatus,
      publishedAt: newStatus === 'published' ? (post.publishedAt ?? new Date()) : post.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.slug, slug))
    .returning()
  return updated!
}

export async function togglePostFeatured(slug: string) {
  const post = await findPostBySlug(slug)
  if (!post) throw new Error('Post not found')
  const [updated] = await db.update(posts)
    .set({ isFeatured: !post.isFeatured, updatedAt: new Date() })
    .where(eq(posts.slug, slug))
    .returning()
  return updated!
}
