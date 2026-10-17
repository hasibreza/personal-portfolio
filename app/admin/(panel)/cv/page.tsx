import { AdminPageHeader } from '@/components/admin/AdminUi'
import { CvManager } from '@/components/admin/CvManager'
import { requireAdmin } from '@/lib/admin'

export default async function AdminCvPage() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from('cv_files')
    .select('*')
    .order('uploaded_at', { ascending: false })
  return (
    <>
      <AdminPageHeader
        title="CV"
        lead="Every “Download CV” button on the site serves the live version through /cv."
      />
      <CvManager versions={data ?? []} />
    </>
  )
}
