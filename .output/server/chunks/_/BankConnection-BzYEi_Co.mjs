import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { c as cn, f as Button } from './ssr.mjs';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Building2, X, Shield, Loader2, CheckCircle } from 'lucide-react';

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
const mockAccounts = [
  {
    id: "1",
    name: "Girokonto",
    type: "checking",
    balance: 3250.75,
    currency: "EUR",
    iban: "DE89 3704 0044 0532 0130 00"
  },
  {
    id: "2",
    name: "Sparkonto",
    type: "savings",
    balance: 15420.5,
    currency: "EUR",
    iban: "DE89 3704 0044 0532 0130 01"
  },
  {
    id: "3",
    name: "Kreditkarte",
    type: "credit",
    balance: -1250.3,
    currency: "EUR"
  },
  {
    id: "4",
    name: "Depot",
    type: "investment",
    balance: 28750.8,
    currency: "EUR"
  }
];
const mockTransactions = [
  {
    id: "1",
    accountId: "1",
    amount: 3200,
    description: "Gehalt - Senacor Technologies AG",
    category: "Einkommen",
    date: "2024-01-01",
    type: "income"
  },
  {
    id: "2",
    accountId: "1",
    amount: -850,
    description: "Miete",
    category: "Wohnen",
    date: "2024-01-02",
    type: "expense"
  },
  {
    id: "3",
    accountId: "1",
    amount: -120.5,
    description: "REWE Supermarkt",
    category: "Lebensmittel",
    date: "2024-01-03",
    type: "expense"
  },
  {
    id: "4",
    accountId: "1",
    amount: -45.9,
    description: "Tankstelle Shell",
    category: "Transport",
    date: "2024-01-04",
    type: "expense"
  },
  {
    id: "5",
    accountId: "1",
    amount: -89.99,
    description: "Strom - E.ON",
    category: "Nebenkosten",
    date: "2024-01-05",
    type: "expense"
  }
];
const mockBudgets = [
  {
    id: "1",
    category: "Lebensmittel",
    budgetAmount: 400,
    spentAmount: 285.5,
    period: "monthly",
    color: "#10b981"
  },
  {
    id: "2",
    category: "Transport",
    budgetAmount: 200,
    spentAmount: 165.9,
    period: "monthly",
    color: "#3b82f6"
  },
  {
    id: "3",
    category: "Unterhaltung",
    budgetAmount: 150,
    spentAmount: 89.5,
    period: "monthly",
    color: "#8b5cf6"
  },
  {
    id: "4",
    category: "Kleidung",
    budgetAmount: 100,
    spentAmount: 125,
    period: "monthly",
    color: "#ef4444"
  },
  {
    id: "5",
    category: "Gesundheit",
    budgetAmount: 80,
    spentAmount: 45.2,
    period: "monthly",
    color: "#f59e0b"
  }
];
const mockGoals = [
  {
    id: "1",
    title: "Notgroschen",
    targetAmount: 1e4,
    currentAmount: 7500,
    targetDate: "2024-12-31",
    category: "Sicherheit"
  },
  {
    id: "2",
    title: "Urlaub 2024",
    targetAmount: 3e3,
    currentAmount: 1850,
    targetDate: "2024-07-01",
    category: "Reisen"
  },
  {
    id: "3",
    title: "Neues Auto",
    targetAmount: 25e3,
    currentAmount: 8500,
    targetDate: "2025-06-01",
    category: "Transport"
  },
  {
    id: "4",
    title: "Eigenkapital Immobilie",
    targetAmount: 5e4,
    currentAmount: 15e3,
    targetDate: "2026-12-31",
    category: "Immobilien"
  }
];
const mockMonthlyData = [
  { month: "Jan", income: 3200, expenses: 2150, savings: 1050 },
  { month: "Feb", income: 3200, expenses: 2280, savings: 920 },
  { month: "M\xE4r", income: 3200, expenses: 2050, savings: 1150 },
  { month: "Apr", income: 3200, expenses: 2320, savings: 880 },
  { month: "Mai", income: 3200, expenses: 2180, savings: 1020 },
  { month: "Jun", income: 3200, expenses: 2400, savings: 800 },
  { month: "Jul", income: 3200, expenses: 2650, savings: 550 },
  { month: "Aug", income: 3200, expenses: 2100, savings: 1100 },
  { month: "Sep", income: 3200, expenses: 2250, savings: 950 },
  { month: "Okt", income: 3200, expenses: 2180, savings: 1020 },
  { month: "Nov", income: 3200, expenses: 2350, savings: 850 },
  { month: "Dez", income: 3200, expenses: 2500, savings: 700 }
];
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "label",
  {
    ref,
    className: cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    ),
    ...props
  }
));
Label.displayName = "Label";
const popularBanks = [
  {
    id: "sparkasse",
    name: "Sparkasse",
    logo: "\u{1F3DB}\uFE0F",
    color: "bg-red-500",
    popular: true
  },
  {
    id: "deutsche-bank",
    name: "Deutsche Bank",
    logo: "\u{1F3E6}",
    color: "bg-blue-600",
    popular: true
  },
  {
    id: "commerzbank",
    name: "Commerzbank",
    logo: "\u{1F3E2}",
    color: "bg-yellow-500",
    popular: true
  },
  { id: "dkb", name: "DKB", logo: "\u{1F4B3}", color: "bg-blue-700", popular: true },
  { id: "ing", name: "ING", logo: "\u{1F9E1}", color: "bg-orange-500", popular: true }
];
const otherBanks = [
  {
    id: "postbank",
    name: "Postbank",
    logo: "\u{1F4EE}",
    color: "bg-yellow-600",
    popular: false
  },
  {
    id: "santander",
    name: "Santander",
    logo: "\u{1F534}",
    color: "bg-red-600",
    popular: false
  },
  {
    id: "targobank",
    name: "Targobank",
    logo: "\u{1F3AF}",
    color: "bg-purple-600",
    popular: false
  },
  {
    id: "hypovereinsbank",
    name: "HypoVereinsbank",
    logo: "\u{1F3DB}\uFE0F",
    color: "bg-green-600",
    popular: false
  }
];
function BankConnection({ onAccountAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("bankSelection");
  const [selectedBank, setSelectedBank] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    iban: ""
  });
  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setCurrentStep("credentials");
  };
  const handleConnect = async () => {
    if (!selectedBank) return;
    setIsConnecting(true);
    setCurrentStep("verification");
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    const newAccount = {
      id: `account-${Date.now()}`,
      name: `${selectedBank.name} Girokonto`,
      type: "checking",
      balance: Math.floor(Math.random() * 5e3) + 1e3,
      currency: "EUR",
      iban: credentials.iban || `DE89 3704 0044 0532 ${Math.floor(Math.random() * 9999).toString().padStart(4, "0")} 00`
    };
    onAccountAdded(newAccount);
    setCurrentStep("success");
    setIsConnecting(false);
    setTimeout(() => {
      handleClose();
    }, 2e3);
  };
  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep("bankSelection");
    setSelectedBank(null);
    setCredentials({ username: "", password: "", iban: "" });
    setIsConnecting(false);
  };
  const renderBankSelection = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Beliebte Banken" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: popularBanks.map((bank) => /* @__PURE__ */ jsxs(
        motion.button,
        {
          onClick: () => handleBankSelect(bank),
          className: "flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all",
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl", children: bank.logo }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: bank.name })
          ]
        },
        bank.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Weitere Banken" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2", children: otherBanks.map((bank) => /* @__PURE__ */ jsxs(
        motion.button,
        {
          onClick: () => handleBankSelect(bank),
          className: "flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left",
          whileHover: { scale: 1.01 },
          whileTap: { scale: 0.99 },
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg", children: bank.logo }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: bank.name })
          ]
        },
        bank.id
      )) })
    ] })
  ] });
  const renderCredentials = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [
      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: selectedBank == null ? void 0 : selectedBank.logo }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: selectedBank == null ? void 0 : selectedBank.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Sicher verbinden mit Bank-Login" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Benutzername / Kontonummer" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "username",
            type: "text",
            placeholder: "Ihr Benutzername",
            value: credentials.username,
            onChange: (e) => setCredentials({ ...credentials, username: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "PIN / Passwort" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            placeholder: "Ihr Passwort",
            value: credentials.password,
            onChange: (e) => setCredentials({ ...credentials, password: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "iban", children: "IBAN (optional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "iban",
            type: "text",
            placeholder: "DE89 3704 0044 0532 0130 00",
            value: credentials.iban,
            onChange: (e) => setCredentials({ ...credentials, iban: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg", children: [
        /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-green-800", children: "256-Bit SSL Verschl\xFCsselung" }),
          /* @__PURE__ */ jsx("p", { className: "text-green-700", children: "Ihre Daten werden sicher \xFCbertragen und nicht gespeichert." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentStep("bankSelection"),
          className: "flex-1",
          children: "Zur\xFCck"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleConnect,
          disabled: !credentials.username || !credentials.password,
          className: "flex-1",
          children: "Sicher verbinden"
        }
      )
    ] })
  ] });
  const renderVerification = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        animate: { rotate: 360 },
        transition: { duration: 2, repeat: Infinity, ease: "linear" },
        children: /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 text-blue-600" })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Verbindung wird hergestellt..." }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
        "Wir verbinden Ihr ",
        selectedBank == null ? void 0 : selectedBank.name,
        " Konto sicher mit FinanzPlaner."
      ] })
    ] })
  ] });
  const renderSuccess = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { scale: 0 },
        animate: { scale: 1 },
        transition: { type: "spring", stiffness: 200 },
        children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-12 w-12 text-green-600" })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Erfolgreich verbunden!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
        "Ihr ",
        selectedBank == null ? void 0 : selectedBank.name,
        " Konto wurde erfolgreich hinzugef\xFCgt."
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: () => setIsOpen(true),
        className: "flex items-center gap-2",
        variant: "outline",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Konto hinzuf\xFCgen"
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
        onClick: (e) => e.target === e.currentTarget && handleClose(),
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            className: "bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "h-6 w-6 text-blue-600" }),
                  /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Bankkonto verbinden" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleClose,
                    className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                    children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
                currentStep === "bankSelection" && renderBankSelection(),
                currentStep === "credentials" && renderCredentials(),
                currentStep === "verification" && renderVerification(),
                currentStep === "success" && renderSuccess()
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}

export { Avatar as A, BankConnection as B, Input as I, Label as L, Separator as S, mockTransactions as a, AvatarFallback as b, mockMonthlyData as c, mockBudgets as d, mockGoals as e, mockAccounts as m };
//# sourceMappingURL=BankConnection-BzYEi_Co.mjs.map
