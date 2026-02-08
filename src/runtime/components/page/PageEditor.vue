<script setup lang="ts">
import { ref, computed, useTemplateRef, provide } from "vue"
import { navigateTo } from "#imports"
import { type Page, type PageSurround, type PageDefinition, type PageVersion } from "../../types"
import { usePageEditor, usePageRegistry, useRC, useHeaderStack, useConfirm } from "../../composables"
import { getLocalizedContent } from "../../utils"
import { useI18n } from "vue-i18n"
import { tv } from "../../internal/tv"

export interface PageEditorProps {
  isSaving: boolean
  useSurround?: boolean
  surround?: PageSurround | null
  surroundStatus?: 'idle' | 'pending' | 'success' | 'error'
  resolvePage: (id: string) => Promise<Pick<Page, 'title' | 'icon' | 'slug'>>
  pageDefinitions: Record<string, PageDefinition>
  onDeletePage?: (id: string) => Promise<void>
  onFetchPages?: () => Promise<Pick<Page, 'title' | 'slug'>[]>
  onNavigateToPage?: (slug: string) => void
  onViewPage?: (slug: string) => void
  currentVersionId?: string | null
  isViewingVersion?: boolean
  isAdmin?: boolean
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
  onDeletePage,
  onFetchPages,
  onNavigateToPage,
  onViewPage,
  currentVersionId = null,
  isViewingVersion = false,
  isAdmin = false,
  rc: rcProp
} = defineProps<PageEditorProps>()

const page = defineModel<Page>({ required: true })
const versionId = defineModel<string | null>("currentVersionId", { default: null })

export interface PageEditorEmits {
  save: [value: Page]
  'version-navigate': [version: PageVersion]
  'version-approved': [version: PageVersion]
  'version-reverted': [version: PageVersion]
}

const emit = defineEmits<PageEditorEmits>()

export interface PageEditorSlots {
  'header-actions'?: (props: {}) => any
}

const slots = defineSlots<PageEditorSlots>()

const { rc } = useRC('PageEditor', rcProp)

const pageEditorStyles = tv({
  slots: {
    header: "h-12 w-full bg-muted",
    headerGroup: "flex items-center gap-xs",
    splitContainer: "flex w-full min-h-0",
    editorColumn: "relative",
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
    metadata: "flex flex-col gap-xs text-xs text-dimmed p-lg",
    resizer: "sticky flex flex-col items-center justify-center w-6 cursor-col-resize group px-1 py-16 self-start",
    previewColumn: "sticky self-start overflow-y-auto min-h-0"
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

const { undo, redo, canUndo, canRedo, captureSnapshot, resetHistory } = usePageEditor(page)
const { confirm } = useConfirm()

const handleViewPage = async () => {
  if (canUndo.value) {
    const confirmed = await confirm({
      title: t("page_editor.unsaved_changes_title"),
      description: t("page_editor.unsaved_changes_description"),
      confirmLabel: t("page_editor.leave_anyway"),
      cancelLabel: t("common.cancel"),
      danger: true,
    })
    if (!confirmed) return
  }

  if (onViewPage) {
    onViewPage(page.value.slug)
  } else {
    navigateTo(`/${page.value.slug}`)
  }
}

const handleSave = () => {
  const dataToPersist = JSON.parse(JSON.stringify(page.value))
  emit("save", dataToPersist)
}

defineExpose({
  undo,
  redo,
  canUndo,
  canRedo,
  resetHistory,
})

const editorRef = useTemplateRef('editor')

const showPreview = ref(false)

provide('page-resolver', resolvePage)

const previousPage = computed(() => surround?.previous)
const nextPage = computed(() => surround?.next)
const hasSurround = computed(() => !!(surround?.previous || surround?.next))

const { totalHeight } = useHeaderStack()

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

const isPageTreeModalOpen = ref(false)
const isFetchingTree = ref(false)
const treePages = ref<Pick<Page, 'title' | 'slug'>[]>([])

const handleOpenTree = async () => {
  if (!onFetchPages) return
  isFetchingTree.value = true
  try {
    treePages.value = await onFetchPages()
    isPageTreeModalOpen.value = true
  } catch (e) {
    console.error("Failed to fetch pages for tree", e)
  } finally {
    isFetchingTree.value = false
  }
}

const handleTreeNavigate = (slug: string) => {
  if (onNavigateToPage) {
    onNavigateToPage(slug)
  }
}
</script>

<template>
  <div
    v-if="isViewingVersion"
    class="fixed top-12 left-0 right-0 z-40 bg-warning-500 text-white px-4 py-2 text-sm text-center"
  >
    <div class="flex items-center justify-center gap-2">
      <UIcon name="lucide:eye" />
      <span>{{ t('page_editor.viewing_version_notice') }}</span>
      <UButton
        icon="lucide:x"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="versionId = null"
      />
    </div>
  </div>

  <RCHeaderLayer id="editor-header" :order="3">
    <RCHeader :contain="false" :class="header({ class: rc.header })">
      <template #left>
        <div :class="headerGroup({ class: rc.headerGroup })">
          <UButton
            icon="lucide:list-tree"
            variant="ghost"
            color="neutral"
            size="xs"
            :loading="isFetchingTree"
            :disabled="!onFetchPages"
            @click="handleOpenTree"
          />

          <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
            {{ t('common.editing', 'Editing') }}: <span class="text-neutral-900 dark:text-white">{{ getLocalizedContent(page.title, locale) }}</span>
          </span>

          <USeparator orientation="vertical" class="h-4 mx-1" />

          <RCPageVersionSelector
            v-if="page.id"
            v-model:current-version-id="versionId"
            :page-id="page.id"
            :is-admin="isAdmin"
            @version-selected="(v: any) => emit('version-navigate', v)"
            @version-approved="(v: any) => emit('version-approved', v)"
            @version-reverted="(v: any) => emit('version-reverted', v)"
          />
        
          <UButton
            icon="lucide:rotate-ccw"
            variant="ghost"
            color="neutral"
            size="xs"
            :disabled="!canUndo"
            @click="undo"
          />
          <UButton
            icon="lucide:rotate-cw"
            variant="ghost"
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
            icon="lucide:external-link"
            :label="t('page_editor.view_page')"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="handleViewPage"
          />
          <UButton
            :icon="showPreview ? 'lucide:eye-off' : 'lucide:eye'"
            :label="t('page_editor.preview')"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="showPreview = !showPreview"
          />

          <USeparator orientation="vertical" class="h-4 mx-1" />

          <slot name="header-actions" />

          <UButton
            icon="lucide:save"
            :label="t('page_editor.save')"
            color="primary"
            size="xs"
            :loading="isSaving"
            @click="handleSave"
          />

          <UDropdownMenu
            :items="[
              [
                {
                  label: t('page_editor.delete_page'),
                  icon: 'lucide:trash-2',
                  color: 'error' as const,
                  onSelect: () => (isDeleteModalOpen = true)
                }
              ]
            ]"
          >
            <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
          </UDropdownMenu>
        </div>
      </template>
    </RCHeader>
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
          <RCPageTOC :page-blocks="page.blocks" :levels="[2, 3, 4]" :class="toc({ class: rc.toc })">
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
                  <h1 :class="titleClass({ class: rc.title })">
                    {{ getLocalizedContent(page.title, locale) }}
                  </h1>
                </div>
              </template>
            </UPageHeader>
            <RCBlockEditor ref="editor" v-model="page.blocks" @mutation="captureSnapshot" />
            <template v-if="useSurround">
              <div
                v-if="surroundStatus === 'pending'"
                :class="surroundSkeleton({ class: rc.surroundSkeleton })"
              >
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
                <h6>{{ t('page_editor.metadata') }}</h6>
                <span>{{ t('page_editor.page_id') }}: {{ page.id }}</span>
                <span
                  >{{ t('page_editor.created_at') }}:
                  <NuxtTime
                    :datetime="page.createdAt ?? ''"
                    year="numeric"
                    month="numeric"
                    day="numeric"
                    hour="numeric"
                    minute="numeric"
                    second="numeric"
                    time-zone-name="short"
                /></span>
                <span
                  >{{ t('page_editor.posted_at') }}:
                  <NuxtTime
                    :datetime="page.createdAt ?? ''"
                    year="numeric"
                    month="numeric"
                    day="numeric"
                    hour="numeric"
                    minute="numeric"
                    second="numeric"
                    time-zone-name="short"
                /></span>
                <span
                  >{{ t('page_editor.updated_at') }}:
                  <NuxtTime
                    :datetime="page.createdAt ?? ''"
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
      :style="{ top: `${totalHeight}px`, height: `calc(100vh - ${totalHeight}px)` }"
      @mousedown="startResizing"
      @dblclick="editorWidth = 50"
    >
      <USeparator orientation="vertical" />
    </div>

    <div
      v-if="showPreview"
      :class="previewColumn({ class: rc.previewColumn })"
      :style="{ 
        width: `${100 - editorWidth}%`, 
        top: `${totalHeight}px`, 
        height: `calc(100vh - ${totalHeight}px)` 
      }"
    >
      <RCPageRenderer 
        v-model="page" 
        :resolve-page="resolvePage"
        :use-surround="useSurround"
        :surround="surround"
        :surround-status="surroundStatus"
      />
    </div>
  </div>
  <RCDeletePageModal
    v-model:open="isDeleteModalOpen"
    :loading="isDeleting"
    :page-title="getLocalizedContent(page.title, locale)"
    @confirm="handleDeleteConfirm"
  />
  <RCPageTreeModal
    v-model:open="isPageTreeModalOpen"
    :pages="treePages"
    :loading="isFetchingTree"
    @navigate="handleTreeNavigate"
  />
  <RCConfirmModal />
</template>

<style scoped></style>
