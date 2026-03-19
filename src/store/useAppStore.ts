import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch, clearLegacyAuthToken } from '@/lib/api'
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

export interface DrinkOrderRecord {
  id: string
  email: string | null
  drinkId: string
  createdAt: string
}

export interface CareOrderRecord {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  items: CartItem[]
  total: number
  createdAt: string
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

type AuthRole = 'client' | 'admin'
type SaveError = 'email_exists' | 'invalid_credentials' | 'request_failed'

type SaveResult =
  | { ok: true; role?: AuthRole }
  | {
      ok: false
      error: SaveError
      message?: string
    }

interface FrontendAuthResult {
  ok: boolean
  role?: string
  error?: string
}

interface FrontendSessionDto {
  authenticated: boolean
  role?: string
  user?: UserProfile
}

interface FrontendBootstrapDto {
  serviceCategories: ServiceCategory[]
  services: ServiceItem[]
  masters: Master[]
  bookingSlots: BookingSlot[]
  careProducts: CareProduct[]
  drinks: DrinkItem[]
  trends: TrendItem[]
  bookings: BookingRecord[]
  careOrders: CareOrderRecord[]
  drinkOrders: DrinkOrderRecord[]
}

interface DrinkOrderResponse {
  ordered: boolean
  id?: string
  email?: string | null
  drinkId?: string
  createdAt?: string
}

interface CareProductCheckoutResponse {
  ordered: boolean
  id?: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  items?: CartItem[]
  total?: number
  createdAt?: string
}

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
  registerAccount: (payload: RegisterPayload) => Promise<SaveResult>
  loginAccount: (payload: LoginPayload) => Promise<SaveResult>
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
  drinkOrderHistory: DrinkOrderRecord[]
  careOrderHistory: CareOrderRecord[]
  placeDrinkOrder: (drinkId: string) => Promise<DrinkOrderRecord>
  checkoutCareProducts: () => Promise<CareOrderRecord>
  cancelDrinkOrder: (id: string) => Promise<void>
  cancelCareOrder: (id: string) => Promise<void>

  serviceCategories: ServiceCategory[]
  services: ServiceItem[]
  masters: Master[]
  bookingSlots: BookingSlot[]
  careProducts: CareProduct[]
  drinks: DrinkItem[]
  trends: TrendItem[]
  bookings: BookingRecord[]
  saveCategory: (item: ServiceCategory) => Promise<ServiceCategory>
  deleteCategory: (id: string) => Promise<void>
  saveService: (item: ServiceItem) => Promise<ServiceItem>
  deleteService: (id: string) => Promise<void>
  saveMaster: (item: Master) => Promise<Master>
  deleteMaster: (id: string) => Promise<void>
  saveBookingSlot: (item: BookingSlot) => Promise<BookingSlot>
  deleteBookingSlot: (id: string) => Promise<void>
  saveCareProduct: (item: CareProduct) => Promise<CareProduct>
  deleteCareProduct: (id: string) => Promise<void>
  saveDrink: (item: DrinkItem) => Promise<DrinkItem>
  deleteDrink: (id: string) => Promise<void>
  saveTrend: (item: TrendItem) => Promise<TrendItem>
  deleteTrend: (id: string) => Promise<void>
  createBooking: (payload: BookingPayload) => Promise<BookingRecord>
  saveBooking: (booking: BookingRecord) => Promise<BookingRecord>
  deleteBooking: (id: string) => Promise<void>

  initData: () => Promise<void>
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

function normalizeRole(role?: string): AuthRole {
  return role === 'admin' ? 'admin' : 'client'
}

function normalizeAuthError(error?: string): SaveError {
  if (error === 'email_exists') {
    return 'email_exists'
  }

  if (error === 'invalid_credentials') {
    return 'invalid_credentials'
  }

  return 'request_failed'
}

async function resolveSessionUser(fallbackUser: UserProfile, fallbackRole: AuthRole) {
  try {
    const session = await apiFetch<FrontendSessionDto>('/frontend/auth/session')

    if (session.authenticated && session.user) {
      const role = normalizeRole(session.role ?? session.user.role)
      return {
        role,
        user: {
          ...session.user,
          role,
        },
      }
    }
  } catch (error) {
    console.warn('Failed to sync auth session:', error)
  }

  return {
    role: fallbackRole,
    user: {
      ...fallbackUser,
      role: fallbackRole,
    },
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const fetchSession = async (): Promise<FrontendSessionDto> => {
        try {
          return await apiFetch<FrontendSessionDto>('/frontend/auth/session')
        } catch (error) {
          console.warn('Failed to fetch auth session:', error)
          return { authenticated: false }
        }
      }

      const syncBootstrap = async () => {
        const [bootstrap, session] = await Promise.all([
          apiFetch<FrontendBootstrapDto>('/frontend/bootstrap'),
          fetchSession(),
        ])

        set((state) => {
          const nextState: Partial<AppState> = {
            serviceCategories: Array.isArray(bootstrap.serviceCategories)
              ? bootstrap.serviceCategories
              : state.serviceCategories,
            services: Array.isArray(bootstrap.services) ? bootstrap.services : state.services,
            masters: Array.isArray(bootstrap.masters) ? bootstrap.masters : state.masters,
            bookingSlots: Array.isArray(bootstrap.bookingSlots)
              ? bootstrap.bookingSlots
              : state.bookingSlots,
            careProducts: Array.isArray(bootstrap.careProducts)
              ? bootstrap.careProducts
              : state.careProducts,
            drinks: Array.isArray(bootstrap.drinks) ? bootstrap.drinks : state.drinks,
            trends: Array.isArray(bootstrap.trends) ? bootstrap.trends : state.trends,
            bookings: Array.isArray(bootstrap.bookings) ? bootstrap.bookings : state.bookings,
            careOrderHistory: Array.isArray(bootstrap.careOrders)
              ? bootstrap.careOrders
              : state.careOrderHistory,
            drinkOrderHistory: Array.isArray(bootstrap.drinkOrders)
              ? bootstrap.drinkOrders
              : state.drinkOrderHistory,
          }

          if (session.authenticated && session.user) {
            const role = normalizeRole(session.role ?? session.user.role)
            nextState.authMode = role === 'admin' ? 'admin' : 'registered'
            nextState.userRole = role
            nextState.user = {
              ...session.user,
              role,
            }
          } else if (state.userRole && state.userRole !== 'guest') {
            nextState.authMode = null
            nextState.userRole = null
            nextState.user = null
          }

          return nextState
        })
      }

      const saveEntity = async <TResponse>(
        endpoint: string,
        id: string,
        body: unknown
      ) => {
        return apiFetch<TResponse>(id ? `${endpoint}/${id}` : endpoint, {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(body),
        })
      }

      const deleteEntity = async (endpoint: string, id: string) => {
        await apiFetch(`${endpoint}/${id}`, {
          method: 'DELETE',
        })
      }

      return {
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
        registerAccount: async (payload) => {
          try {
            const registration = await apiFetch<FrontendAuthResult>('/frontend/auth/register', {
              method: 'POST',
              body: JSON.stringify({
                firstName: payload.firstName.trim(),
                lastName: payload.lastName.trim(),
                phone: payload.phone.trim(),
                email: normalizeEmail(payload.email),
                password: payload.password,
              }),
            })

            if (!registration.ok) {
              return {
                ok: false,
                error: normalizeAuthError(registration.error),
                message: registration.error,
              }
            }

            clearLegacyAuthToken()

            const sessionState = await resolveSessionUser(
              {
                firstName: payload.firstName.trim(),
                lastName: payload.lastName.trim(),
                phone: payload.phone.trim(),
                email: normalizeEmail(payload.email),
              },
              normalizeRole(registration.role)
            )

            set({
              authMode: sessionState.role === 'admin' ? 'admin' : 'registered',
              userRole: sessionState.role,
              user: sessionState.user,
            })

            await syncBootstrap().catch((error) => {
              console.warn('Bootstrap sync after registration failed:', error)
            })

            return { ok: true, role: sessionState.role }
          } catch (err) {
            console.error('Registration failed:', err)
            return {
              ok: false,
              error: 'request_failed',
              message: err instanceof Error ? err.message : 'Registration failed. Try again.',
            }
          }
        },
        loginAccount: async (payload) => {
          try {
            const loginResult = await apiFetch<FrontendAuthResult>('/frontend/auth/login', {
              method: 'POST',
              body: JSON.stringify({
                email: normalizeEmail(payload.email),
                password: payload.password,
              }),
            })

            if (!loginResult.ok) {
              return {
                ok: false,
                error: normalizeAuthError(loginResult.error),
                message: loginResult.error,
              }
            }

            clearLegacyAuthToken()

            const sessionState = await resolveSessionUser(
              {
                firstName: '',
                lastName: '',
                phone: '',
                email: normalizeEmail(payload.email),
              },
              normalizeRole(loginResult.role)
            )

            set({
              authMode: sessionState.role === 'admin' ? 'admin' : 'registered',
              userRole: sessionState.role,
              user: sessionState.user,
            })

            await syncBootstrap().catch((error) => {
              console.warn('Bootstrap sync after login failed:', error)
            })

            return { ok: true, role: sessionState.role }
          } catch (err) {
            console.error('Login failed:', err)
            return {
              ok: false,
              error: 'request_failed',
              message: err instanceof Error ? err.message : 'Login failed. Try again.',
            }
          }
        },
        logout: () => {
          void apiFetch('/frontend/auth/logout', {
            method: 'POST',
          }).catch((error) => {
            console.error('Logout failed:', error)
          })

          clearLegacyAuthToken()

          set({
            authMode: null,
            userRole: null,
            user: null,
            bookings: [],
            careOrderHistory: [],
            drinkOrderHistory: [],
          })
        },

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
        drinkOrderHistory: [],
        careOrderHistory: [],
        placeDrinkOrder: async (drinkId) => {
          const result = await apiFetch<DrinkOrderResponse>('/frontend/drink-orders', {
            method: 'POST',
            body: JSON.stringify({
              drinkId,
            }),
          })

          if (!result.ordered) {
            throw new Error('Drink order failed. Try again.')
          }

          const order: DrinkOrderRecord = {
            id: result.id || makeId('drink-order'),
            email:
              typeof result.email === 'string'
                ? normalizeEmail(result.email)
                : get().user?.email
                  ? normalizeEmail(get().user!.email)
                  : null,
            drinkId: result.drinkId ?? drinkId,
            createdAt: result.createdAt || new Date().toISOString(),
          }

          set((state) => ({
            drinkOrderHistory: upsertById(state.drinkOrderHistory, order),
          }))

          return order
        },
        checkoutCareProducts: async () => {
          const cart = get().cart

          if (cart.length === 0) {
            throw new Error('Your cart is empty.')
          }

          const result = await apiFetch<CareProductCheckoutResponse>('/frontend/care-product-checkouts', {
            method: 'POST',
            body: JSON.stringify({
              items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
            }),
          })

          if (!result.ordered) {
            throw new Error('Checkout failed. Try again.')
          }

          const order: CareOrderRecord = {
            id: result.id || makeId('care-order'),
            email:
              typeof result.email === 'string'
                ? normalizeEmail(result.email)
                : get().user?.email
                  ? normalizeEmail(get().user!.email)
                  : null,
            firstName:
              typeof result.firstName === 'string'
                ? result.firstName
                : get().user?.firstName || null,
            lastName:
              typeof result.lastName === 'string'
                ? result.lastName
                : get().user?.lastName || null,
            phone:
              typeof result.phone === 'string'
                ? result.phone
                : get().user?.phone || null,
            items: result.items?.length ? result.items : cart,
            total:
              typeof result.total === 'number'
                ? result.total
                : cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            createdAt: result.createdAt || new Date().toISOString(),
          }

          set((state) => ({
            careOrderHistory: upsertById(state.careOrderHistory, order),
            cart: [],
          }))

          return order
        },
        cancelDrinkOrder: async (id) => {
          await apiFetch(`/frontend/drink-orders/${id}`, {
            method: 'DELETE',
          })

          await syncBootstrap()
        },
        cancelCareOrder: async (id) => {
          await apiFetch(`/frontend/care-product-checkouts/${id}`, {
            method: 'DELETE',
          })

          await syncBootstrap()
        },

        serviceCategories: SERVICE_CATEGORIES,
        services: SERVICES,
        masters: MASTERS,
        bookingSlots: BOOKING_SLOTS,
        careProducts: CARE_PRODUCTS,
        drinks: DRINKS,
        trends: TRENDS,
        bookings: INITIAL_BOOKINGS,
        saveCategory: async (item) => {
          const saved = await saveEntity<ServiceCategory>('/frontend/service-categories', item.id, {
            ...(item.id ? { id: item.id } : {}),
            slug: item.slug.trim(),
            icon: item.icon.trim(),
            title: item.title,
            description: item.description,
          })

          await syncBootstrap()
          return saved
        },
        deleteCategory: async (id) => {
          await deleteEntity('/frontend/service-categories', id)
          await syncBootstrap()
        },
        saveService: async (item) => {
          const saved = await saveEntity<ServiceItem>('/frontend/services', item.id, {
            ...(item.id ? { id: item.id } : {}),
            categoryId: item.categoryId,
            title: item.title,
            durationMinutes: Number(item.durationMinutes) || 0,
            price: Number(item.price) || 0,
          })

          await syncBootstrap()
          return saved
        },
        deleteService: async (id) => {
          await deleteEntity('/frontend/services', id)
          await syncBootstrap()
        },
        saveMaster: async (item) => {
          const saved = await saveEntity<Master>('/frontend/masters', item.id, {
            ...(item.id ? { id: item.id } : {}),
            name: item.name.trim(),
            role: item.role,
            initials: item.initials.trim(),
            experienceLabel: item.experienceLabel.trim(),
            specialtyCategoryIds: item.specialtyCategoryIds,
            credentials: (item.credentials ?? []).map((credential) => ({
              ...(credential.id ? { id: credential.id } : {}),
              name: credential.name.trim(),
              type: credential.type.trim(),
              fileUrl: credential.fileUrl,
            })),
          })

          await syncBootstrap()
          return get().masters.find((entry) => entry.id === saved.id) ?? saved
        },
        deleteMaster: async (id) => {
          await deleteEntity('/frontend/masters', id)
          await syncBootstrap()
        },
        saveBookingSlot: async (item) => {
          const saved = await saveEntity<BookingSlot>('/frontend/booking-slots', item.id, {
            ...(item.id ? { id: item.id } : {}),
            period: item.period,
            time: item.time,
          })

          await syncBootstrap()
          return saved
        },
        deleteBookingSlot: async (id) => {
          await deleteEntity('/frontend/booking-slots', id)
          await syncBootstrap()
        },
        saveCareProduct: async (item) => {
          const saved = await saveEntity<CareProduct>('/frontend/care-products', item.id, {
            ...(item.id ? { id: item.id } : {}),
            title: item.title,
            brand: item.brand.trim(),
            price: Number(item.price) || 0,
            icon: item.icon.trim(),
          })

          await syncBootstrap()
          return saved
        },
        deleteCareProduct: async (id) => {
          await deleteEntity('/frontend/care-products', id)
          await syncBootstrap()
          set((state) => ({
            cart: state.cart.filter((entry) => entry.id !== id),
          }))
        },
        saveDrink: async (item) => {
          const saved = await saveEntity<DrinkItem>('/frontend/drinks', item.id, {
            ...(item.id ? { id: item.id } : {}),
            title: item.title,
            icon: item.icon.trim(),
          })

          await syncBootstrap()
          return saved
        },
        deleteDrink: async (id) => {
          await deleteEntity('/frontend/drinks', id)
          await syncBootstrap()
        },
        saveTrend: async (item) => {
          const saved = await saveEntity<TrendItem>('/frontend/trends', item.id, {
            ...(item.id ? { id: item.id } : {}),
            title: item.title,
            description: item.description,
            gradient: item.gradient.trim(),
            emoji: item.emoji.trim(),
            image: item.image ?? null,
          })

          await syncBootstrap()
          return get().trends.find((entry) => entry.id === saved.id) ?? saved
        },
        deleteTrend: async (id) => {
          await deleteEntity('/frontend/trends', id)
          await syncBootstrap()
        },
        createBooking: async (payload) => {
          try {
            const response = await apiFetch<BookingRecord>('/frontend/bookings', {
              method: 'POST',
              body: JSON.stringify({
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
              }),
            })

            const booking: BookingRecord = {
              id: response.id || makeId('booking'),
              customer: {
                firstName: response.customer?.firstName || payload.customer.firstName.trim(),
                lastName: response.customer?.lastName || payload.customer.lastName.trim(),
                phone: response.customer?.phone || payload.customer.phone.trim(),
                email: response.customer?.email || payload.customer.email.trim(),
              },
              categoryId: response.categoryId ?? payload.categoryId,
              serviceId: response.serviceId ?? payload.serviceId,
              masterId: response.masterId ?? payload.masterId,
              date: response.date || payload.date,
              time: response.time || payload.time,
              status: response.status || 'new',
              note: response.note ?? payload.note?.trim() ?? '',
              createdAt: response.createdAt || new Date().toISOString(),
            }

            set((state) => ({
              bookings: upsertById(state.bookings, booking),
            }))

            return booking
          } catch (err) {
            console.error('Booking failed:', err)
            throw err instanceof Error ? err : new Error('Booking failed. Try again.')
          }
        },
        saveBooking: async (booking) => {
          const saved = await saveEntity<BookingRecord>('/frontend/bookings', booking.id, {
            ...(booking.id ? { id: booking.id } : {}),
            customer: {
              firstName: booking.customer.firstName.trim(),
              lastName: booking.customer.lastName.trim(),
              phone: booking.customer.phone.trim(),
              email: booking.customer.email.trim(),
            },
            categoryId: booking.categoryId,
            serviceId: booking.serviceId,
            masterId: booking.masterId,
            date: booking.date,
            time: booking.time,
            status: booking.status,
            note: booking.note,
            createdAt: booking.createdAt,
          })

          await syncBootstrap()
          return saved
        },
        deleteBooking: async (id) => {
          await deleteEntity('/frontend/bookings', id)
          await syncBootstrap()
        },

        initData: async () => {
          try {
            await syncBootstrap()
          } catch (err) {
            console.error('Failed to fetch initial data', err)
          }
        },

        endSession: () => {
          void apiFetch('/frontend/auth/logout', {
            method: 'POST',
          }).catch((error) => {
            console.error('End session logout failed:', error)
          })

          clearLegacyAuthToken()

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
            bookings: [],
            careOrderHistory: [],
            drinkOrderHistory: [],
          })
        },
      }
    },
    {
      name: 'tintel-beauty-store',
    }
  )
)
