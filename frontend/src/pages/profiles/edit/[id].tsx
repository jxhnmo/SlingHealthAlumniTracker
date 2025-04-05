import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Team {
  id: number;
  team_name: string;
  team_area: string;
}

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
  const [team, setTeam] = useState<Team | null>(null);
  const [achievements, setAchievements] = useState([]);
  const [contactMethods, setContactMethods] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

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
          teamsUsersResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${id}`),
          fetch(`${API_BASE_URL}/achievements`),
          fetch(`${API_BASE_URL}/contact_methods`),
          fetch(`${API_BASE_URL}/teams`),
          fetch(`${API_BASE_URL}/teams_users`),
        ]);

        if (!userResponse.ok) throw new Error("User not found");
        if (!achievementsResponse.ok)
          throw new Error("Failed to fetch achievements");
        if (!contactMethodsResponse.ok)
          throw new Error("Failed to fetch contact methods");
        if (!teamResponse.ok) throw new Error("Failed to fetch team");
        if (!teamsUsersResponse.ok)
          throw new Error("Failed to fetch teams_users");

        const userData = await userResponse.json();
        const achievementsData = await achievementsResponse.json();
        const contactMethodsData = await contactMethodsResponse.json();
        const teamData: Team[] = await teamResponse.json();
        const teamsUsersData: { user_id: number; team_id: number }[] =
          await teamsUsersResponse.json();

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
        setTeam(
          teamData.filter((team) =>
            teamsUsersData.some(
              (tu) =>
                tu.user_id === Number(id) && tu.team_id === Number(team.id)
            )
          )[0]
        );
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

  const handleImageUpdate = () => {
    setUser((prevUser) => ({ ...prevUser, user_profile_url: imageURLs }));
  };

  const handleSave = async () => {
    if (!user.name || !user.email || !user.major || !user.graduation_year) {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 5000);
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
      console.log(signedURL + " URL set");
    }
    const updatedUser = {
      ...user,
      contact_info: "test",
      graduation_year: Number(user.graduation_year),
    };

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://alumni-tracker-sprint3-84062556e525.herokuapp.com";
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `${response.status} - ${response.statusText}: ${
            errorData.message || "No error message provided"
          }`
        );
      }

      router.push(`/profiles/${id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
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

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-10 right-10 bg-red-500 text-white p-4 rounded-md shadow-lg">
          Please fill in all required fields.
        </div>
      )}

      <div className="w-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
        <div className="w-full flex justify-center">
          <img
            src={user.user_profile_url}
            alt={user.name}
            className="h-[250px] w-[250px] rounded-[10px] object-cover"
          />
        </div>

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
          <Link href={`/profiles/edit/team/${id}`}>Edit Team</Link>
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

        <div className="flex justify-center mt-5">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
