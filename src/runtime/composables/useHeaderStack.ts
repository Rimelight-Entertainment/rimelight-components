import { ref, computed } from 'vue'

interface HeaderLayer {
  id: string
  height: number
  order: number
}

const layers = ref<HeaderLayer[]>([])

export const useHeaderStack = () => {
  const registerHeader = (id: string, height: number, order: number = 10) => {
    const existingLayer = layers.value.find((l) => l.id === id)

    if (existingLayer) {
      // Only update if the height actually changed to prevent jitter
      if (existingLayer.height !== height) {
        existingLayer.height = height
      }
    } else {
      layers.value.push({ id, height, order })
      // Keep layers sorted so the top-down calculation is always correct
      layers.value.sort((a, b) => a.order - b.order)
    }
  }

  const unregisterHeader = (id: string) => {
    layers.value = layers.value.filter((l) => l.id !== id)
  }

  const totalOffset = computed(() =>
    layers.value.reduce((acc, l) => acc + l.height, 0)
  )

  const getOffsetFor = (id: string) => {
    const index = layers.value.findIndex((l) => l.id === id)
    if (index === -1) return 0
    return layers.value.slice(0, index).reduce((acc, l) => acc + l.height, 0)
  }

  return {
    registerHeader,
    unregisterHeader,
    totalOffset,
    getOffsetFor,
    layers: computed(() => layers.value)
  }
}
