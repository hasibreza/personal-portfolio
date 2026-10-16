import Image from 'next/image'
import headshot from '@/public/images/headshot.png'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { SectionLabel } from '@/components/ui/Basics'
import { ButtonLink } from '@/components/ui/Button'
import { profile } from '@/content/profile'
import { JsonLd, pageMetadata, personJsonLd, profilePageJsonLd } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About Md. Hasib Reza – CIO & Infrastructure Leader',
  description:
    "From network engineer in London to CIO in Dhaka: the career, approach and education behind Hasib Reza's infrastructure leadership.",
  path: '/about',
  type: 'profile',
})

export default function AboutPage() {
  return (
    <>
      <JsonLd data={profilePageJsonLd('/about')} />
      <JsonLd data={personJsonLd()} />

      <div className="container-page pt-[72px] pb-6">
        <Breadcrumb items={[{ label: 'About' }]} />
        <SectionLabel>About</SectionLabel>
        <h1 className="font-display m-0 max-w-[820px] text-[clamp(40px,5vw,60px)] leading-[1.05] font-bold tracking-[-0.02em]">
          {profile.aboutHeadline}
        </h1>
      </div>

      <div className="container-page flex flex-wrap items-start gap-16 pt-12 pb-[88px]">
        <div className="flex min-w-0 flex-[1.6_1_520px] flex-col gap-5 text-lg">
          {profile.aboutLong.map((p, i) => (
            <p key={p} className={`m-0 ${i === 0 ? '' : 'text-ink-2'}`}>
              {p}
            </p>
          ))}
        </div>
        <aside className="flex flex-[1_1_300px] flex-col gap-4">
          <Image
            src={headshot}
            alt="Portrait of Md. Hasib Reza"
            placeholder="blur"
            sizes="(max-width: 768px) 90vw, 360px"
            className="rounded-panel border-line aspect-[4/5] w-full max-w-[360px] border object-cover"
          />
          <dl className="border-line bg-surface m-0 flex flex-col gap-1.5 rounded-[14px] border p-5 text-[15px]">
            <dt className="text-ink-2 font-mono text-xs">BASED IN</dt>
            <dd className="m-0">{profile.location}</dd>
            <dt className="text-ink-2 mt-2 font-mono text-xs">CURRENTLY</dt>
            <dd className="m-0">{profile.current}</dd>
          </dl>
        </aside>
      </div>

      <section aria-labelledby="how-h" className="border-line bg-surface border-y">
        <div className="container-page flex flex-col gap-9 py-20">
          <h2 id="how-h" className="font-display m-0 text-4xl font-semibold">
            How I lead
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-5">
            {profile.leadership.map((l) => (
              <div key={l.title} className="border-line bg-bg rounded-[14px] border p-6">
                <h3 className="font-display m-0 mb-2 text-xl font-semibold">{l.title}</h3>
                <p className="text-ink-2 m-0">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="edu-h">
        <div className="container-page flex flex-col gap-8 py-20">
          <h2 id="edu-h" className="font-display m-0 text-4xl font-semibold">
            Education
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
            {profile.education.map((e) => (
              <div
                key={e.title}
                className="border-line bg-surface flex flex-col gap-1.5 rounded-[14px] border p-7"
              >
                <span className="text-accent font-mono text-[13px]">{e.year}</span>
                <h3 className="font-display m-0 text-[21px] font-semibold">{e.title}</h3>
                <p className="text-ink-2 m-0">{e.detail}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="/experience">See my career timeline</ButtonLink>
            <ButtonLink href="/certifications" variant="secondary">
              Certifications
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
