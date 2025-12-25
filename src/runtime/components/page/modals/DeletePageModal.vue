<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"

export interface DeletePageModalProps {
  isOpen: boolean
  loading?: boolean
  pageTitle: string
}

const { isOpen, loading, pageTitle } = defineProps<DeletePageModalProps>()

export interface DeletePageModalEmits {
  (e: 'close'): void
  (e: 'confirm'): void
}

const emits = defineEmits<DeletePageModalEmits>()
const { t } = useI18n()

const confirmationInput = ref('')
const CONFIRMATION_TEXT = "DELETE"

// Reset input when modal closes
watch(() => isOpen, (val) => {
  if (!val) confirmationInput.value = ''
})

const handleConfirm = () => {
  if (confirmationInput.value === CONFIRMATION_TEXT) {
    emits('confirm')
  }
}
</script>

<template>
  <UModal :model-value="isOpen" @update:model-value="emits('close')">
    <slot/>
    <template #content>
      <UCard :ui="{ body: 'space-y-4' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-error-600">
              {{ t('editor.delete_page_title', 'Delete Page') }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              class="-my-1"
              @click="emits('close')"
            />
          </div>
        </template>

        <div class="text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Are you sure you want to delete <strong>{{ pageTitle }}</strong>?
            This action is permanent and cannot be undone.
          </p>
        </div>

        <UFormField
          :label="t('editor.delete_confirm_label', `Please type ${CONFIRMATION_TEXT} to confirm` )"
          required
        >
          <UInput
            v-model="confirmationInput"
            :placeholder="CONFIRMATION_TEXT"
            color="error"
            autocomplete="off"
            @keyup.enter="handleConfirm"
          />
        </UFormField>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              :label="t('common.cancel', 'Cancel')"
              @click="emits('close')"
            />
            <UButton
              color="error"
              icon="lucide:trash-2"
              :label="t('editor.delete_button', 'Delete Permanently')"
              :loading="loading"
              :disabled="confirmationInput !== CONFIRMATION_TEXT"
              @click="handleConfirm"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped>

</style>
