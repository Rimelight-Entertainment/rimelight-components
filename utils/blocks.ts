import { type BlockType } from "../types"

export interface BlockDefinition {
    type: BlockType
    label: string
    icon: string
    category: string
    description?: string
}

export const CATEGORY_ORDER = ["Layout", "Text", "Media", "Special"]

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
    {
        type: "SectionBlock",
        label: "Section",
        icon: "i-lucide-heading",
        category: "Layout",
        description: "A header section to organice your page."
    },

    {
        type: "ParagraphBlock",
        label: "Paragraph",
        icon: "i-lucide-pilcrow",
        category: "Text",
        description: "Standard text block for your content."
    },
    {
        type: "ImageBlock",
        label: "Image",
        icon: "i-lucide-image",
        category: "Media",
        description: "Embed an image from a URL."
    },
    {
        type: "CalloutBlock",
        label: "Callout",
        icon: "i-lucide-info",
        category: "Special",
        description: "Highlight important information."
    }
]
