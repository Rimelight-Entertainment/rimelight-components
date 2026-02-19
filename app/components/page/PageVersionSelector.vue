<script lang="ts" setup>
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@nuxt/ui/composables/useToast"
import { computed, ref, watch } from "vue"
import { useRC, $api } from "../../composables"
import { useI18n } from "vue-i18n"
import { tv } from "../../internal/tv"
import type { PageVersion } from "../../types"

export interface PageVersionSelectorProps {
  pageId: string
  currentVersionId?: string | null
  isAdmin?: boolean
  rc?: {
    root?: string
    button?: string
    popover?: string
    versionItem?: string
  }
}

const { 
  pageId, 
  currentVersionId, 
  isAdmin = false,
  rc: rcProp 
} = defineProps<PageVersionSelectorProps>()

const emit = defineEmits<{
  "update:currentVersionId": [value: string | null]
  "version-selected": [version: PageVersion]
  "version-approved": [version: PageVersion]
  "version-rejected": [version: PageVersion]
  "version-reverted": [version: PageVersion]
}>()

const { rc } = useRC('PageVersionSelector', rcProp)
const { t } = useI18n()
const toast = useToast()

const versions = ref<PageVersion[]>([])
const isLoading = ref(false)
const isApproving = ref<string | null>(null)
const isRejecting = ref<string | null>(null)
const isReverting = ref<string | null>(null)
const isOpen = ref(false)

const pageVersionSelectorStyles = tv({
  slots: {
    root: "",
    button: "",
    popover: "w-80 p-2",
    versionItem: "px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded"
  }
})

const {
  root,
  button: buttonClass,
  popover,
  versionItem
} = pageVersionSelectorStyles()

const pendingVersions = computed(() => {
  return versions.value.filter(v => v.status === "pending")
})

const selectedVersionId = computed({
  get: () => currentVersionId,
  set: (value) => emit("update:currentVersionId", value || null)
})

const fetchVersions = async () => {
  if (!pageId) return

  isLoading.value = true
  try {
    versions.value = await $api<PageVersion[]>(`/api/pages/id/${pageId}/versions`)
  } catch (error) {
    console.error("Failed to fetch versions:", error)
    // Avoid toast if not available, but usually it is in this project
    try { toast.add({ color: "error", title: t('page_version.failed_to_load') }) } catch(e) {}
  } finally {
    isLoading.value = false
  }
}

const selectVersion = (version: PageVersion) => {
  selectedVersionId.value = version.id
  emit("version-selected", version)
  isOpen.value = false
}

const approveVersion = async (version: PageVersion) => {
  if (!isAdmin) return

  isApproving.value = version.id
  try {
    const result = await $api<{ message?: string }>(`/api/pages/versions/${version.id}/approve`, {
      method: "POST"
    })

    try {
      toast.add({
        color: "success",
        title: t('page_version.approved_successfully'),
        description: result?.message || "The page has been updated with the approved version"
      })
    } catch(e) {}

    emit("version-approved", version)
    await fetchVersions()

    if (selectedVersionId.value === version.id) {
      selectedVersionId.value = null
    }
  } catch (error: any) {
    console.error("Failed to approve version:", error)
    try {
      toast.add({
        color: "error",
        title: t('page_version.failed_to_approve'),
        description: error.message || "An error occurred"
      })
    } catch(e) {}
  } finally {
    isApproving.value = null
  }
}

const rejectVersion = async (version: PageVersion) => {
  if (!isAdmin) return

  isRejecting.value = version.id
  try {
    const result = await $api<{ message?: string }>(`/api/pages/versions/${version.id}/reject`, {
      method: "POST"
    })

    try {
      toast.add({
        color: "success",
        title: t('page_version.rejected_successfully', 'Version rejected'),
        description: result?.message || "the version has been rejected"
      })
    } catch(e) {}

    emit("version-rejected", version)
    await fetchVersions()
  } catch (error: any) {
    console.error("Failed to reject version:", error)
    try {
      toast.add({
        color: "error",
        title: t('page_version.failed_to_reject', 'Failed to reject version'),
        description: error.message || "An error occurred"
      })
    } catch(e) {}
  } finally {
    isRejecting.value = null
  }
}

const revertVersion = async (version: PageVersion) => {
  if (!isAdmin) return

  isReverting.value = version.id
  try {
    const result = await $api<{ message?: string }>(`/api/pages/versions/${version.id}/revert`, {
      method: "POST"
    })

    try {
      toast.add({
        color: "success",
        title: t('page_version.reverted_successfully'),
        description: result?.message || "The page has been reverted to this version."
      })
    } catch(e) {}

    emit("version-reverted", version)
    await fetchVersions()
    selectedVersionId.value = null
  } catch (error: any) {
    console.error("Failed to revert version:", error)
    try {
      toast.add({
        color: "error",
        title: t('page_version.failed_to_revert'),
        description: error.message || "An error occurred"
      })
    } catch(e) {}
  } finally {
    isReverting.value = null
  }
}

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "success"
    case "pending": return "warning"
    case "rejected": return "error"
    default: return "neutral"
  }
}

watch(() => pageId, () => {
  if (pageId) fetchVersions()
}, { immediate: true })
</script>

<template>
  <UPopover v-model:open="isOpen" :popper="{ placement: 'bottom-start' }" :class="root({ class: rc.root })">
    <UButton
      :loading="isLoading"
      color="neutral"
      icon="lucide:git-branch"
      :label="t('common.versions')"
      size="xs"
      variant="ghost"
      :class="buttonClass({ class: rc.button })"
    />

    <template #content>
      <div :class="popover({ class: rc.popover })">
        <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-sm font-semibold">Page Versions</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">View and manage page versions</p>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div
            :class="[
              versionItem({ class: rc.versionItem }),
              { 'bg-primary-50 dark:bg-primary-900/20': !selectedVersionId }
            ]"
            @click="selectedVersionId = null; isOpen = false"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <UBadge color="success" size="xs">Live</UBadge>
                  <span class="text-sm font-medium">Current Version</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The published version of this page
                </p>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="px-3 py-4 text-center">
            <USkeleton class="h-4 w-full mb-2" />
            <USkeleton class="h-3 w-3/4" />
          </div>

          <div
            v-else-if="versions.length === 0"
            class="px-3 py-4 text-center text-sm text-gray-500"
          >
            No versions yet
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="version in versions"
              :key="version.id"
              :class="[
                versionItem({ class: rc.versionItem }),
                { 'bg-primary-50 dark:bg-primary-900/20': selectedVersionId === version.id }
              ]"
              @click="selectVersion(version)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <UBadge :color="getStatusColor(version.status)" size="xs">
                      {{ version.status }}
                    </UBadge>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(version.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {{ version.title?.en || version.title || "Untitled" }}
                  </p>
                  <p
                    v-if="version.approvedBy && version.approvedAt"
                    class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                  >
                    Approved {{ formatDate(version.approvedAt) }}
                  </p>
                </div>

                <div v-if="isAdmin" class="shrink-0 flex items-center gap-1">
                  <UButton
                    v-if="version.status === 'pending'"
                    :loading="isApproving === version.id"
                    color="success"
                    icon="lucide:check"
                    size="xs"
                    title="Approve version"
                    variant="ghost"
                    @click.stop="approveVersion(version)"
                  />
                  <UButton
                    v-if="version.status === 'pending'"
                    :loading="isRejecting === version.id"
                    color="error"
                    icon="lucide:x"
                    size="xs"
                    title="Reject version"
                    variant="ghost"
                    @click.stop="rejectVersion(version)"
                  />
                  <UButton
                    v-if="selectedVersionId === version.id"
                    :loading="isReverting === version.id"
                    color="warning"
                    icon="lucide:rotate-ccw"
                    size="xs"
                    title="Revert to this version"
                    variant="ghost"
                    @click.stop="revertVersion(version)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="pendingVersions.length > 0 && isAdmin"
          class="px-3 py-2 border-t border-gray-200 dark:border-gray-800 mt-2"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ pendingVersions.length }} pending version{{ pendingVersions.length !== 1 ? 's' : '' }} awaiting approval
          </p>
        </div>
      </div>
    </template>
  </UPopover>
</template>
