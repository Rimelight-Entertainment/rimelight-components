<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRC } from "../../../composables"
import { tv } from "../../../internal/tv"
import { getLocalizedContent } from "../../../utils"
import { useI18n } from "vue-i18n"
import type { Page } from "../../../types"

export interface PageTreeModalProps {
  loading?: boolean
  pages?: Pick<Page, "title" | "slug">[]
  rc?: {
    header?: string
    headerTitle?: string
    closeButton?: string
    body?: string
    footer?: string
  }
}

const open = defineModel<boolean>("open", { default: false })
const { loading, pages = [], rc: rcProp } = defineProps<PageTreeModalProps>()

export interface PageTreeModalEmits {
  close: []
  navigate: [slug: string]
}

const emit = defineEmits<PageTreeModalEmits>()

const { rc } = useRC("PageTreeModal", rcProp)
const { t, locale } = useI18n()

const pageTreeModalStyles = tv({
  slots: {
    header: "flex items-center justify-between",
    headerTitle: "text-base font-semibold leading-6",
    closeButton: "-my-1",
    body: "p-0 min-h-[300px] max-h-[60vh] overflow-y-auto",
    footer: "flex justify-end gap-2"
  }
})

const { header: headerClass, headerTitle, closeButton, body, footer } = pageTreeModalStyles()

interface TreeItem {
  label: string
  icon?: string
  slug?: string
  children?: TreeItem[]
  defaultExpanded?: boolean
}

const treeItems = computed<TreeItem[]>(() => {
  if (!pages || pages.length === 0) return []

  const nodeMap = new Map<string, TreeItem>()
  const rootNodes: TreeItem[] = []

  // Helper to get or create node
  const getNode = (path: string, partLabel: string, pageObj?: Pick<Page, "title" | "slug">) => {
    if (!nodeMap.has(path)) {
      const label = pageObj
        ? (getLocalizedContent(pageObj.title, locale.value) || partLabel)
        : (partLabel.charAt(0).toUpperCase() + partLabel.slice(1))

      const newNode: TreeItem = {
        label,
        slug: pageObj ? pageObj.slug : undefined,
        icon: pageObj ? 'i-lucide-file' : 'i-lucide-folder',
        children: []
      }
      nodeMap.set(path, newNode)
    } else if (pageObj) {
      // Upgrade virtual node to real page
      const node = nodeMap.get(path)!
      node.label = getLocalizedContent(pageObj.title, locale.value) || node.label
      node.slug = pageObj.slug
      node.icon = 'i-lucide-file-text' // distinct icon for page that might have children
    }
    return nodeMap.get(path)!
  }

  // Iterate over all pages to build the tree
  pages.forEach(page => {
    const parts = page.slug.split('/').filter(Boolean)
    let currentPath = ''
    let parent: TreeItem | null = null

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isLast = index === parts.length - 1
      const pageObj = isLast ? page : undefined
      
      const node = getNode(currentPath, part, pageObj)

      if (index === 0) {
        if (!rootNodes.includes(node)) {
          rootNodes.push(node)
        }
      } else {
        if (parent && !parent.children?.includes(node)) {
           if (!parent.children) parent.children = []
           parent.children.push(node)
        }
      }
      parent = node
    })
  })

  // Sort nodes
  const sortNodes = (nodes: TreeItem[]) => {
    nodes.sort((a, b) => a.label.localeCompare(b.label))
    nodes.forEach(n => {
      if (n.children && n.children.length > 0) {
        sortNodes(n.children)
      }
    })
  }

  sortNodes(rootNodes)
  return rootNodes
})

const handleSelect = (node: TreeItem) => {
    if (node.slug) {
        emit('navigate', node.slug)
        open.value = false
    }
}

// UTree requires keys
const getKey = (item: TreeItem) => item.slug || item.label

</script>

<template>
  <UModal v-model:open="open">
    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <div :class="headerClass({ class: rc.header })">
          <h3 :class="headerTitle({ class: rc.headerTitle })">Page Hierarchy</h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            :class="closeButton({ class: rc.closeButton })"
            @click="open = false"
          />
        </div>
      </template>

      <div :class="body({ class: rc.body })">
        <div v-if="loading" class="p-4 flex justify-center">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
        </div>
        <div v-else-if="treeItems.length === 0" class="p-4 text-center text-gray-500">
            No pages found directly.
        </div>
        <UTree 
            v-else
            :items="treeItems" 
            :ui="{ item: 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' }"
        >
             <template #item="{ item }">
                <div class="flex items-center gap-2 py-1 w-full" @click="handleSelect(item)">
                    <UIcon :name="item.icon || (item.children?.length ? 'i-lucide-folder' : 'i-lucide-file')" class="w-4 h-4 text-gray-400" />
                    <span :class="{'text-gray-900 dark:text-gray-100': item.slug, 'text-gray-500 font-medium': !item.slug}">
                        {{ item.label }}
                    </span>
                    <UIcon v-if="item.slug" name="i-heroicons-arrow-right-20-solid" class="w-3 h-3 ml-auto text-gray-300 opacity-0 group-hover:opacity-100" />
                </div>
             </template>
        </UTree>
      </div>

      <template #footer>
        <div :class="footer({ class: rc.footer })">
          <UButton color="neutral" variant="ghost" label="Close" @click="open = false" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
