import { createServerComponentClient } from '@shaple/auth-helpers-nextjs';
import {cookies} from "next/headers";

export default async function Page() {
    const shaple = createServerComponentClient({
        cookies: () => cookies(),
    },{
        shapleUrl: process.env.SHAPLE_URL,
        shapleKey: process.env.SHAPLE_KEY,
    });

    const {data:{session}, error} = await shaple.auth.getSession();

    return <div>
        {JSON.stringify(session!.user)}
    </div>;
}