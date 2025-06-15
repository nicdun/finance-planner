import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Budget } from "@/lib/types";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface BudgetCardProps {
  budget: Budget;
  index: number;
}

export function BudgetCard({ budget, index }: BudgetCardProps) {
  const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && percentage <= 100;

  const getStatusIcon = () => {
    if (isOverBudget) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (isNearLimit) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (isOverBudget) return "Überschritten";
    if (isNearLimit) return "Warnung";
    return "Im Rahmen";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {budget.category}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge
              variant={
                isOverBudget
                  ? "destructive"
                  : isNearLimit
                  ? "secondary"
                  : "default"
              }
              className="text-xs"
            >
              {getStatusText()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ausgegeben:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(budget.spentAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(budget.budgetAmount)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{Math.round(percentage)}% verwendet</span>
                <span>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(budget.budgetAmount - budget.spentAmount)}{" "}
                  übrig
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${getStatusColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
