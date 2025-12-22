<script setup lang="ts">
import { ref } from "vue"
import { MOCK_MOVIE_PAGE, MOCK_MOVIE_SURROUND } from "../mocks/pages"

const moviePage = ref(MOCK_MOVIE_PAGE)

const surround = ref<PageSurround | null>(null)
const surroundStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

// Simulate API Fetch Delay
onMounted(() => {
  setTimeout(() => {
    surround.value = MOCK_MOVIE_SURROUND
    surroundStatus.value = 'success'
  }, 2000)
})

const isSaving = ref(false)
const onSave = (page: Page) => {
  isSaving.value = true
  console.log('Saving page:', page)
  setTimeout(() => {
    isSaving.value = false
    alert('Page saved! (Check console for data)')
  }, 2000)
}
</script>

<template>
  <RCPageEditor v-model="moviePage" :is-saving="isSaving" @save="onSave" />
</template>
