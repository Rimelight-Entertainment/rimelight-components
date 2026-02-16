<script setup lang="ts">
import { MOCK_PAGES_LIST, MOCK_MOVIE_SURROUND } from "../../mocks/pages"
import { type Page, type PageSurround } from "rimelight-components/types"

const route = useRoute()
const { locale } = useI18n()
const appConfig = useAppConfig()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})

const page = ref<Page | null>(null)
const pageStatus = ref<'pending' | 'success' | 'error'>('pending')
const pageError = ref<any>(null)

const surround = ref<PageSurround | null>(null)
const surroundStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

const loadPage = async () => {
  pageStatus.value = 'pending'
  pageError.value = null

  // Simulate API Delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const found = MOCK_PAGES_LIST.find(p => p.slug === slug.value)
  if (found) {
    page.value = found
    pageStatus.value = 'success'

    // Simulate API Fetch Delay for surround
    surroundStatus.value = 'pending'
    setTimeout(() => {
      surround.value = MOCK_MOVIE_SURROUND
      surroundStatus.value = 'success'
    }, 1000)
  } else {
    page.value = null
    pageStatus.value = 'success' // Still success but with null page (handled in template)
  }
}

onMounted(() => {
  loadPage()

  // Register Wiki Quick Actions
  useQuickActions().registerAction({
    id: "create-page",
    label: "Create Page",
    icon: "lucide:plus",
    onSelect: () => {
      if (typeof window !== "undefined") {
        ;(window as any).triggerCreatePageModal?.()
      }
    }
  })
})

watch(slug, loadPage)

onUnmounted(() => {
  useQuickActions().unregisterAction("create-page")
})

const resolvePage = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const found = MOCK_PAGES_LIST.find(p => p.id === id)
  if (found) {
    return {
      title: found.title,
      icon: found.icon,
      slug: found.slug
    }
  }
  throw new Error(`Page with ID ${id} not found`)
}

useHead({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title
})

useSeoMeta({
  title: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  ogTitle: () => getLocalizedContent(page.value?.title, locale) ?? appConfig.title,
  description: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description,
  ogDescription: () => getLocalizedContent(page.value?.description, locale) ?? appConfig.description
})
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

  <RCPageRenderer
    v-else
    v-model="page"
    :resolve-page="resolvePage"
    use-surround
    :surround="surround"
    :surround-status="surroundStatus"
    :can-edit="true"
    :edit-url="`/${slug}/edit`"
  />
</template>

