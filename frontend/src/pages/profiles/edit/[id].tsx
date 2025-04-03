import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const EditProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    major: "",
    graduation_year: "",
    user_profile_url: "",
    biography: "",
    contact_info: "",
  });
  const [team, setTeam] = useState({
    id: "",
    name: "",
    area: "",
  });
  const [achievements, setAchievements] = useState([]);
  const [contactMethods, setContactMethods] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isUploading, setIsUploading] = React.useState(false); // user uploading image
  const [tooLarge, setTooLarge] = React.useState(false); // if image is too large
  const photoInputRef = React.useRef<HTMLInputElement | null>(null); // HTML element for the image input
  const [imageURLs, setImageURLs] = React.useState<string>(
    user.user_profile_url
  ); // user profile URL by default
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imageChanged, setImageChanged] = React.useState(false);
  let queuedImage: File[] = []; // queue with only 1 element

  useEffect(() => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";
    // useEffect(() => {
    //     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    if (!id) return;

    const fetchData = async () => {
      try {
        const [
          userResponse,
          achievementsResponse,
          contactMethodsResponse,
          teamResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${id}`),
          fetch(`${API_BASE_URL}/achievements`),
          fetch(`${API_BASE_URL}/contact_methods`),
          fetch(`${API_BASE_URL}/team`),
        ]);

        if (!userResponse.ok) throw new Error("User not found");
        if (!achievementsResponse.ok)
          throw new Error("Failed to fetch achievements");
        if (!contactMethodsResponse.ok)
          throw new Error("Failed to fetch contact methods");
        if (!teamResponse.ok) throw new Error("Failed to fetch team");

        const userData = await userResponse.json();
        const achievementsData = await achievementsResponse.json();
        const contactMethodsData = await contactMethodsResponse.json();
        const teamData = await teamResponse.json();

        setUser(userData);
        setAchievements(
          achievementsData.filter(
            (ach: { user_id: number }) => ach.user_id === Number(id)
          )
        );
        setContactMethods(
          contactMethodsData.filter(
            (contact: { user_id: number }) => contact.user_id === Number(id)
          )
        );
        setTeam(teamData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleTeamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTeam((prevTeam) => ({ ...prevTeam, [name]: value }));
  };

  const handleImageUpdate = () => {
    setUser((prevUser) => ({ ...prevUser, user_profile_url: imageURLs }));
  };

  const handleSave = async () => {
    if (!user.name || !user.email || !user.major || !user.graduation_year) {
      setError("Please fill in all required fields.");
      return;
    }

    if ((team.name && !team.area) || (!team.name && team.area)) {
      setError("Please fill in both fields for team.");
      return;
    }

    // save image to pinata
    if (selectedImage != null) {
      const data = new FormData();
      data.set("file", selectedImage);
      const imageResponse = await fetch("api/files", {
        method: "POST",
        body: data,
      });
      const signedURL = await imageResponse.json();
      setUser((prevUser) => ({ ...prevUser, ["user_profile_url"]: signedURL }));
    }

    const updatedUser = {
      ...user,
      contact_info: "test",
      graduation_year: Number(user.graduation_year),
    };

    const updatedTeam = {
      ...team,
    };

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";
    console.log("User data being sent:", JSON.stringify(updatedUser));
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken || "",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(updatedUser),
      });
      const errorData = await response.json();
      console.log(response.status);
      console.log(response.statusText);
      console.log(errorData.message);
      if (!response.ok)
        throw new Error(
          `${response.status} - ${response.statusText}: ${
            errorData.message || "No error message provided"
          }`
        );

      const teamResponse = await fetch(`${API_BASE_URL}/team/${team.id}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTeam),
      });
      const teamErrorData = await teamResponse.json();
      console.log(teamResponse.status);
      console.log(teamResponse.statusText);
      console.log(teamErrorData.message);
      if (!teamResponse.ok) {
        throw new Error(
          `${teamResponse.status} - ${teamResponse.statusText}: ${
            teamErrorData.message || "No error message provided"
          }`
        );
      }

      router.push(`/profiles/${id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to update profile");
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  /////////////////////////////
  // const express = require("express");
  // const multer = require("multer");
  // const fs = require("fs");
  // const path = require("path");
  // const util = require("util");
  // const unlinkFile = util.promisify(fs.unlink);

  // const port = 3000;

  // const app = express();

  // app.use(express.json());
  // app.use(express.urlencoded({extended: false}));

  // // const storage = multer.diskStorage({
  // //     destination: function(req, file, cb) {
  // //         cb(null, "./public/profilePix/")
  // //     },
  // //     filename: function(req, file, cb) {
  // //         cb(null, "filename");
  // //     }
  // // });

  // const upload = multer({
  //     dest: "./public/profilePix/"
  // });

  // app.post('/upload', upload.single('myfile'), (req:any, res:any) => {
  //     const fileName = req.file.filename;
  //     const fileSize = req.file.size;

  //     res.send(`File uploaded successfully! ` + `Name: ${fileName}, Size: ${fileSize}`);
  // });

  /////////////////////////////

  return (
    <div className="w-screen h-screen px-[5%] flex flex-col justify-start items-center gap-[48px] p-10">
      <h1 className="text-center text-5xl font-bold text-white">
        Edit Profile
      </h1>
      <div className="w-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
        <div className="w-full flex justify-center">
          <img
            src={imageURLs}
            alt={user.name}
            className="h-[250px] w-[250px] rounded-[10px] object-cover"
          />
        </div>

        {/* 
                <button
                    disabled={isUploading}
                    onClick={() => {
                      photoInputRef.current?.click();
                    }}
                >{isUploading ? "Uploading..." : "Upload"}
                </button>
                <p>{tooLarge ? "Image is too large! Must be under 5MB" : "Images must be under 5MB"}</p>
                <input ref={photoInputRef}
                    type="file"
                    className="absolute right-[9999px]"
                    id="imageInput"
                    accept="image/png, image/jpeg"
                    disabled={isUploading}

                    onChange={ async (e) => {
                        // console.log(e.target.files);
                        try {
                            if(!e.target.files) return;
                            var fileOld = e.target.files[0];
                            if(fileOld.size > 500000) {
                                setTooLarge(true);
                                return;
                            }
                            setTooLarge(false);

                            setIsUploading(true);

                            var oldName = fileOld.name;
                            var name = user.id + "." + oldName.substring(oldName.lastIndexOf('.')+1, oldName.length);
                            const renamedFile = new File([fileOld], name);

                            setSelectedImage(renamedFile); // its not null trust me bro

                            queuedImage.pop(); // change queued image
                            queuedImage.push(renamedFile);
                            setImageURLs(URL.createObjectURL(renamedFile));
                            handleImageUpdate(); // update into user object
                            console.log(imageURLs);
                            console.log(renamedFile);
                            setImageChanged(true);
                            setIsUploading(false);
                        }
                        catch(e) {
                            console.error(e);
                        }
                    }}>
                </input>
                */}

        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Name"
          className="text-3xl font-bold text-center bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none block mx-auto"
        />

        <div className="flex justify-center gap-4">
          <input
            type="text"
            name="major"
            value={user.major}
            onChange={handleChange}
            placeholder="Major"
            className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
          />
          <input
            type="number"
            name="graduation_year"
            value={user.graduation_year}
            onChange={handleChange}
            placeholder="Year"
            className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
          />
        </div>

        <div className="flex justify-center gap-4">
          <input
            type="text"
            name="team_name"
            value={team.name}
            onChange={handleTeamChange}
            placeholder="Team Name"
            className="text-3xl font-bold text-center bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none block mx-auto"
          />
          <input
            type="text"
            name="team_area"
            value={team.area}
            onChange={handleTeamChange}
            placeholder="Team Area"
            className="text-3xl font-bold text-center bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none block mx-auto"
          />
        </div>

        <div className="w-full flex justify-between gap-5 mt-5">
          <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
            <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
              Bio
            </h3>
            <textarea
              name="biography"
              value={user.biography}
              onChange={handleChange}
              className="w-full h-[100px] bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none p-2"
            />
          </div>
          <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
            <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
              Achievements
            </h3>
            <Link href={`/profiles/edit/achievement/${id}`}>
              Edit Achievements
            </Link>
          </div>
          <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
            <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
              Contact
            </h3>
            <Link href={`/profiles/edit/contact/${id}`}>Edit Contacts</Link>
          </div>
        </div>

        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditProfile;
