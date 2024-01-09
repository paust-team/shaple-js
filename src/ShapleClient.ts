import { GoTrueAdminApi, GoTrueClient } from '@supabase/auth-js'

export class ShapleClient {
  public auth: GoTrueClient
  public authAdmin: GoTrueAdminApi
  private url: String

  constructor({ url = 'http://localhost:8080' }: { url: String }) {
    this.url = url

    this.auth = new GoTrueClient({
      url: `${this.url}/auth/v1`,
    })
    this.authAdmin = new GoTrueAdminApi({
      url: `${this.url}/auth/v1/admin`,
    })
  }
}

export function createClient({ url }: { url: String }): ShapleClient {
  return new ShapleClient({ url })
}
