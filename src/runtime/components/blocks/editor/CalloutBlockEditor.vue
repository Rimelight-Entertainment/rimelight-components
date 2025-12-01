<script setup lang="ts">
import type { CalloutBlockProps } from "~~/src/runtime/types/blocks"

const { variant, children, to, target } = defineProps<CalloutBlockProps>()
</script>

<template>
  <div class="p-8 bg-error-500">
  <RCCallout :variant="variant" :to="to" :target="target">
    <RCBlockEditor :blocks="children" />
  </RCCallout>
  </div>
</template>
