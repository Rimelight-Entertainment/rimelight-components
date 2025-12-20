<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  type Page
} from '../../types'

const props = defineProps<{
  modelValue: Page
}>()

const locale = useI18n().locale
const properties = computed(() => props.modelValue.properties as any)

/**
 * Filter groups and fields for display.
 * Rules:
 * 1. Field must pass visibleIf condition.
 * 2. Field must have a non-empty value.
 * 3. Group is only shown if it contains at least one visible, non-empty field.
 */
const displayGroups = computed(() => {
  return Object.entries(properties.value || {}).map(([groupId, group]: [string, any]) => {
    // Filter the fields in this group
    const visibleFields = Object.entries(group.fields || {})
      .filter(([fieldKey, schema]: [string, any]) => {
        const value = (schema.type === 'text' || schema.type === 'text-array')
          ? schema.value?.[locale.value]
          : schema.value

        // 1. Check Visibility Logic
        const isVisible = !schema.visibleIf || schema.visibleIf(props.modelValue.properties)
        if (!isVisible) return false

        // 2. Check if value exists (don't show empty rows in read-only mode)
        if (Array.isArray(value)) return value.length > 0
        return value !== undefined && value !== null && value !== ''
      })
      .sort(([, a]: [string, any], [, b]: [string, any]) => (a.order ?? 0) - (b.order ?? 0))

    return {
      ...group,
      groupId,
      visibleFields
    }
  }).filter((group: any) => group.visibleFields.length > 0)
})

</script>

<template>
  <div class="wiki-renderer flex flex-col border border-border rounded-lg bg-muted/20 overflow-hidden shadow-sm">
    <div class="bg-muted/50 p-4 border-b border-border text-center">
      <div class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">
        {{ props.modelValue.type }}
      </div>
      <h2 class="text-xl font-serif font-bold italic text-foreground">
        {{ properties.name?.value?.[locale] || props.modelValue.slug }}
      </h2>
    </div>

    <div v-for="group in displayGroups" :key="group.groupId" class="border-b last:border-b-0 border-border/40">
      <div class="bg-muted/30 px-3 py-1.5 text-[10px] font-black text-primary uppercase tracking-tighter border-b border-border/10">
        {{ group.label[locale] }}
      </div>

      <dl class="p-3 space-y-2.5">
        <div
          v-for="[fieldKey, schema] in group.visibleFields"
          :key="fieldKey"
          class="grid grid-cols-3 gap-x-3 items-baseline"
        >
          <dt class="text-[11px] font-semibold text-muted-foreground leading-tight">
            {{ schema.label }}
          </dt>

          <dd class="text-xs col-span-2 text-foreground leading-snug">
            <div v-if="schema.type === 'text-array'" class="flex flex-wrap gap-1">
              <template v-for="(item, index) in properties[group.groupId].fields[fieldKey].value[locale]" :key="index">
                <span class="font-medium">{{ item }}</span>
                <span v-if="index < properties[group.groupId].fields[fieldKey].value[locale].length - 1" class="text-muted-foreground/50">, </span>
              </template>
            </div>

            <span v-else-if="schema.type === 'page'" class="text-primary font-bold hover:underline cursor-pointer">
              {{ properties[group.groupId].fields[fieldKey].value }}
            </span>

            <span v-else-if="schema.type === 'text'" class="font-medium">
              {{ properties[group.groupId].fields[fieldKey].value[locale] }}
            </span>

            <span v-else class="font-medium">
              {{ properties[group.groupId].fields[fieldKey].value }}
            </span>
          </dd>
        </div>
      </dl>
    </div>

    <div v-if="props.modelValue.tags?.length" class="p-3 bg-background/50 border-t border-border">
      <div class="flex flex-wrap gap-1.5">
        <UBadge
          v-for="tag in props.modelValue.tags"
          :key="String(tag[locale])"
          variant="subtle"
          size="sm"
          color="neutral"
          class="text-[9px] font-bold uppercase tracking-tight"
        >
          #{{ tag[locale] }}
        </UBadge>
      </div>
    </div>


  </div>
</template>

<style scoped>
/* Optional: Adding a subtle serif feel for names common in Wiki designs */
.font-serif {
  font-family: Georgia, 'Times New Roman', Times, serif;
}
</style>