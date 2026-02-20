import { useRoute, useState } from "#imports";
import { watch } from "vue";

export const useDashboard = () => {
  // 1. Initializing
  const route = useRoute();

  // 2. Refs
  const isNotificationsSlideoverOpen = useState<boolean>(
    "dashboard:notificationsSlideover",
    () => false,
  );

  // 3. Watchers
  watch(
    () => route.fullPath,
    () => {
      isNotificationsSlideoverOpen.value = false;
    },
  );

  return {
    isNotificationsSlideoverOpen,
  };
};
