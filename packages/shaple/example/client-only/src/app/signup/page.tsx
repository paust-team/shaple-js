'use client';
import React, {useContext} from "react";
import SignUp, {SignUpData} from "@/components/SignUp";
import {useRouter} from "next/navigation";
import { Shaple } from "@/components/Shaple";

export default function SignUpPage() {
    const shaple = useContext(Shaple)!;
    const router = useRouter();
    const [disabled, setDisabled] = React.useState<boolean>(false);

    const cancel = () => {
        router.replace('/');
    };

    const signUp = async (data: SignUpData) => {
        setDisabled(true);
        try {
            if (data.email == "") {
                alert("Please enter your email.");
                return;
            }
            if (data.password == "") {
                alert("Please enter your password.");
                return;
            }
            if (data.passwordConfirm == "") {
                alert("Please enter your password confirm.");
                return;
            }
            if (data.password != data.passwordConfirm) {
                alert("Password and password confirm do not match.");
                return;
            }

            console.log(data);
            await shaple.auth.signUp(data);
            await router.push('/login');
        } finally {
            setDisabled(false);
        }
    }

    return (
        <div className="flex flex-col justify-center h-full max-w-md mx-auto">
            <SignUp onCancel={cancel} onSignUp={signUp} disabled={disabled}/>
        </div>
    );
}