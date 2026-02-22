<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useApi, $api, useRC, useConfirm, useAuth } from "#rimelight-components/composables";
import { tv } from "../../../internal/tv";
import type { TreeItem } from "@nuxt/ui";
import draggable from "vuedraggable/src/vuedraggable";

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
    root: "flex flex-col h-[70vh] w-full overflow-hidden",
    main: "flex flex-1 min-h-0 overflow-hidden",
    sidebar: "w-64 border-r border-default flex flex-col overflow-hidden bg-elevated/30",
    sidebarContent: "flex-1 overflow-y-auto p-sm",
    sidebarFooter: "p-sm border-t border-default bg-elevated/50",
    content: "flex-1 flex flex-col min-w-0 overflow-hidden",
    toolbar: "p-sm border-b border-default flex items-center justify-between bg-elevated/10 shrink-0",
    grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-md p-md overflow-y-auto flex-1 min-h-0 items-start content-start",
    item: "group relative aspect-square flex flex-col gap-xs p-sm rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary-500 transition-colors bg-neutral-100/50 dark:bg-neutral-900 overflow-hidden",
    preview: "flex-1 min-h-0 w-full rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center",
    previewImage: "w-full h-full object-contain",
    itemInfo: "flex flex-col gap-none overflow-hidden shrink-0",
    itemLabel: "text-[11px] font-semibold truncate leading-tight",
    itemSize: "text-[10px] text-dimmed",
    actions: "absolute top-sm right-sm flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded-md backdrop-blur-sm",
  },
});

const {
  root,
  main,
  sidebar,
  sidebarContent,
  sidebarFooter,
  content,
  toolbar,
  grid,
  item,
  preview,
  previewImage,
  itemInfo,
  itemLabel,
  itemSize,
  actions,
} = assetManagerStyles();
/* endregion */

/* region State */
const open = defineModel<boolean>("open", { default: false });
const { data: assets, refresh, status } = useApi<any[]>("/api/assets", {
  default: () => [] as any,
} as any);

const { confirm } = useConfirm();
const { permissions: authPermissions } = useAuth();

const selectedPath = ref(""); 
const selectedKeys = ref<Set<string>>(new Set());
const isDragging = ref(false);
const draggedItem = ref<any>(null);
const dropTarget = ref<any>(null);

const breadcrumbs = computed(() => {
  const crumbs = [{ label: "Root", path: "" }];
  if (selectedPath.value) {
    const parts = selectedPath.value.split("/");
    let currentPath = "";
    parts.forEach(part => {
      currentPath += (currentPath ? "/" : "") + part;
      crumbs.push({ label: part, path: currentPath });
    });
  }
  return crumbs;
});

// --- New Folder State ---
const localFolders = ref<string[]>([]); 
const showNewFolderModal = ref(false);
const newFolderName = ref("");

// --- Upload State ---
const isUploading = ref(false);
const showUploadModal = ref(false);
const pendingFile = ref<File | null>(null);
const uploadFileBasename = ref("");
const uploadFileExtension = ref("");
const uploadTargetFolder = ref("");
const uploadFilename = computed(() => uploadFileBasename.value + uploadFileExtension.value);

// --- Move/Rename State ---
const showMoveModal = ref(false);
const movingAsset = ref<any>(null);
const moveTargetBasename = ref("");
const moveTargetFolder = ref("");

const fileInput = ref<HTMLInputElement | null>(null);

const modalUploadTargetValue = computed({
  get: () => uploadTargetFolder.value || "Root",
  set: (val: any) => {
    if (val === "Root" || val === "") {
      uploadTargetFolder.value = "";
      return;
    }
    if (typeof val === 'string') {
      uploadTargetFolder.value = val;
    } else if (val && typeof val === 'object' && 'fullPath' in val) {
      uploadTargetFolder.value = (val as any).fullPath;
    }
  }
});

const modalMoveTargetValue = computed({
  get: () => moveTargetFolder.value || "Root",
  set: (val: any) => {
    if (val === "Root" || val === "") {
      moveTargetFolder.value = "";
      return;
    }
    if (typeof val === 'string') {
      moveTargetFolder.value = val;
    } else if (val && typeof val === 'object' && 'fullPath' in val) {
      moveTargetFolder.value = (val as any).fullPath;
    }
  }
});
/* endregion */

/* region Tree Logic */
interface TreeItemExtended extends TreeItem {
  fullPath: string;
  children?: TreeItemExtended[];
}

const treeItems = computed<TreeItemExtended[]>(() => {
  const rootNode: TreeItemExtended[] = [{
    label: "Root",
    fullPath: "",
    icon: "lucide:home",
    defaultExpanded: true,
    children: []
  }];

  if (!assets.value) return rootNode;

  const foldersSet = new Set<string>();
  
  assets.value.forEach(asset => {
    const parts = asset.key.split("/");
    if (parts.length > 1) {
      let currentPath = "";
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += (currentPath ? "/" : "") + parts[i];
        if (currentPath) foldersSet.add(currentPath);
      }
    }
  });

  localFolders.value.forEach(f => {
    if (f && typeof f === 'string') foldersSet.add(f);
  });

  const sortedFolders = Array.from(foldersSet).sort();
  
  const findOrCreateNode = (parent: TreeItemExtended[], path: string, label: string): TreeItemExtended => {
    let node = parent.find(n => n.label === label);
    if (!node) {
      node = {
        label,
        fullPath: path,
        children: []
      };
      parent.push(node);
    }
    return node;
  };

  sortedFolders.forEach(folderPath => {
    if (typeof folderPath !== 'string') return;
    const parts = folderPath.split("/");
    const first = rootNode[0];
    if (!first || !first.children) return;

    let currentLevel = first.children as TreeItemExtended[];
    let currentFullPath = "";
    
    parts.forEach(part => {
      currentFullPath += (currentFullPath ? "/" : "") + part;
      const node = findOrCreateNode(currentLevel, currentFullPath, part);
      currentLevel = node.children as TreeItemExtended[];
    });
  });

  return rootNode;
});

const currentNode = computed(() => {
  if (selectedPath.value === "") return treeItems.value[0];
  
  const search = (nodes: TreeItemExtended[], path: string): TreeItemExtended | null => {
    for (const node of nodes) {
      if (node.fullPath === path) return node;
      if (node.children) {
        const found = search(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };
  
  return search(treeItems.value, selectedPath.value);
});

const activeTreeValue = computed({
  get: () => selectedPath.value || "Root",
  set: (val) => {
    if (val === "Root" || val === "") {
       selectedPath.value = "";
       return;
    }
    if (typeof val === 'string') {
      selectedPath.value = val;
    } else if (val && typeof val === 'object' && 'fullPath' in val) {
      selectedPath.value = (val as any).fullPath;
    }
  }
});

const gridItems = computed(() => {
  const folders = currentNode.value?.children?.map(n => ({
    key: n.fullPath,
    label: n.label,
    type: 'folder' as const
  })) || [];

  const assetsInDir = assets.value?.filter(asset => {
    const parts = asset.key.split("/");
    const assetPath = parts.slice(0, -1).join("/");
    return assetPath === selectedPath.value;
  }).map(a => ({ ...a, type: 'asset' as const })) || [];

  return [...folders, ...assetsInDir];
});

const localGridItems = ref<any[]>([]);
watch(gridItems, (val) => {
  localGridItems.value = [...val];
}, { immediate: true });
/* endregion */

/* region Logic */
function triggerFilePicker() {
  fileInput.value?.click();
}

function splitFilename(name: string) {
  const lastDotIndex = name.lastIndexOf(".");
  if (lastDotIndex === -1) {
    uploadFileBasename.value = name;
    uploadFileExtension.value = "";
  } else {
    uploadFileBasename.value = name.substring(0, lastDotIndex);
    uploadFileExtension.value = name.substring(lastDotIndex);
  }
}

function handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    if (file) {
      pendingFile.value = file;
      splitFilename(file.name);
      uploadTargetFolder.value = selectedPath.value;
      showUploadModal.value = true;
    }
  }
}

async function performUpload() {
  if (!pendingFile.value || !uploadFileBasename.value) return;

  isUploading.value = true;
  try {
    const file = pendingFile.value!;
    const body = await file.arrayBuffer();
    const fullKey = uploadTargetFolder.value ? `${uploadTargetFolder.value}/${uploadFilename.value}` : uploadFilename.value;
    
    await $api(`/api/assets/${fullKey}`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": file.type,
      },
    });
    showUploadModal.value = false;
    pendingFile.value = null;
    uploadFileBasename.value = "";
    uploadFileExtension.value = "";
    await refresh();
  } catch (err) {
    console.error("Upload failed", err);
  } finally {
    isUploading.value = false;
  }
}

async function deleteAsset(key: string) {
  const isConfirmed = await confirm({
    title: "Delete Asset",
    description: `Are you sure you want to delete ${key}? This action cannot be undone.`,
    confirmLabel: "Delete",
    danger: true,
  });

  if (!isConfirmed) return;

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
  const fileName = key.split("/").pop() || key;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function triggerNewFolder() {
  newFolderName.value = "";
  showNewFolderModal.value = true;
}

function confirmNewFolder() {
  const name = newFolderName.value.trim().replace(/\//g, "-");
  if (!name) return;
  
  const newPath = selectedPath.value ? `${selectedPath.value}/${name}` : name;
  if (!localFolders.value.includes(newPath)) {
    localFolders.value.push(newPath);
  }
  selectedPath.value = newPath;
  showNewFolderModal.value = false;
  newFolderName.value = "";
}

function triggerMove(asset: any) {
  movingAsset.value = asset;
  const parts = asset.key.split("/");
  const fullFilename = parts.pop()!;
  const lastDot = fullFilename.lastIndexOf(".");
  
  moveTargetFolder.value = parts.join("/");
  if (lastDot === -1) {
    moveTargetBasename.value = fullFilename;
  } else {
    moveTargetBasename.value = fullFilename.substring(0, lastDot);
  }
  showMoveModal.value = true;
}

async function performMove() {
  if (!movingAsset.value || !moveTargetBasename.value) return;
  
  const originalKey = movingAsset.value.key;
  const ext = originalKey.includes(".") ? originalKey.substring(originalKey.lastIndexOf(".")) : "";
  const newFilename = moveTargetBasename.value + ext;
  const newKey = moveTargetFolder.value ? `${moveTargetFolder.value}/${newFilename}` : newFilename;

  if (originalKey === newKey) {
    showMoveModal.value = false;
    return;
  }

  isUploading.value = true;
  try {
    await $api(`/api/assets/${originalKey}`, {
      method: "POST",
      body: { to: newKey }
    });
    showMoveModal.value = false;
    await refresh();
  } catch (err) {
    console.error("Move failed", err);
  } finally {
    isUploading.value = false;
  }
}

function toggleSelection(key: string) {
  const newSet = new Set(selectedKeys.value);
  if (newSet.has(key)) {
    newSet.delete(key);
  } else {
    newSet.add(key);
  }
  selectedKeys.value = newSet;
}

async function batchDelete() {
  const count = selectedKeys.value.size;
  if (count === 0) return;

  const isConfirmed = await confirm({
    title: "Batch Delete",
    description: `Are you sure you want to delete ${count} selected assets? This action cannot be undone.`,
    confirmLabel: "Delete Selected",
    danger: true,
  });

  if (!isConfirmed) return;

  isUploading.value = true;
  try {
    await Promise.all(
      Array.from(selectedKeys.value).map(key => $api(`/api/assets/${key}`, { method: "DELETE" }))
    );
    selectedKeys.value.clear();
    await refresh();
  } catch (err) {
    console.error("Batch delete failed", err);
  } finally {
    isUploading.value = false;
  }
}

// --- Drag and Drop Logic ---
function handleDragStart(evt: any) {
  isDragging.value = true;
  // Capture item precisely from the local grid using the index
  if (evt.oldIndex !== undefined) {
    draggedItem.value = localGridItems.value[evt.oldIndex];
  }
}

function handleDragMove(evt: any) {
  const related = evt.relatedContext?.element;
  if (related && related.type === "folder") {
    dropTarget.value = related;
  } else {
    dropTarget.value = null;
  }
  return false;
}

async function handleDragEnd() {
  const asset = draggedItem.value;
  const folder = dropTarget.value;
  
  if (asset && folder && asset.type === "asset" && asset.key && folder.type === "folder") {
    const fileName = asset.key.split("/").pop();
    const newKey = folder.key ? `${folder.key}/${fileName}` : fileName;
    
    if (asset.key !== newKey) {
      isUploading.value = true;
      try {
        await $api(`/api/assets/${asset.key}`, {
          method: "POST",
          body: { to: newKey },
        });
        await refresh();
      } catch (err) {
        console.error("Move failed", err);
      } finally {
        isUploading.value = false;
      }
    }
  }

  isDragging.value = false;
  draggedItem.value = null;
  dropTarget.value = null;
  // Always reset local grid to match source of truth
  localGridItems.value = [...gridItems.value];
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
  <UModal
    v-model:open="open"
    title="Asset Manager"
    description="Manage and organize your R2 bucket assets"
    :ui="{
      content: 'sm:max-w-6xl max-h-[90vh] flex flex-col',
      body: 'p-0 flex-1 overflow-hidden min-h-0',
      header: 'flex items-center justify-between shrink-0'
    }"
  >
    <template #actions>
      <div v-if="selectedKeys.size > 0" class="flex items-center gap-sm bg-primary-500/10 px-sm py-1 rounded-full border border-primary-500/20">
        <span class="text-xs font-bold text-primary-600 dark:text-primary-400">{{ selectedKeys.size }} Selected</span>
        <UButton
          icon="lucide:x"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="selectedKeys.clear()"
        />
      </div>
    </template>

    <template #body>
      <div :class="root({ class: rc.root })">
        <div :class="main()">
          <!-- Sidebar: Folder Tree -->
          <div :class="sidebar()">
            <div :class="sidebarContent()">
              <UTree
                v-model="activeTreeValue"
                :items="treeItems"
                :get-key="(i: any) => i.fullPath === '' ? 'Root' : i.fullPath"
                color="primary"
                variant="neutral"
                selection-behavior="replace"
                class="w-full"
              />
            </div>
          </div>

          <!-- Content Area -->
          <div :class="content()">
            <div :class="toolbar()">
              <div class="flex items-center gap-none overflow-hidden h-6">
                <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.path">
                  <span v-if="idx > 0" class="text-dimmed opacity-50 shrink-0 text-xs text-center px-1">/</span>
                  <button
                    class="text-xs font-semibold truncate hover:text-primary hover:bg-primary-500/10 px-1.5 py-0.5 rounded transition-colors whitespace-nowrap"
                    @click="selectedPath = crumb.path"
                  >
                    {{ crumb.label }}
                  </button>
                </template>
              </div>
              <span class="text-[10px] text-dimmed shrink-0 ml-md uppercase">{{ gridItems.length }} Items</span>
            </div>

            <div v-if="status === 'pending' && !assets.length" class="flex flex-1 items-center justify-center">
              <UIcon name="lucide:loader-2" class="size-8 animate-spin text-primary" />
            </div>

            <div v-else-if="!gridItems.length" class="flex-1 flex items-center justify-center p-xl overflow-y-auto">
              <UEmpty
                icon="lucide:folder-open"
                title="No items found"
                variant="naked"
                description="This location is currently empty."
              />
            </div>

            <div v-else class="flex-1 overflow-y-auto min-h-0">
              <draggable
                v-model="localGridItems"
                item-key="key"
                :move="handleDragMove"
                :sort="true"
                @start="handleDragStart"
                @end="handleDragEnd"
                :class="grid()"
                handle=".drag-handle"
                :animation="200"
                ghost-class="opacity-50"
              >
                <template #header>
                  <div 
                    v-if="authPermissions.assets.canUpload.value" 
                    :class="item()" 
                    class="flex items-center justify-center p-0 overflow-hidden cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/20"
                  >
                    <UFileUpload
                      size="xs"
                      label="Upload Here"
                      description="Max: 5 GiB"
                      :dropzone="true"
                      class="size-full"
                      :ui="{
                        base: 'size-full border-0 bg-transparent flex flex-col items-center justify-center text-center p-md',
                        wrapper: 'flex flex-col items-center justify-center gap-xs',
                        label: 'text-[11px] font-semibold',
                        description: 'text-[10px]',
                        actions: 'mt-xs'
                      }"
                      @update:model-value="(file: any) => {
                        if (file) {
                          pendingFile = file as File;
                          splitFilename((file as File).name);
                          uploadTargetFolder = selectedPath;
                          showUploadModal = true;
                        }
                      }"
                    >
                      <template #actions="{ open: openPicker }">
                        <UButton
                          size="xs"
                          label="Select"
                          icon="lucide:upload"
                          color="neutral"
                          variant="outline"
                          @click="openPicker()"
                        />
                      </template>
                    </UFileUpload>
                  </div>
                </template>

                <template #item="{ element: itemObj }">
                  <div>
                    <div
                      v-if="itemObj.type === 'folder'"
                      :class="[item(), dropTarget?.key === itemObj.key ? 'ring-2 ring-primary-500 bg-primary-500/10 scale-95' : '']"
                      class="cursor-pointer group/folder transition-all"
                      @click="selectedPath = itemObj.key"
                      @dragover.prevent="dropTarget = itemObj"
                      @dragleave="dropTarget = dropTarget === itemObj ? null : dropTarget"
                    >
                      <div :class="[preview(), isDragging ? 'pointer-events-none' : '']" class="bg-primary-50/50 dark:bg-primary-900/10 group-hover/folder:bg-primary-500/10 transition-colors">
                        <UIcon name="lucide:folder" class="size-12 text-primary-500/40 group-hover/folder:text-primary-500/60" />
                      </div>
                      <div :class="[itemInfo(), isDragging ? 'pointer-events-none' : '']">
                        <span :class="itemLabel()">{{ itemObj.label }}</span>
                        <span :class="itemSize()">Folder</span>
                      </div>
                    </div>

                    <div v-else :class="item()" class="drag-handle cursor-grab active:cursor-grabbing group">
                      <!-- Selection (Top Left) -->
                      <div 
                        class="absolute top-2 left-2 z-20 transition-opacity"
                        :class="[selectedKeys.has(itemObj.key) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
                      >
                         <UCheckbox
                           :model-value="selectedKeys.has(itemObj.key)"
                           @update:model-value="toggleSelection(itemObj.key)"
                           color="primary"
                           @click.stop
                         />
                      </div>

                      <!-- Actions (Top Right) -->
                      <div class="absolute top-2 right-2 flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded-md backdrop-blur-sm z-20">
                        <UButton
                          icon="lucide:download"
                          size="xs"
                          variant="ghost"
                          color="neutral"
                          class="text-white hover:bg-white/20"
                          @click.stop="downloadAsset((itemObj as any).key)"
                        />
                        <UButton
                          v-if="authPermissions.assets.canEdit.value"
                          icon="lucide:pencil"
                          size="xs"
                          variant="ghost"
                          color="neutral"
                          class="text-white hover:bg-white/20"
                          @click.stop="triggerMove(itemObj)"
                        />
                        <UButton
                          v-if="authPermissions.assets.canDelete.value"
                          icon="lucide:trash-2"
                          size="xs"
                          variant="ghost"
                          color="error"
                          class="hover:bg-error-500/20"
                          @click.stop="deleteAsset((itemObj as any).key)"
                        />
                      </div>

                      <div :class="preview()">
                        <img
                          v-if="isImage(itemObj.contentType, itemObj.key)"
                          :src="`/api/assets/${itemObj.key}`"
                          :class="previewImage()"
                          loading="lazy"
                        />
                        <div v-else class="flex flex-col items-center gap-xs">
                          <UIcon name="lucide:file" class="size-8 text-dimmed" />
                          <span class="text-[10px] uppercase text-dimmed">{{ (itemObj as any).key.split('.').pop() }}</span>
                        </div>
                      </div>

                      <div :class="itemInfo()">
                        <span :class="itemLabel()" :title="(itemObj as any).key">{{ (itemObj as any).key.split('/').pop() }}</span>
                        <span :class="itemSize()">{{ formatSize((itemObj as any).size) }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </div>

        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleFileSelected"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-sm">
          <UButton
             v-if="selectedKeys.size > 0"
             icon="lucide:trash-2"
             label="Delete"
             color="error"
             variant="subtle"
             @click="batchDelete"
          />
          <UButton
            v-if="authPermissions.assets.canEdit.value"
            size="sm"
            variant="ghost"
            icon="lucide:folder-plus"
            label="New Subfolder"
            color="neutral"
            @click="triggerNewFolder"
          />
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
            v-if="authPermissions.assets.canUpload.value"
            icon="lucide:upload"
            label="Add Asset"
            color="primary"
            @click="triggerFilePicker"
          />
        </div>
      </div>
    </template>
  </UModal>

  <!-- New Folder Modal -->
  <UModal
    v-model:open="showNewFolderModal"
    title="New Subfolder"
    description="Organize your assets by creating a virtual directory"
  >
    <template #body>
      <div class="flex flex-col gap-md">
        <p class="text-sm text-dimmed">Entering a name for the folder in <span class="text-primary font-bold">/{{ selectedPath || 'Root' }}</span>:</p>
        <UInput
          v-model="newFolderName"
          placeholder="e.g. documentation"
          autofocus
          class="w-full"
          @keydown.enter="confirmNewFolder"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-sm">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="showNewFolderModal = false" />
        <UButton label="Create Folder" color="primary" @click="confirmNewFolder" />
      </div>
    </template>
  </UModal>

  <!-- Move/Rename Modal -->
  <UModal
    v-model:open="showMoveModal"
    title="Move or Rename Asset"
  >
    <template #body>
      <div class="flex flex-col gap-md">
        <UFormField label="New Name (Basename)">
          <UInput v-model="moveTargetBasename" class="w-full" />
        </UFormField>
        <UFormField label="Target Folder">
          <div class="border border-default rounded-md max-h-48 overflow-y-auto p-1 bg-elevated/50">
            <UTree
              v-model="modalMoveTargetValue"
              :items="treeItems"
              :get-key="(i: any) => i.fullPath === '' ? 'Root' : i.fullPath"
              color="primary"
              variant="neutral"
              selection-behavior="replace"
              class="w-full"
            />
          </div>
        </UFormField>
        <p class="text-[11px] text-dimmed">
          Current location: <span class="font-mono">{{ movingAsset?.key }}</span>
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-sm">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="showMoveModal = false" />
        <UButton label="Move Asset" color="primary" :loading="isUploading" @click="performMove" />
      </div>
    </template>
  </UModal>

  <!-- Upload Filename Modal -->
  <UModal
    v-model:open="showUploadModal"
    title="Confirm Upload"
  >
    <template #body>
      <div class="flex flex-col gap-md">
        <UFormField label="Filename">
          <UInput v-model="uploadFileBasename" class="w-full" />
        </UFormField>
        <UFormField label="Upload to Folder">
          <div class="border border-default rounded-md max-h-48 overflow-y-auto p-1 bg-elevated/50">
            <UTree
              v-model="modalUploadTargetValue"
              :items="treeItems"
              :get-key="(i: any) => i.fullPath === '' ? 'Root' : i.fullPath"
              color="primary"
              variant="neutral"
              selection-behavior="replace"
              class="w-full"
            />
          </div>
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-sm">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="showUploadModal = false" />
        <UButton label="Start Upload" color="primary" :loading="isUploading" @click="performUpload" />
      </div>
    </template>
  </UModal>
</template>
