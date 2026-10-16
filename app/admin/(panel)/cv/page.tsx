import { AdminPageHeader, DataTable } from '@/components/admin/AdminUi'
import { StatusPill } from '@/components/ui/Basics'
import { UploadIcon, WarningIcon } from '@/components/ui/icons'

type Version = { label: string; live: boolean }
const versions: Version[] = [
  { label: '[CV — public version 3]', live: true },
  { label: '[CV — public version 2]', live: false },
  { label: '[CV — public version 1]', live: false },
]

export default function AdminCvPage() {
  return (
    <div className="flex max-w-[1000px] flex-col gap-7">
      <AdminPageHeader
        title="CV"
        lead={
          <>
            The live version is what visitors get from every &ldquo;Download CV&rdquo; button and
            from <code className="font-mono text-[13.5px]">/cv</code>.
          </>
        }
      />
      <p
        role="note"
        className="bg-warn-bg text-warn rounded-button m-0 flex gap-3 px-4 py-4 text-[14.5px]"
      >
        <WarningIcon className="mt-0.5 shrink-0" />
        Privacy check: upload the public version only. Remove your home address and personal phone
        number before uploading.
      </p>
      <label
        htmlFor="cv-file"
        className="rounded-card border-line bg-surface flex cursor-pointer flex-col items-center gap-2.5 border-2 border-dashed px-6 py-10 text-center"
      >
        <UploadIcon size={36} className="text-accent" />
        <span className="text-base font-semibold">
          Drop a PDF here or <span className="text-accent">browse</span>
        </span>
        <span className="text-ink-2 text-[13.5px]">
          PDF only · up to 10 MB · the previous version is kept
        </span>
        <input id="cv-file" type="file" accept="application/pdf" className="sr-only" disabled />
      </label>
      <section aria-labelledby="ver-h" className="rounded-card border-line bg-surface border p-6">
        <h2 id="ver-h" className="font-display m-0 mb-3 text-xl font-semibold">
          Versions
        </h2>
        <DataTable<Version>
          caption="CV versions"
          rows={versions}
          rowKey={(v) => v.label}
          columns={[
            {
              key: 'file',
              header: 'File',
              cell: (v) => <span className="font-medium">{v.label}</span>,
            },
            { key: 'uploaded', header: 'Uploaded', cell: () => '[date]', className: 'text-ink-2' },
            {
              key: 'status',
              header: 'Status',
              cell: (v) =>
                v.live ? (
                  <StatusPill tone="live">Live</StatusPill>
                ) : (
                  <StatusPill tone="muted">Archived</StatusPill>
                ),
            },
          ]}
        />
      </section>
    </div>
  )
}
