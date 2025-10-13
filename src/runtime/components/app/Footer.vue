<script setup lang="ts">

</script>

<template>
  <footer class="py-8 lg:py-12">
    <UContainer class="flex flex-col justify-between gap-xl lg:flex-row">
      <div class="order-last flex flex-col items-center justify-between gap-xl lg:order-first lg:flex-1 lg:items-start">
        <slot name="left"/>
      </div>
      <div class="flex flex-col items-start order-2">
        <slot name="center"/>
      </div>
      <div class="order-first flex flex-col items-center justify-between gap-xl lg:order-last lg:flex-1 lg:items-end">
        <slot name="right"/>
      </div>
    </UContainer>
  </footer>
</template>

<style scoped>

</style>