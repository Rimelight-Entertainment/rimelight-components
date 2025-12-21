<script setup lang="ts">
import { getLocalizedContent } from "../../utils"
import { useI18n } from 'vue-i18n'
import {
  type Page
} from '../../types'

const page = defineModel<Page>({ required: true })

const { t, locale } = useI18n()

/**
 * Logic to determine if a field should be rendered.
 * In Read-Only mode, we check visibility logic AND if the value is non-empty.
 */
const shouldRenderField = (schema: any) => {
  const isVisible = !schema.visibleIf || schema.visibleIf(page.value.properties)
  if (!isVisible) return false

  const val = schema.value

  if (schema.type === 'text') {
    return !!val?.[locale.value]
  }

  if (schema.type === 'text-array') {
    return Array.isArray(val) && val.length > 0
  }


  return val !== undefined && val !== null && val !== ''
}

/**
 * Logic to determine if a group has any renderable fields.
 */
const shouldRenderGroup = (group: any) => {
  return Object.values(group.fields || {}).some((schema: any) => shouldRenderField(schema))
}

/**
 * Helper to sort fields within a group based on their order property.
 */
const getSortedFields = (fields: Record<string, any>) => {
  return Object.entries(fields).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
}
</script>
<template>
  <aside class="flex flex-col gap-xl">
    <UCard variant="soft" :ui="{ root: 'divide-none', header: 'bg-accented text-center', body: 'p-0 sm:p-0 bg-muted' }">
      <template #header>
        <div class="flex flex-col gap-xs items-center">
          <h3>
            {{ getLocalizedContent(page.title, locale) }}
          </h3>
          <span class="text-xs">{{ page.type }}</span>
          <div v-if="page.tags?.length" class="flex flex-row flex-wrap gap-xs">
            <UBadge
                v-for="tag in page.tags"
                :key="tag[locale]"
                variant="soft"
                size="xs"
                color="neutral"
            >
              {{ tag[locale] }}
            </UBadge>
          </div>
        </div>
      </template>

      <template #default>
        <template v-for="(group, groupId) in (page.properties as any)" :key="groupId">
          <UCollapsible v-if="shouldRenderGroup(group)" :default-open="group.defaultOpen">
            <template #default>
              <UButton
                  :label="getLocalizedContent(group.label, locale)"
                  variant="soft"
                  trailing-icon="lucide:chevron-down"
                  :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }"
                  block
                  class="group rounded-none bg-elevated text-default"
              />
            </template>

            <template #content>
              <dl class="p-sm flex flex-col gap-xs">
                <template v-for="[fieldKey, schema] in getSortedFields(group.fields)" :key="fieldKey">
                  <div
                      v-if="shouldRenderField(schema)"
                      class="grid grid-cols-3 gap-xs items-baseline"
                  >
                    <dt class="text-xs font-semibold text-dimmed">
                      {{ getLocalizedContent(schema.label, locale) }}
                    </dt>

                    <dd class="text-xs col-span-2">
                      <ul v-if="schema.type === 'text-array'" class="flex flex-wrap">
                        <li v-for="(item, index) in schema.value" :key="index">
                          <span class="font-medium">
                            {{ getLocalizedContent(item, locale) }}
                          </span>
                        </li>
                      </ul>
                      <span v-else-if="schema.type === 'text'">
                        {{ getLocalizedContent(schema.value, locale) }}
                      </span>
                      <span v-else>
                        {{ schema.value }}
                      </span>
                    </dd>
                  </div>
                </template>
              </dl>
            </template>
          </UCollapsible>
        </template>
      </template>
    </UCard>
  </aside>
</template>

<style scoped>

</style>