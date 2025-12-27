<script setup lang="ts">
import { computed } from "vue"
import { getLocalizedContent } from "../../utils"
import { usePageRegistry, useInfobox } from "../../composables"
import { useToast } from "@nuxt/ui/composables"
import { type TabsItem } from "@nuxt/ui/components/Tabs.vue"
import { useI18n } from "vue-i18n"
import { useShare, useClipboard } from "@vueuse/core"
import { type Page } from '../../types'
import { tv } from 'tailwind-variants'

export interface PagePropertiesRendererProps {}

const {} = defineProps<PagePropertiesRendererProps>()

const page = defineModel<Page>({ required: true })

export interface PagePropertiesRendererEmits {}

const emit = defineEmits<PagePropertiesRendererEmits>()

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
  <aside :class="aside()">
    <div :class="actions()">
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
            :class="icon()"
          />

          <h3 :class="titleClass()">
            {{ getLocalizedContent(page.title, locale) }}
          </h3>

          <span :class="type()">{{ t(getTypeLabelKey(page.type)) }}</span>

          <div v-if="page.tags?.length" :class="tags()">
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
              :class="tabs()"
            >
              <template #content="{ item }">
                <RCImage :src="item.img.src" :alt="item.img.alt" :class="image()" />
              </template>
            </UTabs>

            <div v-else-if="page.images[0]">
              <RCImage :src="page.images[0].src"
                       :alt="page.images[0].alt"
                       :class="image()" />
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
                :class="groupButton()"
              />
            </template>

            <template #content>
              <dl :class="details()">
                <template
                  v-for="[fieldKey, schema] in getSortedFields(group.fields)"
                  :key="fieldKey"
                >
                  <div
                    v-if="isFieldVisible(schema, true)"
                    :class="field()"
                  >
                    <dt :class="fieldLabel()">
                      {{ getLocalizedContent(schema.label, locale) }}
                    </dt>

                    <dd :class="fieldValue()">
                      <span v-if="schema.type === 'text'">
                        {{ getLocalizedContent(schema.value, locale) }}
                      </span>
                      <ul
                        v-else-if="schema.type === 'text-array'"
                        :class="list()"
                      >
                        <li v-for="(item, index) in schema.value" :key="index">
                          <span :class="listItem()">
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
                        :class="pageArrayList()"
                      >
                        <li v-for="id in schema.value" :key="id" :class="pageArrayItem()">
                          <span
                            :class="pageArrayBullet()"
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
    <div :class="links()">
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

<style scoped></style>
