<script setup lang="ts">
import {ref, computed, useTemplateRef, provide} from "vue"
import type {Page, PageSurround} from "../../types"
import { usePageEditor, usePageRegistry } from "../../composables"
import { getLocalizedContent } from "../../utils"
import {useI18n} from "vue-i18n";

const { getTypeLabelKey } = usePageRegistry();

const { t, locale } = useI18n()

const page = defineModel<Page>({ required: true })
const { undo, redo, canUndo, canRedo, captureSnapshot } = usePageEditor(page)

interface PageEditorProps {
  isSaving: boolean
  useSurround?: boolean
  surround?: PageSurround | null
  surroundStatus?: 'idle' | 'pending' | 'success' | 'error'
  resolvePage?: (id: string) => Promise<Pick<Page, 'title' | 'icon' | 'slug'>>
}

const { isSaving, useSurround = false, surroundStatus = 'idle', surround = null, resolvePage } = defineProps<PageEditorProps>()

interface PageEditorEmits {
  (e: "save", value: Page): void
}

const emit = defineEmits<PageEditorEmits>()

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
</script>

<template>
  <UHeader class="fixed mt-16 top-0 left-0 z-50 h-12 w-full bg-muted">
    <template #left>
      <div class="flex items-center gap-xs">
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
      <div class="flex items-center gap-xs">
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
      </div>
    </template>
  </UHeader>
  <main
    ref="split-container"
    class="flex w-full overflow-hidden"
  >
    <div
      class="h-full overflow-y-auto"
      :style="{ width: showPreview ? `${editorWidth}%` : '100%' }"
    >
      <UContainer class="flex flex-col py-16">
        <div class="grid grid-cols-1 lg:grid-cols-24 gap-xl items-start">
          <RCPageTOC
            :page-blocks="page.blocks"
            :levels="[2, 3, 4]"
            class="hidden lg:flex lg:col-span-4 sticky top-20 self-start"
          >
              <template #bottom> </template>
            </RCPageTOC>
          <RCPagePropertiesEditor v-model="page" class="order-1 lg:order-2 lg:col-span-6" />
          <div class="order-2 lg:order-1 lg:col-span-14 flex flex-col gap-xl">
            <NuxtImg
              v-if="page.banner?.src"
              :src="page.banner?.src"
              :alt="page.banner?.alt"
              class="rounded-xl w-full object-cover"
            />
            <UPageHeader
              :headline="t(getTypeLabelKey(page.type))"
              :description="getLocalizedContent(page.description, 'en') ?? ''"
              :ui="{ root: 'pt-0' }"
            >
              <template #title>
                <div class="flex flex-row gap-sm">
                  <NuxtImg
                    v-if="page.icon?.src"
                    :src="page.icon?.src"
                    :alt="page.icon?.alt"
                    class="rounded-full w-12 h-12 object-cover"
                  />
                  <h1>{{ getLocalizedContent(page.title, locale) }}</h1>
                </div>
              </template>
            </UPageHeader>
            <RCBlockEditor
              ref="editor"
              v-model="page.blocks"
              @mutation="captureSnapshot"
            />
            <template v-if="useSurround">
              <div v-if="surroundStatus === 'pending'" class="grid grid-cols-1 gap-md sm:grid-cols-2">
                <USkeleton class="h-48 w-full rounded-xl" />
                <USkeleton class="h-48 w-full rounded-xl" />
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

              <div class="flex flex-col gap-xs text-xs text-dimmed p-xl">
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
      :class="cursorClass"
      class="relative flex flex-col items-center justify-center w-6 cursor-col-resize group px-1 py-16"
      @mousedown="startResizing"
      @dblclick="editorWidth = 50"
    >
      <USeparator
        orientation="vertical"
        :ui="{
      }"
      />
    </div>

    <div
      v-if="showPreview"
      class="h-full overflow-y-auto"
      :style="{ width: `${100 - editorWidth}%` }"
    >
      <RCPageRenderer v-model="page" />
    </div>
  </main>
</template>

<style scoped>

</style>
