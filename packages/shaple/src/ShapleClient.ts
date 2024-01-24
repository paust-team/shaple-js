import { GoTrueClient } from '@supabase/auth-js'
import { GoTrueClientOptions } from '@supabase/auth-js/dist/module/lib/types'

export type ShapleClientOptions = {
  global?: {
    headers?: Record<string, string>
  }
  auth?: GoTrueClientOptions
}

export class ShapleClient {
  public auth: GoTrueClient

  constructor(
      protected shapleUrl: string,
      protected shapleKey: string,
      options?: ShapleClientOptions,
    ) {
    if (!shapleUrl) throw Error('shapleUrl is required.')
    if (!shapleKey) throw Error('shapleKey is required.')

    const authUrl = `${shapleUrl}/auth/v1`;
    this.auth = this._initGoTrueClient(
        authUrl,
        options?.auth ?? {},
        options?.global?.headers ?? {},
    )
  }

  private _initGoTrueClient(
      authUrl: string,
      options: GoTrueClientOptions,
      headers?: Record<string, string>,
  ) {
    const authHeaders = {
      Authorization: `Bearer ${this.shapleKey}`,
      apikey: `${this.shapleKey}`,
    };

    return new GoTrueClient({
        ...options,
        url: authUrl,
        headers: { ...authHeaders, ...headers },
    });
  }
}

export function createClient(shapleUrl: string, shapleKey: string, options?: ShapleClientOptions): ShapleClient {
  return new ShapleClient(shapleUrl, shapleKey, options)
}
