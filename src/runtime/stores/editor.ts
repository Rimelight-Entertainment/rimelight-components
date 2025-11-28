import { defineStore } from "pinia"
import { useDebounceFn } from "@vueuse/core"
import { computed, ref } from "vue"
import type { Block } from "../types/blocks"
import { $fetch } from "ofetch"

// --- 1. New Configuration Interface ---
export interface EditorStoreConfig {
  /** The base URL for the save endpoint (e.g., '/api/wiki/page'). */
  baseApiUrl: string
  /** The delay in milliseconds for debouncing save calls (e.g., 800). */
  debounceDelayMs: number
}

// --- 2. Store Factory Function ---
// The main function now takes the configuration object as an argument.
export const createEditorStore = (config: EditorStoreConfig) => {
  // Destructure config for cleaner access within the store
  const { baseApiUrl, debounceDelayMs } = config

  // Return the actual Pinia store definition
  return defineStore("editor", () => {
    // STATE: Define reactive state
    const pageId = ref<string | null>(null)
    const blocks = ref<Block[]>([])
    const isDirty = ref(false)
    const isSaving = ref(false)
    const lastSavedAt = ref<string | null>(null)

    // GETTERS:
    const currentBlocksPayload = computed(() => blocks.value)

    // --- Core Save Action ---
    const actualSave = async () => {
      // Guard clauses
      if (!pageId.value || !isDirty.value || isSaving.value) {
        return
      }

      isSaving.value = true

      try {
        console.log(`[Saving] Triggered save for page ${pageId.value}.`)

        // API Call uses the injected baseApiUrl
        await $fetch(`${baseApiUrl}/${pageId.value}/save`, {
          method: "PUT",
          body: {
            blocks: currentBlocksPayload.value
          }
        })

        // SUCCESS Cleanup
        isDirty.value = false
        lastSavedAt.value = new Date().toISOString()
        console.log(`[Saved] Success at ${lastSavedAt.value}`)
      } catch (error) {
        console.error("Failed to save page content:", error)
      } finally {
        isSaving.value = false
      }
    }

    // --- Debounced Action (VueUse) ---
    // The delay is now set by the injected config value
    const debouncedSave = useDebounceFn(actualSave, debounceDelayMs)

    // --- Store Actions (Exposed Methods) ---
    const updateBlockContent = (blockId: string, field: string, value: any) => {
      const block = blocks.value.find((b) => b.id === blockId)

      if (!block) {
        console.warn(`Attempted to update non-existent block: ${blockId}`)
        return
      }

      const blockProps = block.props as Record<string, any>
      blockProps[field] = value

      isDirty.value = true
      debouncedSave()
    }

    const initialize = (id: string, blocksJson: Block[]) => {
      pageId.value = id
      blocks.value = blocksJson
      isDirty.value = false
      isSaving.value = false
      lastSavedAt.value = new Date().toISOString()
    }

    return {
      pageId, blocks, isDirty, isSaving, lastSavedAt,
      currentBlocksPayload,
      initialize, updateBlockContent, actualSave,
      debouncedSave: debouncedSave
    }
  })
}