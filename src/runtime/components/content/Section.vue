<script setup lang="ts">
import { tv } from "tailwind-variants"

const sectionVariants = tv({
  slots: {
    sectionSlot: "flex flex-col gap-md lg:gap-lg",
    headingSlot: ""
  },
  variants: {
    level: {
      1: {
        headingSlot: "text-4xl font-bold"
      },
      2: {
        headingSlot: "text-3xl font-bold"
      },
      3: {
        headingSlot: "text-2xl font-bold"
      },
      4: {
        headingSlot: "text-xl font-bold"
      },
      5: {
        headingSlot: "text-lg font-bold"
      },
      6: {
        headingSlot: "text-base font-bold"
      }
    }
  }
})

export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6

const { level = 1, title = `H${level}` } = defineProps<{
  level?: SectionLevel
  title?: string
}>()

const { sectionSlot, headingSlot } = sectionVariants({ level })
</script>

<template>
  <section :class="sectionSlot()" v-bind="$attrs">
    <component :is="`h${level}`" :class="headingSlot()">
      {{ title }}
    </component>
    <USeparator />
    <slot />
  </section>
</template>

<style scoped></style>
