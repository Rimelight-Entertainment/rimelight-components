<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui";
import { ar, en, es, fr, ja, ko, pt, ro, zh_cn } from "@nuxt/ui/locale";

const appConfig = useAppConfig();
const { locale, setLocale } = useI18n();

type Locale = "en";

function onLocaleUpdate(newLocale: string | undefined) {
  if (typeof newLocale === "string") {
    setLocale(newLocale as Locale);
  }
}

const columns: FooterColumn[] = [
  {
    label: "Resources",
    children: [
      {
        label: "Branding",
        to: "/branding",
      },
      {
        label: "API",
      },
    ],
  },
  {
    label: "Documents",
    children: [
      {
        label: "Privacy Policy",
      },
      {
        label: "Cookie Policy",
      },
      {
        label: "Terms of Service",
      },
      {
        label: "Code of Conduct",
      },
      {
        label: "Other Documents",
      },
    ],
  },
];
</script>

<template>
  <RCFooter :contain="false" class="bg-black z-50">
    <template #left>
      <RCNewsletterSignup class="max-w-64" />
      <div class="flex flex-col items-center gap-xs lg:items-start">
        <RCLogo variant="type" class="h-6 w-auto" />
        <p class="text-sm text-white">Tell your story.</p>
        <span class="text-sm text-white">
          © {{ new Date().getFullYear() }} {{ appConfig.title }}
        </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns" />
    </template>
    <template #right>
      <div class="flex flex-col gap-sm lg:items-end">
        <UColorModeSelect nuxt-client class="rounded-none" />
        <ULocaleSelect
          v-model="locale"
          nuxt-client
          :locales="[ar, en, es, fr, ja, ko, pt, ro, zh_cn]"
          class="w-48 rounded-none"
          color="secondary"
          @update:model-value="onLocaleUpdate($event)"
        />
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
