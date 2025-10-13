<script setup lang="ts">
import { useAppConfig } from "nuxt/app"
import { computed } from "#imports"

const appConfig = useAppConfig()

const { variant = "mark" } = defineProps<{
  variant?: "mark" | "type"
}>()

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
