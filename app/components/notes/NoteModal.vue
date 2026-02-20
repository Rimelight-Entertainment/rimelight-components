<script lang="ts" setup>
import type { SelectMenuItem } from "@nuxt/ui";
import { computed, reactive, ref, watch, onUnmounted } from "vue";
import type { Label, Note } from "rimelight-components/shared/db/auth";
import { useApi, $api } from "../../composables";

const open = defineModel<boolean>("open", { default: false });

export interface NoteModalProps {
  note?: Note | null;
}

const { note } = defineProps<NoteModalProps>();

export interface NoteModalEmits {
  (e: "saved", note: Note): void;

  (e: "close"): void;
}

const emit = defineEmits<NoteModalEmits>();

const state = reactive<{
  id: string | undefined;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  labels: string[];
}>({
  id: note?.id,
  title: note?.title ?? "",
  content: note?.content ?? "",
  isPinned: note?.isPinned || false,
  isArchived: note?.isArchived || false,
  labels: note?.labels?.map((l: any) => l.label.id) || [],
});

const { data: fetchedLabels } = useApi<Label[]>("/api/notes/labels", {
  default: () => [] as any,
});

const allLabels = ref<Label[]>([]);

watch(
  () => fetchedLabels.value,
  (newLabels) => {
    if (newLabels) {
      allLabels.value = [...newLabels];
    }
  },
  { immediate: true },
);

const labelMap = computed(() => {
  const map = new Map<string, string>();
  allLabels.value.forEach((l) => map.set(l.id, l.name));
  return map;
});

const labelItems = computed<SelectMenuItem[]>(() =>
  allLabels.value.map((l) => ({
    label: l.name,
    id: l.id,
  })),
);

const syncState = () => {
  if (note) {
    state.id = note.id;
    state.title = note.title ?? "";
    state.content = note.content ?? "";
    state.isPinned = note.isPinned;
    state.isArchived = note.isArchived;
    state.labels = note.labels?.map((l: any) => l.label.id) || [];
  } else {
    state.id = undefined;
    state.title = "";
    state.content = "";
    state.isPinned = false;
    state.isArchived = false;
    state.labels = [];
  }
};

watch(() => note, syncState);

const saveTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const isSaving = ref(false);
const hasPendingSave = ref(false);

const saveNote = async () => {
  // If the note is empty, don't save
  if (!state.title.trim() && !state.content.trim()) return;

  // If already saving, mark that we have a pending save (so we save again with latest data after current save finishes)
  if (isSaving.value) {
    hasPendingSave.value = true;
    return;
  }

  isSaving.value = true;

  try {
    let savedNote: Note;

    const payload = {
      title: state.title.trim() || "",
      content: state.content.trim() || "",
      isPinned: state.isPinned,
      isArchived: state.isArchived,
      labels: state.labels,
    };

    if (state.id) {
      savedNote = await $api<Note>(`/api/notes/${state.id}`, {
        method: "PUT",
        body: payload,
      });
    } else {
      const createPayload = {
        title: payload.title,
        content: payload.content,
        isPinned: payload.isPinned,
        isArchived: payload.isArchived,
      };

      savedNote = await $api<Note>("/api/notes", {
        method: "POST",
        body: createPayload,
      });

      state.id = savedNote.id;

      if (state.labels.length > 0) {
        savedNote = await $api<Note>(`/api/notes/${state.id}`, {
          method: "PUT",
          body: { labels: state.labels },
        });
      }
    }
    emit("saved", savedNote!);
  } catch (e) {
    console.error("Failed to save note", e);
  } finally {
    isSaving.value = false;
    // If a save was requested while we were saving, execute it now to ensure latest state is persisted
    if (hasPendingSave.value) {
      hasPendingSave.value = false;
      saveNote();
    }
  }
};

const createLabel = async (newLabelName: string) => {
  try {
    const createdLabel = await $api<Label>("/api/notes/labels", {
      method: "POST",
      body: { name: newLabelName },
    });

    allLabels.value.push(createdLabel);

    if (!state.labels.includes(createdLabel.id)) {
      state.labels.push(createdLabel.id);
    }
  } catch (e) {
    console.error("Failed to create new label", e);
  }
};

const debouncedSave = () => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
  saveTimeout.value = setTimeout(() => {
    saveNote();
  }, 1000);
};

watch(
  () => [state.title, state.content, state.isPinned, state.isArchived, state.labels],
  () => {
    debouncedSave();
  },
);

watch(open, (isOpen) => {
  if (isOpen) {
    syncState();
  } else {
    if (saveTimeout.value) {
      clearTimeout(saveTimeout.value);
    }
    saveNote();
    emit("close");
  }
});

const deleteNote = async () => {
  if (!state.id) return;

  try {
    await $api(`/api/notes/${state.id}`, {
      method: "DELETE",
    });
    open.value = false;
    emit("saved", null as any); // Trigger refresh
  } catch (e) {
    console.error("Failed to delete note", e);
  }
};

onUnmounted(() => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
});
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'p-md flex flex-col' }">
    <slot />
    <template #content>
      <div class="flex flex-row justify-between gap-sm">
        <div class="flex w-full flex-col">
          <UInput
            v-model="state.title"
            class="flex-1 font-bold"
            placeholder="Title"
            size="xl"
            type="text"
            variant="none"
          />

          <div v-if="state.labels.length > 0" class="flex flex-wrap gap-sm px-sm">
            <UBadge
              v-for="labelId in state.labels"
              :key="labelId"
              color="neutral"
              size="md"
              variant="soft"
            >
              {{ labelMap.get(labelId) || "Unknown" }}
            </UBadge>
          </div>
          <UTextarea
            v-model="state.content"
            :maxrows="16"
            :rows="2"
            autoresize
            class="w-full"
            placeholder="Take a note..."
            size="lg"
            variant="none"
          />
        </div>
        <div class="flex flex-col gap-xs">
          <UButton
            :icon="state.isPinned ? 'lucide:pin-off' : 'lucide:pin'"
            color="neutral"
            variant="ghost"
            @click="state.isPinned = !state.isPinned"
          />
          <UButton
            :color="state.isArchived ? 'primary' : 'neutral'"
            :icon="state.isArchived ? 'lucide:archive-x' : 'lucide:archive-restore'"
            size="sm"
            variant="ghost"
            @click="state.isArchived = !state.isArchived"
          />
          <UButton
            color="error"
            icon="lucide:trash-2"
            size="sm"
            variant="ghost"
            @click="deleteNote"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-row gap-xs">
          <USelectMenu
            v-model="state.labels"
            :arrow="true"
            :items="labelItems"
            :multiple="true"
            create-item="always"
            icon="lucide-tag"
            label-key="label"
            size="sm"
            trailing-icon=""
            value-key="id"
            variant="ghost"
            @create="createLabel"
          >
            <template #default>
              <span class="text-dimmed">Edit Labels</span>
            </template>
          </USelectMenu>
        </div>
        <div class="flex flex-col gap-xs">
          <span class="text-xs text-dimmed">Last Edited: </span>
          <span class="text-xs text-dimmed">
            {{ state.id ? "Saved" : "Unsaved" }}
          </span>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
