import { GoTrueClient, GoTrueClientOptions } from '@supabase/auth-js'
import { DEFAULT_AUTH_OPTIONS, DEFAULT_HEADERS } from './lib/constants'

export type ShapleClientOptions = {
  global?: {
    headers?: Record<string, string>
  }
  auth?: GoTrueClientOptions
}

export class ShapleClient {
  public auth: GoTrueClient
  public authOptions: GoTrueClientOptions

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
}

export function createClient(
  shapleUrl: string,
  shapleKey: string,
  options?: ShapleClientOptions
): ShapleClient {
  return new ShapleClient(shapleUrl, shapleKey, options)
}
