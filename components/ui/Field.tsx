import type { ComponentProps, ReactNode } from 'react'

const control =
  'w-full rounded-control border border-line bg-bg text-ink px-3.5 font-[inherit] text-base placeholder:text-ink-2'

type BaseProps = { id: string; label: ReactNode; hint?: ReactNode; className?: string }

export function TextField({
  id,
  label,
  hint,
  className = '',
  ...rest
}: BaseProps & Omit<ComponentProps<'input'>, 'id'>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
      </label>
      <input id={id} className={`${control} h-12`} {...rest} />
      {hint ? <span className="text-ink-2 text-[13px]">{hint}</span> : null}
    </div>
  )
}

export function TextAreaField({
  id,
  label,
  hint,
  className = '',
  rows = 5,
  ...rest
}: BaseProps & Omit<ComponentProps<'textarea'>, 'id'>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
      </label>
      <textarea id={id} rows={rows} className={`${control} resize-y py-3`} {...rest} />
      {hint ? <span className="text-ink-2 text-[13px]">{hint}</span> : null}
    </div>
  )
}

export function SelectField({
  id,
  label,
  options,
  className = '',
  ...rest
}: BaseProps & { options: readonly string[] } & Omit<ComponentProps<'select'>, 'id'>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
      </label>
      <select id={id} className={`${control} h-12`} {...rest}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
