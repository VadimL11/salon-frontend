import { type Language } from '@/dictionaries'

interface AccountCopy {
  tileTitle: string
  tileSubtitle: string
  signedInAs: string
  registeredClient: string
  adminAccount: string
  openAccount: string
  title: string
  subtitle: string
  profile: string
  bookings: string
  noBookings: string
  productOrders: string
  noProductOrders: string
  drinkOrders: string
  noDrinkOrders: string
  bookedAt: string
  orderedAt: string
  total: string
  quantity: string
  authRequired: string
  goToAuth: string
}

const ACCOUNT_COPY: Record<Language, AccountCopy> = {
  UA: {
    tileTitle: 'Кабінет',
    tileSubtitle: 'Ваші записи та замовлення',
    signedInAs: 'Ви авторизовані',
    registeredClient: 'Зареєстрований клієнт',
    adminAccount: 'Адмін-акаунт',
    openAccount: 'Відкрити кабінет',
    title: 'Мій кабінет',
    subtitle: 'Профіль, записи та замовлення в одному місці.',
    profile: 'Профіль',
    bookings: 'Мої записи',
    noBookings: 'Поки що немає записів.',
    productOrders: 'Замовлення косметики',
    noProductOrders: 'Поки що немає замовлень косметики.',
    drinkOrders: 'Замовлення напоїв',
    noDrinkOrders: 'Поки що немає замовлень напоїв.',
    bookedAt: 'Створено',
    orderedAt: 'Замовлено',
    total: 'Разом',
    quantity: 'Кількість',
    authRequired: 'Увійдіть у свій акаунт, щоб побачити записи та замовлення.',
    goToAuth: 'До входу',
  },
  DE: {
    tileTitle: 'Konto',
    tileSubtitle: 'Ihre Termine und Bestellungen',
    signedInAs: 'Angemeldet als',
    registeredClient: 'Registrierte Kundin',
    adminAccount: 'Admin-Konto',
    openAccount: 'Konto öffnen',
    title: 'Mein Konto',
    subtitle: 'Profil, Termine und Bestellungen an einem Ort.',
    profile: 'Profil',
    bookings: 'Meine Termine',
    noBookings: 'Noch keine Termine vorhanden.',
    productOrders: 'Produktbestellungen',
    noProductOrders: 'Noch keine Produktbestellungen vorhanden.',
    drinkOrders: 'Getränkebestellungen',
    noDrinkOrders: 'Noch keine Getränkebestellungen vorhanden.',
    bookedAt: 'Erstellt',
    orderedAt: 'Bestellt',
    total: 'Gesamt',
    quantity: 'Menge',
    authRequired: 'Melden Sie sich an, um Ihre Termine und Bestellungen zu sehen.',
    goToAuth: 'Zum Login',
  },
  GB: {
    tileTitle: 'Account',
    tileSubtitle: 'Your bookings and orders',
    signedInAs: 'Signed in as',
    registeredClient: 'Registered client',
    adminAccount: 'Admin account',
    openAccount: 'Open account',
    title: 'My Account',
    subtitle: 'Profile, bookings, and orders in one place.',
    profile: 'Profile',
    bookings: 'My bookings',
    noBookings: 'No bookings yet.',
    productOrders: 'Care orders',
    noProductOrders: 'No care product orders yet.',
    drinkOrders: 'Drink orders',
    noDrinkOrders: 'No drink orders yet.',
    bookedAt: 'Created',
    orderedAt: 'Ordered',
    total: 'Total',
    quantity: 'Quantity',
    authRequired: 'Sign in to view your bookings and orders.',
    goToAuth: 'Go to login',
  },
}

export function getAccountCopy(language: Language) {
  return ACCOUNT_COPY[language]
}
