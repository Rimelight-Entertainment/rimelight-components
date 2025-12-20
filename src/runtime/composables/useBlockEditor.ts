import { type Ref, computed, ref, shallowRef } from "vue"
import { v7 as uuidv7 } from "uuid"
import type { Block } from "../types"

/**
 * Helper: Recursively finds the parent array and index of a block by ID.
 */
function findBlockLocation(
  blocks: Block[],
  id: string
): { parentArray: Block[]; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (!block) continue;

    if (block.id === id) {
      return { parentArray: blocks, index: i }
    }

    // Since the children property only exists on certain block types,
    // we use the type guard established in the previous step.
    if ('children' in block.props && Array.isArray(block.props.children)) {
      // Recursion: TS knows block.props.children is Block[] here.
      const result = findBlockLocation(block.props.children as Block[], id)
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

  // 💡 FIX: Apply the type guard to ensure 'children' property exists on 'props'.
  // This satisfies TypeScript that we are only accessing 'children' on container blocks.
  if ('children' in block.props && Array.isArray(block.props.children)) {
    // TypeScript now knows block.props.children is safe to access and iterate over (as Block[])

    // We can remove the redundant ': Block[]' cast here since the guard is strong enough,
    // but the following is also safe and clear:
    block.props.children.forEach((child: Block) => regenerateIds(child))
  }
  // No need for an 'else' block, as blocks without children simply terminate the recursion here.
}

export function useBlockEditor(
  initialBlocks: Ref<Block[]>,
  { maxHistorySize = 100, onMutation }: { maxHistorySize?: number, onMutation?: () => void } = {}
) {
  const history = shallowRef<Block[][]>([])
  const future = shallowRef<Block[][]>([])
  const committedBlocks = ref<Block[]>(JSON.parse(JSON.stringify(initialBlocks.value)))


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

    // Enforce the size limit
    if (newHistory.length > maxHistorySize) {
      // Remove the oldest entry
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
    if (onMutation) {
      onMutation() // This triggers the Page-level snapshot
    } else {
      captureSnapshot() // Fallback to internal block-only history
    }
    mutationFn()
  }

  // --- Core Undo/Redo Functions ---

  const undo = () => {
    if (history.value.length === 0) return

    const currentState: Block[] = JSON.parse(JSON.stringify(initialBlocks.value))
    future.value = [currentState, ...future.value]

    const previousState = history.value[history.value.length - 1]

    if (previousState) {
      initialBlocks.value.splice(0, initialBlocks.value.length, ...previousState)

      const newHistory = [...history.value]
      newHistory.pop()
      history.value = newHistory
    }
  }

  const redo = () => {
    if (future.value.length === 0) return

    const currentState: Block[] = JSON.parse(JSON.stringify(initialBlocks.value))

    // 💡 FIX: Check size limit *after* pushing to history during redo.
    // If the history stack is full, we must discard the oldest item BEFORE adding the new one.
    let newHistory = [...history.value, currentState]

    // Enforce size limit on history before continuing
    if (newHistory.length > maxHistorySize) {
      newHistory.shift()
    }
    history.value = newHistory

    const nextState = future.value[0]

    if (nextState) {
      initialBlocks.value.splice(0, initialBlocks.value.length, ...nextState)

      const newFuture = [...future.value]
      newFuture.shift()
      future.value = newFuture
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

      // 1. TS18048 FIX: Safely retrieve the block from the array location.
      // The previous check (if (!loc) return) guarantees parentArray and index exist.
      // TypeScript, however, still warns about array indexing.
      const oldBlock = loc.parentArray[loc.index]

      // We check if oldBlock is truthy. Since loc exists, oldBlock should too,
      // but this satisfies TS strict mode for array access inside a loop context.
      if (!oldBlock) return

      // --- TS2322 FIX: Solving the Block Union Assignment ---

      // The error occurs because TypeScript cannot guarantee that the result of:
      // { ...oldBlock, props: newPropsObject }
      // still adheres to the strict structure of the Block union type.
      // Specifically, when we spread the properties, TypeScript can lose track of the
      // discriminant property (`type`) relative to the expected `props`.

      // We have to explicitly define the required properties (`id` and `type`)
      // when constructing the new block object, even though they come from the spread.

      // 2. Create the new props object
      const newPropsObject: Record<string, any> = {
        ...oldBlock.props,
        ...newProps
      }

      // 3. Construct the new block, explicitly ensuring the required Block fields are present.
      // The easiest fix is to cast the final object back to the Block type,
      // assuming we know the structure is preserved.
      const newBlock: Block = {
        id: oldBlock.id, // Explicitly carry over the required BaseBlock properties
        type: oldBlock.type, // Explicitly carry over the required BaseBlock properties
        props: newPropsObject
      } as Block; // We use an 'as Block' cast as the structure is preserved

      // Alternative FIX for Step 3 (safer but verbose):
      /*
      const newBlock = {
        ...oldBlock, // This brings over id, type, and props
        props: newPropsObject // This overwrites the props property
      } as Block
      */

      // 4. Replace the old block with the new one
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
        // Alternative: Accessing by index [0] to get the movedBlock.
        const movedBlock = parentArray.splice(index, 1)[0]

        // We still need to confirm it's not undefined because the type of the result
        // of array access might be Block | undefined if the array is Block[].
        if (movedBlock) {
          parentArray.splice(newIndex, 0, movedBlock)
        }
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

  const commitChanges = (): Block[] => {
    // 1. Take a deep copy of the current working state (initialBlocks)
    const committedSnapshot: Block[] = JSON.parse(JSON.stringify(initialBlocks.value))

    // 2. Update the internal ref
    committedBlocks.value = committedSnapshot

    // 3. Return the snapshot for immediate use (e.g., passing to an API call)
    return committedSnapshot
  }

  return {
    // Mutations
    updateBlockProps,
    removeBlock,
    moveBlock,
    duplicateBlock,
    insertBlock,
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    // State
    committedBlocks: committedBlocks,
    commitChanges: commitChanges,
  }
}

function getDefaultPropsForType(type: string): any {
  // You can expand this factory later
  return { children: [] }
}