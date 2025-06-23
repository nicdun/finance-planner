// Application Constants
export const APP_CONFIG = {
  NAME: "FinanzPlaner",
  VERSION: "1.0.0",
  DESCRIPTION: "Intelligente Finanzverwaltung",
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 0.3,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const;

// Transaction Categories
export const TRANSACTION_CATEGORIES = [
  "Lebensmittel",
  "Transport",
  "Wohnen",
  "Unterhaltung",
  "Gesundheit",
  "Bildung",
  "Shopping",
  "Reisen",
  "Sparen",
  "Sonstiges",
] as const;

// Account Types
export const ACCOUNT_TYPES = {
  CHECKING: "checking",
  SAVINGS: "savings",
  CREDIT: "credit",
  INVESTMENT: "investment",
} as const;

// Budget Periods
export const BUDGET_PERIODS = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

// Currencies
export const CURRENCIES = {
  EUR: "EUR",
  USD: "USD",
  GBP: "GBP",
} as const;

// Colors for charts and UI
export const CHART_COLORS = [
  "#10b981", // Green
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
] as const;

// Validation Rules
export const VALIDATION_RULES = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: "dd.MM.yyyy",
  LONG: "dd. MMMM yyyy",
  WITH_TIME: "dd.MM.yyyy HH:mm",
  ISO: "yyyy-MM-dd",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "Ein unbekannter Fehler ist aufgetreten",
  NETWORK: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
  UNAUTHORIZED: "Sie sind nicht berechtigt, diese Aktion auszuführen",
  NOT_FOUND: "Der angeforderte Datensatz wurde nicht gefunden",
  VALIDATION: "Die eingegebenen Daten sind ungültig",
  SERVER: "Serverfehler. Bitte versuchen Sie es später erneut",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Erfolgreich erstellt",
  UPDATED: "Erfolgreich aktualisiert",
  DELETED: "Erfolgreich gelöscht",
  SAVED: "Erfolgreich gespeichert",
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  TIP: "tip",
  BUDGET_ALERT: "budget_alert",
  GOAL_REMINDER: "goal_reminder",
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
