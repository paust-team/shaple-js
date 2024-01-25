'use client';

import {createClientComponentClient, User} from '@shaple/auth-helpers-nextjs';
import {useEffect, useState} from "react";

const EMAIL = 'abcd@abcd.com';

export default function Home() {
    const shaple = createClientComponentClient({
        shapleUrl: process.env.NEXT_PUBLIC_SHAPLE_URL,
        shapleKey: process.env.NEXT_PUBLIC_SHAPLE_KEY,
    });

    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        async function doIt() {
            const {data: {session}, error} = await shaple.auth.getSession();

            if (!session) {
                console.error(error);
                return;
            }

            setUser(session.user);
        }
        doIt();
    }, []);

    const createUser = async () => {
        const {status} = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                email: EMAIL,
                password: 'abcd',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('status: ', status);
    };

    const signIn = async () => {
        const {data: {user}, error} = await shaple.auth.signInWithPassword({
            email: EMAIL,
            password: 'abcd',
        });

        if (error) {
            console.error(error);
            return;
        }

        setUser(user);
    };

    const getUser = async () => {
        const resp = await fetch('/api/users');
        const data = await resp.json();

        if (resp.status == 200) {
            console.log('data: ', data);
        } else {
            console.log('status: ', resp.status);
        }
    };

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                {user && (<>
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <span className="font-bold">Email: </span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex flex-row">
                            <span className="font-bold">ID: </span>
                            <span>{user.id}</span>
                        </div>
                    </div>
                </>)}
                <div className="flex flex-row gap-x-2">
                    <button type="button" onClick={createUser} className="flex bg-blue-500 rounded-md text-white p-2">Create User</button>
                    <button type="button" onClick={signIn} className="flex bg-blue-500 rounded-md text-white p-2">Sign In</button>
                    <button type="button" onClick={getUser} className="flex bg-blue-500 rounded-md text-white p-2">Get User</button>
                </div>
            </main>
        </>
    );
}
