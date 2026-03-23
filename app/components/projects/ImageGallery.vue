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

const zoomedImage = ref<ProjectImage | null>(null)

// Copie locale pour le drag — synchronisée quand les images changent depuis le parent
const sortableImages = ref<ProjectImage[]>([...props.images])
watch(() => props.images, val => { sortableImages.value = [...val] }, { deep: true })

async function onDragEnd() {
  await reorderImages(sortableImages.value.map(img => img.id))
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
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="uploadFiles"
      >
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
        v-for="image in sortableImages"
        :key="image.id"
        class="relative group rounded-lg overflow-hidden aspect-video bg-elevated cursor-zoom-in"
        @click="zoomedImage = image"
      >
        <img
          :src="`/api/images/${image.filename}`"
          :alt="image.filename"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
          <UButton
            icon="i-lucide-grip"
            variant="ghost"
            color="neutral"
            size="sm"
            class="drag-handle cursor-grab active:cursor-grabbing text-white! hover:text-white!"
            @click.stop
          />
          <UButton
            icon="i-lucide-zoom-in"
            variant="ghost"
            color="neutral"
            size="sm"
            class="text-white! hover:text-white!"
            @click.stop="zoomedImage = image"
          />
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="error"
            size="sm"
            :loading="deletingImageId === image.id"
            @click.stop="deleteImage(image)"
          />
        </div>
      </div>
    </VueDraggable>

    <div v-else class="rounded-lg border border-dashed border-default flex flex-col items-center justify-center gap-2 py-10 text-center">
      <UIcon name="i-lucide-image" class="size-8 text-muted" />
      <p class="text-sm text-muted">Aucune image pour ce projet</p>
      <UButton
        label="Ajouter des images"
        variant="ghost"
        size="sm"
        @click="fileInput?.click()"
      />
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="zoomedImage"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
          @click="zoomedImage = null"
        >
          <img
            :src="`/api/images/${zoomedImage?.filename}`"
            :alt="zoomedImage?.filename"
            class="max-w-[90vw] max-h-[90vh] object-contain select-none rounded-lg shadow-2xl cursor-default"
            @click.stop
          >
          <button
            class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            @click="zoomedImage = null"
          >
            <UIcon name="i-lucide-x" class="size-7" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>