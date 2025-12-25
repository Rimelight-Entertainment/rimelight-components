<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { type PageDefinition, type PageType, type Page } from "../../../types"
import { tv } from "tailwind-variants"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

export interface CreatePageModalProps {
  isOpen: boolean
  definitions: Record<string, PageDefinition>
  loading?: boolean
}

const { isOpen, loading, definitions } = defineProps<CreatePageModalProps>()

export interface CreatePageModalEmits {
  close: []
  confirm: [page: Partial<Page>]
}

const emits = defineEmits<CreatePageModalEmits>()

const createPageModalStyles = tv({
  slots: {
    base: "flex flex-col gap-6",
    group: "border border-neutral-200 rounded-lg p-4 bg-white shadow-sm",
    groupTitle: "text-lg font-bold text-neutral-900 mb-4",
    field: "flex flex-col gap-1.5",
    label: "text-sm font-medium text-neutral-700",
    input: "w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-500 transition-all outline-hidden",
    select: "w-full px-3 py-2 rounded-md border border-neutral-300 bg-white",
  }
})

const styles = createPageModalStyles()

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

  emits('confirm', newPage)
}
</script>

<template>
  <UModal :model-value="isOpen" @update:model-value="emits('close')">
    <slot/>
    <template #content>
      <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6">Create New Page</h3>
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="emits('close')" />
        </div>
      </template>

      <div class="space-y-4 py-4">
        <UFormField label="Page Template" required>
          <USelect
            v-model="selectedType"
            :items="typeOptions"
            :placeholder="t('editor.template_placeholder', 'Select a template...')"
            class="w-full"
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
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" label="Cancel" @click="emits('close')" />
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

<style scoped>

</style>
