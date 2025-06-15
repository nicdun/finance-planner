import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FinancialGoal } from "@/lib/types";
import { Target, Calendar, TrendingUp } from "lucide-react";

interface GoalCardProps {
  goal: FinancialGoal;
  index: number;
}

export function GoalCard({ goal, index }: GoalCardProps) {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getStatusBadge = () => {
    if (percentage >= 100)
      return { variant: "default" as const, text: "Erreicht" };
    if (daysRemaining < 0)
      return { variant: "destructive" as const, text: "Überfällig" };
    if (daysRemaining < 30)
      return { variant: "secondary" as const, text: "Bald fällig" };
    return { variant: "outline" as const, text: "In Bearbeitung" };
  };

  const status = getStatusBadge();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            {goal.title}
          </CardTitle>
          <Badge variant={status.variant} className="text-xs">
            {status.text}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aktuell:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(goal.currentAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ziel:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(goal.targetAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Noch benötigt:</span>
                <span className="font-medium text-blue-600">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(Math.max(0, remainingAmount))}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{Math.round(percentage)}% erreicht</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {daysRemaining > 0
                      ? `${daysRemaining} Tage verbleibend`
                      : daysRemaining === 0
                      ? "Heute fällig"
                      : `${Math.abs(daysRemaining)} Tage überfällig`}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${getProgressColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {goal.category}
              </span>
              <span>Zieldatum: {targetDate.toLocaleDateString("de-DE")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
