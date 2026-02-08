<script setup lang="ts">
import { ref, onMounted } from "vue"
import { MOCK_MOVIE_PAGE, MOCK_MOVIE_SURROUND } from "~/mocks/pages"
import { type PageSurround } from "rimelight-components/types";

const moviePage = ref(MOCK_MOVIE_PAGE)

/**
 * Mock Resolver for the Playground
 */
const pageResolver = async (id: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Logic to return mock data based on ID
  if (id === 'movie-1' || id === MOCK_MOVIE_PAGE.id) {
    return {
      title: MOCK_MOVIE_PAGE.title,
      icon: MOCK_MOVIE_PAGE.icon,
      slug: MOCK_MOVIE_PAGE.slug
    }
  }

  throw new Error(`Page with ID ${id} not found`)
}

const surround = ref<PageSurround | null>(null)
const surroundStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

// Simulate API Fetch Delay
onMounted(() => {
  setTimeout(() => {
    surround.value = MOCK_MOVIE_SURROUND
    surroundStatus.value = 'success'
  }, 2000)
})
</script>

<template>
  <RCPageRenderer
    v-model="moviePage"
    :resolve-page="pageResolver"
    use-surround
    :surround="surround"
    :surround-status="surroundStatus"
  />
</template>

<style scoped></style>
