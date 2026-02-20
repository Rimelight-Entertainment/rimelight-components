<script setup lang="ts">
import { PAGE_MAP } from "../../types/page-definitions";
import { MOCK_PAGES_LIST, MOCK_MOVIE_SURROUND } from "../../mocks/pages";
import { type Page, type PageSurround, type PageVersion } from "rimelight-components/types";
import { convertVersionToPage } from "rimelight-components/utils";

const route = useRoute();
const { t, locale } = useI18n();
const appConfig = useAppConfig();

const slug = computed(() => {
  const s = route.params.slug;
  if (Array.isArray(s)) return s.join("/");
  return s;
});

const page = ref<Page | null>(null);
const pageStatus = ref<"pending" | "success" | "error">("pending");
const pageError = ref<any>(null);

// Surround state
const surround = ref<PageSurround | null>(null);
const surroundStatus = ref<"idle" | "pending" | "success" | "error">("idle");

// Versioning state
const currentVersionId = ref<string | null>(null);
const isViewingVersion = ref(false);

const loadPage = async () => {
  pageStatus.value = "pending";
  pageError.value = null;

  // Simulate API Delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const found = MOCK_PAGES_LIST.find((p) => p.slug === slug.value);
  if (found) {
    page.value = JSON.parse(JSON.stringify(found)); // Clone to avoid direct mutation of mock

    // Reset state
    currentVersionId.value = null;
    isViewingVersion.value = false;
    pageStatus.value = "success";

    // Simulate API Fetch Delay for surround
    surroundStatus.value = "pending";
    setTimeout(async () => {
      surround.value = MOCK_MOVIE_SURROUND;
      surroundStatus.value = "success";

      await nextTick();
      if (editorRef.value) {
        editorRef.value.resetHistory();
      }
    }, 1000);
  } else {
    page.value = null;
    pageStatus.value = "success";
  }
};

onMounted(loadPage);
watch(slug, loadPage);

const isSaving = ref(false);
const editorRef = ref<any>(null);

const handleSave = (updatedPage: Page) => {
  isSaving.value = true;
  console.log("Saving page:", updatedPage);
  setTimeout(() => {
    isSaving.value = false;
    if (editorRef.value) {
      editorRef.value.resetHistory();
    }
    // toast.add({ color: 'success', title: 'Page saved! (Mock)' })
  }, 1500);
};

const handleFetchPages = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return MOCK_PAGES_LIST.map((p) => ({ title: p.title, slug: p.slug }));
};

const handleCreatePage = async (pageData: Partial<Page>) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("Created page:", pageData);
};

const handleDeletePage = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Deleted page:", id);
};

const resolvePage = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const found = MOCK_PAGES_LIST.find((p) => p.id === id);
  if (found) {
    return {
      title: found.title,
      icon: found.icon,
      slug: found.slug,
    };
  }
  throw new Error(`Page with ID ${id} not found`);
};

const handleVersionNavigate = (version: PageVersion) => {
  isViewingVersion.value = true;
  currentVersionId.value = version.id;
  page.value = convertVersionToPage(version);
};

useHead({
  title: () => `Edit (Mock): ${getLocalizedContent(page.value?.title, locale) ?? appConfig.title}`,
});
</script>

<template>
  <USkeleton v-if="pageStatus === 'pending'" class="h-full w-full" />

  <LazyUError
    v-else-if="pageError || !page"
    :clear="{ label: 'Return Home' }"
    :error="{
      status: 404,
      statusText: 'Page Not Found',
      message: 'The requested page could not be located.',
    }"
    redirect="/"
  />

  <template v-else-if="page && page.id">
    <RCPageEditor
      ref="editorRef"
      v-model="page"
      v-model:current-version-id="currentVersionId"
      :page-definitions="PAGE_MAP"
      :resolve-page="resolvePage"
      :is-saving="isSaving"
      :is-viewing-version="isViewingVersion"
      :is-admin="true"
      :use-surround="true"
      :surround="surround"
      :surround-status="surroundStatus"
      :on-fetch-pages="handleFetchPages"
      :on-delete-page="handleDeletePage"
      :on-navigate-to-page="(slug: string) => navigateTo(`/${slug}/edit`)"
      @save="handleSave"
      @version-navigate="handleVersionNavigate"
    />
  </template>
</template>

<style scoped></style>
