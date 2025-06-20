import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Calendar, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  createFinancialGoal,
  calculateMonthlySavingsRate,
} from "@/features/goals/db";
import { FinancialGoal } from "@/lib/types";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: () => void;
}

interface CreateGoalFormData {
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  description?: string;
}

const goalCategories = [
  "Notfall",
  "Reise",
  "Transport",
  "Wohnen",
  "Bildung",
  "Gesundheit",
  "Sonstiges",
];

export function CreateGoalDialog({
  open,
  onOpenChange,
  onGoalCreated,
}: CreateGoalDialogProps) {
  const [loading, setLoading] = useState(false);
  const [previewSavingsRate, setPreviewSavingsRate] = useState<number | null>(
    null
  );

  const form = useForm<CreateGoalFormData>({
    defaultValues: {
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(),
      category: "",
      description: "",
    },
  });

  const watchedValues = form.watch();

  // Calculate preview savings rate when form values change
  useEffect(() => {
    if (watchedValues.targetAmount > 0 && watchedValues.targetDate) {
      const rate = calculateMonthlySavingsRate(
        watchedValues.targetAmount,
        watchedValues.currentAmount || 0,
        watchedValues.targetDate.toISOString().split("T")[0]
      );
      setPreviewSavingsRate(rate);
    } else {
      setPreviewSavingsRate(null);
    }
  }, [
    watchedValues.targetAmount,
    watchedValues.currentAmount,
    watchedValues.targetDate,
  ]);

  const onSubmit = async (data: CreateGoalFormData) => {
    try {
      setLoading(true);

      const goalData: Omit<FinancialGoal, "id"> = {
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        targetDate: data.targetDate.toISOString().split("T")[0],
        category: data.category,
      };

      await createFinancialGoal(goalData);

      form.reset();
      onGoalCreated();
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Fehler beim Erstellen des Sparziels");
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
          <DialogTitle>Neues Sparziel erstellen</DialogTitle>
          <DialogDescription>
            Definieren Sie ein neues Sparziel mit Zielbetrag und Wunschdatum.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Titel ist erforderlich" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel des Sparziels</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Notgroschen, Urlaub, Neues Auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {goalCategories.map((category) => (
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

            {/* Target Amount */}
            <FormField
              control={form.control}
              name="targetAmount"
              rules={{
                required: "Zielbetrag ist erforderlich",
                min: { value: 1, message: "Zielbetrag muss größer als 0 sein" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zielbetrag</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Der Betrag, den Sie erreichen möchten
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Amount */}
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aktueller Betrag (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Wie viel haben Sie bereits gespart?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Date */}
            <FormField
              control={form.control}
              name="targetDate"
              rules={{ required: "Zieldatum ist erforderlich" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Zieldatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: de })
                          ) : (
                            <span>Wählen Sie ein Datum</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Bis wann möchten Sie das Ziel erreichen?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Savings Rate Preview */}
            {previewSavingsRate && previewSavingsRate > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 p-4 rounded-lg border border-blue-200"
              >
                <h4 className="font-medium text-blue-900 mb-2">
                  Berechnete monatliche Sparrate:
                </h4>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(previewSavingsRate)}
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Diese Summe müssen Sie monatlich sparen, um Ihr Ziel
                  rechtzeitig zu erreichen.
                </p>
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
                {loading ? "Erstelle..." : "Sparziel erstellen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
