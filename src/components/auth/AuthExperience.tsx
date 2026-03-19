'use client'

import { FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { User, Users, Phone, Mail, Lock, HelpCircle } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import GoldInput from '@/components/ui/GoldInput'
import LuxuryShell from '@/components/ui/LuxuryShell'
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

const AUTH_ICONS = {
  guest: HelpCircle,
  firstName: User,
  lastName: Users,
  phone: Phone,
  email: Mail,
  password: Lock,
} as const

function AuthGlyph({
  name,
  className = 'h-4 w-4',
}: {
  name: AuthIconName
  className?: string
}) {
  const Icon = AUTH_ICONS[name]
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />
}

function IconBadge({ name }: { name: AuthIconName }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(189,160,123,0.24)] bg-[linear-gradient(145deg,rgba(255,252,248,0.96)_0%,rgba(245,236,222,0.94)_58%,rgba(233,216,191,0.82)_100%)] text-[#6d4f36] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_22px_rgba(137,103,72,0.08)]">
      <AuthGlyph name={name} className="h-4 w-4" />
    </span>
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

  const enterGuest = () => {
    continueAsGuest()
    router.push('/menu')
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (registerForm.password !== registerForm.confirmPassword) {
      setError(t.auth.passwordMismatch)
      return
    }

    const result = await registerAccount({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
      email: registerForm.email,
      password: registerForm.password,
    })

    if (!result.ok) {
      setError(
        result.error === 'email_exists'
          ? t.auth.emailExists
          : result.error === 'invalid_credentials'
            ? t.auth.invalidCredentials
            : result.message ?? 'Request failed. Try again.'
      )
      return
    }

    router.push('/menu')
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const result = await loginAccount(loginForm)

    if (!result.ok) {
      setError(
        result.error === 'invalid_credentials'
          ? t.auth.invalidCredentials
          : result.error === 'email_exists'
            ? t.auth.emailExists
            : result.message ?? 'Request failed. Try again.'
      )
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
            <p className="text-xs uppercase tracking-[0.32em] text-[#7c4258]">
              TINTEL ACCESS
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold text-[#332631] sm:text-5xl">
              {t.auth.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[rgba(51,38,49,0.72)] sm:text-base">
              {t.auth.subtitle}
            </p>
          </motion.div>

          <GlassCard className="rounded-[32px] border-[rgba(107,35,57,0.14)] p-4 sm:p-5">
            <button
              onClick={enterGuest}
              className="flex w-full items-center gap-4 rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.48)] px-5 py-4 text-left transition-[background-color,transform,border-color] duration-150 hover:border-[rgba(107,35,57,0.2)] hover:bg-[rgba(255,255,255,0.66)]"
            >
              <IconBadge name="guest" />
              <div>
                <p className="text-sm font-medium text-[#332631]">{t.auth.guest}</p>
                <p className="mt-0.5 text-xs leading-5 text-[rgba(107,90,102,0.72)]">
                  {t.auth.guestSubtitle}
                </p>
              </div>
            </button>
          </GlassCard>
        </div>

        <GlassCard className="relative overflow-hidden rounded-[36px] border-[rgba(107,35,57,0.14)] p-5 sm:p-7 lg:mt-6">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0)_76%)]" />
          <div className="pointer-events-none absolute left-1/2 top-20 h-40 w-[88%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,82,103,0.14)_0%,rgba(143,82,103,0)_72%)] blur-3xl" />

          <div className="relative grid grid-cols-2 overflow-hidden rounded-[22px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.46)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
            <button
              onClick={() => switchView('register')}
              className={`rounded-[18px] px-4 py-4 text-sm font-medium transition-all duration-150 ${
                view === 'register'
                  ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(236,223,229,0.92)_54%,rgba(143,82,103,0.54)_100%)] text-[#332631] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_22px_rgba(65,31,46,0.10)]'
                  : 'text-[rgba(107,90,102,0.72)] hover:text-[#332631]'
              }`}
            >
              {t.auth.register}
            </button>
            <button
              onClick={() => switchView('login')}
              className={`rounded-[18px] px-4 py-4 text-sm font-medium transition-all duration-150 ${
                view === 'login'
                  ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(236,223,229,0.92)_54%,rgba(143,82,103,0.54)_100%)] text-[#332631] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_22px_rgba(65,31,46,0.10)]'
                  : 'text-[rgba(107,90,102,0.72)] hover:text-[#332631]'
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
                <h2 className="font-serif text-4xl font-semibold text-[#332631]">
                  {view === 'register' ? t.auth.registerTitle : t.auth.loginTitle}
                </h2>
                <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-[rgba(107,35,57,0.42)] to-transparent" />
                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[rgba(51,38,49,0.66)]">
                  {view === 'register' ? t.auth.registerSubtitle : t.auth.loginSubtitle}
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-[rgba(107,35,57,0.14)] bg-[rgba(255,241,245,0.74)] px-4 py-3 text-sm text-[#7a4055] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
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
