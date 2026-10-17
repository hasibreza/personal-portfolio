import Link from 'next/link'
import { AdminPageHeader, StatCard } from '@/components/admin/AdminUi'
import { buttonClasses } from '@/components/ui/Button'
import { requireAdmin } from '@/lib/admin'
import { site } from '@/lib/site'

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin()
  const count = async (table: 'posts' | 'projects', status?: string) => {
    let q = supabase.from(table).select('id', { count: 'exact', head: true })
    if (status) q = q.eq('status', status as 'draft')
    return (await q).count ?? 0
  }
  const [postsLive, postsDraft, workLive, workDraft, inboxNew, cv, certs] = await Promise.all([
    count('posts', 'published'),
    count('posts', 'draft'),
    count('projects', 'published'),
    count('projects', 'draft'),
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .then((r) => r.count ?? 0),
    supabase.from('cv_files').select('label, uploaded_at').eq('is_active', true).maybeSingle(),
    supabase.from('certifications').select('verify_url'),
  ])
  const missingLinks = (certs.data ?? []).filter((c) => !c.verify_url).length

  const todo = [
    !site.linkedin && 'Add your LinkedIn URL (Vercel env var NEXT_PUBLIC_LINKEDIN_URL).',
    missingLinks > 0 &&
      `Add verification links for ${missingLinks} certification${missingLinks === 1 ? '' : 's'}.`,
    !cv.data && 'Upload your privacy-safe CV (no address or phone) and make it live.',
    workLive === 0 && 'Publish your first case study.',
    postsLive === 0 && 'Publish your first article.',
  ].filter(Boolean) as string[]

  return (
    <>
      <AdminPageHeader
        title="Welcome back, Hasib"
        lead="Here's what's on your site."
        actions={
          <>
            <Link href="/admin/blog/new" className={buttonClasses('primary', 'md')}>
              + New post
            </Link>
            <Link href="/admin/work/new" className={buttonClasses('secondary', 'md')}>
              + New case study
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard
          label="Published posts"
          value={postsLive}
          sub={`${postsDraft} draft${postsDraft === 1 ? '' : 's'}`}
          href="/admin/blog"
        />
        <StatCard
          label="Case studies"
          value={workLive}
          sub={`${workDraft} draft${workDraft === 1 ? '' : 's'}`}
          href="/admin/work"
        />
        <StatCard
          label="New messages"
          value={inboxNew}
          sub={`Alerts to ${site.email}`}
          href="/admin/inbox"
          highlight={inboxNew > 0}
        />
        <StatCard
          label="Live CV"
          value={cv.data ? 'Live' : 'None'}
          sub={cv.data?.label ?? 'Upload one in CV'}
          href="/admin/cv"
        />
      </div>
      <section aria-labelledby="todo-h" className="rounded-card border-line bg-surface border p-6">
        <h2 id="todo-h" className="font-display m-0 mb-3 text-xl font-semibold">
          Launch checklist
        </h2>
        {todo.length ? (
          <ul className="m-0 flex flex-col gap-2 pl-5">
            {todo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-2 m-0">Everything on the launch list is done.</p>
        )}
      </section>
    </>
  )
}
