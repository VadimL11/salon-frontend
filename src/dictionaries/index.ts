export type Language = 'UA' | 'DE' | 'GB'

export interface Dict {
  menu: {
    title: string
    booking: string
    bookingSubtitle: string
    price: string
    priceSubtitle: string
    orderDrink: string
    orderDrinkSubtitle: string
    orderProduct: string
    orderProductSubtitle: string
    trends: string
    trendsSubtitle: string
    admin: string
    adminSubtitle: string
    open: string
  }
  services: {
    title: string
    chooseCategory: string
    chooseService: string
    chooseMaster: string
    experience: string
  }
  booking: {
    title: string
    service: string
    master: string
    dateLabel: string
    timeLabel: string
    formTitle: string
    firstName: string
    lastName: string
    phone: string
    email: string
    note: string
    confirm: string
    confirmed: string
    confirmedSub: string
    newBooking: string
    morning: string
    afternoon: string
    evening: string
    noSlots: string
  }
  price: {
    title: string
  }
  orderDrink: {
    title: string
    ordered: string
    orderAgain: string
    comingSoon: string
    order: string
  }
  orderProduct: {
    title: string
    cart: string
    emptyCart: string
    total: string
    orderNow: string
    addToCart: string
    ordered: string
    orderAgain: string
    added: string
  }
  trends: {
    title: string
  }
  auth: {
    title: string
    subtitle: string
    guest: string
    guestSubtitle: string
    register: string
    login: string
    registerTitle: string
    registerSubtitle: string
    loginTitle: string
    loginSubtitle: string
    continueGuest: string
    createAccount: string
    signIn: string
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    confirmPassword: string
    passwordMismatch: string
    emailExists: string
    invalidCredentials: string
    adminHint: string
    adminDemoTitle: string
    useAdminDemo: string
  }
  admin: {
    title: string
    subtitle: string
    overview: string
    masters: string
    services: string
    prices: string
    slots: string
    products: string
    drinks: string
    trends: string
    bookings: string
    addNew: string
    save: string
    delete: string
    empty: string
    name: string
    role: string
    initials: string
    experience: string
    category: string
    icon: string
    brand: string
    price: string
    duration: string
    titleUa: string
    titleDe: string
    titleGb: string
    descriptionUa: string
    descriptionDe: string
    descriptionGb: string
    period: string
    time: string
    customer: string
    phone: string
    email: string
    status: string
    note: string
    noSelection: string
    createPrompt: string
    accessDenied: string
    accessHint: string
    openMenu: string
    goAuth: string
    totalServices: string
    totalBookings: string
    totalMasters: string
    totalRevenue: string
    statusNew: string
    statusConfirmed: string
    statusCompleted: string
    statusCancelled: string
  }
  common: {
    back: string
    endSession: string
    start: string
    language: string
    tagline: string
  }
}

const UA: Dict = {
  menu: {
    title: 'Головне меню',
    booking: 'Записатися',
    bookingSubtitle: 'Дати, час та майстри',
    price: 'Прайс',
    priceSubtitle: 'Тривалість і вартість',
    orderDrink: 'Напої',
    orderDrinkSubtitle: 'Кава, чай та вода',
    orderProduct: 'Догляд',
    orderProductSubtitle: 'Засоби для домашнього ритуалу',
    trends: 'Тренди',
    trendsSubtitle: 'Актуальні салонні образи',
    admin: 'Admin panel',
    adminSubtitle: 'Керування салоном та бронюваннями',
    open: 'ВІДКРИТИ →',
  },
  services: {
    title: 'Послуги',
    chooseCategory: 'Оберіть категорію',
    chooseService: 'Оберіть послугу',
    chooseMaster: 'Оберіть майстра',
    experience: 'досвід',
  },
  booking: {
    title: 'Бронювання',
    service: 'Послуга',
    master: 'Майстер',
    dateLabel: 'Оберіть дату',
    timeLabel: 'Оберіть час',
    formTitle: 'Контактні дані',
    firstName: "Ім'я",
    lastName: 'Прізвище',
    phone: 'Телефон',
    email: 'Email',
    note: 'Коментар',
    confirm: 'Підтвердити запис',
    confirmed: 'Запис підтверджено',
    confirmedSub: 'Ми додали бронювання до журналу салону.',
    newBooking: 'Створити ще один запис',
    morning: 'Ранок',
    afternoon: 'День',
    evening: 'Вечір',
    noSlots: 'Слоти ще не налаштовані.',
  },
  price: {
    title: 'Прайс лист',
  },
  orderDrink: {
    title: 'Замовити напій',
    ordered: 'Замовлення прийнято',
    orderAgain: 'Замовити ще',
    comingSoon: 'буде подано незабаром',
    order: 'Замовити',
  },
  orderProduct: {
    title: 'Доглядові продукти',
    cart: 'Кошик',
    emptyCart: 'Кошик порожній',
    total: 'Разом',
    orderNow: 'Оформити',
    addToCart: 'До кошика',
    ordered: 'Замовлення оформлено',
    orderAgain: 'Замовити ще',
    added: 'Додано',
  },
  trends: {
    title: 'В тренді',
  },
  auth: {
    title: 'Ваш формат візиту',
    subtitle: 'Оберіть швидкий перегляд або персональний доступ до кабінету.',
    guest: 'Продовжити як гість',
    guestSubtitle: 'Швидкий перегляд послуг і бронювання без акаунта',
    register: 'Реєстрація',
    login: 'Вхід',
    registerTitle: 'Реєстрація',
    registerSubtitle: 'Збережіть свої дані для наступних візитів.',
    loginTitle: 'Вхід до кабінету',
    loginSubtitle: 'Увійдіть, щоб продовжити або відкрити admin panel.',
    continueGuest: 'Перейти як гість',
    createAccount: 'Зареєструватися',
    signIn: 'Увійти',
    firstName: "Ім'я",
    lastName: 'Прізвище',
    phone: 'Номер телефону',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Підтвердіть пароль',
    passwordMismatch: 'Паролі не співпадають.',
    emailExists: 'Користувач з таким email вже існує.',
    invalidCredentials: 'Невірний email або пароль.',
    adminHint: 'Admin demo: admin@tintel.beauty / golden-admin',
    adminDemoTitle: 'Тестовий доступ до адмін панелі',
    useAdminDemo: 'Підставити admin demo',
  },
  admin: {
    title: 'Admin panel',
    subtitle: 'Керуйте структурою салону, каталогами та записами в одному просторі.',
    overview: 'Огляд',
    masters: 'Майстри',
    services: 'Послуги',
    prices: 'Ціни',
    slots: 'Слоти',
    products: 'Продукти',
    drinks: 'Напої',
    trends: 'Тренди',
    bookings: 'Бронювання',
    addNew: 'Додати новий',
    save: 'Зберегти',
    delete: 'Видалити',
    empty: 'Поки що без записів.',
    name: 'Назва',
    role: 'Роль',
    initials: 'Ініціали',
    experience: 'Досвід',
    category: 'Категорія',
    icon: 'Іконка',
    brand: 'Бренд',
    price: 'Ціна',
    duration: 'Тривалість, хв',
    titleUa: 'Назва UA',
    titleDe: 'Назва DE',
    titleGb: 'Назва EN',
    descriptionUa: 'Опис UA',
    descriptionDe: 'Опис DE',
    descriptionGb: 'Опис EN',
    period: 'Період',
    time: 'Час',
    customer: 'Клієнт',
    phone: 'Телефон',
    email: 'Email',
    status: 'Статус',
    note: 'Нотатка',
    noSelection: 'Нічого не вибрано',
    createPrompt: 'Оберіть запис ліворуч або створіть новий.',
    accessDenied: 'Доступ лише для адміністратора',
    accessHint: 'Увійдіть під admin-акаунтом, щоб редагувати дані салону.',
    openMenu: 'Відкрити меню',
    goAuth: 'До входу',
    totalServices: 'Послуг',
    totalBookings: 'Бронювань',
    totalMasters: 'Майстрів',
    totalRevenue: 'Потенційний виторг',
    statusNew: 'Нове',
    statusConfirmed: 'Підтверджено',
    statusCompleted: 'Завершено',
    statusCancelled: 'Скасовано',
  },
  common: {
    back: '← Назад',
    endSession: 'Завершити сеанс',
    start: 'Продовжити',
    language: 'Мова',
    tagline: 'Luxury salon flow',
  },
}

const DE: Dict = {
  menu: {
    title: 'Hauptmenü',
    booking: 'Termin',
    bookingSubtitle: 'Datum, Zeit und Team wählen',
    price: 'Preisliste',
    priceSubtitle: 'Dauer und Preise',
    orderDrink: 'Getränke',
    orderDrinkSubtitle: 'Kaffee, Tee und Wasser',
    orderProduct: 'Pflegeprodukte',
    orderProductSubtitle: 'Produkte für das Home-Ritual',
    trends: 'Trends',
    trendsSubtitle: 'Aktuelle Salon-Looks',
    admin: 'Admin Panel',
    adminSubtitle: 'Salon, Slots und Buchungen verwalten',
    open: 'ÖFFNEN →',
  },
  services: {
    title: 'Leistungen',
    chooseCategory: 'Kategorie wählen',
    chooseService: 'Leistung wählen',
    chooseMaster: 'Teammitglied wählen',
    experience: 'Erfahrung',
  },
  booking: {
    title: 'Termin buchen',
    service: 'Leistung',
    master: 'Stylist',
    dateLabel: 'Datum wählen',
    timeLabel: 'Zeit wählen',
    formTitle: 'Kontaktdaten',
    firstName: 'Vorname',
    lastName: 'Nachname',
    phone: 'Telefon',
    email: 'E-Mail',
    note: 'Notiz',
    confirm: 'Termin bestätigen',
    confirmed: 'Termin bestätigt',
    confirmedSub: 'Die Buchung wurde im Salon-Journal gespeichert.',
    newBooking: 'Neue Buchung',
    morning: 'Morgen',
    afternoon: 'Mittag',
    evening: 'Abend',
    noSlots: 'Noch keine Slots konfiguriert.',
  },
  price: {
    title: 'Preisliste',
  },
  orderDrink: {
    title: 'Getränk bestellen',
    ordered: 'Bestellung erhalten',
    orderAgain: 'Noch einmal bestellen',
    comingSoon: 'wird in Kürze serviert',
    order: 'Bestellen',
  },
  orderProduct: {
    title: 'Pflegeprodukte',
    cart: 'Warenkorb',
    emptyCart: 'Warenkorb ist leer',
    total: 'Gesamt',
    orderNow: 'Bestellen',
    addToCart: 'In den Warenkorb',
    ordered: 'Bestellung aufgegeben',
    orderAgain: 'Noch einmal bestellen',
    added: 'Hinzugefügt',
  },
  trends: {
    title: 'Trends',
  },
  auth: {
    title: 'Ihr Besuchsmodus',
    subtitle: 'Schneller Gastzugang oder persönlicher Account im Luxury-Look.',
    guest: 'Als Gast fortfahren',
    guestSubtitle: 'Sofort browsen und buchen, ohne Konto',
    register: 'Registrieren',
    login: 'Login',
    registerTitle: 'Registrierung',
    registerSubtitle: 'Speichern Sie Ihre Daten für künftige Termine.',
    loginTitle: 'Login',
    loginSubtitle: 'Melden Sie sich an oder öffnen Sie das Admin Panel.',
    continueGuest: 'Als Gast weiter',
    createAccount: 'Konto erstellen',
    signIn: 'Anmelden',
    firstName: 'Vorname',
    lastName: 'Nachname',
    phone: 'Telefonnummer',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    passwordMismatch: 'Die Passwörter stimmen nicht überein.',
    emailExists: 'Ein Konto mit dieser E-Mail existiert bereits.',
    invalidCredentials: 'Ungültige E-Mail oder ungültiges Passwort.',
    adminHint: 'Admin Demo: admin@tintel.beauty / golden-admin',
    adminDemoTitle: 'Testzugang zum Admin Panel',
    useAdminDemo: 'Admin Demo einsetzen',
  },
  admin: {
    title: 'Admin Panel',
    subtitle: 'Pflegen Sie Salonstruktur, Kataloge und Buchungen an einem Ort.',
    overview: 'Überblick',
    masters: 'Team',
    services: 'Leistungen',
    prices: 'Preise',
    slots: 'Slots',
    products: 'Produkte',
    drinks: 'Getränke',
    trends: 'Trends',
    bookings: 'Buchungen',
    addNew: 'Neu anlegen',
    save: 'Speichern',
    delete: 'Löschen',
    empty: 'Noch keine Einträge.',
    name: 'Name',
    role: 'Rolle',
    initials: 'Initialen',
    experience: 'Erfahrung',
    category: 'Kategorie',
    icon: 'Icon',
    brand: 'Marke',
    price: 'Preis',
    duration: 'Dauer, Min',
    titleUa: 'Titel UA',
    titleDe: 'Titel DE',
    titleGb: 'Titel EN',
    descriptionUa: 'Beschreibung UA',
    descriptionDe: 'Beschreibung DE',
    descriptionGb: 'Beschreibung EN',
    period: 'Zeitraum',
    time: 'Uhrzeit',
    customer: 'Kundin',
    phone: 'Telefon',
    email: 'E-Mail',
    status: 'Status',
    note: 'Notiz',
    noSelection: 'Nichts ausgewählt',
    createPrompt: 'Links auswählen oder einen neuen Eintrag anlegen.',
    accessDenied: 'Zugriff nur für Administratoren',
    accessHint: 'Bitte mit dem Admin-Konto anmelden, um Salondaten zu bearbeiten.',
    openMenu: 'Menü öffnen',
    goAuth: 'Zum Login',
    totalServices: 'Leistungen',
    totalBookings: 'Buchungen',
    totalMasters: 'Teammitglieder',
    totalRevenue: 'Potenzial Umsatz',
    statusNew: 'Neu',
    statusConfirmed: 'Bestätigt',
    statusCompleted: 'Abgeschlossen',
    statusCancelled: 'Storniert',
  },
  common: {
    back: '← Zurück',
    endSession: 'Sitzung beenden',
    start: 'Weiter',
    language: 'Sprache',
    tagline: 'Luxury salon flow',
  },
}

const GB: Dict = {
  menu: {
    title: 'Main Menu',
    booking: 'Booking',
    bookingSubtitle: 'Dates, times and stylists',
    price: 'Price List',
    priceSubtitle: 'Durations and prices',
    orderDrink: 'Drinks',
    orderDrinkSubtitle: 'Coffee, tea and water',
    orderProduct: 'Care',
    orderProductSubtitle: 'Take-home salon essentials',
    trends: 'Trends',
    trendsSubtitle: 'Current premium looks',
    admin: 'Admin Panel',
    adminSubtitle: 'Manage salon data and bookings',
    open: 'OPEN →',
  },
  services: {
    title: 'Services',
    chooseCategory: 'Choose a category',
    chooseService: 'Choose a service',
    chooseMaster: 'Choose a master',
    experience: 'experience',
  },
  booking: {
    title: 'Booking',
    service: 'Service',
    master: 'Master',
    dateLabel: 'Choose a date',
    timeLabel: 'Choose a time',
    formTitle: 'Contact details',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone',
    email: 'Email',
    note: 'Note',
    confirm: 'Confirm booking',
    confirmed: 'Booking confirmed',
    confirmedSub: 'Your reservation has been added to the salon journal.',
    newBooking: 'Create another booking',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    noSlots: 'No booking slots configured yet.',
  },
  price: {
    title: 'Price List',
  },
  orderDrink: {
    title: 'Order a Drink',
    ordered: 'Order received',
    orderAgain: 'Order again',
    comingSoon: 'will arrive shortly',
    order: 'Order',
  },
  orderProduct: {
    title: 'Care Products',
    cart: 'Cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    orderNow: 'Checkout',
    addToCart: 'Add to cart',
    ordered: 'Order placed',
    orderAgain: 'Order again',
    added: 'Added',
  },
  trends: {
    title: 'On Trend',
  },
  auth: {
    title: 'Choose your salon flow',
    subtitle: 'Continue as a guest or unlock a personal premium account.',
    guest: 'Continue as Guest',
    guestSubtitle: 'Browse and book immediately without an account',
    register: 'Register',
    login: 'Login',
    registerTitle: 'Create Account',
    registerSubtitle: 'Save your details for future bookings and quicker visits.',
    loginTitle: 'Sign In',
    loginSubtitle: 'Sign in to continue or access the admin workspace.',
    continueGuest: 'Enter as guest',
    createAccount: 'Create account',
    signIn: 'Sign in',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone number',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    passwordMismatch: 'Passwords do not match.',
    emailExists: 'An account with this email already exists.',
    invalidCredentials: 'Invalid email or password.',
    adminHint: 'Admin demo: admin@tintel.beauty / golden-admin',
    adminDemoTitle: 'Admin panel test access',
    useAdminDemo: 'Use admin demo',
  },
  admin: {
    title: 'Admin Panel',
    subtitle: 'Run your salon structure, catalogues and live bookings from one surface.',
    overview: 'Overview',
    masters: 'Masters',
    services: 'Services',
    prices: 'Prices',
    slots: 'Slots',
    products: 'Products',
    drinks: 'Drinks',
    trends: 'Trends',
    bookings: 'Bookings',
    addNew: 'Add new',
    save: 'Save',
    delete: 'Delete',
    empty: 'Nothing here yet.',
    name: 'Name',
    role: 'Role',
    initials: 'Initials',
    experience: 'Experience',
    category: 'Category',
    icon: 'Icon',
    brand: 'Brand',
    price: 'Price',
    duration: 'Duration, min',
    titleUa: 'Title UA',
    titleDe: 'Title DE',
    titleGb: 'Title EN',
    descriptionUa: 'Description UA',
    descriptionDe: 'Description DE',
    descriptionGb: 'Description EN',
    period: 'Period',
    time: 'Time',
    customer: 'Customer',
    phone: 'Phone',
    email: 'Email',
    status: 'Status',
    note: 'Note',
    noSelection: 'Nothing selected',
    createPrompt: 'Pick an item on the left or create a new one.',
    accessDenied: 'Admin access only',
    accessHint: 'Sign in with the admin account to edit salon data.',
    openMenu: 'Open menu',
    goAuth: 'Go to login',
    totalServices: 'Services',
    totalBookings: 'Bookings',
    totalMasters: 'Masters',
    totalRevenue: 'Potential revenue',
    statusNew: 'New',
    statusConfirmed: 'Confirmed',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
  },
  common: {
    back: '← Back',
    endSession: 'End Session',
    start: 'Continue',
    language: 'Language',
    tagline: 'Luxury salon flow',
  },
}

export const DICT: Record<Language, Dict> = { UA, DE, GB }
