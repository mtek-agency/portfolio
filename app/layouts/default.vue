<template>
  <div class="hide-cursor bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 min-h-screen">
    <UiGrainOverlay />
    <UiCustomCursor />
    <SiteNav />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
