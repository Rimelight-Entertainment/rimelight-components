<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { PAGE_MAP } from "~/types"
import { MOCK_PAGES_LIST, MOCK_MOVIE_SURROUND, MOCK_VERSIONS } from "~/mocks/pages"
import { type Page, type PageSurround, type PageVersion } from "rimelight-components/types";

const route = useRoute()
const slug = computed(() => {
  // slug is the array before the last path segment if we consider /slug/edit
  // but if it's [...slug]/edit.vue, the slug param is just the slug
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s
})

const moviePage = ref<Page | null>(null)

// Surround state
const surround = ref<PageSurround | null>(null)
const surroundStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

// Versioning state
const currentVersionId = ref<string | null>(null)
const isViewingVersion = ref(false)

const loadPage = () => {
  const found = MOCK_PAGES_LIST.find(p => p.slug === slug.value)
  if (found) {
    moviePage.value = JSON.parse(JSON.stringify(found)) // Clone to avoid direct mutation of mock
    
    // Reset state
    currentVersionId.value = null
    isViewingVersion.value = false
    
    // Simulate API Fetch Delay for surround
    surroundStatus.value = 'pending'
    setTimeout(() => {
      surround.value = MOCK_MOVIE_SURROUND
      surroundStatus.value = 'success'
    }, 1000)
  } else {
    moviePage.value = null
  }
}

onMounted(loadPage)
watch(slug, loadPage)

const isSaving = ref(false)
const handleSave = (page: Page) => {
  isSaving.value = true
  console.log('Saving page:', page)
  setTimeout(() => {
    isSaving.value = false
    alert('Page saved! (Check console for data)')
  }, 1500)
}

/**
 * Mock Tree Fetcher
 */
const handleFetchPages = async () => {
  console.log('Fetching pages for tree...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return MOCK_PAGES_LIST.map(p => ({ title: p.title, slug: p.slug }))
}

/**
 * Mock Page Creator
 */
const handleCreatePage = async (pageData: Partial<Page>) => {
  console.log('Creating page:', pageData)
  await new Promise(resolve => setTimeout(resolve, 1500))
  alert(`Page created: ${JSON.stringify(pageData.title)}`)
}

/**
 * Mock Page Deleter
 */
const handleDeletePage = async (id: string) => {
  console.log('Deleting page:', id)
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert(`Page ${id} deleted!`)
}

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

/**
 * Mock Version Navigation
 */
const handleVersionNavigate = (version: PageVersion) => {
  console.log('Navigating to version:', version)
  isViewingVersion.value = true
  currentVersionId.value = version.id
  
  if (moviePage.value) {
    moviePage.value = {
      ...moviePage.value,
      title: version.title,
      blocks: version.content.blocks,
      properties: {
        ...moviePage.value.properties,
        ...version.content.properties
      }
    } as any
  }
}
</script>

<template>
  <div v-if="moviePage">
    <RCPageEditor
      v-model="moviePage"
      v-model:current-version-id="currentVersionId"
      :page-definitions="PAGE_MAP"
      :resolve-page="pageResolver"
      :is-saving="isSaving"
      :is-viewing-version="isViewingVersion"
      :is-admin="true"
      :use-surround="true"
      :surround="surround"
      :surround-status="surroundStatus"
      :on-fetch-pages="handleFetchPages"
      :on-create-page="handleCreatePage"
      :on-delete-page="handleDeletePage"
      :on-navigate-to-page="(slug: string) => navigateTo(`/${slug}/edit`)"
      @save="handleSave"
      @version-navigate="handleVersionNavigate"
    />
  </div>
  <div v-else class="flex items-center justify-center min-h-[50vh]">
    <UError
      title="Editor: Page Not Found"
      description="The requested showcase page could not be found to edit."
    />
  </div>
</template>
