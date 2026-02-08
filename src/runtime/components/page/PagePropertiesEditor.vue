<script setup lang="ts">
import { computed, ref, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { usePageRegistry, useInfobox, useRC } from "../../composables"
import { getLocalizedContent } from "../../utils"
import type { TabsItem } from "@nuxt/ui"
import { type Page, type Link } from "../../types"
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

// Link editing state
const isLinkModalOpen = ref(false)
const editingLinkIndex = ref<number | null>(null)
const linkDraft = reactive<Partial<Link>>({
  label: '',
  to: '',
  icon: '',
  color: 'neutral',
  variant: 'link'
})

const openLinkModal = (index: number | null = null) => {
  editingLinkIndex.value = index
  if (index !== null && page.value.links?.[index]) {
    const link = page.value.links[index]
    linkDraft.label = link.label
    linkDraft.to = link.to
    linkDraft.icon = link.icon
    linkDraft.color = link.color || 'neutral'
    linkDraft.variant = link.variant || 'link'
  } else {
    linkDraft.label = ''
    linkDraft.to = ''
    linkDraft.icon = ''
    linkDraft.color = 'neutral'
    linkDraft.variant = 'link'
  }
  isLinkModalOpen.value = true
}

const saveLink = () => {
  if (!linkDraft.label || !linkDraft.to) return

  if (!page.value.links) page.value.links = []

  const newLink: Link = {
    label: linkDraft.label,
    to: linkDraft.to,
    icon: linkDraft.icon,
    color: linkDraft.color as any,
    variant: linkDraft.variant as any
  }

  if (editingLinkIndex.value !== null) {
    page.value.links[editingLinkIndex.value] = newLink
  } else {
    page.value.links.push(newLink)
  }

  isLinkModalOpen.value = false
}

const removeLink = (index: number) => {
  if (page.value.links) {
    page.value.links.splice(index, 1)
  }
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

          <UInput
            v-model="page.slug"
            variant="subtle"
            placeholder="page-slug"
            size="xs"
            prefix="/"
            :ui="{ base: 'text-center text-dimmed font-mono' }"
            class="w-full opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity"
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
      <div class="flex items-center justify-between mb-xs">
        <h6>Links</h6>
        <UButton
          icon="lucide:plus"
          size="xs"
          variant="ghost"
          color="primary"
          @click="openLinkModal()"
        />
      </div>

      <div v-if="page.links?.length" class="flex flex-col gap-xs">
        <div
          v-for="(linkItem, index) in page.links"
          :key="index"
          class="flex items-center justify-between group/link"
        >
          <UButton
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
          <div class="flex items-center opacity-0 group-hover/link:opacity-100 transition-opacity">
            <UButton
              icon="lucide:pencil"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="openLinkModal(index)"
            />
            <UButton
              icon="lucide:trash-2"
              size="xs"
              variant="ghost"
              color="error"
              @click="removeLink(index)"
            />
          </div>
        </div>
      </div>
      <p v-else class="text-xs text-dimmed italic">No links added yet.</p>

      <!-- Link management modal -->
      <UModal v-model:open="isLinkModalOpen" :title="editingLinkIndex !== null ? 'Edit Link' : 'Add Link'">
        <template #content>
          <UCard>
            <div class="flex flex-col gap-sm">
              <UFormField label="Label">
                <UInput v-model="linkDraft.label" placeholder="Check my GitHub" class="w-full" />
              </UFormField>
              <UFormField label="URL (to)">
                <UInput v-model="linkDraft.to" placeholder="https://github.com/..." class="w-full" />
              </UFormField>
              <UFormField label="Icon">
                <UInput v-model="linkDraft.icon" placeholder="lucide:github" class="w-full" />
              </UFormField>
              <div class="grid grid-cols-2 gap-sm">
                <UFormField label="Color">
                  <USelect
                    v-model="linkDraft.color"
                    :items="['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Variant">
                  <USelect
                    v-model="linkDraft.variant"
                    :items="['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-end gap-sm">
                <UButton label="Cancel" variant="ghost" color="neutral" @click="isLinkModalOpen = false" />
                <UButton
                  :label="editingLinkIndex !== null ? 'Update Link' : 'Add Link'"
                  color="primary"
                  @click="saveLink"
                />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </div>
  </aside>
</template>
