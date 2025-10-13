<script setup lang="ts">
const {} = defineProps<{
  src: string
  alt: string
  name: string
  role: string
  description: string
}>()
</script>

<template>
  <UCard>
    <NuxtImg :src="src" :alt="alt" />
    <div class="flex flex-col gap-xs">
      <h3 class="text-xl font-bold">
        {{ name }}
      </h3>
      <span class="text-sm">{{ role }}</span>
    </div>
    <p class="text-md">
      {{ description }}
    </p>
    <template #footer>
      <div class="flex flex-row gap-md">
        <slot name="links" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
