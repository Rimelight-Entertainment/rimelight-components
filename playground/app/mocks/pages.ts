import { type Page, type PageSurround } from "../../../src/runtime/types"

/*
 * Mock Page Data
 */
export const MOCK_MOVIE_PAGE: Page = {
  id: "movie-1",
  type: "Movie",
  slug: "the-matrix",
  icon: {
    src: "https://placehold.co/100x100",
    alt: "The Matrix Icon",
    width: 100,
    height: 100
  },
  banner: {
    src: "https://placehold.co/1920x1080",
    alt: "The Matrix Digital Rain Banner",
    width: 1920,
    height: 1080
  },
  images: [
    {
      src: "https://placehold.co/800x600",
      alt: "Neo in the office",
      width: 800,
      height: 600,
      name: { en: "Neo in Office" }
    },
    {
      src: "https://placehold.co/600x800",
      alt: "Morpheus offering pills",
      width: 600,
      height: 800,
      name: { en: "Morpheus Offering Pills" }
    },
    {
      src: "https://placehold.co/1920x1080",
      alt: "Trinity rooftop jump",
      width: 1920,
      height: 1080,
      name: { en: "Rooftop Jump" }
    }
  ],
  title: { en: "The Matrix" },
  description: {
    en: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
  },
  tags: [{ en: "SCI-FI" }, { en: "Action" }],
  links: [
    {
      label: "Official Website",
      to: "https://www.warnerbros.com/movies/matrix",
      icon: "lucide:external-link"
    },
    {
      label: "IMDb Profile",
      to: "https://www.imdb.com/title/tt0133093/",
      icon: "simple-icons:imdb"
    },
    {
      label: "Watch Trailer",
      to: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      icon: "lucide:play"
    }
  ],
  blocks: [
    {
      id: "1",
      type: "SectionBlock",
      props: { level: 2, title: "Plot Summary", children: [] }
    },
    {
      id: "2",
      type: "SectionBlock",
      props: { level: 2, title: "Box Office", children: [] }
    },
    {
      id: "3",
      type: "SectionBlock",
      props: { level: 2, title: "Reception", children: [] }
    },
    {
      id: "4",
      type: "SectionBlock",
      props: { level: 2, title: "Trivia", children: [] }
    },
    {
      id: "5",
      type: "SectionBlock",
      props: { level: 2, title: "References", children: [] }
    }
  ],
  properties: {
    info: {
      label: { en: "Movie Information" },
      defaultOpen: true,
      fields: {
        director: { value: { en: "The Wachowskis" }, label: { en: "Director" }, type: "text" },
        releaseYear: { value: 1999, label: { en: "Release Year" }, type: "number" },
        genre: { value: { en: "Sci-Fi" }, label: { en: "Genre" }, type: "text" },
        cast: {
          value: [{ en: "Keanu Reeves" }, { en: "Laurence Fishburne" }, { en: "Carrie-Anne Moss" }],
          label: { en: "Cast" },
          type: "text-array"
        },
        sequel: {
          value: "movie-2",
          label: { en: "Sequel" },
          type: "page",
          allowedPageTypes: ["Movie"]
        },
        relatedMedia: {
          value: ["movie-1", "movie-1"],
          label: { en: "Related Media" },
          type: "page-array",
          allowedPageTypes: ["Movie"]
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
  created_at: new Date(),
  posted_at: new Date(),
  updated_at: new Date()
}

/**
 * Mock Surround Data
 */
export const MOCK_MOVIE_SURROUND: PageSurround = {
  previous: {
    id: "movie-0",
    slug: "dark-city",
    title: { en: "Dark City" },
    description: {
      en: "A man struggles with memories of his past in a world shut off from the sun."
    }
  },
  next: {
    id: "movie-2",
    slug: "the-matrix-reloaded",
    title: { en: "The Matrix Reloaded" },
    description: {
      en: "Neo and the rebel leaders estimate they have 72 hours until 250,000 probes discover Zion."
    }
  }
}
