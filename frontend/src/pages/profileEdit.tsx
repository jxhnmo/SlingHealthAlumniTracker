import React from "react";
import { useState } from "react";
import { useRef } from "react";



export default function ProfileEdit() {
    const photoInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    return(
        <div>
            <h1>Edit your Profile</h1>
            <table>
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <td>does this show</td>
                    </tr>
                    <tr>
                        <th>Last Name</th>
                        <td>whee</td>
                    </tr>
                    <tr>
                        <th>Grad date</th>
                        <td>whee</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>whee</td>
                    </tr>
                    <tr>
                        <th>Achievements</th>
                        <td>whee</td>
                    </tr>
                    <tr>
                        <th>Projects</th>
                        <td>whee</td>
                    </tr>
                    <tr>
                        <th>Profile Picture</th>
                        <td><button
                            disabled={isUploading}
                            onClick={() => {
                                photoInputRef.current?.click();
                            }}>{isUploading ? "Uploading..." : "Upload"}</button>
                        </td>
                        <td>{imageURLs.map((url) => (
                            <img src={url} alt="uploaded image"></img>
                        ))}</td>
                    </tr>
                </tbody>
            </table>
            <input ref={photoInputRef}
                type="file"
                className="absolute right-[9999px]"
                accept="image/png, image/jpeg"
                disabled={isUploading}
                onChange={
                    async (e) => {
                        const file = e.target.files?.[0] as File;
                        console.log(file);
                        setIsUploading(true);
                        console.log("FormData");
                        const data = new FormData();
                        data.set("file", file);
                        console.log('Current directory: ' + process.cwd());
                        const response = await fetch("/api/files/route.ts", {
                            method: "POST", body: data
                        });
                        const signedURL = await response.json();
                        console.log(signedURL);
                        setImageURLs((prev) => [...prev, signedURL]);
                        setIsUploading(false);
                    }
                }></input>
            <button>Save Changes</button>
            <button>Cancel</button>
        </div>
    );
};
