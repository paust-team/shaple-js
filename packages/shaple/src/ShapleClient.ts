import { GoTrueClient, GoTrueClientOptions } from '@supabase/gotrue-js'
import { StorageClient } from '@supabase/storage-js'
import { DEFAULT_AUTH_OPTIONS, DEFAULT_HEADERS } from './lib/constants'
import { Fetch, fetchWithAuth } from './lib/fetch'
import { PostgrestClient, PostgrestQueryBuilder } from '@supabase/postgrest-js'
import { GenericSchema, ShapleClientOptions } from './lib/types'

export class ShapleClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
> {
  public auth: GoTrueClient
  public authOptions: GoTrueClientOptions

  protected postgrest: PostgrestClient<Database, SchemaName>
  protected headers: Record<string, string>
  protected fetch?: Fetch

  constructor(
    protected shapleUrl: string,
    protected shapleKey: string,
    options?: ShapleClientOptions<SchemaName>
  ) {
    if (!shapleUrl) throw Error('shapleUrl is required.')
    if (!shapleKey) throw Error('shapleKey is required.')

    const globalHeaders = {
      ...DEFAULT_HEADERS,
      ...(options?.global?.headers ?? {}),
    } as Record<string, string>

    const authUrl = `${shapleUrl}/auth/v1`
    const defaultStorageKey = `shaple-${new URL(authUrl).hostname.split('.')[0]}-auth-token`
    const authOptions = {
      ...DEFAULT_AUTH_OPTIONS,
      storageKey: defaultStorageKey,
      ...(options?.auth ?? {}),
    } as GoTrueClientOptions

    this.auth = this._initGoTrueClient(authUrl, authOptions, globalHeaders)
    this.authOptions = authOptions
    this.headers = globalHeaders

    this.fetch = fetchWithAuth(shapleKey, this.getAccessToken.bind(this), this.fetch)

    const postgrestUrl = `${this.shapleUrl}/postgrest/v1`
    const postgrestOptions = {
      schema: 'public' as SchemaName,
      ...(options?.db ?? {}),
    }
    this.postgrest = new PostgrestClient<Database, SchemaName, Schema>(postgrestUrl, {
      headers: this.headers,
      schema: postgrestOptions.schema,
      fetch: this.fetch,
    })
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from: PostgrestClient<Database, SchemaName>['from'] = (relation: string) => {
    return this.postgrest.from(relation)
  }

  /**
   * Perform a query on a schema distinct from the default schema supplied via
   * the `options.db.schema` constructor parameter.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The name of the schema to query
   */
  schema: PostgrestClient<Database, SchemaName>['schema'] = <
    DynamicSchema extends string & keyof Database,
  >(
    schema: DynamicSchema
  ) => {
    return this.postgrest.schema<DynamicSchema>(schema)
  }

  get storage() {
    const storageUrl = `${this.shapleUrl}/storage/v1`
    return new StorageClient(storageUrl, this.headers, this.fetch)
  }

  private _initGoTrueClient(
    authUrl: string,
    options: GoTrueClientOptions,
    headers?: Record<string, string>
  ) {
    const authHeaders = {
      Authorization: `Bearer ${this.shapleKey}`,
      apikey: `${this.shapleKey}`,
    }

    return new GoTrueClient({
      ...options,
      url: authUrl,
      headers: { ...authHeaders, ...headers },
    })
  }

  private async getAccessToken() {
    const { data } = await this.auth.getSession()

    return data.session?.access_token ?? null
  }
}

export function createClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
>(
  shapleUrl: string,
  shapleKey: string,
  options?: ShapleClientOptions<SchemaName>
): ShapleClient<Database, SchemaName, Schema> {
  return new ShapleClient<Database, SchemaName, Schema>(shapleUrl, shapleKey, options)
}
