import { defineEventHandler, getRouterParam, getHeader, createError, readRawBody } from "h3";

export default defineEventHandler(async (event) => {
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

  const contentType = getHeader(event, "content-type");
  
  const buffer = await readRawBody(event, false);
  if (!buffer) {
    throw createError({ statusCode: 400, statusMessage: "Empty body" });
  }

  // Convert Node.js Buffer to a standard ArrayBuffer to avoid Miniflare/devalue assertion errors
  // with specialized Uint8Array views (Buffers).
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  const object = await BLOB.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: contentType,
    },
  });

  if (!object) {
    throw createError({ statusCode: 500, statusMessage: "Failed to upload to R2" });
  }

  return {
    key: object.key,
    size: object.size,
    etag: object.httpEtag,
  };
});
