import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Language } from '@/dictionaries'
import {
  ADMIN_ACCOUNT,
  BOOKING_SLOTS,
  CARE_PRODUCTS,
  DRINKS,
  INITIAL_BOOKINGS,
  MASTERS,
  SERVICE_CATEGORIES,
  SERVICES,
  TRENDS,
  type AuthAccount,
  type BookingRecord,
  type BookingSlot,
  type CareProduct,
  type DrinkItem,
  type Master,
  type ServiceCategory,
  type ServiceItem,
  type TrendItem,
} from '@/data/salon'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface UserProfile {
  firstName: string
  lastName: string
  phone: string
  email: string
  role?: 'client' | 'admin'
}

interface RegisterPayload extends UserProfile {
  password: string
}

interface LoginPayload {
  email: string
  password: string
}

interface BookingPayload {
  customer: UserProfile
  categoryId: string | null
  serviceId: string | null
  masterId: string | null
  date: string
  time: string
  note?: string
}

type SaveResult =
  | { ok: true; role?: 'client' | 'admin' }
  | { ok: false; error: 'email_exists' | 'invalid_credentials' }

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void

  authMode: 'guest' | 'registered' | 'admin' | null
  userRole: 'guest' | 'client' | 'admin' | null
  user: UserProfile | null
  accounts: AuthAccount[]
  setAuthMode: (mode: 'guest' | 'registered' | 'admin') => void
  setUser: (user: UserProfile) => void
  continueAsGuest: () => void
  registerAccount: (payload: RegisterPayload) => SaveResult
  loginAccount: (payload: LoginPayload) => SaveResult
  logout: () => void

  selectedCategoryId: string | null
  selectedCategorySlug: string | null
  selectedCategoryName: string | null
  selectedServiceId: string | null
  selectedService: string | null
  selectedMasterId: string | null
  selectedMaster: string | null
  setCategory: (slug: string, name: string, id?: string) => void
  setService: (service: string, serviceName?: string) => void
  setMaster: (master: string, masterName?: string) => void
  clearBooking: () => void

  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void

  serviceCategories: ServiceCategory[]
  services: ServiceItem[]
  masters: Master[]
  bookingSlots: BookingSlot[]
  careProducts: CareProduct[]
  drinks: DrinkItem[]
  trends: TrendItem[]
  bookings: BookingRecord[]
  saveCategory: (item: ServiceCategory) => void
  deleteCategory: (id: string) => void
  saveService: (item: ServiceItem) => void
  deleteService: (id: string) => void
  saveMaster: (item: Master) => void
  deleteMaster: (id: string) => void
  saveBookingSlot: (item: BookingSlot) => void
  deleteBookingSlot: (id: string) => void
  saveCareProduct: (item: CareProduct) => void
  deleteCareProduct: (id: string) => void
  saveDrink: (item: DrinkItem) => void
  deleteDrink: (id: string) => void
  saveTrend: (item: TrendItem) => void
  deleteTrend: (id: string) => void
  createBooking: (payload: BookingPayload) => BookingRecord
  saveBooking: (booking: BookingRecord) => void
  deleteBooking: (id: string) => void

  endSession: () => void
}

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function upsertById<T extends { id: string }>(items: T[], item: T) {
  return items.some((entry) => entry.id === item.id)
    ? items.map((entry) => (entry.id === item.id ? item : entry))
    : [item, ...items]
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'UA',
      setLanguage: (lang) => set({ language: lang }),

      authMode: null,
      userRole: null,
      user: null,
      accounts: [ADMIN_ACCOUNT],
      setAuthMode: (mode) =>
        set({
          authMode: mode,
          userRole: mode === 'guest' ? 'guest' : mode === 'admin' ? 'admin' : 'client',
        }),
      setUser: (user) =>
        set({
          user,
          authMode: user.role === 'admin' ? 'admin' : 'registered',
          userRole: user.role === 'admin' ? 'admin' : 'client',
        }),
      continueAsGuest: () =>
        set({
          authMode: 'guest',
          userRole: 'guest',
          user: null,
        }),
      registerAccount: (payload) => {
        const email = normalizeEmail(payload.email)
        const exists = get().accounts.some((account) => normalizeEmail(account.email) === email)

        if (exists) {
          return { ok: false, error: 'email_exists' }
        }

        const account: AuthAccount = {
          id: makeId('account'),
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
          phone: payload.phone.trim(),
          email,
          password: payload.password,
          role: 'client',
        }

        set((state) => ({
          accounts: [...state.accounts, account],
          authMode: 'registered',
          userRole: 'client',
          user: {
            firstName: account.firstName,
            lastName: account.lastName,
            phone: account.phone,
            email: account.email,
            role: 'client',
          },
        }))

        return { ok: true, role: 'client' }
      },
      loginAccount: (payload) => {
        const email = normalizeEmail(payload.email)
        const account = get().accounts.find(
          (entry) => normalizeEmail(entry.email) === email && entry.password === payload.password
        )

        if (!account) {
          return { ok: false, error: 'invalid_credentials' }
        }

        const role = account.role === 'admin' ? 'admin' : 'client'

        set({
          authMode: role === 'admin' ? 'admin' : 'registered',
          userRole: role,
          user: {
            firstName: account.firstName,
            lastName: account.lastName,
            phone: account.phone,
            email: account.email,
            role,
          },
        })

        return { ok: true, role }
      },
      logout: () =>
        set({
          authMode: null,
          userRole: null,
          user: null,
        }),

      selectedCategoryId: null,
      selectedCategorySlug: null,
      selectedCategoryName: null,
      selectedServiceId: null,
      selectedService: null,
      selectedMasterId: null,
      selectedMaster: null,
      setCategory: (slug, name, id) =>
        set({
          selectedCategoryId: id ?? null,
          selectedCategorySlug: slug,
          selectedCategoryName: name,
          selectedServiceId: null,
          selectedService: null,
          selectedMasterId: null,
          selectedMaster: null,
        }),
      setService: (service, serviceName) =>
        set({
          selectedServiceId: service,
          selectedService: serviceName ?? service,
          selectedMasterId: null,
          selectedMaster: null,
        }),
      setMaster: (master, masterName) =>
        set({
          selectedMasterId: master,
          selectedMaster: masterName ?? master,
        }),
      clearBooking: () =>
        set({
          selectedCategoryId: null,
          selectedCategorySlug: null,
          selectedCategoryName: null,
          selectedServiceId: null,
          selectedService: null,
          selectedMasterId: null,
          selectedMaster: null,
        }),

      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((entry) => entry.id === item.id)

          if (existing) {
            return {
              cart: state.cart.map((entry) =>
                entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
              ),
            }
          }

          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          }
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((entry) => entry.id !== id),
        })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          cart:
            qty <= 0
              ? state.cart.filter((entry) => entry.id !== id)
              : state.cart.map((entry) =>
                  entry.id === id ? { ...entry, quantity: qty } : entry
                ),
        })),
      clearCart: () => set({ cart: [] }),

      serviceCategories: SERVICE_CATEGORIES,
      services: SERVICES,
      masters: MASTERS,
      bookingSlots: BOOKING_SLOTS,
      careProducts: CARE_PRODUCTS,
      drinks: DRINKS,
      trends: TRENDS,
      bookings: INITIAL_BOOKINGS,
      saveCategory: (item) =>
        set((state) => ({
          serviceCategories: upsertById(state.serviceCategories, item),
        })),
      deleteCategory: (id) =>
        set((state) => {
          const removedCategory = state.serviceCategories.find((entry) => entry.id === id)
          const removedServiceIds = state.services
            .filter((entry) => entry.categoryId === id)
            .map((entry) => entry.id)

          return {
            serviceCategories: state.serviceCategories.filter((entry) => entry.id !== id),
            services: state.services.filter((entry) => entry.categoryId !== id),
            masters: state.masters.map((entry) => ({
              ...entry,
              specialtyCategoryIds: entry.specialtyCategoryIds.filter(
                (categoryId) => categoryId !== id
              ),
            })),
            bookings: state.bookings.map((booking) => ({
              ...booking,
              categoryId: booking.categoryId === id ? null : booking.categoryId,
              serviceId:
                booking.serviceId && removedServiceIds.includes(booking.serviceId)
                  ? null
                  : booking.serviceId,
              note:
                booking.categoryId === id && removedCategory
                  ? `${booking.note}\nCategory removed: ${removedCategory.title.GB}`.trim()
                  : booking.note,
            })),
          }
        }),
      saveService: (item) =>
        set((state) => ({
          services: upsertById(state.services, item),
        })),
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((entry) => entry.id !== id),
          bookings: state.bookings.map((booking) => ({
            ...booking,
            serviceId: booking.serviceId === id ? null : booking.serviceId,
          })),
        })),
      saveMaster: (item) =>
        set((state) => ({
          masters: upsertById(state.masters, item),
        })),
      deleteMaster: (id) =>
        set((state) => ({
          masters: state.masters.filter((entry) => entry.id !== id),
          bookings: state.bookings.map((booking) => ({
            ...booking,
            masterId: booking.masterId === id ? null : booking.masterId,
          })),
        })),
      saveBookingSlot: (item) =>
        set((state) => ({
          bookingSlots: upsertById(state.bookingSlots, item).sort((left, right) =>
            left.time.localeCompare(right.time)
          ),
        })),
      deleteBookingSlot: (id) =>
        set((state) => ({
          bookingSlots: state.bookingSlots.filter((entry) => entry.id !== id),
        })),
      saveCareProduct: (item) =>
        set((state) => ({
          careProducts: upsertById(state.careProducts, item),
        })),
      deleteCareProduct: (id) =>
        set((state) => ({
          careProducts: state.careProducts.filter((entry) => entry.id !== id),
          cart: state.cart.filter((entry) => entry.id !== id),
        })),
      saveDrink: (item) =>
        set((state) => ({
          drinks: upsertById(state.drinks, item),
        })),
      deleteDrink: (id) =>
        set((state) => ({
          drinks: state.drinks.filter((entry) => entry.id !== id),
        })),
      saveTrend: (item) =>
        set((state) => ({
          trends: upsertById(state.trends, item),
        })),
      deleteTrend: (id) =>
        set((state) => ({
          trends: state.trends.filter((entry) => entry.id !== id),
        })),
      createBooking: (payload) => {
        const booking: BookingRecord = {
          id: makeId('booking'),
          customer: {
            firstName: payload.customer.firstName.trim(),
            lastName: payload.customer.lastName.trim(),
            phone: payload.customer.phone.trim(),
            email: payload.customer.email.trim(),
          },
          categoryId: payload.categoryId,
          serviceId: payload.serviceId,
          masterId: payload.masterId,
          date: payload.date,
          time: payload.time,
          status: 'new',
          note: payload.note?.trim() ?? '',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          bookings: [booking, ...state.bookings],
        }))

        return booking
      },
      saveBooking: (booking) =>
        set((state) => ({
          bookings: upsertById(state.bookings, booking),
        })),
      deleteBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((entry) => entry.id !== id),
        })),

      endSession: () =>
        set({
          selectedCategoryId: null,
          selectedCategorySlug: null,
          selectedCategoryName: null,
          selectedServiceId: null,
          selectedService: null,
          selectedMasterId: null,
          selectedMaster: null,
          cart: [],
          language: 'UA',
          authMode: null,
          userRole: null,
          user: null,
        }),
    }),
    {
      name: 'tintel-beauty-store',
    }
  )
)
