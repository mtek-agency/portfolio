import type { Post } from '~~/server/db/schema'

export function useBlogFilters(posts: Ref<Post[] | null>) {
  const search = ref('')
  const statusFilter = ref<'all' | 'published' | 'draft'>('all')
  const featuredFilter = ref<'all' | 'featured'>('all')

  const statusOptions = [
    { label: 'Tous les articles', value: 'all' },
    { label: 'Publiés', value: 'published' },
    { label: 'Brouillons', value: 'draft' },
  ]

  const featuredOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'À la une', value: 'featured' },
  ]

  const filteredPosts = computed(() => {
    let list = posts.value ?? []

    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q)
        || p.slug.toLowerCase().includes(q)
        || (p.tags ?? '').toLowerCase().includes(q),
      )
    }

    if (statusFilter.value !== 'all') list = list.filter(p => p.status === statusFilter.value)
    if (featuredFilter.value === 'featured') list = list.filter(p => p.isFeatured)

    return list
  })

  const publishedCount = computed(() => posts.value?.filter(p => p.status === 'published').length ?? 0)
  const draftCount = computed(() => posts.value?.filter(p => p.status === 'draft').length ?? 0)

  return { search, statusFilter, featuredFilter, statusOptions, featuredOptions, filteredPosts, publishedCount, draftCount }
}
