<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui"

const appConfig = useAppConfig()

const columns: FooterColumn[] = [
  {
    label: "Resources",
    children: [
      {
        label: "Branding"
      },
      {
        label: "API"
      }
    ]
  },
  {
    label: "Documents",
    children: [
      {
        label: "Privacy Policy"
      },
      {
        label: "Cookie Policy"
      },
      {
        label: "Terms of Service"
      },
      {
        label: "Code of Conduct"
      },
      {
        label: "Other Documents"
      }
    ]
  }
]
</script>

<template>
  <RCFooter :contain="false" class="bg-black">
    <template #left>
      <RCNewsletterSignup class="max-w-64" />
      <div class="flex flex-col items-center gap-sm lg:items-start">
        <RCLogo variant="type" class="h-6 w-auto" />
        <span class="text-sm text-muted">
          © {{ new Date().getFullYear() }} {{ appConfig.title }}
        </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns" />
    </template>
    <template #right>
      <div class="flex flex-col gap-sm lg:items-end">
        <UColorModeSelect />
      </div>
      <div class="flex flex-row gap-sm lg:items-end">
        <UButton size="xl" variant="ghost" color="neutral" icon="mdi:instagram" />
        <UButton size="xl" variant="ghost" color="neutral" icon="ic:baseline-discord" />
        <UButton size="xl" variant="ghost" color="neutral" icon="mdi:spotify" />
        <UButton size="xl" variant="ghost" color="neutral" icon="mdi:github" />
        <UButton size="xl" variant="ghost" color="neutral" icon="mdi:linkedin" />
      </div>
    </template>
  </RCFooter>
</template>

<style scoped></style>
