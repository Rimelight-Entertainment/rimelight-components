import { createEditorStore } from '../stores/editor'
import { useNuxtApp } from '#app'
import type { Pinia } from 'pinia'

/**
 * @composable useContentEditor
 * Initializes and returns the unique editor Pinia store instance for the current application.
 *
 * @param {string} baseApiUrl - The site-specific base API path.
 * @param {number} [debounceDelayMs=800] - Optional delay for debouncing saves.
 * @returns The initialized Pinia store instance.
 */
export const useContentEditor = (
  baseApiUrl: string,
  debounceDelayMs: number = 800
) => {
  const nuxtApp = useNuxtApp()

  // 1. Retrieve the Pinia instance from the Nuxt App context
  // Nuxt automatically injects the Pinia instance as '$pinia'
  const piniaInstance = nuxtApp.$pinia as Pinia

  // 2. Create the unique store definition (the hook function)
  const EditorStoreDefinition = createEditorStore({
    baseApiUrl,
    debounceDelayMs,
  })

  // 3. FIX: Execute the store hook, explicitly passing the Pinia instance.
  // This satisfies the hook's type requirement (Pinia | null | undefined).
  return EditorStoreDefinition(piniaInstance)
}
