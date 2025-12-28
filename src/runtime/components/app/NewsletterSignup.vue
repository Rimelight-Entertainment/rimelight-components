<script setup lang="ts">
import { tv } from "../../utils/tv"
import { useRC } from "../../composables/useRC"

export interface NewsletterSignupProps {
  fieldLabel?: string
  description?: string
  placeholder?: string
  buttonLabel?: string
  rc?: {
    group?: string
  }
}

const {
  fieldLabel = "Subscribe to our Newsletter",
  description = "Stay updated on new posts and updates. Unsubscribe at any time.",
  placeholder = "email@domain.com",
  buttonLabel = "Subscribe",
  rc: rcProp
} = defineProps<NewsletterSignupProps>()

export interface NewsletterSignupEmits {}

const emit = defineEmits<NewsletterSignupEmits>()

export interface NewsletterSignupSlots {}

const slots = defineSlots<NewsletterSignupSlots>()

const { rc } = useRC('NewsletterSignup', rcProp)

const newsletterSignupStyles = tv({
  slots: {
    group: "pt-2"
  }
})

const { group } = newsletterSignupStyles()
</script>

<template>
  <UForm>
    <UFormField name="email" :label="fieldLabel" :description="description">
      <UFieldGroup :class="group({ class: rc.group })">
        <UInput type="email" :placeholder="placeholder" />
        <UButton type="submit" :label="buttonLabel" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>

<style scoped></style>
