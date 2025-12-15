<script setup lang="ts">
import type { Block } from "../../../src/runtime/types"
import type { AccordionItem } from "@nuxt/ui"

useHead({
  title: "Home"
})

const iconPool: { icon: string; href: string; iconClass?: string }[] = [
  { icon: "logos:typescript-icon", href: "https://www.typescriptlang.org/" },
  { icon: "logos:vue", href: "https://vuejs.org/" },
  { icon: "logos:nuxt-icon", href: "https://nuxt.com/" },
  { icon: "logos:tailwindcss-icon", href: "https://tailwindcss.com/" },
  { icon: "logos:vitejs", href: "https://vite.dev/" },
  { icon: "logos:bun", href: "https://bun.com/" },
  { icon: "vscode-icons:file-type-oxlint", href: "https://oxc.rs/" },
  { icon: "logos:git-icon", href: "https://git-scm.com/" },
  { icon: "logos:c-plusplus", href: "https://isocpp.org/" },
  {
    icon: "logos:unrealengine-icon",
    href: "https://www.unrealengine.com/",
    iconClass: "fill-white"
  },
  {
    icon: "simple-icons:perforce",
    href: "https://www.perforce.com/products/helix-core/",
    iconClass: "text-[#3805F2]"
  },
  { icon: "logos:postgresql", href: "https://www.postgresql.org/" },
  { icon: "catppuccin:drizzle-orm", href: "https://orm.drizzle.team/" },
  { icon: "logos:neon-icon", href: "https://neon.com/" },
  { icon: "mdi:github", href: "https://github.com/" },
  { icon: "logos:webstorm", href: "https://www.jetbrains.com/webstorm/" },
  { icon: "logos:rider", href: "https://www.jetbrains.com/rider/" },
  { icon: "third-party:youtrack", href: "https://www.jetbrains.com/youtrack/" }
]

const cards = Array.from({ length: iconPool.length }, (_, index) => {
  const item = iconPool[index % iconPool.length]

  return {
    icon: item!.icon,
    href: item!.href,
    iconClass: item!.iconClass
  }
})

const projectsFeatures = ref([
  {
    title: "Game Developer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:gamepad-2"
  },
  {
    title: "Web Developer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:code"
  },
  {
    title: "Narrative Writer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:pen-tool"
  }
])

const projectsLinks = ref([
  {
    label: "View me on GitHub",
    color: "secondary",
    variant: "subtle",
    trailingIcon: "mdi:github",
    to: "https://github.com/idantitydotme"
  }
])

const ctaLinks = ref([
  {
    label: "Call to Action",
    to: ""
  }
])
</script>

<template>
  <UPage>
    <UContainer>
      <RCSection
        :level="1"
        title="Components"
        description="Lorem ipsum dolor sit amet."
      >
        <RCSection
          :level="2"
          title="Content"
          description="Lorem ipsum dolor sit amet."
        >
          <RCSection
            :level="3"
            title="Callout"
            description="Callouts are used to highlight important information."
          >
            <div class="flex flex-col gap-md">
              <RCCallout variant="info">
                Lorem ipsum dolor sit amet.
              </RCCallout>
              <RCCallout variant="success"
                >Lorem ipsum dolor sit amet.</RCCallout
              >
              <RCCallout variant="warning"
                >Lorem ipsum dolor sit amet.</RCCallout
              >
              <RCCallout variant="error">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="commentary"
                >Lorem ipsum dolor sit amet.</RCCallout
              >
              <RCCallout variant="ideation"
                >Lorem ipsum dolor sit amet.</RCCallout
              >
              <RCCallout variant="source"
                >Lorem ipsum dolor sit amet.</RCCallout
              >
            </div>
          </RCSection>
        </RCSection>
        <RCSection
          :level="2"
          title="Swatches"
          description="Lorem ipsum dolor sit amet."
        >
          <RCSection :level="3" title="Logotype">
            <div class="flex flex-col gap-lg lg:flex-row">
              <RCImageSwatch
                name="Monochrome White"
                jpg="https://cdn.idantity.me/images/logos/logomark-white.webp"
                png="https://cdn.idantity.me/images/logos/logomark-white.webp"
                webp="https://cdn.idantity.me/images/logos/logomark-white.webp"
                svg="https://cdn.idantity.me/images/logos/logomark-white.webp"
              />
              <RCImageSwatch
                name="Monochrome Black"
                jpg="https://cdn.idantity.me/images/logos/logomark-white.webp"
                png="https://cdn.idantity.me/images/logos/logomark-white.webp"
                webp="https://cdn.idantity.me/images/logos/logomark-white.webp"
                svg="https://cdn.idantity.me/images/logos/logomark-white.webp"
              />
              <RCImageSwatch
                name="Color"
                jpg="https://cdn.idantity.me/images/logos/logomark-white.webp"
                png="https://cdn.idantity.me/images/logos/logomark-white.webp"
                webp="https://cdn.idantity.me/images/logos/logomark-white.webp"
                svg="https://cdn.idantity.me/images/logos/logomark-white.webp"
              />
            </div>
          </RCSection>
          <RCSection
            :level="3"
            title="Color"
            description="Lorem ipsum dolor sit amet."
          >
            <RCColorSwatch
              name="Color"
              hex="#1d6ebe"
              rgb="rgb(29, 110, 190)"
              hsl="hsl(209 73% 43%)"
              oklch="oklch(0.5338 0.1455 252.53)"
              cmyk="cmyk(84%, 42%, 0%, 25%)"
            />
          </RCSection>
          <RCSection
            :level="3"
            title="Image"
            description="Lorem ipsum dolor sit amet."
          >
            <RCImageSwatch
              name="Image"
              jpg="https://placehold.co/1024x512"
              png="https://placehold.co/1024x512"
              webp="https://placehold.co/1024x512"
              svg="https://placehold.co/1024x512"
            />
          </RCSection>
          <RCSection
            :level="3"
            title="Font"
            description="Lorem ipsum dolor sit amet."
          >
            <RCFontSwatch />
          </RCSection>
        </RCSection>
      </RCSection>
    </UContainer>
    <UPageHero
      title="Rimelight Components"
      description="Welcome to Rimelight Entertainment."
      headline="Tell your story."
      orientation="horizontal"
      reverse
      class="pointer-events-none z-20"
    >
      <NuxtImg
        src="https://cdn.idantity.me/images/logos/logomark-white.webp"
        alt="idantity.me"
      />
    </UPageHero>
    <ClientOnly>
      <div
        class="relative grid h-128 w-full place-content-center justify-center overflow-hidden"
      >
        <UPageCTA
          variant="naked"
          title="Rimelight Components"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          :links="ctaLinks"
          class="z-10 max-w-128"
        />
      </div>
    </ClientOnly>
  </UPage>
</template>

<style scoped></style>
