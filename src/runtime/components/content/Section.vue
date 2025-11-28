<script setup lang="ts">
import { useRoute } from "#imports"
import { computed } from "vue"
import { useClipboard } from "@vueuse/core"
import { useToast } from "#imports"
import { tv } from "tailwind-variants"
import { slugify } from "../../utils"

const { copy } = useClipboard()
const toast = useToast()
const route = useRoute()

const copyToClipboard = async (text: string) => {
  try {
    await copy(`${text}`)
    toast.add({
      title: "Heading copied to clipboard!",
      description: text,
      color: "success"
    })
  } catch {
    toast.add({
      title: "Failed to copy heading to clipboard.",
      description: "An unexpected error occurred. Please try again.",
      color: "error"
    })
  }
}

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
        headingSlot: "",
        descriptionSlot: "text-2xl",
        separatorSlot: "",
        contentSlot: ""
      },
      2: {
        sectionSlot: "gap-1.5",
        linkSlot: "",
        headingSlot: "",
        descriptionSlot: "text-xl",
        separatorSlot: "",
        contentSlot: ""
      },
      3: {
        sectionSlot: "gap-1",
        linkSlot: "",
        headingSlot: "",
        descriptionSlot: "text-lg",
        separatorSlot: "",
        contentSlot: ""
      },
      4: {
        sectionSlot: "gap-0.5",
        linkSlot: "",
        headingSlot: "",
        descriptionSlot: "text-md",
        separatorSlot: "",
        contentSlot: ""
      },
      5: {
        sectionSlot: "gap-0.25",
        linkSlot: "",
        headingSlot: "",
        descriptionSlot: "text-sm",
        separatorSlot: "",
        contentSlot: ""
      },
      6: {
        sectionSlot: "gap-0.125",
        linkSlot: "",
        headingSlot: "",
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
  description,
  isEditing = false
} = defineProps<{
  level?: SectionLevel
  title: string
  description?: string
  isEditing?: boolean
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
const sectionHash = computed(() => `#${sectionId.value}`)
const fullSectionUrl = computed(() => {
  if (typeof window === "undefined") return sectionHash.value
  return `${window.location.origin}${route.path}${sectionHash.value}`
})
</script>

<template>
  <section :id="sectionId" :class="sectionSlot()" v-bind="$attrs">
    <component
      :id="sectionId"
      :is="`h${level}`"
      :class="headingSlot()"
      class="relative"
    >
      <NuxtLink
        v-if="!isEditing"
        :href="`#${sectionId}`"
        :class="linkSlot()"
        class="group lg:-ms-2 lg:ps-2"
      >
        <UButton
          variant="soft"
          color="primary"
          leading-icon="lucide:link"
          :to="`#${sectionId}`"
          class="absolute top-1 -ms-8 hidden rounded-md p-1 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 lg:flex"
          @click="copyToClipboard(fullSectionUrl)"
        />
        <slot name="title">{{ title }}</slot>
      </NuxtLink>
      <slot v-else name="title">{{ title }}</slot>
    </component>
    <p v-if="description" :class="descriptionSlot()">
      <slot name="description">{{ description }}</slot>
    </p>
    <USeparator :class="separatorSlot()" />
    <div :class="contentSlot()">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>
