import { CertBadgeCard } from '@/components/cards/Cards'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { PageIntro, TrainingPill } from '@/components/ui/Basics'
import { training } from '@/content/certifications'
import { getCertifications } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Certifications – VCP-DCV, RHCE, CCNP, CEH – Hasib Reza',
  description:
    'Verified certifications in VMware, Red Hat, Cisco, EC-Council and Microsoft, plus professional training in AI and cloud.',
  path: '/certifications',
})

export default async function CertificationsPage() {
  const certifications = await getCertifications()
  return (
    <div className="container-page pt-[72px] pb-24">
      <Breadcrumb items={[{ label: 'Certifications' }]} />
      <PageIntro
        label="Certifications"
        title="Verified credentials"
        lead="Eight certifications across VMware, Red Hat, Cisco, EC-Council and Microsoft. Each one links to its official verification."
      />
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
        {certifications.map((c) => (
          <CertBadgeCard key={c.code} cert={c} />
        ))}
      </div>

      <section aria-labelledby="train-h" className="border-line mt-[72px] border-t pt-12">
        <h2 id="train-h" className="font-display m-0 mb-2 text-[32px] font-semibold">
          Professional training
        </h2>
        <p className="text-ink-2 m-0 mb-6">Courses completed. These are not certifications.</p>
        <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
          {training.map((t) => (
            <TrainingPill key={t.label} highlight={t.highlight}>
              {t.label}
            </TrainingPill>
          ))}
        </ul>
      </section>
    </div>
  )
}
