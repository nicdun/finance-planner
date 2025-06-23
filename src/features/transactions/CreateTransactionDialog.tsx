import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { CalendarDays, Receipt } from "lucide-react";
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
import { createTransaction } from "@/features/transactions/db";
import { Transaction, Account } from "@/lib/types";

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionCreated: () => void;
  accounts: Account[];
}

interface CreateTransactionFormData {
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense";
}

const transactionCategories = [
  // Expense categories
  "Lebensmittel",
  "Transport",
  "Wohnen",
  "Unterhaltung",
  "Gesundheit",
  "Bildung",
  "Kleidung",
  "Restaurants",
  "Einkaufen",
  "Versicherung",
  "Steuern",
  "Sonstiges",
  // Income categories
  "Gehalt",
  "Bonus",
  "Freelancing",
  "Zinsen",
  "Dividenden",
  "Geschenk",
  "Verkauf",
  "Erstattung",
];

export function CreateTransactionDialog({
  open,
  onOpenChange,
  onTransactionCreated,
  accounts,
}: CreateTransactionDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateTransactionFormData>({
    defaultValues: {
      accountId: "",
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
      type: "expense",
    },
  });

  const watchedType = form.watch("type");

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      setLoading(true);

      // Ensure amount is negative for expenses, positive for income
      const adjustedAmount =
        data.type === "expense"
          ? -Math.abs(data.amount)
          : Math.abs(data.amount);

      const transactionData: Omit<Transaction, "id"> = {
        accountId: data.accountId,
        amount: adjustedAmount,
        description: data.description,
        category: data.category,
        date: data.date.toISOString().split("T")[0],
        type: data.type,
      };

      await createTransaction(transactionData);

      form.reset();
      onTransactionCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Fehler beim Erstellen der Transaktion");
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

  // Filter categories based on transaction type
  const availableCategories = transactionCategories.filter((category) => {
    const incomeCategories = [
      "Gehalt",
      "Bonus",
      "Freelancing",
      "Zinsen",
      "Dividenden",
      "Geschenk",
      "Verkauf",
      "Erstattung",
    ];
    return watchedType === "income"
      ? incomeCategories.includes(category)
      : !incomeCategories.includes(category);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Neue Transaktion erstellen
          </DialogTitle>
          <DialogDescription>
            Fügen Sie eine manuelle Transaktion zu Ihrem Konto hinzu.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Selection */}
            <FormField
              control={form.control}
              name="accountId"
              rules={{ required: "Konto ist erforderlich" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie ein Konto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Typ ist erforderlich" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaktionstyp</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie den Typ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Ausgabe</SelectItem>
                      <SelectItem value="income">Einnahme</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              rules={{
                required: "Betrag ist erforderlich",
                min: { value: 0.01, message: "Betrag muss größer als 0 sein" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Betrag</FormLabel>
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
                    {watchedType === "expense"
                      ? "Betrag der Ausgabe (wird automatisch als negativ gespeichert)"
                      : "Betrag der Einnahme"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Beschreibung ist erforderlich" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Supermarkt, Tankstelle, Gehalt"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Eine kurze Beschreibung der Transaktion
                  </FormDescription>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie eine Kategorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Kategorien werden je nach Transaktionstyp gefiltert
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              rules={{ required: "Datum ist erforderlich" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaktionsdatum</FormLabel>
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Wann fand die Transaktion statt?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {form.watch("amount") > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  watchedType === "expense"
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <h4
                  className={`font-medium mb-2 ${
                    watchedType === "expense"
                      ? "text-red-900"
                      : "text-green-900"
                  }`}
                >
                  Transaktionsvorschau:
                </h4>
                <div
                  className={`text-2xl font-bold ${
                    watchedType === "expense"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {watchedType === "expense" ? "-" : "+"}
                  {formatCurrency(form.watch("amount"))}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    watchedType === "expense"
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {watchedType === "expense"
                    ? "Diese Ausgabe wird von Ihrem Kontostand abgezogen"
                    : "Diese Einnahme wird zu Ihrem Kontostand hinzugefügt"}
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
              <Button type="submit" disabled={loading || accounts.length === 0}>
                {loading ? "Erstelle..." : "Transaktion erstellen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
