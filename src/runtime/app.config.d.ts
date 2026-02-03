declare module "#build/app.config" {
  import type { AppConfig } from "@nuxt/schema"
  import type { PageType, PageDefinition } from "../runtime/types"

  interface RimelightComponentsConfig {
    pageDefinitions?: Partial<Record<PageType, PageDefinition>>
    [key: string]: any
  }

  interface CustomAppConfig extends AppConfig {
    rimelightComponents?: RimelightComponentsConfig
  }

  const _default: CustomAppConfig
  export default _default
}
