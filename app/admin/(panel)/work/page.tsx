import { AdminPageHeader } from '@/components/admin/AdminUi'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { workAreas } from '@/content/samples'

const panel = 'rounded-[14px] border border-line bg-surface p-6'

export default function AdminWorkPage() {
  return (
    <>
      <AdminPageHeader
        title="Work samples"
        lead="New case study · up to 3 can be featured on Home"
        actions={
          <>
            <Button variant="secondary" size="md" disabled>
              Save draft
            </Button>
            <Button size="md" disabled>
              Publish
            </Button>
          </>
        }
      />
      <form aria-label="Edit case study" className="flex max-w-[900px] flex-col gap-5">
        <div className={`${panel} flex flex-col gap-4`}>
          <TextField id="w-title" label="Title" placeholder="[Case study title]" />
          <div className="flex flex-wrap gap-4">
            <SelectField
              id="w-area"
              label="Area"
              options={workAreas}
              className="flex-[1_1_200px]"
            />
            <TextField
              id="w-slug"
              label="URL slug"
              placeholder="case-study-slug"
              className="flex-[1_1_200px]"
            />
          </div>
          <TextAreaField id="w-summary" label="Summary (shown on cards)" rows={2} />
        </div>
        <div className={`${panel} grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4`}>
          <TextField id="w-role" label="My role" />
          <TextField id="w-time" label="Timeline" />
          <TextField id="w-scale" label="Scale" />
          <TextField id="w-stack" label="Stack / tags" placeholder="vSphere, vSAN" />
        </div>
        <div className={`${panel} flex flex-col gap-4`}>
          <TextAreaField id="w-problem" label="01 · The problem" rows={4} />
          <TextAreaField id="w-approach" label="02 · My approach" rows={5} />
          <TextAreaField id="w-outcome" label="03 · The outcome" rows={4} />
        </div>
        <div className={`${panel} flex flex-col gap-3`}>
          <span className="font-semibold">Images and files</span>
          <div className="text-ink-2 rounded-control border-line border border-dashed px-4 py-6 text-center text-sm">
            Cover, gallery and optional PDF upload — connected to Supabase Storage in Phase 4
          </div>
          <p className="text-ink-2 m-0 text-[13px]">
            Alt text is required for every image before publishing.
          </p>
        </div>
      </form>
    </>
  )
}
