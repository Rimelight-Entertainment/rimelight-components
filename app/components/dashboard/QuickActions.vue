<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useQuickActions } from "../../composables/dashboard/useQuickActions";
import { computed } from "vue";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../composables";

/* region Props */
export interface QuickActionsProps {
  rc?: {
    root?: string;
  };
}

const { rc: rcProp } = defineProps<QuickActionsProps>();

const { rc } = useRC("QuickActions", rcProp);
/*endregion */

/* region Emits */
export interface QuickActionsEmits {}

const emit = defineEmits<QuickActionsEmits>();
/* endregion */

/* region Slots */
export interface QuickActionsSlots {}

const slots = defineSlots<QuickActionsSlots>();
/* endregion */

/* region Styles */
const quickActionsStyles = tv({
  slots: {
    root: "",
    triggerButton:
      "rounded-full size-14 lg:size-12 justify-center shadow-lg hover:scale-110 transition-transform",
    triggerIcon: "size-6",
  },
});

const { root, triggerButton, triggerIcon } = quickActionsStyles();
type QuickActionsVariants = VariantProps<typeof quickActionsStyles>;
/* endregion */

/* region Meta */
defineOptions({
  name: "QuickActions",
});
/* endregion */

/* region State */
const { registeredActions } = useQuickActions();

const menuItems = computed<DropdownMenuItem[][]>(() => {
  const grouped = registeredActions.value.reduce(
    (acc, action) => {
      const groupId = action.group ?? 0;
      if (!acc[groupId]) acc[groupId] = [];
      acc[groupId].push({
        label: action.label,
        icon: action.icon,
        onSelect: action.onSelect,
      });
      return acc;
    },
    {} as Record<number, DropdownMenuItem[]>,
  );

  return Object.values(grouped);
});
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */

/* endregion */
</script>

<template>
  <div v-if="menuItems.length > 0" :class="root({ class: rc.root })">
    <UDropdownMenu :items="menuItems" :ui="{ content: 'w-48' }">
      <UButton
        icon="lucide:plus"
        color="primary"
        square
        :class="triggerButton()"
        :ui="{
          leadingIcon: triggerIcon(),
        }"
      />
    </UDropdownMenu>
  </div>
</template>

<style scoped></style>
