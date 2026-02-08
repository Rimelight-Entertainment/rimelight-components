<script setup lang="ts">
import { ref, onMounted } from "vue"
import { PAGE_MAP } from "~/types"
import { MOCK_MOVIE_PAGE, MOCK_MOVIE_SURROUND, MOCK_PAGES_LIST, MOCK_VERSIONS } from "~/mocks/pages"
import { type Page, type PageSurround, type PageVersion } from "rimelight-components/types";

const moviePage = ref(MOCK_MOVIE_PAGE)

// Surround state
const surround = ref<PageSurround | null>(null)
const surroundStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

// Versioning state
const currentVersionId = ref<string | null>(null)
const isViewingVersion = ref(false)

// Simulate API Fetch Delay for surround
onMounted(() => {
  setTimeout(() => {
    surround.value = MOCK_MOVIE_SURROUND
    surroundStatus.value = 'success'
  }, 2000)
})

const isSaving = ref(false)
const handleSave = (page: Page) => {
  isSaving.value = true
  console.log('Saving page:', page)
  setTimeout(() => {
    isSaving.value = true // Keep it "saving" for a bit to see the spinner
    setTimeout(() => {
      isSaving.value = false
      alert('Page saved! (Check console for data)')
    }, 1000)
  }, 1000)
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
  
  // Update the page model to show version content
  moviePage.value = {
    ...moviePage.value,
    title: version.title,
    blocks: version.content.blocks,
    properties: {
      ...moviePage.value.properties,
      ...version.content.properties
    }
  }
}
</script>

<template>
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
    :on-navigate-to-page="(slug: string) => console.log('NAVIGATE TO:', slug)"
    @save="handleSave"
    @version-navigate="handleVersionNavigate"
  />
</template>
