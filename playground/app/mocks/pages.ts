import { type Page, type PageSurround } from "rimelight-components/types";

/*
 * Mock Page Data
 */
export const MOCK_MOVIE_PAGE: Page = {
  id: "movie-1",
  type: "Movie",
  slug: "matrix/the-matrix",
  icon: {
    src: "https://placehold.co/100x100",
    alt: "The Matrix Icon",
    width: 100,
    height: 100,
  },
  banner: {
    src: "https://placehold.co/1920x1080",
    alt: "The Matrix Digital Rain Banner",
    width: 1920,
    height: 1080,
  },
  images: [
    {
      src: "https://placehold.co/800x600",
      alt: "Neo in the office",
      width: 800,
      height: 600,
      name: { en: "Neo in Office" },
    },
    {
      src: "https://placehold.co/600x800",
      alt: "Morpheus offering pills",
      width: 600,
      height: 800,
      name: { en: "Morpheus Offering Pills" },
    },
    {
      src: "https://placehold.co/1920x1080",
      alt: "Trinity rooftop jump",
      width: 1920,
      height: 1080,
      name: { en: "Rooftop Jump" },
    },
  ],
  title: { en: "The Matrix" },
  description: {
    en: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  },
  tags: [{ en: "SCI-FI" }, { en: "Action" }],
  links: [
    {
      label: "Official Website",
      to: "https://www.warnerbros.com/movies/matrix",
      icon: "lucide:external-link",
    },
    {
      label: "IMDb Profile",
      to: "https://www.imdb.com/title/tt0133093/",
      icon: "simple-icons:imdb",
    },
    {
      label: "Watch Trailer",
      to: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      icon: "lucide:play",
    },
  ],
  blocks: [
    {
      id: "1",
      type: "SectionBlock",
      props: { level: 2, title: "Plot Summary", children: [] },
    },
    {
      id: "2",
      type: "SectionBlock",
      props: { level: 2, title: "Box Office", children: [] },
    },
    {
      id: "3",
      type: "SectionBlock",
      props: { level: 2, title: "Reception", children: [] },
    },
    {
      id: "4",
      type: "SectionBlock",
      props: { level: 2, title: "Trivia", children: [] },
    },
    {
      id: "5",
      type: "SectionBlock",
      props: { level: 2, title: "References", children: [] },
    },
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
          type: "text-array",
        },
        sequel: {
          value: "movie-2",
          label: { en: "Sequel" },
          type: "page",
          allowedPageTypes: ["Movie"],
        },
        relatedMedia: {
          value: ["movie-1", "movie-1"],
          label: { en: "Related Media" },
          type: "page-array",
          allowedPageTypes: ["Movie"],
        },
      },
    },
    production: {
      label: { en: "Production & Distribution" },
      defaultOpen: false,
      fields: {
        studio: {
          value: { en: "Warner Bros." },
          label: { en: "Lead Studio" },
          type: "text",
        },
        budget: {
          value: 63000000,
          label: { en: "Budget (USD)" },
          type: "number",
        },
        status: {
          value: "Released",
          label: { en: "Current Status" },
          type: "enum",
          options: ["Pre-Production", "Filming", "Post-Production", "Released"],
        },
        locations: {
          value: [{ en: "Sydney, Australia" }, { en: "San Francisco, USA" }],
          label: { en: "Filming Locations" },
          type: "text-array",
        },
      },
    },
  },
  createdAt: new Date(),
  postedAt: new Date(),
  updatedAt: new Date(),
};

export const MOCK_FRANCHISE_PAGE: Page = {
  id: "franchise-1",
  type: "Wiki",
  slug: "matrix",
  title: { en: "The Matrix Franchise" },
  description: {
    en: "A media franchise consisting of four feature films, starting with The Matrix (1999) and continuing with three sequels.",
  },
  blocks: [
    { id: "f1", type: "SectionBlock", props: { level: 2, title: "Films", children: [] } },
    { id: "f2", type: "SectionBlock", props: { level: 2, title: "Impact", children: [] } },
  ],
  properties: {},
  createdAt: new Date(),
  postedAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock List of Pages for Tree
 */
export const MOCK_PAGES_LIST: Page[] = [
  MOCK_FRANCHISE_PAGE,
  {
    ...MOCK_MOVIE_PAGE,
    slug: "matrix/the-matrix",
  },
  {
    ...MOCK_MOVIE_PAGE,
    id: "movie-2",
    slug: "matrix/the-matrix-reloaded",
    title: { en: "The Matrix Reloaded" },
    description: {
      en: "Neo and the rebel leaders estimate they have 72 hours until 250,000 probes discover Zion.",
    },
    blocks: [
      { id: "r1", type: "SectionBlock", props: { level: 2, title: "Zion", children: [] } },
      { id: "r2", type: "SectionBlock", props: { level: 2, title: "The Architect", children: [] } },
    ],
    properties: {
      ...MOCK_MOVIE_PAGE.properties,
      info: {
        label: { en: "Movie Information" },
        defaultOpen: true,
        ...MOCK_MOVIE_PAGE.properties.info,
        fields: {
          ...(MOCK_MOVIE_PAGE.properties.info?.fields || {}),
          releaseYear: { value: 2003, label: { en: "Release Year" }, type: "number" },
        },
      },
    },
  },
  {
    ...MOCK_MOVIE_PAGE,
    id: "movie-3",
    slug: "matrix/the-matrix-revolutions",
    title: { en: "The Matrix Revolutions" },
    description: {
      en: "The human city of Zion defends itself against the massive invasion of the machines.",
    },
    blocks: [
      {
        id: "rev1",
        type: "SectionBlock",
        props: { level: 2, title: "The Battle for Zion", children: [] },
      },
      { id: "rev2", type: "SectionBlock", props: { level: 2, title: "Club Hel", children: [] } },
    ],
    properties: {
      ...MOCK_MOVIE_PAGE.properties,
      info: {
        label: { en: "Movie Information" },
        defaultOpen: true,
        ...MOCK_MOVIE_PAGE.properties.info,
        fields: {
          ...(MOCK_MOVIE_PAGE.properties.info?.fields || {}),
          releaseYear: { value: 2003, label: { en: "Release Year" }, type: "number" },
        },
      },
    },
  },
];

/**
 * Mock Versions
 */
export const MOCK_VERSIONS = [
  {
    id: "v1",
    pageId: "movie-1",
    status: "approved",
    type: "Movie",
    title: { en: "The Matrix (Original Version)" },
    authorsIds: ["user-1"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    content: {
      blocks: MOCK_MOVIE_PAGE.blocks,
      properties: MOCK_MOVIE_PAGE.properties,
    },
  },
  {
    id: "v2",
    pageId: "movie-1",
    status: "pending",
    type: "Movie",
    title: { en: "The Matrix (Draft Changes)" },
    authorsIds: ["user-1"],
    createdAt: new Date(),
    updatedAt: new Date(),
    content: {
      blocks: MOCK_MOVIE_PAGE.blocks,
      properties: MOCK_MOVIE_PAGE.properties,
    },
  },
];

/**
 * Mock Surround Data
 */
export const MOCK_MOVIE_SURROUND: PageSurround = {
  previous: {
    id: "movie-0",
    slug: "dark-city",
    title: { en: "Dark City" },
    description: {
      en: "A man struggles with memories of his past in a world shut off from the sun.",
    },
  },
  next: {
    id: "movie-2",
    slug: "matrix/the-matrix-reloaded",
    title: { en: "The Matrix Reloaded" },
    description: {
      en: "Neo and the rebel leaders estimate they have 72 hours until 250,000 probes discover Zion.",
    },
  },
};
