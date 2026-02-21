<script setup lang="ts">
import { useHeaderStack } from "rimelight-components/composables";

const { totalHeight } = useHeaderStack();
</script>

<template>
  <div :style="{ '--total-header-offset': `${totalHeight}px` }">
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

    <UMain
      class="bg-default"
      :style="{ paddingTop: 'var(--total-header-offset)' }"
    >
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>

<style scoped></style>
