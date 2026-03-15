export type LocalizedText = Record<'UA' | 'DE' | 'GB', string>

export interface ServiceCategory {
  id: string
  slug: string
  icon: string
  title: LocalizedText
  description: LocalizedText
}

export interface ServiceItem {
  id: string
  categoryId: string
  title: LocalizedText
  durationMinutes: number
  price: number
}

export interface Master {
  id: string
  name: string
  role: LocalizedText
  initials: string
  experienceLabel: string
  specialtyCategoryIds: string[]
}

export type BookingPeriod = 'morning' | 'afternoon' | 'evening'

export interface BookingSlot {
  id: string
  period: BookingPeriod
  time: string
}

export interface CareProduct {
  id: string
  title: LocalizedText
  brand: string
  price: number
  icon: string
}

export interface DrinkItem {
  id: string
  title: LocalizedText
  icon: string
}

export interface TrendItem {
  id: string
  title: LocalizedText
  description: LocalizedText
  gradient: string
  emoji: string
}

export interface BookingRecord {
  id: string
  customer: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  categoryId: string | null
  serviceId: string | null
  masterId: string | null
  date: string
  time: string
  status: 'new' | 'confirmed' | 'completed' | 'cancelled'
  note: string
  createdAt: string
}

export interface AuthAccount {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  role: 'client' | 'admin'
}

export const ADMIN_ACCOUNT: AuthAccount = {
  id: 'account-admin',
  firstName: 'Salon',
  lastName: 'Admin',
  phone: '+49 30 555 1000',
  email: 'admin@tintel.beauty',
  password: 'golden-admin',
  role: 'admin',
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-hair',
    slug: 'hair',
    icon: '✂',
    title: {
      UA: 'Волосся',
      DE: 'Haare',
      GB: 'Hair',
    },
    description: {
      UA: 'Стрижки, фарбування та догляд',
      DE: 'Cuts, Colorationen und Pflege',
      GB: 'Cuts, colour and care rituals',
    },
  },
  {
    id: 'cat-nails',
    slug: 'nails',
    icon: '◌',
    title: {
      UA: 'Нігті',
      DE: 'Nails',
      GB: 'Nails',
    },
    description: {
      UA: 'Манікюр, педикюр та дизайн',
      DE: 'Maniküre, Pediküre und Design',
      GB: 'Manicure, pedicure and nail design',
    },
  },
  {
    id: 'cat-makeup',
    slug: 'makeup',
    icon: '✦',
    title: {
      UA: 'Макіяж',
      DE: 'Make-up',
      GB: 'Makeup',
    },
    description: {
      UA: 'Образи для дня, вечора та подій',
      DE: 'Looks für Tag, Abend und Events',
      GB: 'Looks for day, evening and events',
    },
  },
  {
    id: 'cat-styling',
    slug: 'styling',
    icon: '∞',
    title: {
      UA: 'Стайлінг',
      DE: 'Styling',
      GB: 'Styling',
    },
    description: {
      UA: 'Укладання, текстура та фініш',
      DE: 'Styling, Textur und Finish',
      GB: 'Styling, texture and finish',
    },
  },
]

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-signature-cut',
    categoryId: 'cat-hair',
    title: {
      UA: 'Фірмова стрижка',
      DE: 'Signature Cut',
      GB: 'Signature Cut',
    },
    durationMinutes: 60,
    price: 65,
  },
  {
    id: 'srv-gloss-color',
    categoryId: 'cat-hair',
    title: {
      UA: 'Тонування та блиск',
      DE: 'Glossing und Shine',
      GB: 'Gloss and Shine',
    },
    durationMinutes: 105,
    price: 110,
  },
  {
    id: 'srv-repair-ritual',
    categoryId: 'cat-hair',
    title: {
      UA: 'Відновлюючий ритуал',
      DE: 'Repair Ritual',
      GB: 'Repair Ritual',
    },
    durationMinutes: 75,
    price: 85,
  },
  {
    id: 'srv-lux-manicure',
    categoryId: 'cat-nails',
    title: {
      UA: 'Люкс манікюр',
      DE: 'Luxus Maniküre',
      GB: 'Luxury Manicure',
    },
    durationMinutes: 60,
    price: 48,
  },
  {
    id: 'srv-gel-sculpt',
    categoryId: 'cat-nails',
    title: {
      UA: 'Гелеве моделювання',
      DE: 'Gel Modellage',
      GB: 'Gel Sculpt',
    },
    durationMinutes: 90,
    price: 72,
  },
  {
    id: 'srv-event-glam',
    categoryId: 'cat-makeup',
    title: {
      UA: 'Вечірній glam',
      DE: 'Abend Glam',
      GB: 'Evening Glam',
    },
    durationMinutes: 70,
    price: 92,
  },
  {
    id: 'srv-bridal-preview',
    categoryId: 'cat-makeup',
    title: {
      UA: 'Весільний тест-образ',
      DE: 'Braut Probetermin',
      GB: 'Bridal Preview',
    },
    durationMinutes: 95,
    price: 130,
  },
  {
    id: 'srv-soft-waves',
    categoryId: 'cat-styling',
    title: {
      UA: 'М’які хвилі',
      DE: 'Soft Waves',
      GB: 'Soft Waves',
    },
    durationMinutes: 45,
    price: 55,
  },
  {
    id: 'srv-red-carpet',
    categoryId: 'cat-styling',
    title: {
      UA: 'Red carpet укладка',
      DE: 'Red Carpet Styling',
      GB: 'Red Carpet Styling',
    },
    durationMinutes: 80,
    price: 95,
  },
]

export const MASTERS: Master[] = [
  {
    id: 'master-anna',
    name: 'Anna Kovalenko',
    role: {
      UA: 'Топ-стиліст',
      DE: 'Top Stylistin',
      GB: 'Top Stylist',
    },
    initials: 'AK',
    experienceLabel: '8+ years',
    specialtyCategoryIds: ['cat-hair', 'cat-styling'],
  },
  {
    id: 'master-maria',
    name: 'Maria Petrenko',
    role: {
      UA: 'Колорист',
      DE: 'Coloristin',
      GB: 'Colour Specialist',
    },
    initials: 'MP',
    experienceLabel: '6+ years',
    specialtyCategoryIds: ['cat-hair'],
  },
  {
    id: 'master-olena',
    name: 'Olena Shevchenko',
    role: {
      UA: 'Майстер нігтьового сервісу',
      DE: 'Nail Artist',
      GB: 'Nail Artist',
    },
    initials: 'OS',
    experienceLabel: '7+ years',
    specialtyCategoryIds: ['cat-nails'],
  },
  {
    id: 'master-iryna',
    name: 'Iryna Bondar',
    role: {
      UA: 'Make-up artist',
      DE: 'Make-up Artist',
      GB: 'Makeup Artist',
    },
    initials: 'IB',
    experienceLabel: '5+ years',
    specialtyCategoryIds: ['cat-makeup', 'cat-styling'],
  },
]

export const BOOKING_SLOTS: BookingSlot[] = [
  { id: 'slot-0900', period: 'morning', time: '09:00' },
  { id: 'slot-0930', period: 'morning', time: '09:30' },
  { id: 'slot-1000', period: 'morning', time: '10:00' },
  { id: 'slot-1030', period: 'morning', time: '10:30' },
  { id: 'slot-1130', period: 'morning', time: '11:30' },
  { id: 'slot-1200', period: 'afternoon', time: '12:00' },
  { id: 'slot-1230', period: 'afternoon', time: '12:30' },
  { id: 'slot-1330', period: 'afternoon', time: '13:30' },
  { id: 'slot-1430', period: 'afternoon', time: '14:30' },
  { id: 'slot-1600', period: 'evening', time: '16:00' },
  { id: 'slot-1700', period: 'evening', time: '17:00' },
  { id: 'slot-1800', period: 'evening', time: '18:00' },
]

export const CARE_PRODUCTS: CareProduct[] = [
  {
    id: 'prod-gold-shampoo',
    title: {
      UA: 'Шампунь Gold Recovery',
      DE: 'Gold Recovery Shampoo',
      GB: 'Gold Recovery Shampoo',
    },
    brand: 'Kérastase',
    price: 29,
    icon: '◍',
  },
  {
    id: 'prod-velvet-mask',
    title: {
      UA: 'Маска Velvet Repair',
      DE: 'Velvet Repair Maske',
      GB: 'Velvet Repair Mask',
    },
    brand: 'Oribe',
    price: 46,
    icon: '◎',
  },
  {
    id: 'prod-argan-serum',
    title: {
      UA: 'Argan Shine serum',
      DE: 'Argan Shine Serum',
      GB: 'Argan Shine Serum',
    },
    brand: 'Moroccanoil',
    price: 38,
    icon: '◇',
  },
  {
    id: 'prod-volume-mist',
    title: {
      UA: 'Volume pearl mist',
      DE: 'Volume Pearl Mist',
      GB: 'Volume Pearl Mist',
    },
    brand: 'Aveda',
    price: 24,
    icon: '✧',
  },
]

export const DRINKS: DrinkItem[] = [
  {
    id: 'drink-espresso',
    title: {
      UA: 'Еспресо',
      DE: 'Espresso',
      GB: 'Espresso',
    },
    icon: '☕',
  },
  {
    id: 'drink-cappuccino',
    title: {
      UA: 'Капучино',
      DE: 'Cappuccino',
      GB: 'Cappuccino',
    },
    icon: '◔',
  },
  {
    id: 'drink-jasmine',
    title: {
      UA: 'Жасминовий чай',
      DE: 'Jasmin Tee',
      GB: 'Jasmine Tea',
    },
    icon: '❀',
  },
  {
    id: 'drink-lemon-water',
    title: {
      UA: 'Лимонна вода',
      DE: 'Zitronenwasser',
      GB: 'Lemon Water',
    },
    icon: '◐',
  },
]

export const TRENDS: TrendItem[] = [
  {
    id: 'trend-balayage',
    title: {
      UA: 'Sunlit balayage',
      DE: 'Sunlit Balayage',
      GB: 'Sunlit Balayage',
    },
    description: {
      UA: 'М’який перелив кольору з теплим перлинним сяйвом.',
      DE: 'Weicher Farbfluss mit warmem Perlschimmer.',
      GB: 'Soft colour melt with a warm pearly finish.',
    },
    gradient: 'linear-gradient(135deg, #c59b57 0%, #f0d7a1 45%, #d5b277 100%)',
    emoji: '✦',
  },
  {
    id: 'trend-sculpted-bob',
    title: {
      UA: 'Sculpted bob',
      DE: 'Sculpted Bob',
      GB: 'Sculpted Bob',
    },
    description: {
      UA: 'Чисті лінії та дзеркальний блиск.',
      DE: 'Klare Linien und spiegelnder Glanz.',
      GB: 'Clean lines with a mirror-like shine.',
    },
    gradient: 'linear-gradient(135deg, #697680 0%, #c9d2d8 55%, #8e9ca6 100%)',
    emoji: '✂',
  },
  {
    id: 'trend-luxe-texture',
    title: {
      UA: 'Luxe texture',
      DE: 'Luxe Texture',
      GB: 'Luxe Texture',
    },
    description: {
      UA: 'Повітряний об’єм, текстура та гнучкий фініш.',
      DE: 'Luftiges Volumen, Textur und flexibles Finish.',
      GB: 'Airy volume, texture and a flexible finish.',
    },
    gradient: 'linear-gradient(135deg, #8f6b56 0%, #e5c5ac 50%, #bd8e72 100%)',
    emoji: '∞',
  },
]

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'booking-seed-1',
    customer: {
      firstName: 'Sofia',
      lastName: 'Miller',
      phone: '+49 176 555 1122',
      email: 'sofia@example.com',
    },
    categoryId: 'cat-hair',
    serviceId: 'srv-gloss-color',
    masterId: 'master-maria',
    date: '2026-03-14',
    time: '12:30',
    status: 'confirmed',
    note: 'First visit, warm blonde reference.',
    createdAt: '2026-03-08T12:00:00.000Z',
  },
  {
    id: 'booking-seed-2',
    customer: {
      firstName: 'Emma',
      lastName: 'Roth',
      phone: '+49 171 555 7788',
      email: 'emma@example.com',
    },
    categoryId: 'cat-makeup',
    serviceId: 'srv-event-glam',
    masterId: 'master-iryna',
    date: '2026-03-15',
    time: '16:00',
    status: 'new',
    note: 'Evening gala at 20:00.',
    createdAt: '2026-03-10T16:45:00.000Z',
  },
]

export const PERIOD_ORDER: BookingPeriod[] = ['morning', 'afternoon', 'evening']

export function getLocalizedText(text: LocalizedText, language: 'UA' | 'DE' | 'GB') {
  return text[language]
}
