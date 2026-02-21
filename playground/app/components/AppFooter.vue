<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui";
import { ar, en, es, fr, ja, ko, pt, ro, zh_cn } from "@nuxt/ui/locale";
import { tv } from "../../../app/internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface AppFooterProps {
  // prop1: string,
}

const {} = defineProps<AppFooterProps>();
/* endregion */

/* region Emits */
export interface AppFooterEmits {}

const emit = defineEmits<AppFooterEmits>();
/* endregion */

/* region Slots */
export interface AppFooterSlots {}

const slots = defineSlots<AppFooterSlots>();
/* endregion */

/* region Styles */
const appFooterStyles = tv({
  slots: {
    root: "bg-black z-50",
    signup: "max-w-64",
    branding: "flex flex-col items-center gap-xs lg:items-start",
    logo: "h-6 w-auto",
    tagline: "text-sm text-white",
    copyright: "text-sm text-white",
    settings: "flex flex-col gap-sm lg:items-end",
    colorMode: "rounded-none",
    localeSelect: "w-48 rounded-none",
    socials: "flex flex-row gap-sm lg:items-end",
  },
});

const {
  root,
  signup,
  branding,
  logo,
  tagline,
  copyright,
  settings,
  colorMode,
  localeSelect,
  socials,
} = appFooterStyles();
type AppFooterVariants = VariantProps<typeof appFooterStyles>;
/* endregion */

/* region State */
const appConfig = useAppConfig();
const { locale, setLocale } = useI18n();

type Locale = "en";

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
/* endregion */

/* region Meta */
defineOptions({
  name: "AppFooter",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
function onLocaleUpdate(newLocale: string | undefined) {
  if (typeof newLocale === "string") {
    setLocale(newLocale as Locale);
  }
}
/* endregion */
</script>

<template>
  <RCFooter :contain="false" :class="root()">
    <template #left>
      <RCNewsletterSignup :class="signup()" />
      <div :class="branding()">
        <RCLogo variant="type" :class="logo()" />
        <p :class="tagline()">Tell your story.</p>
        <span :class="copyright()"> © {{ new Date().getFullYear() }} {{ appConfig.title }} </span>
      </div>
    </template>
    <template #center>
      <UFooterColumns :columns="columns" />
    </template>
    <template #right>
      <div :class="settings()">
        <UColorModeSelect nuxt-client :class="colorMode()" />
        <ULocaleSelect
          v-model="locale"
          nuxt-client
          :locales="[ar, en, es, fr, ja, ko, pt, ro, zh_cn]"
          :class="localeSelect()"
          color="secondary"
          @update:model-value="onLocaleUpdate($event)"
        />
      </div>
      <div :class="socials()">
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
