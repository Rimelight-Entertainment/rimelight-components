import { type Image } from "../types"
import { type Block } from "../types"

declare global {
  interface RimelightRegisterPageTypes { }
}

export type PageType = keyof RegisterPageTypes

export interface Property<T = any> {
  // The data value
  value: T
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


export type Localized<T = string> = Record<string, T>;

export interface PropertyGroup {
  label: Localized<string>
  order?: number
  fields: Record<string, Property>
}


/**
 * A PageTemplate is the single definition for a page's properties and initial blocks.
 */
export interface PageDefinition {
  properties: Record<string, PropertyGroup>
  initialBlocks?: () => Block[]
}

/**
 * Helper to define a page with full type safety and literal preservation.
 * This is used by consuming apps to define their custom page types.
 */
export function definePageDefinition<T extends PageDefinition>(def: T): T {
  return def
}

export interface BasePageProperties { }

export interface RegisterPageTypes extends RimelightRegisterPageTypes {
  Default: BasePageProperties
}



/**
 * Common fields shared by every page regardless of type.
 */
export interface BasePage {
  id: string
  slug: string
  image?: Image
  title: Localized<string>
  description?: Localized<string>
  tags?: Localized<string>[]
  authorsIds?: string[]
  blocks: Block[]
  posted_at?: string
  createdAt: string
  updatedAt: string
}

/**
 * Discriminated Union for Page Data structure
 */
export type Page = {
  [K in PageType]: { type: K; properties: RegisterPageTypes[K] } & BasePage
}[PageType]