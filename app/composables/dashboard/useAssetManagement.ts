import { ref, computed, watch } from "vue";
import { useState } from "#imports";
import { useToast } from "@nuxt/ui/composables/useToast";
import { useApi, $api } from "../app/useApi";
import { useConfirm } from "../app/useConfirm";

export interface Asset {
  key: string;
  size: number;
  contentType?: string;
  httpMetadata?: Record<string, any>;
  customMetadata?: Record<string, any>;
  [key: string]: any;
}

export function useAssetManagement() {
  const { confirm } = useConfirm();
  const toast = useToast();

  const { data: assets, refresh, status } = useApi<Asset[]>("/api/assets", {
    default: () => [] as Asset[],
  } as any);

  const selectedPath = useState("assetManagement-selectedPath", () => "");
  const selectedKeys = useState<string[]>("assetManagement-selectedKeys", () => []);
  const localFolders = useState<string[]>("assetManagement-localFolders", () => []);
  const isProcessing = ref(false);

  // --- Helpers ---
  function splitFilename(name: string) {
    const lastDotIndex = name.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return { basename: name, extension: "" };
    }
    return {
      basename: name.substring(0, lastDotIndex),
      extension: name.substring(lastDotIndex),
    };
  }

  function getExt(key: string) {
    const fileName = key.split("/").pop() || "";
    return fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
  }

  // --- Operations ---
  async function uploadAsset(file: File, targetPath: string, customBasename?: string) {
    isProcessing.value = true;
    try {
      const body = await file.arrayBuffer();
      const { extension } = splitFilename(file.name);
      const filename = (customBasename || file.name.substring(0, file.name.lastIndexOf(".")) || file.name) + extension;
      const fullKey = targetPath ? `${targetPath}/${filename}` : filename;

      await $api(`/api/assets/${fullKey}`, {
        method: "PUT",
        body,
        headers: {
          "Content-Type": file.type,
        },
      });

      toast.add({ color: "success", title: "Asset uploaded successfully" });
      await refresh();
      return { success: true, key: fullKey };
    } catch (err) {
      toast.add({ color: "error", title: "Failed to upload asset" });
      console.error("Upload failed", err);
      return { success: false, error: err };
    } finally {
      isProcessing.value = false;
    }
  }

  async function deleteAsset(key: string) {
    const isConfirmed = await confirm({
      title: "Delete Asset",
      description: `Are you sure you want to delete ${key}? This action cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });

    if (!isConfirmed) return false;

    try {
      await $api(`/api/assets/${key}`, { method: "DELETE" });
      toast.add({ color: "success", title: "Asset deleted successfully" });
      await refresh();
      return true;
    } catch (err) {
      toast.add({ color: "error", title: "Failed to delete asset" });
      console.error("Delete failed", err);
      return false;
    }
  }

  async function moveAsset(originalKey: string, targetFolder: string, newBasename: string) {
    const ext = getExt(originalKey);
    // Remove extension if user entered it
    const cleanBasename = newBasename.endsWith(ext) && ext !== "" 
      ? newBasename.slice(0, -ext.length) 
      : newBasename;
      
    const newFilename = cleanBasename + ext;
    
    // Normalize targetFolder (Root should be empty)
    const normalizedFolder = (targetFolder === "Root" || targetFolder === "/") ? "" : targetFolder.replace(/^\/|\/$/g, "");
    const newKey = normalizedFolder ? `${normalizedFolder}/${newFilename}` : newFilename;

    if (originalKey === newKey) return true;

    isProcessing.value = true;
    try {
      await $api(`/api/assets/${originalKey}`, {
        method: "POST",
        body: { to: newKey }
      });
      toast.add({ color: "success", title: "Asset moved/renamed successfully" });
      await refresh();
      return true;
    } catch (err) {
      toast.add({ color: "error", title: "Failed to move/rename asset" });
      console.error("Move failed", err);
      return false;
    } finally {
      isProcessing.value = false;
    }
  }

  async function batchDelete() {
    const count = selectedKeys.value.length;
    if (count === 0) return false;

    const isConfirmed = await confirm({
      title: "Batch Delete",
      description: `Are you sure you want to delete ${count} selected assets? This action cannot be undone.`,
      confirmLabel: "Delete Selected",
      danger: true,
    });

    if (!isConfirmed) return false;

    isProcessing.value = true;
    try {
      await Promise.all(
        selectedKeys.value.map(key => $api(`/api/assets/${key}`, { method: "DELETE" }))
      );
      toast.add({ color: "success", title: "Assets deleted successfully" });
      selectedKeys.value = [];
      await refresh();
      return true;
    } catch (err) {
      toast.add({ color: "error", title: "Failed to delete assets" });
      console.error("Batch delete failed", err);
      return false;
    } finally {
      isProcessing.value = false;
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

  function addLocalFolder(name: string, parentPath: string) {
    const cleanName = name.trim().replace(/\//g, "-");
    if (!cleanName) return null;

    const newPath = parentPath ? `${parentPath}/${cleanName}` : cleanName;
    if (!localFolders.value.includes(newPath)) {
      localFolders.value.push(newPath);
    }
    return newPath;
  }

  return {
    // State
    assets,
    status,
    selectedPath,
    selectedKeys,
    localFolders,
    isProcessing,
    
    // Operations
    refresh,
    uploadAsset,
    deleteAsset,
    moveAsset,
    batchDelete,
    downloadAsset,
    addLocalFolder,
    
    // Helpers
    splitFilename,
  };
}
