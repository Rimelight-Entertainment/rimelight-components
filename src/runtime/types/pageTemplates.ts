import { v7 as uuidv7 } from "uuid"
import { type Block } from "./blocks"
import { type PageType } from "./pages"

export const PAGE_TEMPLATES: Record<PageType, () => Block[]> = {
  Default: () => [],
  Document: () => [],
  BlogPost: () => [],
  PatchNote: () => [],
  Character: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Appearance", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Abilities", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "History", children: [] }
    }
  ],

  Location: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Geography", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Points of Interest", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "History", children: [] }
    }
  ],

  Species: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Biology", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Culture", children: [] }
    }
  ],

  Object: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Description", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Properties", children: [] }
    }
  ],

  Tale: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Summary", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "The Story", children: [] }
    }
  ],

  Item: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Statistics", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Lore", children: [] }
    }
  ],

  Skill: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Effects", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Acquisition", children: [] }
    }
  ],

  Hero: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Background", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Legacy", children: [] }
    }
  ],

  Card: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Card Art", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Game Mechanics", children: [] }
    }
  ],

  Series: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Synopsis", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "List of Episodes", children: [] }
    }
  ],

  Episode: () => [
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Plot Summary", children: [] }
    },
    {
      id: uuidv7(),
      type: "SectionBlock",
      isTemplated: true,
      props: { level: 2, title: "Characters Appearing", children: [] }
    }
  ]
}