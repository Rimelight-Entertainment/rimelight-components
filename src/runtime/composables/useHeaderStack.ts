import { computed } from 'vue'
import { useState } from '#app'

interface HeaderLayer {
  id: string
  height: number
  order: number
}

export const useHeaderStack = () => {
  const layers = useState<HeaderLayer[]>('header-layers', () => [])

  const registerHeader = (id: string, height: number, order: number = 10) => {
    const existingLayer = layers.value.find((l) => l.id === id)
    if (existingLayer) {
      if (existingLayer.height !== height) {
        existingLayer.height = height
      }
    } else {
      layers.value.push({ id, height, order })
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
