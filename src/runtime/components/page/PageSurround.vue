<script setup lang="ts">
import { tv } from "tailwind-variants"
import { useI18n } from "vue-i18n"


export interface PageSurroundProps {
  pageType: string
  previousTitle?: string
  previousDescription?: string
  previousTo?: string
  nextTitle?: string
  nextDescription?: string
  nextTo?: string
}

const {
  pageType,
  previousTitle,
  previousDescription,
  previousTo,
  nextTitle,
  nextDescription,
  nextTo
} = defineProps<PageSurroundProps>()

export interface PageSurroundEmits {}

const emit = defineEmits<PageSurroundEmits>()

const pageSurroundStyles = tv({
  slots: {
    grid: "grid grid-cols-1 gap-8 sm:grid-cols-2",
    card: "group block h-full bg-transparent hover:bg-elevated/50 focus-visible:outline-primary",
    cardContent: "flex flex-col gap-md",
    cardContentEnd: "items-end",
    headingGroup: "flex flex-col gap-xs",
    headingGroupEnd: "items-end",
    button: "w-fit text-md rounded-full text-primary group-hover:text-highlighted",
    typeLabel: "text-muted",
    infoGroup: "flex flex-col gap-sm",
    infoGroupEnd: "items-end gap-xs",
    title: "text-primary text-sm group-hover:text-highlighted",
    titleEnd: "text-right",
    description: "text-toned text-xs",
    descriptionEnd: "text-right"
  }
})

const {
  grid,
  card,
  cardContent,
  cardContentEnd,
  headingGroup,
  headingGroupEnd,
  button,
  typeLabel,
  infoGroup,
  infoGroupEnd,
  title: titleClass,
  titleEnd,
  description: descriptionClass,
  descriptionEnd
} = pageSurroundStyles()

const { t } = useI18n()

</script>

<template>
  <div :class="grid()">
    <div>
      <ULink v-if="previousTitle" :to="previousTo" class="h-full">
        <UCard variant="soft" :class="card()">
          <div :class="cardContent()">
            <div :class="headingGroup()">
              <UButton
                variant="outline"
                icon="lucide:arrow-left"
                :class="button()"
              />
              <span :class="typeLabel()">
                {{ t("navigation_previous") }}
                {{ t(pageType) }}
              </span>
            </div>
            <div :class="infoGroup()">
              <p :class="titleClass()">
                {{ previousTitle }}
              </p>
              <p :class="descriptionClass()">
                {{ previousDescription }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
    <div>
      <ULink v-if="nextTitle" :to="nextTo" class="h-full">
        <UCard variant="soft" :class="card()">
          <div :class="[cardContent(), cardContentEnd()]">
            <div :class="[headingGroup(), headingGroupEnd()]">
              <UButton
                variant="outline"
                icon="lucide:arrow-right"
                :class="button()"
              />
              <span :class="typeLabel()">
                {{ t("navigation_next") }}
                {{ t(pageType) }}</span
              >
            </div>
            <div :class="[infoGroup(), infoGroupEnd()]">
              <p :class="[titleClass(), titleEnd()]">
                {{ nextTitle }}
              </p>
              <p :class="[descriptionClass(), descriptionEnd()]">
                {{ nextDescription }}
              </p>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
  </div>
</template>
