// composables/useBlockEditor.ts
import { type Ref, computed, shallowRef } from "vue"
import { v7 as uuidv7 } from "uuid"
import type { Block } from "../types/blocks"

const MAX_HISTORY_SIZE = 100

/**
 * Helper: Recursively finds the parent array and index of a block by ID.
 */
function findBlockLocation(
  blocks: Block[],
  id: string
): { parentArray: Block[]; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].id === id) {
      return { parentArray: blocks, index: i }
    }

    if (Array.isArray(blocks[i].props.children)) {
      const result = findBlockLocation(blocks[i].props.children as Block[], id)
      if (result) return result
    }
  }
  return null
}

/**
 * Helper: Recursively regenerates IDs for a block and its children.
 * This is crucial to prevent duplicate keys in the DOM which kills focus.
 */
function regenerateIds(block: Block): void {
  block.id = uuidv7()
  if (Array.isArray(block.props.children)) {
    block.props.children.forEach((child: Block) => regenerateIds(child))
  }
}

export function useBlockEditor(initialBlocks: Ref<Block[]>) {
  const history = shallowRef<Block[][]>([])
  const future = shallowRef<Block[][]>([])


  /**
   * Captures the current state of initialBlocks, adds it to the history,
   * and clears the future stack.
   */
  /**
   * Captures the state *before* a mutation, adds it to the history,
   * and clears the future stack.
   */
  const captureSnapshot = () => {
    const snapshot: Block[] = JSON.parse(JSON.stringify(initialBlocks.value))

    // 1. Clear the future stack (new action invalidates undone states)
    future.value = []

    // 💡 FIX 1: Force a new history array reference when pushing
    const newHistory = [...history.value, snapshot]

    // 2. Enforce the size limit
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift()
    }

    // 3. Assign the new array to the ref
    history.value = newHistory
  }

  /**
   * Central wrapper to execute any block mutation while managing history.
   * This is called by mutations (updateBlockProps, removeBlock, etc.)
   */
  const executeMutation = (mutationFn: () => void) => {
    // 1. Save the state *before* the mutation changes initialBlocks.value
    captureSnapshot()

    // 2. Execute the actual mutation (which changes initialBlocks.value)
    mutationFn()
  }

  // --- Core Undo/Redo Functions ---

  const undo = () => {
    if (history.value.length === 0) return

    // 1. Save the current state to future
    const currentState: Block[] = JSON.parse(JSON.stringify(initialBlocks.value))

    // 💡 FIX 2: Force a new future array reference when unshifting
    const newFuture = [currentState, ...future.value]
    future.value = newFuture

    // 2. Retrieve the previous state
    const previousState = history.value[history.value.length - 1]

    if (previousState) {
      // 3. Apply the previous state
      initialBlocks.value.splice(0, initialBlocks.value.length, ...previousState)

      // 4. FIX 3: Force a new history array reference when popping
      const newHistory = [...history.value]
      newHistory.pop()
      history.value = newHistory
    }
  }

  const redo = () => {
    if (future.value.length === 0) return

    // 1. Save the current state to history
    const currentState: Block[] = JSON.parse(JSON.stringify(initialBlocks.value))
    history.value = [...history.value, currentState]

    // 2. Get the next future state
    const nextState = future.value[0] // Get the first item (don't shift yet)

    if (nextState) {
      // 3. Apply the next state immutably.
      initialBlocks.value.splice(0, initialBlocks.value.length, ...nextState)

      // 4. FIX 4: Force a new future array reference when shifting/removing the first item
      const newFuture = [...future.value]
      newFuture.shift()
      future.value = newFuture
    }

    // 5. Enforce history size limit after pushing to history
    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value.shift() // This should be safe now if we were using a new array reference
    }
  }

  // --- Computed Flags for UI State ---

  // ✅ CORRECT: canUndo is true if there is a state *in the history stack* to revert to.
  const canUndo = computed(() => history.value.length > 0)

  // ✅ CORRECT: canRedo is true if there is a state *in the future stack* to advance to.
  const canRedo = computed(() => future.value.length > 0)


  // --- Refactored Block Mutation Methods ---

  // 💡 All public mutation methods must now call executeMutation()

  const updateBlockProps = (id: string, newProps: Record<string, any>) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id)
      if (!loc) return

      const oldBlock = loc.parentArray[loc.index]
      const newPropsObject = {
        ...oldBlock.props,
        ...newProps
      }

      const newBlock: Block = {
        ...oldBlock,
        props: newPropsObject
      }

      loc.parentArray.splice(loc.index, 1, newBlock)
    })
  }

  const removeBlock = (id: string) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id)
      if (!loc) return
      loc.parentArray.splice(loc.index, 1)
    })
  }

  const moveBlock = (id: string, direction: -1 | 1) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id)
      if (!loc) return

      const { parentArray, index } = loc
      const newIndex = index + direction

      if (newIndex >= 0 && newIndex < parentArray.length) {
        const [movedBlock] = parentArray.splice(index, 1)
        parentArray.splice(newIndex, 0, movedBlock)
      }
    })
  }

  const duplicateBlock = (id: string) => {
    executeMutation(() => {
      const loc = findBlockLocation(initialBlocks.value, id)
      if (!loc) return

      const original = loc.parentArray[loc.index]
      const clone: Block = JSON.parse(JSON.stringify(original))
      regenerateIds(clone)

      loc.parentArray.splice(loc.index + 1, 0, clone)
    })
  }

  const insertBlock = (
    newBlockType: Block["type"],
    targetId: string | null = null,
    position: "before" | "after" = "after"
  ) => {
    executeMutation(() => {
      const newBlock: Block = {
        id: uuidv7(),
        type: newBlockType,
        props: getDefaultPropsForType(newBlockType)
      }

      if (!targetId) {
        initialBlocks.value.push(newBlock)
        return
      }

      const loc = findBlockLocation(initialBlocks.value, targetId)
      if (loc) {
        const insertIndex = position === "after" ? loc.index + 1 : loc.index
        loc.parentArray.splice(insertIndex, 0, newBlock)
      }
    })
  }

  // --- Final Return ---

  return {
    updateBlockProps,
    removeBlock,
    moveBlock,
    duplicateBlock,
    insertBlock,
    undo,
    redo,
    canUndo,
    canRedo
  }
}

function getDefaultPropsForType(type: string): any {
  // You can expand this factory later
  return { children: [] }
}