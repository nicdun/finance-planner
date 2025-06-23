import { supabase } from "./supabase";
import { ApiResponse, PaginatedResponse } from "./schemas";

// Custom error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
  }
}

// API Client wrapper
export class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async handleSupabaseError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error?.code === "PGRST116") {
      throw new ApiError("Datensatz nicht gefunden", 404, "NOT_FOUND");
    }

    if (error?.code === "23505") {
      throw new ApiError("Datensatz existiert bereits", 409, "DUPLICATE");
    }

    if (error?.code === "42501") {
      throw new ApiError(
        "Keine Berechtigung für diese Aktion",
        403,
        "FORBIDDEN"
      );
    }

    throw new ApiError(
      error?.message || "Ein unbekannter Fehler ist aufgetreten",
      500,
      error?.code || "UNKNOWN_ERROR"
    );
  }

  async get<T>(
    table: string,
    options: {
      select?: string;
      filter?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<ApiResponse<T[]>> {
    try {
      let query = supabase.from(table).select(options.select || "*");

      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? false,
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) {
        await this.handleSupabaseError(error);
      }

      return {
        data: data as T[],
        error: null,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        success: false,
      };
    }
  }

  async getPaginated<T>(
    table: string,
    page: number = 1,
    limit: number = 10,
    options: {
      select?: string;
      filter?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
    } = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count, error: countError } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (countError) {
        await this.handleSupabaseError(countError);
      }

      // Get data
      const result = await this.get<T>(table, {
        ...options,
        limit,
        offset,
      });

      if (!result.success || !result.data) {
        throw new ApiError(result.error || "Fehler beim Laden der Daten");
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: result.data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        success: false,
      };
    }
  }

  async getById<T>(
    table: string,
    id: string,
    select?: string
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(select || "*")
        .eq("id", id)
        .single();

      if (error) {
        await this.handleSupabaseError(error);
      }

      return {
        data: data as T,
        error: null,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        success: false,
      };
    }
  }

  async create<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        await this.handleSupabaseError(error);
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        success: false,
      };
    }
  }

  async update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        await this.handleSupabaseError(error);
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        success: false,
      };
    }
  }

  async delete(table: string, id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) {
        await this.handleSupabaseError(error);
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        success: false,
      };
    }
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
