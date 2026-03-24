<script setup lang="ts">
import type { EditorToolbarItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import type { Post } from '~~/server/db/schema'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const route = useRoute()
const toast = useAppToast()
const slug = computed(() => route.params.slug as string)

const { data: post, refresh } = await useFetch<Post>(
  () => `/api/posts/${slug.value}`,
  { key: computed(() => `post-${slug.value}`), watch: [slug] },
)

const { data: viewCount } = await useFetch<{ views: number }>(
  () => `/api/posts/${slug.value}/views`,
  { key: computed(() => `post-views-${slug.value}`), watch: [slug] },
)

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Article introuvable' })

const { formState, dirty, saving, save, toggleStatus, toggleFeatured } = usePostEditor(post, slug, refresh)

// Cover image upload
const coverInput = ref<HTMLInputElement>()
const uploadingCover = ref(false)

const coverSrc = computed(() => coverImageSrc(formState.coverImage))

async function onCoverSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const formData = new FormData()
    formData.append('cover', file)
    const updated = await $fetch<Post>(`/api/posts/${slug.value}/cover`, { method: 'POST', body: formData })
    formState.coverImage = updated.coverImage ?? ''
    dirty.value = false
    toast.success('Image de couverture mise à jour')
  }
  catch {
    toast.error('Erreur', "Impossible d'uploader l'image")
  }
  finally {
    uploadingCover.value = false
    if (coverInput.value) coverInput.value.value = ''
  }
}

// Editor image upload
const editorRef = ref()
const editorImageInput = ref<HTMLInputElement>()

const imageHandlers = {
  image: {
    canExecute: () => true,
    execute: (_editor: Editor) => {
      editorImageInput.value?.click()
      return _editor.chain()
    },
    isActive: () => false,
  },
} satisfies EditorCustomHandlers

async function onEditorImageSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { url } = await $fetch<{ url: string }>('/api/posts/images', { method: 'POST', body: formData })
    editorRef.value?.editor?.chain().focus().setImage({ src: url }).run()
  }
  catch {
    toast.error('Erreur', "Impossible d'uploader l'image")
  }
  finally {
    if (editorImageInput.value) editorImageInput.value.value = ''
  }
}

const toolbarItems: EditorToolbarItem[][] = [
  [
    { kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
    { kind: 'heading', level: 3, icon: 'i-lucide-heading-3' },
    { kind: 'paragraph', icon: 'i-lucide-pilcrow' },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code' },
  ],
  [
    { kind: 'link', icon: 'i-lucide-link' },
    { kind: 'image', icon: 'i-lucide-image-plus' },
    { kind: 'blockquote', icon: 'i-lucide-quote' },
    { kind: 'codeBlock', icon: 'i-lucide-code-2' },
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
    { kind: 'horizontalRule', icon: 'i-lucide-minus' },
  ],
  [
    { kind: 'undo', icon: 'i-lucide-undo-2' },
    { kind: 'redo', icon: 'i-lucide-redo-2' },
    { kind: 'clearFormatting', icon: 'i-lucide-remove-formatting' },
  ],
]

const suggestionItems = [
  { label: 'Titre 1', icon: 'i-lucide-heading-1', kind: 'heading', level: 1 },
  { label: 'Titre 2', icon: 'i-lucide-heading-2', kind: 'heading', level: 2 },
  { label: 'Titre 3', icon: 'i-lucide-heading-3', kind: 'heading', level: 3 },
  { label: 'Paragraphe', icon: 'i-lucide-pilcrow', kind: 'paragraph' },
  { label: 'Image', icon: 'i-lucide-image-plus', kind: 'image' },
  { label: 'Liste à puces', icon: 'i-lucide-list', kind: 'bulletList' },
  { label: 'Liste numérotée', icon: 'i-lucide-list-ordered', kind: 'orderedList' },
  { label: 'Citation', icon: 'i-lucide-quote', kind: 'blockquote' },
  { label: 'Bloc de code', icon: 'i-lucide-code-2', kind: 'codeBlock' },
  { label: 'Séparateur', icon: 'i-lucide-minus', kind: 'horizontalRule' },
]
</script>

<template>
  <DashboardPanel :breadcrumb="[{ label: 'Blog', to: '/admin/blog' }, { label: post?.title ?? 'Article' }]">
    <template #right>
      <span v-if="dirty" class="flex items-center gap-1.5 text-xs text-warning font-medium mr-1">
        <span class="size-1.5 rounded-full bg-warning animate-pulse" />
        Non sauvegardé
      </span>
      <UButton label="Retour" icon="i-lucide-arrow-left" variant="ghost" color="neutral" to="/admin/blog" />
      <UButton icon="i-lucide-save" :loading="saving" @click="save">
        Sauvegarder
        <template #trailing>
          <span class="flex items-center gap-0.5 opacity-60 ml-0.5">
            <UKbd value="meta" size="sm" color="neutral" variant="subtle" />
            <UKbd value="S" size="sm" color="neutral" variant="subtle" />
          </span>
        </template>
      </UButton>
    </template>

    <div class="flex h-full min-h-0">
      <!-- Editor area -->
      <div class="flex-1 overflow-y-auto">
        <!-- Title -->
        <div class="px-8 pt-8 pb-4">
          <UTextarea
            v-model="formState.title"
            placeholder="Titre de l'article…"
            :rows="1"
            autoresize
            :ui="{ base: 'text-3xl font-bold text-highlighted border-none shadow-none ring-0 focus:ring-0 resize-none bg-transparent p-0 placeholder:text-dimmed' }"
            class="w-full"
          />
        </div>

        <!-- UEditor -->
        <UEditor
          ref="editorRef"
          v-slot="{ editor }"
          v-model="formState.content"
          content-type="html"
          :handlers="imageHandlers"
          :placeholder="{ placeholder: 'Commencez à écrire… (utilisez / pour les commandes)', mode: 'firstLine' }"
          class="min-h-[60vh] pb-32"
        >
          <UEditorToolbar :editor="editor" :items="toolbarItems" type="fixed" class="sticky top-0 z-10 border-b border-default bg-default/80 backdrop-blur" />
          <UEditorDragHandle :editor="editor" />
          <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
        </UEditor>

        <!-- Hidden input for editor images -->
        <input ref="editorImageInput" type="file" accept="image/*" class="hidden" @change="onEditorImageSelected">
      </div>

      <!-- Sidebar -->
      <div class="w-72 shrink-0 border-l border-default overflow-y-auto">
        <div class="p-5 flex flex-col gap-5">

          <!-- Views -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-eye" class="size-4 text-muted" />
              <span class="text-sm text-muted">Vues</span>
            </div>
            <span class="text-sm font-semibold text-default">{{ (viewCount?.views ?? 0).toLocaleString('fr-FR') }}</span>
          </div>

          <USeparator />

          <!-- Status -->
          <div>
            <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Statut</p>
            <UButton
              :label="formState.status === 'published' ? 'Publié' : 'Brouillon'"
              :color="formState.status === 'published' ? 'success' : 'neutral'"
              :variant="formState.status === 'published' ? 'soft' : 'outline'"
              size="sm"
              :icon="formState.status === 'published' ? 'i-lucide-globe' : 'i-lucide-file'"
              block
              @click="toggleStatus"
            />
          </div>

          <USeparator />

          <!-- Featured -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-default">À la une</p>
              <p class="text-xs text-muted">Mis en avant sur le blog</p>
            </div>
            <USwitch :model-value="formState.isFeatured" color="warning" @update:model-value="toggleFeatured" />
          </div>

          <USeparator />

          <!-- Cover image -->
          <div>
            <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Image de couverture</p>

            <div
              class="relative group rounded-lg overflow-hidden border border-default cursor-pointer bg-elevated/40"
              :class="coverSrc ? 'h-36' : 'h-24 flex items-center justify-center'"
              @click="coverInput?.click()"
            >
              <img v-if="coverSrc" :src="coverSrc" alt="Cover" class="w-full h-full object-cover">
              <div
                class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-opacity"
                :class="coverSrc ? 'bg-black/50 opacity-0 group-hover:opacity-100' : 'opacity-100'"
              >
                <UIcon
                  :name="uploadingCover ? 'i-lucide-loader' : 'i-lucide-upload'"
                  class="size-5 text-white"
                  :class="{ 'animate-spin': uploadingCover }"
                />
                <span class="text-xs text-white font-medium">{{ coverSrc ? 'Changer' : 'Ajouter une image' }}</span>
              </div>
            </div>

            <button v-if="coverSrc" class="mt-1.5 text-xs text-muted hover:text-error transition-colors" @click="formState.coverImage = ''">
              Supprimer
            </button>

            <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onCoverSelected">
          </div>

          <USeparator />

          <!-- Slug -->
          <div>
            <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Slug</p>
            <UInput v-model="formState.slug" placeholder="mon-article" class="w-full font-mono text-sm" />
          </div>

          <!-- Excerpt -->
          <div>
            <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Résumé</p>
            <UTextarea v-model="formState.excerpt" placeholder="Courte description de l'article…" :rows="3" autoresize class="w-full text-sm" />
          </div>

          <!-- Tags -->
          <div>
            <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Tags</p>
            <UInput v-model="formState.tags" placeholder="nuxt, vue, typescript" class="w-full text-sm" />
            <p class="text-xs text-muted mt-1">Séparés par des virgules</p>
          </div>

          <!-- Dates -->
          <div v-if="post" class="text-xs text-muted space-y-1">
            <p>Créé le {{ formatDateShort(post.createdAt) }}</p>
            <p v-if="post.publishedAt">Publié le {{ formatDateShort(post.publishedAt) }}</p>
          </div>

          <!-- Public link -->
          <UButton
            v-if="post?.status === 'published'"
            label="Voir l'article"
            icon="i-lucide-external-link"
            variant="outline"
            color="neutral"
            size="sm"
            :to="`/blog/${post.slug}`"
            target="_blank"
            block
          />
        </div>
      </div>
    </div>
  </DashboardPanel>
</template>
