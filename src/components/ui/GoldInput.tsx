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
  const labelClass = isLight ? 'text-[#8d6a31]' : 'text-[#b7924f]'
  const wrapperStyle = isLight
    ? {
        background:
          'linear-gradient(145deg, rgba(255,252,248,0.94) 0%, rgba(247,239,228,0.84) 100%)',
        border: '1px solid rgba(193,163,124,0.22)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.82), 0 8px 18px rgba(128,95,62,0.04)',
      }
    : {
        background: 'linear-gradient(145deg, rgba(56,48,40,0.82) 0%, rgba(41,35,30,0.76) 100%)',
        border: '1px solid rgba(201,168,76,0.18)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 22px rgba(0,0,0,0.14)',
      }
  const iconClass = isLight ? 'text-[#7a5833] opacity-72' : 'text-[#d0ae74] opacity-72'
  const inputClass = isLight
    ? 'text-[#4a3524] placeholder-[#9d8669] caret-[#b98c3d]'
    : 'text-[#f1dfbb] placeholder-[#8b7358] caret-[#c9a84c]'

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
          focus-within:border-[rgba(193,163,124,0.5)] focus-within:shadow-[0_0_0_2px_rgba(193,163,124,0.12)]"
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
