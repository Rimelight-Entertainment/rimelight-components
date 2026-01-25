import { computed, type Ref, shallowRef, watch } from "vue"
import type { Page } from "../types/pages"

export function usePageEditor(page: Ref<Page>, maxHistorySize: number = 100) {
  const history = shallowRef<string[]>([]) // Store as JSON strings for clean snapshots
  const future = shallowRef<string[]>([])

  const captureSnapshot = () => {
    const snapshot = JSON.stringify(page.value)
    // Only push if the state actually changed to avoid "empty" undo steps
    if (history.value.length > 0 && history.value[history.value.length - 1] === snapshot) return

    future.value = []
    const newHistory = [...history.value, snapshot]
    if (newHistory.length > maxHistorySize) newHistory.shift()
    history.value = newHistory
  }

  const undo = () => {
    if (history.value.length === 0) return
    future.value = [JSON.stringify(page.value), ...future.value]

    page.value = JSON.parse(history.value.pop()!)
  }

  const redo = () => {
    if (future.value.length === 0) return
    history.value = [...history.value, JSON.stringify(page.value)]

    page.value = JSON.parse(future.value.shift()!)
  }

  const canUndo = computed(() => history.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  const save = () => {
    return JSON.parse(JSON.stringify(page.value))
  }

  // This is the "Magic": we watch for property changes to trigger history snapshots
  // We use deep: true to catch nested property updates
  watch(
    () => page.value.properties,
    () => {
      // We might want to debounce this so typing in a text field
      // doesn't create 50 history states
      captureSnapshot()
    },
    { deep: true }
  )

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    save,
    captureSnapshot
  }
}
