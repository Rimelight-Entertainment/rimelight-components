import { type Localized } from "../../../src/runtime/types"

export const DOCUMENT_DEFINITION = definePageDefinition({
    properties: {
        meta: {
            label: { en: "Document Metadata" },
            fields: {
                category: {
                    value: "News",
                    label: "Category",
                    type: "enum" as const,
                    options: ["News", "Guide", "Update", "Community"]
                },
                readingTime: { value: 5, label: "Est. Reading Time", type: "number" as const }
            }
        }
    }
})

export const MOVIE_DEFINITION = definePageDefinition({
    properties: {
        info: {
            label: { en: "Movie Information" },
            fields: {
                director: { value: { en: "" } as Localized, label: "Director", type: "text" as const },
                releaseYear: { value: 0, label: "Release Year", type: "number" as const },
                genre: { value: { en: "" } as Localized, label: "Genre", type: "text" as const },
                cast: { value: [] as Localized[], label: "Cast", type: "text-array" as const }
            }
        }
    },
    initialBlocks: () => []
})

export const GAME_DEFINITION = definePageDefinition({
    properties: {
        info: {
            label: { en: "Game Information" },
            fields: {
                developer: { value: { en: "" } as Localized, label: "Developer", type: "text" as const },
                rating: { value: 0, label: "Rating", type: "number" as const },
                platforms: { value: [] as Localized[], label: "Platforms", type: "text-array" as const }
            }
        }
    },
    initialBlocks: () => []
})

declare global {
    interface RimelightRegisterPageTypes {
        Document: typeof DOCUMENT_DEFINITION.properties
        Movie: typeof MOVIE_DEFINITION.properties
        Game: typeof GAME_DEFINITION.properties
    }
}