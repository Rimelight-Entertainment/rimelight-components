import { v7 as uuidv7 } from "uuid"
import type { RichTextContent, InlineText, InlineContent } from "../types/blocks"

/**
 * Helper: Converts RichTextContent array into a plain string for a simple contenteditable area.
 * For complex editors, this would generate full HTML/DOM nodes, preserving links/mentions.
 * For now, we only extract the text content.
 */
export function richTextToHtml(content: RichTextContent): string {
  // In a real editor, this would serialize the array into HTML.
  // Example: item.type === 'link' ? `<a href="${item.props.href}">${item.props.content}</a>` : item.props.content
  // For this simple text-only editing simulation, we join the text parts.
  return content.map(item => item.props.content).join("")
}

/**
 * Helper: Converts a plain string from a contenteditable area back into RichTextContent.
 *
 * NOTE: For full rich text support, this function must parse complex HTML (<a>, <b>, <span>)
 * and generate the correct InlineLink, InlineMention, and InlineText objects.
 * Since we are only simulating the text content change, we convert the entire string
 * into a single InlineText element.
 */
export function parseHtmlToRichText(html: string): RichTextContent {
  if (html.trim().length === 0) {
    return []
  }

  // Generate a new InlineText object with a fresh ID
  const newTextNode: InlineText = {
    id: uuidv7(),
    type: "text",
    props: {
      content: html.trim()
    }
  }

  // In a more complex scenario, this would use a DOMParser to reconstruct links/mentions.
  return [newTextNode]
}