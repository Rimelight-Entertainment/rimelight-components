import { definePageDefinition } from "#layers/rimelight-components/app/utils"

export const MOVIE_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.movie",
  properties: {
    info: {
      label: { en: "Movie Information" },
      defaultOpen: true,
      fields: {
        director: { defaultValue: { en: "" }, label: { en: "Director" }, type: "text" },
        releaseYear: { defaultValue: 0, label: { en: "Release Year" }, type: "number" },
        genre: { defaultValue: { en: "" }, label: { en: "Genre" }, type: "text" },
        cast: { defaultValue: [], label: { en: "Cast" }, type: "text-array" },
        sequel: {
          defaultValue: "",
          label: { en: "Sequel" },
          type: "page",
          allowedPageTypes: ["Movie"]
        },
        relatedMedia: {
          defaultValue: [],
          label: { en: "Related Media" },
          type: "page-array",
          allowedPageTypes: ["Movie", "Default"]
        }
      }
    },
    production: {
      label: { en: "Production & Distribution" },
      defaultOpen: false,
      fields: {
        studio: {
          defaultValue: { en: "Warner Bros." },
          label: { en: "Lead Studio" },
          type: "text"
        },
        budget: {
          defaultValue: 63000000,
          label: { en: "Budget (USD)" },
          type: "number"
        },
        status: {
          defaultValue: "Released",
          label: { en: "Current Status" },
          type: "enum",
          options: ["Pre-Production", "Filming", "Post-Production", "Released"]
        },
        locations: {
          defaultValue: [{ en: "Sydney, Australia" }, { en: "San Francisco, USA" }],
          label: { en: "Filming Locations" },
          type: "text-array"
        }
      }
    }
  },
  initialBlocks: () => []
})

export const WIKI_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.wiki",
  properties: {},
  initialBlocks: () => []
})

declare global {
  interface RimelightRegisterPageTypes {
    Movie: typeof MOVIE_DEFINITION.properties
    Wiki: typeof WIKI_DEFINITION.properties
  }
}

export const PAGE_MAP = {
  Movie: MOVIE_DEFINITION,
  Wiki: WIKI_DEFINITION
}
