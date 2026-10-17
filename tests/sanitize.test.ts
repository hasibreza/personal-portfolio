import { describe, expect, it } from 'vitest'
import { htmlToText, readingMinutes, sanitizeRichText, slugify } from '@/lib/sanitize'

describe('sanitizeRichText — XSS', () => {
  const attacks: [string, string][] = [
    ['script tag', '<p>hi</p><script>alert(1)</script>'],
    ['event handler', '<p onclick="alert(1)">hi</p>'],
    ['img onerror', '<img src=x onerror=alert(1)>'],
    ['javascript: link', '<a href="javascript:alert(1)">x</a>'],
    ['data: link', '<a href="data:text/html,<script>alert(1)</script>">x</a>'],
    ['iframe', '<iframe src="https://evil.example"></iframe>'],
    ['style tag', '<style>body{display:none}</style>'],
    ['svg', '<svg onload=alert(1)></svg>'],
    ['protocol-relative', '<a href="//evil.example">x</a>'],
    ['inline style', '<p style="position:fixed">x</p>'],
  ]
  it.each(attacks)('removes %s', (_name, input) => {
    const out = sanitizeRichText(input)
    expect(out).not.toMatch(
      /<script|onerror|onclick|onload|javascript:|data:text|<iframe|<style|<svg|style=|\/\/evil/i,
    )
  })

  it('keeps the formatting the editor produces', () => {
    const html =
      '<h2>Title</h2><p><strong>b</strong> <em>i</em></p><ul><li>a</li></ul><blockquote><p>q</p></blockquote><pre><code>x</code></pre>'
    expect(sanitizeRichText(html)).toBe(html)
  })

  it('demotes h1 to h2 (the page title is the only h1)', () => {
    expect(sanitizeRichText('<h1>x</h1>')).toBe('<h2>x</h2>')
  })

  it('hardens external links', () => {
    expect(sanitizeRichText('<a href="https://example.com">x</a>')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer nofollow">x</a>',
    )
  })

  it('keeps mailto links without target', () => {
    expect(sanitizeRichText('<a href="mailto:a@b.co">x</a>')).toBe('<a href="mailto:a@b.co">x</a>')
  })
})

describe('text helpers', () => {
  it('strips tags for plain text', () => {
    expect(htmlToText('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
  })
  it('estimates reading time with a floor of 1 minute', () => {
    expect(readingMinutes('<p>short</p>')).toBe(1)
    expect(readingMinutes(`<p>${'word '.repeat(1100)}</p>`)).toBe(5)
  })
  it('slugifies titles', () => {
    expect(slugify('  Private Cloud: HA & DR — 2026!  ')).toBe('private-cloud-ha-dr-2026')
  })
})
