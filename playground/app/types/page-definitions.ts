import { definePageDefinition } from "rimelight-components/utils"

export const MOVIE_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.movie",
  properties: {
    info: {
      label: { en: "Movie Information" },
      defaultOpen: true,
      fields: {
        director: { value: { en: "" }, label: { en: "Director" }, type: "text" },
        releaseYear: { value: 0, label: { en: "Release Year" }, type: "number" },
        genre: { value: { en: "" }, label: { en: "Genre" }, type: "text" },
        cast: { value: [], label: { en: "Cast" }, type: "text-array" },
        sequel: {
          value: "",
          label: { en: "Sequel" },
          type: "page",
          allowedPageTypes: ["Movie"]
        },
        relatedMedia: {
          value: [],
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
          value: { en: "Warner Bros." },
          label: { en: "Lead Studio" },
          type: "text"
        },
        budget: {
          value: 63000000,
          label: { en: "Budget (USD)" },
          type: "number"
        },
        status: {
          value: "Released",
          label: { en: "Current Status" },
          type: "enum",
          options: ["Pre-Production", "Filming", "Post-Production", "Released"]
        },
        locations: {
          value: [{ en: "Sydney, Australia" }, { en: "San Francisco, USA" }],
          label: { en: "Filming Locations" },
          type: "text-array"
        }
      }
    }
  },
  initialBlocks: () => []
})

declare global {
  interface RimelightRegisterPageTypes {
    Movie: typeof MOVIE_DEFINITION.properties
  }
}

export const PAGE_MAP = {
  Movie: MOVIE_DEFINITION
}
