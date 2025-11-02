import type { ModuleOptions } from "../../module"

declare module "@nuxt/schema" {
  interface AppConfig {
    rimelightComponents: ModuleOptions
  }
}

export {}
