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
const newTodoDescription = ref('')
const isAdding = ref(false)

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return
  isAdding.value = true
  try {
    await createTodo(newTodoTitle.value.trim(), newTodoDescription.value.trim() || undefined)
    newTodoTitle.value = ''
    newTodoDescription.value = ''
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
        <div class="flex flex-col gap-xs">
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
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div v-if="newTodoTitle.length > 0" class="pl-0">
               <UInput
                 v-model="newTodoDescription"
                 placeholder="Add a description (optional)..."
                 size="xs"
                 variant="outline"
                 color="neutral"
                 @keydown.enter="handleAddTodo"
               />
            </div>
          </transition>
        </div>

        <!-- Active Todos -->
        <div class="flex flex-col gap-xs">
          <div
            v-for="todo in activeTodos"
            :key="todo.id"
            class="group flex items-center justify-between gap-sm p-xs rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-start gap-sm flex-1">
              <div class="pt-0.5">
                <UCheckbox
                  v-model="todo.completed"
                  @change="toggleTodo(todo.id, todo.completed)"
                />
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
              <div class="flex items-start gap-sm">
                <div class="pt-0.5">
                  <UIcon
                    :name="todo.completed ? 'lucide:check-circle-2' : 'lucide:circle'"
                    class="w-4 h-4 text-dimmed"
                  />
                </div>
                <div class="flex flex-col gap-0">
                  <span class="text-sm line-through text-dimmed">
                    {{ todo.title }}
                  </span>
                  <span v-if="todo.description" class="text-xs line-through text-dimmed">
                    {{ todo.description }}
                  </span>
                </div>
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
