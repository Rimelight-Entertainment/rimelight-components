<script setup lang="ts">
import { useAppConfig } from "#imports"
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
      title: "Callout",
      description: "Callout"
    }
  )
})

const icon = computed(() => config.value.icon)
const title = computed(() => config.value.title)
const description = computed(() => config.value.description)
</script>

<template>
  <UAlert
    :title="$t(title)"
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
      <UTooltip v-if="description" :text="$t(description)">
        <UIcon name="lucide:circle-question-mark" class="size-5" />
      </UTooltip>
    </template>
  </UAlert>
</template>

<style scoped></style>
