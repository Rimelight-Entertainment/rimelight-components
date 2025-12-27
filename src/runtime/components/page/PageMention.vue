<script setup lang="ts">
import { inject } from "vue"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "vue-i18n"
import { type Page } from "../../types"
import { useAsyncData } from "#imports"
import { tv } from "tailwind-variants"

export interface PageMentionProps {
  pageId: string
}

export interface PageMentionEmits {}

const { pageId } = defineProps<PageMentionProps>()
const emit = defineEmits<PageMentionEmits>()

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
  <NuxtLink
    v-if="linkedPage"
    :to="`/${linkedPage.slug}`"
    :class="link()"
  >
    <NuxtImg
      v-if="linkedPage.icon?.src"
      :src="linkedPage.icon.src"
      :alt="linkedPage.icon.alt"
      :class="icon()"
    />
    <span :class="text()">
      {{ getLocalizedContent(linkedPage.title, locale) }}
    </span>
  </NuxtLink>
  <USkeleton v-else-if="status === 'pending'" :class="skeleton()" />
</template>

<style scoped></style>
