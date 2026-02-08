<script setup lang="ts">
import { inject, computed } from "vue"
import { useI18n } from "vue-i18n"
import type { CalloutBlockProps, CalloutVariant } from "../../../types"
import { useAppConfig } from "#imports"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"

export interface CalloutBlockEditorProps extends CalloutBlockProps {
  id: string
  rc?: {
    root?: string
  }
}

const { id, variant, children, to, target, rc: rcProp } = defineProps<CalloutBlockEditorProps>()

export interface CalloutBlockEditorEmits {}

const emit = defineEmits<CalloutBlockEditorEmits>()

export interface CalloutBlockEditorSlots {}

const slots = defineSlots<CalloutBlockEditorSlots>()

const { rc } = useRC('CalloutBlockEditor', rcProp)

const calloutBlockEditorStyles = tv({
  slots: {
    root: ""
  }
})

const { root } = calloutBlockEditorStyles()

const editorApi = inject<any>("block-editor-api")

const variants: CalloutVariant[] = [
  "info",
  "success",
  "warning",
  "error",
  "commentary",
  "ideation",
  "source"
]

const appConfig = useAppConfig()
const { t } = useI18n()

const getVariantConfig = (variant: CalloutVariant) => {
  return (
    (appConfig.rimelightComponents as any)?.callouts?.[variant] ?? {
      icon: "lucide:alert-circle",
      title: "Callout",
      tooltip: "Callout"
    }
  )
}

const items = computed(() => [
  variants.map(type => {
    const config = getVariantConfig(type)
    return {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      icon: config.icon,
      description: t(config.description || config.tooltip),
      onSelect: () => {
        if (editorApi) {
          editorApi.updateBlockProps(id, { variant: type })
        }
      }
    }
  })
])
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCCallout :variant="variant" :to="to" :target="target">
      <template #leading="{ icon, iconClass }">
        <UDropdownMenu :items="items" :ui="{ content: 'w-64' }">
          <template #item="{ item }">
            <div class="flex items-start gap-2 w-full text-left">
              <UIcon :name="item.icon" class="size-4 text-dimmed mt-0.5 shrink-0" />
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class="font-medium text-sm truncate">{{ item.label }}</span>
                <span class="text-xs text-dimmed font-normal leading-snug whitespace-normal">{{ item.description }}</span>
              </div>
            </div>
          </template>

          <UIcon 
            :name="icon" 
            :class="[iconClass, 'cursor-pointer hover:opacity-75 transition-opacity']" 
            class="outline-none"
          />
        </UDropdownMenu>
      </template>
      <RCBlockViewRenderer :blocks="children" />
    </RCCallout>
  </div>
</template>
