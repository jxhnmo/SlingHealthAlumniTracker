import { NextResponse, NextRequest } from "next/server";
import express from "express";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        const form = new IncomingForm({ uploadDir: "./uploads", keepExtensions: true });

        return new Promise((resolve, reject) => {
            form.parse(req as any, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    reject(NextResponse.json({ error: "File upload failed" }, { status: 500 }));
                }

                console.log("Uploaded file:", files.file); // Log file details
                resolve(NextResponse.json({ success: true }, { status: 200 }));
            });
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}