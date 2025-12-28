<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { tv } from "../../../internal/tv"
import { useRC } from "~/src/runtime/composables"

export interface DeletePageModalProps {
  isOpen: boolean
  loading?: boolean
  pageTitle: string
  rc?: {
    header?: string
    headerTitle?: string
    closeButton?: string
    body?: string
    footer?: string
  }
}

const { isOpen, loading, pageTitle, rc: rcProp } = defineProps<DeletePageModalProps>()

export interface DeletePageModalEmits {
  close: []
  confirm: []
}

const emits = defineEmits<DeletePageModalEmits>()

export interface DeletePageModalSlots {
  default: (props: {}) => any
}

const slots = defineSlots<DeletePageModalSlots>()

const { rc } = useRC('DeletePageModal', rcProp)

const deletePageModalStyles = tv({
  slots: {
    header: "flex items-center justify-between",
    headerTitle: "text-base font-semibold leading-6 text-error-600",
    closeButton: "-my-1",
    body: "text-sm text-neutral-600 dark:text-neutral-400",
    footer: "flex justify-end gap-2"
  }
})

const {
  header: headerClass,
  headerTitle,
  closeButton,
  body,
  footer
} = deletePageModalStyles()

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
          <div :class="headerClass({ class: rc.header })">
            <h3 :class="headerTitle({ class: rc.headerTitle })">
              {{ t('editor.delete_page_title', 'Delete Page') }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              :class="closeButton({ class: rc.closeButton })"
              @click="emits('close')"
            />
          </div>
        </template>

        <div :class="body({ class: rc.body })">
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
          <div :class="footer({ class: rc.footer })">
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
