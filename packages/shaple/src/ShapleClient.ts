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

  constructor(url: string, options?: ShapleClientOptions) {
    this.auth = new GoTrueClient({
      ...(options?.auth ?? {}),
      url: `${url}/auth/v1`,
      ...(options?.global?.headers ?? {}),
    })
  }
}

export function createClient(url: string, options?: ShapleClientOptions): ShapleClient {
  return new ShapleClient(url, options)
}
