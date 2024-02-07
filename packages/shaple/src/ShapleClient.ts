import { GoTrueClient, GoTrueClientOptions } from '@supabase/gotrue-js';
import { StorageClient } from '@supabase/storage-js';
import { DEFAULT_AUTH_OPTIONS, DEFAULT_HEADERS } from './lib/constants';
import { Fetch, fetchWithAuth } from './lib/fetch';

export type ShapleClientOptions = {
  global?: {
    headers?: Record<string, string>
  }
  auth?: GoTrueClientOptions
}

export class ShapleClient {
  public auth: GoTrueClient
  public authOptions: GoTrueClientOptions

  protected headers: Record<string, string>
  protected fetch?: Fetch

  constructor(
    protected shapleUrl: string,
    protected shapleKey: string,
    options?: ShapleClientOptions
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

export function createClient(
  shapleUrl: string,
  shapleKey: string,
  options?: ShapleClientOptions
): ShapleClient {
  return new ShapleClient(shapleUrl, shapleKey, options)
}
