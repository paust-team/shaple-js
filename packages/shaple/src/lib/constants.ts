import { version } from './version'
import { GoTrueClientOptions } from '@supabase/auth-js/dist/module/lib/types'

const JS_ENV = (function () {
  // @ts-ignore
  if (typeof Deno !== 'undefined') {
    return 'deno'
  } else if (typeof document !== 'undefined') {
    return 'web'
  } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native'
  } else {
    return 'node'
  }
})() as string

export const DEFAULT_HEADERS = { 'X-Client-Info': `shaple-js-${JS_ENV}/${version}` }

export const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS,
}

export const DEFAULT_AUTH_OPTIONS: GoTrueClientOptions = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: 'implicit',
}
