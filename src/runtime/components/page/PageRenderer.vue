<script setup lang="ts">
import type { Page } from "../../types"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "#imports"

const page = defineModel<Page>({ required: true })

const { t, locale } = useI18n()

interface PageRendererProps {

}

const {} = defineProps<PageRendererProps>()

interface PageRendererEmits {

}

const emit = defineEmits<PageRendererEmits>()
</script>

<template>
  <UContainer class="flex flex-col">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-xl p-xl bg-muted">
      <RCPagePropertiesRenderer v-model="page" class="order-1 lg:order-2 lg:col-span-1" />
      <div class="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-xl">
        <UPageHeader
            :title="getLocalizedContent(page.title, 'en')"
            :description="getLocalizedContent(page.description, 'en') ?? ''"
        />
        <RCBlockViewRenderer :blocks="page.blocks" />
      </div>
    </div>
    <div class="flex flex-col gap-xs text-xs p-xl">
        <h6>Metadata</h6>
        <span>Page ID: {{ page.id }}</span>
        <span>Created At: <NuxtTime
            :datetime="page.created_at ?? ''"
            year="numeric"
            month="numeric"
            day="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric"
            time-zone-name="short"
        /></span>
        <span>Posted At: <NuxtTime
            :datetime="page.created_at ?? ''"
            year="numeric"
            month="numeric"
            day="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric"
            time-zone-name="short"
        /></span>
        <span>Updated At: <NuxtTime
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
  </UContainer>
</template>

<style scoped>

</style>