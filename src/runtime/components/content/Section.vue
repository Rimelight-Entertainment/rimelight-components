<script setup lang="ts">
import { useRoute } from "#imports"
import { computed } from "vue"
import { useClipboard } from "@vueuse/core"
import { useToast } from "@nuxt/ui/composables"
import { tv } from "../../internal/tv"
import { useRC } from "~/src/runtime/composables"
import { slugify } from "../../utils"

defineOptions({
  name: 'SectionComponent'
})

export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface SectionProps {
  level?: SectionLevel
  title: string
  description?: string
  isEditing?: boolean
  rc?: {
    section?: string
    link?: string
    heading?: string
    descriptionText?: string
    separator?: string
    content?: string
  }
}

const {
  level = 1,
  title,
  description,
  isEditing = false,
  rc: rcProp
} = defineProps<SectionProps>()

export interface SectionEmits {}

const emit = defineEmits<SectionEmits>()

export interface SectionSlots {
  default: (props: {}) => any
  title: (props: {}) => any
  description: (props: {}) => any
}

const slots = defineSlots<SectionSlots>()

const { rc } = useRC('Section', rcProp)

const sectionStyles = tv({
  slots: {
    section: "flex flex-col scroll-mt-24 w-full",
    link: "",
    heading: "font-bold w-full",
    descriptionText: "text-muted",
    separator: "py-2",
    content: "flex flex-col gap-md mt-2"
  },
  variants: {
    level: {
      1: {
        section: "gap-2",
        link: "",
        heading: "",
        descriptionText: "text-2xl",
        separator: "",
        content: ""
      },
      2: {
        section: "gap-1.5",
        link: "",
        heading: "",
        descriptionText: "text-xl",
        separator: "",
        content: ""
      },
      3: {
        section: "gap-1",
        link: "",
        heading: "",
        descriptionText: "text-lg",
        separator: "",
        content: ""
      },
      4: {
        section: "gap-0.5",
        link: "",
        heading: "",
        descriptionText: "text-md",
        separator: "",
        content: ""
      },
      5: {
        section: "gap-0.25",
        link: "",
        heading: "",
        descriptionText: "text-sm",
        separator: "",
        content: ""
      },
      6: {
        section: "gap-0.125",
        link: "",
        heading: "",
        descriptionText: "text-xs",
        separator: "",
        content: ""
      }
    }
  }
})

const {
  section,
  link,
  heading,
  descriptionText,
  separator,
  content
} = sectionStyles({ level })

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

const sectionId = computed(() => slugify(title))
const sectionHash = computed(() => `#${sectionId.value}`)
const fullSectionUrl = computed(() => {
  if (typeof window === "undefined") return sectionHash.value
  return `${window.location.origin}${route.path}${sectionHash.value}`
})
</script>

<template>
  <section :id="sectionId" :class="section({ class: rc.section })" v-bind="$attrs">
    <component
      :id="`${sectionId}-heading`"
      :is="`h${level}`"
      :class="heading({ class: rc.heading })"
    >
      <NuxtLink
        v-if="!isEditing"
        :href="`#${sectionId}`"
        :class="link({ class: rc.link })"
        class="group relative lg:-ms-2 lg:ps-2 inline-block w-full"
      >
        <ClientOnly>
          <UButton
            variant="soft"
            color="primary"
            icon="i-lucide-link"
            :to="`#${sectionId}`"
            class="absolute top-1/2 -translate-y-1/2 -ms-8 hidden rounded-md p-1 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 lg:flex"
            @click.prevent="copyToClipboard(fullSectionUrl)"
          />
          <template #fallback>
            <div
              class="absolute top-1/2 -translate-y-1/2 -ms-8 w-6 h-6 rounded-md p-1 opacity-0 transition lg:flex"
            />
          </template>
        </ClientOnly>
        <slot name="title">{{ title }}</slot>
      </NuxtLink>
      <slot v-else name="title">{{ title }}</slot>
    </component>
    <slot name="description">
      <p v-if="description" :class="descriptionText({ class: rc.descriptionText })">
        {{ description }}
      </p>
    </slot>
    <USeparator :class="separator({ class: rc.separator })" />
    <div :class="content({ class: rc.content })">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>
