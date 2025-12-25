<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { usePageRegistry, useInfobox } from "../../composables"
import { getLocalizedContent } from "../../utils"
import { type TabsItem } from "@nuxt/ui/components/Tabs.vue"
import { type Page } from "../../types"

const page = defineModel<Page>({ required: true })

const { getTypeLabelKey } = usePageRegistry()
const { isFieldVisible, shouldRenderGroup, getSortedFields, getSortedGroups } = useInfobox(page.value.properties)

const { locale, t } = useI18n()

const imageTabs = computed<TabsItem[]>(() => {
  if (!page.value.images?.length) return []

  return page.value.images.map((img, index) => {
    const localizedName = getLocalizedContent(img.name, locale.value)

    return {
      label: localizedName || `${t('label_image')} ${index + 1}`,
      value: `image-${index}`,
      img
    }
  })
})

/**
 * Handles text-array updates specifically for the 'en' locale.
 */
const updateTextArray = (schema: any, vals: string[]) => {
  schema.value = vals.map(str => ({
    ...schema.value.find((i: any) => i.en === str), // Preserve other locales if they exist
    en: str
  }))
}
</script>

<template>
  <aside class="flex flex-col gap-md">
    <UCard
      variant="soft"
      :ui="{ root: 'divide-none', header: 'bg-accented text-center', body: 'p-0 sm:p-0 bg-muted' }"
    >
      <template #header>
        <div class="flex flex-col gap-xs items-center">
          <NuxtImg
            v-if="page.icon?.src"
            :src="page.icon?.src"
            :alt="page.icon?.alt"
            class="rounded-full w-12 h-12 object-cover"
          />

          <h3>
            {{ getLocalizedContent(page.title, locale) }}
          </h3>

          <span class="text-sm">{{ t(getTypeLabelKey(page.type)) }}</span>

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

          <div v-if="page.images?.length" class="w-full">
            <UTabs
              v-if="page.images.length > 1"
              :items="imageTabs"
              default-value="image-0"
              variant="link"
              size="xs"
              color="neutral"
              class="w-full"
            >
              <template #content="{ item }">
                <NuxtImg :src="item.img.src" :alt="item.img.alt" class="w-full object-cover" />
              </template>
            </UTabs>

            <div v-else-if="page.images[0]">
              <NuxtImg
                :src="page.images[0].src"
                :alt="page.images[0].alt"
                class="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <template v-for="[groupId, group] in getSortedGroups(page.properties)" :key="groupId">
          <UCollapsible v-if="shouldRenderGroup(group, false)" :default-open="group.defaultOpen">
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
                  <UFormField
                    v-if="isFieldVisible(schema, false)"
                    :label="getLocalizedContent(schema.label, locale)"
                    :name="fieldKey"
                  >
                    <UInput
                      v-if="schema.type === 'text'"
                      v-model="schema.value.en"
                      variant="subtle"
                      placeholder="Type here..."
                      class="w-full"
                    />

                    <UInput
                      v-else-if="schema.type === 'number'"
                      v-model.number="schema.value"
                      type="number"
                      variant="subtle"
                      class="w-full"
                    />

                    <USelect
                      v-else-if="schema.type === 'enum'"
                      v-model="schema.value"
                      :items="schema.options || []"
                      variant="subtle"
                      class="w-full"
                    />

                    <UInputMenu
                      v-else-if="schema.type === 'text-array'"
                      :model-value="schema.value.map((v: any) => v.en)"
                      @update:model-value="(vals: string[]) => updateTextArray(schema, vals)"
                      multiple
                      creatable
                      variant="subtle"
                      placeholder="Add item..."
                      class="w-full"
                    />

                    <UInput
                      v-else-if="schema.type === 'page'"
                      v-model="schema.value"
                      icon="lucide:link-2"
                      variant="subtle"
                      :placeholder="`Select ${schema.allowedPageTypes?.join('/')}`"
                      class="w-full"
                    />
                  </UFormField>
                </template>
              </dl>
            </template>
          </UCollapsible>
        </template>
      </template>
    </UCard>
    <div class="flex flex-col gap-xs">
      <h6>Links</h6>
      <UButton
        v-for="(link, index) in page.links"
        :key="index"
        :label="link.label"
        :icon="link.icon"
        :to="link.to"
        :target="link.to ? '_blank' : undefined"
        :external="!!link.to"
        :variant="link.variant || 'link'"
        :color="link.color || 'neutral'"
        size="sm"
        :ui="{ base: 'pl-0' }"
      />
    </div>
  </aside>
</template>
