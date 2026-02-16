import { useFetch, useRuntimeConfig } from "#imports";
import { hash } from "ohash";
import type { UseFetchOptions, AsyncData } from "#app";
import { defaultWindow } from "../../utils"

/**
 * $api: For imperative calls (buttons, save actions, Pinia Colada)
 */
export const $api = async <T>(path: string, opts: any = {}) => {
    const config = (useNuxtApp() as any).$config || useRuntimeConfig();
    const apiBase = config.public.apiBase as string;
    const isTauri = config.public.isTauri as boolean;

    // Check if we are "external" to the API (cross-domain)
    // Logic: If not Tauri, and not Dev, and is Client...
    // check if current hostname matches apiBase hostname.
    let isExternal = isTauri;
    if (!isExternal && !import.meta.dev && import.meta.client && defaultWindow) {
        try {
            if (apiBase.startsWith("http")) {
                const apiHost = new URL(apiBase).hostname;
                // If current hostname does NOT include the API host, then we are external.
                if (!defaultWindow.location.hostname.includes(apiHost)) {
                    isExternal = true;
                }
            }
        } catch (e) {
            // Ignore URL parsing errors, treat as internal (default)
        }
    }

    const baseURL = isExternal ? apiBase : "";

    // Dynamic tauri import to avoid server-side bundling issues
    let fetchFn = undefined;
    if (isTauri) {
        try {
            const { fetch: tauriFetch } = await import("@tauri-apps/plugin-http");
            fetchFn = tauriFetch;
        } catch (e) {
            console.error("Failed to load Tauri fetch plugin", e);
        }
    }

    return $fetch<T>(path, {
        baseURL,
        ...opts,
        fetch: fetchFn,
        headers: {
            Accept: "application/json",
            ...opts.headers,
        },
        credentials: "include", // Important for shared cookies if cross-subdomain
    });
};

/**
 * useApi: For reactive data fetching in setup
 */
export const useApi = <T>(path: string | (() => string), opts: UseFetchOptions<T> = {}): AsyncData<T, Error | null> => {
    const config = (useNuxtApp() as any).$config || useRuntimeConfig();
    const apiBase = config.public.apiBase as string;
    const isTauri = config.public.isTauri as boolean;

    let isExternal = isTauri;
    if (!isExternal && !import.meta.dev && import.meta.client && defaultWindow) {
        try {
            if (apiBase.startsWith("http")) {
                const apiHost = new URL(apiBase).hostname;
                if (!defaultWindow.location.hostname.includes(apiHost)) {
                    isExternal = true;
                }
            }
        } catch (e) {
            // Ignore
        }
    }

    const fetchOptions: any = {
        baseURL: isExternal ? apiBase : "",
        ...opts,
    };

    // Use a unique key based on path, method, and query to avoid collisions
    if (!fetchOptions.key) {
        const pathStr = typeof path === "function" ? path() : path;
        fetchOptions.key = hash([
            pathStr,
            opts.method || "GET",
            opts.query,
            opts.params,
        ]);
    }

    // We can't use async/await here easily inside useApi without making it complicated
    // but we can pass a custom fetch that lazily imports if needed, 
    // although for useFetch it's usually better to just let it be null on server.
    if (isTauri && import.meta.client) {
        fetchOptions.fetch = (url: string, options: any) => import("@tauri-apps/plugin-http").then(m => m.fetch(url, options));
    }

    return useFetch(path, fetchOptions as any) as AsyncData<T, Error | null>;
};
