<script setup lang="ts">
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
    <ULink v-if="previousTitle" :to="previousTo">
      <UCard
        variant="outline"
        class="hover:bg-elevated/50 focus-visible:outline-primary group block bg-transparent"
      >
        <div class="gap-md flex flex-col">
          <div class="gap-xs flex flex-col">
            <UButton
              variant="outline"
              icon="lucide:arrow-left"
              class="group-hover text-primary group-hover:text-highlighted w-fit rounded-full"
            />
            <span class="text-muted">
              {{ $t("navigation_previous") }}
              {{ $t(pageType) }}
            </span>
          </div>
          <div class="gap-xs flex flex-col">
            <p class="text-primary group-hover:text-highlighted">
              {{ previousTitle }}
            </p>
            <p class="text-toned">
              {{ previousDescription }}
            </p>
          </div>
        </div>
      </UCard>
    </ULink>
    <ULink v-if="nextTitle" :to="nextTo">
      <UCard
        variant="outline"
        class="hover:bg-elevated/50 focus-visible:outline-primary group block bg-transparent"
      >
        <div class="gap-md flex flex-col items-end">
          <div class="gap-xs flex flex-col items-end">
            <UButton
              variant="outline"
              icon="lucide:arrow-right"
              class="text-primary group-hover:text-highlighted w-fit rounded-full"
            />
            <span class="text-muted">
              {{ $t("navigation_next") }}
              {{ $t(pageType) }}</span
            >
          </div>
          <div class="gap-xs flex flex-col items-end">
            <p class="text-primary group-hover:text-highlighted">
              {{ nextTitle }}
            </p>
            <p class="text-toned">
              {{ nextDescription }}
            </p>
          </div>
        </div>
      </UCard>
    </ULink>
  </div>
</template>
