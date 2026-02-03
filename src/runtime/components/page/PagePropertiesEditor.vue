<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { usePageRegistry, useInfobox, useRC } from "../../composables"
import { getLocalizedContent } from "../../utils"
import type { TabsItem } from "#ui/types"
import { type Page } from "../../types"
import { tv } from "../../internal/tv"

export interface PagePropertiesEditorProps {
  rc?: {
    aside?: string
    icon?: string
    titleInput?: string
    type?: string
    tags?: string
    tabs?: string
    image?: string
    groupButton?: string
    details?: string
    field?: string
    links?: string
  }
}

const { rc: rcProp } = defineProps<PagePropertiesEditorProps>()

const page = defineModel<Page>({ required: true })

export interface PagePropertiesEditorEmits {}

const emit = defineEmits<PagePropertiesEditorEmits>()

export interface PagePropertiesEditorSlots {}

const slots = defineSlots<PagePropertiesEditorSlots>()

const { rc } = useRC('PagePropertiesEditor', rcProp)

const pagePropertiesEditorStyles = tv({
  slots: {
    aside: "flex flex-col gap-md",
    icon: "rounded-full w-12 h-12 object-cover",
    titleInput: "w-full",
    type: "text-sm",
    tags: "flex flex-row flex-wrap gap-xs",
    tabs: "w-full",
    image: "w-full object-cover",
    groupButton: "group rounded-none bg-elevated text-default",
    details: "p-sm flex flex-col gap-xs",
    field: "w-full",
    links: "flex flex-col gap-xs"
  }
})

const {
  aside,
  icon,
  titleInput,
  type,
  tags,
  tabs,
  image,
  groupButton,
  details,
  field,
  links
} = pagePropertiesEditorStyles()

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
  <aside :class="aside({ class: rc.aside })">
    <UCard
      variant="soft"
      :ui="{ root: 'divide-none', header: 'bg-accented text-center', body: 'p-0 sm:p-0 bg-muted' }"
    >
      <template #header>
        <div class="flex flex-col gap-xs items-center">
          <RCImage
            v-if="page.icon?.src"
            :src="page.icon?.src"
            :alt="page.icon?.alt"
            :class="icon({ class: rc.icon })"
          />

          <UInput
            v-model="page.title.en"
            variant="subtle"
            placeholder="Enter page title..."
            size="xl"
            :ui="{ base: 'text-center font-bold text-lg' }"
            :class="titleInput({ class: rc.titleInput })"
          />

          <span :class="type({ class: rc.type })">{{ t(getTypeLabelKey(page.type)) }}</span>

          <div v-if="page.tags?.length" :class="tags({ class: rc.tags })">
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
              :class="tabs({ class: rc.tabs })"
            >
              <template #content="{ item }">
                <RCImage
                  :src="item.img.src"
                  :alt="item.img.alt"
                  :class="image({ class: rc.image })"
                />
              </template>
            </UTabs>

            <div v-else-if="page.images[0]">
              <RCImage
                :src="page.images[0].src"
                :alt="page.images[0].alt"
                :class="image({ class: rc.image })"
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
                :class="groupButton({ class: rc.groupButton })"
              />
            </template>

            <template #content>
              <ClientOnly>
                <dl :class="details({ class: rc.details })">
                  <template
                    v-for="[fieldKey, schema] in getSortedFields(group.fields)"
                    :key="fieldKey"
                  >
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
                        :class="field({ class: rc.field })"
                      />

                      <UInput
                        v-else-if="schema.type === 'number'"
                        v-model.number="schema.value"
                        type="number"
                        variant="subtle"
                        :class="field({ class: rc.field })"
                      />

                      <USelect
                        v-else-if="schema.type === 'enum'"
                        v-model="schema.value"
                        :items="schema.options || []"
                        variant="subtle"
                        :class="field({ class: rc.field })"
                      />

                      <UInputMenu
                        v-else-if="schema.type === 'text-array'"
                        :model-value="schema.value.map((v: any) => v.en)"
                        @update:model-value="(vals: string[]) => updateTextArray(schema, vals)"
                        multiple
                        creatable
                        variant="subtle"
                        placeholder="Add item..."
                        :class="field({ class: rc.field })"
                      />

                      <UInput
                        v-else-if="schema.type === 'page'"
                        v-model="schema.value"
                        icon="lucide:link-2"
                        variant="subtle"
                        :placeholder="`Select ${schema.allowedPageTypes?.join('/')}`"
                        :class="field({ class: rc.field })"
                      />

                      <USelectMenu
                        v-else-if="schema.type === 'page-array'"
                        v-model="schema.value"
                        icon="lucide:link-2"
                        variant="subtle"
                        :placeholder="`Select ${schema.allowedPageTypes?.join('/')}`"
                        :class="field({ class: rc.field })"
                      />
                    </UFormField>
                  </template>
                </dl>
              </ClientOnly>
            </template>
          </UCollapsible>
        </template>
      </template>
    </UCard>
    <div :class="links({ class: rc.links })">
      <h6>Links</h6>
      <UButton
        v-for="(linkItem, index) in page.links"
        :key="index"
        :label="linkItem.label"
        :icon="linkItem.icon"
        :to="linkItem.to"
        :target="linkItem.to ? '_blank' : undefined"
        :external="!!linkItem.to"
        :variant="linkItem.variant || 'link'"
        :color="linkItem.color || 'neutral'"
        size="sm"
        :ui="{ base: 'pl-0' }"
      />
    </div>
  </aside>
</template>
