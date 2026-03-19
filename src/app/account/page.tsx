'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import GoldInput from '@/components/ui/GoldInput'
import LuxurySelect from '@/components/ui/LuxurySelect'
import LuxuryTextarea from '@/components/ui/LuxuryTextarea'
import { useAppStore } from '@/store/useAppStore'
import { DICT, type Dict } from '@/dictionaries'
import { getLocalizedText, type BookingRecord } from '@/data/salon'
import { getAccountCopy } from '@/lib/accountCopy'

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? ''
}

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, '') ?? ''
}

function formatDateLabel(language: 'UA' | 'DE' | 'GB', value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const locale = language === 'DE' ? 'de-DE' : language === 'GB' ? 'en-GB' : 'uk-UA'

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatBookingDate(language: 'UA' | 'DE' | 'GB', date: string, time: string) {
  return formatDateLabel(language, `${date}T${time}:00`)
}

function getStatusLabel(
  status: 'new' | 'confirmed' | 'completed' | 'cancelled',
  adminDict: Dict['admin']
) {
  switch (status) {
    case 'confirmed':
      return adminDict.statusConfirmed
    case 'completed':
      return adminDict.statusCompleted
    case 'cancelled':
      return adminDict.statusCancelled
    default:
      return adminDict.statusNew
  }
}

function cloneBooking(booking: BookingRecord): BookingRecord {
  return {
    ...booking,
    customer: { ...booking.customer },
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.replace(/^API Error:\s*\d+\s*/, '').trim()
  }

  return 'Request failed. Try again.'
}

export default function AccountPage() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const user = useAppStore((state) => state.user)
  const userRole = useAppStore((state) => state.userRole)
  const bookings = useAppStore((state) => state.bookings)
  const careOrderHistory = useAppStore((state) => state.careOrderHistory)
  const drinkOrderHistory = useAppStore((state) => state.drinkOrderHistory)
  const serviceCategories = useAppStore((state) => state.serviceCategories)
  const services = useAppStore((state) => state.services)
  const masters = useAppStore((state) => state.masters)
  const bookingSlots = useAppStore((state) => state.bookingSlots)
  const drinks = useAppStore((state) => state.drinks)
  const saveBooking = useAppStore((state) => state.saveBooking)
  const cancelCareOrder = useAppStore((state) => state.cancelCareOrder)
  const cancelDrinkOrder = useAppStore((state) => state.cancelDrinkOrder)
  const t = DICT[language]
  const accountCopy = getAccountCopy(language)
  const accountText = {
    orders: language === 'UA' ? 'Мої замовлення' : language === 'DE' ? 'Meine Bestellungen' : 'My orders',
    editBooking: language === 'UA' ? 'Редагувати' : language === 'DE' ? 'Bearbeiten' : 'Edit',
    saveChanges: language === 'UA' ? 'Зберегти зміни' : language === 'DE' ? 'Änderungen speichern' : 'Save changes',
    closeEditor: language === 'UA' ? 'Закрити' : language === 'DE' ? 'Schließen' : 'Close',
    cancelBooking:
      language === 'UA' ? 'Відмінити запис' : language === 'DE' ? 'Termin stornieren' : 'Cancel booking',
    editTitle: language === 'UA' ? 'Редагування запису' : language === 'DE' ? 'Termin bearbeiten' : 'Edit booking',
    requestFailed:
      language === 'UA'
        ? 'Не вдалося оновити запис.'
        : language === 'DE'
          ? 'Termin konnte nicht aktualisiert werden.'
          : 'Failed to update booking.',
  }
  const cancelOrderText =
    language === 'UA' ? 'Скасувати замовлення' : language === 'DE' ? 'Bestellung stornieren' : 'Cancel order'
  const orderCareAgainText =
    language === 'UA' ? 'Замовити ще' : language === 'DE' ? 'Erneut bestellen' : 'Order again'
  const orderDrinkAgainText =
    language === 'UA' ? 'Замовити ще' : language === 'DE' ? 'Erneut bestellen' : 'Order again'

  const [editingBookingId, setEditingBookingId] = useState<string | null>(null)
  const [bookingDraft, setBookingDraft] = useState<BookingRecord | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState(false)

  if (!user || userRole === 'guest') {
    return (
      <PageShell title={accountCopy.title} showBack maxWidth="max-w-3xl">
        <GlassCard className="rounded-[30px] px-7 py-8 text-center sm:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#7c4258]">{accountCopy.title}</p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#332631]">{accountCopy.authRequired}</h2>
          <div className="mt-8">
            <GoldButton onClick={() => router.push('/auth')}>{accountCopy.goToAuth}</GoldButton>
          </div>
        </GlassCard>
      </PageShell>
    )
  }

  const userEmail = normalizeEmail(user.email)
  const userPhone = normalizePhone(user.phone)
  const sortedBookingSlots = [...bookingSlots].sort((left, right) => left.time.localeCompare(right.time))

  const myBookings = (userRole === 'client'
    ? bookings
    : bookings.filter((booking) => {
        const bookingEmail = normalizeEmail(booking.customer.email)
        const bookingPhone = normalizePhone(booking.customer.phone)

        return Boolean((userEmail && bookingEmail === userEmail) || (userPhone && bookingPhone === userPhone))
      }))
    .sort((left, right) => {
      const leftDate = new Date(`${left.date}T${left.time}:00`).getTime()
      const rightDate = new Date(`${right.date}T${right.time}:00`).getTime()
      return rightDate - leftDate
    })

  const myCareOrders = (userRole === 'client'
    ? careOrderHistory
    : careOrderHistory.filter((order) => normalizeEmail(order.email) === userEmail))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))

  const myDrinkOrders = (userRole === 'client'
    ? drinkOrderHistory
    : drinkOrderHistory.filter((order) => normalizeEmail(order.email) === userEmail))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))

  const runMutation = async (action: () => Promise<void>) => {
    setMutationError(null)
    setIsMutating(true)

    try {
      await action()
    } catch (error) {
      console.error('Account booking action failed:', error)
      setMutationError(getErrorMessage(error) || accountText.requestFailed)
    } finally {
      setIsMutating(false)
    }
  }

  const handleStartEdit = (booking: BookingRecord) => {
    setEditingBookingId(booking.id)
    setBookingDraft(cloneBooking(booking))
    setMutationError(null)
  }

  const handleCloseEditor = () => {
    setEditingBookingId(null)
    setBookingDraft(null)
    setMutationError(null)
  }

  const handleSaveBookingChanges = () => {
    if (!bookingDraft) {
      return
    }

    void runMutation(async () => {
      await saveBooking({
        ...bookingDraft,
        customer: {
          ...bookingDraft.customer,
          email: bookingDraft.customer.email || user.email,
          phone: bookingDraft.customer.phone || user.phone,
        },
      })

      handleCloseEditor()
    })
  }

  const handleCancelBooking = (booking: BookingRecord) => {
    void runMutation(async () => {
      await saveBooking({
        ...booking,
        status: 'cancelled',
      })

      if (editingBookingId === booking.id) {
        handleCloseEditor()
      }
    })
  }

  const handleCancelCareOrder = (orderId: string) => {
    void runMutation(async () => {
      await cancelCareOrder(orderId)
    })
  }

  const handleCancelDrinkOrder = (orderId: string) => {
    void runMutation(async () => {
      await cancelDrinkOrder(orderId)
    })
  }

  return (
    <PageShell title={accountCopy.title} showBack maxWidth="max-w-6xl">
      <div className="flex flex-col gap-6">
        <GlassCard className="rounded-[32px] px-7 py-7 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#7c4258]">{accountCopy.signedInAs}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#332631]">
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6b5a66]">{accountCopy.subtitle}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.5)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#7c4258]">{accountCopy.profile}</p>
                <p className="mt-2 text-sm font-medium text-[#332631]">{user.email}</p>
                <p className="mt-1 text-sm text-[#6b5a66]">{user.phone || '—'}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.5)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#7c4258]">{accountCopy.bookings}</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-[#332631]">{myBookings.length}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.5)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#7c4258]">{accountText.orders}</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-[#332631]">
                  {myCareOrders.length + myDrinkOrders.length}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(19rem,0.92fr)_minmax(19rem,0.92fr)]">
          <GlassCard className="rounded-[32px] px-6 py-6">
            <h3 className="font-serif text-2xl font-semibold text-[#332631]">{accountCopy.bookings}</h3>
            {mutationError && (
              <div className="mt-4 rounded-[20px] border border-[rgba(122,64,85,0.18)] bg-[rgba(255,241,245,0.76)] px-4 py-3 text-sm text-[#7a4055]">
                {mutationError}
              </div>
            )}
            <div className="mt-5 flex flex-col gap-3">
              {myBookings.length === 0 ? (
                <p className="text-sm text-[#6b5a66]">{accountCopy.noBookings}</p>
              ) : (
                myBookings.map((booking) => {
                  const service = services.find((item) => item.id === booking.serviceId)
                  const master = masters.find((item) => item.id === booking.masterId)
                  const isEditing = editingBookingId === booking.id && bookingDraft?.id === booking.id
                  const editableServices = services.filter(
                    (item) => !bookingDraft?.categoryId || item.categoryId === bookingDraft.categoryId
                  )
                  const canManage = booking.status !== 'completed' && booking.status !== 'cancelled'

                  return (
                    <div
                      key={booking.id}
                      className="rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.54)] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-[#332631]">
                          {service ? getLocalizedText(service.title, language) : booking.serviceId || t.booking.service}
                        </p>
                        <span className="rounded-full bg-[rgba(107,35,57,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7c4258]">
                          {getStatusLabel(booking.status, t.admin)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#6b5a66]">
                        {t.booking.master}: {master?.name || booking.masterId || '—'}
                      </p>
                      <p className="mt-1 text-sm text-[#6b5a66]">
                        {formatBookingDate(language, booking.date, booking.time)}
                      </p>
                      {booking.note && <p className="mt-2 text-sm text-[#7c4258]">{booking.note}</p>}
                      <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(107,90,102,0.72)]">
                        {accountCopy.bookedAt}: {formatDateLabel(language, booking.createdAt)}
                      </p>

                      {canManage && !isEditing && (
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <GoldButton
                            variant="ghost"
                            className="w-full sm:w-auto"
                            disabled={isMutating}
                            onClick={() => handleStartEdit(booking)}
                          >
                            {accountText.editBooking}
                          </GoldButton>
                          <GoldButton
                            variant="ghost"
                            className="w-full sm:w-auto"
                            disabled={isMutating}
                            onClick={() => handleCancelBooking(booking)}
                          >
                            {accountText.cancelBooking}
                          </GoldButton>
                        </div>
                      )}

                      {isEditing && bookingDraft && (
                        <div className="mt-4 space-y-3 rounded-[22px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.62)] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c4258]">
                            {accountText.editTitle}
                          </p>
                          <div className="grid gap-3">
                            <LuxurySelect
                              variant="light"
                              label={t.admin.category}
                              value={bookingDraft.categoryId ?? ''}
                              onChange={(event) =>
                                setBookingDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        categoryId: event.target.value || null,
                                        serviceId: null,
                                      }
                                    : current
                                )
                              }
                            >
                              <option value="">{t.admin.empty}</option>
                              {serviceCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.title[language]}
                                </option>
                              ))}
                            </LuxurySelect>
                            <LuxurySelect
                              variant="light"
                              label={t.booking.service}
                              value={bookingDraft.serviceId ?? ''}
                              onChange={(event) =>
                                setBookingDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        serviceId: event.target.value || null,
                                      }
                                    : current
                                )
                              }
                            >
                              <option value="">{t.admin.empty}</option>
                              {editableServices.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {getLocalizedText(item.title, language)}
                                </option>
                              ))}
                            </LuxurySelect>
                            <LuxurySelect
                              variant="light"
                              label={t.booking.master}
                              value={bookingDraft.masterId ?? ''}
                              onChange={(event) =>
                                setBookingDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        masterId: event.target.value || null,
                                      }
                                    : current
                                )
                              }
                            >
                              <option value="">{t.admin.empty}</option>
                              {masters.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </LuxurySelect>
                            <GoldInput
                              variant="light"
                              type="date"
                              label={t.booking.dateLabel}
                              value={bookingDraft.date}
                              onChange={(event) =>
                                setBookingDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        date: event.target.value,
                                      }
                                    : current
                                )
                              }
                            />
                            {sortedBookingSlots.length ? (
                              <LuxurySelect
                                variant="light"
                                label={t.booking.timeLabel}
                                value={bookingDraft.time}
                                onChange={(event) =>
                                  setBookingDraft((current) =>
                                    current
                                      ? {
                                          ...current,
                                          time: event.target.value,
                                        }
                                      : current
                                  )
                                }
                              >
                                {sortedBookingSlots.map((slot) => (
                                  <option key={slot.id} value={slot.time}>
                                    {slot.time}
                                  </option>
                                ))}
                              </LuxurySelect>
                            ) : (
                              <GoldInput
                                variant="light"
                                type="time"
                                label={t.booking.timeLabel}
                                value={bookingDraft.time}
                                onChange={(event) =>
                                  setBookingDraft((current) =>
                                    current
                                      ? {
                                          ...current,
                                          time: event.target.value,
                                        }
                                      : current
                                  )
                                }
                              />
                            )}
                            <LuxuryTextarea
                              variant="light"
                              label={t.booking.note}
                              value={bookingDraft.note}
                              onChange={(event) =>
                                setBookingDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        note: event.target.value,
                                      }
                                    : current
                                )
                              }
                            />
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <GoldButton fullWidth onClick={handleSaveBookingChanges} disabled={isMutating}>
                              {isMutating ? '...' : accountText.saveChanges}
                            </GoldButton>
                            <GoldButton fullWidth variant="ghost" disabled={isMutating} onClick={handleCloseEditor}>
                              {accountText.closeEditor}
                            </GoldButton>
                            <GoldButton
                              fullWidth
                              variant="ghost"
                              className="sm:col-span-2"
                              disabled={isMutating}
                              onClick={() => handleCancelBooking(bookingDraft)}
                            >
                              {accountText.cancelBooking}
                            </GoldButton>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] px-6 py-6">
            <h3 className="font-serif text-2xl font-semibold text-[#332631]">{accountCopy.productOrders}</h3>
            <div className="mt-5 flex flex-col gap-3">
              {myCareOrders.length === 0 ? (
                <p className="text-sm text-[#6b5a66]">{accountCopy.noProductOrders}</p>
              ) : (
                myCareOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.54)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-[#332631]">{accountCopy.total}</p>
                      <span className="font-serif text-xl font-semibold text-[#6b2339]">€{order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-3 text-sm text-[#6b5a66]">
                          <span>{item.name}</span>
                          <span>
                            {accountCopy.quantity}: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(107,90,102,0.72)]">
                      {accountCopy.orderedAt}: {formatDateLabel(language, order.createdAt)}
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <GoldButton
                        fullWidth
                        variant="ghost"
                        disabled={isMutating}
                        onClick={() => handleCancelCareOrder(order.id)}
                      >
                        {cancelOrderText}
                      </GoldButton>
                      <GoldButton fullWidth disabled={isMutating} onClick={() => router.push('/order-product')}>
                        {orderCareAgainText}
                      </GoldButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] px-6 py-6">
            <h3 className="font-serif text-2xl font-semibold text-[#332631]">{accountCopy.drinkOrders}</h3>
            <div className="mt-5 flex flex-col gap-3">
              {myDrinkOrders.length === 0 ? (
                <p className="text-sm text-[#6b5a66]">{accountCopy.noDrinkOrders}</p>
              ) : (
                myDrinkOrders.map((order) => {
                  const drink = drinks.find((item) => item.id === order.drinkId)

                  return (
                    <div
                      key={order.id}
                      className="rounded-[24px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.54)] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-[#332631]">
                          {drink ? getLocalizedText(drink.title, language) : order.drinkId}
                        </p>
                        <span className="text-2xl">{drink?.icon || '☕'}</span>
                      </div>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(107,90,102,0.72)]">
                        {accountCopy.orderedAt}: {formatDateLabel(language, order.createdAt)}
                      </p>
                      <div className="mt-4 grid gap-2">
                        <GoldButton
                          fullWidth
                          variant="ghost"
                          disabled={isMutating}
                          onClick={() => handleCancelDrinkOrder(order.id)}
                        >
                          {cancelOrderText}
                        </GoldButton>
                        <GoldButton fullWidth disabled={isMutating} onClick={() => router.push('/order-drink')}>
                          {orderDrinkAgainText}
                        </GoldButton>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageShell>
  )
}
