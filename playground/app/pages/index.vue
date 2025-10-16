<script setup lang="ts">
useHead({
  title: "Home"
})

const logoPool: { logo: string; href: string; iconClass?: string }[] = [
  { logo: "logos:typescript-icon", href: "https://www.typescriptlang.org/" },
  { logo: "logos:vue", href: "https://vuejs.org/" },
  { logo: "logos:nuxt-icon", href: "https://nuxt.com/" },
  { logo: "logos:tailwindcss-icon", href: "https://tailwindcss.com/" },
  { logo: "logos:vitejs", href: "https://vite.dev/" },
  { logo: "logos:bun", href: "https://bun.com/" },
  { logo: "vscode-icons:file-type-oxlint", href: "https://oxc.rs/" },
  { logo: "logos:webstorm", href: "https://www.jetbrains.com/webstorm/" },
  { logo: "logos:c-plusplus", href: "https://isocpp.org/" },
  { logo: "logos:rider", href: "https://www.jetbrains.com/rider/" },
  {
    logo: "logos:unrealengine-icon",
    href: "https://www.unrealengine.com/",
    iconClass: "fill-white"
  },
  {
    logo: "simple-icons:perforce",
    href: "https://www.perforce.com/products/helix-core/"
  },
  { logo: "logos:postgresql", href: "https://www.postgresql.org/" },
  { logo: "catppuccin:drizzle-orm", href: "https://orm.drizzle.team/" },
  { logo: "logos:neon-icon", href: "https://neon.com/" },
  { logo: "logos:git-icon", href: "https://git-scm.com/" },
  { logo: "mdi:github", href: "https://github.com/" },
  { logo: "third-party:youtrack", href: "https://www.jetbrains.com/youtrack/" }
]

const CARD_COUNT = 18

const cards = Array.from({ length: CARD_COUNT }, (_, index) => {
  const item = logoPool[index % logoPool.length]

  return {
    logo: item!.logo,
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

const musicFeatures = ref([
  {
    title: "DJ",
    description:
      "I'm a DJ specializing in Hyperpop, Glitchcore, and Hyperflip.",
    icon: "lucide:disc-3"
  },
  {
    title: "Guitarist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:guitar"
  },
  {
    title: "Pianist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "lucide:piano"
  }
])

const hiringLinks = ref([
  {
    label: "Explore Careers",
    to: ""
  }
])
</script>

<template>
  <UPage>
    <UPageHero
      title="Rimelight Entertainment"
      description="Welcome to Rimelight Entertainment."
      headline="Tell your story."
      orientation="horizontal"
      reverse
    >
      <NuxtImg
        src="https://cdn.idantity.me/images/logos/logomark-white.webp"
        alt="idantity.me"
      />
    </UPageHero>
    <RCInteractiveGridPattern
      squares-class-name="hover:fill-primary-400"
      :class="[
        '[mask-image:radial-gradient(350px_circle_at_center,white,transparent)]',
        'inset-right h-[200%] skew-y-12'
      ]"
    />
    <UPageSection
      variant="outline"
      title="me.projects"
      description=" and a passion for technology."
      :features="projectsFeatures"
      :links="projectsLinks"
      orientation="horizontal"
    >
      <div class="flex items-center justify-center p-4">
        <RCAnimateGrid
          :cards
          text-glow-end-color="#DBEAFEFF"
          text-glow-start-color="#1C398EFF"
        >
          <template #logo="{ logo }">
            <UIcon :name="logo" class="logo mx-auto h-10 w-auto" />
          </template>
        </RCAnimateGrid>
      </div>
    </UPageSection>
    <UPageCTA
      title="We're hiring!"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      :links="hiringLinks"
    />
  </UPage>
</template>

<style scoped></style>
