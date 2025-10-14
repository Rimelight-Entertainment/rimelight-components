<script setup lang="ts"></script>

<template>
  <header class="sticky top-0 z-50 h-[var(--ui-header-height)]">
    <UContainer class="h-full">
      <div class="flex h-full flex-row items-center justify-between p-sm">
        <div class="lg:hidden">
          <slot name="collapsed-left" />
        </div>
        <div class="lg:hidden">
          <slot name="collapsed-center" />
        </div>
        <div class="lg:hidden">
          <slot name="collapsed-right" />
        </div>
        <div class="hidden lg:flex">
          <slot name="left" />
        </div>
        <div class="hidden lg:flex">
          <slot name="center" />
        </div>
        <div class="hidden lg:flex">
          <slot name="right" />
        </div>
      </div>
    </UContainer>
  </header>
</template>

<style scoped></style>
