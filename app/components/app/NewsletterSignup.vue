<script setup lang="ts">
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../composables";

/* region Props */
export interface NewsletterSignupProps {
  fieldLabel?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  rc?: {
    group?: string;
  };
}

const {
  fieldLabel = "Subscribe to our Newsletter",
  description = "Stay updated on new posts and updates. Unsubscribe at any time.",
  placeholder = "email@domain.com",
  buttonLabel = "Subscribe",
  rc: rcProp,
} = defineProps<NewsletterSignupProps>();

const { rc } = useRC("NewsletterSignup", rcProp);
/* endregion */

/* region Emits */
export interface NewsletterSignupEmits {
  // change: [id: number]
  // update: [value: string]
}

const emit = defineEmits<NewsletterSignupEmits>();
/* endregion */

/* region Slots */
export interface NewsletterSignupSlots {
  // default: (props: {}) => any
}

const slots = defineSlots<NewsletterSignupSlots>();
/* endregion */

/* region Styles */
const newsletterSignupStyles = tv({
  slots: {
    group: "pt-2",
  },
});

const { group } = newsletterSignupStyles();
type NewsletterSignupVariants = VariantProps<typeof newsletterSignupStyles>;
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
  name: "NewsletterSignup",
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
  <UForm>
    <UFormField name="email" :label="fieldLabel" :description="description">
      <UFieldGroup :class="group({ class: rc.group })">
        <UInput type="email" :placeholder="placeholder" />
        <UButton type="submit" :label="buttonLabel" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>

<style scoped></style>
