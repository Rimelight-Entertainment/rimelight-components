<script setup lang="ts">
import { inject } from "vue"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "vue-i18n"
import { type Page } from "../../types"
import { useAsyncData } from "#imports"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables/useRC"

export interface PageMentionProps {
  pageId: string
  rc?: {
    link?: string
    icon?: string
    text?: string
    skeleton?: string
  }
}

const { pageId, rc: rcProp } = defineProps<PageMentionProps>()

export interface PageMentionEmits {}

const emit = defineEmits<PageMentionEmits>()

export interface PageMentionSlots {}

const slots = defineSlots<PageMentionSlots>()

const { rc } = useRC('PageMention', rcProp)

const pageMentionStyles = tv({
  slots: {
    link: "inline-flex items-baseline gap-1 align-middle hover:text-primary transition-colors font-medium text-inherit",
    icon: "w-4 h-4 rounded-full object-cover shrink-0",
    text: "truncate font-medium",
    skeleton: "h-3 w-24"
  }
})

const { link, icon, text, skeleton } = pageMentionStyles()

const { locale } = useI18n()


const resolver = inject<(id: string) => Promise<Pick<Page, 'title' | 'icon' | 'slug'>>>('page-resolver')

const { data: linkedPage, status } = await useAsyncData(`page-mention-${pageId}`, async () => {
  if (!resolver) {
    console.warn('RCPageMention: No page resolver provided in RCPageRenderer')
    return null
  }
  return await resolver(pageId)
}, {
  lazy: true,
  server: false,
  watch: [() => pageId]
})
</script>

<template>
  <NuxtLink v-if="linkedPage" :to="`/${linkedPage.slug}`" :class="link({ class: rc.link })">
    <NuxtImg
      v-if="linkedPage.icon?.src"
      :src="linkedPage.icon.src"
      :alt="linkedPage.icon.alt"
      :class="icon({ class: rc.icon })"
    />
    <span :class="text({ class: rc.text })">
      {{ getLocalizedContent(linkedPage.title, locale) }}
    </span>
  </NuxtLink>
  <USkeleton v-else-if="status === 'pending'" :class="skeleton({ class: rc.skeleton })" />
</template>

<style scoped></style>
