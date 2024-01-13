import type { CookieSerializeOptions } from 'cookie';
import type { ShapleClientOptions } from '@shaple/shaple';

export type CookieOptions = Pick<CookieSerializeOptions, 'domain' | 'secure' | 'path' | 'sameSite'>;

export type DefaultCookieOptions = Pick<
	CookieSerializeOptions,
	'domain' | 'secure' | 'path' | 'sameSite' | 'maxAge'
>;

export type CookieOptionsWithName = { name?: string } & CookieOptions;

export type ShapleClientOptionsWithoutAuth = Omit<
	ShapleClientOptions,
	'auth'
>;
