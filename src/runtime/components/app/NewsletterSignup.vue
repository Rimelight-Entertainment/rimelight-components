<script setup lang="ts">
const {
  fieldLabel = "Subscribe to our Newsletter",
  description = "Stay updated on new posts and updates. Unsubscribe at any time.",
  placeholder = "email@domain.com",
  buttonLabel = "Subscribe"
} = defineProps<{
  fieldLabel?: string
  description?: string
  placeholder?: string
  buttonLabel?: string
}>()
</script>

<template>
  <UForm>
    <UFormField
        name="email"
        :label="fieldLabel"
        :description="description"
        class="max-w-96"
    >
      <UFieldGroup class="pt-2">
        <UInput type="email" :placeholder="placeholder" />
        <UButton type="submit" :label="buttonLabel" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>

<style scoped></style>
