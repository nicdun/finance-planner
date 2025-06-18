import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  X,
  Calendar,
  DollarSign,
  Tag,
  Building,
} from "lucide-react";
import { Account } from "@/lib/types";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  categories: string[];
  accounts: Account[];
  onClearFilters: () => void;
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAccount,
  onAccountChange,
  categories,
  accounts,
  onClearFilters,
}: TransactionFiltersProps) {
  const activeFiltersCount = [selectedCategory, selectedAccount].filter(
    Boolean
  ).length;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Suche nach Beschreibung oder Kategorie..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Advanced Filters Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Erweiterte Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter</h4>
              <p className="text-sm text-muted-foreground">
                Verfeinern Sie Ihre Transaktionssuche
              </p>
            </div>
            <Separator />

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Kategorie
              </Label>
              <Select
                value={selectedCategory || "__all__"}
                onValueChange={(value) =>
                  onCategoryChange(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle Kategorien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Alle Kategorien</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Konto
              </Label>
              <Select
                value={selectedAccount || "__all__"}
                onValueChange={(value) =>
                  onAccountChange(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle Konten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Alle Konten</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter (Placeholder for future implementation) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Zeitraum
              </Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Calendar className="mr-2 h-4 w-4" />
                Zeitraum auswählen (Bald verfügbar)
              </Button>
            </div>

            {/* Amount Range Filter (Placeholder for future implementation) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Betrag
              </Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Betragsbereich (Bald verfügbar)
              </Button>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <>
                <Separator />
                <Button
                  variant="ghost"
                  onClick={onClearFilters}
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Alle Filter zurücksetzen
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
