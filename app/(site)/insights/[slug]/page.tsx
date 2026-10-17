import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import headshot from '@/public/images/headshot.png'
import { PostCard } from '@/components/cards/Cards'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { getPost, posts } from '@/content/samples'
import { JsonLd, blogPostingJsonLd, pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/insights/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return pageMetadata({
    title: `${post.title} – Hasib Reza`,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    type: 'article',
    noindex: post.isSample,
  })
}

export default async function ArticlePage({ params }: PageProps<'/insights/[slug]'>) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/insights/${post.slug}`,
        })}
      />
      <div className="mx-auto w-full max-w-[760px] px-6 pt-16 pb-8">
        <Breadcrumb items={[{ label: 'Insights', href: '/insights' }, { label: 'Article' }]} />
        <span className="text-accent font-mono text-[13px]">#{post.tag}</span>
        <h1 className="font-display mt-3 mb-5 text-[clamp(34px,4.5vw,50px)] leading-[1.1] font-bold tracking-[-0.02em]">
          {post.title}
        </h1>
        <p className="text-ink-2 m-0 mb-7 text-xl">
          [Standfirst: one or two sentences saying what the reader will learn.]
        </p>
        <div className="border-line flex items-center gap-3.5 border-b pb-7">
          <Image src={headshot} alt="" sizes="48px" className="size-12 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold">Md. Hasib Reza</span>
            <span className="text-ink-2 text-sm">
              {post.date} · {post.readingTime}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1000px] px-6">
        <div
          role="img"
          aria-label="Cover image placeholder"
          className="rounded-panel border-line bg-tint text-ink-2 flex aspect-[2/1] items-center justify-center border p-4 text-center font-mono text-sm"
        >
          [Cover image — also used for the social share card]
        </div>
      </div>

      <article className="prose-links mx-auto flex w-full max-w-[680px] flex-col gap-5 px-6 pt-14 pb-8 text-[18.5px] leading-[1.75]">
        <p className="m-0">
          [Body text. The editor&apos;s paragraph style: 18.5 px Inter with a 1.75 line height for
          long reading.]
        </p>
        <h2 className="font-display mt-4 mb-0 text-[30px] leading-[1.2] font-semibold">
          [Section heading]
        </h2>
        <p className="m-0">
          [Body text continues. Links appear like <a href="#top">this inline link</a>.]
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>[List item]</li>
          <li>[List item]</li>
          <li>[List item]</li>
        </ul>
        <blockquote className="border-accent font-display my-2 border-l-[3px] py-1 pl-6 text-2xl leading-[1.4] font-medium">
          [Pull quote — a key line from the article.]
        </blockquote>
        <pre className="border-line bg-surface m-0 overflow-x-auto rounded-[12px] border px-6 py-5 font-mono text-[14.5px] leading-relaxed">
          <code>[Code or config sample]</code>
        </pre>
        <p className="m-0">[Closing paragraph.]</p>
      </article>

      <div className="mx-auto w-full max-w-[680px] px-6 pb-12">
        <div className="rounded-card border-line bg-surface flex gap-5 border p-7">
          <Image
            src={headshot}
            alt=""
            sizes="64px"
            className="size-16 shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-[19px] font-semibold">Md. Hasib Reza</span>
            <p className="text-ink-2 m-0">
              Virtualization &amp; private cloud specialist; CIO &amp; AMD at Sonali Life Insurance
              PLC. I write about building infrastructure that doesn&apos;t go down.
            </p>
            <Link href="/about" className="font-semibold no-underline">
              More about me →
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="rel-h" className="border-line bg-surface border-t">
        <div className="container-page flex flex-col gap-7 pt-16 pb-[88px]">
          <h2 id="rel-h" className="font-display m-0 text-[28px] font-semibold">
            Related articles
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
            {related.map((p) => (
              <PostCard key={p.slug} item={p} onSurface />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
