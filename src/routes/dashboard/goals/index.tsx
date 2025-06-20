import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardHeader } from "../_components/DashboardHeader";
import { FinancialGoal } from "@/lib/types";
import {
  getFinancialGoals,
  deleteFinancialGoal,
  getGoalProgressStats,
} from "@/features/goals/db";
import { CreateGoalDialog } from "@/features/goals/CreateGoalDialog";
import { EditGoalDialog } from "@/features/goals/EditGoalDialog";

export const Route = createFileRoute("/dashboard/goals/")({
  component: GoalsPage,
});

function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getFinancialGoals();
      setGoals(data);
      setError(null);
    } catch (err) {
      setError("Fehler beim Laden der Sparziele");
      console.error("Error loading goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Möchten Sie dieses Sparziel wirklich löschen?")) {
      return;
    }

    try {
      await deleteFinancialGoal(goalId);
      await loadGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
      alert("Fehler beim Löschen des Sparziels");
    }
  };

  const handleGoalCreated = () => {
    setShowCreateDialog(false);
    loadGoals();
  };

  const handleGoalUpdated = () => {
    setEditingGoal(null);
    loadGoals();
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
          <Button onClick={loadGoals} className="mt-4">
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
                Sparziele & Budgetplanung
              </h1>
              <p className="text-gray-600 mt-2">
                Verwalten Sie Ihre Sparziele und verfolgen Sie Ihren Fortschritt
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Neues Sparziel
            </Button>
          </div>

          {/* Goals Grid */}
          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Noch keine Sparziele definiert
              </h3>
              <p className="text-gray-600 mb-6">
                Erstellen Sie Ihr erstes Sparziel, um strukturiert darauf
                hinzuarbeiten
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Erstes Sparziel erstellen
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal, index) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onEdit={() => setEditingGoal(goal)}
                  onDelete={() => handleDeleteGoal(goal.id)}
                />
              ))}
            </div>
          )}

          {/* Dialogs */}
          <CreateGoalDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onGoalCreated={handleGoalCreated}
          />

          {editingGoal && (
            <EditGoalDialog
              goal={editingGoal}
              open={!!editingGoal}
              onOpenChange={(open) => !open && setEditingGoal(null)}
              onGoalUpdated={handleGoalUpdated}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface GoalCardProps {
  goal: FinancialGoal;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function GoalCard({ goal, index, onEdit, onDelete }: GoalCardProps) {
  const stats = getGoalProgressStats(goal);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (stats.progressPercentage >= 100) {
      return <Badge className="bg-green-100 text-green-800">Erreicht</Badge>;
    }
    if (stats.daysRemaining < 30) {
      return <Badge variant="destructive">Dringend</Badge>;
    }
    if (stats.isOnTrack) {
      return <Badge className="bg-blue-100 text-blue-800">Im Plan</Badge>;
    }
    return <Badge variant="secondary">Hinter Plan</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-medium flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
              {goal.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="outline">{goal.category}</Badge>
              {getStatusBadge()}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fortschrittsbalken */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fortschritt</span>
              <span className="font-medium">
                {stats.progressPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={stats.progressPercentage} className="h-2" />
          </div>

          {/* Beträge */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aktuell:</span>
              <span className="font-medium">
                {formatCurrency(goal.currentAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ziel:</span>
              <span className="font-medium">
                {formatCurrency(goal.targetAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Noch benötigt:</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(stats.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Sparrate und Zeitinfo */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monatliche Sparrate:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(stats.monthlySavingsRate)}
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Zieldatum:
              </span>
              <span className="font-medium">{formatDate(goal.targetDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Verbleibend:</span>
              <span className="font-medium">{stats.daysRemaining} Tage</span>
            </div>
          </div>

          {/* Tipp zur Sparrate */}
          {stats.remainingAmount > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Spar-Tipp:</p>
                  <p className="text-blue-700">
                    Sparen Sie {formatCurrency(stats.monthlySavingsRate)} pro
                    Monat, um Ihr Ziel rechtzeitig zu erreichen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
