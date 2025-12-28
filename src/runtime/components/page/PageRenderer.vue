<script setup lang="ts">
import { computed, provide } from "vue"
import { type Page, type PageSurround } from "../../types"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "vue-i18n"
import { usePageRegistry, useRC } from "../../composables"
import { tv } from "../../utils/tv"

export interface PageRendererProps {
  useSurround?: boolean
  surround?: PageSurround | null
  surroundStatus?: 'idle' | 'pending' | 'success' | 'error'
  resolvePage: (id: string) => Promise<Pick<Page, 'title' | 'icon' | 'slug'>>
  rc?: {
    container?: string
    grid?: string
    toc?: string
    properties?: string
    contentWrapper?: string
    banner?: string
    icon?: string
    title?: string
    surroundSkeleton?: string
    skeleton?: string
    metadata?: string
  }
}

const {
  useSurround = false,
  surroundStatus = 'idle',
  surround = null,
  resolvePage,
  rc: rcProp
} = defineProps<PageRendererProps>()

const page = defineModel<Page>({ required: true })

export interface PageRendererEmits {}

const emit = defineEmits<PageRendererEmits>()

export interface PageRendererSlots {}

const slots = defineSlots<PageRendererSlots>()

const { rc } = useRC('PageRenderer', rcProp)

const pageRendererStyles = tv({
  slots: {
    container: "flex flex-col py-16",
    grid: "grid grid-cols-1 lg:grid-cols-24 gap-xl items-start",
    toc: "hidden lg:flex lg:col-span-4 sticky top-16",
    properties: "order-1 lg:order-2 lg:col-span-6",
    contentWrapper: "order-2 lg:order-1 lg:col-span-14 flex flex-col gap-xl",
    banner: "rounded-xl w-full object-cover",
    icon: "rounded-full w-12 h-12 object-cover",
    title: "",
    surroundSkeleton: "grid grid-cols-1 gap-md sm:grid-cols-2",
    skeleton: "h-48 w-full rounded-xl",
    metadata: "flex flex-col gap-xs text-xs text-dimmed p-xl"
  }
})

const {
  container,
  grid,
  toc,
  properties,
  contentWrapper,
  banner,
  icon,
  title: titleClass,
  surroundSkeleton,
  skeleton,
  metadata
} = pageRendererStyles()

const { getTypeLabelKey } = usePageRegistry();
const { t, locale } = useI18n()

provide('page-resolver', resolvePage)

const previousPage = computed(() => surround?.previous)
const nextPage = computed(() => surround?.next)
const hasSurround = computed(() => !!(surround?.previous || surround?.next))
</script>

<template>
  <UContainer :class="container({ class: rc.container })">
    <div :class="grid({ class: rc.grid })">
      <RCPageTOC
        :page-blocks="page.blocks"
        :levels="[2, 3, 4]"
        :class="toc({ class: rc.toc })"
      >
        <template #bottom> </template>
      </RCPageTOC>
      <RCPagePropertiesRenderer v-model="page" :class="properties({ class: rc.properties })" />
      <div :class="contentWrapper({ class: rc.contentWrapper })">
        <RCImage
          v-if="page.banner?.src"
          :src="page.banner?.src"
          :alt="page.banner?.alt"
          :class="banner({ class: rc.banner })"
        />
        <UPageHeader
          :headline="t(getTypeLabelKey(page.type))"
          :description="getLocalizedContent(page.description, 'en') ?? ''"
          :ui="{ root: 'pt-0' }"
        >
          <template #title>
            <div class="flex flex-row gap-sm">
              <RCImage
                v-if="page.icon?.src"
                :src="page.icon?.src"
                :alt="page.icon?.alt"
                :class="icon({ class: rc.icon })"
              />
              <h1 :class="titleClass({ class: rc.title })">{{ getLocalizedContent(page.title, locale) }}</h1>
            </div>
          </template>
        </UPageHeader>
        <RCBlockViewRenderer :blocks="page.blocks" />
        <template v-if="useSurround">
          <div v-if="surroundStatus === 'pending'" :class="surroundSkeleton({ class: rc.surroundSkeleton })">
            <USkeleton :class="skeleton({ class: rc.skeleton })" />
            <USkeleton :class="skeleton({ class: rc.skeleton })" />
          </div>

          <LazyRCPageSurround
            v-else-if="surroundStatus === 'success' && hasSurround"
            hydrate-on-visible
            :pageType="getTypeLabelKey(page.type)"
            :previousTitle="getLocalizedContent(previousPage?.title, locale)"
            :previousDescription="getLocalizedContent(previousPage?.description, locale)"
            :previousTo="`/${previousPage?.slug}`"
            :nextTitle="getLocalizedContent(nextPage?.title, locale)"
            :nextDescription="getLocalizedContent(nextPage?.description, locale)"
            :nextTo="`/${nextPage?.slug}`"
          />

          <USeparator />

          <div :class="metadata({ class: rc.metadata })">
            <h6>Metadata</h6>
            <span>Page ID: {{ page.id }}</span>
            <span
              >Created At:
              <NuxtTime
                :datetime="page.created_at ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
            /></span>
            <span
              >Posted At:
              <NuxtTime
                :datetime="page.created_at ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
            /></span>
            <span
              >Updated At:
              <NuxtTime
                :datetime="page.created_at ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
            /></span>
          </div>
        </template>
      </div>
    </div>
  </UContainer>
</template>

<style scoped></style>
