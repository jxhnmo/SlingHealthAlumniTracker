
import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config";
// import express from "express";
// import multer from "multer";
// import cors from "cors";
// import { fileURLToPath } from "url";
// import { existsSync, mkdirSync } from "fs";


export const config = {
    api: {
        bodyParser: false,
    },
};


export async function POST(request: NextRequest) {
    // const multer = require("multer");
    try {
        console.log("await form data");
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;
        const uploadData = await pinata.upload.public.file(file);
        const url = await pinata.gateways.public.convert(uploadData.cid);
        console.log("file" + file);
        // const storage = multer.diskStorage({
        //     destination: (request:any, file:any, cb:any) => {
        //         cb(null, "uploads/");
        //     },
        //     filename: (request:any, file:any, cb:any) => {
        //         cb(null, Date.now() + "test");
        //     }
        // });
        // const uploadData = //Upload data to wherever
        // const url = await ... // get image URL
        return NextResponse.json(url, { status: 200 });
    }
    catch(e) {
        console.log(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
