<script setup lang="ts">
import { ref, reactive, onMounted, useTemplateRef, watch, nextTick } from 'vue'
import { tv } from 'tailwind-variants';
import { useImage } from "#imports"

export interface ImageWrapperProps {
  src: string
  alt?: string
  height?: string | number
  width?: string | number
  loading?: 'lazy' | 'eager'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

const { src, alt = "Image", height, width, loading = "lazy", fit = "cover"} = defineProps<ImageWrapperProps>()

const img = useImage()
const isOpen = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)
const imgElement = useTemplateRef<{ $el: HTMLImageElement }>('imgRef')

const metadata = reactive({
  width: 0,
  height: 0,
  size: '',
  format: '',
  mimeType: ''
})

const imageStyles = tv({
  base: 'cursor-pointer transition-transform duration-300',
  variants: {
    isExpanded: {
      true: 'w-full h-full object-contain mx-auto block rounded-lg',
      false: 'w-full h-full object-cover hover:scale-[1.02] active:scale-95',
    },
  },
})

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

async function fetchExtendedMetadata() {
  try {
    const response = await fetch(src, {
      method: 'GET',
      mode: 'cors'
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const blob = await response.blob()

    metadata.size = formatBytes(blob.size)

    const type = response.headers.get('content-type') || blob.type
    if (type) {
      metadata.mimeType = type
      metadata.format = type.split('/')[1]?.split('+')[0]?.toUpperCase() || 'IMG'
    }

    if (metadata.format === 'SVG') {
      const tempImg = new Image()
      tempImg.src = URL.createObjectURL(blob)
      await tempImg.decode()
      metadata.width = tempImg.naturalWidth
      metadata.height = tempImg.naturalHeight
      URL.revokeObjectURL(tempImg.src)
    }
  } catch (e) {
    console.error('Metadata fetch failed:', e)
    metadata.format = src.split('.').pop()?.toUpperCase() || 'IMG'
    metadata.size = 'Unknown'
  }
}

function updateMetadata(el: HTMLImageElement | null) {
  if (!import.meta.client || !el) return

  if (el.naturalWidth > 0) {
    metadata.width = el.naturalWidth
    metadata.height = el.naturalHeight
    fetchExtendedMetadata()
  }
}

function handleImageLoad(event: Event) {
  updateMetadata(event.currentTarget as HTMLImageElement)
}

async function downloadImage() {
  try {
    const response = await fetch(src)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `file-${Date.now()}.${metadata.format.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed', error)
  }
}

onMounted(() => {
  nextTick(() => {
    const el = imgElement.value?.$el as HTMLImageElement | undefined
    if (el) {
      if (el.complete) {
        updateMetadata(el)
      }
    }
  })
})

watch(() => imgElement.value, (newVal) => {
  const el = newVal?.$el as HTMLImageElement | undefined
  if (el && el.complete && el.naturalWidth > 0) {
    updateMetadata(el)
  }
}, { immediate: true })

</script>

<template>
  <UModal v-model="isOpen" title="Image Viewer" :description="`${src}`" :ui="{
      content: 'w-fit max-w-[98vw] sm:max-w-[95vw] mx-auto',
    }">
    <template #default>
      <div class="relative">
      <NuxtImg
        ref="imgRef"
        :src="src"
        :alt="alt"
        :height="height"
        :width="width"
        :loading="loading"
        :class="imageStyles({ isExpanded: false })"
        @click="isOpen = true"
        @load="handleImageLoad"
      />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-md">
        <div class="flex-1 min-h-0 w-full flex items-center">
          <NuxtImg
            :src="src"
            :alt="alt"
            :class="imageStyles({ isExpanded: true })"
          />
        </div>

        <USeparator />

        <div class="flex items-center justify-between gap-xl">
          <div class="flex flex-col gap-xs">
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:image" class="size-4" />
              <p class="text-sm">Source: <span class="text-dimmed">{{ src }}</span></p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:file-question-mark" class="size-4" />
              <p class="text-sm">Format: <span class="text-dimmed">{{ metadata.format }}</span></p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:weight" class="size-4" />
              <p class="text-sm">Size: <span class="text-dimmed">{{ metadata.size || 'Unknown' }}</span></p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:image-upscale" class="size-4" />
              <p class="text-sm">Dimensions: <span class="text-dimmed">{{ metadata.width }} × {{ metadata.height }}</span></p>
            </div>
          </div>

          <UButton
            icon="lucide:download"
            label="Download Original"
            @click="downloadImage"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
