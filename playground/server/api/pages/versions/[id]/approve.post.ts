export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  console.log(`[Mock API] Approving version: ${id}`);

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    message: `Version ${id} approved successfully (Mocked)`,
  };
});
