import {useState} from "react";
import Image from "next/image";
import classNames from "classnames";

export type SignUpProps = {
    onSubmit: (
        password: string,
        passwordConfirm: string,
    ) => void,
    disabled?: boolean,
}

export default function ResetPassword({
                                   onSubmit,
                                   disabled,
                               }: SignUpProps) {
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    if (!disabled) {
        disabled = false;
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(
                password,
                passwordConfirm,
            );
        }}>
            <div className="space-y-12">
                <div className="border-b border-white/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-white">Reset Password</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        Provided by Shaple
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-full">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                Password
                            </label>
                            <div className="mt-2">
                                <div
                                    className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="flex-1 border-0 bg-transparent py-1.5 px-4 text-white focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="********"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-full">
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-6 text-white">
                                Password Confirm
                            </label>
                            <div className="mt-2">
                                <div
                                    className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                    <input
                                        type="password"
                                        name="passwordConfirm"
                                        id="passwordConfirm"
                                        className="flex-1 border-0 bg-transparent py-1.5 px-4 text-white focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="********"
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    className={classNames(
                        "flex gap-x-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                    disabled={disabled}
                >
                    {!disabled ?
                        null
                        : <Image
                            src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/90-ring-with-bg-white-36.svg"
                            alt="spinner" width="24" height="24" className="-mx-0.5 -my-0.5"/>}
                    Submit
                </button>
            </div>
        </form>
    )
}
