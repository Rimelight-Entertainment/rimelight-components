<script setup lang="ts">
import { tv } from "tailwind-variants"

export interface NewsletterSignupProps {
  fieldLabel?: string
  description?: string
  placeholder?: string
  buttonLabel?: string
}

const {
  fieldLabel = "Subscribe to our Newsletter",
  description = "Stay updated on new posts and updates. Unsubscribe at any time.",
  placeholder = "email@domain.com",
  buttonLabel = "Subscribe"
} = defineProps<NewsletterSignupProps>()

export interface NewsletterSignupEmits {}

const emit = defineEmits<NewsletterSignupEmits>()

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
      <UFieldGroup :class="group()">
        <UInput type="email" :placeholder="placeholder" />
        <UButton type="submit" :label="buttonLabel" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>

<style scoped></style>
