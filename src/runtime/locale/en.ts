import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
    name: 'English',
    code: 'en',
    messages: {
        common: {
            cancel: 'Cancel',
            close: 'Close',
            save: 'Save',
            create: 'Create',
            delete: 'Delete',
            edit: 'Edit',
            update: 'Update',
            preview: 'Preview',
            success: 'Success',
            archive: 'Archive',
            versions: 'Versions'
        },
        swatch: {
            copy_hex: 'Copy HEX',
            copy_rgb: 'Copy RGB',
            copy_hsl: 'Copy HSL',
            copy_oklch: 'Copy OKLCH',
            copy_cmyk: 'Copy CMYK',
            download_jpg: 'Download JPG',
            download_png: 'Download PNG',
            download_webp: 'Download WEBP',
            download_svg: 'Download SVG',
            color_copied: 'Color copied to clipboard!',
            color_copy_failed: 'Failed to copy color to clipboard.',
            copy_error_description: 'An unexpected error occurred. Please try again.'
        },
        font_palette: {
            specimen: 'Specimen',
            hierarchy: 'Hierarchy',
            color: 'Color',
            uppercase: 'Uppercase',
            lowercase: 'Lowercase',
            numbers: 'Numbers',
            symbols: 'Symbols',
            heading_1: 'Heading 1',
            heading_2: 'Heading 2',
            heading_3: 'Heading 3',
            heading_4: 'Heading 4',
            heading_5: 'Heading 5',
            heading_6: 'Heading 6'
        },
        page_editor: {
            preview: 'Preview',
            save: 'Save',
            create_page: 'Create Page',
            delete_page: 'Delete Page',
            viewing_version_notice: 'Viewing a previous version. Changes made here will create a new version.',
            metadata: 'Metadata',
            page_id: 'Page ID',
            created_at: 'Created At',
            posted_at: 'Posted At',
            updated_at: 'Updated At'
        },
        page_properties: {
            links: 'Links',
            no_links: 'No links added yet.',
            add_link: 'Add Link',
            edit_link: 'Edit Link',
            update_link: 'Update Link',
            label: 'Label',
            url: 'URL (to)',
            icon: 'Icon',
            color: 'Color',
            variant: 'Variant',
            page_template: 'Page Template',
            title: 'Title',
            slug: 'Slug',
            create_and_edit: 'Create & Edit'
        },
        todo: {
            title: 'To-do List',
            add_placeholder: 'Add a to-do...',
            description_placeholder: 'Add a description (optional)...',
            show_archive: 'Show Archive',
            hide_archive: 'Hide Archive',
            no_active: 'No active to-dos.'
        },
        page_version: {
            failed_to_load: 'Failed to load versions',
            approved_successfully: 'Version approved successfully',
            failed_to_approve: 'Failed to approve version',
            reverted_successfully: 'Version reverted successfully',
            failed_to_revert: 'Failed to revert version'
        },
        section: {
            heading_copied: 'Heading copied to clipboard!',
            heading_copy_failed: 'Failed to copy heading to clipboard.'
        },
        customer: {
            new_customer: 'New customer',
            name: 'Name',
            email: 'Email'
        },
        focus_timer: {
            start: 'Start',
            pause: 'Pause'
        },
        label_image: 'Image'
    }
})
