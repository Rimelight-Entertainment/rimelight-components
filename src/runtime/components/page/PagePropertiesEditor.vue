<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { usePageRegistry } from "../../composables"
import { getLocalizedContent } from "../../utils"
import { type Page } from "../../types"

const { getTypeLabelKey } = usePageRegistry()

const page = defineModel<Page>({ required: true })

const { locale, t } = useI18n()

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
  <UCard
    variant="soft"
    :ui="{ root: 'divide-none', header: 'bg-elevated text-center', body: 'bg-muted' }"
  >
    <template #header>
      <h3>
        {{ getLocalizedContent(page.title, locale) }}
      </h3>
      <UBadge variant="subtle" size="sm" color="primary" :label="t(getTypeLabelKey(page.type))" />
    </template>

    <div v-for="(group, groupId) in (page.properties as any)" :key="groupId">
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
            :label="getLocalizedContent(schema.label, locale)"
            :name="fieldKey"
          >
            <UInput
              v-if="schema.type === 'text'"
              v-model="schema.value[locale]"
              variant="subtle"
              placeholder="..."
            />

            <UInput
              v-else-if="schema.type === 'number'"
              v-model.number="schema.value"
              type="number"
              variant="subtle"
            />

            <USelect
              v-else-if="schema.type === 'enum'"
              v-model="schema.value"
              :items="schema.options || []"
              variant="subtle"
            />

            <UInputMenu
              v-else-if="schema.type === 'text-array'"
              :model-value="schema.value.map((v: any) => v[locale])"
              @update:model-value="(vals: string[]) => schema.value = vals.map(str => ({ [locale]: str }))"
              multiple
              creatable
              variant="subtle"
              placeholder="Add item..."
            />

            <UInput
              v-else-if="schema.type === 'page'"
              v-model="schema.value"
              icon="lucide:link-2"
              variant="subtle"
              :placeholder="`Select ${schema.allowedPageTypes?.join('/')}`"
            />
          </UFormField>
        </template>
      </div>
    </div>

    <USeparator class="my-6" />

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
  </UCard>
</template>
