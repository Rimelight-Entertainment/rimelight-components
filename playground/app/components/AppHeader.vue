<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui"
import { useHeaderStack } from "rimelight-components/composables"
import { MOCK_PAGES_LIST } from "../mocks/pages"

const { bottomOffsets } = useHeaderStack()
const headerLayerId = inject<string>("header_layer_id", "global-header")

const route = useRoute()

const slideoverState = reactive({
  left: false,
  right: false,
  notifications: false
})

// Mock Session Data
const session = ref({
  user: {
    name: "idantity.me",
    tag: "0000",
    image: "https://github.com/idantitydotme.png",
    status: "Accessing me.",
    availability: "available"
  }
})

const availabilityChip = computed(() => ({
  color: "success" as const,
  position: "bottom-right" as const
}))

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Wiki",
    active: route.path.startsWith("/wiki") || MOCK_PAGES_LIST.some(page => route.path.startsWith(`/${page.slug}`)),
    slot: "megamenu" as const,
    children: MOCK_PAGES_LIST.filter(p => !p.slug.includes('/')).map(parent => ({
      label: parent.title.en,
      description: parent.description?.en,
      to: `/${parent.slug}`,
      children: MOCK_PAGES_LIST.filter(p => p.slug.startsWith(`${parent.slug}/`)).map(child => ({
        label: child.title.en,
        description: child.description?.en,
        to: `/${child.slug}`
      }))
    }))
  },
  {
    label: "Components",
    to: "/components",
    active: route.path === "/components"
  },

  {
    label: "Branding",
    to: "/branding",
    active: route.path === "/branding"
  },
  {
    label: "Megamenu 2",
    active: route.path.startsWith("/megamenu2"),
    slot: "megamenu2" as const,
    children: [
      {
        label: "History",
        icon: "lucide:book",
        description: "Learn about our beginnings and our mission."
      },
      {
        label: "Jobs",
        icon: "lucide:briefcase",
        description: "Check out our currently open positions and their requirements.!"
      },
      {
        label: "Studios",
        icon: "lucide:building-2",
        description: "Take a tour of our facilities."
      },
      {
        label: "Benefits",
        icon: "lucide:hand-heart",
        description: "Discover what benefits and compensations are available to our employees."
      }
    ]
  }
])

const accountMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      slot: "user" as const
    },
    {
      label: "Dashboard",
      icon: "lucide:layout-dashboard",
      to: "/components"
    }
  ],
  [
    {
      label: "Profile",
      icon: "lucide:user"
    },
    {
      label: "Billing",
      icon: "lucide:credit-card"
    }
  ],
  [
    {
      label: "Team",
      icon: "lucide:users"
    },
    {
      label: "Settings",
      icon: "lucide:cog",
      kbds: [","]
    },
    {
      label: "Logout",
      icon: "lucide:log-out",
      kbds: ["shift", "meta", "q"]
    }
  ]
])

defineShortcuts(extractShortcuts(accountMenuItems.value))
</script>

<template>
  <RCHeader :contain="false" class="bg-black">
    <template #left>
      <div class="flex flex-row items-center gap-md">
        <ClientOnly>
          <RCLogo variant="mark" class="h-6 w-auto" />
        </ClientOnly>
        <UNavigationMenu
          :items="items"
          variant="link"
          :style="{ '--header-bottom-boundary': `${(bottomOffsets[headerLayerId] || 0) - 64}px` }"
          :ui="{
            viewportWrapper:
              'top-[var(--header-bottom-boundary)] flex fixed w-screen mt-[var(--ui-header-height)]',
            viewport: 'rounded-none',
            label: 'text-white',
            link: 'hover:text-primary-200 active:text-500'
          }"
        >
          <template #megamenu-content="{ item }">
            <UContainer>
              <div class="flex h-full flex-row gap-xl">
                <NuxtImg src="https://placehold.co/256x256" alt="Placeholder" />
                <ul v-if="(item as NavigationMenuItem).children" class="grid gap-4 flex-1 p-md grid-cols-2">
                  <li v-for="parent in (item as NavigationMenuItem).children" :key="parent.label" class="space-y-2">
                    <ULink
                      :to="parent.to"
                      class="block w-full rounded-md p-3 text-left text-sm transition-colors hover:bg-elevated/50 bg-muted/30"
                    >
                      <p class="font-bold text-highlighted">
                        {{ parent.label }}
                      </p>
                      <p class="line-clamp-2 text-muted text-xs">
                        {{ parent.description }}
                      </p>
                    </ULink>
                    
                    <ul v-if="parent.children" class="pl-4 space-y-1">
                      <li v-for="child in parent.children" :key="child.label">
                        <ULink
                          :to="child.to"
                          class="block w-full rounded-md px-3 py-1 text-left text-sm transition-colors hover:text-primary"
                        >
                          <span class="text-xs text-muted mr-2">/</span>
                          <span class="font-medium">{{ child.label }}</span>
                        </ULink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </UContainer>
          </template>
          <template #megamenu2-content="{ item }">
            <UContainer>
              <ul class="grid gap-2 p-4 lg:w-125 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                <li class="row-span-3">
                  <RCPlaceholder class="size-full min-h-48" />
                </li>

                <li v-for="child in (item as NavigationMenuItem).children" :key="child.label">
                  <ULink
                    class="rounded-md p-3 text-left text-sm transition-colors hover:bg-elevated/50"
                  >
                    <p class="font-medium text-highlighted">
                      {{ child.label }}
                    </p>
                    <p class="line-clamp-2 text-muted">
                      {{ child.description }}
                    </p>
                  </ULink>
                </li>
              </ul>
            </UContainer>
          </template>
        </UNavigationMenu>
      </div>
    </template>

    <template #right>
      <div class="flex flex-row items-center gap-sm">
        <ClientOnly>
          <div class="flex flex-row items-center gap-md">
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
                      alt: session.user.name
                    }"
                    :name="session.user.name"
                    :description="session.user.status"
                    :chip="availabilityChip"
                    :ui="{ description: 'text-left' }"
                  />
                </UButton>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <div class="flex flex-col gap-xs bg-elevated p-sm">
                    <UUser
                      size="md"
                      :avatar="{
                        src: session.user.image,
                        alt: session.user.name
                      }"
                      :description="session.user.status"
                      :ui="{ name: 'text-left', description: 'text-left' }"
                    >
                      <template #name>
                        <span
                          >{{ session.user.name }}
                          <span class="text-dimmed">#{{ session.user.tag }}</span></span
                        >
                      </template>
                    </UUser>
                    <UButton variant="ghost" color="neutral" leading-icon="lucide:user" label="Profile" />
                  </div>
                  <div class="flex flex-col gap-xs bg-muted p-sm">
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
        <USlideover
          v-model:open="slideoverState.left"
          side="left"
          :handle="false"
          :ui="{
            header: 'flex items-center justify-between',
            content: 'w-full max-w-4/5 rounded-none'
          }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:menu"
            @click="slideoverState.left = true"
          />
          <template #header>
            <RCLogo variant="mark" class="h-6 w-auto" />
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:x"
              @click="slideoverState.left = false"
            />
          </template>
          <template #body>
            <div class="flex size-full flex-col items-start gap-md">
              <UNavigationMenu :items="items" variant="link" orientation="vertical" />
            </div>
          </template>
        </USlideover>
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
          <UTooltip text="Notifications">
            <UButton color="neutral" variant="ghost" square @click="slideoverState.notifications = true">
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
              content: 'w-full max-w-4/5 rounded-none'
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
                  alt: session.user.name
                }"
                :description="session.user.status"
                :ui="{ description: 'text-left' }"
              >
                <template #name>
                  <span
                    >{{ session.user.name }}
                    <span class="text-dimmed">#{{ session.user.tag }}</span></span
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
              <div class="flex flex-col gap-md">
                <UNavigationMenu orientation="vertical" :items="accountMenuItems" />
              </div>
            </template>
          </USlideover>
        </ClientOnly>
      </div>
    </template>
  </RCHeader>
</template>

<style scoped></style>
