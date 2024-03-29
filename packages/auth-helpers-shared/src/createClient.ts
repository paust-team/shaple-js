import {createClient} from '@shaple/shaple';
import {ShapleClientOptionsWithoutAuth} from './types';
import {isBrowser} from './utils';
import {StorageAdapter} from './cookieAuthStorageAdapter';
import {GenericSchema} from "@shaple/shaple";

export function createShapleClient<
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
  options: ShapleClientOptionsWithoutAuth<SchemaName> & {
    auth: {
      storage: StorageAdapter;
      storageKey?: string;
    };
  }
) {
  const browser = isBrowser();

  return createClient<Database, SchemaName, Schema>(shapleUrl, shapleKey, {
    ...options,
    auth: {
      flowType: 'pkce',
      autoRefreshToken: browser,
      detectSessionInUrl: browser,
      persistSession: true,
      storage: options.auth.storage,

      // fix this in supabase-js
      ...(options.auth?.storageKey
        ? {
          storageKey: options.auth.storageKey
        }
        : {})
    }
  });
}
