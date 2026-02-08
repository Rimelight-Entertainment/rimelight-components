# Rimelight Components - Locale System

This document explains the locale/i18n system implemented in rimelight-components, following the Nuxt UI pattern.

## Overview

The locale system provides built-in internationalization support for all rimelight-components. Consuming applications automatically get English translations by default and can override or extend them as needed.

## Architecture

### Core Files

1. **`src/runtime/types/locale.ts`** - TypeScript types for locale messages
2. **`src/runtime/locale/en.ts`** - English locale messages (default)
3. **`src/runtime/locale/index.ts`** - Exports all available locales
4. **`src/runtime/composables/defineLocale.ts`** - Helper for defining locales
5. **`src/runtime/composables/useLocale.ts`** - Composable for accessing locale in components
6. **`src/runtime/utils/locale.ts`** - Translation utilities

## Usage in Components

Components use the `useLocale` composable to access translations:

```vue
<script setup lang="ts">
import { useLocale } from '../../composables'

const { t } = useLocale()
</script>

<template>
  <UButton :label="t('common.save')" />
  <p>{{ t('todo.no_active') }}</p>
</template>
```

## Available Message Keys

### Common
- `common.cancel`, `common.close`, `common.save`, `common.create`, `common.delete`
- `common.edit`, `common.update`, `common.preview`, `common.success`
- `common.archive`, `common.versions`

### Swatches
- `swatch.copy_hex`, `swatch.copy_rgb`, `swatch.copy_hsl`, `swatch.copy_oklch`, `swatch.copy_cmyk`
- `swatch.download_jpg`, `swatch.download_png`, `swatch.download_webp`, `swatch.download_svg`
- `swatch.color_copied`, `swatch.color_copy_failed`, `swatch.copy_error_description`

### Font Palette
- `font_palette.specimen`, `font_palette.hierarchy`, `font_palette.color`
- `font_palette.uppercase`, `font_palette.lowercase`, `font_palette.numbers`, `font_palette.symbols`
- `font_palette.heading_1` through `font_palette.heading_6`

### Page Editor
- `page_editor.preview`, `page_editor.save`, `page_editor.create_page`, `page_editor.delete_page`
- `page_editor.viewing_version_notice`, `page_editor.metadata`
- `page_editor.page_id`, `page_editor.created_at`, `page_editor.posted_at`, `page_editor.updated_at`

### Page Properties
- `page_properties.links`, `page_properties.no_links`, `page_properties.add_link`
- `page_properties.edit_link`, `page_properties.update_link`
- `page_properties.label`, `page_properties.url`, `page_properties.icon`
- `page_properties.color`, `page_properties.variant`
- `page_properties.page_template`, `page_properties.title`, `page_properties.slug`
- `page_properties.create_and_edit`

### Todo
- `todo.title`, `todo.add_placeholder`, `todo.description_placeholder`
- `todo.show_archive`, `todo.hide_archive`, `todo.no_active`

### Page Versions
- `page_version.failed_to_load`, `page_version.approved_successfully`
- `page_version.failed_to_approve`, `page_version.reverted_successfully`
- `page_version.failed_to_revert`

### Section
- `section.heading_copied`, `section.heading_copy_failed`

### Customer
- `customer.new_customer`, `customer.name`, `customer.email`

### Focus Timer
- `focus_timer.start`, `focus_timer.pause`

### Other
- `label_image`

## Extending or Overriding Locales

Consuming applications can override the default English messages or add new locales:

```typescript
// In your Nuxt app
import { extendLocale } from 'rimelight-components/locale'
import en from 'rimelight-components/locale/en'

// Override specific messages
const customEn = extendLocale(en, {
  messages: {
    common: {
      save: 'Save Changes' // Override default "Save"
    }
  }
})

// Provide to your app
provide(localeContextInjectionKey, customEn)
```

## Adding New Locales

To add a new language (e.g., Spanish):

1. Create `src/runtime/locale/es.ts`:
```typescript
import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Español',
  code: 'es',
  messages: {
    common: {
      cancel: 'Cancelar',
      close: 'Cerrar',
      save: 'Guardar',
      // ... all other translations
    },
    // ... rest of the messages
  }
})
```

2. Export it in `src/runtime/locale/index.ts`:
```typescript
export { default as en } from './en'
export { default as es } from './es'
```

## Integration with vue-i18n

The locale system is independent of vue-i18n but can coexist with it. Components use `useLocale` from rimelight-components for built-in messages, while the consuming app can still use vue-i18n for its own messages.

## Benefits

1. **Zero Configuration** - Works out of the box with English
2. **Type-Safe** - All message keys are typed
3. **Extensible** - Easy to override or add translations
4. **Independent** - Doesn't require vue-i18n in consuming apps
5. **Consistent** - Follows Nuxt UI patterns
