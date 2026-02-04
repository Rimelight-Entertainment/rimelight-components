<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTodos, useApi } from '../../composables'
import type { Todo } from '../../db/auth'

const { toggleTodo, archiveTodo, restoreTodo, deleteTodo, createTodo, todoRefreshTrigger } = useTodos()

const { data: todos, refresh: refreshTodos } = await useApi<Todo[]>('/api/todos')

watch(todoRefreshTrigger, () => {
  refreshTodos()
})

const activeTodos = computed(() => todos.value?.filter(t => !t.isArchived) || [])

const newTodoTitle = ref('')
const isAdding = ref(false)

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return
  isAdding.value = true
  try {
    await createTodo(newTodoTitle.value.trim())
    newTodoTitle.value = ''
  } finally {
    isAdding.value = false
  }
}

const showArchived = ref(false)
const { data: archivedTodos, refresh: refreshArchived } = await useApi<Todo[]>('/api/todos/archived', {
  immediate: false,
  watch: [showArchived]
})

watch(showArchived, (val) => {
  if (val) refreshArchived()
})

watch(todoRefreshTrigger, () => {
  if (showArchived.value) refreshArchived()
})
</script>

<template>
  <div class="flex flex-col gap-md">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold tracking-wider text-gray-500 uppercase">To-do List</h3>
      <UButton
        :icon="showArchived ? 'lucide:archive-x' : 'lucide:archive'"
        color="neutral"
        size="xs"
        variant="ghost"
        :label="showArchived ? 'Hide Archive' : 'Show Archive'"
        @click="showArchived = !showArchived"
      />
    </div>

    <UCard variant="soft" :ui="{ body: 'p-sm' }">
      <div class="flex flex-col gap-sm">
        <!-- Quick Add -->
        <div class="flex gap-sm items-center">
          <UInput
            v-model="newTodoTitle"
            placeholder="Add a to-do..."
            class="flex-1"
            @keydown.enter="handleAddTodo"
          />
          <UButton
            icon="lucide:plus"
            size="sm"
            :loading="isAdding"
            @click="handleAddTodo"
          />
        </div>

        <!-- Active Todos -->
        <div class="flex flex-col gap-xs">
          <div
            v-for="todo in activeTodos"
            :key="todo.id"
            class="group flex items-center justify-between gap-sm p-xs rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-center gap-sm flex-1">
              <UCheckbox
                :model-value="todo.completed"
                @update:model-value="(val) => toggleTodo(todo.id, val)"
              />
              <span
                class="text-sm transition-all"
                :class="{ 'line-through text-dimmed': todo.completed }"
              >
                {{ todo.title }}
              </span>
            </div>
            <div class="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                icon="lucide:archive"
                size="xs"
                variant="ghost"
                color="neutral"
                @click="archiveTodo(todo.id)"
              />
            </div>
          </div>

          <p v-if="activeTodos.length === 0" class="text-xs text-dimmed text-center py-sm">
            No active to-dos.
          </p>
        </div>

        <!-- Archived Section -->
        <template v-if="showArchived">
          <USeparator label="Archive" />
          <div class="flex flex-col gap-xs">
            <div
              v-for="todo in archivedTodos"
              :key="todo.id"
              class="flex items-center justify-between gap-sm p-xs rounded-lg opacity-60"
            >
              <div class="flex items-center gap-sm">
                <UIcon
                  :name="todo.completed ? 'lucide:check-circle-2' : 'lucide:circle'"
                  class="w-4 h-4 text-dimmed"
                />
                <span class="text-sm line-through text-dimmed">
                  {{ todo.title }}
                </span>
              </div>
              <div class="flex items-center gap-xs">
                <UButton
                  icon="lucide:rotate-ccw"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  @click="restoreTodo(todo.id)"
                />
                <UButton
                  icon="lucide:trash-2"
                  size="xs"
                  variant="ghost"
                  color="error"
                  @click="deleteTodo(todo.id)"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </UCard>
  </div>
</template>
