<script setup lang="ts">
import { computed } from "#imports"
import { tv } from "tailwind-variants"
import { slugify } from "../../utils"

const sectionVariants = tv({
  slots: {
    sectionSlot: "flex flex-col py-4 scroll-mt-24",
    linkSlot: "",
    headingSlot: "font-bold",
    descriptionSlot: "text-muted",
    separatorSlot: "py-2",
    contentSlot: "flex flex-col gap-md mt-2"
  },
  variants: {
    level: {
      1: {
        sectionSlot: "gap-2",
        linkSlot: "",
        headingSlot: "text-4xl",
        descriptionSlot: "text-2xl",
        separatorSlot: "",
        contentSlot: ""
      },
      2: {
        sectionSlot: "gap-1.5",
        linkSlot: "",
        headingSlot: "text-3xl",
        descriptionSlot: "text-xl",
        separatorSlot: "",
        contentSlot: ""
      },
      3: {
        sectionSlot: "gap-1",
        linkSlot: "",
        headingSlot: "text-2xl",
        descriptionSlot: "text-lg",
        separatorSlot: "",
        contentSlot: ""
      },
      4: {
        sectionSlot: "gap-0.5",
        linkSlot: "",
        headingSlot: "text-xl",
        descriptionSlot: "text-md",
        separatorSlot: "",
        contentSlot: ""
      },
      5: {
        sectionSlot: "gap-0.25",
        linkSlot: "",
        headingSlot: "text-lg",
        descriptionSlot: "text-sm",
        separatorSlot: "",
        contentSlot: ""
      },
      6: {
        sectionSlot: "gap-0.125",
        linkSlot: "",
        headingSlot: "text-base",
        descriptionSlot: "text-xs",
        separatorSlot: "",
        contentSlot: ""
      }
    }
  }
})

export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6

const {
  level = 1,
  title,
  description
} = defineProps<{
  level?: SectionLevel
  title: string
  description?: string
}>()

const {
  sectionSlot,
  linkSlot,
  headingSlot,
  descriptionSlot,
  separatorSlot,
  contentSlot
} = sectionVariants({ level })

const sectionId = computed(() => slugify(title))
</script>

<template>
  <section :id="sectionId" :class="sectionSlot()" v-bind="$attrs">
    <component :id="sectionId" :is="`h${level}`" :class="headingSlot()">
      <NuxtLink :href="`#${sectionId}`" :class="linkSlot()" :id="id">
        {{ title }}
      </NuxtLink>
    </component>
    <p v-if="description" :class="descriptionSlot()">{{ description }}</p>
    <USeparator :class="separatorSlot()" />
    <div :class="contentSlot()">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>
