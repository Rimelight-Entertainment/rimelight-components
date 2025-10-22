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
      title: "Unknown",
      tooltip: "Callout"
    }
  )
})

const icon = computed(() => config.value.icon)
const title = computed(() => config.value.title)
const tooltip = computed(() => config.value.tooltip)
</script>

<template>
  <UAlert
    :title="title"
    :color="variant"
    variant="subtle"
    :close="{
      class: 'pointer-events-none focus-visible:outline-none'
    }"
  >
    <template #leading>
      <UIcon :name="icon" class="size-6" />
    </template>
    <template #description>
      <slot />
    </template>
    <template #close>
      <UTooltip :text="tooltip">
        <UIcon name="lucide:circle-question-mark" class="size-4" />
      </UTooltip>
    </template>
  </UAlert>
</template>

<style scoped></style>
