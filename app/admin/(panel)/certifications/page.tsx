import { AdminPageHeader } from '@/components/admin/AdminUi'
import { CertificationForm } from '@/components/admin/EditorForms'
import { requireAdmin } from '@/lib/admin'

export default async function AdminCertificationsPage() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from('certifications').select('*').order('sort_order')
  return (
    <>
      <AdminPageHeader
        title="Certifications"
        lead="Add official verification links and badge images. Names and issuers come from the approved brief."
      />
      <div className="flex max-w-[860px] flex-col gap-5">
        {(data ?? []).map((c) => (
          <CertificationForm key={`${c.id}-${c.updated_at}`} cert={c} />
        ))}
      </div>
    </>
  )
}
