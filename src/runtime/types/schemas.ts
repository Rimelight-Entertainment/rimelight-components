import { z } from "zod"

export const linkVariantEnum = z.enum(["solid", "outline", "subtle", "soft", "ghost", "link"]);

export const linkColorEnum = z.enum([
  "primary",
  "secondary",
  "neutral",
  "error",
  "warning",
  "success",
  "info"
]);

export const ImageSchema = z.object({
  src: z.string().min(1, "Image source must be provided."),
  alt: z.string().min(1, "Image alt text must be provided."),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
});
export type Image = z.infer<typeof ImageSchema>;

export const LinkSchema = z.object({
  label: z.string().min(1, "Link label must be provided."),
  to: z.url("Link destination must be a valid URL.").min(1, "Link destination must be provided."),
  icon: z.string().optional(),
  trailing: z.boolean().optional(),
  color: linkColorEnum.optional(),
  variant: linkVariantEnum.optional()
});
export type Link = z.infer<typeof LinkSchema>;

export type UserAvailability = "available" | "busy" | "invisible";
