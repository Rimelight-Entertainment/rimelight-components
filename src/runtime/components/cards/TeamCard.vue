<script setup lang="ts">
import { tv } from "tailwind-variants"

export interface TeamCardProps {
  src: string
  alt: string
  name: string
  role: string
  description: string
}

const { src, alt, name, role, description } = defineProps<TeamCardProps>()

export interface TeamCardEmits {}

const emit = defineEmits<TeamCardEmits>()

const teamCardStyles = tv({
  slots: {
    details: "flex flex-col gap-xs",
    name: "text-xl font-bold",
    role: "text-sm",
    description: "text-md",
    links: "flex flex-row gap-md"
  }
})

const {
  details,
  name: nameClass,
  role: roleClass,
  description: descriptionClass,
  links
} = teamCardStyles()
</script>

<template>
  <UCard>
    <RCImage :src="src" :alt="alt" />
    <div :class="details()">
      <h3 :class="nameClass()">
        {{ name }}
      </h3>
      <span :class="roleClass()">{{ role }}</span>
    </div>
    <p :class="descriptionClass()">
      {{ description }}
    </p>
    <template #footer>
      <div :class="links()">
        <slot name="links" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
