import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import React__default, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { m as mockAccounts, a as mockTransactions, S as Separator, B as BankConnection, A as Avatar, b as AvatarFallback, I as Input, L as Label } from './BankConnection-BzYEi_Co.mjs';
import { f as Button, C as Card, e as CardContent, a as CardHeader, b as CardTitle, B as Badge, d as CardDescription, c as cn } from './ssr.mjs';
import { Home, Bell, Settings, User, ArrowUpCircle, ArrowDownCircle, ArrowUpDown, Wand2, Search, Filter, Tag, Building, Calendar, DollarSign, X, BarChart3, Sparkles, CheckCircle, AlertTriangle, Zap, Brain, EyeOff, Eye, MoreHorizontal, Copy, Edit, Trash2, ChevronDownIcon, CheckIcon, ShoppingCart, Utensils, Gamepad2, Car, HomeIcon, Edit3, ArrowRight, BookOpen, AlertCircle, Check, ChevronUpIcon } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import '@radix-ui/react-separator';
import '@radix-ui/react-avatar';
import 'node:fs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'node:async_hooks';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}
const CATEGORIES = [
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
  "Sonstiges"
];
const CATEGORIZATION_RULES = [
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
      "verg\xFCtung",
      "sold",
      "besoldung"
    ],
    priority: 100
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
      "kaltmiete"
    ],
    patterns: [/miete/i, /wohnung/i, /hausverwaltung/i],
    priority: 90
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
      "b\xE4ckerei",
      "metzgerei",
      "bio",
      "organic",
      "dm",
      "rossmann",
      "drogerie"
    ],
    priority: 85
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
      "\xF6pnv",
      "nahverkehr",
      "fahrschein",
      "ticket",
      "auto",
      "werkstatt",
      "reparatur",
      "t\xFCv",
      "kfz"
    ],
    priority: 80
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
      "subscription"
    ],
    priority: 88
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
      "google play"
    ],
    priority: 70
  },
  // Nebenkosten/Utilities
  {
    category: "Nebenkosten",
    keywords: [
      "strom",
      "gas",
      "wasser",
      "abwasser",
      "m\xFCll",
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
      "kabel deutschland"
    ],
    priority: 85
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
      "h\xF6rger\xE4t"
    ],
    priority: 75
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
      "hausrat"
    ],
    priority: 82
  },
  // Gastronomie
  {
    category: "Gastronomie",
    keywords: [
      "restaurant",
      "caf\xE9",
      "coffee",
      "starbucks",
      "mcdonald",
      "burger king",
      "kfc",
      "subway",
      "pizza",
      "d\xF6ner",
      "sushi",
      "lieferando",
      "deliveroo",
      "uber eats",
      "food",
      "essen",
      "trinken"
    ],
    priority: 60
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
      "m\xF6bel",
      "elektronik",
      "kleidung",
      "schuhe",
      "fashion",
      "online",
      "shop",
      "kaufen",
      "bestellen"
    ],
    priority: 50
  },
  // Bildung
  {
    category: "Bildung",
    keywords: [
      "universit\xE4t",
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
      "fortbildung"
    ],
    priority: 77
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
      "solidarit\xE4tszuschlag",
      "tax"
    ],
    priority: 95
  }
];
function categorizeTransaction(transaction) {
  const description = transaction.description.toLowerCase();
  const amount = transaction.amount;
  if (amount > 0 && amount > 1e3) {
    const incomeRule = CATEGORIZATION_RULES.find(
      (rule) => rule.category === "Einkommen"
    );
    if (incomeRule && incomeRule.keywords.some((keyword) => description.includes(keyword))) {
      return "Einkommen";
    }
  }
  let bestMatch = {
    category: "Sonstiges",
    confidence: 0
  };
  for (const rule of CATEGORIZATION_RULES) {
    let confidence = 0;
    let matches = 0;
    for (const keyword of rule.keywords) {
      if (description.includes(keyword.toLowerCase())) {
        matches++;
        confidence += rule.priority;
      }
    }
    if (rule.patterns) {
      for (const pattern of rule.patterns) {
        if (pattern.test(description)) {
          matches++;
          confidence += rule.priority * 1.2;
        }
      }
    }
    if (matches > 0) {
      confidence = confidence * Math.log(matches + 1);
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category: rule.category,
          confidence
        };
      }
    }
  }
  return bestMatch.category;
}
function findSimilarTransactions(targetTransaction, allTransactions) {
  const targetDesc = targetTransaction.description.toLowerCase();
  const words = targetDesc.split(/\s+/);
  return allTransactions.filter((t) => t.id !== targetTransaction.id).map((transaction) => {
    const desc = transaction.description.toLowerCase();
    let similarity = 0;
    for (const word of words) {
      if (word.length > 2 && desc.includes(word)) {
        similarity++;
      }
    }
    const distance = levenshteinDistance(targetDesc, desc);
    const maxLength = Math.max(targetDesc.length, desc.length);
    const stringsimilarity = 1 - distance / maxLength;
    return {
      transaction,
      similarity: similarity + stringsimilarity * 2
    };
  }).filter((item) => item.similarity > 0.3).sort((a, b) => b.similarity - a.similarity).slice(0, 5).map((item) => item.transaction);
}
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        // deletion
        matrix[j - 1][i] + 1,
        // insertion
        matrix[j - 1][i - 1] + indicator
        // substitution
      );
    }
  }
  return matrix[str2.length][str1.length];
}
class CategorizationLearner {
  constructor() {
    __publicField(this, "userCorrections", /* @__PURE__ */ new Map());
  }
  // Speichere Nutzer-Korrektur
  learnFromCorrection(description, correctedCategory) {
    const key = description.toLowerCase().trim();
    this.userCorrections.set(key, correctedCategory);
  }
  // Wende gelernte Korrekturen an
  applyCorrectionLearning(transaction) {
    const key = transaction.description.toLowerCase().trim();
    if (this.userCorrections.has(key)) {
      return this.userCorrections.get(key);
    }
    for (const [learnedDesc, category] of this.userCorrections.entries()) {
      if (learnedDesc.length > 5 && key.includes(learnedDesc)) {
        return category;
      }
      if (key.length > 5 && learnedDesc.includes(key)) {
        return category;
      }
    }
    return categorizeTransaction(transaction);
  }
  // Exportiere gelernte Daten (für Persistierung)
  exportLearningData() {
    return Object.fromEntries(this.userCorrections);
  }
  // Importiere gelernte Daten
  importLearningData(data) {
    this.userCorrections = new Map(Object.entries(data));
  }
}
const categorizationLearner = new CategorizationLearner();
function BulkCategorizationPanel({
  transactions,
  onBulkCategorize,
  onClose
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const categorizationPreviews = useMemo(() => {
    return transactions.map((transaction) => {
      const suggestedCategory = categorizeTransaction(transaction);
      const isChanged = suggestedCategory !== transaction.category;
      let confidence = "low";
      const description = transaction.description.toLowerCase();
      if (description.includes("gehalt") || description.includes("miete") || description.includes("netflix") || description.includes("rewe") || description.includes("sparkasse") || description.includes("tankstelle")) {
        confidence = "high";
      } else if (suggestedCategory !== "Sonstiges" && isChanged) {
        confidence = "medium";
      }
      return {
        transaction,
        suggestedCategory,
        confidence,
        isChanged
      };
    });
  }, [transactions]);
  const changedTransactions = categorizationPreviews.filter((p) => p.isChanged);
  const highConfidenceChanges = changedTransactions.filter(
    (p) => p.confidence === "high"
  );
  changedTransactions.filter(
    (p) => p.confidence === "medium"
  );
  const lowConfidenceChanges = changedTransactions.filter(
    (p) => p.confidence === "low"
  );
  const categoryStats = useMemo(() => {
    const stats = /* @__PURE__ */ new Map();
    changedTransactions.forEach((p) => {
      stats.set(p.suggestedCategory, (stats.get(p.suggestedCategory) || 0) + 1);
    });
    return Array.from(stats.entries()).sort(([, a], [, b]) => b - a).slice(0, 5);
  }, [changedTransactions]);
  const handleAutoApply = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const updatedTransactions = transactions.map((transaction) => {
      const preview = categorizationPreviews.find(
        (p) => p.transaction.id === transaction.id
      );
      if (preview == null ? void 0 : preview.isChanged) {
        return {
          ...transaction,
          category: preview.suggestedCategory
        };
      }
      return transaction;
    });
    changedTransactions.forEach((p) => {
      categorizationLearner.learnFromCorrection(
        p.transaction.description,
        p.suggestedCategory
      );
    });
    onBulkCategorize(updatedTransactions);
    setIsProcessing(false);
  };
  const handleSelectiveApply = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    const updatedTransactions = transactions.map((transaction) => {
      if (selectedPreviews.includes(transaction.id)) {
        const preview = categorizationPreviews.find(
          (p) => p.transaction.id === transaction.id
        );
        if (preview == null ? void 0 : preview.isChanged) {
          return {
            ...transaction,
            category: preview.suggestedCategory
          };
        }
      }
      return transaction;
    });
    selectedPreviews.forEach((id) => {
      const preview = categorizationPreviews.find(
        (p) => p.transaction.id === id
      );
      if (preview == null ? void 0 : preview.isChanged) {
        categorizationLearner.learnFromCorrection(
          preview.transaction.description,
          preview.suggestedCategory
        );
      }
    });
    onBulkCategorize(updatedTransactions);
    setIsProcessing(false);
  };
  const togglePreviewSelection = (transactionId) => {
    setSelectedPreviews(
      (prev) => prev.includes(transactionId) ? prev.filter((id) => id !== transactionId) : [...prev, transactionId]
    );
  };
  const selectAllHighConfidence = () => {
    const highConfidenceIds = highConfidenceChanges.map(
      (p) => p.transaction.id
    );
    setSelectedPreviews(highConfidenceIds);
  };
  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };
  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Wand2, { className: "h-6 w-6 text-blue-600" }),
            "Intelligente Kategorisierung"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Nutzen Sie KI, um Ihre Transaktionen automatisch zu kategorisieren" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(BarChart3, { className: "h-8 w-8 text-blue-600" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Transaktionen" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: transactions.length })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-8 w-8 text-yellow-600" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Vorschl\xE4ge" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-600", children: changedTransactions.length })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-8 w-8 text-green-600" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Hohe Genauigkeit" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: highConfidenceChanges.length })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 text-red-600" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Pr\xFCfung n\xF6tig" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-red-600", children: lowConfidenceChanges.length })
            ] })
          ] }) }) })
        ] }),
        categoryStats.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Kategorien-\xDCbersicht" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Die h\xE4ufigsten vorgeschlagenen Kategorien" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: categoryStats.map(([category, count]) => /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "px-3 py-1", children: [
            category,
            " (",
            count,
            ")"
          ] }, category)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: handleAutoApply,
              disabled: isProcessing || changedTransactions.length === 0,
              className: "flex-1",
              children: isProcessing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 mr-2 animate-spin" }),
                "Verarbeite..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4 mr-2" }),
                "Alle Vorschl\xE4ge anwenden (",
                changedTransactions.length,
                ")"
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setShowPreview(!showPreview),
              className: "flex-1",
              children: showPreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4 mr-2" }),
                "Vorschau ausblenden"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
                "Vorschau anzeigen"
              ] })
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: onClose, className: "flex-1", children: "Abbrechen" })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: showPreview && changedTransactions.length > 0 && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "space-y-4",
            children: /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: "Kategorisierungs-Vorschau" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: selectAllHighConfidence,
                      disabled: highConfidenceChanges.length === 0,
                      children: "Alle hohen Genauigkeiten ausw\xE4hlen"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      onClick: handleSelectiveApply,
                      disabled: selectedPreviews.length === 0 || isProcessing,
                      children: [
                        "Ausgew\xE4hlte anwenden (",
                        selectedPreviews.length,
                        ")"
                      ]
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: changedTransactions.map((preview) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  className: `flex items-center justify-between p-3 border rounded-lg transition-all ${selectedPreviews.includes(preview.transaction.id) ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          checked: selectedPreviews.includes(
                            preview.transaction.id
                          ),
                          onCheckedChange: () => togglePreviewSelection(preview.transaction.id)
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: preview.transaction.description }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: preview.transaction.amount.toLocaleString(
                          "de-DE",
                          {
                            style: "currency",
                            currency: "EUR"
                          }
                        ) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: preview.transaction.category }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "\u2192" }),
                      /* @__PURE__ */ jsx(
                        Badge,
                        {
                          variant: "secondary",
                          className: `text-xs ${getConfidenceBadge(
                            preview.confidence
                          )}`,
                          children: preview.suggestedCategory
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs ${getConfidenceColor(
                            preview.confidence
                          )}`,
                          children: preview.confidence === "high" ? "Sicher" : preview.confidence === "medium" ? "Wahrscheinlich" : "Unsicher"
                        }
                      )
                    ] })
                  ]
                },
                preview.transaction.id
              )) }) })
            ] })
          }
        ) })
      ]
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
function CategoryEditor({
  transaction,
  allTransactions,
  onCategoryChange,
  onBulkCategoryChange
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    transaction.category
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const suggestedCategory = categorizeTransaction(transaction);
  const isAutoSuggested = suggestedCategory !== transaction.category;
  const similarTransactions = findSimilarTransactions(
    transaction,
    allTransactions
  );
  const handleSave = () => {
    if (selectedCategory !== transaction.category) {
      onCategoryChange(transaction.id, selectedCategory);
      categorizationLearner.learnFromCorrection(
        transaction.description,
        selectedCategory
      );
    }
    setIsEditing(false);
    setShowSuggestions(false);
    setShowSimilar(false);
  };
  const handleCancel = () => {
    setSelectedCategory(transaction.category);
    setIsEditing(false);
    setShowSuggestions(false);
    setShowSimilar(false);
  };
  const handleApplySuggestion = () => {
    setSelectedCategory(suggestedCategory);
    setShowSuggestions(false);
  };
  const handleBulkApply = (category) => {
    if (onBulkCategoryChange && similarTransactions.length > 0) {
      const transactionIds = [
        transaction.id,
        ...similarTransactions.map((t) => t.id)
      ];
      onBulkCategoryChange(transactionIds, category);
      [transaction, ...similarTransactions].forEach((t) => {
        categorizationLearner.learnFromCorrection(t.description, category);
      });
    }
    setIsEditing(false);
    setShowSimilar(false);
  };
  if (!isEditing) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Badge,
        {
          variant: "secondary",
          className: getCategoryColor(transaction.category),
          children: transaction.category
        }
      ),
      isAutoSuggested && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setShowSuggestions(true),
          className: "text-xs text-blue-600 hover:text-blue-700 p-1 h-auto",
          title: "Automatische Kategorisierung verf\xFCgbar",
          children: /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setIsEditing(true),
          className: "text-xs text-gray-500 hover:text-gray-700 p-1 h-auto",
          title: "Kategorie bearbeiten",
          children: /* @__PURE__ */ jsx(Edit3, { className: "h-3 w-3" })
        }
      ),
      /* @__PURE__ */ jsx(AnimatePresence, { children: showSuggestions && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95, y: -10 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: -10 },
          className: "absolute z-50 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4 text-blue-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Automatische Kategorisierung" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-3", children: "Basierend auf der Beschreibung schlagen wir vor:" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-800", children: suggestedCategory }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 text-gray-400" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-600", children: [
                "statt ",
                transaction.category
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  onClick: handleApplySuggestion,
                  className: "text-xs",
                  children: "Anwenden"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setShowSuggestions(false),
                  className: "text-xs",
                  children: "Ignorieren"
                }
              )
            ] })
          ]
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      className: "space-y-3 p-3 bg-gray-50 rounded-lg border",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "Kategorie bearbeiten" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setShowSimilar(!showSimilar),
              className: "text-xs",
              disabled: similarTransactions.length === 0,
              children: [
                /* @__PURE__ */ jsx(BookOpen, { className: "h-3 w-3 mr-1" }),
                "\xC4hnliche (",
                similarTransactions.length,
                ")"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedCategory,
            onValueChange: (value) => setSelectedCategory(value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Kategorie ausw\xE4hlen" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: CATEGORIES.map((category) => /* @__PURE__ */ jsx(SelectItem, { value: category, children: category }, category)) })
            ]
          }
        ) }),
        isAutoSuggested && selectedCategory === transaction.category && /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            className: "flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md",
            children: [
              /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4 text-blue-600" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-blue-700", children: [
                "Empfehlung: ",
                /* @__PURE__ */ jsx("strong", { children: suggestedCategory })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setSelectedCategory(suggestedCategory),
                  className: "text-xs text-blue-600 ml-auto",
                  children: "\xDCbernehmen"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: showSimilar && similarTransactions.length > 0 && /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "space-y-2",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3" }),
                "\xC4hnliche Transaktionen gefunden"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-32 overflow-y-auto", children: similarTransactions.slice(0, 3).map((similar) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between p-2 bg-white border border-gray-100 rounded text-xs",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate flex-1", children: similar.description }),
                    /* @__PURE__ */ jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: `${getCategoryColor(similar.category)} text-xs`,
                        children: similar.category
                      }
                    )
                  ]
                },
                similar.id
              )) }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => handleBulkApply(selectedCategory),
                  className: "text-xs w-full",
                  disabled: !onBulkCategoryChange,
                  children: [
                    /* @__PURE__ */ jsx(BookOpen, { className: "h-3 w-3 mr-1" }),
                    "Auf alle \xE4hnlichen anwenden (",
                    similarTransactions.length + 1,
                    ")"
                  ]
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2 border-t border-gray-200", children: [
          /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleSave, className: "flex-1 text-xs", children: [
            /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 mr-1" }),
            "Speichern"
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleCancel,
              className: "flex-1 text-xs",
              children: [
                /* @__PURE__ */ jsx(X, { className: "h-3 w-3 mr-1" }),
                "Abbrechen"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function getCategoryColor(category) {
  const colors = {
    Einkommen: "bg-green-100 text-green-800",
    Wohnen: "bg-blue-100 text-blue-800",
    Lebensmittel: "bg-orange-100 text-orange-800",
    Transport: "bg-purple-100 text-purple-800",
    Nebenkosten: "bg-yellow-100 text-yellow-800",
    Unterhaltung: "bg-pink-100 text-pink-800",
    Gesundheit: "bg-red-100 text-red-800",
    Kleidung: "bg-indigo-100 text-indigo-800",
    Bildung: "bg-cyan-100 text-cyan-800",
    Gastronomie: "bg-red-100 text-red-800",
    Shopping: "bg-indigo-100 text-indigo-800",
    Versicherung: "bg-gray-100 text-gray-800",
    Steuern: "bg-red-100 text-red-800",
    "Sparen & Investitionen": "bg-green-100 text-green-800",
    Abonnements: "bg-purple-100 text-purple-800",
    Sonstiges: "bg-gray-100 text-gray-800"
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}
const categoryIcons = {
  Einkommen: /* @__PURE__ */ jsx(ArrowUpCircle, { className: "h-4 w-4 text-green-600" }),
  Wohnen: /* @__PURE__ */ jsx(HomeIcon, { className: "h-4 w-4 text-blue-600" }),
  Lebensmittel: /* @__PURE__ */ jsx(Utensils, { className: "h-4 w-4 text-orange-600" }),
  Transport: /* @__PURE__ */ jsx(Car, { className: "h-4 w-4 text-purple-600" }),
  Nebenkosten: /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 text-yellow-600" }),
  Unterhaltung: /* @__PURE__ */ jsx(Gamepad2, { className: "h-4 w-4 text-pink-600" }),
  Transfer: /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-4 w-4 text-gray-600" }),
  Gastronomie: /* @__PURE__ */ jsx(Utensils, { className: "h-4 w-4 text-red-600" }),
  Shopping: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 text-indigo-600" })
};
const categoryColors = {
  Einkommen: "bg-green-100 text-green-800",
  Wohnen: "bg-blue-100 text-blue-800",
  Lebensmittel: "bg-orange-100 text-orange-800",
  Transport: "bg-purple-100 text-purple-800",
  Nebenkosten: "bg-yellow-100 text-yellow-800",
  Unterhaltung: "bg-pink-100 text-pink-800",
  Transfer: "bg-gray-100 text-gray-800",
  Gastronomie: "bg-red-100 text-red-800",
  Shopping: "bg-indigo-100 text-indigo-800",
  Gesundheit: "bg-red-100 text-red-800",
  Kleidung: "bg-indigo-100 text-indigo-800",
  Bildung: "bg-cyan-100 text-cyan-800",
  Versicherung: "bg-gray-100 text-gray-800",
  Steuern: "bg-red-100 text-red-800",
  "Sparen & Investitionen": "bg-green-100 text-green-800",
  Abonnements: "bg-purple-100 text-purple-800",
  Sonstiges: "bg-gray-100 text-gray-800"
};
function TransactionTable({
  transactions,
  accounts,
  onSort,
  sortField = "date",
  sortDirection = "desc",
  onCategoryChange,
  onBulkCategoryChange
}) {
  const formatAmount = (amount) => {
    const isPositive = amount > 0;
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`,
        children: [
          isPositive ? "+" : "",
          amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
        ]
      }
    );
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const getAccountName = (accountId) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return (account == null ? void 0 : account.name) || "Unbekanntes Konto";
  };
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };
  const getSortIcon = (field) => {
    if (sortField === field) {
      return /* @__PURE__ */ jsx(ArrowUpDown, { className: "ml-2 h-4 w-4" });
    }
    return null;
  };
  return /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "w-[50px]" }),
      /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          onClick: () => handleSort("description"),
          className: "h-auto p-0 font-semibold",
          children: [
            "Beschreibung",
            getSortIcon("description")
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          onClick: () => handleSort("category"),
          className: "h-auto p-0 font-semibold",
          children: [
            "Kategorie",
            getSortIcon("category")
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TableHead, { children: "Konto" }),
      /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          onClick: () => handleSort("date"),
          className: "h-auto p-0 font-semibold",
          children: [
            "Datum",
            getSortIcon("date")
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          onClick: () => handleSort("amount"),
          className: "h-auto p-0 font-semibold",
          children: [
            "Betrag",
            getSortIcon("amount")
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[50px]" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: transactions.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-lg", children: "\u{1F4CA}" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-600", children: "Keine Transaktionen gefunden" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Versuchen Sie andere Suchbegriffe oder Filter." })
    ] }) }) }) : transactions.map((transaction, index) => /* @__PURE__ */ jsxs(
      motion.tr,
      {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, delay: index * 0.02 },
        className: "group hover:bg-gray-50 transition-colors",
        children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-full bg-gray-100", children: categoryIcons[transaction.category] || /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-4 w-4 text-gray-600" }) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900", children: transaction.description }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: transaction.type === "income" ? "Einnahme" : "Ausgabe" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: onCategoryChange ? /* @__PURE__ */ jsx(
            CategoryEditor,
            {
              transaction,
              allTransactions: transactions,
              onCategoryChange,
              onBulkCategoryChange
            }
          ) : /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: categoryColors[transaction.category] || "bg-gray-100 text-gray-800",
              children: transaction.category
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-gray-600", children: getAccountName(transaction.accountId) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-gray-600", children: formatDate(transaction.date) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: formatAmount(transaction.amount) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "ghost",
                className: "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Aktionen \xF6ffnen" }),
                  /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aktionen" }),
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: () => navigator.clipboard.writeText(transaction.id),
                  children: [
                    /* @__PURE__ */ jsx(Copy, { className: "mr-2 h-4 w-4" }),
                    "ID kopieren"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { children: [
                /* @__PURE__ */ jsx(Edit, { className: "mr-2 h-4 w-4" }),
                "Bearbeiten"
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-red-600", children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "L\xF6schen"
              ] })
            ] })
          ] }) })
        ]
      },
      transaction.id
    )) })
  ] }) });
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function TransactionFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAccount,
  onAccountChange,
  categories,
  accounts,
  onClearFilters
}) {
  const activeFiltersCount = [selectedCategory, selectedAccount].filter(
    Boolean
  ).length;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "Suche nach Beschreibung oder Kategorie...",
          value: searchTerm,
          onChange: (e) => onSearchChange(e.target.value),
          className: "pl-10"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs(Popover, { children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
        "Erweiterte Filter",
        activeFiltersCount > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-2", children: activeFiltersCount })
      ] }) }),
      /* @__PURE__ */ jsx(PopoverContent, { className: "w-80", align: "end", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium leading-none", children: "Filter" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Verfeinern Sie Ihre Transaktionssuche" })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
            "Kategorie"
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: selectedCategory, onValueChange: onCategoryChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Alle Kategorien" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "", children: "Alle Kategorien" }),
              categories.map((category) => /* @__PURE__ */ jsx(SelectItem, { value: category, children: category }, category))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Building, { className: "h-4 w-4" }),
            "Konto"
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: selectedAccount, onValueChange: onAccountChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Alle Konten" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "", children: "Alle Konten" }),
              accounts.map((account) => /* @__PURE__ */ jsx(SelectItem, { value: account.id, children: account.name }, account.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
            "Zeitraum"
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "w-full justify-start",
              disabled: true,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                "Zeitraum ausw\xE4hlen (Bald verf\xFCgbar)"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }),
            "Betrag"
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "w-full justify-start",
              disabled: true,
              children: [
                /* @__PURE__ */ jsx(DollarSign, { className: "mr-2 h-4 w-4" }),
                "Betragsbereich (Bald verf\xFCgbar)"
              ]
            }
          )
        ] }),
        activeFiltersCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              onClick: onClearFilters,
              className: "w-full",
              children: [
                /* @__PURE__ */ jsx(X, { className: "mr-2 h-4 w-4" }),
                "Alle Filter zur\xFCcksetzen"
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
      "Export"
    ] }) })
  ] });
}
const enhancedTransactions = [
  ...mockTransactions,
  // Streaming & Abonnements
  {
    id: "6",
    accountId: "1",
    amount: -13.99,
    description: "Netflix Streaming",
    category: "Sonstiges",
    // Wird automatisch als "Abonnements" kategorisiert
    date: "2024-01-06",
    type: "expense"
  },
  {
    id: "7",
    accountId: "1",
    amount: -9.99,
    description: "Spotify Premium",
    category: "Sonstiges",
    // Wird automatisch als "Abonnements" kategorisiert
    date: "2024-01-07",
    type: "expense"
  },
  {
    id: "8",
    accountId: "1",
    amount: -7.99,
    description: "Disney+ Abo",
    category: "Sonstiges",
    // Wird automatisch als "Abonnements" kategorisiert
    date: "2024-01-08",
    type: "expense"
  },
  // Supermärkte
  {
    id: "9",
    accountId: "1",
    amount: -89.45,
    description: "REWE Lebensmittel",
    category: "Sonstiges",
    // Wird automatisch als "Lebensmittel" kategorisiert
    date: "2024-01-09",
    type: "expense"
  },
  {
    id: "10",
    accountId: "1",
    amount: -67.23,
    description: "EDEKA Wocheneinkauf",
    category: "Sonstiges",
    // Wird automatisch als "Lebensmittel" kategorisiert
    date: "2024-01-10",
    type: "expense"
  },
  {
    id: "11",
    accountId: "1",
    amount: -34.5,
    description: "ALDI Nord",
    category: "Sonstiges",
    // Wird automatisch als "Lebensmittel" kategorisiert
    date: "2024-01-11",
    type: "expense"
  },
  // Transport
  {
    id: "12",
    accountId: "1",
    amount: -65.8,
    description: "Shell Tankstelle",
    category: "Sonstiges",
    // Wird automatisch als "Transport" kategorisiert
    date: "2024-01-12",
    type: "expense"
  },
  {
    id: "13",
    accountId: "1",
    amount: -98.5,
    description: "Deutsche Bahn Fahrkarte",
    category: "Sonstiges",
    // Wird automatisch als "Transport" kategorisiert
    date: "2024-01-13",
    type: "expense"
  },
  // Nebenkosten
  {
    id: "14",
    accountId: "1",
    amount: -78.9,
    description: "E.ON Strom",
    category: "Sonstiges",
    // Wird automatisch als "Nebenkosten" kategorisiert
    date: "2024-01-14",
    type: "expense"
  },
  {
    id: "15",
    accountId: "1",
    amount: -45.6,
    description: "Telekom Internet",
    category: "Sonstiges",
    // Wird automatisch als "Nebenkosten" kategorisiert
    date: "2024-01-15",
    type: "expense"
  },
  // Gastronomie
  {
    id: "16",
    accountId: "1",
    amount: -23.4,
    description: "McDonald's Restaurant",
    category: "Sonstiges",
    // Wird automatisch als "Gastronomie" kategorisiert
    date: "2024-01-16",
    type: "expense"
  },
  {
    id: "17",
    accountId: "1",
    amount: -8.5,
    description: "Starbucks Coffee",
    category: "Sonstiges",
    // Wird automatisch als "Gastronomie" kategorisiert
    date: "2024-01-17",
    type: "expense"
  },
  // Wohnen
  {
    id: "18",
    accountId: "1",
    amount: -1350,
    description: "Wohnungsmiete Februar",
    category: "Sonstiges",
    // Wird automatisch als "Wohnen" kategorisiert
    date: "2024-02-01",
    type: "expense"
  },
  // Gesundheit
  {
    id: "19",
    accountId: "1",
    amount: -45.2,
    description: "Apotheke Medikamente",
    category: "Sonstiges",
    // Wird automatisch als "Gesundheit" kategorisiert
    date: "2024-01-18",
    type: "expense"
  },
  {
    id: "20",
    accountId: "1",
    amount: -85,
    description: "Zahnarzt Behandlung",
    category: "Sonstiges",
    // Wird automatisch als "Gesundheit" kategorisiert
    date: "2024-01-19",
    type: "expense"
  }
];
const SplitComponent = function RouteComponent() {
  const [accounts, setAccounts] = React__default.useState(mockAccounts);
  const [transactions, setTransactions] = useState(enhancedTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showBulkCategorization, setShowBulkCategorization] = useState(false);
  const handleAccountAdded = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };
  const handleCategoryChange = (transactionId, newCategory) => {
    setTransactions((prev) => prev.map((transaction) => transaction.id === transactionId ? {
      ...transaction,
      category: newCategory
    } : transaction));
  };
  const handleBulkCategoryChange = (transactionIds, newCategory) => {
    setTransactions((prev) => prev.map((transaction) => transactionIds.includes(transaction.id) ? {
      ...transaction,
      category: newCategory
    } : transaction));
  };
  const handleBulkCategorize = (updatedTransactions) => {
    setTransactions(updatedTransactions);
    setShowBulkCategorization(false);
  };
  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map((t) => t.category))];
    return cats.sort();
  }, [transactions]);
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
      const matchesAccount = !selectedAccount || transaction.accountId === selectedAccount;
      return matchesSearch && matchesCategory && matchesAccount;
    });
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "amount") {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return filtered;
  }, [transactions, searchTerm, selectedCategory, selectedAccount, sortField, sortDirection]);
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0));
  const netAmount = totalIncome - totalExpenses;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(motion.header, { className: "bg-white border-b border-gray-200 px-6 py-4", initial: {
      opacity: 0,
      y: -20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.3
    }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Home, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: "FinanzPlaner" })
        ] }),
        /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "text-sm font-medium text-gray-600 hover:text-gray-900", children: "Dashboard" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1", children: "Transaktionen" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm font-medium text-gray-600 hover:text-gray-900", children: "Budgets" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm font-medium text-gray-600 hover:text-gray-900", children: "Ziele" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(BankConnection, { onAccountAdded: handleAccountAdded }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "p-2 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "p-2 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Avatar, { children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-100 text-blue-600", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.4
      }, children: /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Transaktionen \u{1F4B0}" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Alle Ihre Einnahmen und Ausgaben im \xDCberblick" })
      ] }) }),
      /* @__PURE__ */ jsxs(motion.div, { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.4,
        delay: 0.1
      }, children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ArrowUpCircle, { className: "h-8 w-8 text-green-600" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Einnahmen" }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-green-600", children: [
              "+",
              totalIncome.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR"
              })
            ] })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ArrowDownCircle, { className: "h-8 w-8 text-red-600" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Ausgaben" }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-red-600", children: [
              "-",
              totalExpenses.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR"
              })
            ] })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-8 w-8 text-blue-600" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Netto" }),
            /* @__PURE__ */ jsxs("p", { className: `text-lg font-semibold ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`, children: [
              netAmount >= 0 ? "+" : "",
              netAmount.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR"
              })
            ] })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.4,
        delay: 0.2
      }, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(TransactionFilters, { searchTerm, onSearchChange: setSearchTerm, selectedCategory, onCategoryChange: setSelectedCategory, selectedAccount, onAccountChange: setSelectedAccount, categories, accounts, onClearFilters: () => {
          setSelectedCategory("");
          setSelectedAccount("");
        } }) }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setShowBulkCategorization(true), className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Wand2, { className: "h-4 w-4" }),
          "KI Kategorisierung"
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(AnimatePresence, { children: showBulkCategorization && /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: 20
      }, transition: {
        duration: 0.4
      }, children: /* @__PURE__ */ jsx(BulkCategorizationPanel, { transactions: filteredTransactions, onBulkCategorize: handleBulkCategorize, onClose: () => setShowBulkCategorization(false) }) }) }),
      /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.4,
        delay: 0.3
      }, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("span", { children: [
          "Transaktionen (",
          filteredTransactions.length,
          ")"
        ] }) }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(TransactionTable, { transactions: filteredTransactions, accounts, onSort: handleSort, sortField, sortDirection, onCategoryChange: handleCategoryChange, onBulkCategoryChange: handleBulkCategoryChange }) })
      ] }) })
    ] }) })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=index-BW1ZhpJ2.mjs.map
