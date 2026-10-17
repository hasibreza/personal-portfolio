import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deletePost } from '../../actions'
import { AdminPageHeader } from '@/components/admin/AdminUi'
import { PostForm } from '@/components/admin/EditorForms'
import { ActionButton } from '@/components/admin/FormBits'
import { requireAdmin } from '@/lib/admin'

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps<'/admin/blog/[id]'>) {
  const { supabase } = await requireAdmin()
  const { id } = await params
  const { saved } = await searchParams
  const isNew = id === 'new'
  let post = null
  if (!isNew) {
    const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
    if (!data) notFound()
    post = data
  }
  return (
    <>
      <Link href="/admin/blog" className="text-ink-2 text-sm no-underline">
        ← All posts
      </Link>
      <AdminPageHeader
        title={isNew ? 'New post' : 'Edit post'}
        lead={saved ? 'Created. Keep editing, or publish when ready.' : undefined}
        actions={
          post ? (
            <ActionButton
              label="Delete"
              confirm="Delete this post permanently?"
              run={deletePost.bind(null, post.id)}
            />
          ) : null
        }
      />
      <PostForm key={post?.updated_at ?? 'new'} post={post} />
    </>
  )
}
