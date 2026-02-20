<script setup lang="ts">
import { computed } from "vue";
import type { NavigationMenuItem } from "#ui/types";

export interface BaseDashboardLayoutProps {
  id?: string;
  sidebarOpen?: boolean;
  links: NavigationMenuItem[] | NavigationMenuItem[][];
  footerLinks?: NavigationMenuItem[] | NavigationMenuItem[][];
  searchGroups?: any[];
  headerLayerId?: string;
  headerOrder?: number;
}

const {
  id = "default",
  sidebarOpen = false,
  links = [],
  footerLinks = [],
  searchGroups = [],
  headerLayerId = "global-header",
  headerOrder = 2,
} = defineProps<BaseDashboardLayoutProps>();

const emit = defineEmits<{
  "update:sidebarOpen": [value: boolean];
}>();

const sidebarOpenModel = computed({
  get: () => sidebarOpen,
  set: (val) => emit("update:sidebarOpen", val),
});

const { totalHeight } = useHeaderStack();
</script>

<template>
  <div
    :style="{ '--total-header-offset': `${totalHeight}px` }"
    class="flex h-svh w-full flex-col overflow-hidden"
  >
    <ClientOnly>
      <RCHeaderLayer :id="headerLayerId" :order="headerOrder">
        <slot name="header" />
      </RCHeaderLayer>
    </ClientOnly>

    <UDashboardGroup :style="{ paddingTop: 'var(--total-header-offset)' }" class="bg-dimmed">
      <UDashboardSidebar :id="id" v-model:open="sidebarOpenModel" class="bg-muted">
        <template #header="{ collapsed }">
          <slot name="sidebar-header" :collapsed="collapsed">
            <RCTeamsMenu :collapsed="collapsed" />
          </slot>
        </template>

        <template #default="{ collapsed }">
          <slot name="sidebar-content" :collapsed="collapsed">
            <UDashboardSearchButton :collapsed="collapsed" class="w-full" />
            <UNavigationMenu
              :collapsed="collapsed"
              :items="links"
              orientation="vertical"
              popover
              tooltip
            />
          </slot>
        </template>

        <template #footer="{ collapsed }">
          <slot name="sidebar-footer" :collapsed="collapsed">
            <div class="flex flex-col gap-sm w-full">
              <UNavigationMenu
                v-if="footerLinks.length > 0"
                :collapsed="collapsed"
                :items="footerLinks"
                block
                class="w-full"
                orientation="vertical"
                tooltip
              />

              <USeparator />

              <div class="flex flex-row gap-xs justify-between">
                <slot name="sidebar-footer-actions" :collapsed="collapsed" />
              </div>
            </div>
          </slot>
        </template>
      </UDashboardSidebar>

      <UDashboardSearch v-if="searchGroups.length > 0" :groups="searchGroups" />

      <slot />
    </UDashboardGroup>

    <slot name="modals" />
  </div>
</template>
