import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  const cloudflare = (event.context as any).cloudflare;
  if (!cloudflare) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cloudflare context not found",
    });
  }

  const { env } = cloudflare;
  const BLOB = env.BLOB as any;

  if (!BLOB) {
    throw createError({
      statusCode: 500,
      statusMessage: "R2 bucket (BLOB) not bound",
    });
  }

  const list = await BLOB.list();
  
  return list.objects.map((obj: any) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
    contentType: obj.httpMetadata?.contentType,
    etag: obj.httpEtag,
  }));
});
