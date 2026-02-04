import { useState } from "#imports"
import { $api } from "../../composables"

export const useTodos = () => {
    const todoRefreshTrigger = useState("todos-refresh-trigger", () => 0)

    const triggerRefresh = () => {
        todoRefreshTrigger.value++
    }

    const toggleTodo = async (id: string, completed: boolean) => {
        await $api(`/api/todos/${id}`, {
            method: "PUT",
            body: { completed, completedAt: completed ? new Date().toISOString() : null }
        })
        triggerRefresh()
    }

    const archiveTodo = async (id: string) => {
        await $api(`/api/todos/${id}`, {
            method: "PUT",
            body: { isArchived: true }
        })
        triggerRefresh()
    }

    const restoreTodo = async (id: string) => {
        await $api(`/api/todos/${id}`, {
            method: "PUT",
            body: { isArchived: false }
        })
        triggerRefresh()
    }

    const deleteTodo = async (id: string) => {
        await $api(`/api/todos/${id}`, {
            method: "DELETE"
        })
        triggerRefresh()
    }

    const createTodo = async (title: string, description?: string) => {
        await $api("/api/todos", {
            method: "POST",
            body: { title, description }
        })
        triggerRefresh()
    }

    const clearCompleted = async () => {
        await $api("/api/todos/clear-completed", {
            method: "POST"
        })
        triggerRefresh()
    }

    return {
        todoRefreshTrigger,
        triggerRefresh,
        toggleTodo,
        archiveTodo,
        restoreTodo,
        deleteTodo,
        createTodo,
        clearCompleted
    }
}
