<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { tv } from "tailwind-variants"
import { type ImageBlockProps } from "../../../types"
import { useObjectUrl } from "@vueuse/core"

export interface ImageBlockEditorProps extends ImageBlockProps {}

const { src, alt, caption, } = defineProps<ImageBlockEditorProps>()

export interface ImageBlockEditorEmits {
  (e: "update:src", value: string | null): void
  (e: "update:alt", value: string): void
  (e: "update:caption", value: string | null): void
  (e: "update:file", value: File | null): void
}

const emit = defineEmits<ImageBlockEditorEmits>()

const imageBlockEditorStyles = tv({
  slots: {
    root: "mx-auto space-y-4 flex flex-col gap-xs w-full",
    upload: "min-h-48 w-full",
    previewContainer: "w-full relative rounded-lg border border-default overflow-hidden",
    previewImage: "w-full h-auto object-contain transition-opacity duration-300",
    emptyPreview: "w-full h-48 flex items-center justify-center bg-elevated/25"
  }
})

const { root, upload, previewContainer, previewImage, emptyPreview } = imageBlockEditorStyles()

const fileToUpload = ref<File | null>(null)
const localAlt = ref(alt || "")
const localCaption = ref(caption || "")

const filePreviewUrl = useObjectUrl(fileToUpload)

const previewSrc = computed(() => {
  return fileToUpload.value ? filePreviewUrl.value : src
})

const removeFile = () => {
  fileToUpload.value = null
  emit("update:file", null)
  emit("update:src", null)
}

watch(localAlt, (newVal) => {
  emit("update:alt", newVal)
})

watch(localCaption, (newVal) => {
  emit("update:caption", newVal.trim() || null)
})

watch(fileToUpload, (newFile) => {
  emit("update:file", newFile)
})
</script>

<template>
  <figure :class="root()">
    <UFileUpload
      v-slot="{ open }"
      v-model="fileToUpload"
      accept="image/*"
      :class="upload()"
      variant="area"
      color="neutral"
      label="Drop image here"
      description="JPG, PNG, GIF or WEBP. Click to select."
    >
      <div class="flex flex-col items-center justify-center space-y-3 p-4">
        <div :class="previewContainer()">
          <img
            v-if="previewSrc"
            :src="previewSrc"
            :alt="localAlt || 'Image preview'"
            :class="previewImage()"
          />
          <div v-else :class="emptyPreview()">
            <UIcon name="i-lucide-image" class="w-10 h-10 text-muted" />
          </div>

          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div class="flex space-x-2">
              <UButton
                icon="i-lucide-upload"
                :label="previewSrc ? 'Change Image' : 'Select Image'"
                color="neutral"
                @click="open()"
              />
              <UButton
                v-if="previewSrc"
                icon="i-lucide-trash-2"
                label="Remove"
                color="error"
                variant="outline"
                @click="removeFile()"
              />
            </div>
          </div>
        </div>
      </div>
    </UFileUpload>

    <UInput
      v-model="localAlt"
      type="text"
      placeholder="Alt text (accessibility)"
      class="w-full"
      variant="outline"
    >
      <template #leading>
        <UTooltip>
          <template #default>
            <span class="text-xs text-muted">Alt</span>
          </template>
          <template #content> The text description for the image used by screen readers. </template>
        </UTooltip>
      </template>
    </UInput>

    <UTextarea
      v-model="localCaption"
      autoresize
      placeholder="Caption (optional)"
      class="w-full"
      variant="outline"
    >
      <template #leading>
        <UTooltip>
          <template #default>
            <span class="text-xs text-muted">Caption</span>
          </template>
          <template #content> The text description for the image used by screen readers. </template>
        </UTooltip>
      </template>
    </UTextarea>
  </figure>
</template>
