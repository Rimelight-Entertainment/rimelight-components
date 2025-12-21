<script setup lang="ts">
import { ref } from 'vue'
import { type Page } from "../../../src/runtime/types"

const moviePage = ref<Page>({
  id: 'movie-1',
  type: 'Movie',
  slug: 'the-matrix',
  title: { en: 'The Matrix' },
  description: { en: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
  tags: [{ en: 'SCI-FI' }, { en: 'Action' }],
  image: { src: 'https://placehold.co/600x400', alt: 'The Matrix' },
  blocks: [
    {
      id: '1',
      type: 'SectionBlock',
      props: { level: 2, title: 'Plot Summary', children: [] }
    },
    {
      id: '2',
      type: 'SectionBlock',
      props: { level: 2, title: 'Box Office', children: [] }
    },
    {
      id: '3',
      type: 'SectionBlock',
      props: { level: 2, title: 'Reception', children: [] }
    },
    {
      id: '4',
      type: 'SectionBlock',
      props: { level: 2, title: 'Trivia', children: [] }
    },
    {
      id: '5',
      type: 'SectionBlock',
      props: { level: 2, title: 'References', children: [] }
    }
  ],
  properties: {
    info: {
      label: { en: 'Movie Information' },
      defaultOpen: true,
      fields: {
        director: { value: { en: 'The Wachowskis' }, label: { en: 'Director'}, type: 'text' },
        releaseYear: { value: 1999, label: { en: 'Release Year' }, type: 'number' },
        genre: { value: { en: 'Sci-Fi' }, label: { en: 'Genre'}, type: 'text' },
        cast: { value: [{ en: 'Keanu Reeves' }, { en: 'Laurence Fishburne' }, { en: 'Carrie-Anne Moss' }], label: { en: 'Cast' }, type: 'text-array' }
      },
    },
    production: {
      label: { en: 'Production & Distribution' },
      defaultOpen: false,
      fields: {
        studio: {
          value: { en: 'Warner Bros.'},
          label: { en: 'Lead Studio'},
          type: 'text'
        },
        budget: {
          value: 63000000,
          label: { en: 'Budget (USD)' },
          type: 'number'
        },
        status: {
          value: 'Released',
          label: { en: 'Current Status'},
          type: 'enum',
          options: ['Pre-Production', 'Filming', 'Post-Production', 'Released']
        },
        locations: {
          value: [{ en: 'Sydney, Australia' }, { en: 'San Francisco, USA' }],
          label: { en: 'Filming Locations' },
          type: 'text-array'
        }
      }
    }
  },
  created_at: new Date(),
  posted_at: new Date(),
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
  <RCPageRenderer v-model="moviePage" class="mt-24"/>
  <RCPageEditor
    v-model="moviePage"
    :is-saving="isSaving"
    @save="onSave"
  />
</template>
