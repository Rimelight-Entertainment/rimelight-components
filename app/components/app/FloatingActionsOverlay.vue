<script setup lang="ts">
import { onMounted, markRaw } from "vue"
import { useFloatingActions } from "../../composables/app/useFloatingActions"
import { RCScrollToTop, RCQuickActions } from "#components"

const { registerAction } = useFloatingActions()
const { actions } = useFloatingActions()

onMounted(() => {
  // Register standard global actions
  registerAction({
    id: "quick-actions",
    priority: 10,
    component: markRaw(RCQuickActions)
  })

  registerAction({
    id: "scroll-to-top",
    priority: 0,
    component: markRaw(RCScrollToTop)
  })
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[10000] flex flex-col-reverse items-center gap-4 pointer-events-none">
    <div
      v-for="action in actions"
      :key="action.id"
      class="pointer-events-auto flex items-center justify-center font-normal"
    >
      <component
        :is="action.component"
        v-if="action.component"
      />
      <UTooltip
        v-else-if="action.icon || action.label"
        :text="action.label"
      >
        <UButton
          :icon="action.icon"
          color="primary"
          square
          :ui="{
            base: 'rounded-full size-14 lg:size-12 justify-center shadow-lg hover:scale-110 transition-transform',
            leadingIcon: 'size-6'
          }"
          @click="action.onSelect"
        />
      </UTooltip>
    </div>
  </div>
</template>

<style scoped></style>
