<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue"
import type { Page } from "../../types"
import { usePageEditor } from "../../composables"
import { getLocalizedContent } from "../../utils"

const page = defineModel<Page>({ required: true })
const { undo, redo, canUndo, canRedo, captureSnapshot } = usePageEditor(page)

interface PageEditorProps {
  isSaving: boolean
}

const { isSaving } = defineProps<PageEditorProps>()

interface PageEditorEmits {
  (e: "save", value: Page): void
}

const emit = defineEmits<PageEditorEmits>()

const handleSave = () => {
  // We take a deep copy to "freeze" the data state for the API
  const dataToPersist = JSON.parse(JSON.stringify(page.value))

  // Pass the data up to the parent
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

const editorPanelClass = computed(() => ({
  // When the preview is visible, both editor/preview share 1/2 span.
  'col-span-1 w-full': showPreview.value,
  // When the preview is hidden, the editor uses the full grid space.
  'col-span-2 w-full': !showPreview.value,
}))
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
  <UContainer class="mt-24 grid gap-xl" :class="showPreview ? 'grid-cols-2 max-w-full' : 'grid-cols-1'">
    <div :class="editorPanelClass" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <UPageAside class="order-1 lg:order-2 lg:col-span-1">
        <RCPagePropertiesEditor v-model="page" />
      </UPageAside>
      <div class="order-2 lg:order-1 lg:col-span-3">
        <UPageHeader :title="getLocalizedContent(page.title, 'en')" :description="getLocalizedContent(page.description, 'en') ?? ''" />
        <RCBlockEditor
          ref="editor"
          v-model="page.blocks"
          :class="editorPanelClass"
          @mutation="captureSnapshot"
        />
        <div class="flex flex-col gap-xs text-xs">
          <h6>Metadata</h6>
          <span>Page ID: {{ page.id }}</span>
          <span>Created At: <NuxtTime
              :datetime="page.created_at ?? ''"
              year="numeric"
              month="numeric"
              day="numeric"
              hour="numeric"
              minute="numeric"
              second="numeric"
              time-zone-name="short"
          /></span>
          <span>Posted At: <NuxtTime
              :datetime="page.created_at ?? ''"
              year="numeric"
              month="numeric"
              day="numeric"
              hour="numeric"
              minute="numeric"
              second="numeric"
              time-zone-name="short"
          /></span>
          <span>Updated At: <NuxtTime
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
      </div>
    </div>
    <div class="flex flex-row gap-xl">
      <USeparator orientation="vertical" />
      <RCPageRenderer v-if="showPreview" v-model="page"/>
    </div>
  </UContainer>
</template>

<style scoped>

</style>