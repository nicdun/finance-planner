import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit3,
  Check,
  X,
  Sparkles,
  Brain,
  BookOpen,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Transaction } from "@/lib/types";
import {
  CATEGORIES,
  categorizeTransaction,
  categorizationLearner,
  findSimilarTransactions,
} from "@/lib/categorization";

interface CategoryEditorProps {
  transaction: Transaction;
  allTransactions: Transaction[];
  onCategoryChange: (transactionId: string, newCategory: string) => void;
  onBulkCategoryChange?: (
    transactionIds: string[],
    newCategory: string
  ) => void;
}

export function CategoryEditor({
  transaction,
  allTransactions,
  onCategoryChange,
  onBulkCategoryChange,
}: CategoryEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    transaction.category
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  // Auto-kategorisiere die Transaktion
  const suggestedCategory = categorizeTransaction(transaction);
  const isAutoSuggested = suggestedCategory !== transaction.category;

  // Finde ähnliche Transaktionen
  const similarTransactions = findSimilarTransactions(
    transaction,
    allTransactions
  );

  const handleSave = () => {
    if (selectedCategory !== transaction.category) {
      onCategoryChange(transaction.id, selectedCategory);

      // Lerne von der Nutzer-Korrektur
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

  const handleBulkApply = (category: string) => {
    if (onBulkCategoryChange && similarTransactions.length > 0) {
      const transactionIds = [
        transaction.id,
        ...similarTransactions.map((t) => t.id),
      ];
      onBulkCategoryChange(transactionIds, category);

      // Lerne von der Bulk-Korrektur
      [transaction, ...similarTransactions].forEach((t) => {
        categorizationLearner.learnFromCorrection(t.description, category);
      });
    }
    setIsEditing(false);
    setShowSimilar(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className={getCategoryColor(transaction.category)}
        >
          {transaction.category}
        </Badge>

        {isAutoSuggested && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(true)}
            className="text-xs text-blue-600 hover:text-blue-700 p-1 h-auto"
            title="Automatische Kategorisierung verfügbar"
          >
            <Sparkles className="h-3 w-3" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
          title="Kategorie bearbeiten"
        >
          <Edit3 className="h-3 w-3" />
        </Button>

        {/* Auto-Suggestion Popup */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute z-50 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Automatische Kategorisierung
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Basierend auf der Beschreibung schlagen wir vor:
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {suggestedCategory}
                </Badge>
                <ArrowRight className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600">
                  statt {transaction.category}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleApplySuggestion}
                  className="text-xs"
                >
                  Anwenden
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(false)}
                  className="text-xs"
                >
                  Ignorieren
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-3 bg-gray-50 rounded-lg border"
    >
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Kategorie bearbeiten</Label>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimilar(!showSimilar)}
            className="text-xs"
            disabled={similarTransactions.length === 0}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Ähnliche ({similarTransactions.length})
          </Button>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategorie auswählen" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Suggestion Banner */}
      {isAutoSuggested && selectedCategory === transaction.category && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
        >
          <Brain className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-700">
            Empfehlung: <strong>{suggestedCategory}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(suggestedCategory)}
            className="text-xs text-blue-600 ml-auto"
          >
            Übernehmen
          </Button>
        </motion.div>
      )}

      {/* Similar Transactions */}
      <AnimatePresence>
        {showSimilar && similarTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <AlertCircle className="h-3 w-3" />
              Ähnliche Transaktionen gefunden
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {similarTransactions.slice(0, 3).map((similar) => (
                <div
                  key={similar.id}
                  className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded text-xs"
                >
                  <span className="truncate flex-1">{similar.description}</span>
                  <Badge
                    variant="secondary"
                    className={`${getCategoryColor(similar.category)} text-xs`}
                  >
                    {similar.category}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkApply(selectedCategory)}
              className="text-xs w-full"
              disabled={!onBulkCategoryChange}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Auf alle ähnlichen anwenden ({similarTransactions.length + 1})
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <Button size="sm" onClick={handleSave} className="flex-1 text-xs">
          <Check className="h-3 w-3 mr-1" />
          Speichern
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex-1 text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Abbrechen
        </Button>
      </div>
    </motion.div>
  );
}

// Hilfsfunktion für Kategorie-Farben
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
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
    Sonstiges: "bg-gray-100 text-gray-800",
  };

  return colors[category] || "bg-gray-100 text-gray-800";
}
