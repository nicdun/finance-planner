# Transactions Page Tests

Diese Datei enthält umfassende Tests für die Transactions Page und alle damit verbundenen Features.

## Überblick

Die Tests sind in verschiedene Kategorien unterteilt:

### 1. Haupt-Page Tests (`index.test.tsx`)
- **Initial Loading**: Tests für den Ladevorgang beim ersten Aufruf
- **Error Handling**: Tests für Fehlerbehandlung und Retry-Mechanismen
- **Summary Cards**: Tests für die Anzeige von Einnahmen/Ausgaben/Netto
- **Search and Filtering**: Tests für Suchfunktionalität
- **Category Management**: Tests für Kategorie-Updates (einzeln und bulk)
- **Bulk Categorization**: Tests für die KI-Kategorisierung
- **Account Management**: Tests für das Hinzufügen von Konten
- **User Authentication**: Tests für Benutzer-Authentifizierung

### 2. Feature-Component Tests

#### TransactionFilters (`TransactionFilters.test.tsx`)
- Suchfunktionalität
- Kategorie- und Konto-Filter
- Filter zurücksetzen
- Aktive Filter-Anzeige

#### TransactionTable (`TransactionTable.test.tsx`)
- Transaktions-Darstellung
- Sortierung
- Kategorie-Änderungen
- Bulk-Auswahl und -Aktionen
- Fehlerbehandlung

### 3. Database Function Tests

#### Transactions DB (`transactions/db/__tests__/transactions.test.ts`)
- `getTransactions()` - Laden aller Transaktionen
- `createTransaction()` - Neue Transaktion erstellen
- `updateTransaction()` - Transaktion aktualisieren
- `deleteTransaction()` - Transaktion löschen
- `updateTransactionCategory()` - Kategorie ändern
- `bulkUpdateTransactionCategories()` - Bulk-Kategorie-Update

#### Accounts DB (`accounts/db/__tests__/accounts.test.ts`)
- `getAccounts()` - Laden aller Konten
- `createAccount()` - Neues Konto erstellen
- `updateAccount()` - Konto aktualisieren
- `deleteAccount()` - Konto löschen

## Mocking Strategy

### Supabase Integration
Alle Supabase-Calls werden gemockt, um:
- Tests schnell und unabhängig von der Datenbank zu machen
- Verschiedene Fehlerszenarien zu simulieren
- Vorhersagbare Testergebnisse zu gewährleisten

### UI Components
UI-Komponenten (shadcn/ui) werden gemockt, um:
- Tests auf die Geschäftslogik zu fokussieren
- Abhängigkeiten zu reduzieren
- Einfache Interaktions-Tests zu ermöglichen

### Router Integration
TanStack Router wird gemockt, um:
- Navigation zu testen ohne echtes Routing
- Link-Komponenten zu simulieren
- Route-Parameter zu mocken

## Test Data

### Mock Transactions
```typescript
const mockTransactions = [
  {
    id: "1",
    accountId: "acc1",
    amount: -50.0,
    description: "Supermarket Purchase",
    category: "Lebensmittel",
    date: "2024-01-15",
    type: "expense",
  },
  // ... weitere Transaktionen
];
```

### Mock Accounts
```typescript
const mockAccounts = [
  {
    id: "acc1",
    name: "Checking Account",
    type: "checking",
    balance: 1500.0,
    currency: "EUR",
    iban: "DE89370400440532013000",
  },
  // ... weitere Konten
];
```

## Tests ausführen

```bash
# Alle Tests ausführen
pnpm test

# Tests im Watch-Modus
pnpm test --watch

# Tests mit UI
pnpm test:ui

# Tests mit Coverage
pnpm test:coverage

# Nur Transactions-Tests
pnpm test src/routes/transactions

# Nur DB-Tests
pnpm test src/features/transactions/db
```

## Best Practices

### 1. Test Structure
- **Arrange**: Setup von Mocks und Test-Daten
- **Act**: Ausführung der zu testenden Aktion
- **Assert**: Überprüfung der Ergebnisse

### 2. Mocking
- Mocke externe Abhängigkeiten (Supabase, UI-Komponenten)
- Verwende `vi.clearAllMocks()` in `beforeEach`
- Setze realistische Mock-Antworten

### 3. Test Coverage
- Teste Happy Path und Error Cases
- Teste verschiedene User Interactions
- Teste Edge Cases (leere Daten, fehlende Accounts, etc.)

### 4. Assertions
- Verwende spezifische Assertions (`toHaveBeenCalledWith`)
- Teste sowohl UI-Zustand als auch Funktions-Aufrufe
- Verwende `waitFor` für asynchrone Operations

## Erweiterte Scenarios

### Error Handling Tests
```typescript
it("should handle network errors gracefully", async () => {
  (getTransactions as any).mockRejectedValue(new Error("Network error"));
  
  render(<TestComponent />);
  
  await waitFor(() => {
    expect(screen.getByText("Fehler beim Laden")).toBeInTheDocument();
  });
});
```

### User Interaction Tests
```typescript
it("should update transaction category on user interaction", async () => {
  render(<TestComponent />);
  
  const changeButton = screen.getByTestId("change-category-1");
  fireEvent.click(changeButton);
  
  await waitFor(() => {
    expect(updateTransactionCategory).toHaveBeenCalledWith("1", "New Category");
  });
});
```

## Troubleshooting

### Häufige Probleme

1. **Mock nicht erkannt**: Stelle sicher, dass Mocks vor Imports definiert sind
2. **Async Tests fehlschlagen**: Verwende `waitFor` für asynchrone Operations
3. **Component nicht gefunden**: Überprüfe `data-testid` Attribute
4. **Mock-Funktionen nicht aufgerufen**: Überprüfe Mock-Setup in `beforeEach`

### Debug-Tipps

```typescript
// Debug rendered output
screen.debug();

// Debug specific element
screen.debug(screen.getByTestId("specific-element"));

// Check mock calls
console.log((mockFunction as any).mock.calls);
``` 