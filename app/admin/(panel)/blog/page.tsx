import { AdminPageHeader, EditorToolbar } from '@/components/admin/AdminUi'
import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'

export default function AdminBlogPage() {
  return (
    <>
      <AdminPageHeader
        title="Blog"
        lead="New post"
        actions={
          <>
            <Button variant="secondary" size="md" disabled>
              Save draft
            </Button>
            <Button size="md" disabled>
              Publish
            </Button>
          </>
        }
      />
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-4">
          <TextField id="p-title" label="Post title" placeholder="Post title" />
          <EditorToolbar />
          <TextAreaField id="p-body" label="Body" rows={18} placeholder="Start writing…" />
          <span className="text-ink-2 text-[13px]">
            Word count and reading time are calculated automatically.
          </span>
        </div>
        <aside aria-label="Post settings" className="flex flex-[1_1_300px] flex-col gap-5">
          <fieldset className="border-line bg-surface m-0 flex flex-col gap-2 rounded-[14px] border p-5">
            <legend className="px-1.5 font-semibold">Status</legend>
            {['Draft', 'Scheduled', 'Published'].map((s, i) => (
              <label key={s} className="flex min-h-11 cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="status"
                  defaultChecked={i === 0}
                  className="accent-accent"
                />
                {s}
              </label>
            ))}
          </fieldset>
          <div className="border-line bg-surface flex flex-col gap-4 rounded-[14px] border p-5">
            <TextField
              id="p-slug"
              label="URL slug"
              placeholder="post-slug"
              hint="/insights/post-slug"
            />
            <TextField id="p-tags" label="Tags" placeholder="virtualization, cybersecurity" />
            <TextAreaField id="p-excerpt" label="Excerpt" rows={3} />
          </div>
          <div className="border-line bg-surface flex flex-col gap-4 rounded-[14px] border p-5">
            <span className="font-semibold">Search &amp; social (SEO)</span>
            <TextField id="p-seo-title" label="SEO title" hint="Up to 60 characters" />
            <TextAreaField
              id="p-seo-desc"
              label="Meta description"
              rows={3}
              hint="Up to 155 characters"
            />
          </div>
        </aside>
      </div>
    </>
  )
}
