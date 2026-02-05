<script setup lang="ts">
import { useAppConfig, computed, useNuxtApp } from "#imports"
import { useAttrs } from "vue"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

defineOptions({
  inheritAttrs: false
})

export type LogoVariant = "mark" | "type" | "classic" | "symbol" | string

export interface LogoProps {
  /**
   * The variant of the logo to display.
   * @defaultValue "mark"
   */
  variant?: LogoVariant
  /**
   * Override the color mode.
   */
  mode?: "light" | "dark"
  /**
   * The URL to link to.
   * @defaultValue "/"
   */
  to?: string
  /**
   * Options for the RC design system.
   */
  rc?: {
    root?: string
  }
  /**
   * The alt text for the logo image.
   */
  alt?: string
}

const props = withDefaults(defineProps<LogoProps>(), {
  variant: "mark",
  to: "/"
})

const attrs = useAttrs()
const { rc } = useRC('Logo', props.rc)
const nuxtApp = useNuxtApp()
const appConfig = useAppConfig()

const logoStyles = tv({
  slots: {
    root: "inline-flex transition-opacity hover:opacity-80 shrink-0"
  }
})

const { root } = logoStyles()

const activeMode = computed(() => props.mode || (nuxtApp as any).$colorMode?.value || 'dark')

const logoSrc = computed<string | null>(() => {
  const rcLogos = appConfig.rimelightComponents?.logos

  if (rcLogos && typeof rcLogos === 'object') {
    const variantConfig = (rcLogos as any)[props.variant]
    if (variantConfig) {
      if (typeof variantConfig === 'string') return variantConfig
      return (variantConfig as any)[activeMode.value] || (variantConfig as any).light || (variantConfig as any).dark || null
    }
  }

  // Fallback to legacy top-level properties
  if (props.variant === "mark") return (appConfig.logomark as string) || null
  if (props.variant === "type") return (appConfig.logotype as string) || null

  // Try to find variant at top level of appConfig (e.g. appConfig.classic)
  return (appConfig[props.variant] as string) || null
})

const isIcon = computed(() => {
  const src = logoSrc.value
  if (!src) return false
  if (src.startsWith('http') || src.startsWith('/') || src.startsWith('.')) return false
  return src.includes(':') || src.startsWith('i-')
})
</script>

<template>
  <NuxtLink :to="to" :class="root({ class: [rc.root, attrs.class as any] })" :aria-label="alt || variant" v-bind="attrs">
    <template v-if="logoSrc">
      <UIcon v-if="isIcon" :name="logoSrc" class="size-full" />
      <NuxtImg v-else :src="logoSrc" :alt="alt" class="size-full object-contain" />
    </template>
    <slot v-else />
  </NuxtLink>
</template>

<style scoped></style>
