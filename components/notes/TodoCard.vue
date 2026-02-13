<script setup lang="ts">
import type { Todo } from '../../db/auth'

export interface TodoCardProps {
  todo: Todo
}

const { todo } = defineProps<TodoCardProps>()

export interface TodoCardEmits {
  (e: 'toggle', completed: boolean): void
  (e: 'archive'): void
  (e: 'restore'): void
  (e: 'delete'): void
}

const emit = defineEmits<TodoCardEmits>()
</script>

<template>
  <div
    class="group flex items-center justify-between gap-sm p-xs rounded-lg hover:bg-muted/50 transition-colors"
    :class="{ 'opacity-60': todo.isArchived }"
  >
    <div class="flex items-start gap-sm flex-1">
      <div class="pt-0.5">
        <template v-if="!todo.isArchived">
          <UCheckbox
            :model-value="todo.completed"
            @update:model-value="(val: boolean | 'indeterminate') => emit('toggle', val === true)"
          />
        </template>
        <template v-else>
          <UIcon
            :name="todo.completed ? 'lucide:check-circle-2' : 'lucide:circle'"
            class="w-4 h-4 text-dimmed"
          />
        </template>
      </div>
      <div class="flex flex-col gap-0">
        <span
          class="text-sm transition-all"
          :class="{ 'line-through text-dimmed': todo.completed }"
        >
          {{ todo.title }}
        </span>
        <span
          v-if="todo.description"
          class="text-xs text-dimmed transition-all"
          :class="{ 'line-through': todo.completed }"
        >
          {{ todo.description }}
        </span>
      </div>
    </div>
    
    <div 
      class="flex items-center gap-xs transition-opacity"
      :class="{ 'opacity-0 group-hover:opacity-100': !todo.isArchived }"
    >
      <template v-if="!todo.isArchived">
        <UButton
          icon="lucide:archive"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="emit('archive')"
        />
      </template>
      <template v-else>
        <UButton
          icon="lucide:rotate-ccw"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="emit('restore')"
        />
        <UButton
          icon="lucide:trash-2"
          size="xs"
          variant="ghost"
          color="error"
          @click="emit('delete')"
        />
      </template>
    </div>
  </div>
</template>
