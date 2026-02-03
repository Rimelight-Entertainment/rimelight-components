<script setup lang="ts">
import { useAppConfig } from "nuxt/app"
import { computed } from "#imports"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables"

export interface LogoProps {
  variant?: "mark" | "type"
  rc?: {
    root?: string
  }
}

const { variant = "mark", rc: rcProp } = defineProps<LogoProps>()

export interface LogoEmits {}

const emit = defineEmits<LogoEmits>()

export interface LogoSlots {}

const slots = defineSlots<LogoSlots>()

const { rc } = useRC('Logo', rcProp)

const logoStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = logoStyles()

const appConfig = useAppConfig()

const logoSrc = computed<string>(() => {
  switch (variant) {
    case "type":
      return (appConfig.logotype as string) || ""
    case "mark":
    default:
      return (appConfig.logomark as string) || ""
  }
})
</script>

<template>
  <NuxtLink to="/" :class="root({ class: rc.root })">
    <UIcon :name="logoSrc" v-bind="$attrs" />
  </NuxtLink>
</template>

<style scoped></style>
