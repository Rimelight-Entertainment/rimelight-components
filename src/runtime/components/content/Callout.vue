<script setup lang="ts">
import { useAppConfig } from "#imports"
import { computed } from "#imports"
import { NuxtLink } from "#components"

export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "commentary"
  | "ideation"
  | "source"

const appConfig = useAppConfig()

const {
  variant,
  to = "",
  target = ""
} = defineProps<{
  variant: CalloutVariant
  to?: string
  target?: string
}>()

const config = computed(() => {
  return (
    appConfig.rimelightComponents?.callouts?.[variant] ?? {
      icon: "lucide:alert-circle",
      title: "Callout",
      tooltip: "Callout"
    }
  )
})

const icon = computed(() => config.value.icon)
const title = computed(() => config.value.title)
const tooltip = computed(() => config.value.tooltip)

const RootComponent = computed(() => (to ? NuxtLink : "div"))

// Compute the attributes for the root component
const rootAttributes = computed(() => {
  // CRITICAL: Ensure the block-container class is passed *only* to the root element
  // The 'w-full block' is necessary to fix layout consistency
  const attrs: Record<string, any> = { class: "w-full block" }

  // Attach the block type for debugging, but separate from class
  attrs.type = "CalloutBlock"

  if (to) {
    // Props for NuxtLink (to, target)
    attrs.to = to
    attrs.target = target || undefined
    // Standard link props for external links that NuxtLink passes through to <a>
    if (target === "_blank") {
      attrs.rel = "noopener noreferrer"
    }
  }

  return attrs
})
</script>

<template>
  <component :is="RootComponent" v-bind="rootAttributes">
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
        <UTooltip v-if="tooltip" :text="$t(tooltip)">
          <UIcon name="lucide:circle-question-mark" class="size-5" />
        </UTooltip>
      </template>
    </UAlert>
  </component>
</template>

<style scoped></style>
