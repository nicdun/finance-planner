import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  PiggyBank,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
  AlertTriangle,
  Star,
  StarOff,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardHeader } from "../-components/DashboardHeader";
import { Budget } from "@/lib/types";
import {
  getBudgetsWithSpending,
  deleteBudget,
  getBudgetProgressStats,
  toggleTopBudget,
} from "@/features/budgets/db";
import { CreateBudgetDialog } from "@/features/budgets/CreateBudgetDialog";
import { EditBudgetDialog } from "@/features/budgets/EditBudgetDialog";

export const Route = createFileRoute("/dashboard/budget/")({
  component: BudgetPage,
});

function BudgetPage() {
  const [budgets, setBudgets] = useState<(Budget & { spentAmount: number })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgetsWithSpending();
      setBudgets(data);
      setError(null);
    } catch (err) {
      setError("Fehler beim Laden der Budgets");
      console.error("Error loading budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Möchten Sie dieses Budget wirklich löschen?")) {
      return;
    }

    try {
      await deleteBudget(budgetId);
      await loadBudgets();
    } catch (err) {
      console.error("Error deleting budget:", err);
      alert("Fehler beim Löschen des Budgets");
    }
  };

  const handleBudgetCreated = () => {
    setShowCreateDialog(false);
    loadBudgets();
  };

  const handleBudgetUpdated = () => {
    setEditingBudget(null);
    loadBudgets();
  };

  const handleToggleTopBudget = async (
    budgetId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleTopBudget(budgetId, !currentStatus);
      await loadBudgets();
    } catch (err) {
      console.error("Error toggling top budget:", err);
      alert("Fehler beim Aktualisieren des Top-Budget Status");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={loadBudgets} className="mt-4">
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Budget-Verwaltung
              </h1>
              <p className="text-gray-600 mt-2">
                Verwalten Sie Ihre Budgets und behalten Sie Ihre Ausgaben im
                Blick
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Neues Budget
            </Button>
          </div>

          {/* Budget Overview Cards */}
          {budgets.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aktive Budgets
                  </CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{budgets.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gesamt Budget
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(
                      budgets.reduce(
                        (sum, budget) => sum + budget.budgetAmount,
                        0
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gesamt Ausgegeben
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(
                      budgets.reduce(
                        (sum, budget) => sum + budget.spentAmount,
                        0
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Überschrittene Budgets
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {
                      budgets.filter(
                        (budget) => budget.spentAmount > budget.budgetAmount
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Budgets Grid */}
          {budgets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <PiggyBank className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Noch keine Budgets definiert
              </h3>
              <p className="text-gray-600 mb-6">
                Erstellen Sie Ihr erstes Budget, um Ihre Ausgaben zu verwalten
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Erstes Budget erstellen
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {budgets.map((budget, index) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  index={index}
                  onEdit={() =>
                    setEditingBudget({
                      id: budget.id,
                      category: budget.category,
                      budgetAmount: budget.budgetAmount,
                      period: budget.period,
                      color: budget.color,
                    })
                  }
                  onDelete={() => handleDeleteBudget(budget.id)}
                  onToggleTopBudget={handleToggleTopBudget}
                />
              ))}
            </div>
          )}

          {/* Dialogs */}
          <CreateBudgetDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onBudgetCreated={handleBudgetCreated}
          />

          {editingBudget && (
            <EditBudgetDialog
              budget={editingBudget}
              open={!!editingBudget}
              onOpenChange={(open) => !open && setEditingBudget(null)}
              onBudgetUpdated={handleBudgetUpdated}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface BudgetCardProps {
  budget: Budget & { spentAmount: number };
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleTopBudget: (budgetId: string, currentStatus: boolean) => void;
}

function BudgetCard({
  budget,
  index,
  onEdit,
  onDelete,
  onToggleTopBudget,
}: BudgetCardProps) {
  const stats = getBudgetProgressStats(budget);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getPeriodLabel = (period: Budget["period"]) => {
    return period === "monthly" ? "Monatlich" : "Jährlich";
  };

  const getStatusBadge = () => {
    if (stats.isOverBudget) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Überschritten
        </Badge>
      );
    } else if (stats.progressPercentage >= 80) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Warnung
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Im Budget
        </Badge>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: budget.color }}
        />

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{budget.category}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{getPeriodLabel(budget.period)}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onToggleTopBudget(budget.id, budget.isTopBudget || false)
                }
                className={`h-8 w-8 p-0 ${
                  budget.isTopBudget
                    ? "text-yellow-600 hover:text-yellow-700"
                    : "text-gray-400 hover:text-yellow-600"
                }`}
                title={
                  budget.isTopBudget
                    ? "Als Top-Budget entfernen"
                    : "Als Top-Budget markieren"
                }
              >
                {budget.isTopBudget ? (
                  <Star className="h-3 w-3 fill-current" />
                ) : (
                  <StarOff className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            {getStatusBadge()}
            <span className="text-sm text-gray-600">
              {Math.round(stats.progressPercentage)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress
              value={Math.min(100, stats.progressPercentage)}
              className="h-2"
              style={{
                background: stats.isOverBudget ? "#fee2e2" : undefined,
              }}
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Ausgegeben: {formatCurrency(budget.spentAmount)}</span>
              <span>Budget: {formatCurrency(budget.budgetAmount)}</span>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Verbleibt:</span>
              <span
                className={`font-medium ${
                  stats.remainingAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(stats.remainingAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
