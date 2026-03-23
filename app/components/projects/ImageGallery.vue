<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { ProjectImage } from '~~/server/db/schema'

const props = defineProps<{
  images: ProjectImage[]
  slug: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const slug = toRef(props, 'slug')
const { fileInput, uploadingImages, deletingImageId, uploadFiles, deleteImage, reorderImages } = useProjectImages(slug, () => emit('refresh'))

const sortableImages = ref<ProjectImage[]>([...props.images])
watch(() => props.images, val => { sortableImages.value = [...val] }, { deep: true })

async function onDragEnd() {
  await reorderImages(sortableImages.value.map(img => img.id))
}

const { zoomedImage, zoomedIndex, open: openLightbox, close: closeLightbox, prev, next } = useLightbox(sortableImages)

// Confirmation suppression
const pendingDeleteImage = ref<ProjectImage | null>(null)
const deleteModalOpen = ref(false)

function requestDelete(image: ProjectImage) {
  pendingDeleteImage.value = image
  deleteModalOpen.value = true
}

function cancelDelete() {
  pendingDeleteImage.value = null
  deleteModalOpen.value = false
}

async function confirmDelete() {
  if (!pendingDeleteImage.value) return
  await deleteImage(pendingDeleteImage.value)
  cancelDelete()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-default">
        Images
        <span class="text-muted font-normal ml-1">({{ images.length }})</span>
      </p>
      <UButton
        label="Ajouter des images"
        icon="i-lucide-upload"
        variant="outline"
        size="sm"
        :loading="uploadingImages"
        @click="fileInput?.click()"
      />
      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="uploadFiles">
    </div>

    <VueDraggable
      v-if="sortableImages.length"
      v-model="sortableImages"
      class="grid grid-cols-3 gap-3"
      :animation="150"
      ghost-class="opacity-40"
      drag-class="scale-105"
      handle=".drag-handle"
      @end="onDragEnd"
    >
      <div
        v-for="(image, index) in sortableImages"
        :key="image.id"
        class="relative group rounded-lg overflow-hidden aspect-video bg-elevated cursor-zoom-in"
        @click="openLightbox(image)"
      >
        <img :src="`/api/images/${image.filename}`" :alt="image.filename" class="w-full h-full object-cover">

        <!-- Badge couverture -->
        <UBadge
          v-if="index === 0"
          label="Couverture"
          size="xs"
          color="primary"
          variant="solid"
          class="absolute top-2 left-2"
        />

        <div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
          <UButton icon="i-lucide-grip" variant="ghost" color="neutral" size="sm" class="drag-handle cursor-grab active:cursor-grabbing text-white! hover:text-white!" @click.stop />
          <UButton icon="i-lucide-zoom-in" variant="ghost" color="neutral" size="sm" class="text-white! hover:text-white!" @click.stop="openLightbox(image)" />
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="error"
            size="sm"
            :loading="deletingImageId === image.id"
            @click.stop="requestDelete(image)"
          />
        </div>
      </div>
    </VueDraggable>

    <div v-else class="rounded-lg border border-dashed border-default flex flex-col items-center justify-center gap-2 py-10 text-center">
      <UIcon name="i-lucide-image" class="size-8 text-muted" />
      <p class="text-sm text-muted">Aucune image pour ce projet</p>
      <UButton label="Ajouter des images" variant="ghost" size="sm" @click="fileInput?.click()" />
    </div>

    <!-- Modal confirmation suppression -->
    <UModal v-model:open="deleteModalOpen" title="Supprimer l'image">
      <template #body>
        <p class="text-sm text-muted">Cette action est irréversible. L'image sera définitivement supprimée.</p>
      </template>
      <template #footer>
        <div class="flex gap-3 justify-end w-full">
          <UButton label="Annuler" variant="ghost" color="neutral" @click="cancelDelete" />
          <UButton
            label="Supprimer"
            icon="i-lucide-trash-2"
            color="error"
            :loading="!!deletingImageId"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>

    <!-- Lightbox -->
    <ProjectsImageLightbox
      v-if="zoomedImage"
      :filename="zoomedImage.filename"
      :index="zoomedIndex"
      :total="sortableImages.length"
      @close="closeLightbox"
      @prev="prev"
      @next="next"
    />
  </div>
</template>