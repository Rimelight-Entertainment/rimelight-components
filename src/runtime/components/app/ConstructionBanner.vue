<script setup lang="ts">
import { ref } from "vue"

const { to } = defineProps<{
  to: string
}>()

const actions = ref([
  {
    label: "View on GitHub",
    trailingIcon: "mdi:github",
    to: to
  }
])
</script>

<template>
  <UBanner
      color="primary"
      icon="lucide:construction"
      title="This website is currently under construction. Feel free to report any issues!"
      :actions="actions"
      close
  />
</template>

<style scoped></style>
