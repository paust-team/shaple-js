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
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { splitCookiesString } from 'set-cookie-parser';

import type { ShapleClient } from '@shaple/shaple';

class NextServerAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context:
			| GetServerSidePropsContext
			| { req: NextApiRequest; res: NextApiResponse },
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const setCookie = splitCookiesString(
			this.context.res?.getHeader('set-cookie')?.toString() ?? ''
		)
			.map((c) => parseCookies(c)[name])
			.find((c) => !!c);

		const value = setCookie ?? this.context.req?.cookies[name];
		return value;
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
		const setCookies = splitCookiesString(
			this.context.res.getHeader('set-cookie')?.toString() ?? ''
		).filter((c) => !(name in parseCookies(c)));

		const cookieStr = serializeCookie(name, value, {
			...this.cookieOptions,
			...options,
			// Allow shaple-js on the client to read the cookie as well
			httpOnly: false
		});

		this.context.res.setHeader('set-cookie', [...setCookies, cookieStr]);
	}
}

export function createPagesServerClient(
	context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
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
			storage: new NextServerAuthStorageAdapter(context, cookieOptions)
		}
	});
}
