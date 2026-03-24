<script setup lang="ts">
defineProps<{
  src?: string | null
  name?: string
  email?: string
  uploading: boolean
}>()

const emit = defineEmits<{ upload: [File] }>()

const fileInput = ref<HTMLInputElement | null>(null)

function openPicker() {
  fileInput.value?.click()
}

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('upload', file)
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="flex items-center gap-6">
    <div class="relative group">
      <UAvatar
        :src="src ?? undefined"
        :alt="name"
        size="3xl"
        class="ring-2 ring-default"
      />
      <button
        class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        :class="{ 'opacity-100': uploading }"
        @click="openPicker"
      >
        <UIcon v-if="!uploading" name="i-lucide-camera" class="size-5 text-white" />
        <UIcon v-else name="i-lucide-loader" class="size-5 text-white animate-spin" />
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onChange">
    </div>
    <div>
      <p class="font-semibold text-default text-lg">{{ name }}</p>
      <p class="text-sm text-muted">{{ email }}</p>
      <UButton
        label="Changer la photo"
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-upload"
        class="mt-2 -ml-2"
        :loading="uploading"
        @click="openPicker"
      />
    </div>
  </div>
</template>
