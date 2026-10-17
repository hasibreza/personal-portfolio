import Link from 'next/link'
import { notFound } from 'next/navigation'
import { deleteProject } from '../../actions'
import { AdminPageHeader } from '@/components/admin/AdminUi'
import { ProjectForm } from '@/components/admin/EditorForms'
import { ActionButton } from '@/components/admin/FormBits'
import { requireAdmin } from '@/lib/admin'

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<'/admin/work/[id]'>) {
  const { supabase } = await requireAdmin()
  const { id } = await params
  const { saved } = await searchParams
  const isNew = id === 'new'
  let project = null
  if (!isNew) {
    const { data } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
    if (!data) notFound()
    project = data
  }
  return (
    <>
      <Link href="/admin/work" className="text-ink-2 text-sm no-underline">
        ← All work samples
      </Link>
      <AdminPageHeader
        title={isNew ? 'New case study' : 'Edit case study'}
        lead={saved ? 'Created. Keep editing, or publish when ready.' : undefined}
        actions={
          project ? (
            <ActionButton
              label="Delete"
              confirm="Delete this case study permanently?"
              run={deleteProject.bind(null, project.id)}
            />
          ) : null
        }
      />
      <ProjectForm key={project?.updated_at ?? 'new'} project={project} />
    </>
  )
}
