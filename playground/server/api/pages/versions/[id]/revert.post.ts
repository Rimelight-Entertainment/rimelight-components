export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    console.log(`[Mock API] Reverting to version: ${id}`)

    await new Promise(resolve => setTimeout(resolve, 800))

    return {
        success: true,
        message: `Reverted to version ${id} (Mocked)`
    }
})
