<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useQuickActions } from "../../composables/dashboard/useQuickActions";
import { computed } from "vue";

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
</script>

<template>
  <div v-if="menuItems.length > 0">
    <UDropdownMenu :items="menuItems" :ui="{ content: 'w-48' }">
      <UButton
        icon="i-lucide-plus"
        color="primary"
        square
        :ui="{
          base: 'rounded-full size-14 lg:size-12 justify-center shadow-lg hover:scale-110 transition-transform',
          leadingIcon: 'size-6',
        }"
      />
    </UDropdownMenu>
  </div>
</template>
