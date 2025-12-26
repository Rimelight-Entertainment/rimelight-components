<script setup lang="ts">
import { useHeaderStack } from "rimelight-components/composables"

const { totalOffset } = useHeaderStack()
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalOffset}px` }">
    <RCHeaderLayer id="banner" :order="1" hide-on-scroll>
      <UBanner
        icon="lucide:construction"
        title="This module is under constant development, you may see placeholder or incomplete content."
        class="bg-accented"
      />
    </RCHeaderLayer>

    <RCHeaderLayer id="global-header" :order="2">
      <AppHeader />
    </RCHeaderLayer>

    <UMain class="bg-primary-900 transition-[padding-top] duration-400 ease-in-out"
           :style="{ paddingTop: 'var(--total-header-offset)' }">
      <slot />
    </UMain>
    <ClientOnly>
      <div class="fixed bottom-4 right-4 z-[9999] bg-black text-white p-2 text-xs">
        Total Offset: {{ totalOffset }}px
        Layers: {{ layers.length }}
      </div>
    </ClientOnly>
    <AppFooter />
  </div>
</template>

<style scoped></style>
