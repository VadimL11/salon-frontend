'use client'

import { InputHTMLAttributes, ReactNode, useId } from 'react'

interface GoldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  label?: string
  variant?: 'dark' | 'light'
}

export default function GoldInput({
  icon,
  label,
  variant = 'dark',
  className = '',
  id,
  ...rest
}: GoldInputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const isLight = variant === 'light'
  const labelClass = isLight ? 'text-[#7f455a]' : 'text-[#c8aebb]'
  const wrapperStyle = isLight
    ? {
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.86) 0%, rgba(244,236,239,0.84) 100%)',
        border: '1px solid rgba(107,35,57,0.14)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.82), 0 10px 24px rgba(53,28,40,0.05)',
      }
    : {
        background: 'linear-gradient(145deg, rgba(40,27,38,0.9) 0%, rgba(24,31,50,0.84) 100%)',
        border: '1px solid rgba(143,82,103,0.18)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), 0 14px 28px rgba(0,0,0,0.18)',
      }
  const iconClass = isLight ? 'text-[#744559] opacity-72' : 'text-[#d7bcc8] opacity-72'
  const inputClass = isLight
    ? 'text-[#342631] placeholder-[#9d8893] caret-[#6b2339]'
    : 'text-[#f7eef1] placeholder-[#a88f99] caret-[#8f5267]'

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={fieldId}
          className={`mb-1.5 ml-1 block text-xs font-sans font-medium tracking-wide ${labelClass}`}
        >
          {label}
        </label>
      )}
      <div
        className="flex w-full items-center gap-3 rounded-[1.15rem] px-4 py-3.5 transition-all duration-200
          focus-within:border-[rgba(107,35,57,0.34)] focus-within:shadow-[0_0_0_2px_rgba(107,35,57,0.10)]"
        style={wrapperStyle}
      >
        {icon && (
          <span className={`text-sm flex-shrink-0 ${iconClass}`}>
            {icon}
          </span>
        )}
        <input
          id={fieldId}
          {...rest}
          className={`w-full bg-transparent text-sm font-sans outline-none ${inputClass} ${className}`}
        />
      </div>
    </div>
  )
}
