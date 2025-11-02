<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/91ceab67-89ce-4ef4-8678-4402a92baca5">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/51526d6d-e5ec-41b4-aa37-242dec1cdb27">
  <img alt="Nuxt UI" src="https://github.com/user-attachments/assets/51526d6d-e5ec-41b4-aa37-242dec1cdb27">
</picture>

# Rimelight Components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module with components and utilities used internally at Rimelight Entertainment.

> [!WARNING]
> This module is in early development and may contain placeholders and not strictly adhere to best practices.

- [Documentation](https://ui.nuxt.com/docs)
- [Playground](https://ui3-playground.nuxt.dev)
- [Release Notes](/CHANGELOG.md)

## Features

- Block-based Page Rendering

## Setup

Install the package from npm:

```bash [bun]
bun add rimelight-components
```

Add the module to your `nuxt.config.js`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['rimelight-components']
})
```

Learn more in the [installation guide](https://ui.nuxt.com/docs/getting-started/installation/nuxt).

## Contribution

Thank you for considering contributing to Rimelight Components. Here are a few ways you can get involved:

- Reporting Bugs: If you come across any bugs or issues, please check out the reporting bugs guide to learn how to submit a bug report.
- Suggestions: Have any thoughts to enhance Rimelight Components? We'd love to hear them! Check out the [contribution guide](https://ui.nuxt.com/docs/getting-started/contribution) to share your suggestions.

## Local Development

  ```bash [bun]
  # Install dependencies
  bun install
  ```
  
  ```bash [bun]
  # Generate type stubs
  bun dev:prepare
  ```
  
  ```bash [bun]
  # Develop with the playground
  bun dev
  ```
  
  ```bash [bun]
  # Build the playground
  bun dev:build
  ```
  
  ```bash [bun]
  # Run Typecheck
  bun typecheck
  ```
  
  ```bash [bun]
  # Run Oxlint
  bun lint
  ```
  
  ```bash [bun]
  # Run Prettier
  bun format
  ```
  
  ```bash [bun]
  # Run Vitest
  npm run test
  ```
  
  ```bash [bun]
  # Release new version
  bun release
  ```

Learn more in the [development guide](https://ui.nuxt.com/docs/getting-started/contribution#local-development).

## Sponshorship


## License

Licensed under the [MIT license](https://github.com/nuxt/ui/blob/v4/LICENSE.md).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/rimelight-components/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/rimelight-components
[npm-downloads-src]: https://img.shields.io/npm/dm/rimelight-components.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/rimelight-components
[license-src]: https://img.shields.io/npm/l/rimelight-components.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/rimelight-components
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
