<script setup lang="ts">
import type { Block } from "../../../src/runtime/types"

// Mock blocks for showcase purposes.
const blocks = ref<Block[]>([
  {
    id: "8a4d8g97-8sdh5e-7224-j000-016c141d5ef0",
    type: "SectionBlock",
    props: {
      level: 1,
      title: "Section 1",
      description: "Section 1 Description",
      children: [
        {
          id: "8a4d8g97-8h5e-7224-j000-016c141d5ef0",
          type: "TestBlock",
          props: {
            text: "Test Block 1"
          }
        },
        {
          id: "1d7g1j20-1k8h-7227-m000-016c141d5ef3",
          type: "TestBlock",
          props: {
            text: "Test Block 2"
          }
        },
        {
          id: "1d7g1j20-1k8h-7227-m001-016c141d5ef3",
          type: "TestBlock",
          props: {
            text: "Test Block 3"
          }
        },
        {
          id: "1d7g1j20-1k8h-7227-m023-016c141d5ef3",
          type: "TestBlock",
          props: {
            text: "Test Block 4"
          }
        }
      ]
    }
  }
])
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="grid grid-cols-2 gap-xl">
        <RCBlockEditor v-model="blocks" class="col-span-1 w-full" />
        <RCBlockViewRenderer :blocks="blocks" class="col-span-1 w-full" />
      </div>
    </UPageSection>
  </UPage>
</template>

<style scoped></style>
