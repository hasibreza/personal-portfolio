import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminUi'
import { ContentList } from '@/components/admin/ContentList'
import { buttonClasses } from '@/components/ui/Button'
import { requireAdmin } from '@/lib/admin'

export default async function AdminBlogPage() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, status, published_at, updated_at')
    .order('updated_at', { ascending: false })
  return (
    <>
      <AdminPageHeader
        title="Blog"
        lead="Articles on /insights and in the RSS feed. Scheduled posts go live on their date."
        actions={
          <Link href="/admin/blog/new" className={buttonClasses('primary', 'md')}>
            + New post
          </Link>
        }
      />
      <ContentList items={data ?? []} base="/admin/blog" publicBase="/insights" />
    </>
  )
}
