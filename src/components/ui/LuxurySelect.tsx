'use client'

import { SelectHTMLAttributes, useId } from 'react'

interface LuxurySelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  variant?: 'dark' | 'light'
}

export default function LuxurySelect({
  label,
  variant = 'dark',
  className = '',
  id,
  children,
  ...rest
}: LuxurySelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const isLight = variant === 'light'
  const labelClass = isLight ? 'text-[#7f455a]' : 'text-[#ccb4bf]'
  const selectClass = isLight
    ? 'border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.68)] text-[#332631] focus:border-[rgba(107,35,57,0.34)] focus:shadow-[0_0_0_2px_rgba(107,35,57,0.10)]'
    : 'border-[rgba(143,82,103,0.18)] bg-[rgba(25,31,49,0.82)] text-[#f6ebef] focus:border-[rgba(143,82,103,0.42)] focus:shadow-[0_0_0_2px_rgba(143,82,103,0.10)]'

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fieldId} className={`mb-1.5 ml-1 block text-xs font-medium tracking-wide ${labelClass}`}>
          {label}
        </label>
      )}
      <select
        id={fieldId}
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${selectClass} ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}
