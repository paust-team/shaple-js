import { createClient } from '@shaple/shaple';
import { ShapleClientOptionsWithoutAuth } from './types';
import { isBrowser } from './utils';
import { StorageAdapter } from './cookieAuthStorageAdapter';

export function createShapleClient(
	shapleUrl: string,
	shapleKey: string,
	options: ShapleClientOptionsWithoutAuth & {
		auth: {
			storage: StorageAdapter;
			storageKey?: string;
		};
	}
) {
	const browser = isBrowser();

	return createClient(shapleUrl, shapleKey, {
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
