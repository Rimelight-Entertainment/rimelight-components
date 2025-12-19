declare module '#build/app.config' {
  import type { AppConfig } from '@nuxt/schema'

  interface RimelightComponentsConfig {
    [key: string]: any
  }

  interface CustomAppConfig extends AppConfig {
    rimelightComponents?: RimelightComponentsConfig
  }

  const _default: CustomAppConfig
  export default _default
}
