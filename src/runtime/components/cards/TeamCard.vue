<script setup lang="ts">
import { tv } from "../../internal/tv"
import { useRC } from "../../composables/useRC"

export interface TeamCardProps {
  src: string
  alt: string
  name: string
  role: string
  description: string
  rc?: {
    details?: string
    name?: string
    role?: string
    description?: string
    links?: string
  }
}

const { src, alt, name, role, description, rc: rcProp } = defineProps<TeamCardProps>()

export interface TeamCardEmits {}

const emit = defineEmits<TeamCardEmits>()

export interface TeamCardSlots {
  links: (props: {}) => any
}

const slots = defineSlots<TeamCardSlots>()

const { rc } = useRC('TeamCard', rcProp)

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
    <div :class="details({ class: rc.details })">
      <h3 :class="nameClass({ class: rc.name })">
        {{ name }}
      </h3>
      <span :class="roleClass({ class: rc.role })">{{ role }}</span>
    </div>
    <p :class="descriptionClass({ class: rc.description })">
      {{ description }}
    </p>
    <template #footer>
      <div :class="links({ class: rc.links })">
        <slot name="links" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
