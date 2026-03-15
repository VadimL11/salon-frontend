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
  const labelClass = isLight ? 'text-[#8d6a31]' : 'text-[#c6a666]'
  const selectClass = isLight
    ? 'border-[rgba(201,168,76,0.2)] bg-[rgba(253,250,245,0.72)] text-[#3d2a1a] focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_2px_rgba(201,168,76,0.10)]'
    : 'border-[rgba(214,186,120,0.18)] bg-[rgba(18,16,13,0.78)] text-[#f2e2c2] focus:border-[rgba(214,186,120,0.45)] focus:shadow-[0_0_0_2px_rgba(214,186,120,0.08)]'

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
