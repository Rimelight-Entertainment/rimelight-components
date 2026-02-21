<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { ref, computed } from "vue";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../composables";

/* region Props */
export interface TeamsMenuProps {
  collapsed?: boolean;
  rc?: {
    root?: string;
  };
}

const { collapsed, rc: rcProp } = defineProps<TeamsMenuProps>();

const { rc } = useRC("TeamsMenu", rcProp);
/* endregion */

/* region Emits */
export interface TeamsMenuEmits {}

const emit = defineEmits<TeamsMenuEmits>();
/* endregion */

/* region Slots */
export interface TeamsMenuSlots {}

const slots = defineSlots<TeamsMenuSlots>();
/* endregion */

/* region Styles */
const teamsMenuStyles = tv({
  slots: {
    root: "",
    triggerButton: "data-[state=open]:bg-elevated",
    buttonTrailing: "text-dimmed",
  },
});

const { root, triggerButton, buttonTrailing } = teamsMenuStyles();
type TeamsMenuVariants = VariantProps<typeof teamsMenuStyles>;
/* endregion */

/* region State */
const teams = ref([
  {
    label: `Nuxt`,
    avatar: {
      src: `https://github.com/nuxt.png`,
      alt: `Nuxt`,
    },
  },
  {
    label: `NuxtHub`,
    avatar: {
      src: `https://github.com/nuxt-hub.png`,
      alt: `NuxtHub`,
    },
  },
  {
    label: `NuxtLabs`,
    avatar: {
      src: `https://github.com/nuxtlabs.png`,
      alt: `NuxtLabs`,
    },
  },
]);
const selectedTeam = ref(teams.value[0]);

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    teams.value.map((team) => ({
      ...team,
      onSelect() {
        selectedTeam.value = team;
      },
    })),
    [
      {
        label: `Create team`,
        icon: `lucide:circle-plus`,
      },
      {
        label: `Manage teams`,
        icon: `lucide:cog`,
      },
    ],
  ];
});
/* endregion */

/* region Meta */
defineOptions({
  name: "TeamsMenu",
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
  <UDropdownMenu
    :content="{ align: 'center', collisionPadding: 12 }"
    :items="items"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      :class="[triggerButton(), !collapsed && 'py-2']"
      :square="collapsed"
      :ui="{
        trailingIcon: buttonTrailing(),
      }"
      block
      color="neutral"
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'lucide:chevrons-up-down',
      }"
      variant="ghost"
    />
  </UDropdownMenu>
</template>

<style scoped></style>
