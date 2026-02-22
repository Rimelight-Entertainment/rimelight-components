import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  if (!key) {
    throw createError({ statusCode: 400, statusMessage: "Missing key" });
  }

  const cloudflare = (event.context as any).cloudflare;
  const BLOB = cloudflare?.env.BLOB as any;

  if (!BLOB) {
    throw createError({ statusCode: 500, statusMessage: "R2 bucket not bound" });
  }

  await BLOB.delete(key);

  return { success: true };
});
