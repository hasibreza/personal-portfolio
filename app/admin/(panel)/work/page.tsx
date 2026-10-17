import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminUi'
import { ContentList } from '@/components/admin/ContentList'
import { buttonClasses } from '@/components/ui/Button'
import { requireAdmin } from '@/lib/admin'

export default async function AdminWorkPage() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from('projects')
    .select('id, title, slug, status, published_at, updated_at')
    .order('sort_order')
    .order('updated_at', { ascending: false })
  return (
    <>
      <AdminPageHeader
        title="Work samples"
        lead="Case studies on /work. Drafts stay hidden; publishing updates the site immediately."
        actions={
          <Link href="/admin/work/new" className={buttonClasses('primary', 'md')}>
            + New case study
          </Link>
        }
      />
      <ContentList items={data ?? []} base="/admin/work" publicBase="/work" />
    </>
  )
}
