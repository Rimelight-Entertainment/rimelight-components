<script setup lang="ts">
import type { CardBlockProps } from "../../../types"
import { tv } from "tailwind-variants"

export interface CardBlockRendererProps extends CardBlockProps {}

const { title, to, target, children } = defineProps<CardBlockRendererProps>()

export interface CardBlockRendererEmits {}

const emit = defineEmits<CardBlockRendererEmits>()

const cardBlockRendererStyles = tv({
  slots: {
    card: "flex h-full flex-col"
  }
})

const { card } = cardBlockRendererStyles()
</script>

<template>
  <NuxtLink :to="to" :target="target">
    <UCard :class="card()">
      <h3>{{ title }}</h3>
      <RCBlockViewRenderer :blocks="children" />
    </UCard>
  </NuxtLink>
</template>
