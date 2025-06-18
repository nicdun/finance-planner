import { vi, describe, it, expect, beforeEach } from "vitest";
import { Transaction } from "@/lib/types";

// Mock the supabase module directly without external variables
vi.mock("@/lib/supabase", () => {
  const mockSupabase = {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  };
  return {
    supabase: mockSupabase,
  };
});

// Import after mocking
import {
  getTransactions,
  createTransaction,
  updateTransactionCategory,
  bulkUpdateTransactionCategories,
  deleteTransaction,
} from "../transactions";
import { supabase } from "@/lib/supabase";

describe("Transactions Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default auth mock
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
  });

  const mockTransaction: Transaction = {
    id: "1",
    date: "2024-01-15",
    description: "Test Transaction",
    amount: -50,
    category: "Lebensmittel",
    type: "expense",
    accountId: "acc1",
  };

  describe("getTransactions", () => {
    it("should fetch all transactions successfully", async () => {
      const mockQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [{ ...mockTransaction, account_id: "acc1" }],
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await getTransactions();

      expect(supabase.from).toHaveBeenCalledWith("transactions");
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith(
        "user_id",
        "test-user-id"
      );
      expect(result).toEqual([mockTransaction]);
    });

    it("should handle database errors", async () => {
      const mockQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Database error"),
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await expect(getTransactions()).rejects.toThrow("Database error");
    });

    it("should handle authentication errors", async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: new Error("Not authenticated"),
      });

      await expect(getTransactions()).rejects.toThrow("Not authenticated");
    });
  });

  describe("createTransaction", () => {
    it("should create a new transaction successfully", async () => {
      const newTransaction: Omit<Transaction, "id"> = {
        date: "2024-01-15",
        description: "Test Transaction",
        amount: -50,
        category: "Lebensmittel",
        type: "expense",
        accountId: "acc1",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockTransaction, account_id: "acc1" },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createTransaction(newTransaction);

      expect(supabase.from).toHaveBeenCalledWith("transactions");
      expect(result).toEqual(mockTransaction);
    });

    it("should handle creation errors", async () => {
      const newTransaction: Omit<Transaction, "id"> = {
        date: "2024-01-15",
        description: "Test Transaction",
        amount: -50,
        category: "Lebensmittel",
        type: "expense",
        accountId: "acc1",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Creation failed"),
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await expect(createTransaction(newTransaction)).rejects.toThrow(
        "Creation failed"
      );
    });

    it("should determine transaction type based on amount", async () => {
      const incomeTransaction: Omit<Transaction, "id"> = {
        date: "2024-01-15",
        description: "Salary",
        amount: 3000,
        category: "Einkommen",
        type: "income",
        accountId: "acc1",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            ...mockTransaction,
            amount: 3000,
            type: "income",
            account_id: "acc1",
          },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createTransaction(incomeTransaction);

      expect(result.type).toBe("income");
      expect(result.amount).toBe(3000);
    });
  });

  describe("updateTransactionCategory", () => {
    it("should update transaction category successfully", async () => {
      const updatedTransaction = { ...mockTransaction, category: "Transport" };

      const mockQueryBuilder = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...updatedTransaction, account_id: "acc1" },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await updateTransactionCategory("1", "Transport");

      expect(supabase.from).toHaveBeenCalledWith("transactions");
      expect(result).toEqual(updatedTransaction);
    });

    it("should handle update errors", async () => {
      const mockQueryBuilder = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Update failed"),
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await expect(updateTransactionCategory("1", "Transport")).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("bulkUpdateTransactionCategories", () => {
    it("should update multiple transaction categories successfully", async () => {
      const transactionIds = ["1", "2", "3"];
      const updatedTransactions = [
        { ...mockTransaction, category: "Transport" },
        { ...mockTransaction, id: "2", category: "Transport" },
        { ...mockTransaction, id: "3", category: "Transport" },
      ];

      const mockQueryBuilder = {
        update: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: updatedTransactions.map((t) => ({ ...t, account_id: "acc1" })),
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await bulkUpdateTransactionCategories(
        transactionIds,
        "Transport"
      );

      expect(supabase.from).toHaveBeenCalledWith("transactions");
      expect(result).toEqual(updatedTransactions);
    });

    it("should handle bulk update errors", async () => {
      const transactionIds = ["1", "2"];

      const mockQueryBuilder = {
        update: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Bulk update failed"),
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await expect(
        bulkUpdateTransactionCategories(transactionIds, "Transport")
      ).rejects.toThrow("Bulk update failed");
    });

    it("should handle empty transaction IDs array", async () => {
      const result = await bulkUpdateTransactionCategories([], "Transport");
      expect(result).toEqual([]);
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe("deleteTransaction", () => {
    it("should delete a transaction successfully", async () => {
      const mockQueryBuilder = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await deleteTransaction("1");

      expect(supabase.from).toHaveBeenCalledWith("transactions");
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith("id", "1");
    });

    it("should handle deletion errors", async () => {
      const mockQueryBuilder = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Deletion failed"),
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await expect(deleteTransaction("1")).rejects.toThrow("Deletion failed");
    });
  });

  describe("Category management", () => {
    it("should handle uncategorized transactions", async () => {
      const newTransaction: Omit<Transaction, "id"> = {
        date: "2024-01-15",
        description: "Unknown Transaction",
        amount: -25,
        category: "Unbekannt",
        type: "expense",
        accountId: "acc1",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            ...mockTransaction,
            category: "Unbekannt",
            account_id: "acc1",
          },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createTransaction(newTransaction);

      expect(result.category).toBe("Unbekannt");
    });

    it("should validate category names", async () => {
      const categories = ["Einkommen", "Wohnen", "Transport", "Lebensmittel"];

      for (const category of categories) {
        const mockQueryBuilder = {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { ...mockTransaction, category, account_id: "acc1" },
            error: null,
          }),
        };

        (supabase.from as any).mockReturnValue(mockQueryBuilder);

        const result = await updateTransactionCategory("1", category);
        expect(result.category).toBe(category);
      }
    });
  });

  describe("Authentication and authorization", () => {
    it("should require authentication for all operations", async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: new Error("Not authenticated"),
      });

      // Test all functions that require authentication
      await expect(getTransactions()).rejects.toThrow("Not authenticated");
      await expect(
        createTransaction({
          date: "2024-01-15",
          description: "Test",
          amount: -50,
          category: "Test",
          type: "expense",
          accountId: "acc1",
        })
      ).rejects.toThrow("Not authenticated");
    });

    it("should handle user context correctly", async () => {
      const mockQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [{ ...mockTransaction, account_id: "acc1" }],
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await getTransactions();

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith(
        "user_id",
        "test-user-id"
      );
    });
  });

  describe("Error handling", () => {
    it("should handle network errors gracefully", async () => {
      const mockQueryBuilder = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Network error"),
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await expect(deleteTransaction("1")).rejects.toThrow("Network error");
    });

    it("should handle malformed data", async () => {
      const mockQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [{ ...mockTransaction, amount: "invalid", account_id: "acc1" }],
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await getTransactions();
      expect(isNaN(result[0].amount)).toBe(true);
    });
  });
});
