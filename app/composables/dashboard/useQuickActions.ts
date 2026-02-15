import { useNuxtApp, useState } from "#app"
import { type Ref, shallowRef, computed } from "vue"

export interface QuickAction {
  id: string
  label: string
  icon: string
  group?: number
  onSelect: () => void
}

/**
 * A simple registry for any action in the app
 */
export const useQuickActions = () => {
  const nuxtApp = useNuxtApp()

  if (!nuxtApp._quickActionsRegistry) {
    nuxtApp._quickActionsRegistry = shallowRef(new Map<string, QuickAction>())
  }

  const registeredActionsMap = nuxtApp._quickActionsRegistry as Ref<Map<string, QuickAction>>
  const activeQuickActionIds = useState<string[]>("quick-action-ids", () => [])

  function registerAction(action: QuickAction) {
    registeredActionsMap.value.set(action.id, action)
    registeredActionsMap.value = new Map(registeredActionsMap.value)
    if (!activeQuickActionIds.value.includes(action.id)) {
      activeQuickActionIds.value = [...activeQuickActionIds.value, action.id]
    }
  }

  function unregisterAction(id: string) {
    registeredActionsMap.value.delete(id)
    registeredActionsMap.value = new Map(registeredActionsMap.value)
    activeQuickActionIds.value = activeQuickActionIds.value.filter((i) => i !== id)
  }

  const registeredActions = computed(() => {
    return activeQuickActionIds.value
      .map(id => registeredActionsMap.value.get(id))
      .filter((a): a is QuickAction => !!a)
  })

  return {
    registeredActions,
    registerAction,
    unregisterAction
  }
}
