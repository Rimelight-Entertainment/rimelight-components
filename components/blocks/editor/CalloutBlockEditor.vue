<script setup lang="ts">
import { inject, computed, ref, watch, nextTick, type Ref, shallowRef } from "vue"
import { useI18n } from "vue-i18n"
import type { CalloutBlockProps, CalloutVariant, Block } from "../../../types"
import { useAppConfig } from "#imports"
import { tv } from "../../../internal/tv"
import { useRC } from "../../../composables"

export interface CalloutBlockEditorProps extends CalloutBlockProps {
  id: string
  rc?: {
    root?: string
  }
}

const props = defineProps<CalloutBlockEditorProps>()
const { rc: rcProp } = props

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
          editorApi.updateBlockProps(props.id, { variant: type })
        }
      }
    }
  })
])

// Use a computed property to bridge vuedraggable and the central store directly
const localChildren = computed({
  get: () => props.children ?? [],
  set: (newChildren) => {
    console.log('[CalloutBlockEditor] localChildren setter called:', newChildren.length)
    if (editorApi && props.id) {
       const childrenCopy = JSON.parse(JSON.stringify(newChildren))
       editorApi.updateBlockProps(props.id, { children: childrenCopy })
    }
  }
})

const handleChildrenMutation = () => {
    console.log('[CalloutBlockEditor] Mutation event received (handled by setter)')
}
</script>

<template>
  <div :class="root({ class: rc.root })">
    <RCCallout :variant="props.variant" :to="props.to" :target="props.target">
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
      <template #default>
        <div class="w-full mt-2">
          <RCBlockEditor 
            v-model="localChildren"
            :container-id="props.id"
            @mutation="handleChildrenMutation"
            @end="handleChildrenMutation"
          />
        </div>
      </template>
    </RCCallout>
  </div>
</template>
