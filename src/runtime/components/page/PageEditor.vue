<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue"
import type { Page } from "../../types"
import { usePageEditor } from "../../composables"

const page = defineModel<Page>({ required: true })
const { undo, redo, canUndo, canRedo, captureSnapshot } = usePageEditor(page)

const emit = defineEmits<{
  (e: "save", value: Page): void
}>()

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

interface Props {
  isSaving: boolean
}

defineProps<Props>()

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

  <div class="mt-24 grid gap-xl" :class="showPreview ? 'grid-cols-2' : 'grid-cols-1'">
    <UPage :class="editorPanelClass">
      <template #default>
        <UPageHeader />
        <RCBlockEditor
          ref="editor"
          v-model="page.blocks"
          :class="editorPanelClass"
          @mutation="captureSnapshot"
        />
      </template>
      <template #right>
        <UPageAside>
          <RCPagePropertiesEditor v-model="page" />
        </UPageAside>
      </template>
    </UPage>
    <UPage v-if="showPreview">
      <template #default>
        <RCBlockViewRenderer :blocks="page.blocks" />
      </template>
      <template #right>
        <UPageAside>
          <RCPagePropertiesRenderer v-model="page"/>
        </UPageAside>
      </template>
    </UPage>
  </div>
</template>

<style scoped>

</style>