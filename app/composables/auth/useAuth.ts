import {
  clearNuxtData,
  navigateTo,
  useAsyncData,
  useNuxtApp,
  useRequestHeaders,
  useState,
} from "#imports";
import { statement } from "rimelight-components/auth/statements";
import { computed } from "vue";

interface AuthInterface {
  api: {
    getSession: (options: { headers: HeadersInit }) => Promise<any>;
  };
}

//TODO Hackaround due to nuxt auto import issues
interface NuxtAppWithAuth {
  $authClient: any;
  $auth?: AuthInterface;
  $i18n: {
    t: (key: string, named?: Record<string, any>) => string;
  };
  runWithContext: (fn: () => any) => any;
}

type SignUpInput = any;
type SignInInput = any;

type PermissionsInput = Partial<{
  [K in keyof typeof statement]: (typeof statement)[K][number][];
}>;

type AppRole = "user" | "member" | "admin" | "owner";

export const useAuth = () => {
  // 1. Initializing
  const nuxtApp = useNuxtApp() as unknown as NuxtAppWithAuth;
  const authClient = nuxtApp.$authClient;

  // 2. Refs
  const isLoading = useState("auth-loading", () => false);
  const actionError = useState<any>("auth-action-error", () => null);

  // 3. Data/Async (Session)
  const asyncData = useAsyncData(
    "auth-session",
    async () => {
      if (import.meta.server) {
        try {
          const auth = nuxtApp.$auth;
          if (!auth) {
            console.warn("[SSR Auth] Auth provider not found.");
            return null;
          }
          // useRequestHeaders must be called inside the async function or setup
          const reqHeaders = useRequestHeaders(["cookie"]);
          return await auth.api.getSession({
            headers: new Headers(reqHeaders as any),
          });
        } catch (e) {
          console.error("[SSR Auth] Session fetch failed:", e);
          return null;
        }
      }

      // Client side
      if (!authClient) return null;

      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Client auth timeout")), 8000),
        );

        const response = await Promise.race([authClient.getSession(), timeoutPromise]);
        const data = (response as any)?.data || response;
        return data?.user ? data : null;
      } catch (e) {
        if (import.meta.client) {
          console.error("Client auth session fetch failed:", e);
        }
        return null;
      }
    },
    {
      server: true,
      immediate: true,
    },
  );

  const { data: session, status, refresh, error: sessionError } = asyncData;

  // 4. Computed
  const user = computed(() => session.value?.user);

  const permissions = {
    admin: {
      canAccess: computed(() => checkPermission({ admin: ["access"] })),
    },
    blog: {
      canCreate: computed(() => checkPermission({ blogPost: ["create"] })),
      canEdit: computed(() => checkPermission({ blogPost: ["edit"] })),
      canPublish: computed(() => checkPermission({ blogPost: ["publish"] })),
      canDelete: computed(() => checkPermission({ blogPost: ["delete"] })),
    },
    documents: {
      canCreate: computed(() => checkPermission({ document: ["create"] })),
      canEdit: computed(() => checkPermission({ document: ["edit"] })),
      canPublish: computed(() => checkPermission({ document: ["publish"] })),
      canDelete: computed(() => checkPermission({ document: ["delete"] })),
    },
    team: {
      canCreate: computed(() => checkPermission({ team: ["create"] })),
      canUpdate: computed(() => checkPermission({ team: ["update"] })),
      canDelete: computed(() => checkPermission({ team: ["delete"] })),
    },
    org: {
      canCreate: computed(() => checkPermission({ organization: ["create"] })),
      canUpdate: computed(() => checkPermission({ organization: ["update"] })),
      canDelete: computed(() => checkPermission({ organization: ["delete"] })),
    },
    assets: {
      canView: computed(() => checkPermission({ asset: ["view"] })),
      canUpload: computed(() => checkPermission({ asset: ["upload"] })),
      canEdit: computed(() => checkPermission({ asset: ["edit"] })),
      canDelete: computed(() => checkPermission({ asset: ["delete"] })),
    },
  };

  // 5. Methods
  const signUp = async (input: SignUpInput, redirectTo?: string) => {
    isLoading.value = true;
    actionError.value = null;
    try {
      if (!authClient) throw new Error("Auth client not initialized");
      const { data, error } = await authClient.signUp.email(input);

      if (error) {
        actionError.value = error;
        return { data, error };
      }

      await refresh();
      if (redirectTo !== undefined) {
        await navigateTo(redirectTo || "/");
      }
      return { data, error: null };
    } catch (err) {
      actionError.value = err;
      return { data: null, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async (credentials: SignInInput, redirectTo?: string) => {
    isLoading.value = true;
    actionError.value = null;
    try {
      if (!authClient) throw new Error("Auth client not initialized");
      const { data, error } = await authClient.signIn.email(credentials);

      if (error) {
        actionError.value = error;
        return { data, error };
      }

      await refresh();
      if (redirectTo !== undefined) {
        await navigateTo(redirectTo || "/");
      }
      return { data, error: null };
    } catch (err) {
      actionError.value = err;
      return { data: null, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    isLoading.value = true;
    actionError.value = null;
    try {
      if (!authClient) throw new Error("Auth client not initialized");
      const { error } = await authClient.signOut();

      if (error) {
        actionError.value = error;
        return { error };
      }

      nuxtApp.runWithContext(() => clearNuxtData("auth-session"));
      await navigateTo("/");
      return { error: null };
    } catch (err) {
      actionError.value = err;
      return { error: err };
    } finally {
      isLoading.value = false;
    }
  };

  const checkPermission = (permissions: PermissionsInput) => {
    const userRole = session.value?.user?.role as AppRole | undefined;

    if (!userRole) return false;
    if (!authClient) return false;

    return authClient.organization.checkRolePermission({
      permissions,
      role: userRole,
    });
  };

  return {
    // Data
    session,
    user,
    permissions,
    promise: asyncData,

    // State
    status,
    isLoading,
    sessionError,
    actionError,

    // Actions
    signUp,
    signIn,
    signOut,
    refresh,
    checkPermission,
  };
};
