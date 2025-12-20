<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui"

const route = useRoute()

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const items = computed<NavigationMenuItem[]>(() => {
  const baseItems: NavigationMenuItem[] = [
    {
      label: "Megamenu",
      active: route.path.startsWith("/megamenu"),
      slot: "megamenu" as const,
      children: [
        {
          label: "Overview",
          description:
            "You have nothing to do, @nuxt/icon will handle it automatically."
        },
        {
          label: "Characters",
          description:
            "Choose a primary and a neutral color from your Tailwind CSS theme."
        },
        {
          label: "Tales",
          description:
            'You can customize components by using the "class" / "ui" props or in your app.config.ts.'
        }
      ]
    },
    {
      label: "Link 1",
      active: route.path.startsWith("/link-1")
    },
    {
      label: "Events",
      active: route.path.startsWith("/events")
    },
    {
      label: "Store",
      active: route.path.startsWith("/store")
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
          description:
            "Check out our currently open positions and their requirements.!"
        },
        {
          label: "Studios",
          icon: "lucide:building-2",
          description: "Take a tour of our facilities."
        },
        {
          label: "Benefits",
          icon: "lucide:hand-heart",
          description:
            "Discover what benefits and compensations are available to our employees."
        }
      ]
    }
  ]
  return baseItems
})
const accountMenuItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "username",
      avatar: {
        src: "https://github.com/benjamincanac.png"
      },
      type: "label"
    }
  ],
  [
    {
      label: "Profile",
      icon: "i-lucide-user"
    },
    {
      label: "Billing",
      icon: "i-lucide-credit-card"
    }
  ],
  [
    {
      label: "Team",
      icon: "i-lucide-users"
    },
    {
      label: "Invite users",
      icon: "i-lucide-user-plus",
      children: [
        [
          {
            label: "Email",
            icon: "i-lucide-mail"
          },
          {
            label: "Message",
            icon: "i-lucide-message-square"
          }
        ],
        [
          {
            label: "More",
            icon: "i-lucide-circle-plus"
          }
        ]
      ]
    },
    {
      label: "New team",
      icon: "i-lucide-plus",
      kbds: ["meta", "n"]
    }
  ],
  [
    {
      label: "Support",
      icon: "lucide:headset",
      to: "/docs/components/dropdown-menu"
    }
  ],
  [
    {
      label: "Settings",
      icon: "i-lucide-cog",
      kbds: [","]
    },
    {
      label: "Logout",
      icon: "lucide:log-out",
      kbds: ["shift", "meta", "q"],
      click: async () => {
        await $fetch("/api/logout", {
          method: "POST"
        })
        await navigateTo("/")
      }
    }
  ]
])

defineShortcuts(extractShortcuts(accountMenuItems.value))
</script>

<template>
  <RCHeader class="bg-black">
    <template #left>
      <RCLogo variant="mark" class="h-6 w-auto" />
    </template>
    <template #center>
      <UNavigationMenu
        :items="items"
        variant="link"
        :ui="{
          viewportWrapper: 'top-0 flex fixed w-screen mt-(--ui-header-height)',
          viewport: 'rounded-none'
        }"
      >
        <template #megamenu-content="{ item }">
          <UContainer>
            <div class="flex h-full flex-row gap-xl">
              <NuxtImg src="https://placehold.co/256x256" alt="Placeholder" />
              <ul v-if="(item as NavigationMenuItem).children">
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
            </div>
          </UContainer>
        </template>
        <template #megamenu2-content="{ item }">
          <UContainer>
            <ul
              class="grid gap-2 p-4 lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]"
            >
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
    </template>
    <template #right>
      <div class="flex flex-row gap-md">
        <UButton variant="solid" color="primary" label="Button 1" />
        <UButton variant="outline" color="primary" label="Button 2" />
      </div>
    </template>
    <template #collapsed-left>
      <UDrawer
        v-model:open="leftDrawerOpen"
        direction="left"
        :handle="false"
        :ui="{
          header: 'flex items-center justify-between',
          content: 'w-full max-w-2/3'
        }"
      >
        <UButton color="neutral" variant="ghost" icon="lucide:menu" />
        <template #header>
          <h2 class="font-semibold text-highlighted">Drawer 1</h2>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            @click="leftDrawerOpen = false"
          />
        </template>
        <template #body>
          <div class="flex size-full flex-col items-start gap-md">
            <UNavigationMenu
              :items="items"
              variant="link"
              orientation="vertical"
            />
          </div>
        </template>
      </UDrawer>
    </template>
    <template #collapsed-center>
      <RCLogo variant="mark" class="h-12" />
    </template>
    <template #collapsed-right>
      <UDrawer
        v-model:open="rightDrawerOpen"
        direction="right"
        :handle="false"
        :ui="{
          header: 'flex items-center justify-between',
          content: 'w-full max-w-2/3'
        }"
      >
        <UButton color="neutral" variant="ghost" icon="lucide:user" />
        <template #header>
          <h2 class="font-semibold text-highlighted">Drawer 2</h2>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:x"
            @click="rightDrawerOpen = false"
          />
        </template>
        <template #body>
          <div class="flex size-full flex-col gap-md">
            <div class="flex flex-col gap-sm">
              <UButton
                size="xl"
                variant="solid"
                color="primary"
                label="Button 1"
                block
              />
              <UButton
                size="xl"
                variant="outline"
                color="primary"
                label="Button 2"
                block
              />
            </div>
          </div>
        </template>
      </UDrawer>
    </template>
  </RCHeader>
</template>

<style scoped></style>
