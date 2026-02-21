<script setup lang="ts">
import { computed, provide, watch } from "vue";
import { type Page, type PageSurround } from "../../types";
import { getLocalizedContent, syncPageWithDefinition } from "../../utils";
import { useI18n } from "vue-i18n";
import { usePageRegistry, useRC } from "../../composables";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface PageRendererProps {
  useSurround?: boolean;
  surround?: PageSurround | null;
  surroundStatus?: "idle" | "pending" | "success" | "error";
  resolvePage: (id: string) => Promise<Pick<Page, "title" | "icon" | "slug">>;
  canEdit?: boolean;
  editUrl?: string;
  rc?: {
    container?: string;
    grid?: string;
    toc?: string;
    properties?: string;
    contentWrapper?: string;
    banner?: string;
    icon?: string;
    title?: string;
    surroundSkeleton?: string;
    skeleton?: string;
    metadata?: string;
  };
}

const {
  useSurround = false,
  surroundStatus = "idle",
  surround = null,
  resolvePage,
  canEdit = false,
  editUrl,
  rc: rcProp,
} = defineProps<PageRendererProps>();

const { rc } = useRC("PageRenderer", rcProp);

provide("page-resolver", resolvePage);
/*endregion */

/* region Emits */
export interface PageRendererEmits {}

const emit = defineEmits<PageRendererEmits>();
/* endregion */

/* region Slots */
export interface PageRendererSlots {}

const slots = defineSlots<PageRendererSlots>();
/* endregion */

/* region Styles */
const pageRendererStyles = tv({
  slots: {
    container: "flex flex-col py-16",
    grid: "grid grid-cols-1 lg:grid-cols-24 gap-xl items-start",
    toc: "hidden lg:flex lg:col-span-4 sticky top-16",
    properties: "order-1 lg:order-2 lg:col-span-6",
    contentWrapper: "order-2 lg:order-1 lg:col-span-14 flex flex-col gap-xl",
    banner: "rounded-xl w-full object-cover",
    icon: "rounded-full w-12 h-12 object-cover",
    title: "",
    surroundSkeleton: "grid grid-cols-1 gap-md sm:grid-cols-2",
    skeleton: "h-48 w-full rounded-xl",
    metadata: "flex flex-col gap-xs text-xs text-dimmed p-lg",
    headerTitleWrapper: "flex flex-row gap-sm",
  },
});

const {
  container,
  grid,
  toc,
  properties,
  contentWrapper,
  banner,
  icon,
  title: titleStyle,
  surroundSkeleton,
  skeleton,
  metadata,
  headerTitleWrapper,
} = pageRendererStyles();
type PageRendererVariants = VariantProps<typeof pageRendererStyles>;
/* endregion */

/* region Meta */
defineOptions({
  name: "PageRenderer",
});
/* endregion */

/* region State */
const page = defineModel<Page>({ required: true });

const { getTypeLabelKey, definitions } = usePageRegistry();
const { t, locale } = useI18n();

const currentDefinition = computed(() => {
  if (!page.value?.type || !definitions) return null;
  const typeKey = Object.keys(definitions).find(
    (k) => k.toLowerCase() === page.value.type.toLowerCase(),
  );
  return typeKey ? (definitions as any)[typeKey] : null;
});

const previousPage = computed(() => surround?.previous);
const nextPage = computed(() => surround?.next);
const hasSurround = computed(() => !!(surround?.previous || surround?.next));
/* endregion */

/* region Lifecycle */
watch(
  [() => page.value?.id, () => page.value?.type, currentDefinition],
  () => {
    if (page.value && currentDefinition.value) {
      console.log("[PageRenderer] Syncing page with definition", page.value.id);
      syncPageWithDefinition(page.value, currentDefinition.value);
    }
  },
  { immediate: true },
);
/* endregion */

/* region Logic */
function getLabel(key: string) {
  return t(getTypeLabelKey(key as any));
}
/* endregion */
</script>

<template>
  <UContainer v-if="page" :class="container({ class: rc.container })">
    <div :class="grid({ class: rc.grid })">
      <div :class="toc({ class: rc.toc })">
        <RCPageTOC :page-blocks="page.blocks" />
      </div>

      <div :class="properties({ class: rc.properties })">
        <RCPagePropertiesRenderer v-model="page" :can-edit="canEdit" :edit-url="editUrl" />
        <div :class="metadata({ class: rc.metadata })">
          <p v-if="page.id">ID: {{ page.id }}</p>
          <p v-if="page.createdAt">Created: {{ page.createdAt }}</p>
          <p v-if="page.updatedAt">Updated: {{ page.updatedAt }}</p>
        </div>
      </div>

      <div :class="contentWrapper({ class: rc.contentWrapper })">
        <UCard v-if="page.banner?.src" variant="naked">
          <NuxtImg :src="page.banner.src" :class="banner({ class: rc.banner })" />
        </UCard>

        <div class="flex flex-col gap-md">
          <div :class="headerTitleWrapper()">
            <NuxtImg v-if="page.icon?.src" :src="page.icon.src" :class="icon({ class: rc.icon })" />
            <h1 :class="titleStyle({ class: rc.title })">
              {{ getLocalizedContent(page.title, locale) }}
            </h1>
          </div>

          <p v-if="page.description" class="text-lg text-dimmed">
            {{ getLocalizedContent(page.description, locale) }}
          </p>

          <UBadge v-if="page.type" variant="subtle" color="neutral" size="md" class="w-fit">
            {{ getLabel(page.type) }}
          </UBadge>
        </div>

        <USeparator />

        <RCBlockViewRenderer :blocks="page.blocks!" />

        <template v-if="useSurround">
          <USeparator />
          <div
            v-if="surroundStatus === 'pending'"
            :class="surroundSkeleton({ class: rc.surroundSkeleton })"
          >
            <USkeleton :class="skeleton({ class: rc.skeleton })" />
            <USkeleton :class="skeleton({ class: rc.skeleton })" />
          </div>
          <div
            v-else-if="surroundStatus === 'success' && hasSurround"
            class="grid grid-cols-1 gap-md sm:grid-cols-2"
          >
            <RCPageSurround
              v-if="previousPage"
              :pageType="getTypeLabelKey(page.type)"
              :previousTitle="getLocalizedContent(previousPage?.title, locale)"
              :previousDescription="getLocalizedContent(previousPage?.description, locale)"
              :previousTo="`/${previousPage?.slug}`"
            />
            <div v-else />
            <RCPageSurround
              v-if="nextPage"
              :pageType="getTypeLabelKey(page.type)"
              :nextTitle="getLocalizedContent(nextPage?.title, locale)"
              :nextDescription="getLocalizedContent(nextPage?.description, locale)"
              :nextTo="`/${nextPage?.slug}`"
            />
          </div>
        </template>
      </div>
    </div>
  </UContainer>
</template>

<style scoped></style>
