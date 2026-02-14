<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue"
import { MOCK_PAGES_LIST, MOCK_MOVIE_SURROUND } from "../../mocks/pages"
import { type Page, type PageSurround } from "../../../../types";

const route = useRoute()
const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})

const moviePage = ref<Page | null>(null)

const surround = ref<PageSurround | null>(null)
const surroundStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

const loadPage = () => {
  const found = MOCK_PAGES_LIST.find(p => p.slug === slug.value)
  if (found) {
    moviePage.value = found

    // Simulate API Fetch Delay for surround
    surroundStatus.value = 'pending'
    setTimeout(() => {
      // For simplicity in the mock, we just use the same surround for Matrix movies
      surround.value = MOCK_MOVIE_SURROUND
      surroundStatus.value = 'success'
    }, 1000)
  } else {
    moviePage.value = null
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

/**
 * Mock Resolver for the Playground
 */
const pageResolver = async (id: string) => {
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
</script>

<template>
  <div v-if="moviePage">
    <RCPageRenderer
      v-model="moviePage"
      :resolve-page="pageResolver"
      use-surround
      :surround="surround"
      :surround-status="surroundStatus"
      :can-edit="true"
      :edit-url="`/${slug}/edit`"
    />
  </div>
  <div v-else class="flex items-center justify-center min-h-[50vh]">
    <UError
      title="Page Not Found"
      description="The requested showcase page could not be found in the mock database."
    />
  </div>
</template>
