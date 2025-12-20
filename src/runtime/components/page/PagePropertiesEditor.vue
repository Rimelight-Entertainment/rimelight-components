<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Page } from '../../types'

const page = defineModel<Page>({ required: true })

/**
 * Accessor for the properties object.
 * Cast to any for dynamic key access in the template.
 */
const locale = useI18n().locale
const properties = computed(() => page.value.properties as any)

/**
 * Get the groups directly from the page properties.
 * We cast to any for dynamic key access.
 */
const groups = computed(() => {
  return page.value.properties as any
})


/**
 * Logic to determine if a specific field should be visible.
 * It passes the current properties object to the visibleIf function.
 */
const isFieldVisible = (fieldSchema: any) => {
  if (!fieldSchema.visibleIf) return true
  return fieldSchema.visibleIf(page.value.properties)
}

/**
 * Helper to sort fields within a group based on their order property.
 */
const getSortedFields = (fields: Record<string, any>) => {
  return Object.entries(fields).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
}
</script>

<template>
  <div class="flex flex-col gap-y-8 pr-2 pb-12">
    <div class="flex items-center justify-between border-b border-border pb-4">
      <h3 class="text-xs font-black uppercase tracking-widest text-muted-foreground">
        {{ page.type }} Metadata
      </h3>
      <UBadge variant="subtle" size="sm" color="primary">
        {{ page.slug }}
      </UBadge>
    </div>

    <div v-for="(group, groupId) in groups" :key="groupId" class="space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-primary">
          {{ group.label[locale] }}
        </span>
        <div class="h-px flex-1 bg-border/50"></div>
      </div>

      <div class="grid gap-y-4 px-1">
        <template v-for="[fieldKey, schema] in getSortedFields(group.fields)" :key="fieldKey">

          <UFormField
            v-if="isFieldVisible(schema)"
            :label="schema.label"
            :name="fieldKey"
          >
            <UInput
              v-if="schema.type === 'text'"
              v-model="properties[groupId].fields[fieldKey].value[locale]"
              variant="subtle"
              placeholder="..."
            />

            <UInput
              v-else-if="schema.type === 'number'"
              v-model.number="properties[groupId].fields[fieldKey].value"
              type="number"
              variant="subtle"
            />

            <USelect
              v-else-if="schema.type === 'enum'"
              v-model="properties[groupId].fields[fieldKey].value"
              :items="schema.options || []"
              variant="subtle"
            />

            <UInputMenu
              v-else-if="schema.type === 'text-array'"
              v-model="properties[groupId].fields[fieldKey].value[locale]"
              multiple
              creatable
              variant="subtle"
              placeholder="Add item..."
            />

            <UInput
              v-else-if="schema.type === 'page'"
              v-model="properties[groupId].fields[fieldKey].value"
              icon="lucide:link-2"
              variant="subtle"
              :placeholder="`Select ${schema.allowedPageTypes?.join('/')}`"
            />
          </UFormField>
        </template>
      </div>
    </div>


    <USeparator />

    <UFormField label="Global Search Tags">
      <UInputMenu
        v-model="page.tags"
        multiple
        creatable
        icon="lucide:tag"
        variant="subtle"
        placeholder="Add tags..."
      />
    </UFormField>

    <div class="mt-auto pt-6 text-[9px] font-mono text-muted-foreground/60 space-y-1">
      <div class="flex justify-between">
        <span>ID:</span>
        <span>{{ page.id }}</span>
      </div>
      <div class="flex justify-between">
        <span>Last Updated:</span>
        <span>{{ page.updated_at }}</span>
      </div>
    </div>
  </div>
</template>