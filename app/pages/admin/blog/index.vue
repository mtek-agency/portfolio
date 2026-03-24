<script setup lang="ts">
import type { Post } from '~~/server/db/schema'
import { postCreateSchema } from '#shared/schemas/post.schema'
import type { PostCreateInput } from '#shared/schemas/post.schema'
import type { FormSubmitEvent } from '#ui/types'
import type { TableColumn } from '#ui/components/Table.vue'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const toast = useAppToast()
const deleteConfirm = useDeleteConfirm<Post>()

const { data: posts, status } = useFetch<Post[]>('/api/posts', { key: 'posts' })

const { search, statusFilter, featuredFilter, statusOptions, featuredOptions, filteredPosts, publishedCount, draftCount } = useBlogFilters(posts)
const { togglePublished, toggleFeatured, deletePost } = usePostActions(posts)

// Create
const createOpen = ref(false)
const creating = ref(false)
const createState = reactive<PostCreateInput>({ title: '', slug: '' })

watch(() => createState.title, val => { createState.slug = toSlug(val) })

async function onCreate(event: FormSubmitEvent<PostCreateInput>) {
  creating.value = true
  try {
    const post = await $fetch<Post>('/api/posts', { method: 'POST', body: event.data })
    createOpen.value = false
    createState.title = ''
    createState.slug = ''
    await navigateTo(`/admin/blog/${post.slug}`)
  }
  catch (e: any) {
    toast.error('Erreur', e?.data?.message || "Impossible de créer l'article")
  }
  finally {
    creating.value = false
  }
}

const columns: TableColumn<Post>[] = [
  { accessorKey: 'title', header: 'Article', enableSorting: true },
  { accessorKey: 'status', header: 'Statut', enableSorting: true },
  { accessorKey: 'isFeatured', header: 'À la une' },
  { accessorKey: 'tags', header: 'Tags' },
  { accessorKey: 'publishedAt', header: 'Publié le', enableSorting: true },
  { accessorKey: 'id', id: 'actions' },
]
</script>

<template>
  <DashboardPanel title="Blog">
    <template #right>
      <UButton label="Nouvel article" icon="i-lucide-plus" @click="createOpen = true" />
    </template>

    <div class="flex flex-col gap-4 p-4 h-full">
      <!-- Stats -->
      <div class="flex items-center gap-4 text-sm text-muted">
        <span><span class="font-semibold text-default">{{ publishedCount }}</span> publié{{ publishedCount !== 1 ? 's' : '' }}</span>
        <span class="text-default/20">·</span>
        <span><span class="font-semibold text-default">{{ draftCount }}</span> brouillon{{ draftCount !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-3">
        <UInput v-model="search" leading-icon="i-lucide-search" placeholder="Rechercher par titre, slug, tag…" class="max-w-sm" />
        <USelect v-model="statusFilter" :items="statusOptions" class="w-48" />
        <USelect v-model="featuredFilter" :items="featuredOptions" class="w-36" />
        <span class="ml-auto text-sm text-muted">
          {{ filteredPosts.length }} résultat{{ filteredPosts.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Table -->
      <UTable
        :data="filteredPosts"
        :columns="columns"
        :loading="status === 'pending'"
        class="w-full"
        :ui="{ tr: 'cursor-pointer hover:bg-elevated/50 transition-colors' }"
      >
        <template #actions-header>
          <div class="flex justify-end">Actions</div>
        </template>

        <template #title-cell="{ row }">
          <div class="flex flex-col gap-0.5 py-1" @click="navigateTo(`/admin/blog/${row.original.slug}`)">
            <span class="font-medium text-default">{{ row.original.title }}</span>
            <span class="text-xs text-muted font-mono">{{ row.original.slug }}</span>
          </div>
        </template>

        <template #status-cell="{ row }">
          <div @click="navigateTo(`/admin/blog/${row.original.slug}`)">
            <UBadge
              :label="row.original.status === 'published' ? 'Publié' : 'Brouillon'"
              :color="row.original.status === 'published' ? 'success' : 'neutral'"
              variant="subtle"
            />
          </div>
        </template>

        <template #isFeatured-cell="{ row }">
          <div @click="navigateTo(`/admin/blog/${row.original.slug}`)">
            <UIcon v-if="row.original.isFeatured" name="i-lucide-star" class="size-4 text-warning fill-warning" />
            <span v-else class="text-muted text-sm">—</span>
          </div>
        </template>

        <template #tags-cell="{ row }">
          <div class="py-1" @click="navigateTo(`/admin/blog/${row.original.slug}`)">
            <div v-if="row.original.tags" class="flex flex-wrap gap-1">
              <UBadge
                v-for="tag in parseTags(row.original.tags).slice(0, 3)"
                :key="tag"
                :label="tag"
                variant="subtle"
                color="primary"
                size="sm"
              />
              <UBadge
                v-if="parseTags(row.original.tags).length > 3"
                :label="`+${parseTags(row.original.tags).length - 3}`"
                variant="soft"
                color="neutral"
                size="sm"
              />
            </div>
            <span v-else class="text-muted text-sm">—</span>
          </div>
        </template>

        <template #publishedAt-cell="{ row }">
          <span class="text-sm text-muted" @click="navigateTo(`/admin/blog/${row.original.slug}`)">
            {{ row.original.publishedAt ? formatDateShort(row.original.publishedAt) : '—' }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2 justify-end">
            <UTooltip :text="row.original.status === 'published' ? 'Dépublier' : 'Publier'">
              <UButton
                :icon="row.original.status === 'published' ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="togglePublished(row.original)"
              />
            </UTooltip>
            <UTooltip :text="row.original.isFeatured ? 'Retirer de la une' : 'Mettre à la une'">
              <UButton
                icon="i-lucide-star"
                :color="row.original.isFeatured ? 'warning' : 'neutral'"
                :variant="row.original.isFeatured ? 'soft' : 'ghost'"
                size="sm"
                @click="toggleFeatured(row.original)"
              />
            </UTooltip>
            <UButton icon="i-lucide-pencil" variant="ghost" color="neutral" size="sm" :to="`/admin/blog/${row.original.slug}`" />
            <UButton icon="i-lucide-trash-2" variant="ghost" color="error" size="sm" @click="deleteConfirm.request(row.original)" />
          </div>
        </template>
      </UTable>
    </div>

    <!-- Create slideover -->
    <USlideover v-model:open="createOpen" title="Nouvel article" side="right" inset>
      <template #body>
        <UForm
          id="post-create-form"
          :schema="postCreateSchema"
          :state="createState"
          class="flex flex-col gap-5 p-4"
          @submit="onCreate"
        >
          <UFormField name="title" label="Titre" required>
            <UInput v-model="createState.title" placeholder="Mon nouvel article" class="w-full" autofocus />
          </UFormField>
          <UFormField name="slug" label="Slug" required>
            <UInput v-model="createState.slug" placeholder="mon-nouvel-article" class="w-full font-mono" />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div class="flex gap-3 justify-end w-full p-4">
          <UButton label="Annuler" variant="ghost" color="neutral" @click="createOpen = false" />
          <UButton label="Créer l'article" icon="i-lucide-plus" form="post-create-form" type="submit" :loading="creating" />
        </div>
      </template>
    </USlideover>

    <!-- Delete confirm -->
    <UiConfirmDeleteModal
      v-model:open="deleteConfirm.open.value"
      :title="`Supprimer « ${deleteConfirm.item.value?.title} » ?`"
      description="Cette action est irréversible. L'article sera définitivement supprimé."
      :loading="deleteConfirm.loading.value"
      @confirm="deleteConfirm.confirm(deletePost)"
      @cancel="deleteConfirm.cancel()"
    />
  </DashboardPanel>
</template>
