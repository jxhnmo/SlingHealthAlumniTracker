import React from "react";
import Link from "next/link";

interface Achievement {
  id: string;
  type: "Pitches" | "Grants" | "Accelerator" | "Other Achievements";
  name: string;
  description: string;
  checked: boolean;
}

interface User {
  id: string; // unique user id
  user_profile_url: string;
  name: string;
  year: string;
  major: string;
  team_area?: string;
  biography?: string;
  achievements?: Achievement[];
  contact?: string;
  faculty?: boolean;
  mentorship?: boolean;
}

const Profile: React.FC = () => {
  const loggedInId = "jomgos"; // me

  const user: User = {
    id: "jomgos", // profile owner's id
    user_profile_url: "/profilePix/default.jpg",
    name: "Sabrina Carpet",
    year: "2024",
    major: "Computer Science",
    team_area: "fire type",
    biography: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    achievements: [],
    contact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    faculty: true,
    mentorship: true,
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User>(user);

  const [isUploading, setIsUploading] = React.useState(false); // user uploading image
  const [tooLarge, setTooLarge] = React.useState(false); // if image is too large
  const photoInputRef = React.useRef<HTMLInputElement | null>(null); // HTML element for the image input
  const [imageURLs, setImageURLs] = React.useState<string>(
    user.user_profile_url
  ); // user profile URL by default
  const [selectedImage, setSelectedImage] = React.useState(null);
  let queuedImage: File[] = []; // queue with only 1 element

  const handleEdit = () => {
    setIsEditing(true);
  };

  // const checkImageDims = (file: File) => {
  //   var reader = new FileReader();
  //   reader.onload = function(e) {

  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    value: string | boolean
  ) => {
    const updatedAchievements = [...(editedUser.achievements || [])];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value,
    };
    setEditedUser({ ...editedUser, achievements: updatedAchievements });
  };

  const addAchievement = () => {
    setEditedUser({
      ...editedUser,
      achievements: [
        ...(editedUser.achievements || []),
        {
          id: Date.now().toString(),
          type: "Accelerator",
          name: "",
          description: "",
          checked: false,
        },
      ],
    });
  };

  const handleDelete = (index: number) => {
    const updatedAchievements = [...(editedUser.achievements || [])];
    updatedAchievements.splice(index, 1);
    setEditedUser({ ...editedUser, achievements: updatedAchievements });
  };

  const handleSave = async () => {
    // u guys set this up
    setEditedUser(editedUser);
    setIsEditing(false);
    try {
      // TODO: save image
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
                {isEditing ? ( //check for faculty as well! only allow show
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
                      checked={editedUser.faculty || false}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          faculty: e.target.checked,
                        })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                ) : (
                  editedUser.faculty && (
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
                    checked={editedUser.mentorship || false}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        mentorship: e.target.checked,
                      })
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              ) : (
                editedUser.faculty && (
                  <div className="px-4 py-2 bg-[--popcol] text-[--background] rounded-md shadow-lg">
                    Mentor
                  </div>
                )
              )}
            </div>

            {loggedInId === user.id && (
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                           hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
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
                    <button
                      disabled={isUploading}
                      onClick={() => {
                        photoInputRef.current?.click();
                      }}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                    <p>
                      {tooLarge
                        ? "Image is too large! Must be under 5MB"
                        : "Images must be under 5MB"}
                    </p>
                    <input
                      ref={photoInputRef}
                      type="file"
                      className="absolute right-[9999px]"
                      id="imageInput"
                      accept="image/png, image/jpeg"
                      disabled={isUploading}
                      onChange={(e) => {
                        if (!e.target.files) return;
                        // console.log(e.target.files);
                        var fileOld = e.target.files[0];
                        if (fileOld == null) {
                          return;
                        }
                        if (fileOld.size > 500000) {
                          setTooLarge(true);
                          return;
                        }
                        setTooLarge(false);
                        var oldName = fileOld.name;
                        var name =
                          user.id +
                          "." +
                          oldName.substring(
                            oldName.lastIndexOf(".") + 1,
                            oldName.length
                          ); /* || oldName*/ // CHANGE TO CORRECT TYPE
                        const renamedFile = new File([fileOld], name);
                        // setSelectedImage(renamedFile); // its not null trust me bro
                        queuedImage.pop(); // change queued image
                        queuedImage.push(renamedFile);
                        console.log(queuedImage);
                        setImageURLs(URL.createObjectURL(renamedFile));
                        console.log(imageURLs);
                        console.log(renamedFile);
                      }}
                    ></input>
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
                    value={editedUser.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="text-3xl font-bold text-center bg-[--dark2] text-[--popcol] border-b-2 border-[--popcol] outline-none"
                  />

                  <div className="flex justify-center gap-4">
                    <input
                      type="text"
                      name="major"
                      value={editedUser.major}
                      onChange={handleChange}
                      placeholder="Major"
                      className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
                    />
                    <input
                      type="text"
                      name="year"
                      value={editedUser.year}
                      onChange={handleChange}
                      placeholder="Year"
                      className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    name="team_area"
                    value={editedUser.team_area || ""}
                    onChange={handleChange}
                    placeholder="Team Area"
                    className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none mt-2"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[--popcol]">
                    {editedUser.name}
                  </h1>
                  <h2 className="text-xl font-bold text-white">
                    {editedUser.major} Class of {editedUser.year}
                  </h2>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {editedUser.team_area || "No team area specified"}
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
                      value={editedUser.biography}
                      onChange={handleChange}
                      placeholder="Biography"
                      className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                    />
                  ) : (
                    <p>{editedUser.biography}</p>
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
                      {(editedUser.achievements || []).map(
                        (achievement, index) => (
                          <div
                            key={achievement.id}
                            className="w-full flex gap-2 justify-between pb-2"
                          >
                            <select
                              className=""
                              value={achievement.type}
                              onChange={(e) =>
                                handleAchievementChange(
                                  index,
                                  "type",
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
                                onClick={() => handleDelete(index)}
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

                        (editedUser.achievements ?? []).forEach(
                          (achievement) => {
                            if (!achievementsByType[achievement.type]) {
                              achievementsByType[achievement.type] = [];
                            }
                            achievementsByType[achievement.type].push(
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
                      value={editedUser.contact}
                      onChange={handleChange}
                      placeholder="Contact Information"
                      className="w-full h-[90%] bg-[--dark2] text-[--popcol] outline-none p-2"
                    />
                  ) : (
                    <p>{editedUser.contact}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
