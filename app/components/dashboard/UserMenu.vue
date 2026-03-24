<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const { user, clear } = useUserSession()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const avatarSrc = computed(() => {
  const avatar = user.value?.avatar
  if (!avatar) return null
  if (avatar.startsWith('http')) return avatar
  return `/api/images/${avatar}`
})

const userConnected = ref({
  name: user.value?.name,
  avatar: {
    src: avatarSrc,
    alt: user.value?.name
  }
})

const items = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: userConnected.value.name,
  avatar: userConnected.value.avatar
}], [{
  label: 'Mon profil',
  icon: 'i-lucide-user',
  to: '/admin/profile',
}, {
  label: isDark.value ? 'Thème clair' : 'Thème sombre',
  icon: isDark.value ? 'i-lucide-sun' : 'i-lucide-moon',
  onSelect: () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }
}], [{
  label: 'Se déconnecter',
  icon: 'i-lucide-log-out',
  onSelect: async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await navigateTo('/login')
  }
}]]))
</script>

<template>
  <UDropdownMenu
      :items="items"
      :content="{ align: 'center', collisionPadding: 12 }"
      :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
        v-bind="{
        ...userConnected,
        label: collapsed ? undefined : userConnected?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
        color="neutral"
        variant="ghost"
        block
        :square="collapsed"
        class="data-[state=open]:bg-elevated"
        :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
            class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
            :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>