<script setup lang="ts">
defineProps({
  projects: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <UTable
      :data="projects"
      class="flex-1"
  />
</template>

<style scoped>

</style>