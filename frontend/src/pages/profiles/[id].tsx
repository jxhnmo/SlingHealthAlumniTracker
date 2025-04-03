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
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  user_id: number;
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

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com";

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

  const canEdit = currentUserId === user.id || isFaculty;

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* Nav */}
      <nav className="absolute top-5 right-10 flex gap-3 z-20">
        {[
          { name: "Home", path: "/" },
          { name: "Directory", path: "/userIndex" },
          { name: "Profile", path: "/profile" },
          { name: "Logout", path: "/logout" },
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
        <h1 className="text-center text-5xl font-bold text-white">Profile</h1>

        <div className="w-[80%] h-[80%] bg-[--dark2] rounded-2xl shadow-xl p-[2%]">
          <div className="w-full flex justify-end p-2">
            {canEdit && (
              <Link
                href={`/profiles/edit/${id}`}
                className="px-4 py-2 bg-[--background] text-[--popcol] rounded-md shadow-lg transition 
                           hover:bg-[--popcol] hover:text-[--dark2] hover:scale-105"
              >
                Edit Profile
              </Link>
            )}
            {canEdit && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow-lg transition 
                           hover:bg-red-600 hover:scale-105 ml-2"
              >
                Delete Profile
              </button>
            )}
          </div>

          <div className="w-full h-full flex flex-col items-center gap-5">
            <img
              src={user.user_profile_url}
              alt={user.name}
              className="h-[250px] w-[250px] rounded-[10px] object-cover"
            />
            <h1 className="text-3xl font-bold text-[--popcol]">{user.name}</h1>
            <h2 className="text-xl font-bold text-white">
              {user.major} Class of {user.graduation_year}
            </h2>

            <div className="w-full flex justify-between gap-5 mt-5">
              {/* Bio Section */}
              <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Bio
                </h3>
                <p>{user.biography || "No bio available."}</p>
              </div>

              {/* Achievements Section */}
              <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Achievements
                </h3>
                {achievements.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {achievements.map((ach) => (
                      <li key={ach.id}>
                        <strong>{ach.name}</strong> - {ach.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No achievements listed.</p>
                )}
              </div>

              {/* Contact Section */}
              <div className="w-1/3 bg-[--grey1] rounded-xl p-5 text-white">
                <h3 className="text-lg font-bold mb-3 text-center text-[--popcol]">
                  Contact
                </h3>
                {contactMethods.length > 0 ? (
                  <ul>
                    {contactMethods.map((contact) => (
                      <li key={contact.id}>
                        <strong>{contact.contact_type}:</strong> {contact.info}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No contact information provided.</p>
                )}
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
