import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancialTip } from "@/lib/types";
import { formatCurrency } from "@/lib/financial-tips";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

interface FinancialTipsCardProps {
  tips: FinancialTip[];
  className?: string;
}

const priorityConfig = {
  high: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    textColor: "text-red-600",
  },
  medium: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Info,
    textColor: "text-yellow-600",
  },
  low: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    textColor: "text-green-600",
  },
};

export function FinancialTipsCard({
  tips,
  className = "",
}: FinancialTipsCardProps) {
  const [showAllTips, setShowAllTips] = useState(false);

  if (tips.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Finanz-Tipps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Noch keine Tipps verfügbar. Fügen Sie mehr Transaktionen hinzu, um
              personalisierte Empfehlungen zu erhalten.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedTips = showAllTips ? tips : tips.slice(0, 3);
  const totalSavingsPotential = tips.reduce(
    (sum, tip) => sum + tip.potential_savings,
    0
  );

  // Categorize tips by priority for better display
  const highPriorityTips = tips.filter((tip) => tip.priority === "high");
  const budgetOverageTips = tips.filter(
    (tip) => tip.id.includes("tip-budget-") && tip.title.includes("erschöpft")
  );

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="text-lg">Finanz-Tipps</span>
          </div>
          <div className="flex items-center gap-2">
            {totalSavingsPotential > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Bis zu {formatCurrency(totalSavingsPotential)} sparen
              </Badge>
            )}
            {tips.length > 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllTips(!showAllTips)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showAllTips ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Weniger anzeigen
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Alle {tips.length} Tipps anzeigen
                  </>
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* High Priority Alert Section */}
        {budgetOverageTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">
                Budget-Warnung!
              </span>
            </div>
            <p className="text-red-700 text-sm">
              {budgetOverageTips.length === 1
                ? `1 Budget ist über dem Limit`
                : `${budgetOverageTips.length} Budgets sind über dem Limit`}
              . Reduzieren Sie Ihre Ausgaben in diesen Kategorien.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div className="space-y-4">
            {displayedTips.map((tip, index) => {
              const PriorityIcon = priorityConfig[tip.priority].icon;

              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{tip.icon}</span>
                        <h4 className="font-semibold text-gray-900">
                          {tip.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={priorityConfig[tip.priority].color}
                        >
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {tip.priority === "high"
                            ? "Dringend"
                            : tip.priority === "medium"
                            ? "Mittel"
                            : "Niedrig"}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {tip.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">
                            Kategorie: {tip.category}
                          </span>
                          {tip.potential_savings > 0 && (
                            <span className="text-sm font-semibold text-green-600">
                              💰 {formatCurrency(tip.potential_savings)}
                            </span>
                          )}
                        </div>

                        {tip.action_text && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-gray-400 border-gray-200 cursor-not-allowed"
                            disabled
                          >
                            Coming Soon
                            <ChevronRight className="h-3 w-3 ml-1 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Summary Section */}
        {showAllTips && tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t pt-4 mt-4"
          >
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Zusammenfassung
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Gesamt Tipps:</span>
                  <p className="font-semibold text-blue-800">{tips.length}</p>
                </div>
                <div>
                  <span className="text-gray-600">Dringende:</span>
                  <p className="font-semibold text-red-600">
                    {highPriorityTips.length}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Budget-Warnungen:</span>
                  <p className="font-semibold text-orange-600">
                    {budgetOverageTips.length}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Sparpotenzial:</span>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(totalSavingsPotential)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
