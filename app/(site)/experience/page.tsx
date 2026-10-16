import { Breadcrumb } from '@/components/site/Breadcrumb'
import { PageIntro } from '@/components/ui/Basics'
import { buttonClasses } from '@/components/ui/Button'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { experience } from '@/content/experience'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Career Timeline – Md. Hasib Reza',
  description:
    '16+ years across Sonali Life Insurance, Dragon IT & Communication and UK roles in networking and systems engineering.',
  path: '/experience',
})

export default function ExperiencePage() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-6 pt-[72px] pb-24">
      <Breadcrumb items={[{ label: 'Experience' }]} />
      <PageIntro
        label="Experience"
        title="From support desk to CIO"
        lead="Six roles across London and Dhaka, from 2007 to today. Each one added a layer: support, networks, systems, projects, then leadership."
      />
      <ol className="m-0 mt-14 flex list-none flex-col p-0">
        {experience.map((r, i) => (
          <TimelineItem key={r.period} role={r} last={i === experience.length - 1} />
        ))}
      </ol>
      <div className="bg-tint rounded-card mt-14 flex flex-wrap items-center justify-between gap-5 p-8">
        <p className="font-display m-0 text-[22px] font-semibold">Want the full picture?</p>
        <a href="/cv" className={buttonClasses('primary', 'lg')}>
          Download CV (PDF)
        </a>
      </div>
    </div>
  )
}
