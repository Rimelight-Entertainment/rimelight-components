<script setup lang="ts">
import type { CalloutBlockProps } from "../../../types";
import { tv } from "../../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../../composables";

/* region Props */
export interface CalloutBlockRendererProps extends CalloutBlockProps {
  rc?: {
    root?: string;
  };
}

const { variant, children, to, target, rc: rcProp } = defineProps<CalloutBlockRendererProps>();

const { rc } = useRC("CalloutBlockRenderer", rcProp);
/* endregion */

/* region Emits */
export interface CalloutBlockRendererEmits {}

const emit = defineEmits<CalloutBlockRendererEmits>();
/* endregion */

/* region Slots */
export interface CalloutBlockRendererSlots {}

const slots = defineSlots<CalloutBlockRendererSlots>();
/* endregion */

/* region Styles */
const calloutBlockRendererStyles = tv({
  slots: {
    root: "",
  },
});

const { root } = calloutBlockRendererStyles();
type CalloutBlockRendererVariants = VariantProps<typeof calloutBlockRendererStyles>;
/* endregion */

/* region State */
// const ref1 = ref(0)
//
// const computed1 = computed(() => {
//
// })
/* endregion */

/* region Meta */
defineOptions({
  name: "CalloutBlockRenderer",
});
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
  <div :class="root({ class: rc.root })">
    <RCCallout :variant="variant" :to="to" :target="target">
      <RCBlockViewRenderer :blocks="children" />
    </RCCallout>
  </div>
</template>

<style scoped></style>
