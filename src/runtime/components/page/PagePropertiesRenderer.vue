<script setup lang="ts">
import { computed } from "vue"
import { getLocalizedContent } from "../../utils"
import { usePageRegistry } from "../../composables"
import { useToast } from "@nuxt/ui/composables"
import { type TabsItem } from "@nuxt/ui/components/Tabs.vue"
import { useI18n } from "vue-i18n"
import { useShare, useClipboard } from "@vueuse/core"
import { type Page } from '../../types'

const { getTypeLabelKey } = usePageRegistry();

const page = defineModel<Page>({ required: true })

const { t, locale } = useI18n()
const { share } = useShare()
const { copy } = useClipboard()
const toast = useToast()

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
  <aside class="flex flex-col gap-md">
    <div class="flex flex-row flex-wrap gap-sm">
      <UButton variant="soft" color="neutral" icon="lucide:share" size="sm" @click="sharePage()" />
      <UButton variant="soft" color="neutral" icon="lucide:link" size="sm" @click="copyLink()" />
    </div>
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
                <template
                  v-for="[fieldKey, schema] in getSortedFields(group.fields)"
                  :key="fieldKey"
                >
                  <div
                    v-if="shouldRenderField(schema)"
                    class="grid grid-cols-3 gap-xs items-baseline"
                  >
                    <dt class="text-xs font-semibold text-dimmed">
                      {{ getLocalizedContent(schema.label, locale) }}
                    </dt>

                    <dd class="text-xs col-span-2">
                      <span v-if="schema.type === 'text'">
                        {{ getLocalizedContent(schema.value, locale) }}
                      </span>
                      <ul
                        v-else-if="schema.type === 'text-array'"
                        class="flex flex-wrap list-disc list-inside"
                      >
                        <li v-for="(item, index) in schema.value" :key="index">
                          <span class="font-medium">
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
                        class="flex flex-col gap-y-1"
                      >
                        <li v-for="id in schema.value" :key="id" class="flex items-center gap-x-2">
                          <span
                            class="w-1 h-1 rounded-full bg-inverted shrink-0"
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

<style scoped></style>
