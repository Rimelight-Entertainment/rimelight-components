<script setup lang="ts">
import { useAppConfig } from "#imports"
import { computed, defineAsyncComponent } from "#imports"

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

const RootComponent = computed(() =>
  to ? resolveComponent("NuxtLink") : "div"
)

const rootProps = computed(() => {
  const commonClasses = {
    class: "w-full block"
  }

  if (to) {
    // Props for NuxtLink
    return {
      ...commonClasses,
      to: to,
      target: target || undefined
    }
  }
  // Props for div
  return commonClasses
})

const resolveComponent = (name: string) => {
  if (name === "NuxtLink") {
    return defineAsyncComponent(() =>
      import("#components").then((m) => m.NuxtLink || m.default)
    )
  }
  return name // for 'div'
}
</script>

<template>
  <component :is="RootComponent" v-bind="rootProps">
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
