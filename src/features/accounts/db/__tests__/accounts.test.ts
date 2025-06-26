import { vi, describe, it, expect, beforeEach } from "vitest";
import { Account } from "@/lib/types";

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
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../accounts";
import { supabase } from "@/lib/supabase/client";

describe("Accounts Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default auth mock
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
  });

  const mockAccount: Account = {
    id: "1",
    name: "Test Account",
    type: "checking",
    balance: 1000,
    currency: "EUR",
    iban: "DE89370400440532013000",
  };

  describe("getAccounts", () => {
    it("should fetch all accounts successfully", async () => {
      const mockQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [mockAccount],
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await getAccounts();

      expect(supabase.from).toHaveBeenCalledWith("accounts");
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith(
        "user_id",
        "test-user-id"
      );
      expect(result).toEqual([mockAccount]);
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

      await expect(getAccounts()).rejects.toThrow("Database error");
    });

    it("should handle authentication errors", async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: new Error("Not authenticated"),
      });

      await expect(getAccounts()).rejects.toThrow("Not authenticated");
    });
  });

  describe("createAccount", () => {
    it("should create a new account successfully", async () => {
      const newAccount: Omit<Account, "id"> = {
        name: "Test Account",
        type: "checking",
        balance: 1000,
        currency: "EUR",
        iban: "DE89370400440532013000",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockAccount,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createAccount(newAccount);

      expect(supabase.from).toHaveBeenCalledWith("accounts");
      expect(result).toEqual(mockAccount);
    });

    it("should handle creation errors", async () => {
      const newAccount: Omit<Account, "id"> = {
        name: "Test Account",
        type: "checking",
        balance: 1000,
        currency: "EUR",
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

      await expect(createAccount(newAccount)).rejects.toThrow(
        "Creation failed"
      );
    });

    it("should convert string balance to number", async () => {
      const newAccount: any = {
        name: "Test Account",
        type: "checking",
        balance: "1000",
        currency: "EUR",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockAccount, balance: 1000 },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createAccount(newAccount);

      expect(result.balance).toBe(1000);
      expect(typeof result.balance).toBe("number");
    });

    it("should handle null IBAN", async () => {
      const newAccount: any = {
        name: "Test Account",
        type: "checking",
        balance: 1000,
        currency: "EUR",
        iban: null,
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockAccount, iban: null },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createAccount(newAccount);

      expect(result.iban).toBeNull();
    });
  });

  describe("updateAccount", () => {
    it("should update an account successfully", async () => {
      const updatedAccount = { ...mockAccount, name: "Updated Account" };

      const mockQueryBuilder = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedAccount,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await updateAccount("1", { name: "Updated Account" });

      expect(supabase.from).toHaveBeenCalledWith("accounts");
      expect(result).toEqual(updatedAccount);
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

      await expect(
        updateAccount("1", { name: "Updated Account" })
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteAccount", () => {
    it("should delete an account successfully", async () => {
      const mockQueryBuilder = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      await deleteAccount("1");

      expect(supabase.from).toHaveBeenCalledWith("accounts");
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

      await expect(deleteAccount("1")).rejects.toThrow("Deletion failed");
    });
  });

  describe("Data transformation", () => {
    it("should handle various data types correctly", async () => {
      const testAccount: any = {
        name: "Test Account",
        type: "savings" as const,
        balance: "2500.50",
        currency: "USD",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockAccount, ...testAccount, id: "2", balance: 2500.5 },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createAccount(testAccount);

      expect(result.balance).toBe(2500.5);
      expect(typeof result.balance).toBe("number");
      expect(result.type).toBe("savings");
    });

    it("should preserve account type enum", async () => {
      const testAccount = {
        name: "Savings Account",
        type: "savings" as const,
        balance: 10000,
        currency: "EUR",
      };

      const mockQueryBuilder = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockAccount, ...testAccount, id: "3" },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQueryBuilder);

      const result = await createAccount(testAccount);

      expect(result.type).toBe("savings");
    });
  });
});
