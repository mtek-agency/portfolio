<script setup lang="ts">
const { isOpen, close } = useCommandPalette()
const router = useRouter()

const query = ref('')
const results = ref<{ projects: { id: number, name: string, slug: string }[], posts: { id: number, title: string, slug: string, status: string }[], tools: { id: number, name: string }[] } | null>(null)
const searching = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  if (!val.trim()) { results.value = null; return }
  searchTimer = setTimeout(async () => {
    searching.value = true
    try {
      results.value = await $fetch('/api/search', { query: { q: val } })
    }
    finally { searching.value = false }
  }, 200)
})

watch(isOpen, (val) => {
  if (!val) { query.value = ''; results.value = null }
})

const hasResults = computed(() =>
  results.value && (results.value.projects.length + results.value.posts.length + results.value.tools.length) > 0
)

const isEmpty = computed(() =>
  results.value && !hasResults.value
)

function navigate(to: string) {
  close()
  router.push(to)
}
</script>

<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'p-0 overflow-hidden', header: 'p-0 border-b border-default', body: 'p-0' }">
    <template #header>
      <div class="flex items-center gap-3 px-4 py-3">
        <UIcon name="i-lucide-search" class="size-4 text-muted shrink-0" />
        <input
          v-model="query"
          placeholder="Rechercher un projet, article, outil…"
          class="flex-1 bg-transparent text-sm text-default placeholder:text-muted outline-none"
          autofocus
        >
        <div v-if="searching" class="size-3.5 border-2 border-muted border-t-transparent rounded-full animate-spin shrink-0" />
        <UKbd value="esc" size="sm" color="neutral" variant="subtle" class="shrink-0" />
      </div>
    </template>

    <template #body>
      <!-- Default state -->
      <div v-if="!query.trim()" class="flex flex-col gap-1 p-2">
        <p class="px-3 py-1.5 text-xs text-muted">Accès rapide</p>
        <button
          v-for="link in [
            { label: 'Dashboard', icon: 'i-lucide-house', to: '/admin' },
            { label: 'Projets', icon: 'i-lucide-folder-closed', to: '/admin/projets' },
            { label: 'Blog', icon: 'i-lucide-notebook-pen', to: '/admin/blog' },
            { label: 'Outils', icon: 'i-lucide-layout-grid', to: '/admin/tools' },
            { label: 'Inbox', icon: 'i-lucide-inbox', to: '/admin/inbox' },
            { label: 'Stats', icon: 'i-lucide-bar-chart-2', to: '/admin/stats' },
          ]"
          :key="link.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-default hover:bg-elevated transition-colors text-left"
          @click="navigate(link.to)"
        >
          <UIcon :name="link.icon" class="size-4 text-muted shrink-0" />
          {{ link.label }}
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="isEmpty" class="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <UIcon name="i-lucide-search-x" class="size-6 text-muted" />
        <p class="text-sm text-muted">Aucun résultat pour "{{ query }}"</p>
      </div>

      <!-- Results -->
      <div v-else-if="hasResults" class="flex flex-col gap-1 p-2 max-h-80 overflow-y-auto">
        <!-- Projects -->
        <template v-if="results!.projects.length">
          <p class="px-3 py-1 text-xs font-medium text-muted">Projets</p>
          <button
            v-for="project in results!.projects"
            :key="project.id"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-elevated transition-colors text-left"
            @click="navigate(`/admin/projets/${project.slug}`)"
          >
            <UIcon name="i-lucide-folder-closed" class="size-4 text-muted shrink-0" />
            <span class="flex-1 text-default truncate">{{ project.name }}</span>
            <span class="text-xs text-muted font-mono shrink-0">{{ project.slug }}</span>
          </button>
        </template>

        <!-- Posts -->
        <template v-if="results!.posts.length">
          <p class="px-3 py-1 text-xs font-medium text-muted">Articles</p>
          <button
            v-for="post in results!.posts"
            :key="post.id"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-elevated transition-colors text-left"
            @click="navigate(`/admin/blog/${post.slug}`)"
          >
            <UIcon name="i-lucide-notebook-pen" class="size-4 text-muted shrink-0" />
            <span class="flex-1 text-default truncate">{{ post.title }}</span>
            <UBadge :label="post.status === 'published' ? 'Publié' : 'Brouillon'" :color="post.status === 'published' ? 'success' : 'neutral'" variant="subtle" size="xs" class="shrink-0" />
          </button>
        </template>

        <!-- Tools -->
        <template v-if="results!.tools.length">
          <p class="px-3 py-1 text-xs font-medium text-muted">Outils</p>
          <button
            v-for="tool in results!.tools"
            :key="tool.id"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-elevated transition-colors text-left"
            @click="navigate('/admin/tools')"
          >
            <UIcon name="i-lucide-layout-grid" class="size-4 text-muted shrink-0" />
            <span class="text-default">{{ tool.name }}</span>
          </button>
        </template>
      </div>
    </template>
  </UModal>
</template>
