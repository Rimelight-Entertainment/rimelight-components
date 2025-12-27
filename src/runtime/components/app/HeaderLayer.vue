<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue"
import { useHeaderStack } from "../../composables"
import { useWindowScroll } from "@vueuse/core"
import { tv } from "tailwind-variants"

export interface HeaderLayerProps {
  id: string
  order?: number
  hideOnScroll?: boolean
}

const props = defineProps<HeaderLayerProps>()

export interface HeaderLayerEmits {}

const emit = defineEmits<HeaderLayerEmits>()

const headerLayerStyles = tv({
  slots: {
    root: "fixed left-0 right-0 z-50 overflow-hidden transition-[top,height,opacity] duration-200 ease-in-out",
    content: "w-full"
  }
})

const { root, content } = headerLayerStyles()

const { registerHeader, unregisterHeader, getOffsetFor } = useHeaderStack()
const { y: scrollY } = useWindowScroll()

const contentRef = ref<HTMLElement | null>(null)
const isVisible = ref(true)
const lastScrollY = ref(0)

// This tracks the "measured" height of the children
const naturalHeight = ref(0)

const topOffset = computed(() => getOffsetFor(props.id))

watch(scrollY, (current) => {
  if (!props.hideOnScroll) return

  const diff = current - lastScrollY.value
  // Don't hide if we are within the top 50px or if the scroll was tiny
  if (Math.abs(diff) < 10) return

  if (current <= 50) {
    isVisible.value = true
  } else isVisible.value = diff <= 0;

  lastScrollY.value = current
})

const updateStack = () => {
  // We register either the full height or 0.
  // Because the stack is reactive, changing this triggers the transition
  // on UMain and other HeaderLayers simultaneously.
  const heightToRegister = isVisible.value ? naturalHeight.value : 0
  registerHeader(props.id, heightToRegister, props.order)
}

// When visibility changes, update the stack immediately
watch(isVisible, updateStack)

let observer: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    if (contentRef.value) {
      naturalHeight.value = contentRef.value.getBoundingClientRect().height
      updateStack()

      observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry) {
          const height = entry.contentRect.height
          if (height > 0) {
            naturalHeight.value = height
            updateStack()
          }
        }
      })
      observer.observe(contentRef.value)
    }
  })
})

onUnmounted(() => {
  unregisterHeader(props.id)
  observer?.disconnect()
})
</script>

<template>
  <div
    :class="root()"
    :style="{
      top: `${topOffset}px`,
      height: isVisible ? `${naturalHeight}px` : '0px',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none'
    }"
  >
    <div ref="contentRef" :class="content()">
      <slot />
    </div>
  </div>
</template>
