import type { PageType, PageDefinition } from "./index"

declare module "@nuxt/schema" {
  interface RimelightComponentsConfig {
    pageDefinitions?: Partial<Record<PageType, PageDefinition>>
    [key: string]: any
  }

  interface AppConfig {
    rimelightComponents?: RimelightComponentsConfig
  }
}

declare module "nuxt/schema" {
  interface AppConfig {
    rimelightComponents?: import("@nuxt/schema").RimelightComponentsConfig
  }
}

export {}
