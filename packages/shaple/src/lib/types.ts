import { GoTrueClientOptions } from '@supabase/gotrue-js'
import { PostgrestError } from '@supabase/postgrest-js'

export type ShapleClientOptions<SchemaName> = {
  global?: {
    headers?: Record<string, string>
  }
  auth?: GoTrueClientOptions
  db?: {
    schema?: SchemaName
  }
}

export type GenericTable = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
}

export type GenericUpdatableView = GenericTable

export type GenericNonUpdatableView = {
  Row: Record<string, unknown>
}

export type GenericView = GenericUpdatableView | GenericNonUpdatableView

export type GenericFunction = {
  Args: Record<string, unknown>
  Returns: unknown
}

export type GenericSchema = {
  Tables: Record<string, GenericTable>
  Views: Record<string, GenericView>
  Functions: Record<string, GenericFunction>
}

/**
 * Helper types for query results.
 */
export type QueryResult<T> = T extends PromiseLike<infer U> ? U : never
export type QueryData<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type QueryError = PostgrestError
