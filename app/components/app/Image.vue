<script setup lang="ts">
import { ref, reactive, onMounted, useTemplateRef, watch, nextTick } from "vue";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../composables";
import { defaultDocument, defaultWindow } from "../../utils";

/* region Props */
export interface ImageProps {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
  loading?: "lazy" | "eager";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  rc?: {
    base?: string;
  };
}

const {
  src,
  alt = "Image",
  height,
  width,
  loading = "lazy",
  fit = "cover",
  rc: rcProp,
} = defineProps<ImageProps>();

const { rc } = useRC("Image", rcProp);
/* endregion */

/* region Emits */
export interface ImageEmits {}

const emit = defineEmits<ImageEmits>();
/* endregion */

/* region Slots */
export interface ImageSlots {}

const slots = defineSlots<ImageSlots>();
/* endregion */

/* region Styles */
const imageStyles = tv({
  slots: {
    base: "cursor-pointer transition-transform duration-300",
  },
  variants: {
    isExpanded: {
      true: {
        base: "w-full h-full object-contain mx-auto block rounded-lg",
      },
      false: {
        base: "w-full h-full object-cover hover:scale-[1.02] active:scale-95",
      },
    },
  },
});

const { base } = imageStyles();
type ImageVariants = VariantProps<typeof imageStyles>;
/* endregion */

/* region State */
const isOpen = ref(false);
const imgElement = useTemplateRef<{ $el: HTMLImageElement }>("imgRef");

const metadata = reactive({
  width: 0,
  height: 0,
  size: "",
  format: "",
  mimeType: "",
});
/* endregion */

/* region Meta */
defineOptions({
  name: "Image",
});
/* endregion */

/* region Lifecycle */
onMounted(() => {
  nextTick(() => {
    const el = imgElement.value?.$el as HTMLImageElement | undefined;
    if (el) {
      if (el.complete) {
        updateMetadata(el);
      }
    }
  });
});

watch(
  () => imgElement.value,
  (newVal) => {
    const el = newVal?.$el as HTMLImageElement | undefined;
    if (el && el.complete && el.naturalWidth > 0) {
      updateMetadata(el);
    }
  },
  { immediate: true },
);

// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function fetchExtendedMetadata() {
  try {
    const response = await fetch(src, {
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();

    metadata.size = formatBytes(blob.size);

    const type = response.headers.get("content-type") || blob.type;
    if (type) {
      metadata.mimeType = type;
      metadata.format = type.split("/")[1]?.split("+")[0]?.toUpperCase() || "IMG";
    }

    if (metadata.format === "SVG") {
      const tempImg = new window.Image();
      tempImg.src = URL.createObjectURL(blob);
      await tempImg.decode();
      metadata.width = tempImg.naturalWidth;
      metadata.height = tempImg.naturalHeight;
      URL.revokeObjectURL(tempImg.src);
    }
  } catch (e) {
    console.error("Metadata fetch failed:", e);
    metadata.format = src.split(".").pop()?.toUpperCase() || "IMG";
    metadata.size = "Unknown";
  }
}

function updateMetadata(el: HTMLImageElement | null) {
  if (!import.meta.client || !el) return;

  if (el.naturalWidth > 0) {
    metadata.width = el.naturalWidth;
    metadata.height = el.naturalHeight;
    fetchExtendedMetadata();
  }
}

function handleImageLoad(event: Event) {
  updateMetadata(event.currentTarget as HTMLImageElement);
}

async function downloadImage() {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    if (!defaultWindow || !defaultDocument) return;

    const url = defaultWindow.URL.createObjectURL(blob);
    const link = defaultDocument.createElement("a");
    link.href = url;
    link.download = `file-${Date.now()}.${metadata.format.toLowerCase()}`;
    defaultDocument.body.appendChild(link);
    link.click();
    defaultDocument.body.removeChild(link);
    defaultWindow.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
}
/* endregion */
</script>

<template>
  <UModal
    v-model="isOpen"
    title="Image Viewer"
    :description="`${src}`"
    :ui="{
      content: 'w-fit max-w-[98vw] sm:max-w-[95vw] mx-auto',
    }"
  >
    <template #default>
      <div class="relative">
        <NuxtImg
          ref="imgRef"
          :src="src"
          :alt="alt"
          :height="height"
          :width="width"
          :loading="loading"
          :class="base({ isExpanded: false, class: rc.base })"
          @click="isOpen = true"
          @load="handleImageLoad"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-md">
        <div class="flex-1 min-h-0 w-full flex items-center">
          <NuxtImg :src="src" :alt="alt" :class="base({ isExpanded: true, class: rc.base })" />
        </div>

        <USeparator />

        <div class="flex items-center justify-between gap-xl">
          <div class="flex flex-col gap-xs">
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:image" class="size-4" />
              <p class="text-sm">
                Source: <span class="text-dimmed">{{ src }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:file-question-mark" class="size-4" />
              <p class="text-sm">
                Format: <span class="text-dimmed">{{ metadata.format }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:weight" class="size-4" />
              <p class="text-sm">
                Size: <span class="text-dimmed">{{ metadata.size || "Unknown" }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-xs items-center">
              <UIcon name="lucide:image-upscale" class="size-4" />
              <p class="text-sm">
                Dimensions:
                <span class="text-dimmed">{{ metadata.width }} × {{ metadata.height }}</span>
              </p>
            </div>
          </div>

          <UButton icon="lucide:download" label="Download Original" @click="downloadImage" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
