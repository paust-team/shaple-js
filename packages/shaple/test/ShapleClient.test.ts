import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {createClient, ShapleClient, StorageError} from "../src";

test('new shaple', () => {
    const shaple = createClient("http://localhost:8080", "123123")
    expect(shaple).toBeDefined()
})

describe('shaple client', () => {
    let shaple: ShapleClient = null
    let adminShaple: ShapleClient = null
    beforeEach(async () => {
        shaple = createClient(process.env.VITE_SHAPLE_URL, process.env.VITE_SHAPLE_ANON_KEY)
        adminShaple = createClient(process.env.VITE_SHAPLE_URL, process.env.VITE_SHAPLE_ADMIN_KEY)
    })

    afterEach(async () => {
        {
            const {data: {users}, error} = await adminShaple.auth.admin.listUsers()
            expect(error).toBeNull()
            for (const user of users) {
                const {error} = await adminShaple.auth.admin.deleteUser(user.id)
                expect(error).toBeNull()
            }
        }

        const {data: buckets, error: bucketError} = await adminShaple.storage.listBuckets()
        expect(bucketError).toBeNull()
        for (const bucket of buckets) {
            const {error: emptyBucketError} = await adminShaple.storage.emptyBucket(bucket.id)
            expect(emptyBucketError).toBeNull()
            const {error: deleteBucketError} = await adminShaple.storage.deleteBucket(bucket.id)
            expect(deleteBucketError).toBeNull()
        }

        const {error} = await adminShaple.schema("public").from("people").delete()
        console.error("delete schema error: ", error)
        expect(error).toBeNull()
    })

    const signUp = async () => {
        await shaple.auth.signOut()
        const {data: {session}, error} = await shaple.auth.signUp({
            email: "dennis.park@paust.io",
            password: "q1w2E#R$",
            options: {
                data: {
                    name: "Dennis Park"
                },
            },
        })

        console.log(error)
        expect(error).toBeNull()
    }

    const signIn = async () => {
        const {data: {session}, error} = await shaple.auth.signInWithPassword({
            email: "dennis.park@paust.io",
            password: "q1w2E#R$",
        })

        console.log(error)
        expect(error).toBeNull()

        expect(session.user.user_metadata.name).toBe("Dennis Park")
    }


    test('when signUp, then signInWithPassword should be ok', async () => {
        await signUp()
        await signIn()
    })

    test("when upload storage object authenticated, then it should be downloadable", async () => {
        await signUp()
        await signIn()

        const expectedBucketName = "test-123"
        const {data: bucket, error} = await shaple.storage.createBucket(expectedBucketName, {
            public: false,
        })

        console.error(error)
        expect(error).toBeNull()
        expect(bucket.name).toBe(expectedBucketName)

        const {error: fileError} = await shaple.storage.from(expectedBucketName).upload("shaple/a.txt", "hello world", {
            upsert: true,
        })

        expect(fileError).toBeNull()

        const {data: file, error: getError} = await shaple.storage.from(expectedBucketName).download("shaple/a.txt")
        expect(getError).toBeNull()

        const text = await file.text()
        expect(text).toBe("hello world")
    })

    test("when insert people data, should be ok", async () => {
        await signUp()
        await signIn()
        const {error} = await shaple.schema("public").from("people").insert({
            name: "Dennis Park",
            age: 30,
        })

        console.error("insert error: ", error)
        expect(error).toBeNull()
    })
})