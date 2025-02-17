import { NextResponse, NextRequest } from "next/server";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;
        // const uploadData = //Upload data to wherever
        // const url = await ... // get image URL
        return NextResponse.json("", { status: 200 });
    }
    catch(e) {
        console.log(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}