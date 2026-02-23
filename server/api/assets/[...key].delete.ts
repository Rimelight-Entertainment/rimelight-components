import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
  const reqUrl = event.node.req.url || "";
  const url = new URL(reqUrl, 'http://localhost');
  const pathParts = url.pathname.split('/api/assets/');
  const key = pathParts.length > 1 ? decodeURIComponent(pathParts[1]) : null;

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
