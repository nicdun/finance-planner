import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { u as useAuth, c as cn, f as Button, s as supabase, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, e as CardContent } from './ssr.mjs';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, Building2, X, LogIn, EyeOff, Eye, UserPlus, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import * as TabsPrimitive from '@radix-ui/react-tabs';

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
async function getTransactions() {
  const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
  return data.map((transaction) => ({
    id: transaction.id,
    accountId: transaction.account_id,
    amount: parseFloat(transaction.amount.toString()),
    description: transaction.description,
    category: transaction.category,
    date: transaction.date,
    type: transaction.type
  }));
}
async function updateTransactionCategory(transactionId, newCategory) {
  const { error } = await supabase.from("transactions").update({ category: newCategory }).eq("id", transactionId);
  if (error) {
    console.error("Error updating transaction category:", error);
    throw error;
  }
}
async function bulkUpdateTransactionCategories(transactionIds, newCategory) {
  const { error } = await supabase.from("transactions").update({ category: newCategory }).in("id", transactionIds);
  if (error) {
    console.error("Error bulk updating transaction categories:", error);
    throw error;
  }
}
async function getAccounts() {
  const { data, error } = await supabase.from("accounts").select("*").order("name");
  if (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
  return data.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: parseFloat(account.balance.toString()),
    currency: account.currency,
    iban: account.iban
  }));
}
async function createAccount(account) {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabase.from("accounts").insert({
    name: account.name,
    type: account.type,
    balance: account.balance,
    currency: account.currency,
    iban: account.iban,
    user_id: user.id
  }).select().single();
  if (error) {
    console.error("Error creating account:", error);
    throw error;
  }
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    balance: parseFloat(data.balance.toString()),
    currency: data.currency,
    iban: data.iban
  };
}
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
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-red-50 border-red-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function AuthForm() {
  const { signIn, signUp, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "test@example.com",
    // Pre-filled for test user
    password: "test123"
    // Pre-filled for test user
  });
  const [localError, setLocalError] = useState(null);
  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setLocalError(null);
    if (!formData.email || !formData.password) {
      setLocalError("Bitte f\xFCllen Sie alle Felder aus");
      return;
    }
    try {
      let result;
      if (action === "signin") {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password);
      }
      if (result.error) {
        setLocalError(result.error.message);
      }
    } catch (err) {
      setLocalError("Ein unerwarteter Fehler ist aufgetreten");
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setLocalError(null);
  };
  const displayError = localError || (error == null ? void 0 : error.message);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "w-full max-w-md",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scale: 0.5 },
              animate: { scale: 1 },
              transition: { duration: 0.5, delay: 0.2 },
              className: "inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4",
              children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-white", children: "\u20AC" })
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "FinanzPlaner" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Verwalten Sie Ihre Finanzen intelligent" })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
          /* @__PURE__ */ jsxs(Tabs, { defaultValue: "signin", className: "w-full", children: [
            /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
              /* @__PURE__ */ jsx(TabsTrigger, { value: "signin", children: "Anmelden" }),
              /* @__PURE__ */ jsx(TabsTrigger, { value: "signup", children: "Registrieren" })
            ] }),
            /* @__PURE__ */ jsxs(TabsContent, { value: "signin", children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(LogIn, { className: "h-5 w-5" }),
                  "Anmelden"
                ] }),
                /* @__PURE__ */ jsx(CardDescription, { children: "Melden Sie sich mit Ihren Zugangsdaten an" })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: (e) => handleSubmit(e, "signin"),
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "signin-email", children: "E-Mail" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: "signin-email",
                          type: "email",
                          placeholder: "test@example.com",
                          value: formData.email,
                          onChange: (e) => handleInputChange("email", e.target.value),
                          disabled: loading
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "signin-password", children: "Passwort" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            id: "signin-password",
                            type: showPassword ? "text" : "password",
                            placeholder: "test",
                            value: formData.password,
                            onChange: (e) => handleInputChange("password", e.target.value),
                            disabled: loading,
                            className: "pr-10"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setShowPassword(!showPassword),
                            className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                            children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                      "Wird angemeldet..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(LogIn, { className: "mr-2 h-4 w-4" }),
                      "Anmelden"
                    ] }) })
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs(TabsContent, { value: "signup", children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(UserPlus, { className: "h-5 w-5" }),
                  "Registrieren"
                ] }),
                /* @__PURE__ */ jsx(CardDescription, { children: "Erstellen Sie ein neues Konto" })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: (e) => handleSubmit(e, "signup"),
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "signup-email", children: "E-Mail" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: "signup-email",
                          type: "email",
                          placeholder: "ihre@email.com",
                          value: formData.email,
                          onChange: (e) => handleInputChange("email", e.target.value),
                          disabled: loading
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "signup-password", children: "Passwort" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            id: "signup-password",
                            type: showPassword ? "text" : "password",
                            placeholder: "Mindestens 6 Zeichen",
                            value: formData.password,
                            onChange: (e) => handleInputChange("password", e.target.value),
                            disabled: loading,
                            className: "pr-10"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setShowPassword(!showPassword),
                            className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                            children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                      "Wird registriert..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
                      "Registrieren"
                    ] }) })
                  ]
                }
              ) })
            ] })
          ] }),
          displayError && /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: displayError })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center mt-4 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("p", { children: "Demo-Zugangsdaten:" }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "E-Mail:" }),
            " test@example.com"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Passwort:" }),
            " test123"
          ] })
        ] })
      ]
    }
  ) });
}
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Wird geladen..." })
    ] }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(AuthForm, {});
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}

export { Avatar as A, BankConnection as B, Input as I, Label as L, ProtectedRoute as P, Separator as S, Tabs as T, AvatarFallback as a, getAccounts as b, createAccount as c, bulkUpdateTransactionCategories as d, TabsList as e, TabsTrigger as f, getTransactions as g, TabsContent as h, updateTransactionCategory as u };
//# sourceMappingURL=ProtectedRoute-KihgEAzx.mjs.map
