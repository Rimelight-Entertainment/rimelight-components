import { defineEventHandler, createError, readBody, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const cloudflare = (event.context as any).cloudflare;
  const reqUrl = event.node.req.url || "";
  const url = new URL(reqUrl, 'http://localhost');
  const pathParts = url.pathname.split('/api/assets/');
  const key = pathParts.length > 1 ? decodeURIComponent(pathParts[1]!) : null;

  if (!cloudflare || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: `Context or source key missing (key: ${key})`,
    });
  }

  const { env } = cloudflare;
  const BLOB = env.BLOB as any;
  const { to } = await readBody(event);

  if (!to) {
    throw createError({
      statusCode: 400,
      statusMessage: "Destination key 'to' is required",
    });
  }

  try {
    // 1. Get the original object metadata
    const original = await BLOB.get(key);
    if (!original) {
      throw createError({
        statusCode: 404,
        statusMessage: `Source asset not found: ${key}`,
      });
    }

    // 2. Put to new location
    // We use original.body directly as it's a ReadableStream.
    // For smaller files, R2 handles this efficiently.
    await BLOB.put(to, original.body, {
      httpMetadata: original.httpMetadata,
      customMetadata: original.customMetadata,
    });

    // 3. Delete original
    await BLOB.delete(key);

    return { success: true, from: key, to };
  } catch (err: any) {
    console.error(`Move/Rename failed from ${key} to ${to}:`, err);
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to move/rename asset",
      data: { error: err.toString(), from: key, to }
    });
  }
});
