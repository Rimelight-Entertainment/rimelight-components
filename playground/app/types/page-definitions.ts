import { definePageDefinition, type Localized, type Property } from "../../../src/runtime/types/pages"

export const CHARACTER_DEFINITION = definePageDefinition({
    properties: {
        identity: {
            label: { en: "Identity" },
            fields: {
                name: { value: { en: "" } as Localized, label: "Name", type: "text" as const },
                title: { value: { en: "" } as Localized, label: "Social Title", type: "text" as const },
                aliases: { value: [] as Localized[], label: "Aliases", type: "text-array" as const },
            }
        },
        characteristics: {
            label: { en: "Characteristics" },
            fields: {
                species: { value: "", label: "Species", type: "page" as const, allowedPageTypes: ["Species"] },
                sex: { value: "Unknown", label: "Sex", type: "enum" as const, options: ["Male", "Female", "Other", "Unknown"] },
                height: { value: 0, label: "Height", type: "number" as const },
                weight: { value: 0, label: "Weight", type: "number" as const },
            }
        }
    },
    initialBlocks: () => [
        { id: "appearance", type: "SectionBlock", props: { level: 2, title: "Appearance", children: [] }, isTemplated: true },
        { id: "abilities", type: "SectionBlock", props: { level: 2, title: "Abilities", children: [] }, isTemplated: true },
        { id: "history", type: "SectionBlock", props: { level: 2, title: "History", children: [] }, isTemplated: true }
    ]
})

export const HERO_DEFINITION = definePageDefinition({
    properties: {
        combat: {
            label: { en: "Combat Stats" },
            fields: {
                class: { value: "Warrior", label: "Class", type: "enum" as const, options: ["Warrior", "Mage", "Rogue", "Paladin"] },
                difficulty: { value: 1, label: "Difficulty", type: "number" as const },
                primaryRole: { value: "Tank", label: "Primary Role", type: "enum" as const, options: ["Tank", "DPS", "Support"] }
            }
        },
        progression: {
            label: { en: "Progression" },
            fields: {
                baseHp: { value: 500, label: "Base HP", type: "number" as const },
                baseMana: { value: 100, label: "Base Mana", type: "number" as const }
            }
        }
    },
    initialBlocks: () => [
        { id: "playstyle", type: "SectionBlock", props: { level: 2, title: "Playstyle", children: [] }, isTemplated: true },
        { id: "lore", type: "SectionBlock", props: { level: 2, title: "Background Lore", children: [] }, isTemplated: true }
    ]
})

export const SKILL_DEFINITION = definePageDefinition({
    properties: {
        mechanics: {
            label: { en: "Mechanics" },
            fields: {
                cooldown: { value: 10, label: "Cooldown (sec)", type: "number" as const },
                manaCost: { value: 50, label: "Mana Cost", type: "number" as const },
                damageType: { value: "Physical", label: "Damage Type", type: "enum" as const, options: ["Physical", "Magic", "True", "None"] }
            }
        }
    }
})

export const ITEM_DEFINITION = definePageDefinition({
    properties: {
        details: {
            label: { en: "Item Details" },
            fields: {
                rarity: { value: "Common", label: "Rarity", type: "enum" as const, options: ["Common", "Uncommon", "Rare", "Epic", "Legendary"] },
                price: { value: 100, label: "Gold Price", type: "number" as const },
                isQuestItem: { value: "No", label: "Quest Item", type: "enum" as const, options: ["Yes", "No"] }
            }
        }
    }
})

export const LOCATION_DEFINITION = definePageDefinition({
    properties: {
        geography: {
            label: { en: "Geography" },
            fields: {
                region: { value: { en: "" } as Localized, label: "Region", type: "text" as const },
                climate: { value: "Temperate", label: "Climate", type: "text" as const }
            }
        }
    }
})

export const SPECIES_DEFINITION = definePageDefinition({
    properties: {
        biology: {
            label: { en: "Biology" },
            fields: {
                lifespan: { value: { en: "" } as Localized, label: "Average Lifespan", type: "text" as const },
                homeworld: { value: "", label: "Homeworld", type: "page" as const, allowedPageTypes: ["Location"] }
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
    }
})

export const GAME_DEFINITION = definePageDefinition({
    properties: {
        info: {
            label: { en: "Game Information" },
            fields: {
                developer: { value: { en: "" } as Localized, label: "Developer", type: "text" as const },
                platform: { value: { en: "" } as Localized, label: "Platform", type: "text" as const },
                rating: { value: 0, label: "Rating", type: "number" as const }
            }
        }
    }
})

export const BLOG_POST_DEFINITION = definePageDefinition({
    properties: {
        meta: {
            label: { en: "Post Metadata" },
            fields: {
                category: { value: "News", label: "Category", type: "enum" as const, options: ["News", "Guide", "Update", "Community"] },
                readingTime: { value: 5, label: "Est. Reading Time", type: "number" as const }
            }
        }
    }
})

export const PATCH_NOTE_DEFINITION = definePageDefinition({
    properties: {
        version: {
            label: { en: "Version Info" },
            fields: {
                versionNumber: { value: "1.0.0", label: "Version Number", type: "text" as const },
                releaseDate: { value: { en: "" } as Localized, label: "Release Date", type: "text" as const }
            }
        }
    }
})
