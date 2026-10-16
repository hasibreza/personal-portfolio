import { Breadcrumb } from '@/components/site/Breadcrumb'
import { ContactForm } from '@/components/site/ContactForm'
import { SectionLabel } from '@/components/ui/Basics'
import { LinkedInIcon, MailIcon } from '@/components/ui/icons'
import { site } from '@/lib/site'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Contact Md. Hasib Reza',
  description: 'Speaking, advisory and collaboration enquiries.',
  path: '/contact',
})

const card =
  'flex items-center gap-3.5 rounded-[14px] border border-line bg-surface px-5 py-4 text-ink no-underline hover:text-ink hover:border-ink-2'

export default function ContactPage() {
  return (
    <div className="container-page flex flex-wrap gap-16 pt-[72px] pb-24">
      <div className="flex flex-[1_1_360px] flex-col gap-5">
        <Breadcrumb items={[{ label: 'Contact' }]} />
        <div>
          <SectionLabel>Contact</SectionLabel>
          <h1 className="font-display m-0 text-[clamp(40px,5vw,56px)] leading-[1.05] font-bold tracking-[-0.02em]">
            Let&apos;s talk.
          </h1>
        </div>
        <p className="text-ink-2 m-0 text-lg">
          Speaking, advisory and collaboration enquiries on private cloud, infrastructure and
          applied AI. I reply personally.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          <a href={`mailto:${site.email}`} className={card}>
            <MailIcon size={22} className="text-accent" />
            <span className="flex flex-col">
              <span className="text-ink-2 text-[13px]">Email</span>
              <span className="font-semibold">{site.email}</span>
            </span>
          </a>
          {site.linkedin ? (
            <a href={site.linkedin} rel="me noopener" className={card}>
              <LinkedInIcon size={22} className="text-accent" />
              <span className="flex flex-col">
                <span className="text-ink-2 text-[13px]">LinkedIn</span>
                <span className="font-semibold">View profile</span>
              </span>
            </a>
          ) : (
            <div className={card}>
              <LinkedInIcon size={22} className="text-accent" />
              <span className="flex flex-col">
                <span className="text-ink-2 text-[13px]">LinkedIn</span>
                <span className="font-semibold">[Profile URL to supply]</span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-panel border-line bg-surface flex-[1.3_1_480px] border p-6 sm:p-9">
        <ContactForm />
      </div>
    </div>
  )
}
