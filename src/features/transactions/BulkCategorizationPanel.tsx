import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wand2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  EyeOff,
  Sparkles,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react";
import { Transaction } from "@/lib/types";
import {
  categorizeTransactions,
  CATEGORIES,
  categorizationLearner,
  categorizeTransaction,
} from "@/lib/categorization";

interface BulkCategorizationPanelProps {
  transactions: Transaction[];
  onBulkCategorize: (updatedTransactions: Transaction[]) => void;
  onClose: () => void;
}

interface CategorizationPreview {
  transaction: Transaction;
  suggestedCategory: string;
  confidence: "high" | "medium" | "low";
  isChanged: boolean;
}

export function BulkCategorizationPanel({
  transactions,
  onBulkCategorize,
  onClose,
}: BulkCategorizationPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);

  // Generiere Kategorisierungs-Vorschau
  const categorizationPreviews = useMemo(() => {
    return transactions.map((transaction) => {
      const suggestedCategory = categorizeTransaction(transaction);
      const isChanged = suggestedCategory !== transaction.category;

      // Berechne Confidence basierend auf verschiedenen Faktoren
      let confidence: "high" | "medium" | "low" = "low";
      const description = transaction.description.toLowerCase();

      // High Confidence: Eindeutige Keywords
      if (
        description.includes("gehalt") ||
        description.includes("miete") ||
        description.includes("netflix") ||
        description.includes("rewe") ||
        description.includes("sparkasse") ||
        description.includes("tankstelle")
      ) {
        confidence = "high";
      }
      // Medium Confidence: Mehrere relevante Keywords
      else if (suggestedCategory !== "Sonstiges" && isChanged) {
        confidence = "medium";
      }

      return {
        transaction,
        suggestedCategory,
        confidence,
        isChanged,
      };
    });
  }, [transactions]);

  const changedTransactions = categorizationPreviews.filter((p) => p.isChanged);
  const highConfidenceChanges = changedTransactions.filter(
    (p) => p.confidence === "high"
  );
  const mediumConfidenceChanges = changedTransactions.filter(
    (p) => p.confidence === "medium"
  );
  const lowConfidenceChanges = changedTransactions.filter(
    (p) => p.confidence === "low"
  );

  // Kategorien-Statistiken
  const categoryStats = useMemo(() => {
    const stats = new Map<string, number>();
    changedTransactions.forEach((p) => {
      stats.set(p.suggestedCategory, (stats.get(p.suggestedCategory) || 0) + 1);
    });
    return Array.from(stats.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [changedTransactions]);

  const handleAutoApply = async () => {
    setIsProcessing(true);

    // Simuliere Verarbeitungszeit
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedTransactions = transactions.map((transaction) => {
      const preview = categorizationPreviews.find(
        (p) => p.transaction.id === transaction.id
      );
      if (preview?.isChanged) {
        return {
          ...transaction,
          category: preview.suggestedCategory,
        };
      }
      return transaction;
    });

    // Lerne von allen Änderungen
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedTransactions = transactions.map((transaction) => {
      if (selectedPreviews.includes(transaction.id)) {
        const preview = categorizationPreviews.find(
          (p) => p.transaction.id === transaction.id
        );
        if (preview?.isChanged) {
          return {
            ...transaction,
            category: preview.suggestedCategory,
          };
        }
      }
      return transaction;
    });

    // Lerne von ausgewählten Änderungen
    selectedPreviews.forEach((id) => {
      const preview = categorizationPreviews.find(
        (p) => p.transaction.id === id
      );
      if (preview?.isChanged) {
        categorizationLearner.learnFromCorrection(
          preview.transaction.description,
          preview.suggestedCategory
        );
      }
    });

    onBulkCategorize(updatedTransactions);
    setIsProcessing(false);
  };

  const togglePreviewSelection = (transactionId: string) => {
    setSelectedPreviews((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const selectAllHighConfidence = () => {
    const highConfidenceIds = highConfidenceChanges.map(
      (p) => p.transaction.id
    );
    setSelectedPreviews(highConfidenceIds);
  };

  const getConfidenceColor = (confidence: string) => {
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

  const getConfidenceBadge = (confidence: string) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-blue-600" />
            Intelligente Kategorisierung
          </CardTitle>
          <CardDescription>
            Nutzen Sie KI, um Ihre Transaktionen automatisch zu kategorisieren
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Transaktionen</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Vorschläge</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {changedTransactions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Hohe Genauigkeit</p>
                <p className="text-2xl font-bold text-green-600">
                  {highConfidenceChanges.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Prüfung nötig</p>
                <p className="text-2xl font-bold text-red-600">
                  {lowConfidenceChanges.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Preview */}
      {categoryStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kategorien-Übersicht</CardTitle>
            <CardDescription>
              Die häufigsten vorgeschlagenen Kategorien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoryStats.map(([category, count]) => (
                <Badge key={category} variant="secondary" className="px-3 py-1">
                  {category} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAutoApply}
          disabled={isProcessing || changedTransactions.length === 0}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              Verarbeite...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Alle Vorschläge anwenden ({changedTransactions.length})
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Vorschau ausblenden
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Vorschau anzeigen
            </>
          )}
        </Button>

        <Button variant="ghost" onClick={onClose} className="flex-1">
          Abbrechen
        </Button>
      </div>

      {/* Detailed Preview */}
      <AnimatePresence>
        {showPreview && changedTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Kategorisierungs-Vorschau</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllHighConfidence}
                      disabled={highConfidenceChanges.length === 0}
                    >
                      Alle hohen Genauigkeiten auswählen
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSelectiveApply}
                      disabled={selectedPreviews.length === 0 || isProcessing}
                    >
                      Ausgewählte anwenden ({selectedPreviews.length})
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {changedTransactions.map((preview) => (
                    <motion.div
                      key={preview.transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                        selectedPreviews.includes(preview.transaction.id)
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedPreviews.includes(
                            preview.transaction.id
                          )}
                          onCheckedChange={() =>
                            togglePreviewSelection(preview.transaction.id)
                          }
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {preview.transaction.description}
                          </p>
                          <p className="text-xs text-gray-600">
                            {preview.transaction.amount.toLocaleString(
                              "de-DE",
                              {
                                style: "currency",
                                currency: "EUR",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {preview.transaction.category}
                        </Badge>
                        <span className="text-xs text-gray-400">→</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getConfidenceBadge(
                            preview.confidence
                          )}`}
                        >
                          {preview.suggestedCategory}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getConfidenceColor(
                            preview.confidence
                          )}`}
                        >
                          {preview.confidence === "high"
                            ? "Sicher"
                            : preview.confidence === "medium"
                            ? "Wahrscheinlich"
                            : "Unsicher"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
