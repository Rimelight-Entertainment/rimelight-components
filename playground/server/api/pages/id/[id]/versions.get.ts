export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    await new Promise(resolve => setTimeout(resolve, 500))

    return [
        {
            id: "v1",
            pageId: id,
            status: "approved",
            type: "Movie",
            title: { en: "The Matrix (Original Version)" },
            authorIds: ["user-1"],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            content: {
                blocks: [],
                properties: {}
            }
        },
        {
            id: "v2",
            pageId: id,
            status: "pending",
            type: "Movie",
            title: { en: "The Matrix (Draft Changes)" },
            authorIds: ["user-1"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            content: {
                blocks: [],
                properties: {}
            }
        }
    ]
})
