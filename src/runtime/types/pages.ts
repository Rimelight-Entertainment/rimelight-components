import { type Image } from "../types/schemas"
import { type Block } from "./blocks"

export type PageType = "Default" | "Location" | "Species" | "Character" | "Object" | "Tale" | "Item" | "Skill" | "Hero" | "Card" | "Series" | "Episode"

export interface Property {
  // The human-readable label to display
  label: string
  // Type of data/renderer
  type: "number" | "text" | "text-array" | "enum" | "page" | "page-array"
  // Optional: For union type, defines the available options
  options?: string[]
  // Required for types "page" and "page-array", specifies the PageType to link to
  allowedPageTypes?: PageType[]
  // Optional display order for properties within a category
  order?: number
  // A function that returns true/false based on current page data
  visibleIf?: (properties: any) => boolean
}

export interface PropertyGroup {
  id: string
  label: string
  order?: number
  fields: Record<string, Property>
}

export interface BasePageProperties {

}

export interface LocationProperties extends BasePageProperties {

}

export interface SpeciesProperties extends BasePageProperties {

}

export interface CharacterProperties extends BasePageProperties {
  name: string
  title?: string
  aliases?: string[]
  flavourText?: string
  species?: string
  sex?: string
  pronouns?: string
  height?: number
  weight?: number
  dateOfBirth?: string
  dateOfDeath?: string
  placeOfBirth?: string
  placeOfDeath?: string
  formerAffiliations?: string[]
  currentAffiliations?: string[]
  equipment?: string[]
  pets?: string[]
  mounts?: string[]
  favouriteFood?: string
}

export interface ObjectProperties extends BasePageProperties {

}

export interface TaleProperties extends BasePageProperties {

}

export interface ItemProperties extends BasePageProperties {

}

export interface SkillProperties extends BasePageProperties {

}

export interface HeroProperties extends BasePageProperties {

}

export interface CardProperties extends BasePageProperties {
  name: string
  alignment: string
  type: string
  flavourText: string
}

export interface SeriesProperties extends BasePageProperties {

}

export interface EpisodeProperties extends BasePageProperties {

}

export type Localized<T = string> = Record<string, T>;

/**
 * Common fields shared by every page regardless of type.
 */
interface BasePage {
  id: string
  slug: string
  image?: Image
  title: Localized<string>
  description?: Localized<string>
  tags: Localized<string>[]
  blocks: Block[]
  createdAt: string
  updatedAt: string
}

/**
 * Discriminated Union for Page Data structure
 */
export type Page =
  | { type: "Default"; properties: BasePageProperties } & BasePage
  | { type: "Character"; properties: CharacterProperties } & BasePage
  | { type: "Card"; properties: CardProperties } & BasePage
  | { type: "Location"; properties: BasePageProperties } & BasePage
  | { type: "Species"; properties: BasePageProperties } & BasePage
  | { type: "Object"; properties: BasePageProperties } & BasePage
  | { type: "Tale"; properties: BasePageProperties } & BasePage
  | { type: "Item"; properties: BasePageProperties } & BasePage
  | { type: "Skill"; properties: BasePageProperties } & BasePage
  | { type: "Hero"; properties: BasePageProperties } & BasePage
  | { type: "Series"; properties: BasePageProperties } & BasePage
  | { type: "Episode"; properties: BasePageProperties } & BasePage

/**
 * Registry mapping PageTypes to their UI schema.
 * This drives the dynamic form generation in the Sidebar.
 */
export const PAGE_SCHEMAS: Record<PageType, PropertyGroup[]> = {
  Default: [],
  Character: [
    {
      id: "identity",
      label: "Identity",
      fields: {
        name: { label: "Name", type: "text" },
        title: { label: "Social Title", type: "text" },
        aliases: { label: "Aliases", type: "text-array" },
      }
    },
    {
      id: "characteristics",
      label: "Characteristics",
      fields: {
        species: { label: "Species", type: "page", allowedPageTypes: ["Species"] },
        sex: { label: "Sex", type: "enum", options: ["Male", "Female", "Other", "Unknown"] },
        height: { label: "Height", type: "number" },
        weight: { label: "Weight", type: "number" },
      }
    },
    {
      id: "timeline",
      label: "Timeline",
      fields: {
        dateOfBirth: { label: "Date of Birth", type: "text" },
        dateOfDeath: { label: "Date of Death", type: "text" },
        placeOfDeath: {
          label: "Place of Death",
          type: "text",
          visibleIf: (props: CharacterProperties) => !!props.dateOfDeath
        }
      }
    },
    {
      id: "other",
      label: "Other",
      order: 3,
      fields: {
        flavourText: { label: "Flavour Text", type: "text" }
      }
    }
  ],
  Location: [],
  Species: [],
  Object: [],
  Tale: [],
  Item: [],
  Skill: [],
  Hero: [],
  Card: [],
  Series: [],
  Episode: []
}