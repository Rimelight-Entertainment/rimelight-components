<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import { tv } from "../../internal/tv"
import { useRC } from "../../composables/components/useRC"

export interface ScrollToTopProps {
  circleStrokeWidth?: number
  duration?: number
  rc?: {
    button?: string
    progressBase?: string
    svg?: string
    iconContainer?: string
    icon?: string
  }
}

const {
  circleStrokeWidth = 4,
  duration = 0.1,
  rc: rcProp
} = defineProps<ScrollToTopProps>()

export interface ScrollToTopEmits {}

const emit = defineEmits<ScrollToTopEmits>()

export interface ScrollToTopSlots {}

const slots = defineSlots<ScrollToTopSlots>()

const { rc } = useRC('ScrollToTop', rcProp)

const scrollToTopStyles = tv({
  slots: {
    button: "fixed right-4 bottom-4 z-50 size-20 lg:size-16",
    progressBase: "progress-circle-base size-full",
    svg: "size-full",
    iconContainer: "absolute inset-0 flex items-center justify-center text-center",
    icon: "size-6 text-white"
  }
})

const { button, progressBase, svg, iconContainer, icon } = scrollToTopStyles()

const scrollPercentage = ref(0)
const minScrollThreshold = 15

const isVisible = computed(() => scrollPercentage.value >= minScrollThreshold)

/**
 * Calculates the current scroll percentage of the page.
 */
function updatePageScroll() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return
  }

  const scrollY = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight

  if (maxScroll <= 0) {
    scrollPercentage.value = 0
    return
  }

  scrollPercentage.value = Math.min((scrollY / maxScroll) * 100, 100)
}

/**
 * Smoothly scrolls the viewport to the top of the page.
 */
function scrollToTop() {
  if (typeof window === "undefined") return

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  if (typeof window === "undefined") return

  window.addEventListener("scroll", updatePageScroll, { passive: true })

  updatePageScroll()
})

onUnmounted(() => {
  if (typeof window === "undefined") return
  window.removeEventListener("scroll", updatePageScroll)
})

const circumference = 2 * Math.PI * 45
const percentPx = circumference / 100

const currentPercent = computed(
  () => ((scrollPercentage.value - 0) / 100) * 100
)

const percentageInPx = computed(() => `${percentPx}px`)
const durationInSeconds = computed(() => `${duration}s`)
</script>

<template>
  <ClientOnly>
    <Transition
      name="fade"
      enter-active-class="transition-opacity duration-500 ease-in"
      leave-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isVisible">
        <UButton variant="ghost" :class="button({ class: rc.button })" @click="scrollToTop">
          <div :class="progressBase({ class: rc.progressBase })">
            <svg :class="svg({ class: rc.svg })" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="var(--color-primary-950)"
                :stroke-width="circleStrokeWidth"
                stroke-dashoffset="0"
                stroke-linecap="round"
                class="gauge-secondary-stroke opacity-100"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                :stroke-width="circleStrokeWidth"
                stroke-dashoffset="0"
                stroke-linecap="round"
                class="gauge-primary-stroke opacity-100"
              />
            </svg>
            <div :class="iconContainer({ class: rc.iconContainer })">
              <UIcon name="lucide:arrow-up" :class="icon({ class: rc.icon })" />
            </div>
          </div>
        </UButton>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.progress-circle-base {
  --circle-size: 100px;
  --circumference: v-bind(circumference);
  --percent-to-px: v-bind(percentageInPx);
  /* The progress bar component used complex gap logic. I am simplifying the rotation
     to standard -90deg (start at the top) for a continuous scroll indicator. */
  transform: translateZ(0);
}

.gauge-primary-stroke {
  stroke: var(--color-primary-500);
  --stroke-percent: v-bind(currentPercent);

  /* Calculate the length of the colored part of the circle */
  stroke-dasharray: calc(var(--stroke-percent) * var(--percent-to-px))
    var(--circumference);

  /* Apply transition for smooth animation */
  transition:
    stroke-dasharray v-bind(durationInSeconds) ease,
    stroke v-bind(durationInSeconds) ease;

  /* Start the stroke at the top center (-90 degrees) */
  transform: rotate(-90deg);
  transform-origin: center;
}

.gauge-secondary-stroke {
  stroke: var(--color-primary-900);
  /* Full circle dash array for the secondary stroke (background) */
  stroke-dasharray: var(--circumference);

  /* Start the stroke at the top center (-90 degrees) */
  transform: rotate(-90deg);
  transform-origin: center;
}
</style>
