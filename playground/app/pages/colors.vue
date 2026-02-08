<script setup lang="ts">
import mainCss from "~/assets/css/main.css?raw"
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-bold mb-4">Color Palette</h1>
      <p class="text-muted text-lg">
        This palette is dynamically generated from <code>main.css</code> using the <code>ColorPalette</code> component.
      </p>
    </div>

    <ColorPalette :css="mainCss" />
  </UContainer>
</template>
