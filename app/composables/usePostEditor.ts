import { onBeforeRouteLeave } from 'vue-router'
import type { Post } from '~~/server/db/schema'

export function usePostEditor(
  post: Ref<Post | null>,
  slug: Ref<string>,
  refresh: () => Promise<void>,
) {
  const toast = useAppToast()
  const saving = ref(false)
  const dirty = ref(false)

  const formState = reactive({
    title: post.value?.title ?? '',
    slug: post.value?.slug ?? '',
    excerpt: post.value?.excerpt ?? '',
    content: post.value?.content ?? '',
    coverImage: post.value?.coverImage ?? '',
    tags: post.value?.tags ?? '',
    status: (post.value?.status ?? 'draft') as 'draft' | 'published',
    isFeatured: post.value?.isFeatured ?? false,
  })

  watch(post, (val) => {
    if (!val) return
    formState.title = val.title
    formState.slug = val.slug
    formState.excerpt = val.excerpt ?? ''
    formState.content = val.content
    formState.coverImage = val.coverImage ?? ''
    formState.tags = val.tags ?? ''
    formState.status = val.status as 'draft' | 'published'
    formState.isFeatured = val.isFeatured
  })

  watch(() => formState.title, (val) => {
    dirty.value = true
    if (formState.slug === toSlug(post.value?.title ?? '')) {
      formState.slug = toSlug(val)
    }
  })

  watch(
    () => [formState.excerpt, formState.content, formState.coverImage, formState.tags, formState.status, formState.isFeatured, formState.slug],
    () => { dirty.value = true },
  )

  useKeyboardShortcut('s', save, { meta: true })

  async function save() {
    saving.value = true
    try {
      const updated = await $fetch<Post>(`/api/posts/${slug.value}`, {
        method: 'PUT',
        body: {
          title: formState.title,
          slug: formState.slug,
          excerpt: formState.excerpt || null,
          content: formState.content,
          coverImage: formState.coverImage || null,
          tags: formState.tags || null,
          status: formState.status,
          isFeatured: formState.isFeatured,
        },
      })
      dirty.value = false
      if (updated.slug !== slug.value) {
        await navigateTo(`/admin/blog/${updated.slug}`)
      }
      else {
        await refresh()
        toast.success('Article sauvegardé')
      }
    }
    catch (e: any) {
      toast.error('Erreur', e?.data?.message || "Impossible de sauvegarder l'article")
    }
    finally {
      saving.value = false
    }
  }

  async function toggleStatus() {
    formState.status = formState.status === 'published' ? 'draft' : 'published'
    await save()
  }

  async function toggleFeatured() {
    formState.isFeatured = !formState.isFeatured
    await save()
  }

  onBeforeRouteLeave(() => {
    if (dirty.value) {
      return window.confirm('Vous avez des modifications non sauvegardées. Quitter quand même ?')
    }
  })

  return { formState, dirty, saving, save, toggleStatus, toggleFeatured }
}
