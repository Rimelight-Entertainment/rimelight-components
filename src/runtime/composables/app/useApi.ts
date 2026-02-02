import { useFetch, useRuntimeConfig } from "#imports";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import { hash } from "ohash";
import type { UseFetchOptions } from "#app";

/**
 * $api: For imperative calls (buttons, save actions, Pinia Colada)
 */
export const $api = async <T>(path: string, opts: any = {}) => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase as string;
    const isTauri = config.public.isTauri as boolean;

    // Check if we are "external" to the API (cross-domain)
    // Logic: If not Tauri, and not Dev, and is Client...
    // check if current hostname matches apiBase hostname.
    let isExternal = isTauri;
    if (!isExternal && !import.meta.dev && import.meta.client) {
        try {
            if (apiBase.startsWith("http")) {
                const apiHost = new URL(apiBase).hostname;
                // If current hostname does NOT include the API host, then we are external.
                if (!window.location.hostname.includes(apiHost)) {
                    isExternal = true;
                }
            }
        } catch (e) {
            // Ignore URL parsing errors, treat as internal (default)
        }
    }

    const baseURL = isExternal ? apiBase : "";

    return $fetch<T>(path, {
        baseURL,
        ...opts,
        fetch: isTauri ? tauriFetch : undefined,
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
export const useApi = <T>(path: string | (() => string), opts: UseFetchOptions<T> = {}) => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase as string;
    const isTauri = config.public.isTauri as boolean;

    let isExternal = isTauri;
    if (!isExternal && !import.meta.dev && import.meta.client) {
        try {
            if (apiBase.startsWith("http")) {
                const apiHost = new URL(apiBase).hostname;
                if (!window.location.hostname.includes(apiHost)) {
                    isExternal = true;
                }
            }
        } catch (e) {
            // Ignore
        }
    }

    return useFetch(path, {
        baseURL: isExternal ? apiBase : "",
        ...opts,
        fetch: isTauri ? tauriFetch : undefined,
        // Key ensures unique state tracking in Nuxt
        key: opts.key || hash([path, typeof path === "function" ? path() : path]),
    } as UseFetchOptions<T> & { fetch?: unknown });
};
