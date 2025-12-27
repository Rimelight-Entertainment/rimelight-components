<script setup lang="ts">
import { useAppConfig } from "nuxt/app"
import { computed } from "#imports"
import { tv } from "tailwind-variants"

export interface LogoProps {
  variant?: "mark" | "type"
}

const { variant = "mark" } = defineProps<LogoProps>()

export interface LogoEmits {}

const emit = defineEmits<LogoEmits>()

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
  <NuxtLink to="/">
    <UIcon :name="logoSrc" v-bind="$attrs" />
  </NuxtLink>
</template>

<style scoped></style>
