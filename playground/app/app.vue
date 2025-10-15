<script setup lang="ts">
import { ULink } from "#components"

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

onMounted(() => {
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
  </UApp>
</template>

<style></style>
