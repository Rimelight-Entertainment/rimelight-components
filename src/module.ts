import { defineNuxtModule, addComponentsDir, createResolver } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'rimelight-components',
    version: '0.0.1',
    configKey: 'rimelightComponents',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  defaults: {},
  hooks: {},
  moduleDependencies: {
    '@nuxt/ui': {
      version: '>=4.0.0',
      optional: false,
      overrides: {},
      defaults: {}
    }
  },
  async setup() {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('./runtime/components/'),
      pathPrefix: false,
      prefix: 'RC',
      global: true
    })
  },
  onInstall(nuxt) {
    console.log('Setting up rimelight-components for the first time!')
  },
  onUpgrade() {
    console.log('Upgrading rimelight-components.')
  }
})
