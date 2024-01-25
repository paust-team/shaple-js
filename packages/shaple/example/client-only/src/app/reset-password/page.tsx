'use client';
import ResetPassword from "@/components/ResetPassword";
import {useContext, useState} from "react";
import {useRouter} from "next/navigation";
import {Shaple} from "@/components/Shaple";

export default function ResetPasswordPage() {
    const [disabled, setDisabled] = useState<boolean>(false);
    const router = useRouter();
    const shaple = useContext(Shaple)!;

    // const hash = window.location.hash.replace("#", "");
    // const params = new URLSearchParams(hash);

    const onSubmit = async (password: string, passwordConfirm: string) => {
        setDisabled(true);

        try {
            if (password == "") {
                alert("Please enter your password.");
                return;
            }
            if (passwordConfirm == "") {
                alert("Please enter your password confirm.");
                return;
            }
            if (password != passwordConfirm) {
                alert("Password and password confirm do not match.");
                return;
            }

            await shaple.auth.updateUser({password});

            await router.push('/login');
        } finally {
            setDisabled(false);
        }
    }

    return (
        <ResetPassword disabled={disabled} onSubmit={onSubmit}/>
    );
}
