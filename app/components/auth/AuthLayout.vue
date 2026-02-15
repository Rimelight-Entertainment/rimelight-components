<script setup lang="ts">
import { computed } from 'vue'
import type { TabsItem } from '@nuxt/ui'

export interface AuthLayoutProps {
  tabs: TabsItem[]
  backgroundMobile?: string
  backgroundDesktop?: string
}

const { tabs = [], backgroundMobile = '', backgroundDesktop = '' } = defineProps<AuthLayoutProps>()

const route = useRoute()
const router = useRouter()

const activeTab = computed({
  get() {
    return tabs.find(i => i.value === route.path)?.value || tabs[0]?.value
  },
  set(path) {
    if (path) router.push(path as string)
  }
})
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <NuxtImg
        v-if="backgroundMobile"
        :src="backgroundMobile"
        alt="Background"
        class="h-full w-full object-cover md:hidden"
      />
      <NuxtImg
        v-if="backgroundDesktop"
        :src="backgroundDesktop"
        alt="Background"
        class="hidden h-full w-full object-cover md:block"
      />
      <div class="absolute inset-0 bg-black/15" />
    </div>
    <UContainer class="flex z-10 min-h-screen items-center justify-center">
      <UCard variant="solid" class="bg-white" :ui="{ body: 'flex flex-col gap-md' }">
        <UTabs
          v-model="activeTab"
          color="primary"
          variant="link"
          :items="tabs"
          :content="false"
          class="w-full"
          :ui="{ trigger: 'grow' }"
        />
        <slot />
      </UCard>
    </UContainer>
  </div>
</template>
