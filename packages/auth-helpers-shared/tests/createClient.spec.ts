import { describe, expect, it } from 'vitest';
import {BrowserCookieAuthStorageAdapter, createShapleClient} from "../src";

describe('createClient', () => {
    it('should create a client with storage', () => {
        const storage = new BrowserCookieAuthStorageAdapter();
        const client = createShapleClient(
            "http://localhost:8080",
            "test",
            {
                auth: {
                    storage: storage,
                },
            },
        );

        expect(client.authOptions.storage).toBeTypeOf('object');
        expect(client.auth.storage).toBeInstanceOf(BrowserCookieAuthStorageAdapter);
    })
});