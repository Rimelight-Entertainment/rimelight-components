<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { type PageDefinition, type PageType, type Page } from "../../../types"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"
import { useI18n } from "vue-i18n"

export interface CreatePageModalProps {
  isOpen: boolean
  definitions: Record<string, PageDefinition>
  loading?: boolean
  rc?: {
    header?: string
    headerTitle?: string
    closeButton?: string
    body?: string
    field?: string
    footer?: string
  }
}

const { isOpen, loading, definitions, rc: rcProp } = defineProps<CreatePageModalProps>()

export interface CreatePageModalEmits {
  close: []
  confirm: [page: Partial<Page>]
}

const emit = defineEmits<CreatePageModalEmits>()

export interface CreatePageModalSlots {
  default: (props: {}) => any
}

const slots = defineSlots<CreatePageModalSlots>()

const { rc } = useRC('CreatePageModal', rcProp)

const createPageModalStyles = tv({
  slots: {
    header: "flex items-center justify-between",
    headerTitle: "text-base font-semibold leading-6",
    closeButton: "-my-1",
    body: "space-y-4 py-4",
    field: "w-full",
    footer: "flex justify-end gap-2"
  }
})

const {
  header: headerClass,
  headerTitle,
  closeButton,
  body,
  field,
  footer
} = createPageModalStyles()

const { t } = useI18n()

const selectedType = ref<PageType | ''>('')

const title = ref('')
const slug = ref('')

const typeOptions = computed(() => {
  return Object.entries(definitions).map(([key, def]) => ({
    label: t(def.typeLabelKey),
    value: key
  }))
})

// Basic slug auto-generation
watch(title, (newTitle) => {
  slug.value = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
})

const handleConfirm = () => {
  if (!selectedType.value) return

  const definition = definitions[selectedType.value]

  // 2. Explicitly check if definition exists to satisfy TS
  if (!definition) {
    console.error(`Definition for type "${selectedType.value}" not found.`)
    return
  }

  // Initialize properties from definition defaults
  const properties: Record<string, any> = {}
  Object.entries(definition.properties).forEach(([groupKey, group]) => {
    properties[groupKey] = {}
    Object.entries(group.fields).forEach(([fieldKey, field]) => {
      properties[groupKey][fieldKey] = field.value
    })
  })

  const newPage: Partial<Page> = {
    type: selectedType.value as any,
    title: { en: title.value },
    slug: slug.value,
    properties: properties as any,
    blocks: definition.initialBlocks ? definition.initialBlocks() : [],

  }

  emit('confirm', newPage)
}
</script>

<template>
  <UModal :model-value="isOpen" @update:model-value="emit('close')">
    <slot />
    <template #content>
      <UCard>
        <template #header>
          <div :class="headerClass({ class: rc.header })">
            <h3 :class="headerTitle({ class: rc.headerTitle })">Create New Page</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              :class="closeButton({ class: rc.closeButton })"
              @click="emit('close')"
            />
          </div>
        </template>

        <div :class="body({ class: rc.body })">
          <UFormField label="Page Template" required>
            <USelect
              v-model="selectedType"
              :items="typeOptions"
              :placeholder="t('editor.template_placeholder', 'Select a template...')"
              :class="field({ class: rc.field })"
            />
          </UFormField>

          <UFormField label="Title" required>
            <UInput v-model="title" placeholder="e.g. My Awesome Movie" />
          </UFormField>

          <UFormField label="Slug" required>
            <UInput v-model="slug" placeholder="my-awesome-movie" />
          </UFormField>
        </div>

        <template #footer>
          <div :class="footer({ class: rc.footer })">
            <UButton color="neutral" variant="ghost" label="Cancel" @click="emit('close')" />
            <UButton
              color="primary"
              label="Create & Edit"
              :loading="loading"
              :disabled="!selectedType || !title"
              @click="handleConfirm"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped></style>
