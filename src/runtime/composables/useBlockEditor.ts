// composables/useBlockEditor.ts
import { type Ref } from "vue"
import { v7 as uuidv7 } from "uuid"
import type { Block } from "../types/blocks"

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
  /**
   * Update a specific property of a block (e.g., text content).
   * Uses an IMMUTABLE approach: creates a new block object and replaces the old one.
   * This is crucial for stability and future undo/redo features.
   */
  const updateBlockProps = (id: string, newProps: Record<string, any>) => {
    const loc = findBlockLocation(initialBlocks.value, id)
    if (!loc) return

    const oldBlock = loc.parentArray[loc.index]

    // 1. Create a new props object by spreading the old one and applying newProps.
    const newPropsObject = {
      ...oldBlock.props,
      ...newProps
    }

    // 2. Create a new block object by spreading the old block and replacing the props.
    // This preserves the block's ID and type, but gives Vue a new object reference.
    const newBlock: Block = {
      ...oldBlock,
      props: newPropsObject
    }

    // 3. Replace the old block with the new one in the parent array.
    loc.parentArray.splice(loc.index, 1, newBlock)
  }

  /**
   * Remove a block from the tree.
   */
  const removeBlock = (id: string) => {
    const loc = findBlockLocation(initialBlocks.value, id)
    if (!loc) return

    loc.parentArray.splice(loc.index, 1)
  }

  /**
   * Move a block up (-1) or down (+1) within its current parent.
   */
  const moveBlock = (id: string, direction: -1 | 1) => {
    const loc = findBlockLocation(initialBlocks.value, id)
    if (!loc) return

    const { parentArray, index } = loc
    const newIndex = index + direction

    if (newIndex >= 0 && newIndex < parentArray.length) {
      const [movedBlock] = parentArray.splice(index, 1)
      parentArray.splice(newIndex, 0, movedBlock)
    }
  }

  /**
   * Duplicate a block and insert it immediately after the original.
   */
  const duplicateBlock = (id: string) => {
    const loc = findBlockLocation(initialBlocks.value, id)
    if (!loc) return

    const original = loc.parentArray[loc.index]

    // Deep clone
    const clone: Block = JSON.parse(JSON.stringify(original))

    // Regenerate IDs for the clone and ALL descendants to ensure unique keys
    regenerateIds(clone)

    loc.parentArray.splice(loc.index + 1, 0, clone)
  }

  /**
   * Insert a new block at a specific location.
   */
  const insertBlock = (
    newBlockType: Block["type"],
    targetId: string | null = null,
    position: "before" | "after" = "after"
  ) => {
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
  }

  return {
    updateBlockProps,
    removeBlock,
    moveBlock,
    duplicateBlock,
    insertBlock
  }
}

function getDefaultPropsForType(type: string): any {
  // You can expand this factory later
  return { children: [] }
}
