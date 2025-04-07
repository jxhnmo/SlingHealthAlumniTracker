import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  user_profile_url: string;
  biography?: string;
  isfaculty?: boolean;
  achievements?: Achievement[];
  team?: Team;
  contacts?: ContactMethod[];
  mentorship?: boolean;
}

interface Achievement {
  id: number;
  achievement_type: "Pitches" | "Grants" | "Accelerator" | "Other Achievements";
  name: string;
  description: string;
  checked: boolean;
  user_id: number;
}

interface ContactMethod {
  id: number;
  contact_type: string;
  info: string;
  user_id: number;
  link: boolean;
}

interface Team {
  id: number;
  team_name: string;
  team_area: string;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
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
  const [selectedImage, setSelectedImage] = React.useState(null);
  let queuedImage: File[] = []; // queue with only 1 element

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://alumni-tracker-sprint3-84062556e525.herokuapp.com";

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

      const apiUrl = `${API_BASE_URL}/users?email=${encodeURIComponent(
        storedEmail
      )}`;

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

  const handleSave = async () => {
    try {
      if (!user || !editedUser) {
        console.error("User or editedUser is null");
        return;
      }

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

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev!,
      [name]: value, // this works dynamically — as long as the name matches a valid field
    }));
  };

  const handleAchievementChange = async (
    index: number,
    field: keyof Achievement,
    value: string | boolean
  ) => {
    if (!editedUser) return;
    const updatedAchievements = [...(editedUser?.achievements || [])];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value,
    };
    setError("");
    try {
      const respone = await fetch(
        `${API_BASE_URL}/achievements/${updatedAchievements[index].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAchievements[index]),
        }
      );
      if (!respone.ok) throw new Error("Failed to update achievement");
      if (editedUser) {
        setEditedUser({
          ...editedUser,
          achievements: updatedAchievements,
        } as User);
      }
    } catch {
      setError("Error updating achievement");
    }
  };

  const addAchievement = async () => {
    if (editedUser && editedUser.id) {
      const newAchievement = {
        achievement_type: "Accelerator",
        name: "",
        description: "",
        checked: false,
        user_id: editedUser.id, // Ensure user_id is set appropriately
      };

      try {
        const response = await fetch(`${API_BASE_URL}/achievements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAchievement),
        });
        if (!response.ok) throw new Error("Failed to create achievement");
        const createdAchievement = await response.json();
        setAchievements([...achievements, createdAchievement]);
        setEditedUser({
          ...editedUser,
          achievements: [
            ...(editedUser.achievements || []),
            createdAchievement,
          ],
        });
      } catch {
        setError("Error creating achievement");
      }
    }
  };

  const handleAchievementDelete = async (index: number) => {
    if (!editedUser) return;
    const updatedAchievements = [...(editedUser.achievements || [])];
    setError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/achievements/${updatedAchievements[index].id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete achievement");
      updatedAchievements.splice(index, 1);
      if (editedUser) {
        setEditedUser({
          ...editedUser,
          achievements: updatedAchievements,
        } as User);
      }
    } catch {
      setError("Error deleting achievement");
    }
  };

  const fetchData = async () => {
    try {
      await fetchCurrentUserData();
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
      const achievementsData: Achievement[] = await achievementsResponse.json();
      const contactMethodsData: ContactMethod[] =
        await contactMethodsResponse.json();
      const teamData: Team[] = await teamResponse.json();
      const teamsUsersData: { user_id: number; team_id: number }[] =
        await teamsUsersResponse.json();

      setUser(userData);
      setEditedUser(userData);
      setAchievements(
        achievementsData.filter((ach) => ach.user_id === Number(id))
      );
      setContactMethods(
        contactMethodsData.filter((contact) => contact.user_id === Number(id))
      );
      setTeam(
        teamData.filter((team) =>
          teamsUsersData.some(
            (tu) => tu.user_id === Number(id) && tu.team_id === team.id
          )
        )[0]
      );

      setEditedUser({
        ...userData,
        achievements: achievementsData.filter(
          (ach) => ach.user_id === Number(id)
        ),
        contact: contactMethodsData.filter(
          (contact) => contact.user_id === Number(id)
        ),
        team: teamData.filter((team) =>
          teamsUsersData.some(
            (tu) => tu.user_id === Number(id) && tu.team_id === team.id
          )
        )[0],
      });

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

  const canEdit = currentUserId === user.id || isFaculty;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* Nav */}
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {[
          { name: "Home", path: "/" },
          { name: "Directory", path: "/userIndex" },
          { name: "Profile", path: "/profile" },
          { name: "Login", path: "/login" },
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
                    checked={editedUser?.mentorship || false}
                    onChange={(e) => {
                      editedUser &&
                        setEditedUser({
                          ...editedUser,
                          mentorship: e.target.checked,
                        });
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              ) : (
                editedUser?.isfaculty && (
                  <div className="px-4 py-2 bg-[--popcol] text-[--background] rounded-md shadow-lg">
                    Mentor
                  </div>
                )
              )}
            </div>
            {(currentUserId === user.id || isFaculty) && (
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
                  <div className="flex justify-center gap-4">
                    <input
                      type="text"
                      name="team_name"
                      value={editedUser?.team?.team_name || ""}
                      onChange={handleChange}
                      placeholder="Team Name"
                      className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none mt-2"
                    />
                    <input
                      type="text"
                      name="team_area"
                      value={editedUser?.team?.team_area || ""}
                      onChange={handleChange}
                      placeholder="Team Area"
                      className="text-xl font-bold text-center bg-[--dark2] text-white border-b-2 border-white outline-none mt-2"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[--popcol]">
                    {editedUser?.name || "No name provided"}
                  </h1>
                  <h2 className="text-xl font-bold text-white">
                    {editedUser?.major || "Unknown Major"} Class of{" "}
                    {editedUser?.graduation_year || "Unknown Year"}
                  </h2>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {`${editedUser?.team?.team_name} - ${editedUser?.team?.team_area}` ||
                      "No team area specified"}
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
                            if (
                              !achievementsByType[achievement.achievement_type]
                            ) {
                              achievementsByType[achievement.achievement_type] =
                                [];
                            }
                            achievementsByType[
                              achievement.achievement_type
                            ].push(achievement);
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
                    <>
                      {(editedUser?.contacts || []).map((contact, index) => (
                        <div
                          key={contact.id}
                          className="w-full flex gap-2 justify-between pb-2"
                        >
                          <input
                            className="text-xs w-[30%] bg-[--dark2] text-[--popcol] outline-none"
                            type="text"
                            value={contact.contact_type}
                            placeholder="Contact Type"
                          />
                          <label>
                            Link?
                            <input type="checkbox" checked={contact.link} />
                          </label>
                          <textarea
                            className="text-xs w-[30%] bg-[--dark2] text-[--popcol] outline-none"
                            value={contact.info}
                            placeholder="Contact Info"
                          />

                          <div className="flex justify-end">
                            <button className="text-[--white] font-bold text-xl p-1 hover:text-[--popcol] rounded-md transition">
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                           hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
                      >
                        Add
                      </button>
                    </>
                  ) : (
                    <>
                      {(editedUser?.contacts || []).map((contact, index) => (
                        <div key={index} className="mb-4">
                          <div key={contact.id} className="mb-2">
                            <p className="text-s">{contact.contact_type}</p>
                            {contact.link ? (
                              <a
                                className="text-xs"
                                href={contact.info}
                                target="_blank"
                              >
                                {contact.info}
                              </a>
                            ) : (
                              <p className="text-xs">{contact.info}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
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
