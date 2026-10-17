import { sanitizeRichText } from '@/lib/sanitize'

/**
 * Renders rich text written in the admin editor. The HTML was sanitised on save; it is
 * sanitised again here so a row edited outside the admin can never inject markup.
 */
export function RichText({ html, className = '' }: { html: string; className?: string }) {
  const clean = sanitizeRichText(html)
  if (!clean) return null
  return (
    <div
      className={`rich-text prose-links flex flex-col gap-5 ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

/** Shown on list pages before anything has been published. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-card border-line text-ink-2 m-0 border border-dashed p-10 text-center text-lg">
      {children}
    </p>
  )
}
