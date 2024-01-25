import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	createShapleClient,
	DefaultCookieOptions,
	parseCookies,
	serializeCookie,
	ShapleClientOptionsWithoutAuth
} from '@shaple/auth-helpers-shared';
import { NextResponse } from 'next/server';
import { splitCookiesString } from 'set-cookie-parser';

import type { NextRequest } from 'next/server';
import type { ShapleClient } from '@shaple/shaple';

class NextMiddlewareAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context: { req: NextRequest; res: NextResponse },
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const setCookie = splitCookiesString(
			this.context.res.headers.get('set-cookie')?.toString() ?? ''
		)
			.map((c) => parseCookies(c)[name])
			.find((c) => !!c);

		if (setCookie) {
			return setCookie;
		}

		const cookies = parseCookies(this.context.req.headers.get('cookie') ?? '');
		return cookies[name];
	}
	protected setCookie(name: string, value: string): void {
		this._setCookie(name, value);
	}
	protected deleteCookie(name: string): void {
		this._setCookie(name, '', {
			maxAge: 0
		});
	}

	private _setCookie(name: string, value: string, options?: DefaultCookieOptions) {
		const newSessionStr = serializeCookie(name, value, {
			...this.cookieOptions,
			...options,
			// Allow supabase-js on the client to read the cookie as well
			httpOnly: false
		});

		if (this.context.res.headers) {
			this.context.res.headers.append('set-cookie', newSessionStr);
		}
	}
}

export function createMiddlewareClient(
	context: { req: NextRequest; res: NextResponse },
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
			storage: new NextMiddlewareAuthStorageAdapter(context, cookieOptions),
		}
	});
}
