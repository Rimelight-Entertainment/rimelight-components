<script setup lang="ts">
import { computed } from "#imports"

const { name, jpg, png, webp, svg } = defineProps<{
  name?: string
  jpg?: string
  png?: string
  webp?: string
  svg?: string
}>()

const image = computed(() => {
  if (webp) return webp
  if (png) return png
  if (jpg) return jpg
  if (svg) return svg

  return undefined
})
</script>

<template>
  <UCard variant="subtle" class="w-full rounded-none xl:w-fit">
    <template #header v-if="name">
      <h3 class="text-lg font-bold">{{ name }}</h3>
      <span></span>
    </template>
    <div class="gap-sm flex flex-col">
      <h1>H1</h1>
      <p>{{}}</p>
    </div>
    <h2>H2</h2>
    <h3>H3</h3>
    <p>a b c d e f g h i j k l m n o p q r s t u v w x y z</p>
    <p>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
    <p></p>
    <div class="gap-sm flex flex-col items-center xl:flex-row xl:items-start">
      <div class="gap-sm flex w-full flex-col justify-center">
        <UButton
          v-if="jpg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download JPG"
          class="w-full xl:w-36"
          :to="jpg"
          target="_blank"
        />
        <UButton
          v-if="png"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download PNG"
          class="w-full xl:w-36"
          :to="png"
          target="_blank"
        />
        <UButton
          v-if="webp"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download WEBP"
          class="w-full xl:w-36"
          :to="webp"
          target="_blank"
        />
        <UButton
          v-if="svg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download SVG"
          class="w-full xl:w-36"
          :to="svg"
          target="_blank"
        />
      </div>
    </div>
  </UCard>
</template>
