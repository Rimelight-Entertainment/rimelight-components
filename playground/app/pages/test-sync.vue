<script setup lang="ts">
import { syncPageWithDefinition } from "../../../src/runtime/utils/page"
import { HERO_DEFINITION } from "../types/page-definitions"
import type { Page } from "../../../src/runtime/types"

// 1. Create a "Broken" Page Object
const brokenHero = {
  id: 'test-hero',
  slug: 'test-hero',
  type: 'Hero' as const,
  title: { en: 'Broken Hero' },
  updatedAt: '2023-01-01T00:00:00Z',
  // PROPERTIES MISMATCHES:
  properties: {
    // 1.1 Combat group has a stale field 'legacyField' and is missing 'difficulty'
    // Also fields are out of definition order
    combat: {
      label: { en: "Combat Stats" },
      fields: {
        primaryRole: { value: 'Tank', label: 'Primary Role', type: 'enum' as const, options: ['Tank', 'DPS', 'Support'] },
        class: { value: 'Warrior', label: 'Class', type: 'enum' as const, options: ['Warrior', 'Mage', 'Rogue', 'Paladin'] },
        legacyField: { value: 'Stale', label: 'Legacy', type: 'text' as const }
      }
    },
    // 1.2 Has a completely stale group 'legacyGroup'
    legacyGroup: {
      label: { en: "Legacy Group" },
      fields: {
        someField: { value: 'Old data', label: 'Old', type: 'text' as const }
      }
    }
    // 1.3 Missing 'progression' group entirely
  },
  // BLOCKS MISMATCHES:
  blocks: [
    // 2.1 Missing 'playstyle' templated block
    // 2.2 Out of order: 'lore' appears first
    { id: "lore", type: "SectionBlock", props: { level: 2, title: "Background Lore", children: [] }, isTemplated: true },
    // 2.3 User-added block: SHOULD BE PRESERVED
    { id: "user-block-1", type: "ParagraphBlock", props: { text: [{ type: 'text', props: { content: 'User content' } }] } },
    // 2.4 Stale templated block: SHOULD BE REMOVED
    { id: "deprecated-block", type: "SectionBlock", props: { level: 2, title: "Old Stats", children: [] }, isTemplated: true }
  ]
} as any

// 2. Run the sync
const syncedHero = ref<Page>(JSON.parse(JSON.stringify(brokenHero)))

function performSync() {
  syncedHero.value = syncPageWithDefinition(JSON.parse(JSON.stringify(syncedHero.value)), HERO_DEFINITION)
}
</script>

<template>
  <UContainer class="py-10 space-y-10">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Sync Logic Test (Hero Type)</h1>
      <UButton color="primary" @click="performSync">Run syncPageWithDefinition</UButton>
    </div>

    <div class="grid grid-cols-2 gap-8">
      <!-- BEFORE -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-error-500">Before (Broken Data)</h2>
        <div class="bg-neutral-900 p-4 rounded-lg overflow-auto max-h-[600px] border border-neutral-800">
          <pre class="text-xs text-neutral-400">{{ JSON.stringify(brokenHero, null, 2) }}</pre>
        </div>
      </section>

      <!-- AFTER -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-success-500">Result (Synced Data)</h2>
        <div class="bg-neutral-900 p-4 rounded-lg overflow-auto max-h-[600px] border border-neutral-800">
          <pre class="text-xs text-neutral-400">{{ JSON.stringify(syncedHero, null, 2) }}</pre>
        </div>
      </section>
    </div>

    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Self-Healing Summary</h2>
      <ul class="list-disc pl-6 space-y-2 text-neutral-300">
        <li><strong>Properties:</strong>
          <ul class="list-circle pl-6 mt-1 opacity-80">
            <li>Added missing <code>progression</code> group.</li>
            <li>Added missing <code>difficulty</code> field to <code>combat</code>.</li>
            <li>Removed stale <code>legacyGroup</code> and <code>legacyField</code>.</li>
            <li>Restored field order: <code>class</code> -> <code>difficulty</code> -> <code>primaryRole</code>.</li>
          </ul>
        </li>
        <li><strong>Blocks:</strong>
          <ul class="list-circle pl-6 mt-1 opacity-80">
            <li>Added missing <code>playstyle</code> templated block.</li>
            <li>Removed stale <code>deprecated-block</code> (templated).</li>
            <li>Preserved <code>user-block-1</code>.</li>
            <li>Restored block order: <code>playstyle</code> -> <code>lore</code> (with user block in between).</li>
          </ul>
        </li>
      </ul>
    </section>
  </UContainer>
</template>
