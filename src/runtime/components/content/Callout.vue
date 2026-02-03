<script setup lang="ts">
import { useAppConfig } from "#imports"
import { computed } from "#imports"
import { useI18n } from "vue-i18n"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "commentary"
  | "ideation"
  | "source"

export interface CalloutProps {
  variant: CalloutVariant
  to?: string
  target?: string
  rc?: {
    icon?: string
    tooltipIcon?: string
  }
}

const { variant, to, target, rc: rcProp } = defineProps<CalloutProps>()

export interface CalloutEmits {}

const emit = defineEmits<CalloutEmits>()

export interface CalloutSlots {
  default: (props: {}) => any
}

const slots = defineSlots<CalloutSlots>()

const { rc } = useRC('Callout', rcProp)

const calloutStyles = tv({
  slots: {
    icon: "size-6",
    tooltipIcon: "pointer-events-auto size-5"
  }
})

const { icon: iconClass, tooltipIcon } = calloutStyles()

const { t } = useI18n()
const appConfig = useAppConfig()

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
        <UIcon :name="icon" :class="iconClass({ class: rc.icon })" />
      </template>
      <template #description>
        <slot />
      </template>
      <template #close>
        <UTooltip v-if="tooltip" :text="t(tooltip)">
          <UIcon
            name="lucide:circle-question-mark"
            :class="tooltipIcon({ class: rc.tooltipIcon })"
          />
        </UTooltip>
      </template>
    </UAlert>
  </NuxtLink>
</template>

<style scoped></style>
