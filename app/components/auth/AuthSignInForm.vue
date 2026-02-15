<script setup lang="ts">
import { z } from "zod"
import { reactive, ref } from "vue"
import type { FormSubmitEvent } from "#ui/types"
import { useAuth } from "../../composables/auth/useAuth"

const { signIn, isLoading } = useAuth()
const { t } = useI18n()

const schema = z.object({
  email: z.string().email(t("auth_email_invalid")),
  password: z.string().min(8, t("auth_password_min_length")),
  rememberMe: z.boolean()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
  rememberMe: true
})

const showPassword = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await signIn({
    email: event.data.email as string,
    password: event.data.password as string,
    rememberMe: event.data.rememberMe
  })
}
</script>

<template>
  <div class="w-full flex flex-col gap-lg max-w-md">
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col gap-md">
      <UFormField
        :label="t('auth_email_label')"
        name="email"
        :description="t('auth_email_description')"
        required
        class="text-black"
      >
        <UInput
          v-model="state.email"
          type="email"
          :placeholder="t('auth_email_placeholder')"
          class="w-full"
        >
          <template v-if="state.email?.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="lucide:circle-x"
              aria-label="Clear input"
              @click="state.email = ''"
            />
          </template>
        </UInput>
        <template #help>
          <slot name="email-help">
            <ULink to="/auth/recovery">{{ t('auth_sign-in_email_help') }}</ULink>
          </slot>
        </template>
      </UFormField>
      <UFormField
        :label="t('auth_password_label')"
        name="password"
        :description="t('auth_password_description')"
        required
      >
        <div class="flex flex-col gap-sm">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••••••••••"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                :aria-label="
                  showPassword ? 'Hide password' : 'Show password'
                "
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </div>
        <template #help>
          <slot name="password-help">
            <ULink
              to="/auth/recovery"
              >{{ t('auth_sign-in_password_help') }}</ULink
            >
          </slot>
        </template>
      </UFormField>
      <UCheckbox v-model="state.rememberMe" name="rememberMe" :label="t('auth_remember_me')" />
      <UButton
        color="primary"
        variant="solid"
        type="submit"
        :label="t('auth_sign_in_button')"
        block
        :loading="isLoading"
        :disabled="isLoading"
      />
    </UForm>
    <slot name="footer">
      <span class="text-center text-sm text-black"
        >{{ t("auth_terms_agreement") }}
        <ULink
          to="/documents/terms-of-service"
          class="font-medium text-primary hover:text-dimmed"
          >{{ t("auth_terms_link") }}</ULink
        >.</span
      >
    </slot>
  </div>
</template>
