import { NotionRichText, NotionRichTextProperty } from "./types/notion"

export function extractPlainText(richText: NotionRichText[]): string {
    return richText.map(rt => rt.plain_text).join('')
}

export function extractRichTextContent(richTextProperty: NotionRichTextProperty): string {
    return extractPlainText(richTextProperty.rich_text)
}