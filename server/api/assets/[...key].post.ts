import { defineEventHandler, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const cloudflare = (event.context as any).cloudflare;
  const key = event.context.params?.key;

  if (!cloudflare || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: "Context or source key missing",
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

  // 1. Get the original object metadata
  const original = await BLOB.get(key);
  if (!original) {
    throw createError({
      statusCode: 404,
      statusMessage: "Source asset not found",
    });
  }

  // 2. Put to new location
  // Note: Body can be used Directly as R2.get().body is a ReadableStream
  await BLOB.put(to, original.body, {
    httpMetadata: original.httpMetadata,
    customMetadata: original.customMetadata,
  });

  // 3. Delete original
  await BLOB.delete(key);

  return { success: true, from: key, to };
});
