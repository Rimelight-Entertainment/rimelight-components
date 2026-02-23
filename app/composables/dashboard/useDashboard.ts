import { useRoute, useState, useNuxtApp } from "#imports";
import { watch, computed, type Ref } from "vue";

export const useDashboard = () => {
  const nuxtApp = useNuxtApp();
  const authClient = (nuxtApp as any).$authClient;
  const route = useRoute();

  // 1. Auth States
  const activeOrgState = authClient?.useActiveOrganization?.();
  
  const activeOrganization = computed(() => activeOrgState?.value?.data || null);

  // 2. Team State (Client-side managed)
  const activeTeamId = useState<string | null>("dashboard:activeTeamId", () => null);
  
  // We'll need the list of teams to resolve the full team object
  // This is a bit tricky since useDashboard is a composable. 
  // We'll rely on the caller or a shared state if needed, but for now let's provide a way to set ID.
  const setActiveTeam = (id: string | null) => {
    activeTeamId.value = id;
  };

  const refreshActiveOrganization = async () => {
    if (activeOrgState?.value?.refetch) {
      return await activeOrgState.value.refetch();
    }
  };

  // 3. UI States
  const isNotificationsSlideoverOpen = useState<boolean>(
    "dashboard:notificationsSlideover",
    () => false,
  );

  // 4. Watchers
  watch(
    () => route.fullPath,
    () => {
      isNotificationsSlideoverOpen.value = false;
    },
  );

  // Reset team when organization changes
  watch(activeOrganization, () => {
    activeTeamId.value = null;
  });

  return {
    activeOrganization,
    activeTeamId,
    setActiveTeam,
    refreshActiveOrganization,
    isNotificationsSlideoverOpen,
  };
};
