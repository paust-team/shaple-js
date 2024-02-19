import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	ShapleClientOptionsWithoutAuth,
	createShapleClient
} from '@shaple/auth-helpers-shared';
import { cookies } from 'next/headers';

import type { ShapleClient, GenericSchema } from '@shaple/shaple';

class NextRouteHandlerAuthStorageAdapter extends CookieAuthStorageAdapter {
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
		const nextCookies = this.context.cookies();
		nextCookies.set(name, value, this.cookieOptions);
	}
	protected deleteCookie(name: string): void {
		const nextCookies = this.context.cookies();
		nextCookies.set(name, '', {
			...this.cookieOptions,
			maxAge: 0
		});
	}
}

export function createRouteHandlerClient<
	Database = any,
	SchemaName extends string & keyof Database = 'public' extends keyof Database
		? 'public'
		: string & keyof Database,
	Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
		? Database[SchemaName]
		: any,
>(
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
		options?: ShapleClientOptionsWithoutAuth<SchemaName>;
		cookieOptions?: CookieOptionsWithName;
	} = {}
): ShapleClient<Database, SchemaName, Schema> {
	if (!shapleUrl || !shapleKey) {
		throw new Error(
			'either NEXT_PUBLIC_SHAPLE_URL and NEXT_PUBLIC_SHAPLE_ANON_KEY env variables or shapleUrl and shapleKey are required!'
		);
	}

	return createShapleClient<Database, SchemaName, Schema>(shapleUrl, shapleKey, {
		...options,
		global: {
			...options?.global,
			headers: {
				...options?.global?.headers,
				'X-Client-Info': `${PACKAGE_NAME}@${PACKAGE_VERSION}`
			}
		},
		auth: {
			storage: new NextRouteHandlerAuthStorageAdapter(context, cookieOptions)
		}
	});
}
