import Image from 'next/image'
import Link from 'next/link'
import headshot from '@/public/images/headshot.png'
import { ExpertiseCard, PostCard, WorkCard } from '@/components/cards/Cards'
import { NodeGrid } from '@/components/site/NodeGrid'
import { SectionHeading, SectionLabel } from '@/components/ui/Basics'
import { ButtonLink, buttonClasses } from '@/components/ui/Button'
import { DownloadIcon } from '@/components/ui/icons'
import { expertise } from '@/content/expertise'
import { profile } from '@/content/profile'
import { posts, workSamples } from '@/content/samples'
import { JsonLd, pageMetadata, personJsonLd, profilePageJsonLd, websiteJsonLd } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Md. Hasib Reza – Virtualization & Private Cloud Specialist',
  description:
    'CIO & AMD at Sonali Life Insurance PLC. 16+ years in VMware private cloud, data centre, networking and cybersecurity.',
  path: '/',
  type: 'profile',
})

const textLink = 'inline-flex min-h-11 items-center font-semibold no-underline'

export default function HomePage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={profilePageJsonLd('/')} />

      {/* Hero */}
      <section aria-labelledby="hero-name" className="overflow-hidden">
        <div className="container-page flex flex-wrap items-center gap-10 pt-10 pb-20 md:gap-16 md:pt-24 md:pb-22">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
            <p className="text-accent m-0 font-mono text-[13px] font-medium tracking-[0.08em]">
              VIRTUALIZATION · PRIVATE CLOUD · INFRASTRUCTURE
            </p>
            <h1
              id="hero-name"
              className="font-display m-0 text-[clamp(44px,6vw,72px)] leading-[1.02] font-bold tracking-[-0.02em]"
            >
              {profile.name}
            </h1>
            <p className="font-display m-0 text-[clamp(24px,2.6vw,32px)] leading-tight font-medium">
              {profile.tagline}
            </p>
            <p className="text-ink-2 m-0 max-w-[560px] text-lg">{profile.heroIntro}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/cv" className={buttonClasses('primary', 'lg')}>
                <DownloadIcon size={18} />
                Download CV
              </a>
              <ButtonLink href="/contact" variant="secondary">
                Get in touch
              </ButtonLink>
            </div>
            <dl className="border-line m-0 mt-4 grid grid-cols-3 gap-3 border-t pt-6 sm:flex sm:gap-10">
              {profile.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-ink-2 text-[13px] sm:text-sm">{s.label}</dt>
                  <dd className="font-display m-0 text-[22px] font-semibold sm:text-[28px]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative order-first flex min-w-[260px] flex-[1_1_100%] justify-center md:order-none md:flex-[0_1_420px]">
            <NodeGrid className="absolute -inset-6 h-[calc(100%+48px)] w-[calc(100%+48px)]" />
            <Image
              src={headshot}
              alt="Portrait of Md. Hasib Reza"
              placeholder="blur"
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 80vw, 360px"
              className="rounded-panel border-line bg-surface relative aspect-[4/5] w-full max-w-[220px] border object-cover md:max-w-[360px]"
            />
          </div>
        </div>
      </section>

      {/* About (short) */}
      <section aria-labelledby="about-h" className="border-line border-t">
        <div className="container-page flex flex-wrap gap-12 py-[88px]">
          <div className="flex-[1_1_320px]">
            <SectionLabel>About</SectionLabel>
            <SectionHeading id="about-h">Hands-on engineer. Technology leader.</SectionHeading>
          </div>
          <div className="text-ink-2 flex flex-[1.4_1_480px] flex-col gap-4 text-lg">
            {profile.aboutShort.map((p) => (
              <p key={p} className="m-0">
                {p}
              </p>
            ))}
            <Link href="/about" className={textLink}>
              Read my story →
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section aria-labelledby="exp-h" className="border-line bg-surface border-y">
        <div className="container-page flex flex-col gap-10 py-[88px]">
          <div>
            <SectionLabel>Expertise</SectionLabel>
            <SectionHeading id="exp-h">What I do</SectionHeading>
          </div>
          <div className="flex flex-wrap gap-5">
            {expertise.map((e) => (
              <ExpertiseCard key={e.title} item={e} />
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section aria-labelledby="work-h">
        <div className="container-page flex flex-col gap-10 py-[88px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Selected work</SectionLabel>
              <SectionHeading id="work-h">Case studies</SectionHeading>
            </div>
            <Link href="/work" className={textLink}>
              View all work →
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
            {workSamples.slice(0, 3).map((w) => (
              <WorkCard key={w.slug} item={w} />
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section aria-labelledby="ins-h" className="border-line bg-surface border-y">
        <div className="container-page flex flex-col gap-10 py-[88px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Insights</SectionLabel>
              <SectionHeading id="ins-h">Latest writing</SectionHeading>
            </div>
            <Link href="/insights" className={textLink}>
              All articles →
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} item={p} onSurface />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section aria-labelledby="cta-h">
        <div className="container-page flex flex-col items-start gap-5 py-24">
          <h2
            id="cta-h"
            className="font-display m-0 max-w-[760px] text-[clamp(32px,4vw,48px)] leading-[1.1] font-semibold"
          >
            Let&apos;s talk infrastructure, cloud or AI.
          </h2>
          <p className="text-ink-2 m-0 max-w-[600px] text-lg">
            Speaking, advisory and collaboration enquiries are welcome.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            <a href="/cv" className={buttonClasses('secondary', 'lg')}>
              Download CV
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
