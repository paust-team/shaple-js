import {
	BrowserCookieAuthStorageAdapter,
	CookieOptionsWithName,
	ShapleClientOptionsWithoutAuth,
	createShapleClient
} from '@shaple/auth-helpers-shared';

import type { ShapleClient } from '@shaple/shaple';

let shaple: ShapleClient;

export function createClientComponentClient({
	shapleUrl = process.env.NEXT_PUBLIC_SHAPLE_URL,
	shapleKey = process.env.NEXT_PUBLIC_SHAPLE_ANON_KEY,
	options,
	cookieOptions,
	isSingleton = true
}: {
	shapleUrl?: string;
	shapleKey?: string;
	options?: ShapleClientOptionsWithoutAuth;
	cookieOptions?: CookieOptionsWithName;
	isSingleton?: boolean;
} = {}): ShapleClient {
	if (!shapleUrl || !shapleKey) {
		throw new Error(
			'either NEXT_PUBLIC_SHAPLE_URL and NEXT_PUBLIC_SHAPLE_ANON_KEY env variables or shapleUrl and shapleKey are required!'
		);
	}

	const createNewClient = () =>
		createShapleClient(shapleUrl, shapleKey, {
			...options,
			global: {
				...options?.global,
				headers: {
					...options?.global?.headers,
					'X-Client-Info': `${PACKAGE_NAME}@${PACKAGE_VERSION}`
				}
			},
			auth: {
				storage: new BrowserCookieAuthStorageAdapter(cookieOptions)
			}
		});

	if (isSingleton) {
		// The `Singleton` pattern is the default to simplify the instantiation
		// of a Supabase client across Client Components.
		const _shaple = shaple ?? createNewClient();
		// For SSG and SSR always create a new shaple client
		if (typeof window === 'undefined') return _shaple;
		// Create the shaple client once in the client
		if (!shaple) shaple = _shaple;
		return shaple;
	}

	// This allows for multiple shaple clients, which may be required when using
	// multiple schemas. The user will be responsible for ensuring a single
	// instance of shaple is used across Client Components, for each schema.
	return createNewClient();
}
