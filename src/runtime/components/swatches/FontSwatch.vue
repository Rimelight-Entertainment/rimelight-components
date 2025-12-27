<script setup lang="ts">
import { computed } from "vue"
import { tv } from "tailwind-variants"

export interface FontSwatchProps {
  name?: string
  jpg?: string
  png?: string
  webp?: string
  svg?: string
}

const { name, jpg, png, webp, svg } = defineProps<FontSwatchProps>()

export interface FontSwatchEmits {}

const emit = defineEmits<FontSwatchEmits>()

const fontSwatchStyles = tv({
  slots: {
    card: "w-full rounded-none xl:w-fit",
    title: "text-lg font-bold",
    content: "flex flex-col gap-sm",
    actions: "flex flex-col items-center gap-sm xl:flex-row xl:items-start",
    buttonGroup: "flex w-full flex-col justify-center gap-sm",
    button: "w-full xl:w-36"
  }
})

const { card, title: titleStyle, content, actions, buttonGroup, button } = fontSwatchStyles()

const image = computed(() => {
  if (webp) return webp
  if (png) return png
  if (jpg) return jpg
  if (svg) return svg

  return undefined
})
</script>

<template>
  <UCard variant="subtle" :class="card()">
    <template #header v-if="name">
      <h3 :class="titleStyle()">{{ name }}</h3>
      <span></span>
    </template>
    <div :class="content()">
      <h1>H1</h1>
      <p>{{}}</p>
    </div>
    <h2>H2</h2>
    <h3>H3</h3>
    <p>a b c d e f g h i j k l m n o p q r s t u v w x y z</p>
    <p>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
    <p></p>
    <div :class="actions()">
      <div :class="buttonGroup()">
        <UButton
          v-if="jpg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download JPG"
          :class="button()"
          :to="jpg"
          target="_blank"
        />
        <UButton
          v-if="png"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download PNG"
          :class="button()"
          :to="png"
          target="_blank"
        />
        <UButton
          v-if="webp"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download WEBP"
          :class="button()"
          :to="webp"
          target="_blank"
        />
        <UButton
          v-if="svg"
          variant="outline"
          size="sm"
          icon="lucide:download"
          label="Download SVG"
          :class="button()"
          :to="svg"
          target="_blank"
        />
      </div>
    </div>
  </UCard>
</template>
