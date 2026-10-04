<template>
  <div class="max-w-2xl mx-auto px-6 lg:px-0 py-12 border-t border-neutral-100 dark:border-neutral-800">
    <div class="flex items-center gap-5">
      <!-- Avatar -->
      <div class="size-14 rounded-full bg-neutral-950 dark:bg-white flex items-center justify-center shrink-0">
        <span class="font-display font-black text-lg text-white dark:text-black tracking-tight">mb</span>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <p class="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium mb-1">Auteur</p>
        <p class="font-display font-bold text-neutral-900 dark:text-white text-lg tracking-tight">Mattéo Bonneval</p>
        <p class="text-sm text-neutral-500 mt-0.5">Développeur web & mobile · Bordeaux</p>
      </div>

      <!-- Social links -->
      <div class="flex items-center gap-3 shrink-0">
        <a
          href="https://github.com/matteobnvl"
          target="_blank"
          rel="noopener noreferrer"
          class="size-9 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
        >
          <UIcon name="i-lucide-github" class="size-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/matteo-bonneval"
          target="_blank"
          rel="noopener noreferrer"
          class="size-9 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
        >
          <UIcon name="i-lucide-linkedin" class="size-4" />
        </a>
      </div>
    </div>
  </div>
</template>
