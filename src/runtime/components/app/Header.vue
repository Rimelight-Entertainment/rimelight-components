<script setup lang="ts">

</script>

<template>
  <header>
    <UContainer>
      <div class="flex flex-row items-center justify-between p-sm">
        <div class="hidden sm:block">
          <slot name="collapsed-left" />
        </div>
        <div class="hidden sm:block">
          <slot name="collapsed-center" />
        </div>
        <div class="hidden sm:block">
          <slot name="collapsed-right" />
        </div>
        <div class="sm:hidden">
          <slot name="left" />
        </div>
        <div class="sm:hidden">
          <slot name="center" />
        </div>
        <div class="sm:hidden">
          <slot name="right" />
        </div>
      </div>
    </UContainer>
  </header>
</template>

<style scoped>

</style>
