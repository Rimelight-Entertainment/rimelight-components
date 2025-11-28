import { ref, watch, computed, type Ref } from "vue"
import { useDebounceFn } from "@vueuse/core"
import { type Block } from "../types/blocks"

/**
 * Defines the contract for the consuming application's save function.
 * This allows the composable to trigger persistence without knowing the API details.
 * It's assumed the callback will handle the necessary API calls and error handling.
 */
type SaveCallback = (blocks: Block[]) => Promise<void> | void

export interface UseBlockContentEditorOptions {
  /** The initial array of blocks loaded from the database/API. */
  initialBlocks: Block[]
  /** The function the editor calls to persist changes. It is debounced internally. */
  saveCallback: SaveCallback
  /** Optional. The debounce delay in milliseconds (default: 1000ms). */
  debounceDelay?: number
}

/**
 * Manages the reactive state, updates, and debounced persistence of a block content array.
 * This composable is decoupled from data fetching and specific API endpoints.
 *
 * @param options Configuration object including initial blocks and a save callback.
 */
export const useBlockContentEditor = ({
                                        initialBlocks,
                                        saveCallback,
                                        debounceDelay = 1000,
                                      }: UseBlockContentEditorOptions) => {
  // 1. Core Reactive State: Use a deep copy to isolate the editor's state from the initial prop
  // We use `ref<Block[]>` to hold the mutable array of blocks.
  const blocks: Ref<Block[]> = ref(JSON.parse(JSON.stringify(initialBlocks)))

  // Status Indicators for the UI
  const isSaving = ref(false)
  const lastSavedAt = ref<Date | null>(null)
  const hasUnsavedChanges = ref(false)

  // --- Persistence Logic ---

  /** Internal function to wrap the consumer's save callback and handle status */
  const persistChanges = async (currentBlocks: Block[]) => {
    isSaving.value = true
    hasUnsavedChanges.value = false // Mark changes as being saved

    try {
      // Execute the consuming app's provided save logic
      await saveCallback(currentBlocks)

      // Update status on success
      lastSavedAt.value = new Date()
      console.log("Blocks persisted successfully via callback.")

    } catch (error) {
      // Log the error but leave it to the consumer's callback for detailed error handling
      console.error("[BlockEditor] Error during persistence callback:", error)
      hasUnsavedChanges.value = true // If save fails, mark changes as still unsaved
    } finally {
      isSaving.value = false
    }
  }

  // Create a debounced version of the save function
  const debouncedSave = useDebounceFn(() => {
    // Pass a deep copy of the blocks to the callback to prevent unexpected mutations
    persistChanges(JSON.parse(JSON.stringify(blocks.value)))
  }, debounceDelay)

  // Watch for ANY deep change in the reactive `blocks` array
  watch(
    blocks,
    () => {
      // 1. Mark that a change has occurred
      hasUnsavedChanges.value = true
      // 2. Trigger the debounced save
      debouncedSave()
    },
    { deep: true } // Crucial: Watch nested changes (e.g., text inside a ParagraphBlock)
  )

  // --- Editor Mutators ---

  /**
   * Helper function to add a new block (e.g., from an "Add Block" menu).
   * @param newBlock The block object to insert.
   * @param index The position to insert the block (default: end of the array).
   */
  const addBlock = (newBlock: Block, index: number = blocks.value.length) => {
    // We use a setter operation here for reactivity
    blocks.value.splice(index, 0, newBlock)
  }

  /**
   * Helper function to remove a block by its ID.
   * @param blockId The UUID of the block to remove.
   */
  const removeBlock = (blockId: string) => {
    blocks.value = blocks.value.filter(block => block.id !== blockId)
  }

  /**
   * Helper function to move a block's position within the array.
   * @param blockId The UUID of the block to move.
   * @param newIndex The target index for the block.
   */
  const moveBlock = (blockId: string, newIndex: number) => {
    const oldIndex = blocks.value.findIndex(block => block.id === blockId)
    if (oldIndex === -1) return

    // Remove the block from its old position
    const [blockToMove] = blocks.value.splice(oldIndex, 1)

    // Insert it at the new position
    blocks.value.splice(newIndex, 0, blockToMove)
  }

  return {
    // Core Data
    blocks, // The array the EditorBlockRenderer will use

    // Status
    isSaving,
    lastSavedAt,
    hasUnsavedChanges,

    // Editor Actions (Mutators)
    addBlock,
    removeBlock,
    moveBlock,
  }
}