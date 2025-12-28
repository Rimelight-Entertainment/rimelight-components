<script setup lang="ts">
import {ref, computed, useTemplateRef, provide} from "vue"
import { type Page, type PageSurround, type PageDefinition } from "../../types"
import { usePageEditor, usePageRegistry, useRC } from "../../composables"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "vue-i18n"
import { tv } from "../../utils/tv"

export interface PageEditorProps {
  isSaving: boolean
  useSurround?: boolean
  surround?: PageSurround | null
  surroundStatus?: 'idle' | 'pending' | 'success' | 'error'
  resolvePage: (id: string) => Promise<Pick<Page, 'title' | 'icon' | 'slug'>>
  pageDefinitions: Record<string, PageDefinition>
  onCreatePage?: (page: Partial<Page>) => Promise<void>
  onDeletePage?: (id: string) => Promise<void>
  rc?: {
    header?: string
    headerGroup?: string
    splitContainer?: string
    editorColumn?: string
    container?: string
    grid?: string
    toc?: string
    properties?: string
    contentWrapper?: string
    banner?: string
    icon?: string
    title?: string
    surroundSkeleton?: string
    skeleton?: string
    metadata?: string
    resizer?: string
    previewColumn?: string
  }
}

const {
  isSaving,
  useSurround = false,
  surroundStatus = 'idle',
  surround = null,
  resolvePage,
  onCreatePage,
  onDeletePage,
  rc: rcProp
} = defineProps<PageEditorProps>()

const page = defineModel<Page>({ required: true })

export interface PageEditorEmits {
  save: [value: Page]
}

const emit = defineEmits<PageEditorEmits>()

export interface PageEditorSlots {}

const slots = defineSlots<PageEditorSlots>()

const { rc } = useRC('PageEditor', rcProp)

const pageEditorStyles = tv({
  slots: {
    header: "h-12 w-full bg-muted",
    headerGroup: "flex items-center gap-xs",
    splitContainer: "flex w-full overflow-hidden",
    editorColumn: "h-full overflow-y-auto",
    container: "flex flex-col py-16",
    grid: "grid grid-cols-1 lg:grid-cols-24 gap-xl items-start",
    toc: "hidden lg:flex lg:col-span-4 sticky top-20 self-start",
    properties: "order-1 lg:order-2 lg:col-span-6",
    contentWrapper: "order-2 lg:order-1 lg:col-span-14 flex flex-col gap-xl",
    banner: "rounded-xl w-full object-cover",
    icon: "rounded-full w-12 h-12 object-cover",
    title: "",
    surroundSkeleton: "grid grid-cols-1 gap-md sm:grid-cols-2",
    skeleton: "h-48 w-full rounded-xl",
    metadata: "flex flex-col gap-xs text-xs text-dimmed p-xl",
    resizer: "relative flex flex-col items-center justify-center w-6 cursor-col-resize group px-1 py-16",
    previewColumn: "h-full overflow-y-auto"
  }
})

const {
  header,
  headerGroup,
  splitContainer,
  editorColumn,
  container,
  grid,
  toc,
  properties,
  contentWrapper,
  banner,
  icon,
  title: titleClass,
  surroundSkeleton,
  skeleton,
  metadata,
  resizer,
  previewColumn
} = pageEditorStyles()

const { getTypeLabelKey } = usePageRegistry();
const { t, locale } = useI18n()

const { undo, redo, canUndo, canRedo, captureSnapshot } = usePageEditor(page)

const handleSave = () => {
  const dataToPersist = JSON.parse(JSON.stringify(page.value))
  emit("save", dataToPersist)
}

defineExpose({
  undo,
  redo,
  canUndo,
  canRedo,
})

const editorRef = useTemplateRef('editor')

const showPreview = ref(false)

provide('page-resolver', resolvePage)

const previousPage = computed(() => surround?.previous)
const nextPage = computed(() => surround?.next)
const hasSurround = computed(() => !!(surround?.previous || surround?.next))

const containerRef = useTemplateRef<HTMLElement>('split-container')
const editorWidth = ref(50)
const isResizing = ref(false)
const SNAP_THRESHOLD = 1.5 // Snap if within 1.5% of the center

const handleMouseMove = (e: MouseEvent) => {
  if (!isResizing.value || !containerRef.value) return

  const containerRect = containerRef.value.getBoundingClientRect()
  let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

  // Constrain bounds
  newWidth = Math.min(Math.max(newWidth, 20), 80)

  // Snap logic: if near 50%, lock it to 50%
  if (Math.abs(newWidth - 50) < SNAP_THRESHOLD) {
    editorWidth.value = 50
  } else {
    editorWidth.value = newWidth
  }
}

const cursorClass = computed(() => {
  if (isResizing.value) return 'cursor-grabbing'
  return 'cursor-grab'
})

const startResizing = (e: MouseEvent) => {
  isResizing.value = true
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopResizing)

  // Visual feedback
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const stopResizing = () => {
  isResizing.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopResizing)

  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

/* Handlers */

// Create Page
const isCreateModalOpen = ref(false)
const isCreating = ref(false)

const handleCreateConfirm = async (newPageData: Partial<Page>) => {
  if (!onCreatePage) return

  try {
    isCreating.value = true
    await onCreatePage(newPageData)
    isCreateModalOpen.value = false
  } finally {
    isCreating.value = false
  }
}

// Delete Page
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

const handleDeleteConfirm = async () => {
  if (!onDeletePage || !page.value.id) return

  try {
    isDeleting.value = true
    await onDeletePage(page.value.id)
    isDeleteModalOpen.value = false
  } catch (err) {
    console.error("Failed to delete page:", err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <RCHeaderLayer id="editor-header" :order="3">
    <UHeader :class="header({ class: rc.header })">
      <template #left>
        <div :class="headerGroup({ class: rc.headerGroup })">
          <UButton
            icon="lucide:rotate-ccw"
            variant="outline"
            color="neutral"
            size="xs"
            :disabled="!canUndo"
            @click="undo"
          />
          <UButton
            icon="lucide:rotate-cw"
            variant="outline"
            color="neutral"
            size="xs"
            :disabled="!canRedo"
            @click="redo"
          />
        </div>
      </template>

      <template #right>
        <div :class="headerGroup({ class: rc.headerGroup })">
          <UButton
            :icon="showPreview ? 'lucide:eye-off' : 'lucide:eye'"
            label="Preview"
            variant="outline"
            color="neutral"
            size="xs"
            @click="showPreview = !showPreview"
          />
          <UButton
            icon="lucide:save"
            label="Save"
            color="primary"
            size="xs"
            :loading="isSaving"
            @click="handleSave"
          />
          <RCCreatePageModal
            :is-open="isCreateModalOpen"
             :definitions="pageDefinitions"
             :loading="isCreating"
             @close="isCreateModalOpen = false"
             @confirm="handleCreateConfirm"
          >
            <UButton
              icon="lucide:file-plus"
              label="Create Page"
              color="primary"
              size="xs"
            />
          </RCCreatePageModal>
          <RCDeletePageModal
            :is-open="isDeleteModalOpen"
            :loading="isDeleting"
            :page-title="getLocalizedContent(page.title, locale)"
            @close="isDeleteModalOpen = false"
            @confirm="handleDeleteConfirm"
          >
            <UButton
              icon="lucide:file-plus"
              label="Delete Page"
              color="error"
              size="xs"
            />
          </RCDeletePageModal>
        </div>
      </template>
    </UHeader>
  </RCHeaderLayer>

  <div
    ref="split-container"
    :class="splitContainer({ class: rc.splitContainer })"
  >
    <div
      :class="editorColumn({ class: rc.editorColumn })"
      :style="{ width: showPreview ? `${editorWidth}%` : '100%' }"
    >
      <UContainer :class="container({ class: rc.container })">
        <div :class="grid({ class: rc.grid })">
          <RCPageTOC
            :page-blocks="page.blocks"
            :levels="[2, 3, 4]"
            :class="toc({ class: rc.toc })"
          >
              <template #bottom> </template>
            </RCPageTOC>
          <RCPagePropertiesEditor v-model="page" :class="properties({ class: rc.properties })" />
          <div :class="contentWrapper({ class: rc.contentWrapper })">
            <RCImage
              v-if="page.banner?.src"
              :src="page.banner?.src"
              :alt="page.banner?.alt"
              :class="banner({ class: rc.banner })"
            />
            <UPageHeader
              :headline="t(getTypeLabelKey(page.type))"
              :description="getLocalizedContent(page.description, 'en') ?? ''"
              :ui="{ root: 'pt-0' }"
            >
              <template #title>
                <div class="flex flex-row gap-sm">
                  <RCImage
                    v-if="page.icon?.src"
                    :src="page.icon?.src"
                    :alt="page.icon?.alt"
                    :class="icon({ class: rc.icon })"
                  />
                  <h1 :class="titleClass({ class: rc.title })">{{ getLocalizedContent(page.title, locale) }}</h1>
                </div>
              </template>
            </UPageHeader>
            <RCBlockEditor
              ref="editor"
              v-model="page.blocks"
              @mutation="captureSnapshot"
            />
            <template v-if="useSurround">
              <div v-if="surroundStatus === 'pending'" :class="surroundSkeleton({ class: rc.surroundSkeleton })">
                <USkeleton :class="skeleton({ class: rc.skeleton })" />
                <USkeleton :class="skeleton({ class: rc.skeleton })" />
              </div>

              <LazyRCPageSurround
                v-else-if="surroundStatus === 'success' && hasSurround"
                hydrate-on-visible
                :pageType="getTypeLabelKey(page.type)"
                :previousTitle="getLocalizedContent(previousPage?.title, locale)"
                :previousDescription="getLocalizedContent(previousPage?.description, locale)"
                :previousTo="`/${previousPage?.slug}`"
                :nextTitle="getLocalizedContent(nextPage?.title, locale)"
                :nextDescription="getLocalizedContent(nextPage?.description, locale)"
                :nextTo="`/${nextPage?.slug}`"
              />

              <USeparator />

              <div :class="metadata({ class: rc.metadata })">
                <h6>Metadata</h6>
                <span>Page ID: {{ page.id }}</span>
                <span
                >Created At:
              <NuxtTime
                :datetime="page.created_at ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
              /></span>
                <span
                >Posted At:
              <NuxtTime
                :datetime="page.created_at ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
              /></span>
                <span
                >Updated At:
              <NuxtTime
                :datetime="page.created_at ?? ''"
                year="numeric"
                month="numeric"
                day="numeric"
                hour="numeric"
                minute="numeric"
                second="numeric"
                time-zone-name="short"
              /></span>
              </div>
            </template>
          </div>
        </div>
      </UContainer>
    </div>

    <div
      v-if="showPreview"
      :class="[cursorClass, resizer({ class: rc.resizer })]"
      @mousedown="startResizing"
      @dblclick="editorWidth = 50"
    >
      <USeparator orientation="vertical" />
    </div>

    <div
      v-if="showPreview"
      :class="previewColumn({ class: rc.previewColumn })"
      :style="{ width: `${100 - editorWidth}%` }"
    >
      <RCPageRenderer v-model="page" :resolve-page="resolvePage" />
    </div>
  </div>
</template>

<style scoped>

</style>
