<script setup lang="ts">
import { computed, provide } from "vue"
import { type Page, type PageSurround } from "../../types"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "vue-i18n"
import { usePageRegistry } from "../../composables"

const { getTypeLabelKey } = usePageRegistry();

const page = defineModel<Page>({ required: true })

const { t, locale } = useI18n()

interface PageRendererProps {
  useSurround?: boolean
  surround?: PageSurround | null
  surroundStatus?: 'idle' | 'pending' | 'success' | 'error'
  resolvePage: (id: string) => Promise<Pick<Page, 'title' | 'icon' | 'slug'>>
}

const { useSurround = false, surroundStatus = 'idle', surround = null, resolvePage } = defineProps<PageRendererProps>()

interface PageRendererEmits {

}

const emit = defineEmits<PageRendererEmits>()

provide('page-resolver', resolvePage)

const previousPage = computed(() => surround?.previous)
const nextPage = computed(() => surround?.next)
const hasSurround = computed(() => !!(surround?.previous || surround?.next))
</script>

<template>
  <UContainer class="flex flex-col py-16">
    <div class="grid grid-cols-1 lg:grid-cols-24 gap-xl items-start">
      <RCPageTOC
        :page-blocks="page.blocks"
        :levels="[2, 3, 4]"
        class="hidden lg:flex lg:col-span-4 sticky top-16"
      >
        <template #bottom> </template>
      </RCPageTOC>
      <RCPagePropertiesRenderer v-model="page" class="order-1 lg:order-2 lg:col-span-6" />
      <div class="order-2 lg:order-1 lg:col-span-14 flex flex-col gap-xl">
        <NuxtImg
          v-if="page.banner?.src"
          :src="page.banner?.src"
          :alt="page.banner?.alt"
          class="rounded-xl w-full object-cover"
        />
        <UPageHeader
          :headline="t(getTypeLabelKey(page.type))"
          :description="getLocalizedContent(page.description, 'en') ?? ''"
          :ui="{ root: 'pt-0' }"
        >
          <template #title>
            <div class="flex flex-row gap-sm">
              <NuxtImg
                v-if="page.icon?.src"
                :src="page.icon?.src"
                :alt="page.icon?.alt"
                class="rounded-full w-12 h-12 object-cover"
              />
              <h1>{{ getLocalizedContent(page.title, locale) }}</h1>
            </div>
          </template>
        </UPageHeader>
        <RCBlockViewRenderer :blocks="page.blocks" />
        <template v-if="useSurround">
          <div v-if="surroundStatus === 'pending'" class="grid grid-cols-1 gap-md sm:grid-cols-2">
            <USkeleton class="h-48 w-full rounded-xl" />
            <USkeleton class="h-48 w-full rounded-xl" />
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

          <div class="flex flex-col gap-xs text-xs text-dimmed p-xl">
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
