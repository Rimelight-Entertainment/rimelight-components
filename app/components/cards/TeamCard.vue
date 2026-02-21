<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../composables";

/* region Props */
export interface TeamCardProps {
  src: string;
  alt: string;
  name: string;
  role: string;
  description: string;
  rc?: {
    details?: string;
    name?: string;
    role?: string;
    description?: string;
    links?: string;
  };
}

const { src, alt, name, role, description, rc: rcProp } = defineProps<TeamCardProps>();

const { rc } = useRC("TeamCard", rcProp);
/*endregion */

/* region Emits */
export interface TeamCardEmits {}

const emit = defineEmits<TeamCardEmits>();
/* endregion */

/* region Slots */
export interface TeamCardSlots {
  links: (props: {}) => any;
}

const slots = defineSlots<TeamCardSlots>();
/* endregion */

/* region Styles */
const teamCardStyles = tv({
  slots: {
    details: "flex flex-col gap-xs",
    nameClass: "text-xl font-bold",
    roleClass: "text-sm",
    descriptionClass: "text-md",
    linksClass: "flex flex-row gap-md",
  },
});

const { details, nameClass, roleClass, descriptionClass, linksClass } = teamCardStyles();
type TeamCardVariants = VariantProps<typeof teamCardStyles>;
/* endregion */

/* region Meta */
defineOptions({
  name: "TeamCard",
});
/* endregion */

/* region State */
// const ref1 = ref(0)
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Lifecycle */
// onMounted(() => {
//
// })
//
// watch(() => { }, (newValue, oldValue) => {
//
// })
//
// onUnmounted(() => {
//
// })
/* endregion */

/* region Logic */

/* endregion */
</script>

<template>
  <UCard>
    <RCImage :src="src" :alt="alt" />
    <div :class="details({ class: rc.details })">
      <h3 :class="nameClass({ class: rc.name })">
        {{ name }}
      </h3>
      <span :class="roleClass({ class: rc.role })">{{ role }}</span>
    </div>
    <p :class="descriptionClass({ class: rc.description })">
      {{ description }}
    </p>
    <template #footer>
      <div :class="linksClass({ class: rc.links })">
        <slot name="links" />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
