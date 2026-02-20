<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useIntersectionObserver } from "@vueuse/core";
import { tv } from "../../internal/tv";
import { useRC } from "../../composables";
import type { Block, SectionBlockProps, HeadingLevel } from "../../types";
import { slugify, defaultDocument } from "../../utils";

interface TOCItem {
  id: string;
  title: string;
  level: HeadingLevel;
}

export interface PageTOCProps {
  pageBlocks: Block[] | null;
  title?: string;
  levels?: HeadingLevel[];
  rc?: {
    nav?: string;
    list?: string;
    link?: string;
    text?: string;
  };
}

const props = withDefaults(defineProps<PageTOCProps>(), {
  title: "table_of_contents",
  levels: () => [2, 3, 4],
});

export interface PageTOCEmits {}

const emit = defineEmits<PageTOCEmits>();

export interface PageTOCSlots {
  bottom: (props: {}) => any;
}

const slots = defineSlots<PageTOCSlots>();

const { rc } = useRC("PageTOC", props.rc);

const pageTOCStyles = tv({
  slots: {
    nav: "flex flex-col gap-sm w-full",
    list: "flex flex-col",
    link: "group relative flex items-center px-3 py-1.5 text-sm transition-all duration-200 border-s-2 -ms-px",
    text: "truncate",
  },
  variants: {
    active: {
      true: {
        link: "border-accented font-semibold text-foreground",
      },
      false: {
        link: "border-dimmed text-dimmed",
      },
    },
    level: {
      1: { link: "ps-3" },
      2: { link: "ps-3" },
      3: { link: "ps-6" },
      4: { link: "ps-9" },
      5: { link: "ps-12" },
      6: { link: "ps-15" },
    },
  },
});

const { nav, list, link, text } = pageTOCStyles();

const { t } = useI18n();
const activeId = ref<string | null>(null);

const { locale } = useI18n();

const extractHeadings = (blocks: Block[]): TOCItem[] => {
  const headings: TOCItem[] = [];
  if (!blocks) return headings;

  for (const block of blocks) {
    if (block.type === "SectionBlock") {
      const p = block.props as SectionBlockProps;
      if (p.title && p.level) {
        headings.push({
          id: slugify(p.title),
          title: p.title,
          level: p.level as HeadingLevel,
        });
      }
      if (p.children?.length) {
        headings.push(...extractHeadings(p.children));
      }
    }
  }
  return headings;
};

const items = computed(() => {
  const all = extractHeadings(props.pageBlocks ?? []);
  return all.filter((h) => props.levels.includes(h.level));
});

// Active State Observer
onMounted(() => {
  watch(
    () => items.value,
    (newItems) => {
      newItems.forEach((item) => {
        const el = defaultDocument?.getElementById(item.id);
        if (!el) return;

        useIntersectionObserver(
          el,
          (entries) => {
            // Type-safe access to the first entry
            const entry = entries?.[0];

            if (entry?.isIntersecting) {
              activeId.value = item.id;
            }
          },
          {
            // Adjust rootMargin to detect the section when it's in the top third of the screen
            rootMargin: "-80px 0px -80% 0px",
            threshold: 0,
          },
        );
      });
    },
    { immediate: true },
  );
});
</script>

<template>
  <nav :class="nav({ class: rc.nav })" aria-label="Table of Contents">
    <h5 v-if="title">
      {{ t(title) }}
    </h5>

    <ul v-if="items.length > 0" :class="list({ class: rc.list })">
      <li v-for="item in items" :key="item.id">
        <NuxtLink
          :to="{ hash: `#${item.id}` }"
          :class="
            pageTOCStyles({ active: activeId === item.id, level: item.level }).link({
              class: rc.link,
            })
          "
        >
          <span :class="text({ class: rc.text })">
            {{ item.title }}
          </span>
        </NuxtLink>
      </li>
    </ul>

    <slot name="bottom" />
  </nav>
</template>

<style scoped></style>
