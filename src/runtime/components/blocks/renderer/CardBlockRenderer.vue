<script setup lang="ts">
import type { CardBlockProps } from "../../../types"
import { tv } from "../../../utils/tv"
import { useRC } from "../../../composables/useRC"

export interface CardBlockRendererProps extends CardBlockProps {
  rc?: {
    card?: string
  }
}

const { title, to, target, children, rc: rcProp } = defineProps<CardBlockRendererProps>()

export interface CardBlockRendererEmits {}

const emit = defineEmits<CardBlockRendererEmits>()

export interface CardBlockRendererSlots {}

const slots = defineSlots<CardBlockRendererSlots>()

const { rc } = useRC('CardBlockRenderer', rcProp)

const cardBlockRendererStyles = tv({
  slots: {
    card: "flex h-full flex-col"
  }
})

const { card } = cardBlockRendererStyles()
</script>

<template>
  <NuxtLink :to="to" :target="target">
    <UCard :class="card({ class: rc.card })">
      <h3>{{ title }}</h3>
      <RCBlockViewRenderer :blocks="children" />
    </UCard>
  </NuxtLink>
</template>
