<script setup lang="ts">
import type { CalloutBlockProps } from "~~/src/runtime/types/blocks"

const { variant, children, to, target } = defineProps<CalloutBlockProps>()
</script>

<template>
  <RCCallout :variant="variant" :to="to" :target="target">
    <RCBlockEditor :blocks="children" />
  </RCCallout>
</template>
