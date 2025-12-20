<script setup lang="ts">
import { ref } from 'vue'
import { type Page } from "../../../src/runtime/types"

const moviePage = ref<Page>({
  id: 'movie-1',
  type: 'Movie',
  slug: 'the-matrix',
  title: { en: 'The Matrix' },
  description: { en: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
  image: { src: 'https://placehold.co/600x400', alt: 'The Matrix' },
  blocks: [
    {
      id: '1',
      type: 'SectionBlock',
      props: { level: 2, title: 'Plot Summary', children: [] }
    }
  ],
  properties: {
    info: {
      label: { en: 'Movie Information' },
      fields: {
        director: { value: { en: 'The Wachowskis' }, label: 'Director', type: 'text' },
        releaseYear: { value: 1999, label: 'Release Year', type: 'number' },
        genre: { value: { en: 'Sci-Fi' }, label: 'Genre', type: 'text' },
        cast: { value: [{ en: 'Keanu Reeves' }, { en: 'Laurence Fishburne' }, { en: 'Carrie-Anne Moss' }], label: 'Cast', type: 'text-array' }
      }
    }
  },
  created_at: new Date(),
  updated_at: new Date()
})

const isSaving = ref(false)
const onSave = (page: Page) => {
  isSaving.value = true
  console.log('Saving page:', page)
  setTimeout(() => {
    isSaving.value = false
    alert('Page saved! (Check console for data)')
  }, 1000)
}
</script>

<template>
  <RCPageEditor
    v-model="moviePage"
    :is-saving="isSaving"
    @save="onSave"
  />
</template>
