import { definePageDefinition } from "#rimelight-components/utils/cms"

export const DOCUMENT_DEFINITION = definePageDefinition({
    typeLabelKey: "page.type.document",
    properties: {
        meta: {
            label: { en: "Document Metadata" },
            defaultOpen: true,
            fields: {
                category: {
                    value: "News",
                    label: { en: "Category" },
                    type: "enum",
                    options: ["News", "Guide", "Update", "Community"]
                },
                readingTime: { value: 5, label: { en: "Est. Reading Time" }, type: "number" }
            }
        }
    }
})

export const BLOG_POST_DEFINITION = definePageDefinition({
    typeLabelKey: "page.type.blogPost",
    properties: {
        meta: {
            label: { en: "Post Metadata" },
            defaultOpen: true,
            fields: {
                category: {
                    value: "News",
                    label: { en: "Category" },
                    type: "enum",
                    options: ["News", "Guide", "Update", "Community"]
                },
                readingTime: { value: 5, label: { en: "Est. Reading Time" }, type: "number" }
            }
        }
    }
})
