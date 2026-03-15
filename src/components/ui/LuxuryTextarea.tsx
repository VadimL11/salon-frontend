'use client'

import { TextareaHTMLAttributes, useId } from 'react'

interface LuxuryTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  variant?: 'dark' | 'light'
}

export default function LuxuryTextarea({
  label,
  variant = 'dark',
  className = '',
  id,
  ...rest
}: LuxuryTextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const isLight = variant === 'light'
  const labelClass = isLight ? 'text-[#8d6a31]' : 'text-[#c6a666]'
  const textareaClass = isLight
    ? 'border-[rgba(201,168,76,0.2)] bg-[rgba(253,250,245,0.72)] text-[#3d2a1a] placeholder:text-[rgba(122,92,68,0.55)] focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_2px_rgba(201,168,76,0.10)]'
    : 'border-[rgba(214,186,120,0.18)] bg-[rgba(18,16,13,0.78)] text-[#f2e2c2] placeholder:text-[rgba(214,186,120,0.28)] focus:border-[rgba(214,186,120,0.45)] focus:shadow-[0_0_0_2px_rgba(214,186,120,0.08)]'

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fieldId} className={`mb-1.5 ml-1 block text-xs font-medium tracking-wide ${labelClass}`}>
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        className={`min-h-[124px] w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${textareaClass} ${className}`}
        {...rest}
      />
    </div>
  )
}
