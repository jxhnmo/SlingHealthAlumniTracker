import React from "react";
import { useState } from "react";
import { useRef } from "react";



export default function ProfileEdit() {
    const photoInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageURLs, setImageURLs] = useState<string>([]);
    const [selectedImage, setSelectedImage] = useState(null);
    let queuedImage = [];
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
                        <td>
                            <img src={imageURLs}></img>
                        </td>
                    </tr>
                </tbody>
            </table>
            <input ref={photoInputRef}
                type="file"
                className="absolute right-[9999px]"
                id="imageInput"
                accept="image/png, image/jpeg"
                disabled={isUploading}
                onChange={ (e) => {
                    console.log(e.target.files);
                    setSelectedImage(e.target.files[0]); // its not null trust me bro
                    queuedImage.pop(); // change queued image
                    queuedImage.push(e.target.files[0]);
                    console.log(queuedImage);
                    setImageURLs(URL.createObjectURL(e.target.files[0]));
                    console.log(imageURLs);
                }}></input>
            <button>Save Changes</button>
            <button>Cancel</button>
            {/* <script>
                let queuedImage = [],
                // savedForm = document.querySelector("#savedForm"),
                // queuedForm = document.querySelector("queuedForm");

                input = document.querySelector("#imageInput");


                
            </script> */}
        </div>
    );
};
