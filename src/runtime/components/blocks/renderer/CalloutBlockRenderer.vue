<script setup lang="ts">
import type { CalloutBlockProps } from "~~/src/runtime/types/blocks"

const { variant, children, to, target } = defineProps<CalloutBlockProps>()
</script>

<template>
  <RCCallout :variant="variant" :to="to" :target="target">
    <RCBlockRenderer :blocks="children" />
  </RCCallout>
</template>
