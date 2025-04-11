import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { pinata } from "@/utils/config";
import Link from "next/link";
import SimpleFileUpload from "react-simple-file-upload";
// const SimpleFileUpload: any = require("react-simple-file-upload");


// import { PinataSDK } from "pinata";
// const fs = require("fs");
// const { Blob } = require("buffer");
// require("dotenv").config();

// const pinata = new PinataSDK({
//   pinataJwt: `${process.env.PINATA_SECRET_JWT}`,
//   pinataGateway: `${process.env.PINATA_GATEWAY}`,
// });


interface Achievement {
  id: number;
  achievement_type: "Pitches" | "Grants" | "Accelerator" | "Other Achievements";
  name: string;
  description: string;
  // checked: boolean;
  user_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
  biography?: string;
  team_area?: string;
  isfaculty?: boolean;
  achievements?: Achievement[];
  contact?: string;
  availability?: boolean;
}

interface ContactMethod {
  id: number;
  contact_type: string;
  info: string;
  user_id: number;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFaculty, setIsFaculty] = useState<boolean | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User | null>(user);
  const [isUploading, setIsUploading] = React.useState(false); // user uploading image
  const [tooLarge, setTooLarge] = React.useState(false); // if image is too large
  const photoInputRef = React.useRef<HTMLInputElement | null>(null); // HTML element for the image input
  const [imageURLs, setImageURLs] = React.useState<string>(
    user?.user_profile_url || ""
  ); // user profile URL by default
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  let queuedImage: File[] = []; // queue with only 1 element

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";

  console.log(API_BASE_URL);

  const fetchCurrentUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        console.error("No user data found in localStorage");
        setCurrentUserId(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const storedEmail = parsedUser?.email;

      if (!storedEmail) {
        console.error("No email found in stored user data");
        setCurrentUserId(null);
        setIsFaculty(false);
        return;
      }

      const apiUrl = `${API_BASE_URL}/users?email=${encodeURIComponent(storedEmail)}`;
      const response = await fetch(apiUrl);
      const userData = await response.json();
      const user: User | undefined = (userData as User[]).find(
        (u: User) => u.email.toLowerCase() === storedEmail.toLowerCase()
      );

      if (!user) {
        console.error("User not found in API response");
        setCurrentUserId(null);
        setIsFaculty(false);
        return;
      }
      setCurrentUserId(user.id);
      setIsFaculty(user.isfaculty ?? false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setCurrentUserId(null);
      setIsFaculty(false);
    }
  };
  const handleFile = async (url) => {
    const urlStr = url[1]
    console.log("URL: " + urlStr);
  }
  const handleSave = async () => {
    //u guys need to set this up
    try {
      if (!user || !editedUser) {
        console.error("User or editedUser is null");
        return;
      }

      if (imageURLs) {
        user.user_profile_url = imageURLs;
      }

      // save image to pinata
      // if (selectedImage != null) {
      //   console.log("UPLOAD TO PINATA");
      //   const data = new FormData();
      //   data.set("file", selectedImage);
      //   // const data = await request.formData();
      //   // const file: File | null = data.get("file") as unknown as File;
      //   // const uploadData = await pinata.upload.public.file(selectedImage);
      //   // const url = await pinata.gateways.public.convert(uploadData.cid);
      //   const imageResponse = await fetch(`../api/`, {
      //     method: "POST",
      //     body: data,
      //   });
      //   const signedURL = await imageResponse.json();
      //   user.user_profile_url = signedURL;
      //   // setUser((prevUser) => ({ ...prevUser, ["user_profile_url"]: signedURL }));
      //   console.log(signedURL + " URL set");
      // }

      console.log("Edited User:", editedUser); // Debugging log

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  // const checkImageDims = (file: File) => {
  //   var reader = new FileReader();
  //   reader.onload = function(e) {

  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev!,
      [name]: value, // this works dynamically — as long as the name matches a valid field
    }));
  };

  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    value: string | boolean
  ) => {
    if (!editedUser) return;
    const updatedAchievements = [...((editedUser?.achievements) || [])];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value,
    };
    if (editedUser) {
      setEditedUser({ ...editedUser, achievements: updatedAchievements } as User);
    }
  };

  const addAchievement = () => {
    if (editedUser && editedUser.id) {
      setEditedUser({
        ...editedUser,
        achievements: [
          ...(editedUser.achievements || []),
          {
            id: Date.now(), // Ensure id is a number
            achievement_type: "Accelerator",
            name: "",
            description: "",
            // checked: false,
            user_id: editedUser.id,
          },
        ],
      });
    }
  };
  const handleAchievementDelete = (index: number) => {
    if (!editedUser) return;
    const updatedAchievements = [...(editedUser.achievements || [])];
    updatedAchievements.splice(index, 1);
    if (editedUser) {
      setEditedUser({ ...editedUser, achievements: updatedAchievements } as User);
    }
  };


  const fetchData = async () => {
    try {
      await fetchCurrentUserData();
      const [userResponse, achievementsResponse, contactMethodsResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/users/${id}`),
          fetch(`${API_BASE_URL}/achievements`),
          fetch(`${API_BASE_URL}/contact_methods`),
        ]);

      if (!userResponse.ok) throw new Error("User not found");
      if (!achievementsResponse.ok)
        throw new Error("Failed to fetch achievements");
      if (!contactMethodsResponse.ok)
        throw new Error("Failed to fetch contact methods");

      const userData = await userResponse.json();
      const achievementsData: Achievement[] = await achievementsResponse.json();
      const contactMethodsData: ContactMethod[] = await contactMethodsResponse.json();

      setUser(userData);
      setEditedUser(userData);
      setAchievements(
        achievementsData.filter((ach) => ach.user_id === Number(id))
      );
      setContactMethods(
        contactMethodsData.filter((contact) => contact.user_id === Number(id))
      );
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);



  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`${user?.name} has been deleted successfully.`);
        router.push("/userIndex");
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  const canEdit = (currentUserId === user.id || isFaculty);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* background img */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md"
        style={{ backgroundImage: "url('/background.jpg')" }}
      /> */}

      {/* nav */}
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {[
          { name: "Home", path: "/" },
          { name: "Index", path: "/userIndex" },
          { name: "Profile", path: "/profile" },
          { name: "Logout", path: "/logout" },
          // { name: "Edit", path: "/profileEdit" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="px-4 py-2 text-[--popcol] bg-[--dark2] rounded-md shadow-lg transition 
                       hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="w-screen h-screen px-[5%] flex flex-col justify-start items-center gap-[48px] p-10">
        <div className="mt-5 pt-[12px]">
          <h1 className="text-center text-5xl font-bold text-white">Profile</h1>
        </div>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%] flex flex-col overflow-y-auto overflow-x-hidden relative">
          <div className="w-full flex justify-between p-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isEditing && isFaculty ? ( //check for faculty as well! only allow show
                  <div className="flex items-center gap-2 text-white">
                    <label
                      htmlFor="faculty-checkbox"
                      className="cursor-pointer"
                    >
                      Faculty?
                    </label>
                    <input
                      id="faculty-checkbox"
                      type="checkbox"
                      checked={editedUser?.isfaculty || false}
                      onChange={(e) => {
                        if (editedUser) {
                          setEditedUser({
                            ...editedUser,
                            isfaculty: e.target.checked,
                          });
                        }
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                ) : (
                  editedUser?.isfaculty && (
                    <div className="px-4 py-2 bg-[--popcol] text-[--background] rounded-md shadow-lg">
                      Faculty
                    </div>
                  )
                )}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2 text-white">
                  <label htmlFor="faculty-checkbox" className="cursor-pointer">
                    Available for Mentorship?
                  </label>
                  <input
                    id="mentorship-checkbox"
                    type="checkbox"
                    checked={editedUser?.availability || false}
                    onChange={(e) => {
                      editedUser &&
                        setEditedUser({
                          ...editedUser,
                          availability: e.target.checked,
                        });
                    }
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              ) : (
                editedUser?.availability && (
                  <div className="px-4 py-2 bg-[--popcol] text-[--background] rounded-md shadow-lg">
                    Mentor
                  </div>
                )
              )}
            </div>

            {(currentUserId === user.id || isFaculty) && (
              <div className="flex gap-2">
                <button
                  onClick={isEditing ? handleSave : handleEdit}
                  className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                             hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
                {!isEditing && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                             hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
                  >
                    Delete Profile
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="w-full h-full flex flex-col items-center gap-5">
            <div className="w-full flex flex-col items-center justify-center mb-5">
              <div className="h-[250px] w-[250px]">
                {isEditing ? ( // editing for pfp
                  <div>
                    <img
                      src={imageURLs}
                      alt={user.name}
                      className="w-auto h-full rounded-[10px] object-cover aspect-square"
                    />

                    <p>
                      {tooLarge
                        ? "Image is too large! Must be under 5MB"
                        : "Images must be under 5MB"}
                    </p>

                    {/* <input */}
                    {/* // ref={photoInputRef} */}
                    {/* type="file" */}
                    {/* className="absolute right-[9999px]" */}
                    {/* id="imageInput" */}
                    {/* accept="image/png, image/jpeg" */}
                    {/* disabled={isUploading} */}
                    {/* onChange={(e) => { */}
                    {/* if (!e.target.files) return; */}
                    {/* // console.log(e.target.files); */}
                    {/* var fileOld = e.target.files[0]; */}
                    {/* if (fileOld == null) { */}
                    {/* return; */}
                    {/* } */}
                    {/* if (fileOld.size > 500000) { */}
                    {/* setTooLarge(true); */}
                    {/* return; */}
                    {/* } */}
                    {/* setTooLarge(false); */}
                    {/* var oldName = fileOld.name; */}
                    {/* var name = */}
                    {/* user.id + Date.now() + // get time for file name diff */}
                    {/* "." + */}
                    {/* oldName.substring( */}
                    {/* oldName.lastIndexOf(".") + 1, */}
                    {/* oldName.length */}
                    {/* ); /* || oldName */}
                    {/* const renamedFile = new File([fileOld], name); */}
                    {/* setSelectedImage(renamedFile); // its not null trust me bro */}
                    {/* console.log(selectedImage); */}
                    {/* queuedImage.pop(); // change queued image */}
                    {/* queuedImage.push(renamedFile); */}
                    {/* console.log(queuedImage); */}
                    {/* setImageURLs(URL.createObjectURL(renamedFile)); */}
                    {/* console.log(imageURLs); */}
                    {/* console.log(renamedFile); */}
                    {/* }} */}
                    {/* ></input> */}
                  </div>
                ) : (
                  // not editing for pfp
                  <img
                    src={user.user_profile_url}
                    alt={user.name}
                    className="w-auto h-full rounded-[10px] object-cover aspect-square"
                  />
                )}
              </div>

              {/* name, major, year, team */}
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editedUser?.name || ""}
                    onChange={handleChange}
                    placeholder="Name"
                    className="text-3xl font-bold text-center bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none"
                  />

                  <div className="flex justify-center gap-4">
                    <input
                      type="text"
                      name="major"
                      value={editedUser?.major || ""}
                      onChange={handleChange}
                      placeholder="Major"
                      className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
                    />
                    <input
                      type="text"
                      name="year"
                      value={editedUser?.graduation_year || ""}
                      onChange={handleChange}
                      placeholder="Year"
                      className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    name="team_area"
                    value={editedUser?.team_area || ""}
                    onChange={handleChange}
                    placeholder="Team Area"
                    className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none mt-2"
                  />
                  {/* <input
                    ref={photoInputRef}
                    id="uploader-preview-here-4404"
                    className="simple-file-upload"
                    type="hidden"
                    data-template="tailwind"
                    data-maxFileSize="5"
                    data-accepted="image/*"
                    onChange={(e) => {
                      const url = e.target.getAttribute("data-accepted") as string;
                      console.log(url);
                      setImageURLs(url);
                    }}></input> */}
                  <SimpleFileUpload
                    apiKey={"ee5fd30cbfd7939d9e52b522e52a6775"}
                    accept="image/png, image/jpeg"
                    onSuccess={handleFile} />
                  <button
                    disabled={isUploading}
                    className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none mt-2"
                    onClick={() => {
                      console.log(process.env.SIMPLE_FILE_UPLOAD_API)
                      // photoInputRef.current?.click();
                    }}
                  >
                    {isUploading ? "Uploading..." : "Upload Profile Picture"}
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[--popcol]">
                    {editedUser?.name || "No name provided"}
                  </h1>
                  <h2 className="text-xl font-bold text-white">
                    {editedUser?.major || "Unknown Major"} Class of {editedUser?.graduation_year || "Unknown Year"}
                  </h2>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {editedUser?.team_area || "No team area specified"}
                  </h3>
                </>
              )}
            </div>

            {/* bio, achievements, contact */}
            <div className="w-full h-[100%] bg-[] flex flex-col justify-between gap-5 mb-10 pb-5 overflow-y-auto md:flex-row min-h-[200px]">
              <div className="w-full md:w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white flex flex-col">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Bio
                </h3>

                <div className="overflow-y-auto h-[90%]">
                  {isEditing ? (
                    <textarea
                      name="biography"
                      value={editedUser?.biography || ""}
                      onChange={handleChange}
                      placeholder="Biography"
                      className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                    />
                  ) : (
                    <p>{editedUser?.biography}</p>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white flex flex-col">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Achievements
                </h3>
                <div className="overflow-y-auto h-[90%]">
                  {isEditing ? (
                    <>
                      {(editedUser?.achievements || []).map(
                        (achievement, index) => (
                          <div
                            key={achievement.id}
                            className="w-full flex gap-2 justify-between pb-2"
                          >
                            <select
                              className=""
                              value={achievement.achievement_type}
                              onChange={(e) =>
                                handleAchievementChange(
                                  index,
                                  "achievement_type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Pitches">Pitches</option>
                              <option value="Grants">Grants</option>
                              <option value="Accelerator">Accelerator</option>
                              <option value="Other Achievements">
                                Other Achievements
                              </option>
                            </select>

                            <input
                              className="text-xs w-[30%] bg-[--dark2] text-[--popcol] outline-none"
                              type="text"
                              value={achievement.name}
                              placeholder="Name"
                              onChange={(e) =>
                                handleAchievementChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />

                            <textarea
                              className="text-xs w-[30%] bg-[--dark2] text-[--popcol] outline-none"
                              value={achievement.description}
                              placeholder="Description"
                              onChange={(e) =>
                                handleAchievementChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />

                            <div className="flex justify-end">
                              <button
                                className="text-[--white] font-bold text-xl p-1 hover:text-[--popcol] rounded-md transition"
                                onClick={() => handleAchievementDelete(index)}
                              >
                                X
                              </button>
                            </div>
                          </div>
                        )
                      )}
                      <button
                        className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                           hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
                        onClick={addAchievement}
                      >
                        Add
                      </button>
                    </>
                  ) : (
                    <>
                      {(() => {
                        const achievementsByType: Record<
                          string,
                          Achievement[]
                        > = {};

                        (editedUser?.achievements ?? []).forEach(
                          (achievement) => {
                            if (!achievementsByType[achievement.achievement_type]) {
                              achievementsByType[achievement.achievement_type] = [];
                            }
                            achievementsByType[achievement.achievement_type].push(
                              achievement
                            );
                          }
                        );

                        return Object.entries(achievementsByType).map(
                          ([type, achievements]) => (
                            <div key={type} className="mb-4">
                              <h4 className="font-bold text-[--popcol]">
                                {type}:
                              </h4>
                              {achievements.map((achievement) => (
                                <div key={achievement.id} className="mb-2">
                                  <p className="text-s">{achievement.name}</p>
                                  <p className="text-xs">
                                    {achievement.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/3 h-[full] bg-[--grey1] rounded-xl p-5 text-white flex flex-col">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Contact Information
                </h3>

                <div className="overflow-y-auto h-[90%]">
                  {isEditing ? (
                    <textarea
                      name="contact"
                      value={editedUser?.contact || ""}
                      onChange={handleChange}
                      placeholder="Contact Information"
                      className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                    />
                  ) : (
                    <p>{editedUser?.contact || "No contact information provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-1/3">
            <h2 className="text-center text-xl font-bold mb-4">
              Are you sure you want to delete this profile?
            </h2>
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;