<script setup lang="ts">
const links = [
  { href: 'mailto:contact@matteo-bonneval.fr', icon: 'i-lucide-mail', label: 'contact@matteo-bonneval.fr', external: false },
  { href: 'https://www.linkedin.com/in/matteo-bonneval', icon: 'i-lucide-linkedin', label: 'LinkedIn', external: true },
  { href: 'https://github.com/matteobnvl', icon: 'i-lucide-github', label: 'GitHub', external: true },
]
</script>

<template>
  <section class="bg-neutral-950 py-24 lg:py-36">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <!-- Left: intro -->
        <div class="flex flex-col justify-start">
          <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-600 mb-8 font-medium">Contact</p>
          <div
            v-for="line in ['Vous avez un projet ?', 'Travaillons ensemble.']"
            :key="line"
            class="overflow-hidden leading-[0.92]"
          >
            <h2 class="font-display font-black text-white tracking-tighter" style="font-size: clamp(2rem, 4.5vw, 4.5rem)">
              {{ line }}
            </h2>
          </div>
          <p class="text-neutral-500 mt-8 leading-relaxed max-w-sm">
            N'hésitez pas à me contacter pour toute question. Je suis disponible pour de nouveaux projets ou simplement pour discuter.
          </p>
          <div class="mt-10 flex flex-col gap-3">
            <a
              v-for="link in links"
              :key="link.href"
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
              class="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-200 group"
            >
              <UIcon :name="link.icon" class="size-4" />
              {{ link.label }}
              <UIcon name="i-lucide-arrow-up-right" class="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        <!-- Right: form -->
        <div>
          <HomeContactForm />
        </div>
      </div>
    </div>
  </section>
</template>
