import { FilterableWork } from '@/components/cards/FilterableGrids'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { EmptyState } from '@/components/site/RichText'
import { PageIntro } from '@/components/ui/Basics'
import { getProjects } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Work & Case Studies – Md. Hasib Reza',
  description:
    'Infrastructure, private cloud, ERP and AI case studies: the problem, the approach and the outcome.',
  path: '/work',
})

export default async function WorkPage() {
  const items = await getProjects()
  return (
    <div className="container-page pt-[72px] pb-24">
      <Breadcrumb items={[{ label: 'Work' }]} />
      <PageIntro
        label="Work"
        title="Case studies & work samples"
        lead="Each case study covers the problem, my approach and the outcome."
      />
      <div className="mt-9">
        {items.length > 0 ? (
          <FilterableWork items={items} />
        ) : (
          <EmptyState>Case studies are being written up and will appear here soon.</EmptyState>
        )}
      </div>
    </div>
  )
}
