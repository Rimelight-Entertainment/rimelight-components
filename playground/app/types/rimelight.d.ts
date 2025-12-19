import type {
    CHARACTER_DEFINITION,
    CARD_DEFINITION,
    MOVIE_DEFINITION,
    GAME_DEFINITION,
    HERO_DEFINITION,
    SKILL_DEFINITION,
    ITEM_DEFINITION,
    LOCATION_DEFINITION,
    SPECIES_DEFINITION,
    BLOG_POST_DEFINITION,
    PATCH_NOTE_DEFINITION
} from "./page-definitions"

declare global {
    interface RimelightRegisterPageTypes {
        Character: typeof CHARACTER_DEFINITION.properties
        Card: typeof CARD_DEFINITION.properties
        Movie: typeof MOVIE_DEFINITION.properties
        Game: typeof GAME_DEFINITION.properties
        Hero: typeof HERO_DEFINITION.properties
        Skill: typeof SKILL_DEFINITION.properties
        Item: typeof ITEM_DEFINITION.properties
        Location: typeof LOCATION_DEFINITION.properties
        Species: typeof SPECIES_DEFINITION.properties
        BlogPost: typeof BLOG_POST_DEFINITION.properties
        PatchNote: typeof PATCH_NOTE_DEFINITION.properties
    }
}

export { }
