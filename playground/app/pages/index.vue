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
        { label: 'View Components', to: '/components', icon: 'lucide:layout-template', size: 'xl' },
        { label: 'Wiki', to: '/matrix', icon: 'lucide:book', color: 'neutral', variant: 'outline', size: 'xl' },
        { label: 'Branding', to: '/branding', icon: 'lucide:palette', color: 'neutral', variant: 'ghost', size: 'xl' }
      ]"
    />
  </UPage>
</template>
