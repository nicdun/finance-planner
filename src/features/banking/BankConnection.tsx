import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CreditCard,
  Plus,
  X,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Account } from "@/lib/types";

interface Bank {
  id: string;
  name: string;
  logo: string;
  color: string;
  popular: boolean;
}

const popularBanks: Bank[] = [
  {
    id: "sparkasse",
    name: "Sparkasse",
    logo: "🏛️",
    color: "bg-red-500",
    popular: true,
  },
  {
    id: "deutsche-bank",
    name: "Deutsche Bank",
    logo: "🏦",
    color: "bg-blue-600",
    popular: true,
  },
  {
    id: "commerzbank",
    name: "Commerzbank",
    logo: "🏢",
    color: "bg-yellow-500",
    popular: true,
  },
  { id: "dkb", name: "DKB", logo: "💳", color: "bg-blue-700", popular: true },
  { id: "ing", name: "ING", logo: "🧡", color: "bg-orange-500", popular: true },
];

const otherBanks: Bank[] = [
  {
    id: "postbank",
    name: "Postbank",
    logo: "📮",
    color: "bg-yellow-600",
    popular: false,
  },
  {
    id: "santander",
    name: "Santander",
    logo: "🔴",
    color: "bg-red-600",
    popular: false,
  },
  {
    id: "targobank",
    name: "Targobank",
    logo: "🎯",
    color: "bg-purple-600",
    popular: false,
  },
  {
    id: "hypovereinsbank",
    name: "HypoVereinsbank",
    logo: "🏛️",
    color: "bg-green-600",
    popular: false,
  },
];

type ConnectionStep =
  | "bankSelection"
  | "credentials"
  | "verification"
  | "success";

interface BankConnectionProps {
  onAccountAdded: (account: Account) => void;
}

export function BankConnection({ onAccountAdded }: BankConnectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] =
    useState<ConnectionStep>("bankSelection");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    iban: "",
  });

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setCurrentStep("credentials");
  };

  const handleConnect = async () => {
    if (!selectedBank) return;

    setIsConnecting(true);
    setCurrentStep("verification");

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create mock account based on selected bank
    const newAccount: Account = {
      id: `account-${Date.now()}`,
      name: `${selectedBank.name} Girokonto`,
      type: "checking",
      balance: Math.floor(Math.random() * 5000) + 1000,
      currency: "EUR",
      iban:
        credentials.iban ||
        `DE89 3704 0044 0532 ${Math.floor(Math.random() * 9999)
          .toString()
          .padStart(4, "0")} 00`,
    };

    onAccountAdded(newAccount);
    setCurrentStep("success");
    setIsConnecting(false);

    // Auto close after success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep("bankSelection");
    setSelectedBank(null);
    setCredentials({ username: "", password: "", iban: "" });
    setIsConnecting(false);
  };

  const renderBankSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Beliebte Banken</h3>
        <div className="grid grid-cols-2 gap-3">
          {popularBanks.map((bank) => (
            <motion.button
              key={bank.id}
              onClick={() => handleBankSelect(bank)}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">{bank.logo}</span>
              <span className="font-medium">{bank.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Weitere Banken</h3>
        <div className="grid grid-cols-1 gap-2">
          {otherBanks.map((bank) => (
            <motion.button
              key={bank.id}
              onClick={() => handleBankSelect(bank)}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="text-lg">{bank.logo}</span>
              <span className="font-medium">{bank.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCredentials = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-2xl">{selectedBank?.logo}</span>
        <div>
          <h3 className="font-semibold">{selectedBank?.name}</h3>
          <p className="text-sm text-gray-600">
            Sicher verbinden mit Bank-Login
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Benutzername / Kontonummer</Label>
          <Input
            id="username"
            type="text"
            placeholder="Ihr Benutzername"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">PIN / Passwort</Label>
          <Input
            id="password"
            type="password"
            placeholder="Ihr Passwort"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">IBAN (optional)</Label>
          <Input
            id="iban"
            type="text"
            placeholder="DE89 3704 0044 0532 0130 00"
            value={credentials.iban}
            onChange={(e) =>
              setCredentials({ ...credentials, iban: e.target.value })
            }
          />
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-800">
              256-Bit SSL Verschlüsselung
            </p>
            <p className="text-green-700">
              Ihre Daten werden sicher übertragen und nicht gespeichert.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep("bankSelection")}
          className="flex-1"
        >
          Zurück
        </Button>
        <Button
          onClick={handleConnect}
          disabled={!credentials.username || !credentials.password}
          className="flex-1"
        >
          Sicher verbinden
        </Button>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-600" />
        </motion.div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Verbindung wird hergestellt...
        </h3>
        <p className="text-gray-600">
          Wir verbinden Ihr {selectedBank?.name} Konto sicher mit FinanzPlaner.
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Erfolgreich verbunden!</h3>
        <p className="text-gray-600">
          Ihr {selectedBank?.name} Konto wurde erfolgreich hinzugefügt.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Konto hinzufügen
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold">Bankkonto verbinden</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {currentStep === "bankSelection" && renderBankSelection()}
                {currentStep === "credentials" && renderCredentials()}
                {currentStep === "verification" && renderVerification()}
                {currentStep === "success" && renderSuccess()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
