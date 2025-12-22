<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const {
  pageType,
  previousTitle,
  previousDescription,
  previousTo,
  nextTitle,
  nextDescription,
  nextTo
} = defineProps<{
  pageType: string
  previousTitle?: string
  previousDescription?: string
  previousTo?: string
  nextTitle?: string
  nextDescription?: string
  nextTo?: string
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
    <div>
      <ULink v-if="previousTitle" :to="previousTo" class="h-full">
        <UCard
          variant="soft"
          class="group block h-full bg-transparent hover:bg-elevated/50 focus-visible:outline-primary"
        >
          <div class="flex flex-col gap-md">
            <div class="flex flex-col gap-xs">
              <UButton
                variant="outline"
                icon="lucide:arrow-left"
                class="group-hover w-fit text-md rounded-full text-primary group-hover:text-highlighted"
              />
              <span class="text-muted">
                {{ t("navigation_previous") }}
                {{ t(pageType) }}
              </span>
            </div>
            <div class="flex flex-col gap-sm">
              <p class="text-primary text-sm group-hover:text-highlighted">
                {{ previousTitle }}
              </p>
              <p class="text-toned text-xs">
                {{ previousDescription }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
    <div>
      <ULink v-if="nextTitle" :to="nextTo" class="h-full">
        <UCard
          variant="soft"
          class="group block h-full bg-transparent hover:bg-elevated/50 focus-visible:outline-primary"
        >
          <div class="flex flex-col items-end gap-md">
            <div class="flex flex-col items-end gap-xs">
              <UButton
                variant="outline"
                icon="lucide:arrow-right"
                class="w-fit rounded-full text-primary text-md group-hover:text-highlighted"
              />
              <span class="text-muted">
                {{ t("navigation_next") }}
                {{ t(pageType) }}</span
              >
            </div>
            <div class="flex flex-col items-end gap-xs">
              <p class="text-right text-sm text-primary group-hover:text-highlighted">
                {{ nextTitle }}
              </p>
              <p class="text-right text-toned text-xs">
                {{ nextDescription }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
  </div>
</template>
