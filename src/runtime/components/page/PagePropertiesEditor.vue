<script setup lang="ts">
import { computed } from 'vue'
import { type Page, type PageType, PAGE_SCHEMAS } from '../../types/pages'

const page = defineModel<Page>({ required: true })
/**
 * Accessor for the properties object.
 * Cast to any for dynamic key access in the template.
 */
const properties = computed(() => page.value.properties as any)

/**
 * Get the schema groups for the current PageType.
 */
const groups = computed(() => {
  return PAGE_SCHEMAS[page.value.type as PageType] || []
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

    <div v-for="group in groups" :key="group.id" class="space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-bold uppercase tracking-widest text-primary">
          {{ group.label }}
        </span>
        <div class="h-px flex-1 bg-border/50"></div>
      </div>

      <div class="grid gap-y-4 px-1">
        <template v-for="[key, schema] in getSortedFields(group.fields)" :key="key">

          <UFormField
            v-if="isFieldVisible(schema)"
            :label="schema.label"
            :name="key"
          >
            <UInput
              v-if="schema.type === 'text'"
              v-model="properties[key]"
              variant="subtle"
              placeholder="..."
            />

            <UInput
              v-else-if="schema.type === 'number'"
              v-model.number="properties[key]"
              type="number"
              variant="subtle"
            />

            <USelect
              v-else-if="schema.type === 'enum'"
              v-model="properties[key]"
              :items="schema.options || []"
              variant="subtle"
            />

            <UInputMenu
              v-else-if="schema.type === 'text-array'"
              v-model="properties[key]"
              multiple
              creatable
              variant="subtle"
              placeholder="Add item..."
            />

            <UInput
              v-else-if="schema.type === 'page'"
              v-model="properties[key]"
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
        <span>{{ new Date(page.updatedAt).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>