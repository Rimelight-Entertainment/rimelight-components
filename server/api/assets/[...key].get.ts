import { defineEventHandler, getRouterParam, createError, setHeader } from "h3";

export default defineEventHandler(async (event) => {
  // Extract the key from the pathname to ensure we get the full catch-all path correctly
  // Path is like /api/assets/Images/file.png -> key is Images/file.png
  const reqUrl = event.node.req.url || "";
  const url = new URL(reqUrl, 'http://localhost');
  const pathParts = url.pathname.split('/api/assets/');
  const key = (pathParts.length > 1 && pathParts[1]) ? decodeURIComponent(pathParts[1]) : null;

  if (!key) {
    throw createError({ statusCode: 400, statusMessage: "Missing key" });
  }

  const cloudflare = (event.context as any).cloudflare;
  const BLOB = cloudflare?.env.BLOB as any;

  if (!BLOB) {
    throw createError({ statusCode: 500, statusMessage: "R2 bucket not bound" });
  }

  const object = await BLOB.get(key);

  if (object === null) {
    throw createError({ statusCode: 404, statusMessage: "Object Not Found" });
  }

  // Manually set headers to avoid serialization issues in Miniflare dev environment
  if (object.httpMetadata?.contentType) {
    setHeader(event, "Content-Type", object.httpMetadata.contentType);
  }
  if (object.httpMetadata?.contentLanguage) {
    setHeader(event, "Content-Language", object.httpMetadata.contentLanguage);
  }
  if (object.httpMetadata?.contentDisposition) {
    setHeader(event, "Content-Disposition", object.httpMetadata.contentDisposition);
  }
  if (object.httpMetadata?.cacheControl) {
    setHeader(event, "Cache-Control", object.httpMetadata.cacheControl);
  }
  
  setHeader(event, "ETag", object.httpEtag);

  return object.body;
});
