<script setup lang="ts">
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
    <div class="size-64 bg-white" />
    <div class="flex w-full flex-col items-center gap-md">
      <RCColorSwatch
        hex="#E12AFBFF"
        rgb="rgb(225, 42, 251)"
        oklch="oklch(66.7% 0.295 322.15)"
      />
    </div>
    <div class="relative grid h-[500px] place-content-center overflow-hidden">
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

      <RCInteractiveGrid
        squares-class-name="hover:fill-primary-500"
        :height="48"
        :width="48"
        :squares="[80, 80]"
        :class="[
          '[mask-image:radial-gradient(512px_192px_ellipse_at_70%_50%,white,transparent)]',
          'inset-0 z-0 h-[200%] skew-y-12'
        ]"
      />
    </div>
    <UPageSection
      variant="outline"
      title="me.projects"
      description=" and a passion for technology."
      :features="projectsFeatures"
      :links="projectsLinks"
      orientation="horizontal"
    >
      <RCAnimateGrid :cards />
    </UPageSection>

    <ClientOnly>
      <div
        class="relative grid h-128 w-full place-content-center justify-center overflow-hidden"
      >
        <RCFlickeringGrid
          class="absolute z-0 w-full [mask-image:radial-gradient(512px_256px_ellipse_at_center,white,transparent)] lg:[mask-image:radial-gradient(1280px_256px_ellipse_at_center,white,transparent)]"
          :square-size="40"
          :grid-gap="6"
          color="#60A5FA"
          :max-opacity="0.5"
          :flicker-chance="0.05"
          :width="5120"
          :height="512"
        />
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
