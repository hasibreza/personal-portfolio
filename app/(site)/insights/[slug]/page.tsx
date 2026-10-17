import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import headshot from '@/public/images/headshot.png'
import { PostCard } from '@/components/cards/Cards'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { RichText } from '@/components/site/RichText'
import { getPost, getPosts } from '@/lib/content'
import { JsonLd, blogPostingJsonLd, pageMetadata } from '@/lib/seo'

/** Cache Components needs at least one param; '_' renders the 404 page. */
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_' }]
}

export async function generateMetadata({
  params,
}: PageProps<'/insights/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return pageMetadata({
    title: post.seoTitle || `${post.title} – Hasib Reza`,
    description: post.seoDescription || post.excerpt,
    path: `/insights/${post.slug}`,
    type: 'article',
    publishedTime: post.dateIso,
    image: post.coverUrl ?? undefined,
  })
}

export default async function ArticlePage({ params }: PageProps<'/insights/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const related = (await getPosts())
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) =>
        Number(b.tags.some((t) => post.tags.includes(t))) -
        Number(a.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3)

  return (
    <>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/insights/${post.slug}`,
          datePublished: post.dateIso,
        })}
      />
      <div className="mx-auto w-full max-w-[760px] px-6 pt-16 pb-8">
        <Breadcrumb items={[{ label: 'Insights', href: '/insights' }, { label: post.title }]} />
        <span className="text-accent font-mono text-[13px]">#{post.tag}</span>
        <h1 className="font-display mt-3 mb-5 text-[clamp(34px,4.5vw,50px)] leading-[1.1] font-bold tracking-[-0.02em]">
          {post.title}
        </h1>
        {post.excerpt ? <p className="text-ink-2 m-0 mb-7 text-xl">{post.excerpt}</p> : null}
        <div className="border-line flex items-center gap-3.5 border-b pb-7">
          <Image src={headshot} alt="" sizes="48px" className="size-12 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold">Md. Hasib Reza</span>
            <span className="text-ink-2 text-sm">
              <time dateTime={post.dateIso}>{post.date}</time> · {post.readingTime}
            </span>
          </div>
        </div>
      </div>

      {post.coverUrl ? (
        <div className="mx-auto w-full max-w-[1000px] px-6">
          <div className="rounded-panel border-line relative aspect-[2/1] overflow-hidden border">
            <Image
              src={post.coverUrl}
              alt={post.coverAlt}
              fill
              preload
              sizes="(min-width: 1000px) 952px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <article className="mx-auto w-full max-w-[680px] px-6 pt-14 pb-8 text-[18.5px] leading-[1.75]">
        <RichText html={post.bodyHtml} />
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

      {related.length > 0 ? (
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
      ) : null}
    </>
  )
}
