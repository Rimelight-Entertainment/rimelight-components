<script setup lang="ts">
import { computed } from "vue"
import type { Block } from "../../types/blocks"
import type { SectionBlockProps } from "../../types/blocks"
import type { HeadingLevel } from "../../types/blocks"
import { slugify } from "../../utils"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

export interface TOCItem {
  id: string
  title: string
  level: HeadingLevel
  children?: TOCItem[]
}

const {
  pageBlocks,
  title = "table_of_contents",
  levels = [2, 3, 4]
} = defineProps<{
  pageBlocks: Block[]
  title?: string
  levels?: HeadingLevel[]
}>()

const extractHeadings = (blocks: Block[]): TOCItem[] => {
  const headings: TOCItem[] = []

  if (!blocks || blocks.length === 0) {
    return headings
  }

  for (const block of blocks) {
    if (block.type === "SectionBlock") {
      const props = block.props as SectionBlockProps
      const title = props.title
      const level = props.level

      if (title && level) {
        headings.push({
          id: slugify(title),
          title: title,
          level: level
        })
      }

      if (props.children && props.children.length > 0) {
        headings.push(...extractHeadings(props.children))
      }
    }
  }

  return headings
}

const tocItems = computed<TOCItem[]>(() => {
  if (!pageBlocks || pageBlocks.length === 0) {
    return []
  }

  if (levels.length === 0) {
    return []
  }

  const allHeadings = extractHeadings(pageBlocks)

  const filteredHeadings = allHeadings.filter((item) =>
    levels.includes(item.level)
  )

  return Array.from(new Set(filteredHeadings.map((h) => h.id))).map(
    (id) => filteredHeadings.find((h) => h.id === id)!
  )
})
</script>

<template>
  <div class="z-10 flex flex-col gap-md">
    <nav
      class="sticky top-(--ui-header-height) z-50 flex flex-col gap-md pt-lg"
      aria-label="Table of Contents"
    >
      <h5 class="text-highlighted">
        {{ t(title) }}
      </h5>

      <ul
        v-if="tocItems.length > 0"
        class="flex flex-col gap-0 border-s border-default"
      >
        <li
          v-for="item in tocItems"
          :key="item.id"
          class="relative flex min-w-0"
          :class="{
            'ms-2': item.level === 2,
            'ms-4': item.level === 3,
            'ms-6': item.level === 4,
            'ms-8': item.level === 5,
            'ms-10': item.level === 6
          }"
        >
          <NuxtLink
            :href="`#${item.id}`"
            class="group relative flex size-full items-center px-1.5 py-1.5 text-start text-sm font-medium before:absolute before:inset-x-0 before:inset-y-px before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset dark:focus-visible:outline-none"
          >
            <span class="truncate">
              {{ item.title }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <slot name="bottom" />
    </nav>
  </div>
</template>
