'use client'

import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

type Props = {
  id: string
  label: string
  /** Form field that receives the HTML (sanitised again on the server). */
  name: string
  /** Optional form field for the Tiptap JSON document (posts keep it for re-editing). */
  jsonName?: string
  initialHtml?: string
  minHeight?: number
}

/** Rich-text editor (Tiptap StarterKit) writing HTML into a hidden form field. */
export function RichTextEditor({
  id,
  label,
  name,
  jsonName,
  initialHtml = '',
  minHeight = 220,
}: Props) {
  const [html, setHtml] = useState(initialHtml)
  const [json, setJson] = useState('')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, protocols: ['https', 'mailto'] },
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        id,
        'aria-labelledby': `${id}-label`,
        'aria-multiline': 'true',
        role: 'textbox',
        class: 'rich-text prose-links outline-none px-4 py-3 flex flex-col gap-4',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: e }) => {
      setHtml(e.isEmpty ? '' : e.getHTML())
      if (jsonName) setJson(JSON.stringify(e.getJSON()))
    },
  })

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive('bold') ?? false,
      italic: e?.isActive('italic') ?? false,
      h2: e?.isActive('heading', { level: 2 }) ?? false,
      h3: e?.isActive('heading', { level: 3 }) ?? false,
      ul: e?.isActive('bulletList') ?? false,
      ol: e?.isActive('orderedList') ?? false,
      quote: e?.isActive('blockquote') ?? false,
      code: e?.isActive('codeBlock') ?? false,
      link: e?.isActive('link') ?? false,
    }),
  })

  function setLink() {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    const href = window.prompt(
      'Link URL (https://…). Leave empty to remove the link.',
      previous ?? 'https://',
    )
    if (href === null) return
    if (!href.trim()) editor.chain().focus().extendMarkRange('link').unsetLink().run()
    else editor.chain().focus().extendMarkRange('link').setLink({ href: href.trim() }).run()
  }

  const tools: { label: string; text: string; on?: boolean; run: () => void }[] = editor
    ? [
        {
          label: 'Heading',
          text: 'H2',
          on: active?.h2,
          run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: 'Subheading',
          text: 'H3',
          on: active?.h3,
          run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          label: 'Bold',
          text: 'B',
          on: active?.bold,
          run: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: 'Italic',
          text: 'I',
          on: active?.italic,
          run: () => editor.chain().focus().toggleItalic().run(),
        },
        { label: 'Link', text: 'Link', on: active?.link, run: setLink },
        {
          label: 'Bulleted list',
          text: '•',
          on: active?.ul,
          run: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: 'Numbered list',
          text: '1.',
          on: active?.ol,
          run: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: 'Quote',
          text: '“',
          on: active?.quote,
          run: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          label: 'Code block',
          text: '</>',
          on: active?.code,
          run: () => editor.chain().focus().toggleCodeBlock().run(),
        },
        { label: 'Undo', text: '↶', run: () => editor.chain().focus().undo().run() },
        { label: 'Redo', text: '↷', run: () => editor.chain().focus().redo().run() },
      ]
    : []

  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${id}-label`} className="text-[15px] font-medium">
        {label}
      </span>
      <div className="rounded-control border-field bg-bg focus-within:outline-accent overflow-hidden border focus-within:outline-2">
        <div
          role="toolbar"
          aria-label={`${label} formatting`}
          className="border-line bg-surface flex flex-wrap gap-1 border-b p-1.5"
        >
          {tools.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-label={t.label}
              aria-pressed={t.on === undefined ? undefined : t.on}
              title={t.label}
              onClick={t.run}
              className={`h-11 min-w-11 cursor-pointer rounded-lg border-0 px-2 font-mono text-[13px] font-semibold ${
                t.on ? 'bg-ink text-bg' : 'text-ink hover:bg-tint bg-transparent'
              }`}
            >
              {t.text}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
      {jsonName ? <input type="hidden" name={jsonName} value={json} /> : null}
    </div>
  )
}
