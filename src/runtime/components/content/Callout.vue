<script setup lang="ts">
import { useAppConfig } from "nuxt/app"
import { computed } from "#imports"

export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "commentary"
  | "ideation"
  | "source"

const appConfig = useAppConfig()

const { variant } = defineProps<{
  variant: CalloutVariant
}>()

const config = computed(() => {
  return (
    appConfig.rimelightComponents?.callouts?.[variant] ?? {
      icon: "lucide:alert-circle",
      title: "Unknown"
    }
  )
})

const icon = computed(() => config.value.icon)
const title = computed(() => config.value.title)
</script>

<template>
  <UAlert :icon="icon" :title="title" :color="variant" variant="subtle">
    <template #description>
      <slot />
    </template>
  </UAlert>
</template>

<style scoped></style>
