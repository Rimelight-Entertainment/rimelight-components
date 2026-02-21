<script setup lang="ts">
import { computed, ref } from "vue";
import { useRC } from "../../../composables";
import { tv } from "../../../internal/tv";
import { getLocalizedContent } from "../../../utils";
import { useI18n } from "vue-i18n";
import type { Page } from "../../../types";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface TreeItem {
  label: string;
  icon?: string;
  slug?: string;
  path: string;
  children?: TreeItem[];
  defaultExpanded?: boolean;
}

export interface PageTreeModalProps {
  loading?: boolean;
  pages?: Pick<Page, "title" | "slug">[];
  rc?: {
    header?: string;
    headerTitle?: string;
    closeButton?: string;
    body?: string;
    footer?: string;
  };
}

const { loading, pages = [], rc: rcProp } = defineProps<PageTreeModalProps>();

const { rc } = useRC("PageTreeModal", rcProp);
/* endregion */

/* region Emits */
export interface PageTreeModalEmits {
  close: [];
  navigate: [slug: string];
}

const emit = defineEmits<PageTreeModalEmits>();
/* endregion */

/* region Slots */
export interface PageTreeModalSlots {}

const slots = defineSlots<PageTreeModalSlots>();
/* endregion */

/* region Styles */
const pageTreeModalStyles = tv({
  slots: {
    headerClass: "flex items-center justify-between",
    headerTitleClass: "text-base font-semibold leading-6",
    closeButtonClass: "-my-1",
    bodyClass: "p-0 min-h-[300px] max-h-[60vh] overflow-y-auto",
    footerClass: "flex justify-end gap-2",
    loadingWrapper: "p-4 flex justify-center",
    emptyWrapper: "p-4 text-center text-gray-500",
    itemWrapper: "flex items-center gap-2 py-1 w-full",
    itemLabel: "",
  },
});

const {
  headerClass,
  headerTitleClass,
  closeButtonClass,
  bodyClass,
  footerClass,
  loadingWrapper,
  emptyWrapper,
  itemWrapper,
} = pageTreeModalStyles();
type PageTreeModalVariants = VariantProps<typeof pageTreeModalStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });

const { t, locale } = useI18n();

const treeItems = computed<TreeItem[]>(() => {
  if (!pages || pages.length === 0) return [];

  const nodeMap = new Map<string, TreeItem>();
  const rootNodes: TreeItem[] = [];

  // Helper to get or create node
  const getNode = (path: string, partLabel: string, pageObj?: Pick<Page, "title" | "slug">) => {
    if (!nodeMap.has(path)) {
      const label = pageObj
        ? getLocalizedContent(pageObj.title, locale.value) || partLabel
        : partLabel.charAt(0).toUpperCase() + partLabel.slice(1);

      const newNode: TreeItem = {
        label,
        path,
        slug: pageObj ? pageObj.slug : undefined,
        icon: pageObj ? "lucide:file" : "lucide:folder",
        children: [],
      };
      nodeMap.set(path, newNode);
    } else if (pageObj) {
      // Upgrade virtual node to real page
      const node = nodeMap.get(path)!;
      node.label = getLocalizedContent(pageObj.title, locale.value) || node.label;
      node.slug = pageObj.slug;
      node.icon = "lucide:file-text"; // distinct icon for page that might have children
    }
    return nodeMap.get(path)!;
  };

  // Iterate over all pages to build the tree
  pages.forEach((page) => {
    const parts = page.slug.split("/").filter(Boolean);
    let currentPath = "";
    let parent: TreeItem | null = null;

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = index === parts.length - 1;
      const pageObj = isLast ? page : undefined;

      const node = getNode(currentPath, part, pageObj);

      if (index === 0) {
        if (!rootNodes.includes(node)) {
          rootNodes.push(node);
        }
      } else {
        if (parent && !parent.children?.includes(node)) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      }
      parent = node;
    });
  });

  // Sort and process hierarchy
  const processNodes = (nodes: TreeItem[]) => {
    nodes.sort((a, b) => a.label.localeCompare(b.label));

    for (const node of nodes) {
      // If this node is both a page AND has children, we add a synthetic child
      // so the parent can act as a folder (toggle only) and the child as the page link.
      if (node.slug && node.children && node.children.length > 0) {
        const indexNode: TreeItem = {
          label: node.label, // Or t('common.overview') / same name
          slug: node.slug,
          path: `${node.path}:index`,
          icon: "lucide:file-text",
          children: [],
        };
        node.children.unshift(indexNode);

        // Convert parent to folder-only
        node.slug = undefined;
        node.icon = "lucide:folder";
      }

      if (node.children && node.children.length > 0) {
        processNodes(node.children);
      }
    }
  };

  processNodes(rootNodes);
  return rootNodes;
});
/* endregion */

/* region Meta */
defineOptions({
  name: "PageTreeModal",
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
/* endregion */

/* region Logic */
const handleSelect = (node: TreeItem) => {
  if (node.slug) {
    emit("navigate", node.slug);
    open.value = false;
  }
};

// UTree requires keys
const getKey = (item: TreeItem) => item.path;
/* endregion */
</script>

<template>
  <UModal v-model:open="open" title="Page Hierarchy" description="Navigate through your pages">
    <template #content>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <template #header>
          <div :class="headerClass({ class: rc.header })">
            <h3 :class="headerTitleClass({ class: rc.headerTitle })">Page Hierarchy</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              :class="closeButtonClass({ class: rc.closeButton })"
              @click="open = false"
            />
          </div>
        </template>

        <div :class="bodyClass({ class: rc.body })">
          <div v-if="loading" :class="loadingWrapper()">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          </div>
          <div v-else-if="treeItems.length === 0" :class="emptyWrapper()">
            No pages found directly.
          </div>
          <UTree
            v-else
            :items="treeItems"
            :get-key="getKey"
            :ui="{
              item: 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
              linkLabel: 'w-full',
            }"
            @select="(e: Event, item: TreeItem) => handleSelect(item)"
          >
            <template #item-label="{ item }">
              <div :class="itemWrapper()">
                <span
                  :class="{
                    'text-gray-900 dark:text-gray-100 font-medium': item.slug,
                    'text-gray-400': !item.slug,
                  }"
                >
                  {{ item.label }}
                </span>
                <UIcon
                  v-if="item.slug"
                  name="i-heroicons-arrow-right-20-solid"
                  class="w-3 h-3 ml-auto text-gray-300 opacity-0 group-hover:opacity-100"
                />
              </div>
            </template>
          </UTree>
        </div>

        <template #footer>
          <div :class="footerClass({ class: rc.footer })">
            <UButton color="neutral" variant="ghost" label="Close" @click="open = false" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped></style>
