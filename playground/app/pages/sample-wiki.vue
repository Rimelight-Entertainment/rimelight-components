<script setup lang="ts">
import { MOCK_PAGES_LIST } from "~/mocks/pages"
import { getLocalizedContent } from "rimelight-components/utils"
const { locale } = useI18n()
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader
      title="Sample Wiki"
      description="A list of showcase pages to test the block editor and renderer functionality."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <UCard v-for="page in MOCK_PAGES_LIST" :key="page.id" class="flex flex-col h-full">
        <template #header>
          <div class="flex items-center gap-3">
            <RCImage v-if="page.icon?.src" :src="page.icon.src" class="w-10 h-10 rounded-full" />
            <h3 class="font-bold text-lg">
              {{ getLocalizedContent(page.title, locale) }}
            </h3>
          </div>
        </template>

        <p class="text-dimmed text-sm line-clamp-3 mb-4 flex-grow">
          {{ getLocalizedContent(page.description, locale) }}
        </p>

        <div class="flex items-center justify-between gap-3 pt-4 border-t border-muted-200 dark:border-muted-800">
          <UButton
            :to="`/${page.slug}`"
            icon="lucide:eye"
            color="neutral"
            variant="ghost"
            size="sm"
            label="View"
          />
          <UButton
            :to="`/${page.slug}/edit`"
            icon="lucide:edit"
            color="primary"
            variant="solid"
            size="sm"
            label="Edit"
          />
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
