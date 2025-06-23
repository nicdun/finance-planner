import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancialTip } from "@/lib/types";
import { formatCurrency } from "@/lib/financial-tips";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Lightbulb,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
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

  const topTips = tips.slice(0, 3); // Show top 3 tips
  const totalSavingsPotential = tips.reduce(
    (sum, tip) => sum + tip.potential_savings,
    0
  );

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="text-lg">Finanz-Tipps</span>
          </div>
          {totalSavingsPotential > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Bis zu {formatCurrency(totalSavingsPotential)} sparen
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topTips.map((tip, index) => {
          const PriorityIcon = priorityConfig[tip.priority].icon;

          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{tip.icon}</span>
                    <h4 className="font-semibold text-gray-900">{tip.title}</h4>
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
                      <Button variant="outline" size="sm" className="text-xs">
                        {tip.action_text}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {tips.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-blue-600">
              Alle {tips.length} Tipps anzeigen
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
