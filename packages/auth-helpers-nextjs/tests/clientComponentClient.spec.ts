import {expect, describe, it} from 'vitest';
import {createClientComponentClient} from "../src";
import {BrowserCookieAuthStorageAdapter} from "@shaple/auth-helpers-shared";

describe('when create client for component', () => {
    it("should be existed storage", () => {
        const shaple = createClientComponentClient({
            shapleUrl: "http://localhost:8080",
            shapleKey: "Test",
        });

        // @ts-ignore
        expect(shaple.auth.storage).toBeInstanceOf(BrowserCookieAuthStorageAdapter);
    })
})