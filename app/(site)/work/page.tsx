import { FilterableWork } from '@/components/cards/FilterableGrids'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { PageIntro } from '@/components/ui/Basics'
import { workSamples } from '@/content/samples'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Work & Case Studies – Md. Hasib Reza',
  description:
    'Infrastructure, private cloud, ERP and AI case studies: the problem, the approach and the outcome.',
  path: '/work',
})

export default function WorkPage() {
  return (
    <div className="container-page pt-[72px] pb-24">
      <Breadcrumb items={[{ label: 'Work' }]} />
      <PageIntro
        label="Work"
        title="Case studies & work samples"
        lead="Each case study covers the problem, my approach and the outcome."
      />
      <div className="mt-9">
        <FilterableWork items={workSamples} />
      </div>
    </div>
  )
}
