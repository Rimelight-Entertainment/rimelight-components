<script setup lang="ts">
useHead({
  title: "Playground"
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Rimelight Components"
      description="A modern UI component library for building high-fidelity web applications with Nuxt and Tailwind CSS."
      :links="[
        { label: 'View Components', to: '/components', icon: 'i-lucide-layout-template', size: 'xl' },
        { label: 'Branding', to: '/branding', icon: 'i-lucide-palette', color: 'neutral', variant: 'outline', size: 'xl' }
      ]"
    />
  </UPage>
</template>
