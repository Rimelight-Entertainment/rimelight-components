<script setup lang="ts">
import { useAppConfig } from "#imports"
import { computed } from "#imports"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "commentary"
  | "ideation"
  | "source"

const appConfig = useAppConfig()

const { variant, to, target } = defineProps<{
  variant: CalloutVariant
  to?: string
  target?: string
}>()

const config = computed(() => {
  return (
    (appConfig.rimelightComponents as any)?.callouts?.[variant] ?? {
      icon: "lucide:alert-circle",
      title: "Callout",
      tooltip: "Callout"
    }
  )
})

const icon = computed(() => config.value.icon)
const title = computed(() => config.value.title)
const tooltip = computed(() => config.value.tooltip)
</script>

<template>
  <NuxtLink :to="to" :target="target">
    <UAlert
      :title="t(title)"
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
        <UTooltip v-if="tooltip" :text="t(tooltip)">
          <UIcon
            name="lucide:circle-question-mark"
            class="pointer-events-auto size-5"
          />
        </UTooltip>
      </template>
    </UAlert>
  </NuxtLink>
</template>

<style scoped></style>
