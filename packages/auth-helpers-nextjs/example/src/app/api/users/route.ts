import {createServerComponentClient} from "@shaple/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {NextRequest} from "next/server.js";

export async function POST(req: NextRequest) {
    const shaple = createServerComponentClient({
        cookies: () => cookies(),
    }, {
        shapleUrl: process.env.SHAPLE_URL,
        shapleKey: process.env.SHAPLE_KEY,
    });

    const {email, password} = await req.json();

    const {data: {user}, error} = await shaple.auth.admin.createUser({
        email: email,
        password: password,
        role: "authenticated",
        email_confirm: true,
    });

    if (error) {
        return NextResponse.json({
            error,
        });
    }

    return NextResponse.json({
        user,
    });
}

export async function GET(req: NextRequest) {
    const shaple = createServerComponentClient({
        cookies: () => cookies(),
    }, {
        shapleUrl: process.env.SHAPLE_URL,
        shapleKey: process.env.SHAPLE_KEY,
    });

    const {data: {session}, error} = await shaple.auth.getSession();

    if (!session) {
        return NextResponse.json({
            error,
        });
    }

    return NextResponse.json({
        user: session.user,
    });
}