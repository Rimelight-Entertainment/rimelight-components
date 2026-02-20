<script setup lang="ts">
import { normalizeUsername, RESTRICTED_SET } from "rimelight-components/auth";
import { z } from "zod";
import { reactive, ref, computed, useTemplateRef } from "vue";
import type { FormSubmitEvent, StepperItem } from "#ui/types";
import { useToast } from "@nuxt/ui/composables/useToast";
import { useAuth } from "../../composables/auth/useAuth";

const { signUp, isLoading } = useAuth();
const toast = useToast();
const { t } = useI18n();
const route = useRoute();

const step1Schema = z.object({
  username: z
    .string()
    .min(2, t("auth_username_length_error"))
    .max(24, t("auth_username_length_error"))
    .transform((val) => val.trim())
    .refine((val) => !/\s/.test(val), {
      message: t("auth_username_no_spaces"),
    })
    .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
      message: t("auth_username_format_error"),
    })
    .refine(
      (val) => {
        const normalizedInput = normalizeUsername(val);
        return !RESTRICTED_SET.has(normalizedInput);
      },
      {
        message: t("auth_username_restricted_error"),
      },
    ),
  firstName: z
    .string()
    .min(2, t("auth_firstname_length_error"))
    .max(24, t("auth_firstname_length_error")),
  lastName: z
    .string()
    .min(2, t("auth_lastname_length_error"))
    .max(24, t("auth_lastname_length_error")),
  email: z.string().email(t("auth_email_invalid")),
  emailConfirmation: z.string().max(0), // Honeypot
});

const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, t("auth_password_length_error"))
      .max(24, t("auth_password_length_error")),
    passwordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: t("auth_passwords_mismatch"),
      });
    }
  });

const step3Schema = z.object({
  terms: z.boolean().refine((val) => val, {
    message: t("auth_terms_required"),
  }),
  newsletter: z.boolean().optional(),
});

const schema = z.intersection(step1Schema, z.intersection(step2Schema, step3Schema));

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  emailConfirmation: "",
  password: "",
  passwordConfirmation: "",
  terms: false,
  newsletter: false,
});

const stepperControl = useTemplateRef<any>("stepper");
const currentStep = ref(0);

const step1Form = useTemplateRef<any>("step1Form");
const step2Form = useTemplateRef<any>("step2Form");
const step3Form = useTemplateRef<any>("step3Form");

const visibility = reactive({
  password: false,
  confirmation: false,
});

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: t("auth_password_req_length") },
    { regex: /\d/, text: t("auth_password_req_number") },
    { regex: /[a-z]/, text: t("auth_password_req_lowercase") },
    { regex: /[A-Z]/, text: t("auth_password_req_uppercase") },
    { regex: /[^\w\s]/, text: t("auth_password_req_special") },
  ];
  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => checkStrength(state.password ?? ""));
const score = computed(() => strength.value.filter((req) => req.met).length);

const strengthColor = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 2) return "error";
  if (score.value === 3) return "warning";
  return "success";
});

const stepperItems = computed<StepperItem[]>(() => [
  { slot: "identity" as const, title: t("auth_stepper_identity"), icon: "lucide:user-circle" },
  { slot: "security" as const, title: t("auth_stepper_security"), icon: "lucide:lock" },
  {
    slot: "preferences" as const,
    title: t("auth_stepper_preferences"),
    icon: "lucide:check-circle",
  },
]);

async function nextStep() {
  let isValid = false;
  const forms = [step1Form.value, step2Form.value, step3Form.value];
  const currentForm = forms[currentStep.value];

  if (currentForm) {
    isValid = await currentForm.validate();
  }

  if (isValid) {
    stepperControl.value?.next();
    currentStep.value++;
  } else {
    toast.add({
      color: "error",
      title: t("auth_validation_error_title"),
      description: t("auth_validation_error_description"),
    });
  }
}

function prevStep() {
  stepperControl.value?.prev();
  currentStep.value--;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const redirect = route.query.redirect as string | undefined;
  const { data, error } = await signUp(
    {
      name: event.data.username,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email,
      password: event.data.password,
    },
    redirect,
  );

  if (error) {
    toast.add({
      color: "error",
      title: t("auth_sign_up_failed_title"),
      description: error.message || t("auth_connection_error_description"),
    });
    return;
  }

  toast.add({
    color: "success",
    title: t("auth_account_creation_success_title"),
    description: t("auth_account_creation_success_description"),
  });
}
</script>

<template>
  <UStepper
    ref="stepper"
    :items="stepperItems"
    class="w-full"
    size="sm"
    :model-value="currentStep"
    linear
    disabled
  >
    <template #identity>
      <UForm
        ref="step1Form"
        :schema="step1Schema"
        :state="state"
        class="flex flex-col gap-md"
        @submit.prevent
      >
        <div class="flex flex-col gap-md">
          <UFormField :label="t('auth_email_label')" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              :placeholder="t('auth_email_placeholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="emailConfirmation"
            class="absolute h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <UInput v-model="state.emailConfirmation" type="email" autocomplete="off" />
          </UFormField>

          <UFormField :label="t('auth_username_label')" name="username" required>
            <UInput v-model="state.username" placeholder="Johndoe123" class="w-full" />
          </UFormField>

          <div class="flex flex-row gap-sm">
            <UFormField :label="t('auth_firstname_label')" name="firstName" required class="w-1/2">
              <UInput v-model="state.firstName" placeholder="John" />
            </UFormField>
            <UFormField :label="t('auth_lastname_label')" name="lastName" required class="w-1/2">
              <UInput v-model="state.lastName" placeholder="Doe" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-md">
            <UButton
              trailing-icon="lucide:arrow-right"
              @click="nextStep"
              :label="t('navigation_next')"
            />
          </div>
        </div>
      </UForm>
    </template>

    <template #security>
      <UForm
        ref="step2Form"
        :schema="step2Schema"
        :state="state"
        class="flex flex-col gap-md"
        @submit.prevent
      >
        <div class="flex flex-col gap-md">
          <UFormField :label="t('auth_password_label')" name="password" required>
            <div class="flex flex-col gap-sm">
              <UInput
                v-model="state.password"
                :type="visibility.password ? 'text' : 'password'"
                placeholder="••••••••••••••••"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="visibility.password ? 'lucide:eye-off' : 'lucide:eye'"
                    @click="visibility.password = !visibility.password"
                  />
                </template>
              </UInput>
              <UProgress :color="strengthColor" v-model="score" :max="4" size="sm" />
              <ul class="space-y-1">
                <li
                  v-for="(req, index) in strength"
                  :key="index"
                  class="flex items-center gap-xs text-xs"
                  :class="req.met ? 'text-success' : 'text-muted'"
                >
                  <UIcon
                    :name="req.met ? 'lucide:circle-check' : 'lucide:circle-x'"
                    class="size-4 shrink-0"
                  />
                  <span>{{ req.text }}</span>
                </li>
              </ul>
            </div>
          </UFormField>

          <UFormField
            :label="t('auth_password_confirmation_label')"
            name="passwordConfirmation"
            required
          >
            <UInput
              v-model="state.passwordConfirmation"
              :type="visibility.confirmation ? 'text' : 'password'"
              placeholder="••••••••••••••••"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="visibility.confirmation ? 'lucide:eye-off' : 'lucide:eye'"
                  @click="visibility.confirmation = !visibility.confirmation"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="flex justify-between gap-md">
            <UButton
              variant="outline"
              leading-icon="lucide:arrow-left"
              :label="t('navigation_previous')"
              @click="prevStep"
            />
            <UButton
              trailing-icon="lucide:arrow-right"
              @click="nextStep"
              :label="t('navigation_next')"
            />
          </div>
        </div>
      </UForm>
    </template>

    <template #preferences>
      <UForm
        ref="step3Form"
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="flex flex-col gap-md"
      >
        <div class="flex flex-col gap-md">
          <UFormField name="terms">
            <UCheckbox v-model="state.terms" required>
              <template #label>
                {{ t("auth_terms_agreement_signup") }}
                <ULink to="/documents/terms-of-service" class="font-medium text-primary">{{
                  t("auth_terms_link")
                }}</ULink
                >.
              </template>
            </UCheckbox>
          </UFormField>

          <UCheckbox
            v-model="state.newsletter"
            name="newsletter"
            :label="t('auth_newsletter_label')"
            :description="t('auth_newsletter_description')"
          />

          <div class="flex justify-between gap-md">
            <UButton
              variant="outline"
              leading-icon="lucide:arrow-left"
              :label="t('navigation_previous')"
              @click="prevStep"
            />
            <UButton
              type="submit"
              :label="t('auth_sign_up_button')"
              trailing-icon="lucide:check"
              :loading="isLoading"
            />
          </div>
        </div>
      </UForm>
    </template>
  </UStepper>
</template>
