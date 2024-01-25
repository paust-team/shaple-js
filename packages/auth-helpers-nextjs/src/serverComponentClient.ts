import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	ShapleClientOptionsWithoutAuth,
	createShapleClient
} from '@shaple/auth-helpers-shared';
import { cookies } from 'next/headers';

import type { ShapleClient } from '@shaple/shaple';

class NextServerComponentAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context: {
			cookies: () => ReturnType<typeof cookies>;
		},
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const nextCookies = this.context.cookies();
		return nextCookies.get(name)?.value;
	}
	protected setCookie(name: string, value: string): void {
		// Server Components cannot set cookies. Must use Middleware, Server Action or Route Handler
		// https://github.com/vercel/next.js/discussions/41745#discussioncomment-5198848
	}
	protected deleteCookie(name: string): void {
		// Server Components cannot set cookies. Must use Middleware, Server Action or Route Handler
		// https://github.com/vercel/next.js/discussions/41745#discussioncomment-5198848
	}
}

export function createServerComponentClient(
	context: {
		cookies: () => ReturnType<typeof cookies>;
	},
	{
		shapleUrl = process.env.NEXT_PUBLIC_SHAPLE_URL,
		shapleKey = process.env.NEXT_PUBLIC_SHAPLE_ANON_KEY,
		options,
		cookieOptions
	}: {
		shapleUrl?: string;
		shapleKey?: string;
		options?: ShapleClientOptionsWithoutAuth;
		cookieOptions?: CookieOptionsWithName;
	} = {}
): ShapleClient {
	if (!shapleUrl || !shapleKey) {
		throw new Error(
			'either NEXT_PUBLIC_SHAPLE_URL and NEXT_PUBLIC_SHAPLE_ANON_KEY env variables or shapleUrl and shapleKey are required!'
		);
	}

	return createShapleClient(shapleUrl, shapleKey, {
		...options,
		global: {
			...options?.global,
			headers: {
				...options?.global?.headers,
				'X-Client-Info': `${PACKAGE_NAME}@${PACKAGE_VERSION}`
			}
		},
		auth: {
			storage: new NextServerComponentAuthStorageAdapter(context, cookieOptions)
		}
	});
}
