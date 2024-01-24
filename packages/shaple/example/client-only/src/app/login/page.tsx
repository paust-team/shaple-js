'use client';
import React, {useContext} from "react";
import Login, {LoginData} from "@/components/Login";
import { Shaple } from "@/components/Shaple";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const shaple = useContext(Shaple)!;
    const router = useRouter();

    const login = async (data: LoginData) => {
        await shaple.auth.signInWithPassword(data);
        router.push('/');
    }

    const resetPassword = async (email: string) => {
        await shaple.auth.resetPasswordForEmail(email, {redirectTo: "http://localhost:3000/reset-password"});
    }

    return (
        <Login onLogin={login} onResetPassword={resetPassword}/>
    );
}
