<script setup lang="ts">
import { tv } from "tailwind-variants"

const sectionVariants = tv({
  slots: {
    sectionSlot: "flex flex-col py-4",
    headingSlot: "font-bold",
    descriptionSlot: "text-muted",
    separatorSlot: "py-2",
    contentSlot: "flex flex-col gap-md mt-2"
  },
  variants: {
    level: {
      1: {
        sectionSlot: "gap-2",
        headingSlot: "text-4xl",
        descriptionSlot: "text-2xl"
      },
      2: {
        sectionSlot: "gap-1.5",
        headingSlot: "text-3xl",
        descriptionSlot: "text-xl"
      },
      3: {
        sectionSlot: "gap-1",
        headingSlot: "text-2xl",
        descriptionSlot: "text-lg"
      },
      4: {
        sectionSlot: "gap-0.5",
        headingSlot: "text-xl",
        descriptionSlot: "text-md"
      },
      5: {
        sectionSlot: "gap-0.25",
        headingSlot: "text-lg",
        descriptionSlot: "text-sm"
      },
      6: {
        sectionSlot: "gap-0.125",
        headingSlot: "text-base",
        descriptionSlot: "text-xs"
      }
    }
  }
})

export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6

const { level = 1 } = defineProps<{
  level?: SectionLevel
  title: string
  description?: string
}>()

const {
  sectionSlot,
  headingSlot,
  descriptionSlot,
  separatorSlot,
  contentSlot
} = sectionVariants({ level })
</script>

<template>
  <section :class="sectionSlot()" v-bind="$attrs">
    <component :is="`h${level}`" :class="headingSlot()">
      {{ title }}
    </component>
    <p v-if="description" :class="descriptionSlot()">{{ description }}</p>
    <USeparator :class="separatorSlot()" />
    <div :class="contentSlot()">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>
