'use client'

import { type ChangeEvent, type ReactNode, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BadgeEuro,
  BarChart3,
  CalendarDays,
  Clock3,
  Coffee,
  ListFilter,
  Package,
  Scissors,
  Shield,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import GoldInput from '@/components/ui/GoldInput'
import LuxurySelect from '@/components/ui/LuxurySelect'
import LuxuryShell from '@/components/ui/LuxuryShell'
import LuxuryTextarea from '@/components/ui/LuxuryTextarea'
import { DICT } from '@/dictionaries'
import {
  getLocalizedText,
  type BookingPeriod,
  type BookingRecord,
  type BookingSlot,
  type CareProduct,
  type DrinkItem,
  type LocalizedText,
  type Master,
  type MasterCredential,
  type ServiceCategory,
  type ServiceItem,
  type TrendItem,
} from '@/data/salon'
import { useAppStore, type CareOrderRecord } from '@/store/useAppStore'

type TabKey =
  | 'categories'
  | 'masters'
  | 'services'
  | 'prices'
  | 'slots'
  | 'products'
  | 'drinks'
  | 'trends'
  | 'bookings'

const BLANK_LOCALIZED: LocalizedText = { UA: '', DE: '', GB: '' }
const SEEN_BOOKINGS_STORAGE_KEY = 'salon-admin-seen-bookings'
const SEEN_CARE_ORDERS_STORAGE_KEY = 'salon-admin-seen-care-orders'

const BLANK_MASTER: Master = {
  id: '',
  name: '',
  role: BLANK_LOCALIZED,
  initials: '',
  experienceLabel: '',
  specialtyCategoryIds: [],
  credentials: [],
}

const BLANK_CATEGORY: ServiceCategory = {
  id: '',
  slug: '',
  icon: '*',
  title: BLANK_LOCALIZED,
  description: BLANK_LOCALIZED,
}

const BLANK_SERVICE: ServiceItem = {
  id: '',
  categoryId: '',
  title: BLANK_LOCALIZED,
  durationMinutes: 60,
  price: 50,
}

const BLANK_SLOT: BookingSlot = {
  id: '',
  period: 'morning',
  time: '09:00',
}

const BLANK_PRODUCT: CareProduct = {
  id: '',
  title: BLANK_LOCALIZED,
  brand: '',
  price: 20,
  icon: '◍',
}

const BLANK_DRINK: DrinkItem = {
  id: '',
  title: BLANK_LOCALIZED,
  icon: '☕',
}

const BLANK_TREND: TrendItem = {
  id: '',
  title: BLANK_LOCALIZED,
  description: BLANK_LOCALIZED,
  gradient: 'linear-gradient(135deg, #c59b57 0%, #f0d7a1 45%, #d5b277 100%)',
  emoji: '✦',
}

const BLANK_BOOKING: BookingRecord = {
  id: '',
  customer: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  },
  categoryId: null,
  serviceId: null,
  masterId: null,
  date: '',
  time: '09:00',
  status: 'new',
  note: '',
  createdAt: '',
}

const TAB_ACCENTS: Record<TabKey | 'revenue' | 'lock', string> = {
  categories: 'from-[rgba(242,232,211,0.84)] via-[rgba(253,250,245,0.94)] to-[rgba(224,194,142,0.42)]',
  masters: 'from-[rgba(232,213,163,0.72)] via-[rgba(244,236,220,0.88)] to-[rgba(214,186,120,0.52)]',
  services: 'from-[rgba(244,229,209,0.84)] via-[rgba(253,250,245,0.92)] to-[rgba(232,213,163,0.45)]',
  prices: 'from-[rgba(230,212,184,0.78)] via-[rgba(252,246,235,0.9)] to-[rgba(201,168,76,0.36)]',
  slots: 'from-[rgba(239,229,212,0.82)] via-[rgba(253,250,245,0.92)] to-[rgba(224,200,152,0.42)]',
  products: 'from-[rgba(245,235,217,0.86)] via-[rgba(253,250,245,0.92)] to-[rgba(217,192,154,0.46)]',
  drinks: 'from-[rgba(250,241,226,0.9)] via-[rgba(255,252,247,0.94)] to-[rgba(232,213,163,0.42)]',
  trends: 'from-[rgba(238,227,205,0.82)] via-[rgba(253,250,245,0.92)] to-[rgba(201,168,76,0.34)]',
  bookings: 'from-[rgba(243,232,214,0.88)] via-[rgba(255,252,247,0.94)] to-[rgba(214,186,120,0.42)]',
  revenue: 'from-[rgba(232,213,163,0.72)] via-[rgba(255,249,238,0.94)] to-[rgba(201,168,76,0.34)]',
  lock: 'from-[rgba(237,223,198,0.8)] via-[rgba(255,252,247,0.92)] to-[rgba(217,192,154,0.34)]',
}

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function cloneLocalized(value: LocalizedText): LocalizedText {
  return { UA: value.UA, DE: value.DE, GB: value.GB }
}

function cloneCategory(item: ServiceCategory): ServiceCategory {
  return {
    ...item,
    title: cloneLocalized(item.title),
    description: cloneLocalized(item.description),
  }
}

function cloneMaster(item: Master): Master {
  return {
    ...item,
    role: cloneLocalized(item.role),
    specialtyCategoryIds: [...item.specialtyCategoryIds],
    credentials: (item.credentials ?? []).map((credential) => ({ ...credential })),
  }
}

function cloneService(item: ServiceItem): ServiceItem {
  return {
    ...item,
    title: cloneLocalized(item.title),
  }
}

function cloneSlot(item: BookingSlot): BookingSlot {
  return { ...item }
}

function cloneProduct(item: CareProduct): CareProduct {
  return {
    ...item,
    title: cloneLocalized(item.title),
  }
}

function cloneDrink(item: DrinkItem): DrinkItem {
  return {
    ...item,
    title: cloneLocalized(item.title),
  }
}

function cloneTrend(item: TrendItem): TrendItem {
  return {
    ...item,
    title: cloneLocalized(item.title),
    description: cloneLocalized(item.description),
  }
}

function cloneBooking(item: BookingRecord): BookingRecord {
  return {
    ...item,
    customer: { ...item.customer },
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.replace(/^API Error:\s*\d+\s*/, '').trim()
  }

  return 'Request failed. Try again.'
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readStoredIds(key: string) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(key)
    if (!value) {
      return []
    }

    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Failed to read image.'))
    }

    reader.onerror = () => reject(reader.error ?? new Error('Failed to read image.'))
    reader.readAsDataURL(file)
  })
}

function AdminGlyph({
  kind,
  className = '',
}: {
  kind: TabKey | 'revenue' | 'lock'
  className?: string
}) {
  const iconMap: Record<TabKey | 'revenue' | 'lock', LucideIcon> = {
    categories: ListFilter,
    masters: UsersRound,
    services: Scissors,
    prices: BadgeEuro,
    slots: Clock3,
    products: Package,
    drinks: Coffee,
    trends: Sparkles,
    bookings: CalendarDays,
    revenue: BarChart3,
    lock: Shield,
  }

  const Icon = iconMap[kind]

  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />
}

function SectionHeading({
  kind,
  title,
  badge,
  action,
}: {
  kind: TabKey
  title: string
  badge?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-[18px] border border-[rgba(201,168,76,0.18)] bg-gradient-to-br ${TAB_ACCENTS[kind]} text-[#9d742f] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]`}>
          <AdminGlyph kind={kind} className="h-5 w-5" />
        </div>
        <h2 className="min-w-0 font-serif text-[1.65rem] text-[#3d2a1a]">{title}</h2>
      </div>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        {badge && (
          <span className="rounded-full border border-[rgba(201,168,76,0.22)] bg-[rgba(255,255,255,0.48)] px-3 py-1 text-[11px] font-medium tracking-[0.24em] text-[#8d6a31]">
            {badge}
          </span>
        )}
        {action}
      </div>
    </div>
  )
}

function StatCard({
  kind = 'revenue',
  label,
  value,
}: {
  kind?: TabKey | 'revenue'
  label: string
  value: string
}) {
  return (
    <GlassCard hoverable className="relative overflow-hidden rounded-[30px] border-[rgba(201,168,76,0.2)] p-5">
      <div className={`pointer-events-none absolute inset-x-8 top-0 h-20 bg-gradient-to-r ${TAB_ACCENTS[kind]} opacity-55 blur-2xl`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[rgba(122,92,68,0.62)]">{label}</p>
          <p className="mt-3 font-serif text-3xl text-[#3d2a1a]">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(201,168,76,0.16)] bg-gradient-to-br ${TAB_ACCENTS[kind]} text-[#9d742f] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]`}>
          <AdminGlyph kind={kind} className="h-5 w-5" />
        </div>
      </div>
    </GlassCard>
  )
}

function TabButton({
  active,
  label,
  kind,
  count,
  onClick,
}: {
  active: boolean
  label: string
  kind: TabKey
  count: number
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 360, damping: 24, mass: 0.55 }}
      whileHover={{ y: -2, scale: 1.008 }}
      whileTap={{ scale: 0.986, y: 1 }}
      className={`w-full rounded-[24px] border p-4 text-left transition-all duration-200 ${
        active
          ? 'border-[rgba(201,168,76,0.3)] bg-[linear-gradient(135deg,rgba(248,240,226,0.96)_0%,rgba(237,224,197,0.86)_100%)] shadow-[0_14px_34px_rgba(160,120,48,0.12)]'
          : 'border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.48)] hover:border-[rgba(201,168,76,0.26)] hover:bg-[rgba(255,255,255,0.68)]'
      } touch-manipulation`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-[16px] border transition-colors ${
          active
            ? `border-[rgba(201,168,76,0.14)] bg-gradient-to-br ${TAB_ACCENTS[kind]} text-[#8d6a31]`
            : 'border-[rgba(201,168,76,0.16)] bg-[rgba(253,250,245,0.72)] text-[#a07830]'
        }`}>
          <AdminGlyph kind={kind} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium ${active ? 'text-[#3d2a1a]' : 'text-[#5a4330]'}`}>{label}</p>
          <p className={`mt-1 text-[11px] tracking-[0.24em] uppercase ${active ? 'text-[rgba(61,42,26,0.5)]' : 'text-[rgba(122,92,68,0.48)]'}`}>
            {String(count).padStart(2, '0')}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

function Workspace({
  list,
  editor,
}: {
  list: ReactNode
  editor: ReactNode
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <GlassCard hoverable className="rounded-[34px] border-[rgba(201,168,76,0.2)] p-4 sm:p-5">
        {list}
      </GlassCard>
      <GlassCard hoverable className="rounded-[34px] border-[rgba(201,168,76,0.2)] p-5 sm:p-6">
        {editor}
      </GlassCard>
    </div>
  )
}

function ItemButton({
  active,
  title,
  subtitle,
  meta,
  onClick,
}: {
  active: boolean
  title: string
  subtitle: string
  meta?: string
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 360, damping: 24, mass: 0.55 }}
      whileHover={{ y: -2, scale: 1.006 }}
      whileTap={{ scale: 0.986, y: 1 }}
      className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-200 ${
        active
          ? 'border-[rgba(201,168,76,0.34)] bg-[linear-gradient(135deg,rgba(248,240,226,0.96)_0%,rgba(238,225,198,0.78)_100%)] shadow-[0_10px_24px_rgba(160,120,48,0.10)]'
          : 'border-[rgba(201,168,76,0.15)] bg-[rgba(255,255,255,0.46)] hover:border-[rgba(201,168,76,0.24)] hover:bg-[rgba(255,255,255,0.68)]'
      } touch-manipulation`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#3d2a1a]">{title}</p>
          <p className="mt-1 text-xs text-[rgba(90,67,48,0.62)]">{subtitle}</p>
        </div>
        {meta && (
          <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.45)] px-2.5 py-1 text-[11px] text-[#8d6a31]">
            {meta}
          </span>
        )}
      </div>
    </motion.button>
  )
}

function LocalizedFields({
  labels,
  value,
  onChange,
}: {
  labels: { ua: string; de: string; gb: string }
  value: LocalizedText
  onChange: (next: LocalizedText) => void
}) {
  return (
    <div className="grid gap-4">
      <GoldInput variant="light" label={labels.ua} value={value.UA} onChange={(event) => onChange({ ...value, UA: event.target.value })} />
      <GoldInput variant="light" label={labels.de} value={value.DE} onChange={(event) => onChange({ ...value, DE: event.target.value })} />
      <GoldInput variant="light" label={labels.gb} value={value.GB} onChange={(event) => onChange({ ...value, GB: event.target.value })} />
    </div>
  )
}

function CategoryChips({
  categories,
  selectedIds,
  onToggle,
}: {
  categories: ServiceCategory[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <p className="mb-2 ml-1 text-xs font-medium tracking-wide text-[#8d6a31]">Specialties</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = selectedIds.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggle(category.id)}
              className={`rounded-full px-3 py-2 text-xs transition-all duration-200 ${
                active
                  ? 'bg-[linear-gradient(135deg,rgba(240,229,210,0.92)_0%,rgba(232,213,163,0.68)_100%)] text-[#3d2a1a] ring-1 ring-[rgba(201,168,76,0.28)]'
                  : 'border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.48)] text-[rgba(90,67,48,0.72)] hover:bg-[rgba(255,255,255,0.66)]'
              }`}
            >
              {category.icon} {category.title.GB}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const router = useRouter()
  const {
    language,
    userRole,
    serviceCategories,
    services,
    masters,
    bookingSlots,
    careProducts,
    careOrderHistory,
    drinks,
    drinkOrderHistory,
    trends,
    bookings,
    saveCategory,
    deleteCategory,
    saveService,
    deleteService,
    saveMaster,
    deleteMaster,
    saveBookingSlot,
    deleteBookingSlot,
    saveCareProduct,
    deleteCareProduct,
    saveDrink,
    deleteDrink,
    saveTrend,
    deleteTrend,
    saveBooking,
    deleteBooking,
  } = useAppStore()
  const t = DICT[language]
  const adminText = {
    categories: t.admin.categories ?? 'Categories',
    slug: t.admin.slug ?? 'Slug',
    uploadImage: t.admin.uploadImage ?? 'Upload photo',
    removeImage: t.admin.removeImage ?? 'Remove photo',
    requestFailed: t.admin.requestFailed ?? 'Request failed. Try again.',
    saving: t.admin.saving ?? 'Saving...',
    confirmBooking: language === 'UA' ? 'Підтвердити' : language === 'DE' ? 'Bestätigen' : 'Confirm',
    cancelBooking: language === 'UA' ? 'Відмінити' : language === 'DE' ? 'Stornieren' : 'Cancel',
    currentStatus: language === 'UA' ? 'Поточний статус' : language === 'DE' ? 'Aktueller Status' : 'Current status',
    credentials:
      language === 'UA'
        ? 'Дипломи та сертифікати'
        : language === 'DE'
          ? 'Diplome und Zertifikate'
          : 'Diplomas & certificates',
    uploadCredentials:
      language === 'UA'
        ? 'Завантажити дипломи або сертифікати'
        : language === 'DE'
          ? 'Diplome oder Zertifikate hochladen'
          : 'Upload diplomas or certificates',
    removeDocument: language === 'UA' ? 'Прибрати файл' : language === 'DE' ? 'Datei entfernen' : 'Remove file',
    openDocument: language === 'UA' ? 'Відкрити' : language === 'DE' ? 'Öffnen' : 'Open',
    noCredentials:
      language === 'UA'
        ? 'Документи ще не додані.'
        : language === 'DE'
          ? 'Noch keine Dokumente hochgeladen.'
          : 'No documents uploaded yet.',
    careOrders:
      language === 'UA' ? 'Замовлення догляду' : language === 'DE' ? 'Pflegebestellungen' : 'Care orders',
    drinkOrders:
      language === 'UA' ? 'Замовлення напоїв' : language === 'DE' ? 'Getränkebestellungen' : 'Drink orders',
    noCareOrders:
      language === 'UA'
        ? 'Замовлень догляду ще немає.'
        : language === 'DE'
          ? 'Noch keine Pflegebestellungen.'
          : 'No care orders yet.',
    noDrinkOrders:
      language === 'UA'
        ? 'Замовлень напоїв ще немає.'
        : language === 'DE'
          ? 'Noch keine Getränkebestellungen.'
          : 'No drink orders yet.',
    noBookings:
      language === 'UA'
        ? 'Бронювань ще немає.'
        : language === 'DE'
          ? 'Noch keine Buchungen.'
          : 'No bookings yet.',
    orderedAt: language === 'UA' ? 'Замовлено' : language === 'DE' ? 'Bestellt' : 'Ordered',
    createdAtLabel: language === 'UA' ? 'Створено' : language === 'DE' ? 'Erstellt' : 'Created',
    customerEmail: language === 'UA' ? 'Email клієнта' : language === 'DE' ? 'Kunden E-Mail' : 'Customer email',
    customerName: language === 'UA' ? "Ім'я клієнта" : language === 'DE' ? 'Kundenname' : 'Customer name',
    customerPhone: language === 'UA' ? 'Телефон клієнта' : language === 'DE' ? 'Kundentelefon' : 'Customer phone',
    phoneMissing: language === 'UA' ? 'Телефон не вказано' : language === 'DE' ? 'Telefon fehlt' : 'Phone missing',
    newItem: language === 'UA' ? 'Нове' : language === 'DE' ? 'Neu' : 'New',
    guestOrder: language === 'UA' ? 'Гість' : language === 'DE' ? 'Gast' : 'Guest',
  }

  const [activeTab, setActiveTab] = useState<TabKey>('categories')
  const [selectedCategoryEditorId, setSelectedCategoryEditorId] = useState<string | null>(
    serviceCategories[0]?.id ?? null
  )
  const [categoryDraft, setCategoryDraft] = useState<ServiceCategory>(
    serviceCategories[0] ? cloneCategory(serviceCategories[0]) : cloneCategory(BLANK_CATEGORY)
  )
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(masters[0]?.id ?? null)
  const [masterDraft, setMasterDraft] = useState<Master>(
    masters[0] ? cloneMaster(masters[0]) : cloneMaster(BLANK_MASTER)
  )
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(services[0]?.id ?? null)
  const [serviceDraft, setServiceDraft] = useState<ServiceItem>(
    services[0]
      ? cloneService(services[0])
      : { ...cloneService(BLANK_SERVICE), categoryId: serviceCategories[0]?.id ?? '' }
  )
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(bookingSlots[0]?.id ?? null)
  const [slotDraft, setSlotDraft] = useState<BookingSlot>(
    bookingSlots[0] ? cloneSlot(bookingSlots[0]) : cloneSlot(BLANK_SLOT)
  )
  const [selectedProductId, setSelectedProductId] = useState<string | null>(careProducts[0]?.id ?? null)
  const [productDraft, setProductDraft] = useState<CareProduct>(
    careProducts[0] ? cloneProduct(careProducts[0]) : cloneProduct(BLANK_PRODUCT)
  )
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(drinks[0]?.id ?? null)
  const [drinkDraft, setDrinkDraft] = useState<DrinkItem>(
    drinks[0] ? cloneDrink(drinks[0]) : cloneDrink(BLANK_DRINK)
  )
  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(trends[0]?.id ?? null)
  const [trendDraft, setTrendDraft] = useState<TrendItem>(
    trends[0] ? cloneTrend(trends[0]) : cloneTrend(BLANK_TREND)
  )
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(bookings[0]?.id ?? null)
  const [bookingDraft, setBookingDraft] = useState<BookingRecord>(
    bookings[0] ? cloneBooking(bookings[0]) : cloneBooking(BLANK_BOOKING)
  )
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState(false)
  const [seenBookingIds, setSeenBookingIds] = useState<string[]>([])
  const [seenCareOrderIds, setSeenCareOrderIds] = useState<string[]>([])

  useEffect(() => {
    setSeenBookingIds(readStoredIds(SEEN_BOOKINGS_STORAGE_KEY))
    setSeenCareOrderIds(readStoredIds(SEEN_CARE_ORDERS_STORAGE_KEY))
  }, [])

  useEffect(() => {
    if (!selectedCategoryEditorId) return
    const item = serviceCategories.find((entry) => entry.id === selectedCategoryEditorId)
    if (item) setCategoryDraft(cloneCategory(item))
  }, [selectedCategoryEditorId, serviceCategories])

  useEffect(() => {
    if (!selectedMasterId) return
    const item = masters.find((entry) => entry.id === selectedMasterId)
    if (item) setMasterDraft(cloneMaster(item))
  }, [selectedMasterId, masters])

  useEffect(() => {
    if (!selectedServiceId) return
    const item = services.find((entry) => entry.id === selectedServiceId)
    if (item) setServiceDraft(cloneService(item))
  }, [selectedServiceId, services])

  useEffect(() => {
    if (!selectedSlotId) return
    const item = bookingSlots.find((entry) => entry.id === selectedSlotId)
    if (item) setSlotDraft(cloneSlot(item))
  }, [selectedSlotId, bookingSlots])

  useEffect(() => {
    if (!selectedProductId) return
    const item = careProducts.find((entry) => entry.id === selectedProductId)
    if (item) setProductDraft(cloneProduct(item))
  }, [selectedProductId, careProducts])

  useEffect(() => {
    if (!selectedDrinkId) return
    const item = drinks.find((entry) => entry.id === selectedDrinkId)
    if (item) setDrinkDraft(cloneDrink(item))
  }, [selectedDrinkId, drinks])

  useEffect(() => {
    if (!selectedTrendId) return
    const item = trends.find((entry) => entry.id === selectedTrendId)
    if (item) setTrendDraft(cloneTrend(item))
  }, [selectedTrendId, trends])

  useEffect(() => {
    if (!selectedBookingId) return
    const item = bookings.find((entry) => entry.id === selectedBookingId)
    if (item) setBookingDraft(cloneBooking(item))
  }, [selectedBookingId, bookings])

  useEffect(() => {
    const validIds = new Set(bookings.map((item) => item.id))
    setSeenBookingIds((current) => current.filter((id) => validIds.has(id)))
  }, [bookings])

  useEffect(() => {
    const validIds = new Set(careOrderHistory.map((item) => item.id))
    setSeenCareOrderIds((current) => current.filter((id) => validIds.has(id)))
  }, [careOrderHistory])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SEEN_BOOKINGS_STORAGE_KEY, JSON.stringify(seenBookingIds))
  }, [seenBookingIds])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SEEN_CARE_ORDERS_STORAGE_KEY, JSON.stringify(seenCareOrderIds))
  }, [seenCareOrderIds])

  useEffect(() => {
    if (!serviceCategories.length || serviceDraft.categoryId) return
    setServiceDraft((current) => ({ ...current, categoryId: serviceCategories[0].id }))
  }, [serviceCategories, serviceDraft.categoryId])

  const servicesById = Object.fromEntries(services.map((item) => [item.id, item]))
  const categoriesById = Object.fromEntries(serviceCategories.map((item) => [item.id, item]))

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'categories', label: adminText.categories },
    { key: 'masters', label: t.admin.masters },
    { key: 'services', label: t.admin.services },
    { key: 'prices', label: t.admin.prices },
    { key: 'slots', label: t.admin.slots },
    { key: 'products', label: t.admin.products },
    { key: 'drinks', label: t.admin.drinks },
    { key: 'trends', label: t.admin.trends },
    { key: 'bookings', label: t.admin.bookings },
  ]

  const potentialRevenue = bookings.reduce((sum, booking) => {
    if (!booking.serviceId) return sum
    return sum + (servicesById[booking.serviceId]?.price ?? 0)
  }, 0)
  const tabCounts: Record<TabKey, number> = {
    categories: serviceCategories.length,
    masters: masters.length,
    services: services.length,
    prices: services.length,
    slots: bookingSlots.length,
    products: careProducts.length,
    drinks: drinks.length,
    trends: trends.length,
    bookings: bookings.length,
  }
  const activeTabLabel = tabs.find((tab) => tab.key === activeTab)?.label ?? t.admin.title
  const getBookingStatusLabel = (status: BookingRecord['status']) =>
    status === 'new'
      ? t.admin.statusNew
      : status === 'confirmed'
        ? t.admin.statusConfirmed
        : status === 'completed'
          ? t.admin.statusCompleted
          : t.admin.statusCancelled
  const formatOrderDate = (value: string) => {
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
  const isFreshTimestamp = (value: string) => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return false
    }

    return Date.now() - date.getTime() <= 1000 * 60 * 60 * 24
  }
  const markBookingSeen = (id: string | null) => {
    if (!id) {
      return
    }

    setSeenBookingIds((current) => (current.includes(id) ? current : [...current, id]))
  }
  const markCareOrderSeen = (id: string) => {
    setSeenCareOrderIds((current) => (current.includes(id) ? current : [...current, id]))
  }
  const isBookingNew = (booking: BookingRecord) =>
    Boolean(booking.id) && isFreshTimestamp(booking.createdAt) && !seenBookingIds.includes(booking.id)
  const isCareOrderNew = (order: CareOrderRecord) =>
    isFreshTimestamp(order.createdAt) && !seenCareOrderIds.includes(order.id)
  const getCareOrderCustomerName = (order: CareOrderRecord) => {
    const fullName = [order.firstName, order.lastName].filter(Boolean).join(' ').trim()
    return fullName || order.email || adminText.guestOrder
  }
  const getBookingServiceTitle = (booking: BookingRecord) => {
    if (!booking.serviceId || !servicesById[booking.serviceId]) {
      return t.admin.empty
    }

    return getLocalizedText(servicesById[booking.serviceId].title, language)
  }
  const sortedCareOrders = [...careOrderHistory].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  const careOrdersRevenue = sortedCareOrders.reduce((sum, order) => sum + order.total, 0)
  const sortedBookings = [...bookings].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  const sortedDrinkOrders = [...drinkOrderHistory].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  const recentBookingsCount = sortedBookings.filter((item) => isBookingNew(item)).length
  const recentCareOrdersCount = sortedCareOrders.filter((item) => isCareOrderNew(item)).length
  const selectedBookingIsNew = Boolean(bookingDraft.id) && isBookingNew(bookingDraft)

  if (userRole !== 'admin') {
    return (
      <LuxuryShell
        title={t.admin.accessDenied}
        subtitle={t.admin.accessHint}
        showBack
        maxWidth="max-w-xl"
        backgroundVariant="light"
      >
        <GlassCard className="relative overflow-hidden rounded-[34px] border-[rgba(201,168,76,0.2)] p-7 text-center">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-24 bg-[radial-gradient(circle,rgba(232,213,163,0.45)_0%,rgba(232,213,163,0)_72%)] blur-2xl" />
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[rgba(201,168,76,0.18)] bg-[linear-gradient(135deg,rgba(253,250,245,0.92)_0%,rgba(232,213,163,0.64)_100%)] text-2xl text-[#9d742f]">
            ◈
          </div>
          <p className="relative mt-5 text-sm leading-7 text-[rgba(61,42,26,0.72)]">{t.admin.accessHint}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <GoldButton onClick={() => router.push('/auth')}>{t.admin.goAuth}</GoldButton>
            <GoldButton variant="ghost" onClick={() => router.push('/menu')}>
              {t.admin.openMenu}
            </GoldButton>
          </div>
        </GlassCard>
      </LuxuryShell>
    )
  }

  const runMutation = async (action: () => Promise<void>) => {
    setMutationError(null)
    setIsMutating(true)

    try {
      await action()
    } catch (error) {
      console.error('Admin action failed:', error)
      setMutationError(getErrorMessage(error) || adminText.requestFailed)
    } finally {
      setIsMutating(false)
    }
  }

  const handleNewCategory = () => {
    setSelectedCategoryEditorId(null)
    setCategoryDraft(cloneCategory(BLANK_CATEGORY))
  }

  const handleSaveCategory = () => {
    void runMutation(async () => {
      const fallbackTitle =
        categoryDraft.title.GB || categoryDraft.title.UA || categoryDraft.title.DE || makeId('category')
      const nextSlug = slugify(categoryDraft.slug || fallbackTitle) || makeId('category')
      const next: ServiceCategory = {
        ...categoryDraft,
        id: categoryDraft.id || `cat-${nextSlug}`,
        slug: nextSlug,
        icon: categoryDraft.icon.trim() || '*',
      }

      const saved = await saveCategory(next)
      setSelectedCategoryEditorId(saved.id)
      setCategoryDraft(cloneCategory(saved))
    })
  }

  const handleNewMaster = () => {
    setSelectedMasterId(null)
    setMasterDraft(cloneMaster(BLANK_MASTER))
  }

  const handleSaveMaster = () => {
    void runMutation(async () => {
      const next: Master = {
        ...masterDraft,
        id: masterDraft.id || makeId('master'),
        specialtyCategoryIds:
          masterDraft.specialtyCategoryIds.length > 0
            ? masterDraft.specialtyCategoryIds
            : ([serviceCategories[0]?.id].filter(Boolean) as string[]),
      }
      const saved = await saveMaster(next)
      setSelectedMasterId(saved.id)
      setMasterDraft(cloneMaster(saved))
    })
  }

  const handleMasterCredentialChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''

    if (!files.length) {
      return
    }

    setMutationError(null)

    void Promise.all(files.map((file) => readFileAsDataUrl(file)))
      .then((fileUrls) => {
        const nextCredentials: MasterCredential[] = files.map((file, index) => ({
          id: makeId('credential'),
          name: file.name,
          type: file.type || 'application/octet-stream',
          fileUrl: fileUrls[index],
        }))

        setMasterDraft((current) => ({
          ...current,
          credentials: [...(current.credentials ?? []), ...nextCredentials],
        }))
      })
      .catch((error) => {
        console.error('Master documents load failed:', error)
        setMutationError(getErrorMessage(error) || adminText.requestFailed)
      })
  }

  const handleNewService = () => {
    setSelectedServiceId(null)
    setServiceDraft({
      ...cloneService(BLANK_SERVICE),
      categoryId: serviceCategories[0]?.id ?? '',
    })
  }

  const handleSaveService = () => {
    void runMutation(async () => {
      const next: ServiceItem = {
        ...serviceDraft,
        id: serviceDraft.id || makeId('service'),
        durationMinutes: Number(serviceDraft.durationMinutes) || 0,
        price: Number(serviceDraft.price) || 0,
      }
      const saved = await saveService(next)
      setSelectedServiceId(saved.id)
      setServiceDraft(cloneService(saved))
    })
  }

  const handleNewSlot = () => {
    setSelectedSlotId(null)
    setSlotDraft(cloneSlot(BLANK_SLOT))
  }

  const handleSaveSlot = () => {
    void runMutation(async () => {
      const next: BookingSlot = {
        ...slotDraft,
        id: slotDraft.id || makeId('slot'),
      }
      const saved = await saveBookingSlot(next)
      setSelectedSlotId(saved.id)
      setSlotDraft(cloneSlot(saved))
    })
  }

  const handleNewProduct = () => {
    setSelectedProductId(null)
    setProductDraft(cloneProduct(BLANK_PRODUCT))
  }

  const handleSaveProduct = () => {
    void runMutation(async () => {
      const next: CareProduct = {
        ...productDraft,
        id: productDraft.id || makeId('product'),
        price: Number(productDraft.price) || 0,
      }
      const saved = await saveCareProduct(next)
      setSelectedProductId(saved.id)
      setProductDraft(cloneProduct(saved))
    })
  }

  const handleNewDrink = () => {
    setSelectedDrinkId(null)
    setDrinkDraft(cloneDrink(BLANK_DRINK))
  }

  const handleSaveDrink = () => {
    void runMutation(async () => {
      const next: DrinkItem = {
        ...drinkDraft,
        id: drinkDraft.id || makeId('drink'),
      }
      const saved = await saveDrink(next)
      setSelectedDrinkId(saved.id)
      setDrinkDraft(cloneDrink(saved))
    })
  }

  const handleNewTrend = () => {
    setSelectedTrendId(null)
    setTrendDraft(cloneTrend(BLANK_TREND))
  }

  const handleSaveTrend = () => {
    void runMutation(async () => {
      const next: TrendItem = {
        ...trendDraft,
        id: trendDraft.id || makeId('trend'),
      }
      const saved = await saveTrend(next)
      setSelectedTrendId(saved.id)
      setTrendDraft(cloneTrend(saved))
    })
  }

  const handleTrendImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setMutationError(null)

    void readFileAsDataUrl(file)
      .then((image) => {
        setTrendDraft((current) => ({
          ...current,
          image,
        }))
      })
      .catch((error) => {
        console.error('Trend image load failed:', error)
        setMutationError(getErrorMessage(error) || adminText.requestFailed)
      })
  }

  const handleNewBooking = () => {
    setSelectedBookingId(null)
    setBookingDraft({
      ...cloneBooking(BLANK_BOOKING),
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
    })
  }

  const handleSelectBooking = (id: string) => {
    markBookingSeen(id)
    setSelectedBookingId(id)
  }

  const runBookingAction = (status: BookingRecord['status']) => {
    void runMutation(async () => {
      const next: BookingRecord = {
        ...bookingDraft,
        id: bookingDraft.id || makeId('booking'),
        createdAt: bookingDraft.createdAt || new Date().toISOString(),
        status,
        customer: {
          firstName: bookingDraft.customer.firstName,
          lastName: bookingDraft.customer.lastName,
          phone: bookingDraft.customer.phone,
          email: bookingDraft.customer.email,
        },
      }
      const saved = await saveBooking(next)
      markBookingSeen(saved.id)
      setSelectedBookingId(saved.id)
      setBookingDraft(cloneBooking(saved))
    })
  }

  const renderCategories = () => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind="categories"
            title={adminText.categories}
            badge={String(serviceCategories.length).padStart(2, '0')}
            action={
              <GoldButton variant="ghost" onClick={handleNewCategory} disabled={isMutating}>
                {t.admin.addNew}
              </GoldButton>
            }
          />
          <div className="space-y-3">
            {serviceCategories.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedCategoryEditorId === item.id}
                title={`${item.icon} ${getLocalizedText(item.title, language)}`}
                subtitle={item.slug}
                meta={item.id}
                onClick={() => setSelectedCategoryEditorId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">
            {categoryDraft.id
              ? getLocalizedText(categoryDraft.title, language) || adminText.categories
              : t.admin.addNew}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              label={adminText.slug}
              value={categoryDraft.slug}
              onChange={(event) =>
                setCategoryDraft((current) => ({ ...current, slug: event.target.value }))
              }
            />
            <GoldInput
              variant="light"
              label={t.admin.icon}
              value={categoryDraft.icon}
              onChange={(event) =>
                setCategoryDraft((current) => ({ ...current, icon: event.target.value }))
              }
            />
          </div>
          <LocalizedFields
            labels={{ ua: t.admin.titleUa, de: t.admin.titleDe, gb: t.admin.titleGb }}
            value={categoryDraft.title}
            onChange={(value) => setCategoryDraft((current) => ({ ...current, title: value }))}
          />
          <LuxuryTextarea
            variant="light"
            label={t.admin.descriptionUa}
            value={categoryDraft.description.UA}
            onChange={(event) =>
              setCategoryDraft((current) => ({
                ...current,
                description: { ...current.description, UA: event.target.value },
              }))
            }
          />
          <LuxuryTextarea
            variant="light"
            label={t.admin.descriptionDe}
            value={categoryDraft.description.DE}
            onChange={(event) =>
              setCategoryDraft((current) => ({
                ...current,
                description: { ...current.description, DE: event.target.value },
              }))
            }
          />
          <LuxuryTextarea
            variant="light"
            label={t.admin.descriptionGb}
            value={categoryDraft.description.GB}
            onChange={(event) =>
              setCategoryDraft((current) => ({
                ...current,
                description: { ...current.description, GB: event.target.value },
              }))
            }
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveCategory} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {categoryDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteCategory(categoryDraft.id)
                    handleNewCategory()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      }
    />
  )

  const renderMasters = () => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind="masters"
            title={t.admin.masters}
            badge={String(masters.length).padStart(2, '0')}
            action={
              <GoldButton variant="ghost" onClick={handleNewMaster}>
                {t.admin.addNew}
              </GoldButton>
            }
          />
          <div className="space-y-3">
            {masters.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedMasterId === item.id}
                title={item.name}
                subtitle={getLocalizedText(item.role, language)}
                meta={item.experienceLabel}
                onClick={() => setSelectedMasterId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">
            {masterDraft.id ? masterDraft.name || t.admin.name : t.admin.addNew}
          </h3>
          <GoldInput
            variant="light"
            label={t.admin.name}
            value={masterDraft.name}
            onChange={(event) => setMasterDraft((current) => ({ ...current, name: event.target.value }))}
          />
          <LocalizedFields
            labels={{
              ua: `${t.admin.role} UA`,
              de: `${t.admin.role} DE`,
              gb: `${t.admin.role} EN`,
            }}
            value={masterDraft.role}
            onChange={(value) => setMasterDraft((current) => ({ ...current, role: value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              label={t.admin.initials}
              value={masterDraft.initials}
              onChange={(event) =>
                setMasterDraft((current) => ({ ...current, initials: event.target.value.toUpperCase().slice(0, 3) }))
              }
            />
            <GoldInput
              variant="light"
              label={t.admin.experience}
              value={masterDraft.experienceLabel}
              onChange={(event) =>
                setMasterDraft((current) => ({ ...current, experienceLabel: event.target.value }))
              }
            />
          </div>
          <CategoryChips
            categories={serviceCategories}
            selectedIds={masterDraft.specialtyCategoryIds}
            onToggle={(id) =>
              setMasterDraft((current) => ({
                ...current,
                specialtyCategoryIds: current.specialtyCategoryIds.includes(id)
                  ? current.specialtyCategoryIds.filter((entry) => entry !== id)
                  : [...current.specialtyCategoryIds, id],
                }))
            }
          />
          <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.46)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#3d2a1a]">{adminText.credentials}</p>
              <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.52)] px-3 py-1 text-[11px] tracking-[0.24em] text-[#8d6a31]">
                {String(masterDraft.credentials?.length ?? 0).padStart(2, '0')}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center justify-center rounded-[20px] border border-dashed border-[rgba(201,168,76,0.28)] bg-[rgba(255,255,255,0.52)] px-4 py-4 text-sm text-[#6c5138] transition-colors hover:border-[rgba(201,168,76,0.42)]">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  onChange={handleMasterCredentialChange}
                />
                {adminText.uploadCredentials}
              </label>
              {masterDraft.credentials?.length ? (
                <div className="space-y-2">
                  {masterDraft.credentials.map((credential) => (
                    <div
                      key={credential.id}
                      className="flex flex-col gap-3 rounded-[20px] border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.56)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#3d2a1a]">{credential.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                          {credential.type.includes('pdf') ? 'PDF' : 'IMAGE'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <GoldButton
                          variant="ghost"
                          className="w-full sm:w-auto"
                          onClick={() => window.open(credential.fileUrl, '_blank', 'noopener,noreferrer')}
                        >
                          {adminText.openDocument}
                        </GoldButton>
                        <GoldButton
                          variant="ghost"
                          className="w-full sm:w-auto"
                          onClick={() =>
                            setMasterDraft((current) => ({
                              ...current,
                              credentials: (current.credentials ?? []).filter((entry) => entry.id !== credential.id),
                            }))
                          }
                        >
                          {adminText.removeDocument}
                        </GoldButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[rgba(90,67,48,0.62)]">{adminText.noCredentials}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveMaster} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {masterDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteMaster(masterDraft.id)
                    handleNewMaster()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      }
    />
  )

  const renderServices = (priceMode: boolean) => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind={priceMode ? 'prices' : 'services'}
            title={priceMode ? t.admin.prices : t.admin.services}
            badge={String(services.length).padStart(2, '0')}
            action={
              !priceMode ? (
                <GoldButton variant="ghost" onClick={handleNewService}>
                  {t.admin.addNew}
                </GoldButton>
              ) : undefined
            }
          />
          <div className="space-y-3">
            {services.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedServiceId === item.id}
                title={getLocalizedText(item.title, language)}
                subtitle={categoriesById[item.categoryId]?.title[language] ?? t.admin.category}
                meta={`€${item.price}`}
                onClick={() => setSelectedServiceId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">
            {serviceDraft.id
              ? getLocalizedText(serviceDraft.title, language) || t.admin.services
              : t.admin.addNew}
          </h3>
          <LuxurySelect
            variant="light"
            label={t.admin.category}
            value={serviceDraft.categoryId}
            onChange={(event) => setServiceDraft((current) => ({ ...current, categoryId: event.target.value }))}
          >
            {serviceCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title[language]}
              </option>
            ))}
          </LuxurySelect>
          {!priceMode && (
            <LocalizedFields
              labels={{ ua: t.admin.titleUa, de: t.admin.titleDe, gb: t.admin.titleGb }}
              value={serviceDraft.title}
              onChange={(value) => setServiceDraft((current) => ({ ...current, title: value }))}
            />
          )}
          {priceMode && (
            <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.46)] px-4 py-4 text-sm text-[rgba(61,42,26,0.72)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              {getLocalizedText(serviceDraft.title, language)}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              type="number"
              label={t.admin.duration}
              value={String(serviceDraft.durationMinutes)}
              onChange={(event) =>
                setServiceDraft((current) => ({
                  ...current,
                  durationMinutes: Number(event.target.value),
                }))
              }
            />
            <GoldInput
              variant="light"
              type="number"
              label={t.admin.price}
              value={String(serviceDraft.price)}
              onChange={(event) =>
                setServiceDraft((current) => ({ ...current, price: Number(event.target.value) }))
              }
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveService} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {!priceMode && serviceDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteService(serviceDraft.id)
                    handleNewService()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      }
    />
  )

  const renderSlots = () => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind="slots"
            title={t.admin.slots}
            badge={String(bookingSlots.length).padStart(2, '0')}
            action={
              <GoldButton variant="ghost" onClick={handleNewSlot}>
                {t.admin.addNew}
              </GoldButton>
            }
          />
          <div className="space-y-3">
            {bookingSlots.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedSlotId === item.id}
                title={item.time}
                subtitle={t.booking[item.period]}
                onClick={() => setSelectedSlotId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">{t.admin.slots}</h3>
          <LuxurySelect
            variant="light"
            label={t.admin.period}
            value={slotDraft.period}
            onChange={(event) =>
              setSlotDraft((current) => ({ ...current, period: event.target.value as BookingPeriod }))
            }
          >
            <option value="morning">{t.booking.morning}</option>
            <option value="afternoon">{t.booking.afternoon}</option>
            <option value="evening">{t.booking.evening}</option>
          </LuxurySelect>
          <GoldInput
            variant="light"
            type="time"
            label={t.admin.time}
            value={slotDraft.time}
            onChange={(event) => setSlotDraft((current) => ({ ...current, time: event.target.value }))}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveSlot} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {slotDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteBookingSlot(slotDraft.id)
                    handleNewSlot()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      }
    />
  )

  const renderProducts = () => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind="products"
            title={t.admin.products}
            badge={String(careProducts.length).padStart(2, '0')}
            action={
              <GoldButton variant="ghost" onClick={handleNewProduct}>
                {t.admin.addNew}
              </GoldButton>
            }
          />
          <div className="space-y-3">
            {careProducts.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedProductId === item.id}
                title={`${item.icon} ${getLocalizedText(item.title, language)}`}
                subtitle={item.brand}
                meta={`€${item.price}`}
                onClick={() => setSelectedProductId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">{t.admin.products}</h3>
          <LocalizedFields
            labels={{ ua: t.admin.titleUa, de: t.admin.titleDe, gb: t.admin.titleGb }}
            value={productDraft.title}
            onChange={(value) => setProductDraft((current) => ({ ...current, title: value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              label={t.admin.brand}
              value={productDraft.brand}
              onChange={(event) => setProductDraft((current) => ({ ...current, brand: event.target.value }))}
            />
            <GoldInput
              variant="light"
              label={t.admin.icon}
              value={productDraft.icon}
              onChange={(event) => setProductDraft((current) => ({ ...current, icon: event.target.value }))}
            />
          </div>
          <GoldInput
            variant="light"
            type="number"
            label={t.admin.price}
            value={String(productDraft.price)}
            onChange={(event) => setProductDraft((current) => ({ ...current, price: Number(event.target.value) }))}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveProduct} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {productDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteCareProduct(productDraft.id)
                    handleNewProduct()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      }
    />
  )

  const renderDrinks = () => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind="drinks"
            title={t.admin.drinks}
            badge={String(drinks.length).padStart(2, '0')}
            action={
              <GoldButton variant="ghost" onClick={handleNewDrink}>
                {t.admin.addNew}
              </GoldButton>
            }
          />
          <div className="space-y-3">
            {drinks.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedDrinkId === item.id}
                title={`${item.icon} ${getLocalizedText(item.title, language)}`}
                subtitle={item.id}
                onClick={() => setSelectedDrinkId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">{t.admin.drinks}</h3>
          <LocalizedFields
            labels={{ ua: t.admin.titleUa, de: t.admin.titleDe, gb: t.admin.titleGb }}
            value={drinkDraft.title}
            onChange={(value) => setDrinkDraft((current) => ({ ...current, title: value }))}
          />
          <GoldInput
            variant="light"
            label={t.admin.icon}
            value={drinkDraft.icon}
            onChange={(event) => setDrinkDraft((current) => ({ ...current, icon: event.target.value }))}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveDrink} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {drinkDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteDrink(drinkDraft.id)
                    handleNewDrink()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
          <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.46)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#3d2a1a]">{adminText.drinkOrders}</p>
              <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.52)] px-3 py-1 text-[11px] tracking-[0.24em] text-[#8d6a31]">
                {String(sortedDrinkOrders.length).padStart(2, '0')}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {sortedDrinkOrders.length ? (
                sortedDrinkOrders.map((order) => {
                  const drink = drinks.find((item) => item.id === order.drinkId)

                  return (
                    <div
                      key={order.id}
                      className="rounded-[20px] border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.56)] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#3d2a1a]">
                            {drink ? getLocalizedText(drink.title, language) : order.drinkId}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                            {order.email || adminText.guestOrder}
                          </p>
                        </div>
                        <span className="text-2xl">{drink?.icon || '☕'}</span>
                      </div>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                        {adminText.orderedAt}: {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-[rgba(90,67,48,0.62)]">{adminText.noDrinkOrders}</p>
              )}
            </div>
          </div>
        </div>
      }
    />
  )

  const renderTrends = () => (
    <Workspace
      list={
        <div className="space-y-4">
          <SectionHeading
            kind="trends"
            title={t.admin.trends}
            badge={String(trends.length).padStart(2, '0')}
            action={
              <GoldButton variant="ghost" onClick={handleNewTrend}>
                {t.admin.addNew}
              </GoldButton>
            }
          />
          <div className="space-y-3">
            {trends.map((item) => (
              <ItemButton
                key={item.id}
                active={selectedTrendId === item.id}
                title={`${item.emoji} ${getLocalizedText(item.title, language)}`}
                subtitle={getLocalizedText(item.description, language)}
                onClick={() => setSelectedTrendId(item.id)}
              />
            ))}
          </div>
        </div>
      }
      editor={
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-[#3d2a1a]">{t.admin.trends}</h3>
          <LocalizedFields
            labels={{ ua: t.admin.titleUa, de: t.admin.titleDe, gb: t.admin.titleGb }}
            value={trendDraft.title}
            onChange={(value) => setTrendDraft((current) => ({ ...current, title: value }))}
          />
          <LuxuryTextarea
            variant="light"
            label={t.admin.descriptionUa}
            value={trendDraft.description.UA}
            onChange={(event) =>
              setTrendDraft((current) => ({
                ...current,
                description: { ...current.description, UA: event.target.value },
              }))
            }
          />
          <LuxuryTextarea
            variant="light"
            label={t.admin.descriptionDe}
            value={trendDraft.description.DE}
            onChange={(event) =>
              setTrendDraft((current) => ({
                ...current,
                description: { ...current.description, DE: event.target.value },
              }))
            }
          />
          <LuxuryTextarea
            variant="light"
            label={t.admin.descriptionGb}
            value={trendDraft.description.GB}
            onChange={(event) =>
              setTrendDraft((current) => ({
                ...current,
                description: { ...current.description, GB: event.target.value },
              }))
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              label="Gradient"
              value={trendDraft.gradient}
              onChange={(event) => setTrendDraft((current) => ({ ...current, gradient: event.target.value }))}
            />
            <GoldInput
              variant="light"
              label={t.admin.icon}
              value={trendDraft.emoji}
              onChange={(event) => setTrendDraft((current) => ({ ...current, emoji: event.target.value }))}
            />
          </div>
          <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.46)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer items-center justify-center rounded-[20px] border border-dashed border-[rgba(201,168,76,0.28)] bg-[rgba(255,255,255,0.52)] px-4 py-5 text-sm text-[#6c5138] transition-colors hover:border-[rgba(201,168,76,0.42)]">
                <input type="file" accept="image/*" className="hidden" onChange={handleTrendImageChange} />
                {adminText.uploadImage}
              </label>
              {trendDraft.image && (
                <div className="space-y-3">
                  <div
                    className="h-52 rounded-[22px] border border-[rgba(201,168,76,0.18)] bg-cover bg-center"
                    style={{ backgroundImage: `url(${trendDraft.image})` }}
                  />
                  <GoldButton
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => setTrendDraft((current) => ({ ...current, image: '' }))}
                  >
                    {adminText.removeImage}
                  </GoldButton>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <GoldButton onClick={handleSaveTrend} disabled={isMutating}>
              {isMutating ? adminText.saving : t.admin.save}
            </GoldButton>
            {trendDraft.id && (
              <GoldButton
                variant="ghost"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteTrend(trendDraft.id)
                    handleNewTrend()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      }
    />
  )

  const renderBookings = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,0.98fr)_minmax(0,1.12fr)]">
      <GlassCard hoverable className="rounded-[34px] border-[rgba(201,168,76,0.2)] p-4 sm:p-5">
        <div className="space-y-4">
          <SectionHeading
            kind="bookings"
            title={t.admin.bookings}
            badge={String(bookings.length).padStart(2, '0')}
            action={
              <div className="flex flex-wrap items-center justify-end gap-2">
                {recentBookingsCount > 0 && (
                  <span className="rounded-full border border-[rgba(143,82,103,0.18)] bg-[rgba(255,241,245,0.82)] px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-[#7a4055]">
                    {adminText.newItem} {recentBookingsCount}
                  </span>
                )}
                <GoldButton variant="ghost" onClick={handleNewBooking}>
                  {t.admin.addNew}
                </GoldButton>
              </div>
            }
          />
          <div className="max-h-[44rem] space-y-3 overflow-y-auto pr-1">
            {sortedBookings.length ? (
              sortedBookings.map((item) => {
                const isNew = isBookingNew(item)
                const isActive = selectedBookingId === item.id

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleSelectBooking(item.id)}
                    transition={{ type: 'spring', stiffness: 380, damping: 24, mass: 0.52 }}
                    whileHover={{ y: -2, scale: 1.006 }}
                    whileTap={{ scale: 0.985, y: 1 }}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-[rgba(201,168,76,0.34)] bg-[linear-gradient(135deg,rgba(248,240,226,0.96)_0%,rgba(238,225,198,0.78)_100%)] shadow-[0_10px_24px_rgba(160,120,48,0.10)]'
                      : isNew
                          ? 'border-[rgba(143,82,103,0.18)] bg-[linear-gradient(135deg,rgba(255,248,250,0.98)_0%,rgba(248,236,241,0.82)_100%)] shadow-[0_10px_28px_rgba(122,64,85,0.08)]'
                          : 'border-[rgba(201,168,76,0.15)] bg-[rgba(255,255,255,0.46)] hover:border-[rgba(201,168,76,0.24)] hover:bg-[rgba(255,255,255,0.68)]'
                    } touch-manipulation`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-[#3d2a1a]">
                            {item.customer.firstName} {item.customer.lastName}
                          </p>
                          {isNew && (
                            <span className="rounded-full border border-[rgba(143,82,103,0.18)] bg-[rgba(255,241,245,0.82)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7a4055]">
                              {adminText.newItem}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                          {getBookingServiceTitle(item)}
                        </p>
                      </div>
                      <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.45)] px-2.5 py-1 text-[11px] text-[#8d6a31]">
                        {getBookingStatusLabel(item.status)}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-[rgba(90,67,48,0.72)] sm:grid-cols-2">
                      <div className="rounded-[18px] border border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
                        {item.date} • {item.time}
                      </div>
                      <div className="rounded-[18px] border border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
                        {item.customer.phone}
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                      {adminText.createdAtLabel}: {formatOrderDate(item.createdAt)}
                    </p>
                  </motion.button>
                )
              })
            ) : (
              <p className="text-sm text-[rgba(90,67,48,0.62)]">{adminText.noBookings}</p>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard hoverable className="rounded-[34px] border-[rgba(201,168,76,0.2)] p-4 sm:p-5">
        <div className="space-y-4">
          <SectionHeading
            kind="products"
            title={adminText.careOrders}
            badge={String(sortedCareOrders.length).padStart(2, '0')}
            action={
              <div className="flex flex-wrap items-center justify-end gap-2">
                {recentCareOrdersCount > 0 && (
                  <span className="rounded-full border border-[rgba(143,82,103,0.18)] bg-[rgba(255,241,245,0.82)] px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-[#7a4055]">
                    {adminText.newItem} {recentCareOrdersCount}
                  </span>
                )}
                <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.52)] px-3 py-1 text-[11px] tracking-[0.22em] text-[#8d6a31]">
                  €{careOrdersRevenue.toFixed(2)}
                </span>
              </div>
            }
          />
          <div className="max-h-[44rem] space-y-3 overflow-y-auto pr-1">
            {sortedCareOrders.length ? (
              sortedCareOrders.map((order) => {
                const isNew = isCareOrderNew(order)

                return (
                  <motion.button
                    key={order.id}
                    onClick={() => markCareOrderSeen(order.id)}
                    transition={{ type: 'spring', stiffness: 380, damping: 24, mass: 0.52 }}
                    whileHover={{ y: -2, scale: 1.004 }}
                    whileTap={{ scale: 0.986, y: 1 }}
                    className={`rounded-[24px] border px-4 py-4 ${
                      isNew
                        ? 'border-[rgba(143,82,103,0.18)] bg-[linear-gradient(135deg,rgba(255,248,250,0.98)_0%,rgba(248,236,241,0.82)_100%)] shadow-[0_10px_28px_rgba(122,64,85,0.08)]'
                        : 'border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.56)]'
                    } w-full touch-manipulation text-left`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-[#3d2a1a]">{getCareOrderCustomerName(order)}</p>
                          {isNew && (
                            <span className="rounded-full border border-[rgba(143,82,103,0.18)] bg-[rgba(255,241,245,0.82)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7a4055]">
                              {adminText.newItem}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                          {adminText.customerName}
                        </p>
                      </div>
                      <span className="font-serif text-2xl font-semibold text-[#6b2339]">€{order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-[rgba(90,67,48,0.72)] sm:grid-cols-2">
                      <div className="rounded-[18px] border border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
                        <p className="uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">{adminText.customerPhone}</p>
                        <p className="mt-1 text-sm text-[#3d2a1a]">{order.phone || adminText.phoneMissing}</p>
                      </div>
                      <div className="rounded-[18px] border border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.42)] px-3 py-2">
                        <p className="uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">{adminText.customerEmail}</p>
                        <p className="mt-1 text-sm break-all text-[#3d2a1a]">{order.email || adminText.guestOrder}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.id}`}
                          className="flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.36)] px-3 py-2 text-sm text-[#6b5a66]"
                        >
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(122,92,68,0.56)]">
                      {adminText.orderedAt}: {formatOrderDate(order.createdAt)}
                    </p>
                  </motion.button>
                )
              })
            ) : (
              <p className="text-sm text-[rgba(90,67,48,0.62)]">{adminText.noCareOrders}</p>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard hoverable className="rounded-[34px] border-[rgba(201,168,76,0.2)] p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-2xl text-[#3d2a1a]">{t.admin.bookings}</h3>
            {selectedBookingIsNew && (
              <span className="rounded-full border border-[rgba(143,82,103,0.18)] bg-[rgba(255,241,245,0.82)] px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-[#7a4055]">
                {adminText.newItem}
              </span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              label={t.booking.firstName}
              value={bookingDraft.customer.firstName}
              onChange={(event) =>
                setBookingDraft((current) => ({
                  ...current,
                  customer: { ...current.customer, firstName: event.target.value },
                }))
              }
            />
            <GoldInput
              variant="light"
              label={t.booking.lastName}
              value={bookingDraft.customer.lastName}
              onChange={(event) =>
                setBookingDraft((current) => ({
                  ...current,
                  customer: { ...current.customer, lastName: event.target.value },
                }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              label={t.admin.phone}
              value={bookingDraft.customer.phone}
              onChange={(event) =>
                setBookingDraft((current) => ({
                  ...current,
                  customer: { ...current.customer, phone: event.target.value },
                }))
              }
            />
            <GoldInput
              variant="light"
              type="email"
              label={t.admin.email}
              value={bookingDraft.customer.email}
              onChange={(event) =>
                setBookingDraft((current) => ({
                  ...current,
                  customer: { ...current.customer, email: event.target.value },
                }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LuxurySelect
              variant="light"
              label={t.admin.category}
              value={bookingDraft.categoryId ?? ''}
              onChange={(event) =>
                setBookingDraft((current) => ({
                  ...current,
                  categoryId: event.target.value || null,
                  serviceId: null,
                }))
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
                setBookingDraft((current) => ({
                  ...current,
                  serviceId: event.target.value || null,
                }))
              }
            >
              <option value="">{t.admin.empty}</option>
              {services
                .filter((item) => !bookingDraft.categoryId || item.categoryId === bookingDraft.categoryId)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {getLocalizedText(item.title, language)}
                  </option>
                ))}
            </LuxurySelect>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LuxurySelect
              variant="light"
              label={t.booking.master}
              value={bookingDraft.masterId ?? ''}
              onChange={(event) =>
                setBookingDraft((current) => ({
                  ...current,
                  masterId: event.target.value || null,
                }))
              }
            >
              <option value="">{t.admin.empty}</option>
              {masters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </LuxurySelect>
            <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.46)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <p className="text-xs font-medium tracking-wide text-[#8d6a31]">{adminText.currentStatus}</p>
              <p className="mt-3 text-sm font-medium text-[#3d2a1a]">{getBookingStatusLabel(bookingDraft.status)}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <GoldInput
              variant="light"
              type="date"
              label={t.booking.dateLabel}
              value={bookingDraft.date}
              onChange={(event) => setBookingDraft((current) => ({ ...current, date: event.target.value }))}
            />
            <GoldInput
              variant="light"
              type="time"
              label={t.admin.time}
              value={bookingDraft.time}
              onChange={(event) => setBookingDraft((current) => ({ ...current, time: event.target.value }))}
            />
          </div>
          <LuxuryTextarea
            variant="light"
            label={t.admin.note}
            value={bookingDraft.note}
            onChange={(event) => setBookingDraft((current) => ({ ...current, note: event.target.value }))}
          />
          <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.46)] px-4 py-3 text-xs text-[rgba(61,42,26,0.62)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            {bookingDraft.serviceId && servicesById[bookingDraft.serviceId]
              ? `${t.admin.price}: €${servicesById[bookingDraft.serviceId].price}`
              : t.admin.createPrompt}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <GoldButton
              fullWidth
              className={!bookingDraft.id ? 'sm:col-span-2' : ''}
              onClick={() => runBookingAction('confirmed')}
              disabled={isMutating}
            >
              {isMutating ? adminText.saving : adminText.confirmBooking}
            </GoldButton>
            {bookingDraft.id && (
              <GoldButton fullWidth variant="ghost" disabled={isMutating} onClick={() => runBookingAction('cancelled')}>
                {adminText.cancelBooking}
              </GoldButton>
            )}
            {bookingDraft.id && (
              <GoldButton
                fullWidth
                variant="ghost"
                className="sm:col-span-2"
                disabled={isMutating}
                onClick={() => {
                  void runMutation(async () => {
                    await deleteBooking(bookingDraft.id)
                    handleNewBooking()
                  })
                }}
              >
                {t.admin.delete}
              </GoldButton>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )

  return (
    <LuxuryShell
      title={t.admin.title}
      subtitle={t.admin.subtitle}
      showBack
      maxWidth="max-w-7xl"
      backgroundVariant="light"
      contentAlign="start"
    >
      <div className="relative space-y-6">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-12 -z-10 flex justify-center"
          animate={{ opacity: [0.4, 0.65, 0.45], scale: [0.96, 1.02, 0.98] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-44 w-[min(56rem,92vw)] rounded-full bg-[radial-gradient(circle,rgba(232,213,163,0.34)_0%,rgba(232,213,163,0)_72%)] blur-3xl" />
        </motion.div>

        <GlassCard className="relative overflow-hidden rounded-[38px] border-[rgba(201,168,76,0.22)] p-6 sm:p-8">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-[-40px] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.34)_0%,rgba(201,168,76,0)_72%)] blur-3xl"
            animate={{ y: [-6, 10, -4], opacity: [0.45, 0.62, 0.42] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-8 bottom-[-52px] h-28 w-72 rounded-full bg-[linear-gradient(90deg,rgba(232,213,163,0.18)_0%,rgba(255,255,255,0.36)_48%,rgba(201,168,76,0.14)_100%)] blur-3xl"
            animate={{ x: [-12, 18, -10], opacity: [0.25, 0.5, 0.28] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#9d742f]">TINTEL CONTROL SUITE</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-[#3d2a1a] sm:text-[3.1rem]">
                {t.admin.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(61,42,26,0.72)] sm:text-base">
                {t.admin.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.52)] px-4 py-2 text-sm text-[#6c5138]">
                  {activeTabLabel}
                </span>
                <span className="rounded-full border border-[rgba(201,168,76,0.18)] bg-[linear-gradient(135deg,rgba(248,240,226,0.9)_0%,rgba(232,213,163,0.62)_100%)] px-4 py-2 text-sm text-[#8d6a31]">
                  {String(tabCounts[activeTab]).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.52)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(122,92,68,0.56)]">{t.admin.totalRevenue}</p>
                <p className="mt-3 font-serif text-3xl text-[#3d2a1a]">EUR {potentialRevenue}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.52)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(122,92,68,0.56)]">{t.admin.totalBookings}</p>
                <p className="mt-3 font-serif text-3xl text-[#3d2a1a]">{bookings.length}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.52)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(122,92,68,0.56)]">{t.admin.totalServices}</p>
                <p className="mt-3 font-serif text-3xl text-[#3d2a1a]">{services.length}</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.52)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(122,92,68,0.56)]">{t.admin.totalMasters}</p>
                <p className="mt-3 font-serif text-3xl text-[#3d2a1a]">{masters.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard kind="masters" label={t.admin.totalMasters} value={String(masters.length)} />
          <StatCard kind="services" label={t.admin.totalServices} value={String(services.length)} />
          <StatCard kind="bookings" label={t.admin.totalBookings} value={String(bookings.length)} />
          <StatCard kind="products" label={adminText.careOrders} value={String(sortedCareOrders.length)} />
          <StatCard label={t.admin.totalRevenue} value={`€${potentialRevenue}`} />
        </div>

        <GlassCard className="rounded-[34px] border-[rgba(201,168,76,0.2)] p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                label={tab.label}
                kind={tab.key}
                count={tabCounts[tab.key]}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </GlassCard>

        {mutationError && (
          <div className="rounded-[24px] border border-[rgba(122,64,85,0.18)] bg-[rgba(255,241,245,0.78)] px-4 py-3 text-sm text-[#7a4055] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            {mutationError}
          </div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'masters' && renderMasters()}
          {activeTab === 'services' && renderServices(false)}
          {activeTab === 'prices' && renderServices(true)}
          {activeTab === 'slots' && renderSlots()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'drinks' && renderDrinks()}
          {activeTab === 'trends' && renderTrends()}
          {activeTab === 'bookings' && renderBookings()}
        </motion.div>
      </div>
    </LuxuryShell>
  )
}
