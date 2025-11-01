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

const blocks = ref<Block[]>([
  {
    id: "8a4d8g97-8h5e-7224-j000-016c141d5ef0",
    type: "SectionBlock",
    props: {
      level: 2,
      title: "Overview",
      children: [
        {
          id: "9b5e9h08-9i6f-7225-k000-016c141d5ef1",
          type: "ParagraphBlock",
          props: {
            text: [
              {
                id: "text-a1",
                type: "text",
                props: {
                  content:
                    "Undercharge is a solo developed game about the effects of "
                }
              },
              {
                id: "link-a1",
                type: "link",
                props: {
                  href: "https://en.wikipedia.org/wiki/Occupational_burnout",
                  target: "_blank",
                  content: "burnout syndrome"
                }
              },
              {
                id: "text-a2",
                type: "text",
                props: {
                  content:
                    ", and was developed using Unreal Engine 4. It was created with self imposed restrictions of a four hour time limit, and the exclusive usage of Unreal Engine default assets."
                }
              }
            ]
          }
        },
        {
          id: "0c6f0i19-0j7g-7226-l000-016c141d5ef2",
          type: "ImageBlock",
          props: {
            alt: "Undercharge Main Menu",
            src: "https://cdn.idantity.me/images/projects/undercharge/undercharge-menu.webp"
          }
        }
      ]
    }
  },
  {
    id: "1d7g1j20-1k8h-7227-m000-016c141d5ef3",
    type: "SectionBlock",
    props: {
      level: 2,
      title: "Design",
      children: [
        {
          id: "2e8h2k31-2l9i-7228-n000-016c141d5ef4",
          type: "SectionBlock",
          props: {
            level: 3,
            title: "Movement & Stress",
            children: [
              {
                id: "3f9i3l42-3m0j-7229-o000-016c141d5ef5",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-b1",
                      type: "text",
                      props: {
                        content:
                          'In Undercharge the player controls a rolling ball which them can move inside a small arena. As the ball moves, the player accumulates "Stress", an invisible metric that will only lower once they release the movement inputs. The more Stress the player has, the slower the ball will move, eventually halting all movement.'
                      }
                    }
                  ]
                }
              },
              {
                id: "4g0j4m53-4n1k-722a-p000-016c141d5ef6",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-c1",
                      type: "text",
                      props: {
                        content:
                          "This Stress is displayed both visually and auditorily, with the usually green-glowing ball tinting towards red, the player's viewport gaining a red hue, and the game's soundtrack increasing dramatically in volume."
                      }
                    }
                  ]
                }
              },
              {
                id: "5h1k5n64-5o2l-722b-q000-016c141d5ef7",
                type: "ImageBlock",
                props: {
                  alt: "Undercharge Gameplay 1",
                  src: "https://cdn.idantity.me/images/projects/undercharge/undercharge-gameplay_01.webp"
                }
              }
            ]
          }
        },
        {
          id: "6i2l6o75-6p3m-722c-r000-016c141d5ef8",
          type: "SectionBlock",
          props: {
            level: 3,
            title: "Pickups & Score",
            children: [
              {
                id: "7j3m7p86-7q4n-722d-s000-016c141d5ef9",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-d1",
                      type: "text",
                      props: {
                        content:
                          "The game's objective is to obtain the highest score within the least amount of time. Score is obtained by rolling the ball over pickups that are periodically spawned around the arena."
                      }
                    }
                  ]
                }
              },
              {
                id: "8k4n8q97-8r5o-722e-t000-016c141d5f00",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-e1",
                      type: "text",
                      props: {
                        content:
                          "The amount of score each pickup grants depends on the player's current Stress level at the time of interaction - the more stressed, the lower the points, being even possible for a pickup to grant no score at all."
                      }
                    }
                  ]
                }
              },
              {
                id: "9l5o9r08-9s6p-722f-u000-016c141d5f01",
                type: "ImageBlock",
                props: {
                  alt: "Undercharge Gameplay 2",
                  src: "https://cdn.idantity.me/images/projects/undercharge/undercharge-gameplay_02.webp"
                }
              }
            ]
          }
        },
        {
          id: "0m6p0s19-0t7q-7230-v000-016c141d5f02",
          type: "SectionBlock",
          props: {
            level: 3,
            title: "Mental Health Awareness",
            children: [
              {
                id: "1n7q1t20-1u8r-7231-w000-016c141d5f03",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-f1",
                      type: "text",
                      props: {
                        content:
                          "The game's design is intended to illustrate the effects of Burnout Syndrome, which is most commonly caused by severe and sequential periods of overwork."
                      }
                    }
                  ]
                }
              },
              {
                id: "2o8r2u31-2v9s-7232-x000-016c141d5f04",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-g1",
                      type: "text",
                      props: {
                        content:
                          "The reduction in score for gathering pickups with high Stress acts as a parallel to how the symptoms of burnout include a drop in performance and enjoyment of activities."
                      }
                    }
                  ]
                }
              },
              {
                id: "3p9s3v42-3w0t-7233-y000-016c141d5f05",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-h1",
                      type: "text",
                      props: {
                        content:
                          "The game's instructions and mechanics and purposefully kept vague as the design's objective is to cause a natural realisation on part of the player that the best strategy to accumulate points is to alternate between moments of action and moments of rest."
                      }
                    }
                  ]
                }
              },
              {
                id: "4q0t4w53-4x1u-7234-z000-016c141d5f06",
                type: "ParagraphBlock",
                props: {
                  text: [
                    {
                      id: "text-i1",
                      type: "text",
                      props: {
                        content:
                          "Akin to the preventative measures to the disease, continuous movement will exponentially slow down the ball and prevent point accumulation."
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
])
</script>

<template>
  <UPage>
    <UContainer>
      <RCSection :level="1" title="Blocks">
        <RCBlockRenderer :blocks="blocks" />
      </RCSection>
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
    <UPageSection> </UPageSection>

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
