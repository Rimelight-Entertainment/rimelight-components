<script setup lang="ts">
import { ref } from "vue";
import { useTodos } from "../../composables";
import type { Todo } from "rimelight-components/shared/db/auth";
import { useI18n } from "vue-i18n";
import { RCTodoCard } from "#components";

export interface TodoListProps {
  todos: Todo[];
  archivedTodos?: Todo[];
  loading?: boolean;
}

const { todos, archivedTodos = [], loading = false } = defineProps<TodoListProps>();

const { toggleTodo, archiveTodo, restoreTodo, deleteTodo, createTodo } = useTodos();
const { t } = useI18n();

const newTodoTitle = ref("");
const newTodoDescription = ref("");
const isAdding = ref(false);

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return;
  isAdding.value = true;
  try {
    await createTodo(newTodoTitle.value.trim(), newTodoDescription.value.trim() || undefined);
    newTodoTitle.value = "";
    newTodoDescription.value = "";
  } finally {
    isAdding.value = false;
  }
};

const showArchived = ref(false);
</script>

<template>
  <div class="flex flex-col gap-md">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold tracking-wider text-gray-500 uppercase">
        {{ t("todo.title") }}
      </h3>
      <UButton
        :icon="showArchived ? 'lucide:archive-x' : 'lucide:archive'"
        color="neutral"
        size="xs"
        variant="ghost"
        :label="showArchived ? t('todo.hide_archive') : t('todo.show_archive')"
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
              :placeholder="t('todo.add_placeholder')"
              class="flex-1"
              @keydown.enter="handleAddTodo"
            />
            <UButton icon="lucide:plus" size="sm" :loading="isAdding" @click="handleAddTodo" />
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
                :placeholder="t('todo.description_placeholder')"
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
          <RCTodoCard
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @toggle="(completed) => toggleTodo(todo.id, completed)"
            @archive="archiveTodo(todo.id)"
          />

          <p v-if="todos.length === 0" class="text-xs text-dimmed text-center py-sm">
            {{ t("todo.no_active") }}
          </p>
        </div>

        <!-- Archived Section -->
        <template v-if="showArchived">
          <USeparator :label="t('common.archive')" />
          <div class="flex flex-col gap-xs">
            <RCTodoCard
              v-for="todo in archivedTodos"
              :key="todo.id"
              :todo="todo"
              @restore="restoreTodo(todo.id)"
              @delete="deleteTodo(todo.id)"
            />
          </div>
        </template>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
