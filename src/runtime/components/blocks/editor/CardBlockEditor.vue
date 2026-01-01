<script setup lang="ts">
import type { CardBlockProps } from "../../../types"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"

export interface CardBlockEditorProps extends CardBlockProps {
  rc?: {
    card?: string
  }
}

const { title, to, target, children, rc: rcProp } = defineProps<CardBlockEditorProps>()

export interface CardBlockEditorEmits {}

const emit = defineEmits<CardBlockEditorEmits>()

export interface CardBlockEditorSlots {}

const slots = defineSlots<CardBlockEditorSlots>()

const { rc } = useRC('CardBlockEditor', rcProp)

const cardBlockEditorStyles = tv({
  slots: {
    card: "flex h-full flex-col"
  }
})

const { card } = cardBlockEditorStyles()
</script>

<template>
  <NuxtLink :to="to" :target="target">
    <UCard :class="card({ class: rc.card })">
      <h3>{{ title }}</h3>
      <RCBlockEditRenderer :blocks="children" />
    </UCard>
  </NuxtLink>
</template>
