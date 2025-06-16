import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          name: string;
          type: "checking" | "savings" | "credit" | "investment";
          balance: number;
          currency: string;
          iban: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "checking" | "savings" | "credit" | "investment";
          balance?: number;
          currency?: string;
          iban?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "checking" | "savings" | "credit" | "investment";
          balance?: number;
          currency?: string;
          iban?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          account_id: string;
          amount: number;
          description: string;
          category: string;
          date: string;
          type: "income" | "expense";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          amount: number;
          description: string;
          category: string;
          date: string;
          type: "income" | "expense";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          amount?: number;
          description?: string;
          category?: string;
          date?: string;
          type?: "income" | "expense";
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          category: string;
          budget_amount: number;
          spent_amount: number;
          period: "monthly" | "yearly";
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          budget_amount: number;
          spent_amount?: number;
          period: "monthly" | "yearly";
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          budget_amount?: number;
          spent_amount?: number;
          period?: "monthly" | "yearly";
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      financial_goals: {
        Row: {
          id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          target_date: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          target_amount: number;
          current_amount?: number;
          target_date: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
