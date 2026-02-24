<script setup lang="ts">
import { useAttrs, computed } from "vue";
import { useAppConfig, useNuxtApp } from "#imports";
import { tv } from "../../internal/tv";
import { type VariantProps } from "tailwind-variants";
import { useRC } from "../../composables";

/* region Props */
export type LogoVariant = "mark" | "type" | "classic" | "symbol" | string;

export interface LogoProps {
  /**
   * The variant of the logo to display.
   * @defaultValue "mark"
   */
  variant?: LogoVariant;
  /**
   * Override the color mode.
   */
  mode?: "light" | "dark";
  /**
   * The URL to link to.
   * @defaultValue "/"
   */
  to?: string;
  /**
   * Options for the RC design system.
   */
  rc?: {
    root?: string;
  };
  /**
   * The alt text for the logo image.
   */
  alt?: string;
}

const { variant = "mark", to = "/", mode, rc: rcProp, alt } = defineProps<LogoProps>();

const { rc } = useRC("Logo", rcProp);
/* endregion */

/* region Emits */
export interface LogoEmits {}

const emit = defineEmits<LogoEmits>();
/* endregion */

/* region Slots */
export interface LogoSlots {
  default: (props: {}) => any;
}

const slots = defineSlots<LogoSlots>();
/* endregion */

/* region Styles */
const logoStyles = tv({
  slots: {
    root: "flex items-center justify-center transition-opacity hover:opacity-80 shrink-0 select-none overflow-hidden",
  },
});

const { root } = logoStyles();
type LogoVariants = VariantProps<typeof logoStyles>;
/* endregion */

const attrs = useAttrs();
const colorMode = useColorMode();
const appConfig = useAppConfig();

const activeMode = computed(() => mode || colorMode.value || "dark");

const logoSrc = computed<string | null>(() => {
  const rcLogos = appConfig.rimelightComponents?.logos;
  let src: any = null;

  if (rcLogos && typeof rcLogos === "object") {
    src = (rcLogos as any)[variant];
    if (src && typeof src === "object") {
      src = src[activeMode.value] || src.light || src.dark;
    }
  }

  if (src && typeof src === "string" && src) return src;

  // Fallback to legacy top-level properties or rimelightComponents scoped legacy
  const legacy = appConfig.rimelightComponents as any;
  if (variant === "mark")
    return (appConfig.logomark as string) || (legacy?.logomark as string) || null;
  if (variant === "type")
    return (appConfig.logotype as string) || (legacy?.logotype as string) || null;

  return (appConfig[variant] as string) || null;
});

const isIcon = computed(() => {
  const src = logoSrc.value;
  if (!src) return false;
  if (src.startsWith("http") || src.startsWith("/") || src.startsWith(".")) return false;
  return src.includes(":") || src.startsWith("i-");
});
/* endregion */

/* region Meta */
defineOptions({
  name: "Logo",
  inheritAttrs: false,
});
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <NuxtLink
    v-bind="attrs"
    :to="to"
    :class="root({ class: [rc.root, attrs.class as string] })"
    :aria-label="alt || variant"
  >
    <template v-if="logoSrc">
      <!-- Using mode='svg' ensures the icon has an intrinsic aspect ratio, allowing w-auto to work -->
      <UIcon v-if="isIcon" :name="logoSrc" mode="svg" class="size-full block shrink-0" />
      <NuxtImg
        v-else
        :src="logoSrc"
        :alt="alt"
        class="size-full block object-contain shrink-0"
      />
    </template>
    <slot v-else />
  </NuxtLink>
</template>

<style scoped></style>
