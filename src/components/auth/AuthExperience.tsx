'use client'

import { FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import GoldInput from '@/components/ui/GoldInput'
import LuxuryShell from '@/components/ui/LuxuryShell'
import { ADMIN_ACCOUNT } from '@/data/salon'
import { DICT } from '@/dictionaries'
import { useAppStore } from '@/store/useAppStore'

type AuthView = 'register' | 'login'
type AuthIconName =
  | 'guest'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'password'
  | 'admin'

function AuthGlyph({
  name,
  className = 'h-4 w-4',
}: {
  name: AuthIconName
  className?: string
}) {
  const shared = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.45,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }

  if (name === 'guest') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="7.25" />
        <path d="M12 8.85v3.5" />
        <path d="M12 15.55h.01" />
      </svg>
    )
  }

  if (name === 'firstName') {
    return (
      <svg {...shared}>
        <path d="M12 13.1a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
        <path d="M5.7 18.2a6.85 6.85 0 0 1 12.6 0" />
      </svg>
    )
  }

  if (name === 'lastName') {
    return (
      <svg {...shared}>
        <path d="M9.9 12.55a3.15 3.15 0 1 0 0-6.3 3.15 3.15 0 0 0 0 6.3Z" />
        <path d="M4.8 18.15a5.9 5.9 0 0 1 10.15-1.55" />
        <path d="M16.55 10.4a2.35 2.35 0 1 0 0-4.7" />
        <path d="M17.6 17.95h1.6" />
      </svg>
    )
  }

  if (name === 'phone') {
    return (
      <svg {...shared}>
        <path d="M8.55 5.7h6.9" />
        <rect x="7.2" y="3.95" width="9.6" height="16.1" rx="2.4" />
        <path d="M11.35 16.95h1.3" />
      </svg>
    )
  }

  if (name === 'email') {
    return (
      <svg {...shared}>
        <rect x="4.5" y="6.2" width="15" height="11.6" rx="2.4" />
        <path d="M5.7 8.15 12 12.55l6.3-4.4" />
      </svg>
    )
  }

  if (name === 'password') {
    return (
      <svg {...shared}>
        <rect x="6.2" y="10.15" width="11.6" height="8.35" rx="2.2" />
        <path d="M8.7 10.15V8.35A3.3 3.3 0 0 1 12 5.05a3.3 3.3 0 0 1 3.3 3.3v1.8" />
        <path d="M12 13.55v1.7" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <rect x="4.75" y="6" width="14.5" height="12.5" rx="3.1" />
      <path d="M8.1 10.05h7.8" />
      <path d="M8.1 13.1h7.8" />
      <path d="M8.1 16.15h4.3" />
    </svg>
  )
}

function IconBadge({ name }: { name: AuthIconName }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(189,160,123,0.24)] bg-[linear-gradient(145deg,rgba(255,252,248,0.96)_0%,rgba(245,236,222,0.94)_58%,rgba(233,216,191,0.82)_100%)] text-[#6d4f36] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_22px_rgba(137,103,72,0.08)]">
      <AuthGlyph name={name} className="h-4 w-4" />
    </span>
  )
}

function CredentialRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[rgba(193,163,124,0.18)] bg-[rgba(255,255,255,0.46)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
      <span className="text-[11px] uppercase tracking-[0.22em] text-[rgba(111,86,64,0.66)]">
        {label}
      </span>
      <span className="text-sm font-medium text-[#4a3524]">{value}</span>
    </div>
  )
}

export default function AuthExperience() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const continueAsGuest = useAppStore((state) => state.continueAsGuest)
  const registerAccount = useAppStore((state) => state.registerAccount)
  const loginAccount = useAppStore((state) => state.loginAccount)
  const t = DICT[language]

  const [view, setView] = useState<AuthView>('register')
  const [error, setError] = useState<string | null>(null)
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const fillAdminDemo = () => {
    setError(null)
    setView('login')
    setLoginForm({
      email: ADMIN_ACCOUNT.email,
      password: ADMIN_ACCOUNT.password,
    })
  }

  const enterGuest = () => {
    continueAsGuest()
    router.push('/menu')
  }

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (registerForm.password !== registerForm.confirmPassword) {
      setError(t.auth.passwordMismatch)
      return
    }

    const result = registerAccount({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
      email: registerForm.email,
      password: registerForm.password,
    })

    if (!result.ok) {
      setError(t.auth.emailExists)
      return
    }

    router.push('/menu')
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = loginAccount(loginForm)

    if (!result.ok) {
      setError(t.auth.invalidCredentials)
      return
    }

    router.push(result.role === 'admin' ? '/admin' : '/menu')
  }

  const switchView = (nextView: AuthView) => {
    setError(null)
    setView(nextView)
  }

  return (
    <LuxuryShell
      showBack
      showEndSession={false}
      backgroundVariant="light"
      maxWidth="max-w-6xl"
    >
      <div className="grid items-start gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="flex flex-col gap-5 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-[#9d742f]">
              TINTEL ACCESS
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold text-[#4a3524] sm:text-5xl">
              {t.auth.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[rgba(74,53,36,0.72)] sm:text-base">
              {t.auth.subtitle}
            </p>
          </motion.div>

          <GlassCard className="rounded-[32px] border-[rgba(193,163,124,0.2)] p-4 sm:p-5">
            <button
              onClick={enterGuest}
              className="flex w-full items-center gap-4 rounded-[24px] border border-[rgba(193,163,124,0.16)] bg-[rgba(255,255,255,0.44)] px-5 py-4 text-left transition-[background-color,transform,border-color] duration-150 hover:border-[rgba(193,163,124,0.24)] hover:bg-[rgba(255,255,255,0.62)]"
            >
              <IconBadge name="guest" />
              <div>
                <p className="text-sm font-medium text-[#4a3524]">{t.auth.guest}</p>
                <p className="mt-0.5 text-xs leading-5 text-[rgba(111,86,64,0.72)]">
                  {t.auth.guestSubtitle}
                </p>
              </div>
            </button>
          </GlassCard>

          <GlassCard className="rounded-[32px] border-[rgba(193,163,124,0.2)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[18rem]">
                <div className="mb-3 flex items-center gap-3">
                  <IconBadge name="admin" />
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8d6a31]">
                    {t.auth.adminDemoTitle}
                  </p>
                </div>
                <p className="text-sm leading-6 text-[rgba(74,53,36,0.72)]">{t.auth.adminHint}</p>
              </div>
              <GoldButton variant="ghost" className="px-4 py-2 text-xs" onClick={fillAdminDemo}>
                {t.auth.useAdminDemo}
              </GoldButton>
            </div>
            <div className="mt-4 grid gap-3">
              <CredentialRow label={t.auth.email} value={ADMIN_ACCOUNT.email} />
              <CredentialRow label={t.auth.password} value={ADMIN_ACCOUNT.password} />
            </div>
          </GlassCard>
        </div>

        <GlassCard className="relative overflow-hidden rounded-[36px] border-[rgba(193,163,124,0.22)] p-5 sm:p-7 lg:mt-6">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0)_76%)]" />
          <div className="pointer-events-none absolute left-1/2 top-20 h-40 w-[88%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,226,205,0.42)_0%,rgba(241,226,205,0)_72%)] blur-3xl" />

          <div className="relative grid grid-cols-2 overflow-hidden rounded-[22px] border border-[rgba(193,163,124,0.16)] bg-[rgba(255,255,255,0.4)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
            <button
              onClick={() => switchView('register')}
              className={`rounded-[18px] px-4 py-4 text-sm font-medium transition-all duration-150 ${
                view === 'register'
                  ? 'bg-[linear-gradient(135deg,rgba(253,246,233,0.98)_0%,rgba(236,214,177,0.86)_54%,rgba(214,174,95,0.76)_100%)] text-[#3d2a1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_22px_rgba(160,120,48,0.12)]'
                  : 'text-[rgba(111,86,64,0.72)] hover:text-[#4a3524]'
              }`}
            >
              {t.auth.register}
            </button>
            <button
              onClick={() => switchView('login')}
              className={`rounded-[18px] px-4 py-4 text-sm font-medium transition-all duration-150 ${
                view === 'login'
                  ? 'bg-[linear-gradient(135deg,rgba(253,246,233,0.98)_0%,rgba(236,214,177,0.86)_54%,rgba(214,174,95,0.76)_100%)] text-[#3d2a1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_22px_rgba(160,120,48,0.12)]'
                  : 'text-[rgba(111,86,64,0.72)] hover:text-[#4a3524]'
              }`}
            >
              {t.auth.login}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-8"
            >
              <div className="mb-6 text-center">
                <h2 className="font-serif text-4xl font-semibold text-[#4a3524]">
                  {view === 'register' ? t.auth.registerTitle : t.auth.loginTitle}
                </h2>
                <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-[rgba(160,120,48,0.55)] to-transparent" />
                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[rgba(74,53,36,0.66)]">
                  {view === 'register' ? t.auth.registerSubtitle : t.auth.loginSubtitle}
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-[rgba(193,163,124,0.18)] bg-[rgba(241,226,205,0.5)] px-4 py-3 text-sm text-[#7a5833] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  {error}
                </div>
              )}

              {view === 'register' ? (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <GoldInput
                    variant="light"
                    label={t.auth.firstName}
                    placeholder={t.auth.firstName}
                    value={registerForm.firstName}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, firstName: event.target.value }))
                    }
                    icon={<AuthGlyph name="firstName" />}
                    required
                  />
                  <GoldInput
                    variant="light"
                    label={t.auth.lastName}
                    placeholder={t.auth.lastName}
                    value={registerForm.lastName}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, lastName: event.target.value }))
                    }
                    icon={<AuthGlyph name="lastName" />}
                    required
                  />
                  <GoldInput
                    variant="light"
                    label={t.auth.phone}
                    placeholder={t.auth.phone}
                    value={registerForm.phone}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    icon={<AuthGlyph name="phone" />}
                    required
                  />
                  <GoldInput
                    variant="light"
                    type="email"
                    label={t.auth.email}
                    placeholder={t.auth.email}
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, email: event.target.value }))
                    }
                    icon={<AuthGlyph name="email" />}
                    required
                  />
                  <GoldInput
                    variant="light"
                    type="password"
                    label={t.auth.password}
                    placeholder={t.auth.password}
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, password: event.target.value }))
                    }
                    icon={<AuthGlyph name="password" />}
                    required
                  />
                  <GoldInput
                    variant="light"
                    type="password"
                    label={t.auth.confirmPassword}
                    placeholder={t.auth.confirmPassword}
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    icon={<AuthGlyph name="password" />}
                    required
                  />

                  <GoldButton type="submit" fullWidth className="mt-4 py-4 text-base">
                    {t.auth.createAccount}
                  </GoldButton>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleLogin}>
                  <GoldInput
                    variant="light"
                    type="email"
                    label={t.auth.email}
                    placeholder={t.auth.email}
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, email: event.target.value }))
                    }
                    icon={<AuthGlyph name="email" />}
                    required
                  />
                  <GoldInput
                    variant="light"
                    type="password"
                    label={t.auth.password}
                    placeholder={t.auth.password}
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, password: event.target.value }))
                    }
                    icon={<AuthGlyph name="password" />}
                    required
                  />

                  <div className="rounded-2xl border border-[rgba(193,163,124,0.16)] bg-[rgba(255,255,255,0.42)] px-4 py-3 text-xs leading-5 text-[rgba(111,86,64,0.74)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                    {t.auth.adminHint}
                  </div>

                  <GoldButton type="submit" fullWidth className="mt-4 py-4 text-base">
                    {t.auth.signIn}
                  </GoldButton>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </div>
    </LuxuryShell>
  )
}
