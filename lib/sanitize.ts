import sanitizeHtmlLib from 'sanitize-html'

/**
 * Allow-list for rich text written in the admin editor (Tiptap StarterKit output).
 * Runs on save AND on render, so stored content can never inject scripts, styles,
 * event handlers, iframes or javascript: links — even if a row were edited directly.
 */
const options: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    'p',
    'h2',
    'h3',
    'h4',
    'strong',
    'em',
    's',
    'u',
    'a',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'hr',
    'br',
  ],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['https', 'http', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href'],
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? ''
      const external = /^https?:\/\//i.test(href)
      return {
        tagName,
        attribs: {
          href,
          ...(external ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {}),
        },
      }
    },
    // Editor headings start at h2: the page title is the only h1.
    h1: 'h2',
  },
}

export function sanitizeRichText(html: string): string {
  return sanitizeHtmlLib(html ?? '', options).trim()
}

/** Plain text for reading-time estimates and fallbacks. */
export function htmlToText(html: string): string {
  return sanitizeHtmlLib(html ?? '', { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim()
}

export function readingMinutes(html: string): number {
  const words = htmlToText(html).split(' ').filter(Boolean).length
  return Math.min(120, Math.max(1, Math.round(words / 220)))
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}
