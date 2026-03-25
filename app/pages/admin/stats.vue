<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'], pageTransition: false })
useHead({ title: 'Stats' })

type StatsOverview = {
  topProjects: { id: number, name: string, slug: string, views: number }[]
  topPosts: { id: number, title: string, slug: string, views: number }[]
  totalProjectViews: number
  totalPostViews: number
}

const { data: stats } = await useFetch<StatsOverview>('/api/stats/overview', { key: 'stats-overview' })

const maxProjectViews = computed(() => Math.max(...(stats.value?.topProjects.map(p => p.views) ?? [1]), 1))
const maxPostViews = computed(() => Math.max(...(stats.value?.topPosts.map(p => p.views) ?? [1]), 1))
</script>

<template>
  <DashboardPanel title="Statistiques">
    <div class="p-6 flex flex-col gap-6">

      <!-- Totals -->
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl border border-default bg-elevated/40 p-5 flex items-center gap-4">
          <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-folder-closed" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-highlighted">{{ (stats?.totalProjectViews ?? 0).toLocaleString('fr-FR') }}</p>
            <p class="text-sm text-muted">Vues projets (total)</p>
          </div>
        </div>
        <div class="rounded-xl border border-default bg-elevated/40 p-5 flex items-center gap-4">
          <div class="size-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-notebook-pen" class="size-5 text-success" />
          </div>
          <div>
            <p class="text-2xl font-bold text-highlighted">{{ (stats?.totalPostViews ?? 0).toLocaleString('fr-FR') }}</p>
            <p class="text-sm text-muted">Vues articles (total)</p>
          </div>
        </div>
      </div>

      <!-- Rankings -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <!-- Top projects -->
        <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-folder-closed" class="size-4 text-muted" />
            <p class="text-sm font-semibold text-default">Top projets</p>
          </div>
          <div v-if="stats?.topProjects.length" class="flex flex-col gap-3">
            <div v-for="(project, i) in stats.topProjects" :key="project.id" class="flex items-center gap-3">
              <span class="text-xs text-muted w-4 shrink-0 text-right">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <NuxtLink
                    :to="`/admin/projets/${project.slug}`"
                    class="text-sm text-default hover:text-primary transition-colors truncate"
                  >
                    {{ project.name }}
                  </NuxtLink>
                  <span class="text-xs text-muted shrink-0">{{ project.views.toLocaleString('fr-FR') }}</span>
                </div>
                <div class="h-1 rounded-full bg-muted/20 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-primary transition-all"
                    :style="{ width: `${(project.views / maxProjectViews) * 100}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-muted">Aucune vue enregistrée</p>
        </div>

        <!-- Top posts -->
        <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-notebook-pen" class="size-4 text-muted" />
            <p class="text-sm font-semibold text-default">Top articles</p>
          </div>
          <div v-if="stats?.topPosts.length" class="flex flex-col gap-3">
            <div v-for="(post, i) in stats.topPosts" :key="post.id" class="flex items-center gap-3">
              <span class="text-xs text-muted w-4 shrink-0 text-right">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <NuxtLink
                    :to="`/admin/blog/${post.slug}`"
                    class="text-sm text-default hover:text-primary transition-colors truncate"
                  >
                    {{ post.title }}
                  </NuxtLink>
                  <span class="text-xs text-muted shrink-0">{{ post.views.toLocaleString('fr-FR') }}</span>
                </div>
                <div class="h-1 rounded-full bg-muted/20 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-success transition-all"
                    :style="{ width: `${(post.views / maxPostViews) * 100}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-muted">Aucune vue enregistrée</p>
        </div>

      </div>
    </div>
  </DashboardPanel>
</template>
