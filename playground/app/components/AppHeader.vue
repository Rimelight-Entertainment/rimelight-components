<script setup lang="ts">
import { computed, reactive, ref, inject } from "vue";
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import { useHeaderStack } from "rimelight-components/composables";
import { MOCK_PAGES_LIST } from "../mocks/pages";
import { tv } from "../../../app/internal/tv";
import { type VariantProps } from "tailwind-variants";

/* region Props */
export interface AppHeaderProps {
  // prop1: string,
}

const {} = defineProps<AppHeaderProps>();
/*endregion */

/* region Emits */
export interface AppHeaderEmits {}

const emit = defineEmits<AppHeaderEmits>();
/* endregion */

/* region Slots */
export interface AppHeaderSlots {}

const slots = defineSlots<AppHeaderSlots>();
/* endregion */

/* region Styles */
const appHeaderStyles = tv({
  slots: {
    root: "bg-black",
    leftGroup: "flex flex-row items-center gap-md",
    logo: "h-6 w-auto",
    navigation: "",
    megaMenuWrapper: "flex h-full flex-row gap-xl",
    megaMenuList: "grid gap-4 flex-1 p-md grid-cols-2",
    megaMenuParent: "space-y-2",
    megaMenuLink:
      "block w-full rounded-md p-3 text-left text-sm transition-colors hover:bg-elevated/50 bg-muted/30",
    megaMenuHeading: "font-bold text-highlighted",
    megaMenuDescription: "line-clamp-2 text-muted text-xs",
    megaMenuSubList: "pl-4 space-y-1",
    megaMenuSubLink:
      "block w-full rounded-md px-3 py-1 text-left text-sm transition-colors hover:text-primary",
    megaMenuSlash: "text-xs text-muted mr-2",
    megaMenuLabel: "font-medium",
    rightGroup: "flex flex-row items-center gap-sm",
    rightAuthGroup: "flex flex-row items-center gap-md",
    popoverContent: "flex flex-col",
    popoverUserSection: "flex flex-col gap-xs bg-elevated p-sm",
    popoverActionSection: "flex flex-col gap-xs bg-muted p-sm",
    userName: "text-dimmed",
    collapsedLeftSlideover: "w-full max-w-4/5 rounded-none",
    collapsedContent: "flex size-full flex-col items-start gap-md",
    collapsedRightSlideover: "w-full max-w-4/5 rounded-none",
    collapsedRightBody: "flex flex-col gap-md",
  },
});

const {
  root,
  leftGroup,
  logo,
  navigation,
  megaMenuWrapper,
  megaMenuList,
  megaMenuParent,
  megaMenuLink,
  megaMenuHeading,
  megaMenuDescription,
  megaMenuSubList,
  megaMenuSubLink,
  megaMenuSlash,
  megaMenuLabel,
  rightGroup,
  rightAuthGroup,
  popoverContent,
  popoverUserSection,
  popoverActionSection,
  userName,
  collapsedLeftSlideover,
  collapsedContent,
  collapsedRightSlideover,
  collapsedRightBody,
} = appHeaderStyles();
type AppHeaderVariants = VariantProps<typeof appHeaderStyles>;
/* endregion */

/* region Meta */
defineOptions({
  name: "AppHeader",
});
/* endregion */

/* region State */
const { bottomOffsets } = useHeaderStack();
const headerLayerId = inject<string>("header_layer_id", "global-header");

const route = useRoute();

const slideoverState = reactive({
  left: false,
  right: false,
  notifications: false,
});

// Mock Session Data
const session = ref({
  user: {
    name: "idantity.me",
    tag: "0000",
    image: "https://github.com/idantitydotme.png",
    status: "Accessing me.",
    availability: "available",
  },
});

const availabilityChip = computed(() => ({
  color: "success" as const,
  position: "bottom-right" as const,
}));

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Wiki",
    active:
      route.path.startsWith("/wiki") ||
      MOCK_PAGES_LIST.some((page) => route.path.startsWith(`/${page.slug}`)),
    slot: "megamenu" as const,
    children: MOCK_PAGES_LIST.filter((p) => !p.slug.includes("/")).map((parent) => ({
      label: parent.title.en,
      description: parent.description?.en,
      to: `/${parent.slug}`,
      children: MOCK_PAGES_LIST.filter((p) => p.slug.startsWith(`${parent.slug}/`)).map(
        (child) => ({
          label: child.title.en,
          description: child.description?.en,
          to: `/${child.slug}`,
        }),
      ),
    })),
  },
  {
    label: "Components",
    to: "/components",
    active: route.path === "/components",
  },

  {
    label: "Branding",
    to: "/branding",
    active: route.path === "/branding",
  }
]);

const accountMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      slot: "user" as const,
    },
    {
      label: "Dashboard",
      icon: "lucide:layout-dashboard",
      to: "/components",
    },
  ],
  [
    {
      label: "Profile",
      icon: "lucide:user",
    },
    {
      label: "Billing",
      icon: "lucide:credit-card",
    },
  ],
  [
    {
      label: "Team",
      icon: "lucide:users",
    },
    {
      label: "Settings",
      icon: "lucide:cog",
      kbds: [","],
    },
    {
      label: "Logout",
      icon: "lucide:log-out",
      kbds: ["shift", "meta", "q"],
    },
  ],
]);
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

defineShortcuts(extractShortcuts(accountMenuItems.value));
</script>

<template>
  <RCHeader :contain="false" :class="root()">
    <template #left>
      <div :class="leftGroup()">
        <ClientOnly>
          <RCLogo variant="mark" :class="logo()" />
        </ClientOnly>
        <div
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[headerLayerId] || 0) - 64}px` }"
          :class="navigation()"
        >
          <UNavigationMenu
            :items="items"
            variant="link"
            :ui="{
              viewportWrapper:
                'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)]',
              viewport: 'rounded-none',
              label: 'text-white',
              link: 'hover:text-primary-200 active:text-500',
            }"
          >
            <template #megamenu-content="{ item }">
              <UContainer>
                <div :class="megaMenuWrapper()">
                  <NuxtImg src="https://placehold.co/256x256" alt="Placeholder" />
                  <ul v-if="(item as NavigationMenuItem).children" :class="megaMenuList()">
                    <li
                      v-for="parent in (item as NavigationMenuItem).children"
                      :key="parent.label"
                      :class="megaMenuParent()"
                    >
                      <ULink :to="parent.to" :class="megaMenuLink()">
                        <p :class="megaMenuHeading()">
                          {{ parent.label }}
                        </p>
                        <p :class="megaMenuDescription()">
                          {{ parent.description }}
                        </p>
                      </ULink>

                      <ul v-if="parent.children" :class="megaMenuSubList()">
                        <li v-for="child in parent.children" :key="child.label">
                          <ULink :to="child.to" :class="megaMenuSubLink()">
                            <span :class="megaMenuSlash()">/</span>
                            <span :class="megaMenuLabel()">{{ child.label }}</span>
                          </ULink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </UContainer>
            </template>
          </UNavigationMenu>
        </div>
      </div>
    </template>

    <template #right>
      <div :class="rightGroup()">
        <ClientOnly>
          <div :class="rightAuthGroup()">
            <UButton color="neutral" variant="link" label="Dashboard" to="/components" />
            <UTooltip text="Notifications">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="slideoverState.notifications = true"
              >
                <UChip color="error" inset>
                  <UIcon name="lucide:bell" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>
            <UPopover mode="hover" arrow :ui="{ content: 'w-64' }">
              <template #default>
                <UButton variant="ghost">
                  <UUser
                    size="md"
                    :avatar="{
                      src: session.user.image,
                      alt: session.user.name,
                    }"
                    :name="session.user.name"
                    :description="session.user.status"
                    :chip="availabilityChip"
                    :ui="{ description: 'text-left' }"
                  />
                </UButton>
              </template>
              <template #content>
                <div :class="popoverContent()">
                  <div :class="popoverUserSection()">
                    <UUser
                      size="md"
                      :avatar="{
                        src: session.user.image,
                        alt: session.user.name,
                      }"
                      :description="session.user.status"
                      :ui="{ name: 'text-left', description: 'text-left' }"
                    >
                      <template #name>
                        <span
                          >{{ session.user.name }}
                          <span :class="userName()">#{{ session.user.tag }}</span></span
                        >
                      </template>
                    </UUser>
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:user"
                      label="Profile"
                    />
                  </div>
                  <div :class="popoverActionSection()">
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:headset"
                      label="Support"
                    />
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:cog"
                      label="Settings"
                    />
                    <UButton
                      variant="ghost"
                      color="neutral"
                      leading-icon="lucide:log-out"
                      label="Sign out"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </ClientOnly>
      </div>
    </template>

    <template #collapsed-left>
      <ClientOnly>
        <div>
          <USlideover
            v-model:open="slideoverState.left"
            side="left"
            :handle="false"
            :ui="{
              header: 'flex items-center justify-between',
              content: collapsedLeftSlideover(),
            }"
          >
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:menu"
              @click="slideoverState.left = true"
            />
            <template #header>
              <RCLogo variant="mark" :class="logo()" />
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                @click="slideoverState.left = false"
              />
            </template>
            <template #body>
              <div :class="collapsedContent()">
                <UNavigationMenu :items="items" variant="link" orientation="vertical" />
              </div>
            </template>
          </USlideover>
        </div>
      </ClientOnly>
    </template>

    <template #collapsed-center>
      <ClientOnly>
        <RCLogo variant="mark" class="h-6" />
      </ClientOnly>
    </template>

    <template #collapsed-right>
      <div class="flex flex-row justify-end gap-sm">
        <ClientOnly>
          <div class="flex flex-row gap-sm items-center">
            <UTooltip text="Notifications">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="slideoverState.notifications = true"
              >
                <UChip color="error" inset>
                  <UIcon name="lucide:bell" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>
            <USlideover
              v-model:open="slideoverState.right"
              side="right"
              :handle="false"
              :ui="{
                header: 'flex items-center justify-between',
                content: collapsedRightSlideover(),
              }"
            >
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:user"
                @click="slideoverState.right = true"
              />
              <template #header>
                <UUser
                  size="md"
                  :avatar="{
                    src: session.user.image,
                    alt: session.user.name,
                  }"
                  :description="session.user.status"
                  :ui="{ description: 'text-left' }"
                >
                  <template #name>
                    <span
                      >{{ session.user.name }}
                      <span :class="userName()">#{{ session.user.tag }}</span></span
                    >
                  </template>
                </UUser>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="lucide:x"
                  @click="slideoverState.right = false"
                />
              </template>
              <template #body>
                <div :class="collapsedRightBody()">
                  <UNavigationMenu orientation="vertical" :items="accountMenuItems" />
                </div>
              </template>
            </USlideover>
          </div>
        </ClientOnly>
      </div>
    </template>
  </RCHeader>
</template>

<style scoped></style>
