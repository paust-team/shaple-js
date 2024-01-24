'use client';
import {createClient, ShapleClient} from "@shaple/shaple";
import {createContext} from "react";

export const Shaple = createContext<ShapleClient|null>(null);

export function ShapleProvider({children}: { children: React.ReactNode }) {
    const shaple = createClient(
        "http://b5gzr49xt6rfcggy7g4h4ftxx.local.shaple.io",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbnltb3VzIn0.YlWSVNFAJOCqtz9ygfrD9-u7ShfDaJWWer19yUo0W94"
    );

    return (
        <Shaple.Provider value={shaple}>
            {children}
        </Shaple.Provider>
    );
}