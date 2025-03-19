
// import { NextResponse, NextRequest } from "next/server";
// import express from "express";
// import multer from "multer";
// import cors from "cors";
// import { fileURLToPath } from "url";
// import { existsSync, mkdirSync } from "fs";


// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };


// export async function POST(request: NextRequest) {
//     const multer = require("multer");
//     try {
//         console.log("await form data");
//         const data = await request.formData();
//         const file: File | null = data.get("file") as unknown as File;
//         console.log("file" + file);
//         const storage = multer.diskStorage({
//             destination: (request, file, cb) => {
//                 cb(null, "uploads/");
//             },
//             filename: (request, file, cb) => {
//                 cb(null, Date.now() + "test");
//             }
//         });
//         console.log("storage");
//         // const uploadData = //Upload data to wherever
//         // const url = await ... // get image URL
//         return NextResponse.json("", { status: 200 });
//     }
//     catch(e) {
//         console.log(e);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
