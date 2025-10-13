<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui"

const appConfig = useAppConfig()

const columns: FooterColumn[] = [
  {
    label: `Resources`,
    children: [
      {
        label: `Rimelight Companion App`,
        to: `/companion/`
      },
      {
        label: `Branding`,
        to: `/branding/`
      },
      {
        label: `API`,
        to: `/api/`
      }
    ]
  },
  {
    label: `Documents`,
    children: [
      {
        label: `Privacy Policy`,
        to: `/documents/policies/privacy-policy/`
      },
      {
        label: `Cookie Policy`,
        to: `/documents/policies/cookie-policy/`
      },
      {
        label: `Terms of Service`,
        to: `/documents/policies/terms-of-service/`
      },
      {
        label: `Code of Conduct`,
        to: `/documents/policies/code-of-conduct/`
      },
      {
        label: `Other Documents`,
        to: `/documents/policies/other-documents/`
      }
    ]
  }
]
</script>

<template>
  <RCFooter class="bg-black">
    <template #left>
        <RCNewsletterSignup class="max-w-64"/>
        <div class="flex flex-col items-center gap-sm md:items-start">
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
        <div class="flex flex-col gap-sm md:justify-end">
          <UColorModeSelect />
        </div>
        <div class="flex flex-row gap-sm md:justify-end">
          <UButton
              size="xl"
              variant="ghost"
              color="neutral"
              icon="mdi:instagram"
              to="https://www.instagram.com/idantity.me"
          />
          <UButton
              size="xl"
              variant="ghost"
              color="neutral"
              icon="ic:baseline-discord"
              to="https://discord.com/users/682049695173836979"
          />
          <UButton
              size="xl"
              variant="ghost"
              color="neutral"
              icon="mdi:spotify"
              to="https://open.spotify.com/user/v5m4qoc9j35ccc6nbzqcookvj?si=d795f9bc1cb34222"
          />
          <UButton
              size="xl"
              variant="ghost"
              color="neutral"
              icon="mdi:github"
              to="https://www.github.com/idantitydotme"
          />
          <UButton
              size="xl"
              variant="ghost"
              color="neutral"
              icon="mdi:linkedin"
              to="https://www.linkedin.com/daniel-marchi"
          />
        </div>
    </template>
  </RCFooter>
</template>

<style scoped></style>
