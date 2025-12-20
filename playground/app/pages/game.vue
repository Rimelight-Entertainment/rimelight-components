<script setup lang="ts">
import { ref } from "vue"
import { type Page } from "../../../src/runtime/types"

const gamePage = ref<Page>({
  id: 'game-1',
  type: 'Game',
  slug: 'elden-ring',
  title: { en: 'Elden Ring' },
  description: { en: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.' },
  image: { src: 'https://placehold.co/600x400', alt: 'Elden Ring' },
  blocks: [
    {
      id: '2',
      type: 'SectionBlock',
      props: { level: 2, title: 'Gameplay', children: [] }
    }
  ],
  properties: {
    info: {
      label: { en: 'Game Information' },
      fields: {
        developer: { value: { en: 'FromSoftware' }, label: 'Developer', type: 'text' },
        platforms: { value: [{ en: 'PC' }, { en: 'XBOX' }], label: 'Platforms', type: 'text-array' },
        rating: { value: 9.5, label: 'Rating', type: 'number' }
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
    v-model="gamePage"
    :is-saving="isSaving"
    @save="onSave"
  />
</template>

<style scoped>

</style>