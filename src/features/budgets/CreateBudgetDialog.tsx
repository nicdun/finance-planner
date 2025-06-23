import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Palette } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBudget } from "@/features/budgets/db";
import { Budget } from "@/lib/types";

interface CreateBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetCreated: () => void;
}

interface CreateBudgetFormData {
  category: string;
  budgetAmount: number;
  period: Budget["period"];
  color: string;
}

const budgetCategories = [
  "Lebensmittel",
  "Transport",
  "Wohnen",
  "Unterhaltung",
  "Kleidung",
  "Gesundheit",
  "Bildung",
  "Sonstiges",
];

const budgetColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

export function CreateBudgetDialog({
  open,
  onOpenChange,
  onBudgetCreated,
}: CreateBudgetDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateBudgetFormData>({
    defaultValues: {
      category: "",
      budgetAmount: 0,
      period: "monthly",
      color: budgetColors[0],
    },
  });

  const onSubmit = async (data: CreateBudgetFormData) => {
    try {
      setLoading(true);

      const budgetData: Omit<Budget, "id"> = {
        category: data.category,
        budgetAmount: data.budgetAmount,
        period: data.period,
        color: data.color,
      };

      await createBudget(budgetData);

      form.reset();
      onBudgetCreated();
    } catch (error) {
      console.error("Error creating budget:", error);
      alert("Fehler beim Erstellen des Budgets");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neues Budget erstellen</DialogTitle>
          <DialogDescription>
            Definieren Sie ein neues Budget für eine Kategorie. Die
            tatsächlichen Ausgaben werden automatisch aus Ihren Transaktionen
            berechnet.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Kategorie ist erforderlich" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie eine Kategorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgetCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Budget Amount */}
            <FormField
              control={form.control}
              name="budgetAmount"
              rules={{
                required: "Budgetbetrag ist erforderlich",
                min: {
                  value: 0.01,
                  message: "Budgetbetrag muss größer als 0 sein",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monatliches Budgetlimit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Der maximale Betrag, den Sie monatlich für diese Kategorie
                    ausgeben möchten
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Period */}
            <FormField
              control={form.control}
              name="period"
              rules={{ required: "Zeitraum ist erforderlich" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zeitraum</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie einen Zeitraum" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monatlich</SelectItem>
                      <SelectItem value="yearly">Jährlich</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Hinweis: Die tatsächlichen Ausgaben werden immer monatlich
                    berechnet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farbe</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      {budgetColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            field.value === color
                              ? "border-gray-900 scale-110"
                              : "border-gray-300"
                          } transition-all`}
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Wählen Sie eine Farbe zur Identifikation des Budgets
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {form.watch("budgetAmount") > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-gray-50 rounded-lg border"
              >
                <h4 className="font-medium text-gray-900 mb-2">Vorschau</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monatliches Budget:</span>
                    <span className="font-medium">
                      {formatCurrency(form.watch("budgetAmount"))}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    💡 Die tatsächlichen Ausgaben werden automatisch aus Ihren
                    Transaktionen berechnet und hier angezeigt, sobald das
                    Budget erstellt ist.
                  </div>
                </div>
              </motion.div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Erstellen..." : "Budget erstellen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
