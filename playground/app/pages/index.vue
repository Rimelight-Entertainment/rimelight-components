<script setup lang="ts">
import { type ButtonProps } from "#ui/types";
import { ref } from "vue";

/* region State */
const { t } = useI18n();

const heroLinks = ref<ButtonProps[]>([
  {
    icon: "lucide:layout-template",
    label: t("pages.home.hero.links.01"),
    to: "/components",
  },
  {
    color: "neutral",
    variant: "outline",
    icon: "lucide:book",
    label: t("pages.home.hero.links.02"),
    to: "/matrix",
  },
  {
    color: "neutral",
    variant: "ghost",
    icon: "lucide:palette",
    label: t("pages.home.hero.links.03"),
    to: "/branding",
  },
]);
/* endregion */

/* region Meta */
useHead({
  title: t("pages.home.meta.title"),
});
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <UPage>
    <UPageHero
      :title="t('pages.home.hero.title')"
      :description="t('pages.home.hero.description')"
      :links="heroLinks"
    />
  </UPage>
</template>
