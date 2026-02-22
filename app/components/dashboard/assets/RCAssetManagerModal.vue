<script lang="ts" setup>
import { ref, watch, onUnmounted } from "vue";
import { useApi, $api, useRC } from "#rimelight-components/composables";
import { tv } from "../../../internal/tv";
import type { VariantProps } from "tailwind-variants";

/* region Props */
export interface RCAssetManagerModalProps {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<RCAssetManagerModalProps>();
const { rc } = useRC("RCAssetManagerModal", rcProp);
/* endregion */

/* region Emits */
export interface RCAssetManagerModalEmits {
  close: [];
}
const emit = defineEmits<RCAssetManagerModalEmits>();
/* endregion */

/* region Styles */
const assetManagerStyles = tv({
  slots: {
    root: "p-md flex flex-col gap-md h-[80vh] w-full max-w-4xl",
    header: "flex items-center justify-between",
    grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md overflow-y-auto pr-xs flex-1",
    item: "group relative flex flex-col gap-xs p-xs rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 transition-colors bg-neutral-100/50 dark:bg-neutral-900",
    preview: "aspect-square w-full rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center",
    previewImage: "w-full h-full object-cover",
    itemInfo: "flex flex-col gap-none overflow-hidden",
    itemLabel: "text-xs font-medium truncate",
    itemSize: "text-[10px] text-dimmed",
    actions: "absolute top-xs right-xs flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded-md backdrop-blur-sm",
    uploadOverlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-md",
  },
});

const { 
  root, 
  header: headerStyle, 
  grid, 
  item, 
  preview, 
  previewImage, 
  itemInfo, 
  itemLabel, 
  itemSize, 
  actions, 
  uploadOverlay 
} = assetManagerStyles();
type AssetManagerVariants = VariantProps<typeof assetManagerStyles>;
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });
const { data: assets, refresh, status } = useApi<any[]>("/api/assets", {
  default: () => [] as any,
} as any);

const isUploading = ref(false);
const showUploadModal = ref(false);
const pendingFile = ref<File | null>(null);
const uploadFilename = ref("");

const fileInput = ref<HTMLInputElement | null>(null);
/* endregion */

/* region Logic */
function triggerFilePicker() {
  fileInput.value?.click();
}

function handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    if (file) {
      pendingFile.value = file;
      uploadFilename.value = file.name;
      showUploadModal.value = true;
    }
  }
}

async function performUpload() {
  if (!pendingFile.value || !uploadFilename.value) return;

  isUploading.value = true;
  try {
    const file = pendingFile.value!;
    const body = await file.arrayBuffer();
    await $api(`/api/assets/${uploadFilename.value}`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": file.type,
      },
    });
    showUploadModal.value = false;
    pendingFile.value = null;
    uploadFilename.value = "";
    await refresh();
  } catch (err) {
    console.error("Upload failed", err);
  } finally {
    isUploading.value = false;
  }
}

async function deleteAsset(key: string) {
  if (!confirm(`Are you sure you want to delete ${key}?`)) return;
  try {
    await $api(`/api/assets/${key}`, { method: "DELETE" });
    await refresh();
  } catch (err) {
    console.error("Delete failed", err);
  }
}

function downloadAsset(key: string) {
  const link = document.createElement('a');
  link.href = `/api/assets/${key}`;
  link.download = key;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function isImage(contentType?: string, key?: string) {
  if (contentType?.startsWith("image/")) return true;
  const ext = key?.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

watch(open, (isOpen) => {
  if (isOpen) refresh();
});
/* endregion */
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'sm:max-w-4xl max-h-[90vh]' }">
    <template #content>
      <div :class="root({ class: rc.root })">
        <div :class="headerStyle()">
          <div class="flex flex-col">
            <h2 class="text-xl font-bold">Asset Manager</h2>
            <p class="text-xs text-dimmed">Manage your R2 bucket assets</p>
          </div>
          <div class="flex items-center gap-sm">
            <UButton
              icon="lucide:refresh-cw"
              variant="ghost"
              color="neutral"
              :loading="status === 'pending'"
              @click="refresh()"
            />
            <UButton
              icon="lucide:upload"
              label="Add File"
              color="primary"
              @click="triggerFilePicker"
            />
          </div>
        </div>

        <USeparator />

        <div v-if="status === 'pending' && !assets.length" class="flex flex-1 items-center justify-center">
          <UIcon name="lucide:loader-2" class="size-8 animate-spin text-primary" />
        </div>

        <div v-else-if="!assets.length" class="flex flex-1 flex-col items-center justify-center gap-sm text-dimmed">
          <UIcon name="lucide:folder-open" class="size-12" />
          <p>No assets found in the bucket</p>
          <UButton label="Upload your first file" variant="link" @click="triggerFilePicker" />
        </div>

        <div v-else :class="grid()">
          <div v-for="asset in assets" :key="asset.key" :class="item()">
            <div :class="preview()">
              <img
                v-if="isImage(asset.contentType, asset.key)"
                :src="`/api/assets/${asset.key}`"
                :class="previewImage()"
                loading="lazy"
              />
              <div v-else class="flex flex-col items-center gap-xs">
                <UIcon name="lucide:file" class="size-8 text-dimmed" />
                <span class="text-[10px] uppercase text-dimmed">{{ asset.key.split('.').pop() }}</span>
              </div>
            </div>

            <div :class="itemInfo()">
              <span :class="itemLabel()" :title="asset.key">{{ asset.key }}</span>
              <span :class="itemSize()">{{ formatSize(asset.size) }}</span>
            </div>

            <div :class="actions()">
              <UButton
                icon="lucide:download"
                size="xs"
                variant="ghost"
                color="neutral"
                class="text-white hover:bg-white/20"
                @click="downloadAsset(asset.key)"
              />
              <UButton
                icon="lucide:trash-2"
                size="xs"
                variant="ghost"
                color="error"
                class="hover:bg-error-500/20"
                @click="deleteAsset(asset.key)"
              />
            </div>
          </div>
        </div>

        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleFileSelected"
        />

        <!-- Upload Confirm Modal -->
        <UModal v-model:open="showUploadModal">
          <template #content>
            <div class="flex flex-col gap-md p-md">
              <h3 class="text-lg font-bold">Upload Asset</h3>
              <div class="flex flex-col gap-sm">
                <p class="text-sm text-dimmed">Confirm the filename for your asset:</p>
                <UInput
                  v-model="uploadFilename"
                  label="Filename"
                  placeholder="name.png"
                  autofocus
                  @keydown.enter="performUpload"
                />
              </div>
              <div class="flex justify-end gap-sm">
                <UButton
                  label="Cancel"
                  variant="ghost"
                  color="neutral"
                  @click="showUploadModal = false"
                />
                <UButton
                  label="Upload"
                  color="primary"
                  :loading="isUploading"
                  @click="performUpload"
                />
              </div>
            </div>
          </template>
        </UModal>
      </div>
    </template>
  </UModal>
</template>
