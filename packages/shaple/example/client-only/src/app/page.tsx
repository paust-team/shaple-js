'use client';
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Shaple} from "@/components/Shaple";

export default function Home() {
  const shaple = useContext(Shaple)!;
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    id: "",
  })

  useEffect(() => {
    async function doIt() {
      const {data: {session}, error} = await shaple.auth.getSession();
      if (error) {
        alert("error: " + error);
      }

      if (!session) {
        await router.replace("/login");
      } else {
        setUser({
          email: session.user.email!,
          id: session.user.id,
        });
      }
    }
    doIt();
  }, []);

  const signOut = async () => {
      await shaple.auth.signOut();
      await router.replace("/login");
  };

  return (
      <div className="flex flex-col justify-center h-full max-w-md mx-auto text-white gap-y-4">
        <div className="flex flex-row gap-x-3">
          <div className="font-bold">Email:</div>
          <div>{user.email}</div>
        </div>
        <div className="flex flex-row gap-x-3">
          <div className="font-bold">ID:</div>
          <div>{user.id}</div>
        </div>
        <div className="flex flex-row">
          {user.id != "" && <button className="gap-x-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" onClick={signOut}>Sign Out</button>}
        </div>
      </div>
  )
}
