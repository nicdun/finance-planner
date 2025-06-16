import { Transaction } from "./types";

// Kategorisierungs-Regeln basierend auf Stichwörtern und Mustern
export interface CategoryRule {
  category: string;
  keywords: string[];
  patterns?: RegExp[];
  priority: number; // Höhere Zahl = höhere Priorität
}

// Verfügbare Kategorien mit deutschen Bezeichnungen
export const CATEGORIES = [
  "Einkommen",
  "Wohnen",
  "Lebensmittel",
  "Transport",
  "Nebenkosten",
  "Unterhaltung",
  "Gesundheit",
  "Kleidung",
  "Bildung",
  "Gastronomie",
  "Shopping",
  "Versicherung",
  "Steuern",
  "Sparen & Investitionen",
  "Abonnements",
  "Sonstiges",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Intelligente Kategorisierungs-Regeln
const CATEGORIZATION_RULES: CategoryRule[] = [
  // Einkommen (höchste Priorität)
  {
    category: "Einkommen",
    keywords: [
      "gehalt",
      "lohn",
      "bonus",
      "rente",
      "pension",
      "honorar",
      "vergütung",
      "sold",
      "besoldung",
    ],
    priority: 100,
  },

  // Wohnen
  {
    category: "Wohnen",
    keywords: [
      "miete",
      "hausverwaltung",
      "wohnung",
      "apartment",
      "immobilie",
      "nebenkosten",
      "heizung",
      "warmmiete",
      "kaltmiete",
    ],
    patterns: [/miete/i, /wohnung/i, /hausverwaltung/i],
    priority: 90,
  },

  // Lebensmittel
  {
    category: "Lebensmittel",
    keywords: [
      "rewe",
      "edeka",
      "aldi",
      "lidl",
      "netto",
      "penny",
      "kaufland",
      "real",
      "supermarkt",
      "lebensmittel",
      "bäckerei",
      "metzgerei",
      "bio",
      "organic",
      "dm",
      "rossmann",
      "drogerie",
    ],
    priority: 85,
  },

  // Transport
  {
    category: "Transport",
    keywords: [
      "tankstelle",
      "shell",
      "aral",
      "esso",
      "total",
      "jet",
      "bft",
      "deutsche bahn",
      "db",
      "hvv",
      "mvg",
      "bvg",
      "vvs",
      "vrr",
      "uber",
      "taxi",
      "öpnv",
      "nahverkehr",
      "fahrschein",
      "ticket",
      "auto",
      "werkstatt",
      "reparatur",
      "tüv",
      "kfz",
    ],
    priority: 80,
  },

  // Abonnements (hohe Priorität für Erkennbarkeit)
  {
    category: "Abonnements",
    keywords: [
      "netflix",
      "spotify",
      "amazon prime",
      "disney+",
      "apple music",
      "youtube premium",
      "sky",
      "dazn",
      "adobe",
      "microsoft",
      "office 365",
      "icloud",
      "dropbox",
      "google",
      "abo",
      "abonnement",
      "subscription",
    ],
    priority: 88,
  },

  // Unterhaltung
  {
    category: "Unterhaltung",
    keywords: [
      "kino",
      "theater",
      "konzert",
      "festival",
      "museum",
      "zoo",
      "freizeitpark",
      "bowling",
      "minigolf",
      "escape room",
      "gaming",
      "steam",
      "playstation",
      "xbox",
      "nintendo",
      "app store",
      "google play",
    ],
    priority: 70,
  },

  // Nebenkosten/Utilities
  {
    category: "Nebenkosten",
    keywords: [
      "strom",
      "gas",
      "wasser",
      "abwasser",
      "müll",
      "stadtwerke",
      "e.on",
      "rwe",
      "vattenfall",
      "engie",
      "innogy",
      "telefon",
      "internet",
      "telekom",
      "vodafone",
      "o2",
      "1&1",
      "unitymedia",
      "kabel deutschland",
    ],
    priority: 85,
  },

  // Gesundheit
  {
    category: "Gesundheit",
    keywords: [
      "apotheke",
      "arzt",
      "zahnarzt",
      "krankenhaus",
      "klinik",
      "physiotherapie",
      "massage",
      "fitness",
      "mcfit",
      "fitnessstudio",
      "medikament",
      "rezept",
      "brille",
      "optiker",
      "hörgerät",
    ],
    priority: 75,
  },

  // Versicherung
  {
    category: "Versicherung",
    keywords: [
      "versicherung",
      "allianz",
      "axa",
      "generali",
      "huk",
      "devk",
      "ergo",
      "signal iduna",
      "debeka",
      "haftpflicht",
      "kasko",
      "krankenversicherung",
      "lebensversicherung",
      "hausrat",
    ],
    priority: 82,
  },

  // Gastronomie
  {
    category: "Gastronomie",
    keywords: [
      "restaurant",
      "café",
      "coffee",
      "starbucks",
      "mcdonald",
      "burger king",
      "kfc",
      "subway",
      "pizza",
      "döner",
      "sushi",
      "lieferando",
      "deliveroo",
      "uber eats",
      "food",
      "essen",
      "trinken",
    ],
    priority: 60,
  },

  // Shopping
  {
    category: "Shopping",
    keywords: [
      "amazon",
      "zalando",
      "otto",
      "ebay",
      "media markt",
      "saturn",
      "ikea",
      "möbel",
      "elektronik",
      "kleidung",
      "schuhe",
      "fashion",
      "online",
      "shop",
      "kaufen",
      "bestellen",
    ],
    priority: 50,
  },

  // Bildung
  {
    category: "Bildung",
    keywords: [
      "universität",
      "hochschule",
      "schule",
      "kurs",
      "seminar",
      "weiterbildung",
      "udemy",
      "coursera",
      "sprachkurs",
      "fahrschule",
      "nachhilfe",
      "studium",
      "ausbildung",
      "fortbildung",
    ],
    priority: 77,
  },

  // Steuern
  {
    category: "Steuern",
    keywords: [
      "finanzamt",
      "steuer",
      "einkommensteuer",
      "lohnsteuer",
      "umsatzsteuer",
      "gewerbesteuer",
      "kirchensteuer",
      "solidaritätszuschlag",
      "tax",
    ],
    priority: 95,
  },
];

// Hauptfunktion für automatische Kategorisierung
export function categorizeTransaction(transaction: Transaction): string {
  const description = transaction.description.toLowerCase();
  const amount = transaction.amount;

  // Spezialfall: Positive Beträge sind oft Einkommen
  if (amount > 0 && amount > 1000) {
    const incomeRule = CATEGORIZATION_RULES.find(
      (rule) => rule.category === "Einkommen"
    );
    if (
      incomeRule &&
      incomeRule.keywords.some((keyword) => description.includes(keyword))
    ) {
      return "Einkommen";
    }
  }

  // Finde die beste Kategorie basierend auf Regeln
  let bestMatch: { category: string; confidence: number } = {
    category: "Sonstiges",
    confidence: 0,
  };

  for (const rule of CATEGORIZATION_RULES) {
    let confidence = 0;
    let matches = 0;

    // Prüfe Keywords
    for (const keyword of rule.keywords) {
      if (description.includes(keyword.toLowerCase())) {
        matches++;
        confidence += rule.priority;
      }
    }

    // Prüfe RegExp-Patterns falls vorhanden
    if (rule.patterns) {
      for (const pattern of rule.patterns) {
        if (pattern.test(description)) {
          matches++;
          confidence += rule.priority * 1.2; // Bonus für Pattern-Matches
        }
      }
    }

    // Berechne finale Confidence (gewichtet nach Anzahl Matches)
    if (matches > 0) {
      confidence = confidence * Math.log(matches + 1); // Logarithmische Gewichtung

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category: rule.category,
          confidence,
        };
      }
    }
  }

  return bestMatch.category;
}

// Batch-Kategorisierung für mehrere Transaktionen
export function categorizeTransactions(
  transactions: Transaction[]
): Transaction[] {
  return transactions.map((transaction) => ({
    ...transaction,
    category: categorizeTransaction(transaction),
  }));
}

// Ähnlichkeitsprüfung für Lernfunktion
export function findSimilarTransactions(
  targetTransaction: Transaction,
  allTransactions: Transaction[]
): Transaction[] {
  const targetDesc = targetTransaction.description.toLowerCase();
  const words = targetDesc.split(/\s+/);

  return allTransactions
    .filter((t) => t.id !== targetTransaction.id)
    .map((transaction) => {
      const desc = transaction.description.toLowerCase();
      let similarity = 0;

      // Wort-basierte Ähnlichkeit
      for (const word of words) {
        if (word.length > 2 && desc.includes(word)) {
          similarity++;
        }
      }

      // Levenshtein-Distanz für ähnliche Strings
      const distance = levenshteinDistance(targetDesc, desc);
      const maxLength = Math.max(targetDesc.length, desc.length);
      const stringsimilarity = 1 - distance / maxLength;

      return {
        transaction,
        similarity: similarity + stringsimilarity * 2,
      };
    })
    .filter((item) => item.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map((item) => item.transaction);
}

// Hilfsfunktion: Levenshtein-Distanz
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Lern-Funktion: Nutzer-Korrekturen lernen
export class CategorizationLearner {
  private userCorrections: Map<string, string> = new Map();

  // Speichere Nutzer-Korrektur
  learnFromCorrection(description: string, correctedCategory: string) {
    const key = description.toLowerCase().trim();
    this.userCorrections.set(key, correctedCategory);
  }

  // Wende gelernte Korrekturen an
  applyCorrectionLearning(transaction: Transaction): string {
    const key = transaction.description.toLowerCase().trim();

    // Exact Match
    if (this.userCorrections.has(key)) {
      return this.userCorrections.get(key)!;
    }

    // Partial Match für ähnliche Beschreibungen
    for (const [learnedDesc, category] of this.userCorrections.entries()) {
      if (learnedDesc.length > 5 && key.includes(learnedDesc)) {
        return category;
      }
      if (key.length > 5 && learnedDesc.includes(key)) {
        return category;
      }
    }

    // Falls keine Übereinstimmung, nutze Standard-Kategorisierung
    return categorizeTransaction(transaction);
  }

  // Exportiere gelernte Daten (für Persistierung)
  exportLearningData(): Record<string, string> {
    return Object.fromEntries(this.userCorrections);
  }

  // Importiere gelernte Daten
  importLearningData(data: Record<string, string>) {
    this.userCorrections = new Map(Object.entries(data));
  }
}

// Globale Learner-Instanz
export const categorizationLearner = new CategorizationLearner();
