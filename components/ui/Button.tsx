import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2.5 font-semibold no-underline transition-colors disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:text-on-accent hover:brightness-110',
  secondary: 'border border-line bg-surface text-ink hover:border-ink-2 hover:text-ink',
  ghost: 'text-accent hover:text-ink',
}
const sizes: Record<Size, string> = {
  md: 'h-11 px-[18px] rounded-control text-[15px]',
  lg: 'h-[52px] px-6 rounded-button text-base',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'lg', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim()
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ButtonLink({
  variant = 'primary',
  size = 'lg',
  className = '',
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size }

export function Button({
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses(variant, size, className)} cursor-pointer`}
      {...rest}
    />
  )
}
