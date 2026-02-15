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
        label: "blocks.SectionBlock.label",
        icon: "i-lucide-heading",
        category: "Layout",
        description: "blocks.SectionBlock.description"
    },

    {
        type: "ParagraphBlock",
        label: "blocks.ParagraphBlock.label",
        icon: "i-lucide-pilcrow",
        category: "Text",
        description: "blocks.ParagraphBlock.description"
    },
    {
        type: "ImageBlock",
        label: "blocks.ImageBlock.label",
        icon: "i-lucide-image",
        category: "Media",
        description: "blocks.ImageBlock.description"
    },
    {
        type: "CalloutBlock",
        label: "blocks.CalloutBlock.label",
        icon: "i-lucide-info",
        category: "Special",
        description: "blocks.CalloutBlock.description"
    }
]
