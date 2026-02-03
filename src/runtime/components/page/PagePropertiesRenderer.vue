<script setup lang="ts">
import { computed } from "vue"
import { getLocalizedContent } from "../../utils"
import { usePageRegistry, useInfobox, useRC } from "../../composables"
import { useToast } from "@nuxt/ui/composables/useToast"
import { type TabsItem } from "@nuxt/ui/components/Tabs.vue"
import { useI18n } from "vue-i18n"
import { useShare, useClipboard } from "@vueuse/core"
import { type Page } from '../../types'
import { tv } from '../../internal/tv'

export interface PagePropertiesRendererProps {
  rc?: {
    aside?: string
    actions?: string
    icon?: string
    title?: string
    type?: string
    tags?: string
    tabs?: string
    image?: string
    groupButton?: string
    details?: string
    field?: string
    fieldLabel?: string
    fieldValue?: string
    list?: string
    listItem?: string
    pageArrayList?: string
    pageArrayItem?: string
    pageArrayBullet?: string
    links?: string
  }
}

const { rc: rcProp } = defineProps<PagePropertiesRendererProps>()

const page = defineModel<Page>({ required: true })

export interface PagePropertiesRendererEmits {}

const emit = defineEmits<PagePropertiesRendererEmits>()

export interface PagePropertiesRendererSlots {}

const slots = defineSlots<PagePropertiesRendererSlots>()

const { rc } = useRC('PagePropertiesRenderer', rcProp)

const pagePropertiesRendererStyles = tv({
  slots: {
    aside: "flex flex-col gap-md",
    actions: "flex flex-row flex-wrap gap-sm",
    icon: "rounded-full w-12 h-12 object-cover",
    title: "",
    type: "text-sm",
    tags: "flex flex-row flex-wrap gap-xs",
    tabs: "w-full",
    image: "w-full object-cover",
    groupButton: "group rounded-none bg-elevated text-default",
    details: "p-sm flex flex-col gap-xs",
    field: "grid grid-cols-3 gap-xs items-baseline",
    fieldLabel: "text-xs font-semibold text-dimmed",
    fieldValue: "text-xs col-span-2",
    list: "flex flex-wrap list-disc list-inside",
    listItem: "font-medium",
    pageArrayList: "flex flex-col gap-y-1",
    pageArrayItem: "flex items-center gap-x-2",
    pageArrayBullet: "w-1 h-1 rounded-full bg-inverted shrink-0",
    links: "flex flex-col gap-xs"
  }
})

const {
  aside,
  actions,
  icon,
  title: titleClass,
  type,
  tags,
  tabs,
  image,
  groupButton,
  details,
  field,
  fieldLabel,
  fieldValue,
  list,
  listItem,
  pageArrayList,
  pageArrayItem,
  pageArrayBullet,
  links
} = pagePropertiesRendererStyles()

const { getTypeLabelKey } = usePageRegistry();
const { isFieldVisible, shouldRenderGroup, getSortedFields, getSortedGroups } = useInfobox(page.value.properties)

const { t, locale } = useI18n()
const { share } = useShare()
const { copy } = useClipboard()
const toast = useToast()

const sharePage = async () => {
  if (!page.value) {
    return
  }

  try {
    await share({
      title: getLocalizedContent(page.value.title, locale),
      text: getLocalizedContent(page.value.description, locale),
      url: typeof location !== "undefined" ? location.href : ""
    })
  } catch {
    toast.add({
      color: "error",
      title: "toast_share-page_error_title",
      description: "toast_share-page_error_description"
    })
  }
}

const copyLink = async () => {
  try {
    await copy(typeof location !== "undefined" ? location.href : "")
    toast.add({
      color: "success",
      title: "toast_copy-page-link_success_title",
      description: typeof location !== "undefined" ? location.href : ""
    })
  } catch {
    toast.add({
      color: "error",
      title: "toast_copy-page-link_error_title",
      description: "toast_copy-page-link_error_description"
    })
  }
}

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
</script>
<template>
  <aside :class="aside({ class: rc.aside })">
    <div :class="actions({ class: rc.actions })">
      <UButton variant="soft" color="neutral" icon="lucide:share" size="sm" @click="sharePage()" />
      <UButton variant="soft" color="neutral" icon="lucide:link" size="sm" @click="copyLink()" />
    </div>
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

          <h3 :class="titleClass({ class: rc.title })">
            {{ getLocalizedContent(page.title, locale) }}
          </h3>

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
          <UCollapsible v-if="shouldRenderGroup(group, true)" :default-open="group.defaultOpen">
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
              <dl :class="details({ class: rc.details })">
                <template
                  v-for="[fieldKey, schema] in getSortedFields(group.fields)"
                  :key="fieldKey"
                >
                  <div v-if="isFieldVisible(schema, true)" :class="field({ class: rc.field })">
                    <dt :class="fieldLabel({ class: rc.fieldLabel })">
                      {{ getLocalizedContent(schema.label, locale) }}
                    </dt>

                    <dd :class="fieldValue({ class: rc.fieldValue })">
                      <span v-if="schema.type === 'text'">
                        {{ getLocalizedContent(schema.value, locale) }}
                      </span>
                      <ul
                        v-else-if="schema.type === 'text-array'"
                        :class="list({ class: rc.list })"
                      >
                        <li v-for="(item, index) in schema.value" :key="index">
                          <span :class="listItem({ class: rc.listItem })">
                            {{ getLocalizedContent(item, locale) }}
                          </span>
                        </li>
                      </ul>
                      <RCPageMention
                        v-else-if="schema.type === 'page' && schema.value"
                        :page-id="schema.value"
                      />

                      <ul
                        v-else-if="schema.type === 'page-array' && Array.isArray(schema.value)"
                        :class="pageArrayList({ class: rc.pageArrayList })"
                      >
                        <li
                          v-for="id in schema.value"
                          :key="id"
                          :class="pageArrayItem({ class: rc.pageArrayItem })"
                        >
                          <span
                            :class="pageArrayBullet({ class: rc.pageArrayBullet })"
                            aria-hidden="true"
                          />

                          <RCPageMention :page-id="id" />
                        </li>
                      </ul>

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

<style scoped></style>
