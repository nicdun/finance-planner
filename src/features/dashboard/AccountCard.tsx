import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Account } from "@/lib/types";
import { CreditCard, Wallet, PiggyBank, TrendingUp } from "lucide-react";

interface AccountCardProps {
  account: Account;
  index: number;
}

const getAccountIcon = (type: Account["type"]) => {
  switch (type) {
    case "checking":
      return <Wallet className="h-5 w-5" />;
    case "savings":
      return <PiggyBank className="h-5 w-5" />;
    case "credit":
      return <CreditCard className="h-5 w-5" />;
    case "investment":
      return <TrendingUp className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

const getAccountTypeLabel = (type: Account["type"]) => {
  switch (type) {
    case "checking":
      return "Girokonto";
    case "savings":
      return "Sparkonto";
    case "credit":
      return "Kreditkarte";
    case "investment":
      return "Depot";
    default:
      return "Konto";
  }
};

const getBalanceColor = (balance: number) => {
  if (balance < 0) return "text-red-600";
  if (balance > 10000) return "text-green-600";
  return "text-gray-900";
};

export function AccountCard({ account, index }: AccountCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getAccountIcon(account.type)}
            {account.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {getAccountTypeLabel(account.type)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div
              className={`text-2xl font-bold ${getBalanceColor(
                account.balance
              )}`}
            >
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: account.currency,
              }).format(account.balance)}
            </div>
            {account.iban && (
              <div className="text-xs text-gray-500 font-mono">
                {account.iban}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
