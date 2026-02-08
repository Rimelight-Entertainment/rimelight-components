export type Messages = {
    common: {
        cancel: string
        close: string
        save: string
        create: string
        delete: string
        edit: string
        update: string
        preview: string
        success: string
        archive: string
        versions: string
    }
    swatch: {
        copy_hex: string
        copy_rgb: string
        copy_hsl: string
        copy_oklch: string
        copy_cmyk: string
        download_jpg: string
        download_png: string
        download_webp: string
        download_svg: string
        color_copied: string
        color_copy_failed: string
        copy_error_description: string
    }
    font_palette: {
        specimen: string
        hierarchy: string
        color: string
        uppercase: string
        lowercase: string
        numbers: string
        symbols: string
        heading_1: string
        heading_2: string
        heading_3: string
        heading_4: string
        heading_5: string
        heading_6: string
    }
    page_editor: {
        preview: string
        save: string
        create_page: string
        delete_page: string
        viewing_version_notice: string
        metadata: string
        page_id: string
        created_at: string
        posted_at: string
        updated_at: string
    }
    page_properties: {
        links: string
        no_links: string
        add_link: string
        edit_link: string
        update_link: string
        label: string
        url: string
        icon: string
        color: string
        variant: string
        page_template: string
        title: string
        slug: string
        create_and_edit: string
    }
    todo: {
        title: string
        add_placeholder: string
        description_placeholder: string
        show_archive: string
        hide_archive: string
        no_active: string
    }
    page_version: {
        failed_to_load: string
        approved_successfully: string
        failed_to_approve: string
        reverted_successfully: string
        failed_to_revert: string
    }
    section: {
        heading_copied: string
        heading_copy_failed: string
    }
    customer: {
        new_customer: string
        name: string
        email: string
    }
    focus_timer: {
        start: string
        pause: string
    }
    label_image: string
}

export type Direction = 'ltr' | 'rtl'

export type Locale<M> = {
    name: string
    code: string
    dir: Direction
    messages: M
}
