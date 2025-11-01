/**
 * Converts a string to a URL-friendly slug.
 * @param str The input string.
 * @returns The slugified string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters (except dashes/spaces)
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple dashes with a single dash
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
}
