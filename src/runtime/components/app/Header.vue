<script setup lang="ts">

</script>

<template>
  <header class="h-[var(--ui-header-height)]">
    <UContainer class="h-full">
      <div class="flex flex-row items-center justify-between p-sm h-full">
        <div class="sm:hidden">
          <slot name="collapsed-left" />
        </div>
        <div class="sm:hidden">
          <slot name="collapsed-center" />
        </div>
        <div class="sm:hidden">
          <slot name="collapsed-right" />
        </div>
        <div class="hidden sm:block">
          <slot name="left" />
        </div>
        <div class="hidden sm:block">
          <slot name="center" />
        </div>
        <div class="hidden sm:block">
          <slot name="right" />
        </div>
      </div>
    </UContainer>
  </header>
</template>

<style scoped>

</style>
