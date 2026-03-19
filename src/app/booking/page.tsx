'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import PageShell from '@/components/ui/PageShell'
import GoldButton from '@/components/ui/GoldButton'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.replace(/^API Error:\s*\d+\s*/, '').trim()
  }

  return 'Booking failed. Try another slot.'
}

export default function BookingPage() {
  const language = useAppStore((state) => state.language)
  const user = useAppStore((state) => state.user)
  const selectedCategoryName = useAppStore((state) => state.selectedCategoryName)
  const selectedCategoryId = useAppStore((state) => state.selectedCategoryId)
  const selectedService = useAppStore((state) => state.selectedService)
  const selectedServiceId = useAppStore((state) => state.selectedServiceId)
  const selectedMaster = useAppStore((state) => state.selectedMaster)
  const selectedMasterId = useAppStore((state) => state.selectedMasterId)
  const bookingSlots = useAppStore((state) => state.bookingSlots)
  const bookings = useAppStore((state) => state.bookings)
  const clearBooking = useAppStore((state) => state.clearBooking)
  const createBooking = useAppStore((state) => state.createBooking)
  const t = DICT[language].booking

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [confirmed, setConfirmed] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [note, setNote] = useState('')

  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null
  const blockedTimes = new Set(
    bookings
      .filter(
        (booking) =>
          booking.date === selectedDateKey &&
          (!selectedMasterId ? false : booking.masterId === selectedMasterId) &&
          booking.status !== 'cancelled'
      )
      .map((booking) => booking.time)
  )

  const groupedSlots = {
    morning: bookingSlots.filter((item) => item.period === 'morning'),
    afternoon: bookingSlots.filter((item) => item.period === 'afternoon'),
    evening: bookingSlots.filter((item) => item.period === 'evening'),
  }

  const formComplete = firstName.trim() && lastName.trim() && phone.trim()
  const canConfirm = Boolean(selectedDate && selectedTime && formComplete)

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !formComplete) {
      return
    }

    setError(null)
    setIsBooking(true)
    try {
      await createBooking({
        customer: {
          firstName,
          lastName,
          phone,
          email,
          role: user?.role,
        },
        categoryId: selectedCategoryId,
        serviceId: selectedServiceId,
        masterId: selectedMasterId,
        date: toDateKey(selectedDate),
        time: selectedTime,
        note,
      })

      setConfirmed(true)
    } catch (err) {
      console.error('Booking failed:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsBooking(false)
    }
  }

  const resetBooking = () => {
    setConfirmed(false)
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
    setPhone(user?.phone ?? '')
    setEmail(user?.email ?? '')
    setNote('')
    setError(null)
    clearBooking()
  }

  if (confirmed) {
    return (
      <PageShell showBack>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 py-16 text-center"
        >
          <div className="text-6xl">✓</div>
          <h2 className="font-serif text-3xl font-semibold text-[#332631]">{t.confirmed}</h2>
          <p className="text-[#6b5a66]">
            {selectedDate?.toLocaleDateString(language === 'DE' ? 'de-DE' : language === 'GB' ? 'en-GB' : 'uk-UA', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}{' '}
            • {selectedTime}
          </p>
          <p className="text-sm text-[#7c4258]">{t.confirmedSub}</p>
          <GoldButton onClick={resetBooking}>{t.newBooking}</GoldButton>
        </motion.div>
      </PageShell>
    )
  }

  return (
    <PageShell title={t.title} showBack contextPill={selectedCategoryName ?? undefined}>
      <div className="flex flex-col items-center gap-8">
        {(selectedService || selectedMaster) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {selectedService && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(107,35,57,0.2)] bg-[rgba(255,255,255,0.52)] px-4 py-2 text-sm font-medium text-[#332631]">
                <span className="text-[#7c4258]">{t.service}:</span> {selectedService}
              </span>
            )}
            {selectedMaster && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(107,35,57,0.2)] bg-[rgba(255,255,255,0.52)] px-4 py-2 text-sm font-medium text-[#332631]">
                <span className="text-[#7c4258]">{t.master}:</span> {selectedMaster}
              </span>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-card w-fit rounded-3xl p-6"
        >
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7c4258]">
            <span>◌</span> {t.dateLabel}
          </p>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              setSelectedTime(undefined)
              setError(null)
            }}
            disabled={{ before: new Date() }}
            fromMonth={new Date()}
          />
        </motion.div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card w-full max-w-2xl rounded-3xl p-6"
          >
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7c4258]">
              <span>◔</span> {t.timeLabel}
            </p>
            {bookingSlots.length === 0 ? (
              <p className="text-sm text-[#6b5a66]">{t.noSlots}</p>
            ) : (
              <div className="flex flex-col gap-5">
                {(['morning', 'afternoon', 'evening'] as const).map((period) => (
                  <div key={period}>
                    <p className="mb-2.5 text-xs font-medium text-[#6b5a66]">{t[period]}</p>
                    <div className="flex flex-wrap gap-2">
                      {groupedSlots[period].map((slot) => {
                        const isBlocked = blockedTimes.has(slot.time)

                        return (
                          <motion.button
                            key={slot.id}
                            onClick={() => {
                              if (isBlocked) {
                                return
                              }

                              setSelectedTime(slot.time)
                              setError(null)
                            }}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            disabled={isBlocked}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                              isBlocked
                                ? 'cursor-not-allowed border-[rgba(107,90,102,0.14)] bg-[rgba(255,255,255,0.32)] text-[rgba(107,90,102,0.42)]'
                                : selectedTime === slot.time
                                  ? 'border-transparent bg-[linear-gradient(135deg,#8f5267_0%,#6b2339_55%,#1d2942_100%)] text-white shadow-[0_0_18px_rgba(65,31,46,0.32)]'
                                  : 'border-[rgba(107,35,57,0.2)] bg-[rgba(255,255,255,0.46)] text-[#6b5a66] hover:bg-[rgba(107,35,57,0.08)]'
                            }`}
                          >
                            {slot.time}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card w-full max-w-2xl rounded-3xl p-6"
          >
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7c4258]">
              <span>✎</span> {t.formTitle}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder={t.firstName}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-2xl border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[#332631] placeholder-[#9d8893] transition-all duration-200 focus:border-[rgba(107,35,57,0.34)] focus:outline-none focus:shadow-[0_0_12px_rgba(107,35,57,0.12)]"
              />
              <input
                type="text"
                placeholder={t.lastName}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="w-full rounded-2xl border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[#332631] placeholder-[#9d8893] transition-all duration-200 focus:border-[rgba(107,35,57,0.34)] focus:outline-none focus:shadow-[0_0_12px_rgba(107,35,57,0.12)]"
              />
              <input
                type="tel"
                placeholder={t.phone}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-2xl border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[#332631] placeholder-[#9d8893] transition-all duration-200 focus:border-[rgba(107,35,57,0.34)] focus:outline-none focus:shadow-[0_0_12px_rgba(107,35,57,0.12)]"
              />
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[#332631] placeholder-[#9d8893] transition-all duration-200 focus:border-[rgba(107,35,57,0.34)] focus:outline-none focus:shadow-[0_0_12px_rgba(107,35,57,0.12)]"
              />
            </div>
            <textarea
              placeholder={t.note}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-4 min-h-[110px] w-full resize-y rounded-2xl border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[#332631] placeholder-[#9d8893] transition-all duration-200 focus:border-[rgba(107,35,57,0.34)] focus:outline-none focus:shadow-[0_0_12px_rgba(107,35,57,0.12)]"
            />
          </motion.div>
        )}

        {selectedDate && selectedTime && (
          <div className="flex flex-col items-center gap-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <GoldButton onClick={handleConfirm} disabled={!canConfirm || isBooking} className="px-12 py-4 text-base">
                {isBooking ? '...' : t.confirm}
              </GoldButton>
            </motion.div>
            {error && (
              <div className="w-full max-w-2xl rounded-2xl border border-[rgba(122,64,85,0.18)] bg-[rgba(255,241,245,0.76)] px-4 py-3 text-sm text-[#7a4055] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  )
}
