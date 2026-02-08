<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { PAGE_MAP } from "./types/page-definitions"
import type { Page } from "rimelight-components/types"
import { ULink } from "#components"
import { useQuickActions } from "rimelight-components/composables"

const toast = useToast()

useSeoMeta({
  title: "Rimelight Entertainment",
  ogTitle: "Rimelight Entertainment",
  description: "Tell your story.",
  ogDescription: "Tell your story.",
  ogImage: "https://cdn.rimelight.com/images/logos/logomark-white.webp",
  twitterImage: "https://cdn.rimelight.com/images/logos/logomark-white.webp",
  twitterCard: "summary_large_image"
})

const descriptionComponent = h("div", [
  "This website uses ",
  h(
    ULink,
    {
      href: "https://en.wikipedia.org/wiki/HTTP_cookie",
      class: "text-primary",
      target: "_blank"
    },
    () => "cookies"
  ),
  " to ensure to enhance your browsing experience. ",
  h("br"),
  "By continuing to use our site, you agree to our ",
  h(
    ULink,
    {
      href: "/documents/policies/cookie-policy/",
      class: "text-primary"
    },
    () => "Cookie Policy"
  ),
  "."
])

const cookie = useCookie("cookie-consent", {
  maxAge: 60 * 60 * 24 * 90,
  secure: import.meta.env.PROD,
  sameSite: "lax"
})

const { registerAction } = useQuickActions()
const isCreateModalOpen = ref(false)
const isCreating = ref(false)

watch(isCreateModalOpen, (val) => {
  console.log('[App] isCreateModalOpen changed:', val)
})

const handleCreateConfirm = async (newPageData: Partial<Page>) => {
  try {
    isCreating.value = true
    console.log('Creating page via Quick Action:', newPageData)
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(`Page created: ${JSON.stringify(newPageData.title)}. In a real app, this would navigate to the new page.`)
    isCreateModalOpen.value = false
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    (window as any).triggerCreatePageModal = () => {
      isCreateModalOpen.value = true
    }
  }

  registerAction({
    id: 'create-page',
    label: 'Create Page',
    icon: 'lucide:plus',
    onSelect: () => {
      console.log('Quick Action triggered: opening modal')
      isCreateModalOpen.value = true
    }
  })

  if (cookie.value === "accepted") {
    return
  }

  toast.add({
    duration: 0,
    color: "primary",
    icon: "lucide:cookie",
    title: "Cookie Consent",
    description: () => descriptionComponent,
    actions: [
      {
        icon: "lucide:check",
        label: "Accept All Cookies",
        color: "success",
        variant: "solid",
        onClick: (e) => {
          e?.stopPropagation()
          cookie.value = "accepted"
          toast.clear()
        }
      },
      {
        icon: "lucide:x",
        label: "Reject All Cookies",
        color: "error",
        variant: "solid",
        onClick: (e) => {
          e?.stopPropagation()
          cookie.value = "rejected"
          toast.clear()
        }
      }
    ],
    close: false
  })
})
</script>

<template>
  <UApp lang="en" dir="ltr" :tooltip="{ delayDuration: 0 }">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="primary" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <RCQuickActions />
      <RCCreatePageModal
        v-model:open="isCreateModalOpen"
        :definitions="PAGE_MAP"
        :loading="isCreating"
        @confirm="handleCreateConfirm"
      />
      <RCScrollToTop />
    </ClientOnly>
  </UApp>
</template>

<style></style>
