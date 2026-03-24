import type { Post } from '~~/server/db/schema'

export function usePostActions(posts: Ref<Post[] | null>) {
  const toast = useAppToast()

  async function togglePublished(post: Post) {
    try {
      const updated = await $fetch<Post>(`/api/posts/${post.slug}/toggle`, { method: 'PATCH' })
      if (posts.value) posts.value = posts.value.map(p => p.id === post.id ? updated : p)
    }
    catch {
      toast.error('Erreur', 'Impossible de modifier le statut')
    }
  }

  async function toggleFeatured(post: Post) {
    try {
      const updated = await $fetch<Post>(`/api/posts/${post.slug}/feature`, { method: 'PATCH' })
      if (posts.value) posts.value = posts.value.map(p => p.id === post.id ? updated : p)
    }
    catch {
      toast.error('Erreur', 'Impossible de modifier la mise en avant')
    }
  }

  async function deletePost(post: Post) {
    await $fetch(`/api/posts/${post.slug}`, { method: 'DELETE' })
    if (posts.value) posts.value = posts.value.filter(p => p.id !== post.id)
    toast.success('Article supprimé')
  }

  return { togglePublished, toggleFeatured, deletePost }
}
