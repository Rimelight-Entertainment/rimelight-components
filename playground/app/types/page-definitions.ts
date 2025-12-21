export const MOVIE_DEFINITION = definePageDefinition({
    properties: {
        info: {
            label: {en: "Movie Information"},
            defaultOpen: true,
            fields: {
                director: {value: {en: ""}, label: {en: "Director"}, type: "text"},
                releaseYear: {value: 0, label: {en: "Release Year"}, type: "number"},
                genre: {value: {en: ""}, label: {en: "Genre"}, type: "text"},
                cast: {value: [], label: {en: "Cast"}, type: "text-array"}
            }
        },
        production: {
            label: { en: 'Production & Distribution' },
            defaultOpen: false,
            fields: {
                studio: {
                    value: { en: 'Warner Bros.' },
                    label: { en: 'Lead Studio' },
                    type: 'text'
                },
                budget: {
                    value: 63000000,
                    label: { en: 'Budget (USD)' },
                    type: 'number'
                },
                status: {
                    value: 'Released',
                    label: { en: 'Current Status' },
                    type: 'enum',
                    options: ['Pre-Production', 'Filming', 'Post-Production', 'Released']
                },
                locations: {
                    value: [{ en: 'Sydney, Australia' }, { en: 'San Francisco, USA' }],
                    label: { en: 'Filming Locations' },
                    type: 'text-array'
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